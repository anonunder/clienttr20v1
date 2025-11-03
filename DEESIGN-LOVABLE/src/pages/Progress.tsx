import { useState } from "react";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Settings,
  Upload,
  X,
  Calendar,
  Target,
  Activity,
  BarChart3,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { MeasurementCard } from "@/components/progress/MeasurementCard/MeasurementCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import bodyFemale from "@/assets/body-female.png";
import bodyMale from "@/assets/body-male.png";
import Header from "@/components/Header";
import { format } from "date-fns";
import { ProgressCharts } from "@/components/progress/ProgressCharts/ProgressCharts";

interface MeasurementEntry {
  date: string;
  time: string;
  values: {
    [key: string]: number | undefined;
  };
  images: string[];
}

interface Measurement {
  id: string;
  name: string;
  value: number;
  unit: string;
  date: string;
  goal?: number;
  change?: number;
  history?: { date: string; value: number }[];
}

const ProgressPage = () => {
  const [measurements, setMeasurements] = useState<Measurement[]>([
    { id: "1", name: "Weight", value: 75.2, unit: "kg", date: "2025-10-26", goal: 70, change: -0.5 },
    { id: "2", name: "Height", value: 178, unit: "cm", date: "2025-10-26" },
    { id: "3", name: "Body Fat", value: 18.5, unit: "%", date: "2025-10-26", goal: 15, change: -1.2 },
    { id: "4", name: "Muscle Mass", value: 58.5, unit: "kg", date: "2025-10-26", goal: 62, change: 0.8 },
    { id: "5", name: "BMI", value: 23.7, unit: "", date: "2025-10-26", goal: 22, change: -0.3 },
    { id: "6", name: "Chest", value: 106, unit: "cm", date: "2025-10-26", goal: 110, change: 1 },
    { id: "7", name: "Waist", value: 82, unit: "cm", date: "2025-10-26", goal: 78, change: -2 },
    { id: "8", name: "Hips", value: 98, unit: "cm", date: "2025-10-26", goal: 95, change: -0.5 },
    { id: "9", name: "Shoulders", value: 118, unit: "cm", date: "2025-10-26", goal: 122, change: 0.5 },
    { id: "10", name: "Neck", value: 38, unit: "cm", date: "2025-10-26" },
    { id: "11", name: "Biceps (L)", value: 37, unit: "cm", date: "2025-10-26", goal: 40, change: 0.5 },
    { id: "12", name: "Biceps (R)", value: 37.5, unit: "cm", date: "2025-10-26", goal: 40, change: 0.5 },
    { id: "13", name: "Forearms (L)", value: 29, unit: "cm", date: "2025-10-26" },
    { id: "14", name: "Forearms (R)", value: 29.5, unit: "cm", date: "2025-10-26" },
    { id: "15", name: "Thighs (L)", value: 58, unit: "cm", date: "2025-10-26", goal: 60, change: 0.3 },
    { id: "16", name: "Thighs (R)", value: 58.5, unit: "cm", date: "2025-10-26", goal: 60, change: 0.3 },
    { id: "17", name: "Calves (L)", value: 38, unit: "cm", date: "2025-10-26", goal: 40 },
    { id: "18", name: "Calves (R)", value: 38.5, unit: "cm", date: "2025-10-26", goal: 40 },
    { id: "19", name: "Wrist", value: 17, unit: "cm", date: "2025-10-26" },
    { id: "20", name: "Ankle", value: 23, unit: "cm", date: "2025-10-26" },
    { id: "21", name: "Body Water", value: 58, unit: "%", date: "2025-10-26", goal: 60 },
    { id: "22", name: "Bone Mass", value: 3.2, unit: "kg", date: "2025-10-26" },
    { id: "23", name: "Visceral Fat", value: 8, unit: "", date: "2025-10-26", goal: 6, change: -1 },
    { id: "24", name: "Metabolic Age", value: 28, unit: "years", date: "2025-10-26", goal: 25, change: -1 },
    { id: "25", name: "Protein", value: 18, unit: "%", date: "2025-10-26", goal: 20 },
    { id: "26", name: "BMR", value: 1785, unit: "kcal", date: "2025-10-26" },
    { id: "27", name: "Abdomen", value: 88, unit: "cm", date: "2025-10-26", goal: 85 },
  ]);

  // Measurement history entries with images
  const [measurementEntries, setMeasurementEntries] = useState<MeasurementEntry[]>([
    {
      date: "2025-10-26",
      time: "14:30",
      values: {
        "1": 75.2,
        "6": 106,
        "7": 82,
        "8": 98,
        "11": 37,
        "12": 37.5,
      },
      images: [],
    },
    {
      date: "2025-10-20",
      time: "09:15",
      values: {
        "1": 75.7,
        "6": 105,
        "7": 84,
        "8": 98.5,
      },
      images: [],
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedMeasurement, setSelectedMeasurement] = useState<Measurement | null>(null);
  const [bottomTab, setBottomTab] = useState("trends");
  const [gender, setGender] = useState<"male" | "female">("female");
  const [selectedEntry, setSelectedEntry] = useState<MeasurementEntry | null>(null);

  // Form state for new measurements
  const [formValues, setFormValues] = useState<{ [key: string]: string }>({});
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  // Body measurements layout (left and right side)
  const bodyMeasurements = {
    left: [
      { id: "10", name: "Neck" },
      { id: "11", name: "Biceps L" },
      { id: "6", name: "Chest" },
      { id: "27", name: "Abdomen" },
      { id: "15", name: "Thigh L" },
      { id: "17", name: "Calf L" },
    ],
    right: [
      { id: "9", name: "Shoulder" },
      { id: "12", name: "Biceps R" },
      { id: "7", name: "Waist" },
      { id: "8", name: "Hip" },
      { id: "16", name: "Thigh R" },
      { id: "18", name: "Calf R" },
    ],
  };

  const getMeasurement = (id: string) => measurements.find((m) => m.id === id);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitNewMeasurement = () => {
    const now = new Date();
    const newEntry: MeasurementEntry = {
      date: format(now, "yyyy-MM-dd"),
      time: format(now, "HH:mm"),
      values: Object.entries(formValues).reduce(
        (acc, [key, value]) => {
          if (value) {
            acc[key] = parseFloat(value);
          }
          return acc;
        },
        {} as { [key: string]: number },
      ),
      images: uploadedImages,
    };

    setMeasurementEntries((prev) => [newEntry, ...prev]);

    // Update current measurements
    const updatedMeasurements = measurements.map((m) => {
      const newVal = formValues[m.id];
      if (newVal) {
        const newValueNum = parseFloat(newVal);
        return {
          ...m,
          value: newValueNum,
          date: newEntry.date,
          change: m.value ? newValueNum - m.value : undefined,
        };
      }
      return m;
    });

    setMeasurements(updatedMeasurements);
    setFormValues({});
    setUploadedImages([]);
    setShowAddForm(false);
    toast.success("Measurements saved!");
  };

  const getMeasurementHistory = (measurementId: string) => {
    return measurementEntries
      .filter((entry) => entry.values[measurementId] !== undefined)
      .map((entry) => ({
        date: entry.date,
        time: entry.time,
        value: entry.values[measurementId]!,
        images: entry.images,
      }));
  };


  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title="Measurements" description="Track your body metrics and progress" />

      {/* Add New Measurement Button */}
      <div className="bg-background border-b border-border p-4">
        <Button onClick={() => setShowAddForm(true)} className="w-full max-w-md mx-auto flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Measurement
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto pb-6 px-4 md:px-6">
        {bottomTab === "analytics" ? (
          <div className="max-w-7xl mx-auto p-4 space-y-6">
            <ProgressCharts measurements={measurements} />
          </div>
        ) : bottomTab === "history" ? (
          <div className="max-w-5xl mx-auto p-4">
            <h2 className="text-xl font-semibold text-foreground mb-4">Measurement History</h2>
            <div className="space-y-4">
              {measurementEntries.map((entry, idx) => (
                <Card
                  key={idx}
                  className="p-4 cursor-pointer hover:shadow-md transition-all"
                  onClick={() => setSelectedEntry(entry)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-foreground">
                        {format(new Date(entry.date), "MMM dd, yyyy")}
                      </span>
                      <span className="text-sm text-muted-foreground">{entry.time}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {Object.keys(entry.values).length} measurements
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                    {Object.entries(entry.values)
                      .slice(0, 4)
                      .map(([id, value]) => {
                        const measurement = measurements.find((m) => m.id === id);
                        return measurement ? (
                          <div key={id} className="text-sm">
                            <span className="text-muted-foreground">{measurement.name}: </span>
                            <span className="font-medium text-foreground">
                              {value}
                              {measurement.unit}
                            </span>
                          </div>
                        ) : null;
                      })}
                    {Object.keys(entry.values).length > 4 && (
                      <div className="text-sm text-muted-foreground">+{Object.keys(entry.values).length - 4} more</div>
                    )}
                  </div>

                  {entry.images.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {entry.images.map((img, imgIdx) => (
                        <img
                          key={imgIdx}
                          src={img}
                          alt={`Progress ${imgIdx + 1}`}
                          className="h-20 w-20 object-cover rounded-md border border-border"
                        />
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto p-4">
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Metrics</p>
                    <p className="text-2xl font-bold text-foreground">{measurements.length}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-success/10 to-success/5 border-success/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Improved</p>
                    <p className="text-2xl font-bold text-foreground">
                      {measurements.filter((m) => (m.change ?? 0) > 0).length}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-warning/10 to-warning/5 border-warning/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-warning/10 rounded-lg">
                    <Target className="h-5 w-5 text-warning" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">With Goals</p>
                    <p className="text-2xl font-bold text-foreground">
                      {measurements.filter((m) => m.goal !== undefined).length}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-info/10 to-info/5 border-info/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-info/10 rounded-lg">
                    <Clock className="h-5 w-5 text-info" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tracked</p>
                    <p className="text-2xl font-bold text-foreground">{measurementEntries.length}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Categories */}
            <div className="space-y-8">
              {/* Body Composition */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-1 w-8 bg-primary rounded-full" />
                  <h2 className="text-xl font-bold text-foreground">Body Composition</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {["1", "3", "4", "5", "21", "22", "23", "24", "25", "26"].map((id) => (
                    <MeasurementCard 
                      key={id} 
                      measurement={getMeasurement(id)} 
                      onClick={() => setSelectedMeasurement(getMeasurement(id) || null)}
                    />
                  ))}
                </div>
              </div>

              {/* Upper Body */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-1 w-8 bg-primary rounded-full" />
                  <h2 className="text-xl font-bold text-foreground">Upper Body</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {["10", "9", "6", "11", "12", "13", "14", "19"].map((id) => (
                    <MeasurementCard key={id} measurement={getMeasurement(id)} />
                  ))}
                </div>
              </div>

              {/* Core & Waist */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-1 w-8 bg-primary rounded-full" />
                  <h2 className="text-xl font-bold text-foreground">Core & Waist</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {["7", "8", "27"].map((id) => (
                    <MeasurementCard key={id} measurement={getMeasurement(id)} />
                  ))}
                </div>
              </div>

              {/* Lower Body */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-1 w-8 bg-primary rounded-full" />
                  <h2 className="text-xl font-bold text-foreground">Lower Body</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {["15", "16", "17", "18", "20"].map((id) => (
                    <MeasurementCard key={id} measurement={getMeasurement(id)} />
                  ))}
                </div>
              </div>

              {/* Other Metrics */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-1 w-8 bg-primary rounded-full" />
                  <h2 className="text-xl font-bold text-foreground">Other Metrics</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  <MeasurementCard measurement={getMeasurement("2")} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Side Navigation */}
      <div className="fixed right-4 bottom-2 md:bottom-24 flex flex-col gap-2 z-40">
        <button
          onClick={() => setBottomTab("trends")}
          className={`p-3 rounded-full shadow-lg transition-all backdrop-blur-sm border ${
            bottomTab === "trends" 
              ? "bg-primary text-primary-foreground border-primary shadow-primary/50" 
              : "bg-card/80 text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground"
          }`}
          title="Trends"
        >
          <Activity className="h-5 w-5" />
        </button>
        <button
          onClick={() => setBottomTab("analytics")}
          className={`p-3 rounded-full shadow-lg transition-all backdrop-blur-sm border ${
            bottomTab === "analytics" 
              ? "bg-primary text-primary-foreground border-primary shadow-primary/50" 
              : "bg-card/80 text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground"
          }`}
          title="Analytics"
        >
          <BarChart3 className="h-5 w-5" />
        </button>
        <button
          onClick={() => setBottomTab("history")}
          className={`p-3 rounded-full shadow-lg transition-all backdrop-blur-sm border ${
            bottomTab === "history" 
              ? "bg-primary text-primary-foreground border-primary shadow-primary/50" 
              : "bg-card/80 text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground"
          }`}
          title="History"
        >
          <Clock className="h-5 w-5" />
        </button>
      </div>

      {/* Add New Measurement Form Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Measurement</DialogTitle>
            <DialogDescription>Fill in any measurements you want to track. All fields are optional.</DialogDescription>
            <div className="flex items-center gap-2 mt-2 text-sm bg-primary/10 p-2 rounded-md">
              <Calendar className="h-4 w-4 text-primary" />
              <span className="font-medium text-primary">{format(new Date(), "MMM dd, yyyy 'at' HH:mm")}</span>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Body Measurements */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">Body Measurements</h3>
              <div className="grid grid-cols-2 gap-4">
                {measurements.map((m) => (
                  <div key={m.id} className="space-y-2">
                    <Label htmlFor={`measure-${m.id}`} className="text-sm">
                      {m.name} {m.unit && `(${m.unit})`}
                    </Label>
                    <Input
                      id={`measure-${m.id}`}
                      type="number"
                      step="0.1"
                      placeholder="Optional"
                      value={formValues[m.id] || ""}
                      onChange={(e) => setFormValues((prev) => ({ ...prev, [m.id]: e.target.value }))}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <Label className="text-sm font-semibold mb-2 block">Progress Photos</Label>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
                      <Upload className="h-4 w-4" />
                      <span className="text-sm">Upload Images</span>
                    </div>
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                  </label>
                  <span className="text-sm text-muted-foreground">{uploadedImages.length} image(s) selected</span>
                </div>

                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {uploadedImages.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={img}
                          alt={`Upload ${idx + 1}`}
                          className="w-full h-32 object-cover rounded-md border border-border"
                        />
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleSubmitNewMeasurement} className="flex-1">
                Save Measurements
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowAddForm(false);
                  setFormValues({});
                  setUploadedImages([]);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Entry Details Dialog */}
      <Dialog open={!!selectedEntry} onOpenChange={() => setSelectedEntry(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Measurement Details</DialogTitle>
            <DialogDescription>
              {selectedEntry && format(new Date(selectedEntry.date), "MMMM dd, yyyy")} at {selectedEntry?.time}
            </DialogDescription>
          </DialogHeader>

          {selectedEntry && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(selectedEntry.values).map(([id, value]) => {
                  const measurement = measurements.find((m) => m.id === id);
                  return measurement ? (
                    <Card key={id} className="p-3">
                      <p className="text-sm text-muted-foreground">{measurement.name}</p>
                      <p className="text-xl font-bold text-foreground">
                        {value}
                        <span className="text-sm text-muted-foreground ml-1">{measurement.unit}</span>
                      </p>
                    </Card>
                  ) : null;
                })}
              </div>

              {selectedEntry.images.length > 0 && (
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Progress Photos</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedEntry.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Progress ${idx + 1}`}
                        className="w-full h-48 object-cover rounded-md border border-border"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Measurement Details Dialog */}
      <Dialog open={!!selectedMeasurement} onOpenChange={() => setSelectedMeasurement(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedMeasurement?.name}</DialogTitle>
            <DialogDescription>View measurement history and progress photos</DialogDescription>
          </DialogHeader>

          {selectedMeasurement && (
            <div className="space-y-6">
              {/* Current Value */}
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Current Value</p>
                    <p className="text-4xl font-bold text-foreground">
                      {selectedMeasurement.value}
                      <span className="text-xl text-muted-foreground ml-2">{selectedMeasurement.unit}</span>
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {format(new Date(selectedMeasurement.date), "MMM dd, yyyy")}
                    </p>
                  </div>
                  {selectedMeasurement.goal && (
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground mb-1">Goal</p>
                      <p className="text-2xl font-bold text-primary">
                        {selectedMeasurement.goal}
                        <span className="text-sm ml-1">{selectedMeasurement.unit}</span>
                      </p>
                    </div>
                  )}
                </div>
              </Card>

              {/* History */}
              {(() => {
                const history = getMeasurementHistory(selectedMeasurement.id);
                return history.length > 0 ? (
                  <div>
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      History ({history.length} entries)
                    </h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {history.map((entry, idx) => (
                        <Card key={idx} className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-semibold text-foreground">
                                {entry.value}
                                <span className="text-sm text-muted-foreground ml-1">
                                  {selectedMeasurement.unit}
                                </span>
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(entry.date), "MMM dd, yyyy")} at {entry.time}
                              </p>
                            </div>
                            {idx < history.length - 1 && (
                              <Badge
                                variant={
                                  entry.value > history[idx + 1].value
                                    ? "default"
                                    : entry.value < history[idx + 1].value
                                    ? "destructive"
                                    : "secondary"
                                }
                                className="flex items-center gap-1"
                              >
                                {entry.value > history[idx + 1].value ? (
                                  <TrendingUp className="h-3 w-3" />
                                ) : entry.value < history[idx + 1].value ? (
                                  <TrendingDown className="h-3 w-3" />
                                ) : (
                                  <Minus className="h-3 w-3" />
                                )}
                                <span className="text-xs">
                                  {Math.abs(entry.value - history[idx + 1].value).toFixed(1)}
                                </span>
                              </Badge>
                            )}
                          </div>

                          {entry.images.length > 0 && (
                            <div className="grid grid-cols-3 gap-2">
                              {entry.images.map((img, imgIdx) => (
                                <img
                                  key={imgIdx}
                                  src={img}
                                  alt={`Progress ${imgIdx + 1}`}
                                  className="w-full h-24 object-cover rounded-md border border-border cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => window.open(img, "_blank")}
                                />
                              ))}
                            </div>
                          )}
                        </Card>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No history available for this measurement</p>
                  </div>
                );
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProgressPage;
