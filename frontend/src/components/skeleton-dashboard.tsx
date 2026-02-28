 import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
 
 const SkeletonDashboard = () => {
  return (
    <div className="flex flex-col gap-y-4">
      <Skeleton className="w-30 h-10 rounded-md" />
      <div className="grid grid-cols-3 gap-3">
        <Skeleton className="rounded-md h-24" />
        <Skeleton className="rounded-md h-24" />
        <Skeleton className="rounded-md h-24" />
      </div>
      <Skeleton className="w-full h-70 rounded-md" />
      <Card className="w-full">
        <CardContent className="grid grid-cols-[2fr_2fr_0.5fr] gap-x-3">
          <Skeleton className="h-10 rounded-md" />
          <Skeleton className="h-10 rounded-md" />
          <Skeleton className="h-10 rounded-md" />
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 gap-x-3">
        <Skeleton className="h-50 rounded-md" />
        <Skeleton className="h-50 rounded-md" />
      </div>
    </div>
  );
}

export default SkeletonDashboard;