import ListTool from "@components/ListTool";
import { useEffect, type JSX } from "react";

type ImagesToolProps = {
  addOnClick: () => void;
  addInput: JSX.Element;
  getMyImages: () => void;
};

const ImagesTool = ({ addOnClick, addInput, getMyImages }: ImagesToolProps) => {
  // render on init
  useEffect(() => {
    getMyImages();
  }, []);

  return (
    <ListTool
      addOnClick={addOnClick}
      addInput={addInput}
      addIcon="upload"
      addLabel="Upload Image"
    />
  );
};

export default ImagesTool;
