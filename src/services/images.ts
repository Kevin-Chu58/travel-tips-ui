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
    "images",
    file,
    name,
    undefined
  );
};

const updateImageName = async (id: number, name: string): Promise<void> => {

  return await http.patch(
    http.apiBaseURLs.api,
    `images/${id}/name/${name}`,
    undefined,
    undefined
  );
};

const deleteImage = async (id: number): Promise<number> => {
  return await http.del(
    http.apiBaseURLs.api,
    `images/${id}`,
    undefined,
    undefined
  );
};

export const ImagesService = {
  getMyImages,
  uploadImage,
  updateImageName,
  deleteImage,
};
