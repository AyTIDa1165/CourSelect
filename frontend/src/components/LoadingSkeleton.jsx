import { Loader2 } from "lucide-react";

export const LoadingSkeleton = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#161616]">
      <Loader2 className="h-12 w-12 animate-spin text-gray-500" />
    </div>
  );
};
