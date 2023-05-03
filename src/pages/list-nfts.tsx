import {
  chainName,
  moralisApiKey,
  moralisEndPoint,
} from "@/constants/environment";
import { useWeb3 } from "@/context/web3";
import renderMainLayout from "@/layouts/main.layout";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useState } from "react";
import { EvmChain } from "@moralisweb3/common-evm-utils";
import Moralis from "moralis";
import { handleResolveMetaData } from "@/utils/metadata";
import NFTCard from "@/components/nft/NFTCard";
import Head from "next/head";
import Loading from "@/components/common/Loading";

type Props = {};

const ListNFTs = (props: Props) => {
  const { account, web3, isConnected, startMoralis } = useWeb3();
  const router = useRouter();
  const [nft, setNft] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAllOfNfts = useCallback(
    async function () {
      try {
        setIsLoading(true);
        const chain = EvmChain.SEPOLIA;
        const response = await Moralis.EvmApi.nft.getWalletNFTs({
          address: account as string,
          chain,
        });

        const arrayResult = response.toJSON().result as any[];

        const handledMetadataNfts = await handleResolveMetaData(arrayResult);

        setNft(handledMetadataNfts);
      } catch (error) {
        console.log(error, "error");
      } finally {
        setIsLoading(false);
      }
    },
    [account]
  );

  useEffect(() => {
    fetchAllOfNfts();
  }, [fetchAllOfNfts]);

  return (
    <>
      <Head>
        <title>List NFTs</title>
      </Head>
      <main className="mx-auto my-10 flex flex-col gap-10 px-10">
        <button className="button mt-5" onClick={fetchAllOfNfts}>
          Refresh
        </button>
        {nft.map((item, index) => (
          <NFTCard key={String(index)} nft={item} />
        ))}
        {isLoading && <Loading />}
      </main>
    </>
  );
};

ListNFTs.getLayout = renderMainLayout;
export default ListNFTs;
