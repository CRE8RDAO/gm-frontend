import { ethers, BigNumber } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20ABI } from "../abi/IERC20.json";
import { abi as BrickStakingABI } from "../abi/rinkeby/OlympusStaking.json";
import { abi as OlympusStakingABI } from "../abi/OlympusStakingv2.json";
import { abi as StakingHelperABI } from "../abi/StakingHelper.json";
import { clearPendingTxn, fetchPendingTxns, getStakingTypeText } from "./PendingTxnsSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances } from "./AccountSlice";
import { error, info } from "../slices/MessagesSlice";
import { IActionValueAsyncThunk, IChangeApprovalAsyncThunk, IJsonRPCError } from "./interfaces";
import { segmentUA } from "../helpers/userAnalyticHelpers";
import { IERC20, OlympusStaking, OlympusStakingv2, StakingHelper } from "src/typechain";
import ReactGA from "react-ga";

interface IUAData {
  address: string;
  value: string;
  approved: boolean;
  txHash: string | null;
  type: string | null;
}

interface IProtocolMetrics {
  timestamp?: string;
  brickCirculatingSupply: string;
  totalSupply: string;
  brickPrice: string;
  marketCap: string;
  totalValueLocked: string;
  nextEpochRebase?: string;
  nextDistributedBrick?: string;
  treasuryRiskFreeValue: string;
  treasuryMarketValue: string;
  treasuryFtmRiskFreeValue: string;
  treasuryFraxMarketValue: string;
  treasuryFtmMarketValue: string;
  treasuryFraxRiskFreeValue: string;
  treasuryWETHRiskFreeValue: string;
  treasuryWETHMarketValue: string;
}

function alreadyApprovedToken(token: string, stakeAllowance: BigNumber, unstakeAllowance: BigNumber) {
  // set defaults
  let bigZero = BigNumber.from("0");
  let applicableAllowance = bigZero;

  // determine which allowance to check
  if (token === "brick") {
    applicableAllowance = stakeAllowance;
  } else if (token === "sbrick") {
    applicableAllowance = unstakeAllowance;
  }

  // check if allowance exists
  if (applicableAllowance.gt(bigZero)) return true;

  return false;
}

export const changeApproval = createAsyncThunk(
  "stake/changeApproval",
  async ({ token, provider, address, networkID }: IChangeApprovalAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const brickContract = new ethers.Contract(
      addresses[networkID].BRICK_ADDRESS as string,
      ierc20ABI,
      signer,
    ) as IERC20;
    const sbrickContract = new ethers.Contract(
      addresses[networkID].SBRICK_ADDRESS as string,
      ierc20ABI,
      signer,
    ) as IERC20;
    let approveTx;
    let stakeAllowance = await brickContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS);
    let unstakeAllowance = await sbrickContract.allowance(address, addresses[networkID].STAKING_ADDRESS);

    // return early if approval has already happened
    if (alreadyApprovedToken(token, stakeAllowance, unstakeAllowance)) {
      dispatch(info("Approval completed."));
      return dispatch(
        fetchAccountSuccess({
          staking: {
            brickStake: +stakeAllowance,
            brickUnstake: +unstakeAllowance,
          },
        }),
      );
    }

    try {
      if (token === "brick") {
        // won't run if stakeAllowance > 0
        approveTx = await brickContract.approve(
          addresses[networkID].STAKING_HELPER_ADDRESS,
          ethers.utils.parseUnits("1000000000", "gwei").toString(),
        );
      } else if (token === "sbrick") {
        approveTx = await sbrickContract.approve(
          addresses[networkID].STAKING_ADDRESS,
          ethers.utils.parseUnits("1000000000", "gwei").toString(),
        );
      }

      const text = "Approve " + (token === "brick" ? "Staking" : "Unstaking");
      const pendingTxnType = token === "brick" ? "approve_staking" : "approve_unstaking";
      if (approveTx) {
        dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));

        await approveTx.wait();
      }
    } catch (e: unknown) {
      dispatch(error((e as IJsonRPCError).message));
      return;
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }

    // go get fresh allowances
    stakeAllowance = await brickContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS);
    unstakeAllowance = await sbrickContract.allowance(address, addresses[networkID].STAKING_ADDRESS);

    return dispatch(
      fetchAccountSuccess({
        staking: {
          brickStake: +stakeAllowance,
          brickUnstake: +unstakeAllowance,
        },
      }),
    );
  },
);

export const changeStake = createAsyncThunk(
  "stake/changeStake",
  async ({ action, value, provider, address, networkID }: IActionValueAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const staking = new ethers.Contract(
      addresses[networkID].STAKING_ADDRESS as string,
      OlympusStakingABI,
      signer,
    ) as OlympusStakingv2;
    const stakingHelper = new ethers.Contract(
      addresses[networkID].STAKING_HELPER_ADDRESS as string,
      StakingHelperABI,
      signer,
    ) as StakingHelper;

    let stakeTx;
    let uaData: IUAData = {
      address: address,
      value: value,
      approved: true,
      txHash: null,
      type: null,
    };
    try {
      if (action === "stake") {
        uaData.type = "stake";
        stakeTx = await stakingHelper.stake(ethers.utils.parseUnits(value, "gwei"));
      } else {
        uaData.type = "unstake";
        stakeTx = await staking.unstake(ethers.utils.parseUnits(value, "gwei"), true);
      }
      const pendingTxnType = action === "stake" ? "staking" : "unstaking";
      uaData.txHash = stakeTx.hash;
      dispatch(fetchPendingTxns({ txnHash: stakeTx.hash, text: getStakingTypeText(action), type: pendingTxnType }));
      await stakeTx.wait();
    } catch (e: unknown) {
      uaData.approved = false;
      const rpcError = e as IJsonRPCError;
      if (rpcError.code === -32603 && rpcError.message.indexOf("ds-math-sub-underflow") >= 0) {
        dispatch(
          error("You may be trying to stake more than your balance! Error code: 32603. Message: ds-math-sub-underflow"),
        );
      } else {
        dispatch(error(rpcError.message));
      }
      return;
    } finally {
      if (stakeTx) {
        segmentUA(uaData);
        ReactGA.event({
          category: "Staking",
          action: uaData.type ?? "unknown",
          value: parseFloat(uaData.value),
          dimension1: uaData.txHash ?? "unknown",
          dimension2: uaData.address,
        });
        dispatch(clearPendingTxn(stakeTx.hash));
      }
    }
    dispatch(getBalances({ address, networkID, provider }));
  },
);

// export const stakeMatrix = createAsyncThunk(
//   "stake/stakeMatrix",
//   async ({ action, value, provider, address, networkID }: IActionValueAsyncThunk, { dispatch }) => {
//     if (!provider) {
//       dispatch(error("Please connect your wallet!"));
//       return;
//     }

//     const signer = provider.getSigner();
//     const brickContract = new ethers.Contract(
//       addresses[networkID].STAKING_ADDRESS as string,
//       BrickStakingABI,
//       signer,
//     ) as OlympusStaking;
//     const stakingHelper = new ethers.Contract(
//       addresses[networkID].STAKING_HELPER_ADDRESS as string,
//       StakingHelperABI,
//       signer,
//     ) as StakingHelper;

//     let stakeTx;
//     let matrixData: IProtocolMetrics = {
//       brickCirculatingSupply: "", // total brick supply - total staked brick - total brick in treasury contract
//       totalSupply: "", // total brick supply
//       brickPrice: "", // brick price
//       marketCap: "", // brickPrice * brickCirculatingSupply
//       totalValueLocked: "", // total staked brick
//       nextEpochRebase: "",
//       nextDistributedBrick: "",
//       treasuryFraxRiskFreeValue: "", // frax price * total frax in treasury contract
//       treasuryFraxMarketValue: "", // frax price * total frax in treasury contract
//       treasuryFtmRiskFreeValue: "", // ftm price * total ftm in treasury contract
//       treasuryFtmMarketValue: "", // ftm price * total ftm in treasury contract
//       treasuryRiskFreeValue: "",  //
//       treasuryMarketValue: "", // add up all coins value in treasury contract
//     };

//     if (action === "initiate") {
//       const totalSupply = brickContract.totalSupply();
//       console.log("totalSupply", totalSupply);
//     } else {
//     }
//   },
// );
