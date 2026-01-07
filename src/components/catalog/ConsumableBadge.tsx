import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Package } from "lucide-react";

export const ConsumableBadge = () => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Badge className="bg-orange-500 hover:bg-orange-600 text-white gap-1.5 px-2.5 py-0.5 cursor-help shrink-0 animate-in fade-in transition-transform hover:scale-105">
                        <Package className="h-3.5 w-3.5" />
                        CONSUMÍVEL
                    </Badge>
                </TooltipTrigger>
                <TooltipContent className="max-w-[200px] text-center bg-zinc-800 text-white border-none">
                    <p>Este item é um consumível locável junto com o equipamento principal</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
