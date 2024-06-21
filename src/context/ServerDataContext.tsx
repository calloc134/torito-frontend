import { createContext } from "react";
import { ServerDataContextType } from "./ServerDataContextType";
import { err } from "neverthrow";

export const serverDataContext = createContext<ServerDataContextType>({
  data: {
    useBridge: false,
    useDefaultBridges: false,
    BridgeText: "dummy",
    ProxyText: "dummy",
    others: [],
  },
  mutationData: async () => err(new Error("not implemented")),
  updateUseDefaultBridges: () => {},
  updateBridgeText: () => {},
  updateProxyText: () => {},
});
