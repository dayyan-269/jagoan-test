export const DIALOGUE_STATE = {
  EDIT: "edit",
  DELETE: "delete",
  CREATE: "create",
  CLOSE: "close",
  DETAIL: "detail",
  DETAIL_1: "detail_1",
  DETAIL_2: "detail_2",
} as const;

export type DialogueType = (typeof DIALOGUE_STATE)[keyof typeof DIALOGUE_STATE];