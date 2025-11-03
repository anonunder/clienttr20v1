import { useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardList, CheckCircle2, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const Questionnaires = () => {
  const [activeTab, setActiveTab] = useState("active");

  const activeQuestionnaires = [
    {
      id: "1",
      title: "Weekly Progress Check-in",
      description: "Share your progress and how you're feeling this week",
      dueDate: "2025-10-30",
      questions: 5,
    },
    {
      id: "2",
      title: "Nutrition Feedback",
      description: "Help us understand your meal satisfaction",
      dueDate: "2025-11-02",
      questions: 8,
    },
  ];

  const completedQuestionnaires = [
    {
      id: "3",
      title: "Initial Assessment",
      description: "Your starting fitness level and goals",
      completedDate: "2025-10-01",
      questions: 12,
    },
    {
      id: "4",
      title: "Monthly Progress",
      description: "Review of your first month",
      completedDate: "2025-10-15",
      questions: 10,
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Questionnaires</h1>
          <p className="text-muted-foreground">Track your progress and provide feedback</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 bg-secondary">
            <TabsTrigger value="active" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <ClipboardList className="h-4 w-4 mr-2" />
              Active
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Completed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6 space-y-4">
            {activeQuestionnaires.length === 0 ? (
              <Card className="bg-card border-border p-12">
                <div className="text-center space-y-2">
                  <ClipboardList className="h-12 w-12 text-muted-foreground mx-auto" />
                  <p className="text-muted-foreground">No active questionnaires</p>
                </div>
              </Card>
            ) : (
              activeQuestionnaires.map((questionnaire) => (
                <Link key={questionnaire.id} to={`/questionnaires/${questionnaire.id}`}>
                  <Card className="bg-card border-border p-6 hover:bg-secondary/50 transition-all duration-300 cursor-pointer group">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                            {questionnaire.title}
                          </h3>
                          <Badge className="bg-warning/20 text-warning border-warning/30">Pending</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{questionnaire.description}</p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>Due: {questionnaire.dueDate}</span>
                          <span>•</span>
                          <span>{questionnaire.questions} questions</span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                    </div>
                  </Card>
                </Link>
              ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-6 space-y-4">
            {completedQuestionnaires.map((questionnaire) => (
              <Link key={questionnaire.id} to={`/questionnaires/${questionnaire.id}`}>
                <Card className="bg-card border-border p-6 hover:bg-secondary/50 transition-all duration-300 cursor-pointer group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                          {questionnaire.title}
                        </h3>
                        <Badge className="bg-success/20 text-success border-success/30">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{questionnaire.description}</p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span>Completed: {questionnaire.completedDate}</span>
                        <span>•</span>
                        <span>{questionnaire.questions} questions</span>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                  </div>
                </Card>
              </Link>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Questionnaires;
