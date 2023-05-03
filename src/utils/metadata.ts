import { startCase } from "lodash";

export const regexUrl = /(\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif))$/i;

export const resolveLink = (url: string) => {
  let newUrl = url || "";

  if (newUrl.endsWith(".json")) {
    const arrUrl = newUrl.split("/");
    arrUrl[arrUrl.length - 1] = arrUrl[arrUrl.length - 1].replace(/0/g, "");
    newUrl = arrUrl.join("/");
  }

  if (newUrl.startsWith("https://ipfs.moralis.io:2053/")) {
    newUrl = newUrl.replace(
      "https://ipfs.moralis.io:2053/",
      "https://gateway.ipfs.io/"
    );
  }

  if (!newUrl || !newUrl.includes("ipfs://")) return newUrl;
  newUrl = newUrl.replace("ipfs://", "https://gateway.ipfs.io/ipfs/");
  return newUrl;
};

export const fetchImageUrl = (url: string) => {
  const newUrl = resolveLink(url);
  return fetch(newUrl)
    .then((response) => response.json())
    .then((data) => data);
};

export async function handleResolveMetaData(nftItems: any[]) {
  const result = new Array(nftItems.length);
  for (let i = 0; i < nftItems.length; i++) {
    const nftItem = nftItems[i];
    result[i] = await parseMetaDataToMoralis(nftItem);
  }
  return result;
}

export async function parseMetaDataToMoralis(data: any) {
  const newNFT: any = data;

  if (!newNFT?.metadata?.includes("image") && newNFT?.tokenUri) {
    try {
      if (regexUrl.test(newNFT?.tokenUri?.toString())) {
        newNFT.image = newNFT?.tokenUri;
      } else {
        newNFT.metaData = await fetchImageUrl(newNFT?.tokenUri.toString());

        if (
          newNFT.metaData?.image &&
          !newNFT.metaData.image.startsWith("http")
        ) {
          newNFT.metaData.image = resolveLink(newNFT.metaData.image);
        }
      }
    } catch (error) {
      //TODO handle Error
      newNFT.metaData = undefined;
    }

    return newNFT;
  }

  if (newNFT?.metadata) {
    const newMetaData = JSON.parse(newNFT.metadata || "");
    const { attributes } = newMetaData;

    if (newNFT.metadata.includes("imageUrl")) {
      newMetaData.image = resolveLink(newMetaData?.imageUrl);
    }

    if (newNFT.metadata.includes("animation_url")) {
      newMetaData.animationUrl = resolveLink(newMetaData?.animation_url);
    }

    if (newMetaData?.image?.startsWith("ipfs://")) {
      newMetaData.image = resolveLink(newMetaData.image);
    }

    if (!Array.isArray(attributes)) {
      try {
        const newAttributes: any[] = [];
        for (const key in attributes) {
          const item = {
            trait_type: startCase(key),
            value: attributes[key],
          };
          newAttributes.push(item);
        }
        newMetaData.attributes = newAttributes;
      } catch (error) {
        //TODO handle Error
      }
    }

    newNFT.metaData = newMetaData;
  }

  return newNFT;
}
