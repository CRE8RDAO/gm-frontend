import { ethers, BigNumber } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20ABI } from "../abi/IERC20.json";
import { abi as wsOHM } from "../abi/wsOHM.json";
import { clearPendingTxn, fetchPendingTxns, getWrappingTypeText } from "./PendingTxnsSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances } from "./AccountSlice";
import { error, info } from "../slices/MessagesSlice";
import { IActionValueAsyncThunk, IChangeApprovalAsyncThunk, IJsonRPCError } from "./interfaces";
import { segmentUA } from "../helpers/userAnalyticHelpers";
import { IERC20, WsOHM } from "src/typechain";

interface IUAData {
  address: string;
  value: string;
  approved: boolean;
  txHash: string | null;
  type: string | null;
}

export const changeApproval = createAsyncThunk(
  "wrap/changeApproval",
  async ({ token, provider, address, networkID }: IChangeApprovalAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const sbrickContract = new ethers.Contract(
      addresses[networkID].SBRICK_ADDRESS as string,
      ierc20ABI,
      signer,
    ) as IERC20;
    const wsbrickContract = new ethers.Contract(
      addresses[networkID].WSBRICK_ADDRESS as string,
      ierc20ABI,
      signer,
    ) as IERC20;
    let approveTx;
    let wrapAllowance = await sbrickContract.allowance(address, addresses[networkID].WSBRICK_ADDRESS);
    let unwrapAllowance = await wsbrickContract.allowance(address, addresses[networkID].WSBRICK_ADDRESS);

    try {
      if (token === "sbrick") {
        // won't run if wrapAllowance > 0
        approveTx = await sbrickContract.approve(
          addresses[networkID].WSBRICK_ADDRESS,
          ethers.utils.parseUnits("1000000000", "gwei"),
        );
      } else if (token === "wsohm") {
        approveTx = await wsbrickContract.approve(
          addresses[networkID].WSBRICK_ADDRESS,
          ethers.utils.parseUnits("1000000000", "ether"),
        );
      }

      const text = "Approve " + (token === "sbrick" ? "Wrapping" : "Unwrapping");
      const pendingTxnType = token === "sbrick" ? "approve_wrapping" : "approve_unwrapping";
      if (approveTx) {
        dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));
        await approveTx.wait();
        dispatch(info("Successfully Approved!"));
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
    wrapAllowance = await sbrickContract.allowance(address, addresses[networkID].WSBRICK_ADDRESS);
    unwrapAllowance = await wsbrickContract.allowance(address, addresses[networkID].WSBRICK_ADDRESS);

    return dispatch(
      fetchAccountSuccess({
        wrapping: {
          ohmWrap: +wrapAllowance,
          ohmUnwrap: +unwrapAllowance,
        },
      }),
    );
  },
);

export const changeWrap = createAsyncThunk(
  "wrap/changeWrap",
  async ({ action, value, provider, address, networkID }: IActionValueAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const wsbrickContract = new ethers.Contract(addresses[networkID].WSBRICK_ADDRESS as string, wsOHM, signer) as WsOHM;

    let wrapTx;
    let uaData: IUAData = {
      address: address,
      value: value,
      approved: true,
      txHash: null,
      type: null,
    };
    try {
      if (action === "wrap") {
        uaData.type = "wrap";
        wrapTx = await wsbrickContract.wrap(ethers.utils.parseUnits(value, "gwei"));
      } else {
        uaData.type = "unwrap";
        wrapTx = await wsbrickContract.unwrap(ethers.utils.parseUnits(value));
      }
      const pendingTxnType = action === "wrap" ? "wrapping" : "unwrapping";
      uaData.txHash = wrapTx.hash;
      dispatch(fetchPendingTxns({ txnHash: wrapTx.hash, text: getWrappingTypeText(action), type: pendingTxnType }));
      await wrapTx.wait();
    } catch (e: unknown) {
      uaData.approved = false;
      const rpcError = e as IJsonRPCError;
      if (rpcError.code === -32603 && rpcError.message.indexOf("ds-math-sub-underflow") >= 0) {
        dispatch(
          error("You may be trying to wrap more than your balance! Error code: 32603. Message: ds-math-sub-underflow"),
        );
      } else {
        dispatch(error(rpcError.message));
      }
      return;
    } finally {
      if (wrapTx) {
        segmentUA(uaData);

        dispatch(clearPendingTxn(wrapTx.hash));
      }
    }
    dispatch(getBalances({ address, networkID, provider }));
  },
);
