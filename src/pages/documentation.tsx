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

const demoSCCode = `pragma solidity >=0.8.2 <0.9.0;

  import "@openzeppelin/contracts/utils/Counters.sol";
  import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
  import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
  
  contract DemoNFTC2 is ERC721URIStorage {
      using Counters for Counters.Counter;
      Counters.Counter private _tokenIds;
  
      constructor() ERC721("Demo NFT", "C2NFT") {}
  
      function createToken(string memory tokenURI) public returns (uint256) {
          _tokenIds.increment();
          uint256 newItemId = _tokenIds.current();
  
          _mint(msg.sender, newItemId);
          _setTokenURI(newItemId, tokenURI);
  
          return newItemId;
      }
  }
  `;
const Documentation = ({}: Props) => {
  return (
    <>
      <Head>
        <title>Documentation</title>
      </Head>
      <main className="mx-auto my-10 flex flex-col gap-10 px-10">
        <section className="w-100 flex flex-col">
          <label className="font-bold">NFT Metadata example</label>
          <textarea
            className="input mt-2"
            defaultValue={exampleMetadata}
            rows={30}
          ></textarea>
        </section>

        <section className="w-100 flex flex-col">
          <label className="font-bold">Demo SC code</label>
          <textarea
            className="input mt-2"
            defaultValue={demoSCCode}
            rows={30}
          ></textarea>
        </section>
      </main>
    </>
  );
};
Documentation.getLayout = renderMainLayout;

export default Documentation;
