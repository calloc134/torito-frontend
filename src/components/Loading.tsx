import { RotateLoader } from "react-spinners";

export const Loading = (
  <div className="flex flex-col items-center justify-center gap-4 p-16 rounded-2xl bg-white dark:bg-gray-800 shadow-lg">
    <p className="text-2xl font-bold">Loading...</p>
    <RotateLoader color="#6366F1" />
  </div>
);
