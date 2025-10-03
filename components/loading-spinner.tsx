export function LoadingSpinner({ size = "default" }: { size?: "sm" | "default" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    default: "w-8 h-8",
    lg: "w-12 h-12",
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-primary border-t-transparent`} />
    </div>
  )
}
