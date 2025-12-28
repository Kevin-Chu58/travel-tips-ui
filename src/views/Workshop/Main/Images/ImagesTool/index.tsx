import ListTool from "@components/ListTool";
import type { SortType } from "@constants/Types";
import type { Image } from "@services/images";
import SortUtils from "@utils/SortUtils";
import React, { useEffect, type JSX } from "react";

type ImagesToolProps = {
  sortTypes: SortType[];
  sortTypeIndex: number;
  setSortTypeIndex: (state: number) => void;
  addOnClick: () => void;
  addInput: JSX.Element;
  imagesRef: React.RefObject<Image[]>;
  getMyImages: () => void;
  asyncImages: (state: Image[]) => void;
};

const ImagesTool = ({
  sortTypes,
  sortTypeIndex,
  setSortTypeIndex,
  addOnClick,
  addInput,
  imagesRef,
  getMyImages,
  asyncImages,
}: ImagesToolProps) => {
  // render on init
  useEffect(() => {
    getMyImages();
  }, []);

  // rerender on sortTypeIndex to request sorting
  useEffect(() => {
    asyncImages(
      SortUtils.sortList(imagesRef.current, sortTypes, sortTypeIndex)
    );
  }, [sortTypeIndex]);

  return (
    <ListTool
      showSort
      sortType={sortTypeIndex}
      setSortType={setSortTypeIndex}
      sortTypes={sortTypes}
      addOnClick={addOnClick}
      addInput={addInput}
      addIcon="upload"
      addLabel="Upload Image"
    />
  );
};

export default ImagesTool;
