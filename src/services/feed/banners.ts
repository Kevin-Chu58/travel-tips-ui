// banner

import http, { type SearchResults } from "@services/http";
import type { Image } from "@services/images";

export type BannerSimpleBasic = {
  title: string;
  link: string;
  from: string;
  to?: string;
  label?: string;
  subLabel?: string;
};

export type BannerBasic = BannerSimpleBasic & {
  overview: string;
};

export type BannerPost = BannerBasic & {
  imageId: number;
  stylingId?: number;
};

export type BannerSimple = BannerSimpleBasic & {
  id: number;
};

export type Banner = BannerBasic & {
  id: number;
  picture?: Image;
  styling?: BannerStyling;
};

export type BannerPatch = {
  title?: string;
  overview?: string;
  imageId?: number;
  link?: string;
  from?: string;
  to?: string;
  label?: string;
  subLabel?: string;
  stylingId?: number;
};

// banner styling

export type BannerStylingSimple = {
  id: number;
  name: string;
};

export type BannerStyling = BannerStylingSimple & {
  styling?: string;
};

export type BannerStylingPatch = {
  name?: string;
  styling?: string;
};

// requests - banners

const getPublicBanners = async (): Promise<Banner[]> => {
  return await http.get(http.apiBaseURLs.api, "banners/public", undefined);
};

const getBannerById = async (id: number): Promise<Banner> => {
  return await http.get(http.apiBaseURLs.api, `banners/${id}`, undefined);
};

const getBanners = async (
  cursor?: string,
  limit?: string,
): Promise<SearchResults<BannerSimple>> => {
  const _params = new URLSearchParams();

  if (cursor) _params.append("cursor", cursor);
  if (limit) _params.append("limit", limit.toString());

  return await http.get(
    http.apiBaseURLs.api,
    `banners/all?${_params.toString()}`,
    undefined,
  );
};

const postBanner = async (newBanner: BannerPost): Promise<Banner> => {
  const body = JSON.stringify(newBanner);

  return await http.post(http.apiBaseURLs.api, "banners", body, undefined);
};

const updateBanner = async (
  bannerId: number,
  bannerPatch: BannerPatch,
): Promise<void> => {
  const body = JSON.stringify(bannerPatch);

  return await http.patch(
    http.apiBaseURLs.api,
    `banners/${bannerId}`,
    body,
    undefined,
  );
};

const deleteBanner = async (bannerId: number): Promise<void> => {
  return await http.del(
    http.apiBaseURLs.api,
    `banners/${bannerId}`,
    undefined,
    undefined,
  );
};

// requests - banner stylings

const getBannerStylings = async (): Promise<BannerStylingSimple[]> => {
  return await http.get(http.apiBaseURLs.api, "banners/stylings", undefined);
};

const getBannerStylingById = async (id: number): Promise<BannerStyling> => {
  return await http.get(
    http.apiBaseURLs.api,
    `banners/stylings/${id}`,
    undefined,
  );
};

const createBannerStyling = async (
  name: string,
  styling: string,
): Promise<BannerStyling> => {
  const body = JSON.stringify(styling);

  return await http.post(
    http.apiBaseURLs.api,
    `banners/stylings/${name}`,
    body,
    undefined,
  );
};

const updateBannerStyling = async (
  id: number,
  bannerStylingPatch: BannerStylingPatch,
): Promise<BannerStyling> => {
  const body = JSON.stringify(bannerStylingPatch);

  return await http.patch(
    http.apiBaseURLs.api,
    `banners/stylings/${id}`,
    body,
    undefined,
  );
};

export const bannersService = {
  // banners
  getPublicBanners,
  getBannerById,
  getBanners,
  postBanner,
  updateBanner,
  deleteBanner,
  // banner stylings
  getBannerStylings,
  getBannerStylingById,
  createBannerStyling,
  updateBannerStyling,
};
