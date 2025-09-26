import http from "./http";

export type Image = {
  id: number;
  guid: string;
  name: string | undefined;
  url: string | undefined;
  createdBy: number;
};

export type ImageRelation = {
  id: number;
  relationId: number;
  imageId: number;
};

const getMyImages = async (): Promise<Image[]> => {
  return await http.get(http.apiBaseURLs.api, "images/my", undefined);
};

const uploadImage = async (
  file: Blob | File,
  name?: string
): Promise<Image> => {
  return await http.postImage(
    http.apiBaseURLs.api,
    "images/upload",
    file,
    name,
    undefined
  );
};

export const ImagesService = {
  getMyImages,
  uploadImage,
};
