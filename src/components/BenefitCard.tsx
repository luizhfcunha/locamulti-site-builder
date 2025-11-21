import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface BenefitCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const BenefitCard = ({ title, description, icon: Icon }: BenefitCardProps) => {
  return (
    <Card className="group border-border hover:border-primary/50 hover:shadow-card transition-all duration-base rounded-card h-full">
      <CardContent className="p-6 flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-base">
          <Icon className="h-8 w-8 text-primary" strokeWidth={2} />
        </div>
        
        <div className="space-y-2">
          <h3 className="font-heading text-lg font-bold text-foreground">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
