import { atom } from "recoil";

export const messagesUsers = atom({
  key: "messagesUsers",
  default: [],
});

export const messagesSelectedUser = atom({
  key: "messagesSelectedUser",
  default: null,
});

export const unreadMessagesCount = atom({
  key: "unreadMessagesCount",
  default: 0,
});
