const appChainId = process.env.NEXT_PUBLIC_CHAIN_ID || "11155111";
const chainName = process.env.NEXT_PUBLIC_CHAIN_NAME || "sepolia";
const symbol = process.env.NEXT_PUBLIC_SYMBOL || "SepoliaETH";
const blockExplorerUrl =
  process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL || "https://sepolia.etherscan.io";
const rpcUrl =
  process.env.NEXT_PUBLIC_RPC_URl || "https://sepolia.infura.io/v3/";
const moralisApiKey = process.env.NEXT_PUBLIC_MORALIS_API_KEY;
const moralisEndPoint = process.env.NEXT_PUBLIC_MORALIS_END_POINT;

export {
  appChainId,
  chainName,
  symbol,
  blockExplorerUrl,
  rpcUrl,
  moralisApiKey,
  moralisEndPoint,
};
