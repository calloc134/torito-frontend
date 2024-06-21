import { useServerDataContext } from "@/context/useServerDataContext";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { MutationDataCallback } from "@/utils/mutationData";
import { useState } from "react";
import toast from "react-hot-toast";
import { Progress } from "./ui/progress";

export const MainPanel = () => {
  const {
    data,
    mutationData,
    updateUseDefaultBridges,
    updateBridgeText,
    updateProxyText,
  } = useServerDataContext();

  const [logTextArea, setLogTextArea] = useState("");
  const [percent, setPercent] = useState(0);

  return (
    <div className="flex flex-row w-full h-full gap-4 p-2">
      <div className="flex flex-col w-1/2 gap-2">
        <div className="flex flex-col h-1/2 gap-2">
          <h1>Bridge</h1>
          <div className="flex flex-row gap-2  items-center">
            <Checkbox
              checked={data.useDefaultBridges}
              onCheckedChange={() => {
                updateUseDefaultBridges(!data.useDefaultBridges);
              }}
            />
            <p>Use Default Bridges</p>
          </div>

          <Textarea
            value={data.BridgeText}
            onChange={(e) => {
              updateBridgeText(e.target.value);
            }}
            disabled={data.useDefaultBridges}
            className="h-full opacity-80 bg-gradient-to-tr from-indigo-100 to-indigo-300 rounded-2xl text-indigo-600"
          ></Textarea>
        </div>
        <div className="flex flex-col h-1/2 gap-2">
          <h1>Proxy</h1>
          <Textarea
            value={data.ProxyText}
            onChange={(e) => {
              updateProxyText(e.target.value);
            }}
            className="h-full opacity-80 bg-gradient-to-tr from-indigo-100 to-indigo-300 rounded-2xl text-indigo-900"
          ></Textarea>
        </div>
      </div>
      <div className="flex flex-col w-1/2 gap-2">
        <h1>Server Log</h1>
        <Progress
          value={percent}
          className="h-4 w-full bg-indigo-400 rounded-full"
        />
        <Textarea
          readOnly
          className="h-full opacity-80 bg-gradient-to-tr from-indigo-100 to-indigo-300 rounded-2xl text-indigo-900"
          value={logTextArea}
        ></Textarea>
        <Button
          onClick={async () => {
            setPercent(0);
            setLogTextArea("");
            toast("Connecting to Tor network...", {
              icon: "🛠️",
            });
            const result = await mutationData(
              ({ message, percent }: Parameters<MutationDataCallback>[0]) => {
                setLogTextArea((prev) => prev + `${message}: ${percent}%\n`);
                setPercent(percent);
              }
            );

            if (result.isErr()) {
              toast.error(
                `Failed to connect to Tor network: ${result.error.message}`
              );
              return;
            }

            toast.success(
              "Conguratulations! You have successfully connected to Tor network."
            );
          }}
          variant="secondary"
        >
          Connect to Tor Network
        </Button>
      </div>
    </div>
  );
};
