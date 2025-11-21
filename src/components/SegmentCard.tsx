import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface SegmentCardProps {
  title: string;
  icon: LucideIcon;
}

export const SegmentCard = ({ title, icon: Icon }: SegmentCardProps) => {
  return (
    <Card className="group border-border hover:border-primary/50 hover:shadow-card transition-all duration-base rounded-card cursor-pointer">
      <CardContent className="p-6 flex flex-col items-center text-center gap-3">
        <div className="w-14 h-14 rounded-lg bg-lm-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors duration-base">
          <Icon className="h-7 w-7 text-lm-ink group-hover:text-primary transition-colors duration-base" strokeWidth={2} />
        </div>
        
        <h3 className="font-heading text-base font-bold text-foreground">
          {title}
        </h3>
      </CardContent>
    </Card>
  );
};
