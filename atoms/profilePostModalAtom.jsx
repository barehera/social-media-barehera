import { atom } from "recoil";

export const profilePostModalAtom = atom({
  key: "profilePostModalAtom",
  default: false,
});

export const profileUserPost = atom({
  key: "profileUserPost",
  default: { id: null },
});
