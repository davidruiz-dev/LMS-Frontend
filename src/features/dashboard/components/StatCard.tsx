import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/shared/lib/utils";

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    description: string;
    progress?: number;
    color: 'blue' | 'green' | 'purple' | 'yellow' | "red";
}

export function StatCard({ icon, label, value, description, progress, color }: StatCardProps) {
    const colorMap = {
        blue: { bg: "bg-blue-50 dark:bg-blue-950", text: "text-blue-600 dark:text-blue-400" },
        green: { bg: "bg-green-50 dark:bg-green-950", text: "text-green-600 dark:text-green-400" },
        purple: { bg: "bg-purple-50 dark:bg-purple-950", text: "text-purple-600 dark:text-purple-400" },
        yellow: { bg: "bg-yellow-50 dark:bg-yellow-950", text: "text-yellow-600 dark:text-yellow-400" },
        red: { bg: "bg-res-50 dark:bg-red-950", text: "text-red-600 dark:text-red-400<"}
    };

    return (
        <Card>
            <CardContent>
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">{label}</p>
                        <p className="text-2xl font-bold">{value}</p>
                        <p className="text-xs text-muted-foreground">{description}</p>
                    </div>
                    <div className={cn("rounded-lg p-2", colorMap[color].bg)}>
                        <div className={colorMap[color].text}>{icon}</div>
                    </div>
                </div>
                {progress !== undefined && (
                    <Progress value={progress} className="mt-3 h-1" />
                )}
            </CardContent>
        </Card>
    );
}