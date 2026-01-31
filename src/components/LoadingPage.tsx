import { LoadingSpinner } from "@/components/ui/loading-spinner";
import type { FC } from "react";

interface Props {
    message: string;
}

const LoadingPage: FC<Props> = ({ message }) => {
  return (
    <div className="bg-background h-full w-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <LoadingSpinner size="md"/>
            <p className="text-center">{message}</p>
        </div>
    </div>
  )
}

export default LoadingPage