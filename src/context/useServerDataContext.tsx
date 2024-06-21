import { useContext } from "react";
import { serverDataContext } from "./ServerDataContext";

export const useServerDataContext = () => {
  return useContext(serverDataContext);
};
