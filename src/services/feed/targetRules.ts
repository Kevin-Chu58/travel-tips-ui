import http from "@services/http";

export type TargetRule = {
  id: number;
  targetType: string;
  targetValue: string;
  minWeight: number;
};

const getTargetRulesByType = async (type: number): Promise<TargetRule[]> => {
  return await http.get(http.apiBaseURLs.api, `targetRules/${type}`, undefined);
};

const getTargetRule = async (
  type: number,
  value?: string,
): Promise<TargetRule | undefined> => {
  return await http.get(
    http.apiBaseURLs.api,
    `targetRules/${type}/value/${value}`,
    undefined,
  );
};

const postNewTargetRule = async (
  minWeight: number,
  targetType: number,
  targetValue?: string,
): Promise<TargetRule> => {
  let params = new URLSearchParams();
  params.append("minWeight", minWeight.toString());
  params.append("targetType", targetType.toString());
  if (targetValue) params.append("targetValue", targetValue);

  return await http.post(
    http.apiBaseURLs.api,
    `targetRules?${params.toString()}`,
    undefined,
    undefined,
  );
};

const updateTargetRuleMinWeight = async (
  id: number,
  minWeight: number,
  targetType: number,
  targetValue?: string,
): Promise<TargetRule> => {
  let params = new URLSearchParams();
  params.append("minWeight", minWeight.toString());
  params.append("targetType", targetType.toString());
  if (targetValue) params.append("targetValue", targetValue);

  return await http.patch(
    http.apiBaseURLs.api,
    `targetRules/${id}?${params.toString()}`,
    undefined,
    undefined,
  );
};

const deleteTargetRule = async (id: number): Promise<number> => {
  return await http.del(
    http.apiBaseURLs.api,
    `targetRules/${id}`,
    undefined,
    undefined,
  );
};

export const targetRulesService = {
  getTargetRulesByType,
  getTargetRule,
  postNewTargetRule,
  updateTargetRuleMinWeight,
  deleteTargetRule,
};
