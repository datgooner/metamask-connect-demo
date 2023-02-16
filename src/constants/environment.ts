const appChainId = process.env.NEXT_PUBLIC_CHAIN_ID || "0x5";
const chainName = process.env.NEXT_PUBLIC_CHAIN_NAME || "goerli";
const symbol = process.env.NEXT_PUBLIC_SYMBOL || "GoerliETH";
const blockExplorerUrl =
  process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL || "https://goerli.etherscan.io";
const rpcUrl =
  process.env.NEXT_PUBLIC_RPC_URl || "https://rpc.ankr.com/eth_goerli";

export { appChainId, chainName, symbol, blockExplorerUrl, rpcUrl };
