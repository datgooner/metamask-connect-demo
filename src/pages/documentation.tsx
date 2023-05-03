import renderMainLayout from "@/layouts/main.layout";
import Head from "next/head";
import React from "react";

type Props = {};

const exampleMetadata = `{
    "attributes": [
      {
        "value": "none",
        "trait_type": "accessories"
      },
      {
        "value": "green",
        "trait_type": "background"
      },
      {
        "value": "Indian wolf",
        "trait_type": "body"
      },
      {
        "value": "sweat skull WH",
        "trait_type": "clothes"
      },
      {
        "value": "cool",
        "trait_type": "eye"
      },
      {
        "value": "none",
        "trait_type": "eyewear"
      },
      {
        "value": "beanie B BE",
        "trait_type": "headgear"
      },
      {
        "value": "I wolf o",
        "trait_type": "mouth"
      },
      {
        "value": "none",
        "trait_type": "necklace"
      }
    ],
    "description": "",
    "image": "ipfs://bafybeibsqyszxkxltv7buxvowmubrnwnqf6ga5voe5zpfzcbfgvvyrcb3a",
    "name": " ROAR #10519"
  }`;
const Documentation = ({}: Props) => {
  return (
    <>
      <Head>
        <title>Documentation</title>
      </Head>
      <main className="mx-auto my-10 flex flex-col gap-10 px-10">
        <section className="w-100 flex flex-col">
          <label>NFT Metadata example</label>
          <textarea
            className="input mt-2"
            defaultValue={exampleMetadata}
            rows={30}
          ></textarea>
        </section>
      </main>
    </>
  );
};
Documentation.getLayout = renderMainLayout;

export default Documentation;
