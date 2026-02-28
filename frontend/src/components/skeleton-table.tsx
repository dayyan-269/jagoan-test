import { Skeleton } from "@/components/ui/skeleton";

const SkeletonTable = () => {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="w-30 h-10 rounded-md" />
      <Skeleton className="w-40 h-10 rounded-md self-end" />
      <div className="grid">
        <Skeleton className="h-50 rounded-md" />
      </div>
    </div>
  );
};

export default SkeletonTable;
