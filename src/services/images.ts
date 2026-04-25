import { ImageUtils } from "@utils/ImageUtils";
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

// images

const getMyImages = async (): Promise<Image[]> => {
  return await http.get(http.apiBaseURLs.api, "images/my", undefined);
};

const uploadImage = async (
  file: Blob | File,
  name?: string,
): Promise<Image> => {
  return await http.postImage(
    http.apiBaseURLs.api,
    "images",
    file,
    name,
    undefined,
  );
};

const downloadImage = async (id: number): Promise<Blob> => {
  const res: { base64: string } = await http.get(
    http.apiBaseURLs.api,
    `images/download/${id}`,
    undefined,
  );

  const base64 = ImageUtils.addImagePrefix(res.base64);
  return http.dataURItoBlob(base64);
};

const updateImageName = async (id: number, name: string): Promise<void> => {
  return await http.patch(
    http.apiBaseURLs.api,
    `images/${id}/name/${name}`,
    undefined,
    undefined,
  );
};

const deleteImage = async (id: number): Promise<number> => {
  return await http.del(
    http.apiBaseURLs.api,
    `images/${id}`,
    undefined,
    undefined,
  );
};

// banner images

const getBannerImages = async (): Promise<Image[]> => {
  return await http.get(http.apiBaseURLs.api, "images/banner", undefined);
};

const uploadBannerImage = async (
  file: Blob | File,
  name?: string,
): Promise<Image> => {
  return await http.postImage(
    http.apiBaseURLs.api,
    "images/banner",
    file,
    name,
    undefined,
  );
};

const updateBannerImageName = async (
  id: number,
  name: string,
): Promise<void> => {
  return await http.patch(
    http.apiBaseURLs.api,
    `images/banner/${id}/name/${name}`,
    undefined,
    undefined,
  );
};

const deleteBannerImage = async (id: number): Promise<number> => {
  return await http.del(
    http.apiBaseURLs.api,
    `images/banner/${id}`,
    undefined,
    undefined,
  );
};

// business images

const uploadBusinessImage = async (
  businessId: number,
  file: Blob | File,
): Promise<Image> => {
  return await http.postImage(
    http.apiBaseURLs.api,
    `images/business/${businessId}`,
    file,
    undefined,
    undefined,
  );
};

const deleteBusinessImage = async (id: number): Promise<void> => {
  return await http.del(
    http.apiBaseURLs.api,
    `images/business/${id}`,
    undefined,
    undefined,
  );
};

export const imagesService = {
  // images
  getMyImages,
  uploadImage,
  downloadImage,
  updateImageName,
  deleteImage,
  // banner images
  getBannerImages,
  uploadBannerImage,
  updateBannerImageName,
  deleteBannerImage,
  // business images
  uploadBusinessImage,
  deleteBusinessImage,
};
