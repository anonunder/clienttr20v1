import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import fitnessLogo from "@/assets/fitness-logo.png";
import { Progress } from "@/components/ui/progress";

const loadingSteps = [
  { text: "Initializing app...", progress: 15 },
  { text: "Loading companies...", progress: 30 },
  { text: "Fetching training programs...", progress: 50 },
  { text: "Loading nutrition plans...", progress: 70 },
  { text: "Preparing your dashboard...", progress: 85 },
  { text: "Almost ready...", progress: 100 },
];

const Loading = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepDuration = 350; // ms per step
    
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < loadingSteps.length - 1) {
          const nextStep = prev + 1;
          setProgress(loadingSteps[nextStep].progress);
          return nextStep;
        }
        return prev;
      });
    }, stepDuration);

    const totalDuration = stepDuration * loadingSteps.length;
    const timer = setTimeout(() => {
      navigate("/login");
    }, totalDuration);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10" />
      
      {/* Animated Background Circles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-primary/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "0.5s" }} />
      </div>

      <div className="flex flex-col items-center gap-8 max-w-md w-full relative z-10">
        {/* Logo with Scale Animation */}
        <div className="animate-scale-in">
          <img 
            src={fitnessLogo} 
            alt="Fitness App Logo" 
            className="w-40 h-40 md:w-48 md:h-48 object-contain animate-pulse"
          />
        </div>

        {/* App Title with Fade Animation */}
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent text-center tracking-wider animate-fade-in">
          FITNESS APP
        </h1>

        {/* Loading Status Text with Fade Animation */}
        <div className="min-h-[60px] flex items-center justify-center">
          <p 
            key={currentStep}
            className="text-foreground/80 text-center font-medium text-lg animate-fade-in"
          >
            {loadingSteps[currentStep].text}
          </p>
        </div>

        {/* Progress Bar with Animations */}
        <div className="w-full max-w-xs space-y-3 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <Progress 
            value={progress} 
            className="h-2 bg-secondary transition-all duration-500"
          />
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground text-sm font-medium">
              Loading...
            </p>
            <p className="text-primary text-sm font-bold">
              {progress}%
            </p>
          </div>
        </div>

        {/* Animated Dots */}
        <div className="flex gap-2 animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" />
          <div className="w-3 h-3 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
        </div>
      </div>
    </div>
  );
};

export default Loading;
