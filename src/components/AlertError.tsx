import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircleIcon } from "lucide-react"

interface AlertErrorProps {
    title: string;
    description: string;
}

export function AlertError({title, description}: AlertErrorProps) {
  return (
    <Alert variant="destructive" className="max-w-md">
      <AlertCircleIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        {description}
      </AlertDescription>
    </Alert>
  )
}
