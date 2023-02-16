import { useWeb3 } from "@/context/web3";
import renderMainLayout from "@/layouts/main.layout";
import Head from "next/head";
import { useCallback, useRef, useState } from "react";
import { toast } from "react-toastify";

type Props = {};

const Tools = ({}: Props) => {
  const { web3 } = useWeb3();

  const [balance, setBalance] = useState("");

  const inputAddress = useRef<HTMLInputElement>(null);
  const handleGetBalance = useCallback(async () => {
    if (!inputAddress.current?.value) {
      toast.error("Please input an valid address");
      return;
    }
    try {
      if (web3) {
        const _balance = await web3.eth.getBalance(inputAddress.current.value);
        setBalance(web3.utils.fromWei(_balance));
      }
    } catch (error) {
      toast.error("Error");
    }
  }, [web3, inputAddress]);

  return (
    <>
      <Head>
        <title>Web3 Tools</title>
      </Head>
      <main className="mx-auto my-10 flex max-w-5xl flex-col gap-10 px-10">
        <input
          type="text"
          id="first_name"
          className="input"
          placeholder="Input an address"
          ref={inputAddress}
        />
        <button className="button" onClick={handleGetBalance}>
          Get balance on this address
        </button>
        {!!balance && (
          <div className="mb-4 flex flex-row gap-2">
            <label className="text-lg font-semibold text-gray-900 dark:text-white">
              Balance:
            </label>
            <div className="text-lg">{balance}</div>
          </div>
        )}
      </main>
    </>
  );
};
Tools.getLayout = renderMainLayout;
export default Tools;
