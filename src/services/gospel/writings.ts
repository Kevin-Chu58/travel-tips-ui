import http, { type SearchResult } from "@services/http";
import type { UserSimple } from "@services/users";

// writings

export type WritingPost = {
  title: string;
  content: string;
  labelId?: number;
  publishAt: string;
  isBanner?: boolean;
};

export type Writing = {
  id: number;
  title: string;
  content?: string;
  createdBy: UserSimple;
  label?: WritingLabelComplete;
  publishAt: string;
  isBanner: boolean;
};

export type WritingPatch = {
  title?: string;
  content?: string;
  labelId?: number;
  publishAt?: string;
  isBanner?: boolean;
};

// Writing labels

export type WritingLabelType = "Category" | "Topic";

export type WritingLabel = {
  id: number;
  name: string;
  slug: string;
  parentLabelId?: number;
  type: WritingLabelType;
};

export type WritingLabelComplete = {
  category?: WritingLabel;
  topic?: WritingLabel;
};

export type WritingLabelSearchResult = {
  categories?: WritingLabel[];
  topics?: WritingLabel[];
};

// search params

export type WritingSearchParams = {
  createdByAuthId?: string;
  title?: string;
  labelSlug?: string;
  isRestricted?: boolean;
  isDesc?: boolean;
};

export type WritingLabelSearchParams = {
  name?: string;
  parentLabelId?: number;
  type?: WritingLabelType;
  timestamp?: number;
};

// requests - writings

const getWritingsByParams = async (
  params: WritingSearchParams,
): Promise<Writing[]> => {
  const _params = new URLSearchParams();

  if (params.createdByAuthId)
    _params.append("createdByAuthId", params.createdByAuthId);
  if (params.title) _params.append("title", params.title);
  if (params.labelSlug) _params.append("labelSlug", params.labelSlug);
  if (params.isRestricted !== undefined) {
    _params.append("isRestricted", params.isRestricted.toString());
  }
  if (params.isDesc !== undefined) {
    _params.append("isDesc", params.isDesc.toString());
  }

  return await http.get(http.apiBaseURLs.api, `writings?${_params.toString()}`);
};

const getWritingById = async (
  id: number,
  isRestricted: boolean = false,
): Promise<Writing> => {
  const _params = new URLSearchParams();

  if (isRestricted !== undefined) {
    _params.append("isRestricted", isRestricted.toString());
  }

  return await http.get(
    http.apiBaseURLs.api,
    `writings/${id}?${_params.toString()}`,
  );
};

const getWritingByLabelOrder = async (
  labelSlug: string,
  orderId: number,
): Promise<Writing> => {
  return await http.get(
    http.apiBaseURLs.api,
    `writings/${labelSlug}/${orderId}`,
  );
};

const getWritingOrderById = async (id: number): Promise<number> => {
  return await http.get(http.apiBaseURLs.api, `writings/order/${id}`);
};

const getMyWritings = async (): Promise<Writing[]> => {
  return await http.get(http.apiBaseURLs.api, "writings/my");
};

const postNewWriting = async (newWriting: WritingPost): Promise<Writing> => {
  const body = JSON.stringify(newWriting);

  return await http.post(http.apiBaseURLs.api, "writings", body, undefined);
};

const patchWriting = async (
  id: number,
  Writing: WritingPatch,
): Promise<Writing> => {
  const body = JSON.stringify(Writing);

  return await http.patch(
    http.apiBaseURLs.api,
    `writings/${id}`,
    body,
    undefined,
  );
};

const deleteWriting = async (id: number): Promise<number> => {
  return await http.del(
    http.apiBaseURLs.api,
    `writings/${id}`,
    undefined,
    undefined,
  );
};

// requests - Writing labels

const getWritingLabelsByParams = async (
  params: WritingLabelSearchParams,
): Promise<SearchResult<WritingLabelSearchResult>> => {
  const _params = new URLSearchParams();

  if (params.name) _params.append("name", params.name);
  if (params.parentLabelId)
    _params.append("parentLabelId", params.parentLabelId.toString());
  if (params.type) _params.append("type", params.type);
  if (params.timestamp)
    _params.append("timestamp", params.timestamp.toString());

  return await http.get(
    http.apiBaseURLs.api,
    `writings/labels?${_params.toString()}`,
    undefined,
  );
};

const getWritingLabelCompleteBySlug = async (
  slug: string,
): Promise<WritingLabelComplete> => {
  return await http.get(
    http.apiBaseURLs.api,
    `writings/labels/${slug}`,
    undefined,
  );
};

const postNewWritingLabel = async (
  name: string,
  type: WritingLabelType,
  parentLabelId?: number,
): Promise<WritingLabel> => {
  const _params = new URLSearchParams();

  _params.append("name", name);
  _params.append("type", type);
  if (parentLabelId) _params.append("parentLabelId", parentLabelId.toString());

  return await http.post(
    http.apiBaseURLs.api,
    `writings/labels?${_params.toString()}`,
    undefined,
    undefined,
  );
};

const updateWritingLabel = async (
  id: number,
  name: string,
  parentLabelId?: number,
): Promise<WritingLabel> => {
  const _params = new URLSearchParams();

  _params.append("name", name);
  if (parentLabelId) _params.append("parentLabelId", parentLabelId.toString());

  return await http.patch(
    http.apiBaseURLs.api,
    `writings/labels/${id}?${_params.toString()}`,
    undefined,
    undefined,
  );
};

const deleteWritingLabel = async (id: number): Promise<number> => {
  return await http.del(
    http.apiBaseURLs.api,
    `writings/labels/${id}`,
    undefined,
    undefined,
  );
};

export const writingsService = {
  // writings
  getWritingsByParams,
  getWritingById,
  getWritingByLabelOrder,
  getWritingOrderById,
  getMyWritings,
  postNewWriting,
  patchWriting,
  deleteWriting,
  // Writing labels
  getWritingLabelsByParams,
  getWritingLabelCompleteBySlug,
  postNewWritingLabel,
  updateWritingLabel,
  deleteWritingLabel,
};
