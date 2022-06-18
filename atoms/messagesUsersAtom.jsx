import { atom } from "recoil";

export const messagesUsers = atom({
  key: "messagesUsers",
  default: [],
});

export const messagesSelectedUser = atom({
  key: "messagesSelectedUser",
  default: null,
});
