import { atom } from "recoil";

export const modalState = atom({
  key: "modalState",
  default: false,
});

export const editModalState = atom({
  key: "editModalState",
  default: false,
});
