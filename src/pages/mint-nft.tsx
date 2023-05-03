import { useWeb3 } from "@/context/web3";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import DEMONFTC2 from "@/abi/DEMONFTC2.json";
import { AbiItem } from "web3-utils";
import renderMainLayout from "@/layouts/main.layout";
import Loading from "@/components/common/Loading";

type Props = {};

const MintNFT = (props: Props) => {
  const { account, web3, isConnected } = useWeb3();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const tokenUriRef = useRef<HTMLInputElement>(null);
  const contractAddRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleMint = useCallback(async () => {
    if (!tokenUriRef.current?.value) {
      return toast.error("Empty token URI");
    }
    if (!contractAddRef.current?.value) {
      return toast.error("Empty contract address");
    }
    if (!web3) return toast.error("No instance web3");

    try {
      setIsLoading(true);
      const DEMONFTC2Contract = new web3.eth.Contract(
        DEMONFTC2 as unknown as AbiItem,
        contractAddRef.current.value
      );
      const res = await DEMONFTC2Contract.methods
        .createToken(tokenUriRef.current.value)
        .send({
          from: account,
        })
        .on("transactionHash", function (transactionHash: string) {
          console.log(transactionHash);
        })
        .on("receipt", function (receipt: any) {
          console.log(receipt.contractAddress); // contains the new contract address
        })
        .on(
          "confirmation",
          function (confirmationNumber: string, receipt: string) {
            console.log(confirmationNumber, receipt);
          }
        );
      console.log("🚀 ~ file: mint-nft.tsx:59 ~ handleMint ~ res:", res);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }, [account, web3]);

  return (
    <>
      <Head>
        <title>Mint NFT</title>
      </Head>
      <main className="mx-auto my-10 flex max-w-5xl flex-col gap-10 px-10">
        <div className="mb-4 flex flex-col">
          <label className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            Input Contract Address:
          </label>
          <input
            ref={contractAddRef}
            placeholder="Input contract address"
            className="input"
            defaultValue={"0x129De42B48117E6E5aC79D94640343e04B2E3C96"}
          ></input>
        </div>
        <div className="mb-4 flex flex-col">
          <label className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
            Input Token URI (metadata):
          </label>
          <input
            ref={tokenUriRef}
            placeholder="Input nft token uri"
            className="input"
          ></input>
        </div>

        <button className="button" onClick={handleMint}>
          Mint Nft
        </button>
        {isLoading && <Loading />}
      </main>
    </>
  );
};
MintNFT.getLayout = renderMainLayout;
export default MintNFT;
