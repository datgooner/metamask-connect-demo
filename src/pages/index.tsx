import { useWeb3 } from "@/context/web3";
import renderMainLayout from "@/layouts/main.layout";
import { NextPageWithLayout } from "@/model/common";
import Head from "next/head";
import { useCallback, useRef, useState } from "react";
import { toast } from "react-toastify";

const Home: NextPageWithLayout = () => {
  const { connect, chainId, account, web3, isConnected } = useWeb3();
  const message = useRef<HTMLTextAreaElement>(null);
  const [signedMessage, setSignedMessage] = useState("");

  const handleConnectMetamask = useCallback(async () => {
    try {
      await connect();
      toast.success("Connect successfully");
    } catch (error) {
      toast.error((error as any).message);
    }
  }, [connect]);
  const handleSign = useCallback(async () => {
    if (web3 && account && message.current?.value) {
      const signed = await web3.eth.personal.sign(
        message.current.value,
        account,
        ""
      );
      setSignedMessage(signed);
    } else {
      toast.error("Error");
    }
  }, [account, message, web3]);

  return (
    <>
      <Head>
        <title>Demo connect</title>
      </Head>
      <main className="mx-auto my-10 flex max-w-5xl flex-col gap-10 px-10">
        {isConnected ? (
          <div>
            <div className="mb-4 flex flex-col">
              <label className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Account:
              </label>
              <div>{account}</div>
            </div>
            <div className="mb-4 flex flex-col">
              <label className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Chain Id:
              </label>
              <div>{chainId}</div>
            </div>

            <textarea
              className="input mb-2"
              ref={message}
              placeholder="Input message to sign"
            ></textarea>
            <button className="button" onClick={handleSign}>
              Sign message
            </button>
            {!!signedMessage && (
              <div className="mb-4 flex w-full flex-row gap-2">
                <label className="text-lg font-semibold text-gray-900 dark:text-white">
                  Signed message:
                </label>
                <div className="whitespace-pre-wrap break-all text-lg">
                  {signedMessage}
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            className="button"
            onClick={handleConnectMetamask}
          >
            Connect metamask
          </button>
        )}
      </main>
    </>
  );
};

Home.getLayout = renderMainLayout;
export default Home;
