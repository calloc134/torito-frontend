import { ServerData } from "@/types/ServerData";

export const fetchData = (): ServerData => {
  const fetchdata = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("fetch error");
    }
    const data = await response.json();
    return data;
  };

  if (!dataCache) {
    throw new Promise((resolve, reject) => {
      fetchdata("http://localhost:3001/torrc")
        .then((data) => {
          dataCache = data;
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  return dataCache;
};

let dataCache: ServerData | undefined = undefined;
