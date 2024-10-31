import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingState({ type = "default" }) {
  const loadingStates = {
    table: (
      <div className="flex flex-col justify-start rounded-md">
        <div className="mb-8 rounded-md bg-gray-100 dark:bg-gray-800 flex flex-col shadow-md p-4 w-full">
          <Skeleton className="h-8 w-32 mb-4" />
          <div className="bg-white rounded-md shadow-md p-4">
            <Skeleton className="h-[400px] w-full" />
          </div>
        </div>
      </div>
    ),
    card: (
      <div className="rounded-md p-4 bg-white shadow-md">
        <Skeleton className="h-4 w-24 mb-2" />
        <Skeleton className="h-8 w-16" />
      </div>
    ),
    default: <Skeleton className="w-full h-[200px]" />,
  };

  return loadingStates[type] || loadingStates.default;
}
