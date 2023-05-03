import { AppPropsWithLayout } from "@/model/common";
import "@/styles/globals.css";
import dynamic from "next/dynamic";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-dropzone-uploader/dist/styles.css";

// Fixes: Hydration failed because the initial UI does not match what was rendered on the server.
const Web3Provider = dynamic(
  () => import("@/context/web3").then((mod) => mod.Web3Provider),
  {
    ssr: false,
  }
);

export default function App({ Component, pageProps }: AppPropsWithLayout) {
  const renderApp = () => {
    const { getLayout } = Component;

    if (getLayout) {
      return getLayout(<Component {...pageProps} />);
    }
    return <Component {...pageProps} />;
  };

  return (
    <>
      <Web3Provider>{renderApp()}</Web3Provider>
      <ToastContainer />
    </>
  );
}
