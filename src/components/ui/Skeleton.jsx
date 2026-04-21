export default function Skeleton({ className = '', style }) {
  return <div className={`shimmer rounded-md ${className}`} style={style} />;
}

export function CardSkeleton({ width = 180 }) {
  return (
    <div className="flex flex-col gap-3" style={{ width }}>
      <Skeleton className="aspect-square w-full rounded-xl" />
      <Skeleton className="h-3 w-4/5" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

export function RowSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-lg px-3 py-2">
      <Skeleton className="h-10 w-10 rounded" />
      <div className="flex-1">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="mt-2 h-3 w-1/4" />
      </div>
      <Skeleton className="h-3 w-10" />
    </div>
  );
}
