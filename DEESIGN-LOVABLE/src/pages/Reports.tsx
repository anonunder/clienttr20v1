import { useState } from "react";
import { CheckCircle2, Clock, Send, Ruler, Calendar, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Header from "@/components/Header";
import { ReportCard } from "@/components/reports/ReportCard/ReportCard";

interface FormField {
  id: string;
  label: string;
  type: "text" | "textarea" | "number";
  required: boolean;
  placeholder?: string;
}

interface Measurement {
  id: string;
  name: string;
  value: number;
  unit: string;
}

interface Report {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: "pending" | "completed";
  createdBy: string;
  fields: FormField[];
  measurements?: Measurement[]; // Selected measurements for this report
  submittedData?: Record<string, string>;
}

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  // Mock reports data
  const reports: Report[] = [
    {
      id: "1",
      title: "Weekly Progress Check-in",
      description: "Share your progress and challenges this week",
      dueDate: "2025-10-28",
      status: "pending",
      createdBy: "Coach Mike",
      measurements: [
        { id: "1", name: "Weight", value: 75.2, unit: "kg" },
        { id: "3", name: "Body Fat", value: 18.5, unit: "%" },
        { id: "4", name: "Muscle Mass", value: 58.5, unit: "kg" },
      ],
      fields: [
        { id: "energy", label: "Energy Level (1-10)", type: "number", required: true, placeholder: "8" },
        { id: "challenges", label: "Challenges This Week", type: "textarea", required: false, placeholder: "Describe any difficulties..." },
        { id: "achievements", label: "Achievements", type: "textarea", required: false, placeholder: "What went well?" },
        { id: "notes", label: "Additional Notes", type: "textarea", required: false, placeholder: "Any other feedback..." },
      ],
    },
    {
      id: "2",
      title: "Monthly Body Measurements",
      description: "Update your body measurements for progress tracking",
      dueDate: "2025-10-30",
      status: "completed",
      createdBy: "Coach Sarah",
      measurements: [
        { id: "6", name: "Chest", value: 106, unit: "cm" },
        { id: "7", name: "Waist", value: 82, unit: "cm" },
        { id: "8", name: "Hips", value: 98, unit: "cm" },
        { id: "11", name: "Biceps (L)", value: 37, unit: "cm" },
        { id: "15", name: "Thighs (L)", value: 58, unit: "cm" },
      ],
      fields: [
        { id: "progress", label: "How do you feel about your progress?", type: "textarea", required: false },
      ],
      submittedData: {
        progress: "Great improvements in overall strength and muscle definition",
      },
    },
    {
      id: "3",
      title: "Nutrition Feedback",
      description: "Tell us about your nutrition experience",
      dueDate: "2025-11-05",
      status: "pending",
      createdBy: "Coach Mike",
      fields: [
        { id: "adherence", label: "Meal Plan Adherence (%)", type: "number", required: true, placeholder: "80" },
        { id: "satisfaction", label: "How satisfied are you with your meals?", type: "textarea", required: true },
        { id: "cravings", label: "Any cravings or difficulties?", type: "textarea", required: false },
      ],
    },
  ];

  const pendingReports = reports.filter((r) => r.status === "pending");
  const completedReports = reports.filter((r) => r.status === "completed");

  const handleInputChange = (fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = () => {
    if (!selectedReport) return;

    // Validate required fields
    const missingFields = selectedReport.fields
      .filter((field) => field.required && !formData[field.id])
      .map((field) => field.label);

    if (missingFields.length > 0) {
      toast.error(`Please fill in required fields: ${missingFields.join(", ")}`);
      return;
    }

    toast.success("Report submitted successfully!");
    setSelectedReport(null);
    setFormData({});
  };

  if (selectedReport) {
    return (
      <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8 pb-24">
        <div className="max-w-3xl mx-auto space-y-6">
          <Button
            variant="ghost"
            onClick={() => {
              setSelectedReport(null);
              setFormData({});
            }}
            className="mb-4"
          >
            ← Back to Reports
          </Button>

          <Card className="bg-card border-border p-6">
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{selectedReport.title}</h1>
                <p className="text-sm text-muted-foreground mt-1">{selectedReport.description}</p>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Due: {selectedReport.dueDate}</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>From: {selectedReport.createdBy}</span>
                </div>
              </div>

              <Separator />

              {/* Measurements Section (if available) */}
              {selectedReport.measurements && selectedReport.measurements.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Ruler className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">
                      {selectedReport.status === "completed" ? "Submitted Measurements" : "Update Measurements"}
                    </h3>
                  </div>
                  
                  {selectedReport.status === "completed" ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {selectedReport.measurements.map((measurement) => (
                        <Card key={measurement.id} className="bg-secondary/30 border-border p-3">
                          <p className="text-sm text-muted-foreground">{measurement.name}</p>
                          <p className="text-xl font-bold text-foreground">
                            {measurement.value}
                            <span className="text-sm text-muted-foreground ml-1">{measurement.unit}</span>
                          </p>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedReport.measurements.map((measurement) => (
                        <div key={measurement.id} className="space-y-2">
                          <Label htmlFor={`measurement-${measurement.id}`} className="text-foreground">
                            {measurement.name} ({measurement.unit})
                          </Label>
                          <div className="flex items-center gap-2">
                            <Input
                              id={`measurement-${measurement.id}`}
                              type="number"
                              step="0.1"
                              placeholder={`Enter ${measurement.name.toLowerCase()}`}
                              value={formData[`measurement-${measurement.id}`] || ""}
                              onChange={(e) => handleInputChange(`measurement-${measurement.id}`, e.target.value)}
                              className="flex-1"
                            />
                            <span className="text-sm text-muted-foreground whitespace-nowrap">
                              Last: {measurement.value} {measurement.unit}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <Separator />
                </div>
              )}

              {selectedReport.status === "completed" && selectedReport.submittedData ? (
                <div className="space-y-4">
                  <Badge className="bg-success/20 text-success border-success/30">
                    Completed
                  </Badge>
                  {selectedReport.fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label className="text-foreground">{field.label}</Label>
                      <div className="p-3 rounded-md bg-secondary/30 text-foreground">
                        {selectedReport.submittedData![field.id] || "Not provided"}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <form className="space-y-6">
                  {selectedReport.fields.map((field) => (
                    <div key={field.id} className="space-y-2">
                      <Label htmlFor={field.id} className="text-foreground">
                        {field.label}
                        {field.required && <span className="text-destructive ml-1">*</span>}
                      </Label>
                      {field.type === "textarea" ? (
                        <Textarea
                          id={field.id}
                          placeholder={field.placeholder}
                          value={formData[field.id] || ""}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                          className="min-h-[100px]"
                        />
                      ) : (
                        <Input
                          id={field.id}
                          type={field.type}
                          placeholder={field.placeholder}
                          value={formData[field.id] || ""}
                          onChange={(e) => handleInputChange(field.id, e.target.value)}
                        />
                      )}
                    </div>
                  ))}

                  <Button onClick={handleSubmit} className="w-full" type="button">
                    <Send className="h-4 w-4 mr-2" />
                    Submit Report
                  </Button>
                </form>
              )}
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header title="Reports" description="Track and submit your progress reports" />
      
      <div className="container px-4 py-8 md:px-6 pb-24">
        <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground">Complete forms sent by your trainer</p>
        </div>

        {/* Pending Reports */}
        {pendingReports.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-warning" />
              <h2 className="text-xl font-semibold text-foreground">
                Pending Reports ({pendingReports.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingReports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onClick={() => setSelectedReport(report)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Completed Reports */}
        {completedReports.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-success" />
              <h2 className="text-xl font-semibold text-foreground">
                Completed Reports
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {completedReports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  onClick={() => setSelectedReport(report)}
                />
              ))}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
