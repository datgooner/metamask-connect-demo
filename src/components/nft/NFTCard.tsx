import { fetchImageUrl } from "@/utils/metadata";
import Image from "next/image";
import React, { useEffect, useState } from "react";

type Props = {
  nft: any;
};

export default function NFTCard({ nft }: Props) {
  const [imgSrc, setImgSrc] = useState(nft.metaData.image);

  const handleImageError = async () => {
    try {
      const newSrc = await fetchImageUrl(nft.metaData.image);
      setImgSrc(newSrc);
    } catch (error) {
      console.log(
        "🚀 ~ file: NFTCard.tsx:17 ~ handleImageError ~ error:",
        error
      );
    }
  };

  return (
    <div className="card m-8 flex flex-row gap-4 p-8">
      <div className="">
        {!!nft.metaData?.image && (
          <Image
            alt=""
            src={imgSrc}
            className="object-cover"
            width={400}
            height={400}
            sizes="100vw"
            style={{ maxWidth: "400px" }}
            onError={handleImageError}
          />
        )}
      </div>
      <div className="flex-1 overflow-auto">
        {Object.keys(nft).map((item, index) => (
          <div key={String(index)}>
            <label className="text-lg font-bold">{item}: </label>
            <span className="text-clip">{JSON.stringify(nft[item])}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
