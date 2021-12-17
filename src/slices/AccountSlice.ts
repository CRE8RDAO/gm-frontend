import { BigNumber, BigNumberish, ethers } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as sBrickv2 } from "../abi/sOhmv2.json";
import { abi as fuseProxy } from "../abi/FuseProxy.json";
import { abi as wsBRICK } from "../abi/wsOHM.json";
import { abi as fiatDAO } from "../abi/FiatDAOContract.json";

import { setAll } from "../helpers";

import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAddressAsyncThunk, ICalcUserBondDetailsAsyncThunk } from "./interfaces";
import { FiatDAOContract, FuseProxy, IERC20, IERC20__factory, SOhmv2, SOhmv2__factory, WsOHM } from "src/typechain";
import { GOHM__factory } from "src/typechain/factories/GOHM__factory";

interface IUserBalances {
  balances: {
    gbrick: string;
    brick: string;
    sbrick: string;
    fsbrick: string;
    wsbrick: string;
    fiatDaowsbrick: string;
    wsbrickAsSbrick: string;
    pool: string;
  };
}

export const getBalances = createAsyncThunk(
  "account/getBalances",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk) => {
    let gBrickBalance = BigNumber.from("0");
    let brickBalance = BigNumber.from("0");
    let sbrickBalance = BigNumber.from("0");
    let wsbrickBalance = BigNumber.from("0");
    let wsbrickAsSbrick = BigNumber.from("0");
    let poolBalance = BigNumber.from("0");
    let fsbrickBalance = BigNumber.from(0);
    let fiatDaowsbrickBalance = BigNumber.from("0");
    try {
      const gBrickContract = GOHM__factory.connect(addresses[networkID].GBRICK_ADDRESS, provider);
      gBrickBalance = await gBrickContract.balanceOf(address);
      const wsbrickContract = new ethers.Contract(
        addresses[networkID].WSBRICK_ADDRESS as string,
        wsBRICK,
        provider,
      ) as WsOHM;
      wsbrickBalance = await wsbrickContract.balanceOf(address);
      // NOTE (appleseed): wsbrickAsSbrick is wsBRICK given as a quantity of sBRICK
      wsbrickAsSbrick = await wsbrickContract.wOHMTosOHM(wsbrickBalance);

      const brickContract = new ethers.Contract(
        addresses[networkID].BRICK_ADDRESS as string,
        ierc20Abi,
        provider,
      ) as IERC20;
      brickBalance = await brickContract.balanceOf(address);
      const sbrickContract = new ethers.Contract(
        addresses[networkID].SBRICK_ADDRESS as string,
        ierc20Abi,
        provider,
      ) as IERC20;
      sbrickBalance = await sbrickContract.balanceOf(address);

      const poolTokenContract = new ethers.Contract(
        addresses[networkID].PT_TOKEN_ADDRESS as string,
        ierc20Abi,
        provider,
      ) as IERC20;
      poolBalance = await poolTokenContract.balanceOf(address);

      for (const fuseAddressKey of ["FUSE_6_SBRICK", "FUSE_18_SBRICK", "FUSE_36_SBRICK"]) {
        if (addresses[networkID][fuseAddressKey]) {
          const fsbrickContract = new ethers.Contract(
            addresses[networkID][fuseAddressKey] as string,
            fuseProxy,
            provider.getSigner(),
          ) as FuseProxy;
          // fsbrickContract.signer;
          const balanceOfUnderlying = await fsbrickContract.callStatic.balanceOfUnderlying(address);
          fsbrickBalance = balanceOfUnderlying.add(fsbrickBalance);
        }
      }
      if (addresses[networkID].FIATDAO_WSBRICK_ADDRESS) {
        const fiatDaoContract = new ethers.Contract(
          addresses[networkID].FIATDAO_WSBRICK_ADDRESS as string,
          fiatDAO,
          provider,
        ) as FiatDAOContract;
        fiatDaowsbrickBalance = await fiatDaoContract.balanceOf(
          address,
          addresses[networkID].WSBRICK_ADDRESS as string,
        );
      }
    } catch (e) {
      console.warn("caught error in getBalances", e);
    }

    return {
      balances: {
        gbrick: ethers.utils.formatEther(gBrickBalance),
        brick: ethers.utils.formatUnits(brickBalance, "gwei"),
        sbrick: ethers.utils.formatUnits(sbrickBalance, "gwei"),
        fsbrick: ethers.utils.formatUnits(fsbrickBalance, "gwei"),
        wsbrick: ethers.utils.formatEther(wsbrickBalance),
        fiatDaowsbrick: ethers.utils.formatEther(fiatDaowsbrickBalance),
        wsbrickAsSbrick: ethers.utils.formatUnits(wsbrickAsSbrick, "gwei"),
        pool: ethers.utils.formatUnits(poolBalance, "gwei"),
      },
    };
  },
);

interface IUserAccountDetails {
  staking: {
    brickStake: number;
    brickUnstake: number;
  };
  wrapping: {
    sbrickWrap: number;
    wsbrickUnwrap: number;
    gBrickUnwrap: number;
  };
}

export const getMigrationAllowances = createAsyncThunk(
  "account/getMigrationAllowances",
  async ({ networkID, provider, address }: IBaseAddressAsyncThunk) => {
    let brickAllowance = BigNumber.from(0);
    let sBrickAllowance = BigNumber.from(0);
    let wsBrickAllowance = BigNumber.from(0);
    let gBrickAllowance = BigNumber.from(0);

    if (addresses[networkID].BRICK_ADDRESS) {
      const brickContract = IERC20__factory.connect(addresses[networkID].BRICK_ADDRESS, provider);
      brickAllowance = await brickContract.allowance(address, addresses[networkID].MIGRATOR_ADDRESS);
    }

    if (addresses[networkID].SBRICK_ADDRESS) {
      const sBrickContract = IERC20__factory.connect(addresses[networkID].SBRICK_ADDRESS, provider);
      sBrickAllowance = await sBrickContract.allowance(address, addresses[networkID].MIGRATOR_ADDRESS);
    }

    if (addresses[networkID].WSBRICK_ADDRESS) {
      const wsBrickContract = IERC20__factory.connect(addresses[networkID].WSBRICK_ADDRESS, provider);
      wsBrickAllowance = await wsBrickContract.allowance(address, addresses[networkID].MIGRATOR_ADDRESS);
    }

    if (addresses[networkID].GBRICK_ADDRESS) {
      const gBrickContract = IERC20__factory.connect(addresses[networkID].GBRICK_ADDRESS, provider);
      gBrickAllowance = await gBrickContract.allowance(address, addresses[networkID].MIGRATOR_ADDRESS);
    }

    return {
      migration: {
        brick: +brickAllowance,
        sbrick: +sBrickAllowance,
        wsbrick: +wsBrickAllowance,
        gbrick: +gBrickAllowance,
      },
      isMigrationComplete: false,
    };
  },
);

export const loadAccountDetails = createAsyncThunk(
  "account/loadAccountDetails",
  async ({ networkID, provider, address }: IBaseAddressAsyncThunk, { dispatch }) => {
    let stakeAllowance = BigNumber.from("0");
    let unstakeAllowance = BigNumber.from("0");
    let wrapAllowance = BigNumber.from("0");
    let unwrapAllowance = BigNumber.from("0");
    let gBrickUnwrapAllowance = BigNumber.from("0");
    let poolAllowance = BigNumber.from("0");
    try {
      const gBrickContract = GOHM__factory.connect(addresses[networkID].GBRICK_ADDRESS, provider);
      gBrickUnwrapAllowance = await gBrickContract.allowance(address, addresses[networkID].MIGRATOR_ADDRESS);

      const brickContract = new ethers.Contract(
        addresses[networkID].BRICK_ADDRESS as string,
        ierc20Abi,
        provider,
      ) as IERC20;
      stakeAllowance = await brickContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS);

      const sbrickContract = new ethers.Contract(
        addresses[networkID].SBRICK_ADDRESS as string,
        sBrickv2,
        provider,
      ) as SOhmv2;
      unstakeAllowance = await sbrickContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
      poolAllowance = await sbrickContract.allowance(address, addresses[networkID].PT_PRIZE_POOL_ADDRESS);
      wrapAllowance = await sbrickContract.allowance(address, addresses[networkID].WSBRICK_ADDRESS);

      const wsbrickContract = new ethers.Contract(
        addresses[networkID].WSBRICK_ADDRESS as string,
        wsBRICK,
        provider,
      ) as WsOHM;
      unwrapAllowance = await wsbrickContract.allowance(address, addresses[networkID].WSBRICK_ADDRESS);
    } catch (e) {
      console.warn("failed contract calls in slice", e);
    }
    await dispatch(getBalances({ address, networkID, provider }));

    return {
      staking: {
        brickStake: +stakeAllowance,
        brickUnstake: +unstakeAllowance,
      },
      wrapping: {
        brickWrap: Number(ethers.utils.formatUnits(wrapAllowance, "gwei")),
        brickUnwrap: Number(ethers.utils.formatUnits(unwrapAllowance, "gwei")),
        gBrickUnwrap: Number(ethers.utils.formatUnits(gBrickUnwrapAllowance, "ether")),
      },
    };
  },
);

export interface IUserBondDetails {
  // bond: string;
  allowance: number;
  interestDue: number;
  bondMaturationBlock: number;
  pendingPayout: string; //Payout formatted in gwei.
}
export const calculateUserBondDetails = createAsyncThunk(
  "account/calculateUserBondDetails",
  async ({ address, bond, networkID, provider }: ICalcUserBondDetailsAsyncThunk) => {
    if (!address) {
      return {
        bond: "",
        displayName: "",
        bondIconSvg: "",
        isLP: false,
        allowance: 0,
        balance: "0",
        interestDue: 0,
        bondMaturationBlock: 0,
        pendingPayout: "",
      };
    }
    // dispatch(fetchBondInProgress());

    // Calculate bond details.
    const bondContract = bond.getContractForBond(networkID, provider);
    const reserveContract = bond.getContractForReserve(networkID, provider);

    let pendingPayout, bondMaturationBlock;

    const bondDetails = await bondContract.bondInfo(address);
    let interestDue: BigNumberish = Number(bondDetails.payout.toString()) / Math.pow(10, 9);
    bondMaturationBlock = +bondDetails.vesting + +bondDetails.lastBlock;
    pendingPayout = await bondContract.pendingPayoutFor(address);

    let allowance,
      balance = BigNumber.from(0);
    allowance = await reserveContract.allowance(address, bond.getAddressForBond(networkID) || "");
    balance = await reserveContract.balanceOf(address);
    // formatEthers takes BigNumber => String
    const balanceVal = ethers.utils.formatEther(balance);
    // balanceVal should NOT be converted to a number. it loses decimal precision
    return {
      bond: bond.name,
      displayName: bond.displayName,
      bondIconSvg: bond.bondIconSvg,
      isLP: bond.isLP,
      allowance: Number(allowance.toString()),
      balance: balanceVal,
      interestDue,
      bondMaturationBlock,
      pendingPayout: ethers.utils.formatUnits(pendingPayout, "gwei"),
    };
  },
);

interface IAccountSlice extends IUserAccountDetails, IUserBalances {
  bonds: { [key: string]: IUserBondDetails };
  balances: {
    gbrick: string;
    brick: string;
    sbrick: string;
    dai: string;
    oldsbrick: string;
    fsbrick: string;
    wsbrick: string;
    fiatDaowsbrick: string;
    wsbrickAsSbrick: string;
    pool: string;
  };
  loading: boolean;
  staking: {
    brickStake: number;
    brickUnstake: number;
  };
  migration: {
    brick: number;
    sbrick: number;
    wsbrick: number;
    gbrick: number;
  };
  pooling: {
    sbrickPool: number;
  };
}

const initialState: IAccountSlice = {
  loading: false,
  bonds: {},
  balances: {
    gbrick: "",
    brick: "",
    sbrick: "",
    dai: "",
    oldsbrick: "",
    fsbrick: "",
    wsbrick: "",
    fiatDaowsbrick: "",
    pool: "",
    wsbrickAsSbrick: "",
  },
  staking: { brickStake: 0, brickUnstake: 0 },
  wrapping: { sbrickWrap: 0, wsbrickUnwrap: 0, gBrickUnwrap: 0 },
  pooling: { sbrickPool: 0 },
  migration: { brick: 0, sbrick: 0, wsbrick: 0, gbrick: 0 },
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    fetchAccountSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAccountDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAccountDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAccountDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getBalances.pending, state => {
        state.loading = true;
      })
      .addCase(getBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getBalances.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(calculateUserBondDetails.pending, state => {
        state.loading = true;
      })
      .addCase(calculateUserBondDetails.fulfilled, (state, action) => {
        if (!action.payload) return;
        const bond = action.payload.bond;
        state.bonds[bond] = action.payload;
        state.loading = false;
      })
      .addCase(calculateUserBondDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getMigrationAllowances.fulfilled, (state, action) => {
        setAll(state, action.payload);
      })
      .addCase(getMigrationAllowances.rejected, (state, { error }) => {
        console.log(error);
      });
  },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
