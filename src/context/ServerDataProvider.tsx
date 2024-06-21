import { useState } from "react";
import { fetchData } from "@/utils/fetchData";
// mutationDataはあえてメモ化しない方が良さそうだ
import {
  mutationData as mutationDataFromUtils,
  MutationDataCallback,
} from "@/utils/mutationData";
import { Result } from "neverthrow";
import { serverDataContext } from "./ServerDataContext";

export const ServerDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [data, setData] = useState(fetchData());

  const mutationData = async (
    callback: MutationDataCallback
  ): Promise<Result<void, Error>> => {
    const result = await mutationDataFromUtils(data, callback);
    return result;
  };

  const updateUseDefaultBridges = (value: boolean) => {
    setData({ ...data, useDefaultBridges: value });
  };

  const updateBridgeText = (value: string) => {
    setData({ ...data, BridgeText: value });
  };

  const updateProxyText = (value: string) => {
    setData({ ...data, ProxyText: value });
  };

  return (
    <serverDataContext.Provider
      value={{
        data,
        mutationData,
        updateUseDefaultBridges,
        updateBridgeText,
        updateProxyText,
      }}
    >
      {children}
    </serverDataContext.Provider>
  );
};
