import { ServerData } from "@/types/ServerData";
import { ok, err, Result } from "neverthrow";

export type MutationDataCallback = ({
  message,
  percent,
}: {
  message: string;
  percent: number;
}) => void;

export const mutationData = async (
  data: ServerData,
  callback: MutationDataCallback
): Promise<Result<void, Error>> => {
  const mutationData = async (
    url: string,
    data: ServerData,
    callback: MutationDataCallback
  ) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      return err(new Error("fetch error"));
    }

    if (!response.body) {
      return err(new Error("fetch error"));
    }

    const reader = response.body.getReader();

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      // もしerror: から始まる文字列が来たらエラーとして扱う
      if (
        value[0] === 101 &&
        value[1] === 114 &&
        value[2] === 114 &&
        value[3] === 111 &&
        value[4] === 114 &&
        value[5] === 58
      ) {
        const text = new TextDecoder().decode(value);
        return err(new Error(text));
      }

      const text = new TextDecoder().decode(value);
      // サーバのメッセージの形式は以下の通り
      // {message}: {percent}%
      // 正規表現でパースする
      // タグを利用
      const match = text.match(/(?<message>.+): (?<percent>\d+)%/);

      if (match) {
        callback({
          message: match.groups?.message ?? "",
          percent: parseInt(match.groups?.percent ?? "0"),
        });
      } else {
        callback({ message: text, percent: 0 });
      }
    }

    return ok(undefined);
  };

  return await mutationData("http://localhost:3001/torrc", data, callback);
};
