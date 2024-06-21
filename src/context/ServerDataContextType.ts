import { ServerData } from "@/types/ServerData";
import { MutationDataCallback } from "@/utils/mutationData";
import { Result } from "neverthrow";

export type ServerDataContextType = {
  data: ServerData;
  mutationData: (
    callback: MutationDataCallback
  ) => Promise<Result<void, Error>>;
  updateUseDefaultBridges: (value: boolean) => void;
  updateBridgeText: (value: string) => void;
  updateProxyText: (value: string) => void;
};
