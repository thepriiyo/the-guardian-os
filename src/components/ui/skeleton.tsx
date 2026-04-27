import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("rounded-md bg-white/5 overflow-hidden relative", className)}
      {...props}
    >
      <div className="absolute inset-0 shimmer" />
    </div>
  )
}

export { Skeleton }
