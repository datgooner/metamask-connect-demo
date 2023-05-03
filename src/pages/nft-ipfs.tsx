import Loading from "@/components/common/Loading";
import renderMainLayout from "@/layouts/main.layout";
import Head from "next/head";
import Image from "next/image";
import React, { useState, useCallback, useRef } from "react";
import Moralis from "moralis";
import { toast } from "react-toastify";

type Props = {};

const NFTIpfs = (props: Props) => {
  const [image, setImage] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [imageIpfsRes, setImageIpfsRes] = useState("");
  const [dataIpfsRes, setDataIpfsRes] = useState("");
  console.log(
    "🚀 ~ file: nft-ipfs.tsx:16 ~ NFTIpfs ~ dataIpfsRes:",
    dataIpfsRes
  );

  const metadataRef = useRef<HTMLTextAreaElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  const handleUploadImage = useCallback(async () => {
    const reader = new FileReader();
    reader.onload = async function () {
      if (reader.result) {
        try {
          setIsLoading(true);
          const base64String = (reader.result as string)
            .replace("data:", "")
            .replace(/^.+,/, "");

          const abi = [{ path: `${image.name}`, content: base64String }];
          const res = await Moralis.EvmApi.ipfs.uploadFolder({ abi });
          const jsonRes = res.toJSON();
          if (jsonRes.length) {
            setImageIpfsRes(jsonRes[0].path);
          }
        } catch (error) {
          console.log("🚀 ~ file: nft-ipfs.tsx:33 ~ error:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    reader.readAsDataURL(image);
  }, [image]);

  const handleUpload = useCallback(async () => {
    if (!nameRef.current?.value.trim()) return toast.error("Empty value");
    const json = metadataRef.current?.value;
    if (!json) return toast.error("Empty value");
    let metadataJson;
    try {
      metadataJson = JSON.parse(json);
    } catch (error) {
      return toast.error("Invalid json format");
    }
    try {
      setIsLoading(true);
      const abi = [
        {
          path: `demonftc2/${nameRef.current?.value.trim()}`,
          content: metadataJson,
        },
      ];
      const response = await Moralis.EvmApi.ipfs.uploadFolder({ abi });
      if (response.toJSON().length) setDataIpfsRes(response.toJSON()[0].path);
    } catch (error) {
      console.log("🚀 ~ file: nft-ipfs.tsx:61 ~ handleUpload ~ error:", error);
      //   toast.error(error.toString());
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <>
      <Head>
        <title>NFT IPFS Upload</title>
      </Head>
      <main className="mx-auto my-10 flex max-w-5xl flex-col gap-10 px-10">
        <section>
          <div className="mb-4 flex flex-col">
            <label className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              Image to IPFS:
            </label>
            <input
              placeholder="Upload your image"
              className="input"
              type="file"
              onChange={(e) => setImage(e.target.files?.[0])}
            ></input>
          </div>
          {!!image && (
            <div className="mb-2">
              <Image
                className="mb-2"
                src={URL.createObjectURL(image)}
                alt=""
                width={400}
                height={400}
              ></Image>
              <button className="button" onClick={handleUploadImage}>
                Upload to IPFS
              </button>
            </div>
          )}
          {!!imageIpfsRes && (
            <div>
              <label className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Result:
              </label>
              <div>{imageIpfsRes}</div>
            </div>
          )}
        </section>
        <section>
          <div className="mb-4 flex flex-col">
            <label className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
              Metadata to IPFS (JSON format):
            </label>
            <input
              ref={nameRef}
              placeholder="Enter unique name"
              className="input mb-2"
            ></input>
            <textarea
              ref={metadataRef}
              placeholder="Enter nft metadata"
              className="input"
              rows={10}
            ></textarea>
          </div>
          <div className="mb-4 flex flex-col">
            <button className="button" onClick={handleUpload}>
              Upload to IPFS
            </button>
          </div>

          {!!dataIpfsRes && (
            <div>
              <label className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
                Result:
              </label>
              <div>{dataIpfsRes}</div>
            </div>
          )}
        </section>
        {isLoading && <Loading />}
      </main>
    </>
  );
};

NFTIpfs.getLayout = renderMainLayout;
export default NFTIpfs;
