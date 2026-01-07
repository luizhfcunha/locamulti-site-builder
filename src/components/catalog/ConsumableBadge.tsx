import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface ConsumableBadgeProps {
    className?: string;
}

export const ConsumableBadge = ({ className }: ConsumableBadgeProps) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Badge
                        className={`bg-orange-500 text-white hover:bg-orange-600 border-none px-3 py-1 rounded-full text-xs font-semibold cursor-help inline-flex items-center gap-1.5 ${className || ''}`}
                    >
                        <Package className="h-3 w-3" />
                        CONSUMÍVEL
                    </Badge>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                    <p className="text-sm">
                        Este item é um consumível locável junto com o equipamento principal da família.
                    </p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
