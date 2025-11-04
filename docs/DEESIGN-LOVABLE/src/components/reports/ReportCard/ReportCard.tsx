import { Calendar, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Report {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: "pending" | "completed";
  createdBy: string;
}

interface ReportCardProps {
  report: Report;
  onClick: () => void;
}

export const ReportCard = ({ report, onClick }: ReportCardProps) => {
  const isPending = report.status === "pending";
  
  return (
    <Card
      className={`bg-card border-border p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group ${
        !isPending ? "opacity-75" : ""
      }`}
      onClick={onClick}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
              {report.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {report.description}
            </p>
          </div>
          <Badge 
            variant="outline" 
            className={
              isPending 
                ? "bg-warning/20 text-warning border-warning/30" 
                : "bg-success/20 text-success border-success/30"
            }
          >
            {isPending ? "New" : "Done"}
          </Badge>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Due: {report.dueDate}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>{report.createdBy}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
