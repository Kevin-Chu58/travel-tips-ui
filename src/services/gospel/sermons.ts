import http, { type SearchResult } from "@services/http";
import type { UserSimple } from "@services/users";

// sermons

export type SermonPost = {
  title: string;
  content: string;
  labelId?: number;
  publishAt: string;
  isBanner?: boolean;
};

export type Sermon = {
  id: number;
  title: string;
  content?: string;
  createdBy: UserSimple;
  label?: SermonLabelComplete;
  publishAt: string;
  isBanner: boolean;
};

export type SermonPatch = {
  title?: string;
  content?: string;
  labelId?: number;
  publishAt?: string;
  isBanner?: boolean;
};

// sermon labels

export type SermonLabelType = "Category" | "Topic";

export type SermonLabel = {
  id: number;
  name: string;
  slug: string;
  parentLabelId?: number;
  type: SermonLabelType;
};

export type SermonLabelComplete = {
  category?: SermonLabel;
  topic?: SermonLabel;
};

export type SermonLabelSearchResult = {
  categories?: SermonLabel[];
  topics?: SermonLabel[];
};

// search params

export type SermonSearchParams = {
  createdByAuthId?: string;
  title?: string;
  labelSlug?: string;
  isBanner?: boolean;
  isRestricted?: boolean;
  isDesc?: boolean;
};

export type SermonLabelSearchParams = {
  name?: string;
  parentLabelId?: number;
  type?: SermonLabelType;
  timestamp?: number;
};

// requests - sermons

const getSermonsByParams = async (
  params: SermonSearchParams,
): Promise<Sermon[]> => {
  const _params = new URLSearchParams();

  if (params.createdByAuthId)
    _params.append("createdByAuthId", params.createdByAuthId);
  if (params.title) _params.append("title", params.title);
  if (params.labelSlug) _params.append("labelSlug", params.labelSlug);
  if (params.isBanner !== undefined) {
    _params.append("isBanner", params.isBanner.toString());
  }
  if (params.isRestricted !== undefined) {
    _params.append("isRestricted", params.isRestricted.toString());
  }
  if (params.isDesc !== undefined) {
    _params.append("isDesc", params.isDesc.toString());
  }

  return await http.get(http.apiBaseURLs.api, `sermons?${_params.toString()}`);
};

const getSermonById = async (
  id: number,
  isRestricted: boolean = false,
): Promise<Sermon> => {
  const _params = new URLSearchParams();

  if (isRestricted !== undefined) {
    _params.append("isRestricted", isRestricted.toString());
  }

  return await http.get(
    http.apiBaseURLs.api,
    `sermons/${id}?${_params.toString()}`,
  );
};

const getSermonByLabelOrder = async (
  labelSlug: string,
  orderId: number,
): Promise<Sermon> => {
  return await http.get(
    http.apiBaseURLs.api,
    `sermons/${labelSlug}/${orderId}`,
  );
};

const getSermonOrderById = async (id: number): Promise<number> => {
  return await http.get(http.apiBaseURLs.api, `sermons/order/${id}`);
};

const getLatestSermons = async (): Promise<Sermon[]> => {
  return await http.get(http.apiBaseURLs.api, "sermons/latest");
};

const getMySermons = async (): Promise<Sermon[]> => {
  return await http.get(http.apiBaseURLs.api, "sermons/my");
};

const postNewSermon = async (newSermon: SermonPost): Promise<Sermon> => {
  const body = JSON.stringify(newSermon);

  return await http.post(http.apiBaseURLs.api, "sermons", body, undefined);
};

const patchSermon = async (
  id: number,
  sermon: SermonPatch,
): Promise<Sermon> => {
  const body = JSON.stringify(sermon);

  return await http.patch(
    http.apiBaseURLs.api,
    `sermons/${id}`,
    body,
    undefined,
  );
};

const deleteSermon = async (id: number): Promise<number> => {
  return await http.del(
    http.apiBaseURLs.api,
    `sermons/${id}`,
    undefined,
    undefined,
  );
};

// requests - sermon labels

const getSermonLabelsByParams = async (
  params: SermonLabelSearchParams,
): Promise<SearchResult<SermonLabelSearchResult>> => {
  const _params = new URLSearchParams();

  if (params.name) _params.append("name", params.name);
  if (params.parentLabelId)
    _params.append("parentLabelId", params.parentLabelId.toString());
  if (params.type) _params.append("type", params.type);
  if (params.timestamp)
    _params.append("timestamp", params.timestamp.toString());

  return await http.get(
    http.apiBaseURLs.api,
    `sermons/labels?${_params.toString()}`,
    undefined,
  );
};

const getSermonLabelCompleteBySlug = async (
  slug: string,
): Promise<SermonLabelComplete> => {
  return await http.get(
    http.apiBaseURLs.api,
    `sermons/labels/${slug}`,
    undefined,
  );
};

const postNewSermonLabel = async (
  name: string,
  type: SermonLabelType,
  parentLabelId?: number,
): Promise<SermonLabel> => {
  const _params = new URLSearchParams();

  _params.append("name", name);
  _params.append("type", type);
  if (parentLabelId) _params.append("parentLabelId", parentLabelId.toString());

  return await http.post(
    http.apiBaseURLs.api,
    `sermons/labels?${_params.toString()}`,
    undefined,
    undefined,
  );
};

const updateSermonLabel = async (
  id: number,
  name: string,
  parentLabelId?: number,
): Promise<SermonLabel> => {
  const _params = new URLSearchParams();

  _params.append("name", name);
  if (parentLabelId) _params.append("parentLabelId", parentLabelId.toString());

  return await http.patch(
    http.apiBaseURLs.api,
    `sermons/labels/${id}?${_params.toString()}`,
    undefined,
    undefined,
  );
};

const deleteSermonLabel = async (id: number): Promise<number> => {
  return await http.del(
    http.apiBaseURLs.api,
    `sermons/labels/${id}`,
    undefined,
    undefined,
  );
};

export const sermonsService = {
  // sermons
  getSermonsByParams,
  getSermonById,
  getSermonByLabelOrder,
  getSermonOrderById,
  getLatestSermons,
  getMySermons,
  postNewSermon,
  patchSermon,
  deleteSermon,
  // sermon labels
  getSermonLabelsByParams,
  getSermonLabelCompleteBySlug,
  postNewSermonLabel,
  updateSermonLabel,
  deleteSermonLabel,
};
