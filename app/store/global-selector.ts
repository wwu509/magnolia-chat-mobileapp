import {RootState} from "@/app/store/global-slice";

export const globalSelector = (state: RootState) => {
  const name = state.global.name;
  const user = state.global.user;
  return { name, user };
};
