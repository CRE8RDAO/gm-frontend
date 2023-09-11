import { NodeHelper } from "./helpers/NodeHelper";
import { EnvHelper } from "./helpers/Environment";
import ethereum from "./assets/tokens/wETH.svg";
import arbitrum from "./assets/arbitrum.png";
import avalanche from "./assets/tokens/AVAX.svg";

export const THE_GRAPH_URL = "https://api.thegraph.com/subgraphs/name/0xtaichi/demo"; //https://api.thegraph.com/subgraphs/name/drondin/olympus-graph
export const EPOCH_INTERVAL = 2200;

// NOTE could get this from an outside source since it changes slightly over time
export const BLOCK_RATE_SECONDS = 13.14;

export const TOKEN_DECIMALS = 9;

interface IPoolGraphURLS {
  [index: string]: string;
}

export const POOL_GRAPH_URLS: IPoolGraphURLS = {
  4: "https://api.thegraph.com/subgraphs/name/pooltogether/rinkeby-v3_4_3",
  1: "https://api.thegraph.com/subgraphs/name/pooltogether/pooltogether-v3_4_3",
};

interface IAddresses {
  [key: number]: { [key: string]: string };
}

export const addresses: IAddresses = {
  7001: {
    BRICK_ADDRESS: "0x931B94bbccef6494Fd600E40d052812b8a1E77A6",
    FRAX_ADDRESS: "0x0fa65CFb2CC43bDF9F245a59DF65C5E93C534fFf",
    WFTM_ADDRESS: "0xB10598f6A39054D033B58AB035f43E4e5Aa2D557",
    BONDINGCALC_ADDRESS: "0x2B774122B4FA94bACc5116CCe37772D329a9aac5",
    TREASURY_ADDRESS: "0x9c8cabCEA4f9b65658eAa3D267Ee299016FFf732",
    DISTRIBUTOR_ADDRESS: "0x0A00eB88Ce7800CC4bE59B3c799a34Be5f5cD076",
    SBRICK_ADDRESS: "0x13f88dF38ee4B237d092745912609DE597e80C6F",
    STAKING_ADDRESS: "0x6964b052d0E4dDCe6F2FC4c431B70cecd40a1fDA",
    // STACKING_WARMUP_ADDRESS: "0x5a6A2047afEB20Ff4DDc4B38E0FB5E4744e649D7",
    STAKING_HELPER_ADDRESS: "0x245E9204E33f789258743089Ff15b6A2d6471C49",
    // WSOHM_ADDRESS: "0xC98a1c26ECE3Bb18d46ae263Bebf974c0C619EeC",
    REDEEM_HELPER_ADDRESS: "0xaD9Ea404AcDf33F06fCDEB664378ba5b3b5ba6B6",
  },
  4002: {
    BRICK_ADDRESS: "0x80FAcC2c14E6F1B31A952C43264b333C2788f30f",
    FRAX_ADDRESS: "0x9e008Cc93b4D2179dB48Fe5A0fed6B484aFf1739",
    WFTM_ADDRESS: "0x0Ae825CD631d5b59D56ACc635f1599ebb3390A6d",
    BONDINGCALC_ADDRESS: "0x17FC72CA16208b085613B0CA120914c8D546A764",
    TREASURY_ADDRESS: "0xe8e51612b1606c410E1240b80A5b3F2046ce7006",
    DISTRIBUTOR_ADDRESS: "0xf0424efD7295e0b81f143cA23eFBA3b476ed9C1e",
    SBRICK_ADDRESS: "0x9f6fBD3ac94BA9c823c43F2Ae0dcA80A4783e3b5",
    STAKING_ADDRESS: "0x6137c9684283D515DE179cb897a5d0345C61488F",
    // StakingWarmup_ADDRESS: "0xB8408Fc5f5aE1980a6af4CaA6118E98F7c328A5d",
    STAKING_HELPER_ADDRESS: "0x2663a2E5f4DF96b79377DA6B15e448b012838Cb8",
    // FraxBondDepository_ADDRESS: "0x38E4560A1DB2DAe89F78F98b308eE6F890b27712",
    // WftmBondDepository_ADDRESS: "0x1e0AD0F8DDFF84FDc938373E9aa66b8d994ea066",
    REDEEM_HELPER_ADDRESS: "0x952A2D7BE42E04FCC622e4beB4c59d3AD4Ffbe4F",
  },
  4: {
    BRICK_ADDRESS: "0x68701099918D806d786E9fbc793907d3b8fEe442",
    FRAX_ADDRESS: "0x0B81a995b28254D76e5148d29E8eb4c5c26D3aC0",
    WFTM_ADDRESS: "0xDd1875ddC7c832FA1CB82DfB8B34d3abD1F67a87",
    BONDINGCALC_ADDRESS: "0x99c5dEE772793484cC617dA8aE3bC0Aa302aa0Df",
    TREASURY_ADDRESS: "0xb5fF90A88d52dDC230F43891D565710c706FD00B",
    DISTRIBUTOR_ADDRESS: "0xa2c6C44A9ba611D9598f580ff169d7c9E6fD6E83",
    SBRICK_ADDRESS: "0xE4dE4087849fd4e5DEb21761e88c0c4ab93C6d56",
    STAKING_ADDRESS: "0xbD21F81C59D578baE56Cd9d92Ee038C9F18c01F9",
    // StakingWarmup_ADDRESS: "0xB8408Fc5f5aE1980a6af4CaA6118E98F7c328A5d",
    STAKING_HELPER_ADDRESS: "0xcF8268618caEF8A8e5386da520022C64EB54930A", // "0x179C45D4c6F8370c68A53aF068b5Fa20e3fE2Af4",
    // FraxBondDepository_ADDRESS: "0x38E4560A1DB2DAe89F78F98b308eE6F890b27712",
    // WftmBondDepository_ADDRESS: "0x1e0AD0F8DDFF84FDc938373E9aa66b8d994ea066",
    REDEEM_HELPER_ADDRESS: "0xb82295902e1ceb1E9Fc7e1de2440331eA8D3aFad",
  },
  1: {
    FRAX_ADDRESS: "0x6b175474e89094c44da98b954eedeac495271d0f", // duplicate
    BRICK_ADDRESS: "0x383518188c0c6d7730d91b2c03a03c837814a899",
    STAKING_ADDRESS: "0xfd31c7d00ca47653c6ce64af53c1571f9c36566a", // The new staking contract
    STAKING_HELPER_ADDRESS: "0xc8c436271f9a6f10a5b80c8b8ed7d0e8f37a612d", // Helper contract used for Staking only
    OLD_STAKING_ADDRESS: "0x0822F3C03dcc24d200AFF33493Dc08d0e1f274A2",
    SBRICK_ADDRESS: "0x04F2694C8fcee23e8Fd0dfEA1d4f5Bb8c352111F",
    WSBRICK_ADDRESS: "0xca76543cf381ebbb277be79574059e32108e3e65",
    OLD_SBRICK_ADDRESS: "0x31932E6e45012476ba3A3A4953cbA62AeE77Fbbe",
    PRESALE_ADDRESS: "0xcBb60264fe0AC96B0EFa0145A9709A825afa17D8",
    ABRICK_ADDRESS: "0x24ecfd535675f36ba1ab9c5d39b50dc097b0792e",
    MIGRATE_ADDRESS: "0xC7f56EC779cB9e60afA116d73F3708761197dB3d",
    DISTRIBUTOR_ADDRESS: "0xbe731507810C8747C3E01E62c676b1cA6F93242f",
    BONDINGCALC_ADDRESS: "0xcaaa6a2d4b26067a391e7b7d65c16bb2d5fa571a",
    CIRCULATING_SUPPLY_ADDRESS: "0x0efff9199aa1ac3c3e34e957567c1be8bf295034",
    TREASURY_ADDRESS: "0x31f8cc382c9898b273eff4e0b7626a6987c846e8",
    CRUCIBLE_BRICK_LUSD: "0x2230ad29920D61A535759678191094b74271f373",
    LQTY: "0x6dea81c8171d0ba574754ef6f8b412f2ed88c54d",
    MIST: "0x88acdd2a6425c3faae4bc9650fd7e27e0bebb7ab",
    REDEEM_HELPER_ADDRESS: "0xE1e83825613DE12E8F0502Da939523558f0B819E",
    FUSE_6_SBRICK: "0x59bd6774c22486d9f4fab2d448dce4f892a9ae25", // Tetranode's Locker
    FUSE_18_SBRICK: "0x6eDa4b59BaC787933A4A21b65672539ceF6ec97b", // Olympus Pool Party
    FUSE_36_SBRICK: "0x252d447c54F33e033AD04048baEAdE7628cB1274", // Fraximalist Money Market
    PT_TOKEN_ADDRESS: "0x0E930b8610229D74Da0A174626138Deb732cE6e9", // 33T token address, taken from `ticket` function on PRIZE_STRATEGY_ADDRESS
    PT_PRIZE_POOL_ADDRESS: "0xEaB695A8F5a44f583003A8bC97d677880D528248", // NEW
    PT_PRIZE_STRATEGY_ADDRESS: "0xf3d253257167c935f8C62A02AEaeBB24c9c5012a", // NEW
    MIGRATOR_ADDRESS: "0x184f3FAd8618a6F458C16bae63F70C426fE784B3",
    GBRICK_ADDRESS: "0x0ab87046fBb341D058F17CBC4c1133F25a20a52f",
    FIATDAO_WSBRICK_ADDRESS: "0xe98ae8cD25CDC06562c29231Db339d17D02Fd486",
  },
  42161: {
    FRAX_ADDRESS: "0x6b175474e89094c44da98b954eedeac495271d0f", // duplicate
    BRICK_ADDRESS: "0x383518188c0c6d7730d91b2c03a03c837814a899",
    STAKING_ADDRESS: "0xfd31c7d00ca47653c6ce64af53c1571f9c36566a", // The new staking contract
    STAKING_HELPER_ADDRESS: "0xc8c436271f9a6f10a5b80c8b8ed7d0e8f37a612d", // Helper contract used for Staking only
    OLD_STAKING_ADDRESS: "0x0822F3C03dcc24d200AFF33493Dc08d0e1f274A2",
    SBRICK_ADDRESS: "0x04F2694C8fcee23e8Fd0dfEA1d4f5Bb8c352111F",
    OLD_SBRICK_ADDRESS: "0x31932E6e45012476ba3A3A4953cbA62AeE77Fbbe",
    PRESALE_ADDRESS: "0xcBb60264fe0AC96B0EFa0145A9709A825afa17D8",
    ABRICK_ADDRESS: "0x24ecfd535675f36ba1ab9c5d39b50dc097b0792e",
    MIGRATE_ADDRESS: "0xC7f56EC779cB9e60afA116d73F3708761197dB3d",
    DISTRIBUTOR_ADDRESS: "0xbe731507810C8747C3E01E62c676b1cA6F93242f",
    BONDINGCALC_ADDRESS: "0xcaaa6a2d4b26067a391e7b7d65c16bb2d5fa571a",
    CIRCULATING_SUPPLY_ADDRESS: "0x0efff9199aa1ac3c3e34e957567c1be8bf295034",
    TREASURY_ADDRESS: "0x31f8cc382c9898b273eff4e0b7626a6987c846e8",
    // TODO (appleseed-lusd): swap this out
    PICKLE_BRICK_LUSD_ADDRESS: "0xc3d03e4f041fd4cd388c549ee2a29a9e5075882f",
    REDEEM_HELPER_ADDRESS: "0xE1e83825613DE12E8F0502Da939523558f0B819E",
  }, // TODO: Replace with Arbitrum contract addresses when ready
  421611: {
    FRAX_ADDRESS: "0x6b175474e89094c44da98b954eedeac495271d0f", // duplicate
    BRICK_ADDRESS: "0x383518188c0c6d7730d91b2c03a03c837814a899",
    STAKING_ADDRESS: "0xfd31c7d00ca47653c6ce64af53c1571f9c36566a", // The new staking contract
    STAKING_HELPER_ADDRESS: "0xc8c436271f9a6f10a5b80c8b8ed7d0e8f37a612d", // Helper contract used for Staking only
    OLD_STAKING_ADDRESS: "0x0822F3C03dcc24d200AFF33493Dc08d0e1f274A2",
    SBRICK_ADDRESS: "0x04F2694C8fcee23e8Fd0dfEA1d4f5Bb8c352111F",
    OLD_SBRICK_ADDRESS: "0x31932E6e45012476ba3A3A4953cbA62AeE77Fbbe",
    PRESALE_ADDRESS: "0xcBb60264fe0AC96B0EFa0145A9709A825afa17D8",
    ABRICK_ADDRESS: "0x24ecfd535675f36ba1ab9c5d39b50dc097b0792e",
    MIGRATE_ADDRESS: "0xC7f56EC779cB9e60afA116d73F3708761197dB3d",
    DISTRIBUTOR_ADDRESS: "0xbe731507810C8747C3E01E62c676b1cA6F93242f",
    BONDINGCALC_ADDRESS: "0xcaaa6a2d4b26067a391e7b7d65c16bb2d5fa571a",
    CIRCULATING_SUPPLY_ADDRESS: "0x0efff9199aa1ac3c3e34e957567c1be8bf295034",
    TREASURY_ADDRESS: "0x31f8cc382c9898b273eff4e0b7626a6987c846e8",
    // TODO (appleseed-lusd): swap this out
    PICKLE_BRICK_LUSD_ADDRESS: "0xc3d03e4f041fd4cd388c549ee2a29a9e5075882f",
    REDEEM_HELPER_ADDRESS: "0xE1e83825613DE12E8F0502Da939523558f0B819E",
  }, // TODO: Replace with Arbitrum Testnet contract addresses when ready
  43113: {
    FRAX_ADDRESS: "",
    BRICK_ADDRESS: "",
    STAKING_ADDRESS: "", // The new staking contract
    STAKING_HELPER_ADDRESS: "", // Helper contract used for Staking only
    OLD_STAKING_ADDRESS: "",
    SBRICK_ADDRESS: "",
    OLD_SBRICK_ADDRESS: "",
    PRESALE_ADDRESS: "",
    ABRICK_ADDRESS: "",
    MIGRATE_ADDRESS: "",
    DISTRIBUTOR_ADDRESS: "",
    BONDINGCALC_ADDRESS: "",
    CIRCULATING_SUPPLY_ADDRESS: "",
    TREASURY_ADDRESS: "",
    PICKLE_BRICK_LUSD_ADDRESS: "",
    REDEEM_HELPER_ADDRESS: "",
    // WSBRICK_ADDRESS: "",
    // GBRICK_ADDRESS: "",
    // MIGRATOR_ADDRESS: ""
  }, // TODO: Avalanche Testnet addresses
  43114: {
    FRAX_ADDRESS: "",
    BRICK_ADDRESS: "",
    // STAKING_ADDRESS: "", // The new staking contract
    STAKING_HELPER_ADDRESS: "", // Helper contract used for Staking only
    OLD_STAKING_ADDRESS: "",
    SBRICK_ADDRESS: "",
    OLD_SBRICK_ADDRESS: "",
    PRESALE_ADDRESS: "",
    ABRICK_ADDRESS: "",
    MIGRATE_ADDRESS: "",
    DISTRIBUTOR_ADDRESS: "",
    BONDINGCALC_ADDRESS: "",
    CIRCULATING_SUPPLY_ADDRESS: "",
    TREASURY_ADDRESS: "",
    PICKLE_BRICK_LUSD_ADDRESS: "",
    REDEEM_HELPER_ADDRESS: "",
    WSBRICK_ADDRESS: "0x8cd309e14575203535ef120b5b0ab4dded0c2073",
    GBRICK_ADDRESS: "0x321e7092a180bb43555132ec53aaa65a5bf84251",
    MIGRATOR_ADDRESS: "0xB10209BFbb37d38EC1B5F0c964e489564e223ea7",
  }, // TODO: Avalanche Mainnet addresses
};
// BRICK 0x80FAcC2c14E6F1B31A952C43264b333C2788f30f
// Mock FRAX 0x9e008Cc93b4D2179dB48Fe5A0fed6B484aFf1739 //Not adding this yet.... need abi
// Mock WFTM 0x0Ae825CD631d5b59D56ACc635f1599ebb3390A6d   // need abi
// BondingCalculator 0x17FC72CA16208b085613B0CA120914c8D546A764
// Treasury 0xe8e51612b1606c410E1240b80A5b3F2046ce7006
// Distributor 0xf0424efD7295e0b81f143cA23eFBA3b476ed9C1e
// sBRICK 0x9f6fBD3ac94BA9c823c43F2Ae0dcA80A4783e3b5
// Staking 0x6137c9684283D515DE179cb897a5d0345C61488F
// StakingWarmup 0xB8408Fc5f5aE1980a6af4CaA6118E98F7c328A5d   // not sure why these are not here??? @0xkowloon
// StakingHelper 0x2663a2E5f4DF96b79377DA6B15e448b012838Cb8
// FraxBondDepository 0x38E4560A1DB2DAe89F78F98b308eE6F890b27712  // not added need to figure out how to add bonds
// WftmBondDepository 0x1e0AD0F8DDFF84FDc938373E9aa66b8d994ea066  // need to figure out how to add bonds
/**
 * Network details required to add a network to a user's wallet, as defined in EIP-3085 (https://eips.ethereum.org/EIPS/eip-3085)
 */

interface INativeCurrency {
  name: string;
  symbol: string;
  decimals?: number;
}

interface INetwork {
  chainName: string;
  chainId: number;
  nativeCurrency: INativeCurrency;
  rpcUrls: string[];
  blockExplorerUrls: string[];
  image: SVGImageElement;
  imageAltText: string;
  uri: () => string;
}

// These networks will be available for users to select. Other networks may be functional
// (e.g. testnets, or mainnets being prepared for launch) but need to be selected directly via the wallet.
export const USER_SELECTABLE_NETWORKS = [1, 42161, 43114, 4002, 4];

// Set this to the chain number of the most recently added network in order to enable the 'Now supporting X network'
// message in the UI. Set to -1 if we don't want to display the message at the current time.
export const NEWEST_NETWORK_ID = 4002;

export const NETWORKS: { [key: number]: INetwork } = {
  4002: {
    chainName: "Fantom Testnet",
    chainId: 4002,
    nativeCurrency: {
      name: "FTM",
      symbol: "FTM",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.testnet.fantom.network"],
    blockExplorerUrls: ["https://testnet.ftmscan.com/#/"],
    image: ethereum,
    imageAltText: "Fantom Logo",
    uri: () => NodeHelper.getMainnetURI(1),
  },
  7000: {
    chainName: "Canto",
    chainId: 7000,
    nativeCurrency: {
      name: "Canto",
      symbol: "CANTO",
      decimals: 18,
    },
    rpcUrls: ["https://canto.dexvaults.com"],
    blockExplorerUrls: ["https://tuber.build/"],
    image: ethereum,
    imageAltText: "Ethereum Logo",
    uri: () => EnvHelper.cantoURI,
  },
  7001: {
    chainName: "Canto Testnet",
    chainId: 7001,
    nativeCurrency: {
      name: "Canto",
      symbol: "CANTO",
      decimals: 18,
    },
    rpcUrls: ["https://canto-testnet.plexnode.wtf"],
    blockExplorerUrls: ["https://testnet.tuber.build/"],
    image: ethereum,
    imageAltText: "Ethereum Logo",
    uri: () => EnvHelper.cantoTestnetURI,
  },
  1: {
    chainName: "Ethereum",
    chainId: 1,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: [""],
    blockExplorerUrls: ["https://etherscan.io/#/"],
    image: ethereum,
    imageAltText: "Ethereum Logo",
    uri: () => NodeHelper.getMainnetURI(1),
  },
  4: {
    chainName: "Rinkeby Testnet",
    chainId: 4,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"],
    blockExplorerUrls: ["https://rinkeby.etherscan.io/#/"],
    image: ethereum,
    imageAltText: "Ethereum Logo",
    uri: () => NodeHelper.getMainnetURI(4),
  },
  42161: {
    chainName: "Arbitrum",
    chainId: 42161,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://explorer.arbitrum.io/#/"],
    image: arbitrum,
    imageAltText: "Arbitrum Logo",
    uri: () => NodeHelper.getMainnetURI(42161),
  },
  421611: {
    chainName: "Arbitrum Testnet",
    chainId: 421611,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://rinkeby.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://rinkeby-explorer.arbitrum.io/#/"],
    image: arbitrum,
    imageAltText: "Arbitrum Logo",
    uri: () => EnvHelper.alchemyArbitrumTestnetURI,
  },
  43113: {
    chainName: "Avalanche Fuji Testnet",
    chainId: 43113,
    nativeCurrency: {
      name: "AVAX",
      symbol: "AVAX",
      decimals: 18,
    },
    rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://testnet.snowtrace.io/#/"],
    image: avalanche,
    imageAltText: "Avalanche Logo",
    uri: () => EnvHelper.alchemyAvalancheTestnetURI,
  },
  43114: {
    chainName: "Avalanche Mainnet",
    chainId: 43114,
    nativeCurrency: {
      name: "AVAX",
      symbol: "AVAX",
      decimals: 18,
    },
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://cchain.explorer.avax.network/"],
    image: avalanche,
    imageAltText: "Avalanche Logo",
    uri: () => NodeHelper.getMainnetURI(43114),
  },
};
