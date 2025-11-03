import { useState, useEffect, createContext, useContext } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate, useNavigate } from "react-router-dom";
import Navigation from "./components/Navigation";
import { GlobalCallFloat } from "./components/GlobalCallFloat";
import Index from "./pages/Index";
import Programs from "./pages/Programs";
import ProgramDetail from "./pages/ProgramDetail";
import TrainingPlan from "./pages/TrainingPlan";
import Workout from "./pages/Workout";
import Exercise from "./pages/Exercise";
import NutritionPlan from "./pages/NutritionPlan";
import Meal from "./pages/Meal";
import Recipe from "./pages/Recipe";
import Progress from "./pages/Progress";
import Reports from "./pages/Reports";
import Favorites from "./pages/Favorites";
import Chat from "./pages/Chat";
import Questionnaires from "./pages/Questionnaires";
import Profile from "./pages/Profile";
import EditProfile from "./pages/profile/EditProfile";
import ChangePassword from "./pages/profile/ChangePassword";
import AppPreferences from "./pages/profile/AppPreferences";
import NotificationsPage from "./pages/profile/Notifications";
import NotFound from "./pages/NotFound";
import Loading from "./pages/Loading";
import Login from "./pages/Login";

const queryClient = new QueryClient();

interface Contact {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  online: boolean;
  lastMessage?: string;
  unread?: number;
}

interface CallContextType {
  isCallActive: boolean;
  isVideoActive: boolean;
  isCallMinimized: boolean;
  contact: Contact | null;
  callDuration: number;
  setIsCallActive: (active: boolean) => void;
  setIsVideoActive: (active: boolean) => void;
  setIsCallMinimized: (minimized: boolean) => void;
  setContact: (contact: Contact | null) => void;
  setCallDuration: (duration: number | ((prev: number) => number)) => void;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error("useCall must be used within CallProvider");
  }
  return context;
};

const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isExercisePage = location.pathname.includes("/exercise/");
  const isAuthPage = location.pathname === "/loading" || location.pathname === "/login";
  const { 
    isCallActive, 
    isVideoActive, 
    isCallMinimized, 
    contact, 
    callDuration,
    setIsCallMinimized,
    setIsCallActive,
    setIsVideoActive,
    setCallDuration,
    setContact
  } = useCall();

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleMaximizeCall = () => {
    setIsCallMinimized(false);
    // Navigate to chat page when maximizing call from other pages
    if (location.pathname !== "/chat") {
      navigate("/chat");
    }
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setIsVideoActive(false);
    setIsCallMinimized(false);
    setCallDuration(0);
    setContact(null);
  };

  return (
    <div className={isExercisePage ? "" : "pb-16"}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/programs" element={<Programs />} />
        <Route path="/programs/:programId" element={<ProgramDetail />} />
        <Route path="/trainings" element={<Programs />} />
        <Route path="/nutrition" element={<NutritionPlan />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/programs/training/:planId" element={<TrainingPlan />} />
        <Route path="/programs/training/:planId/workout/:workoutId" element={<Workout />} />
        <Route path="/programs/training/:planId/workout/:workoutId/exercise/:exerciseId" element={<Exercise />} />
        <Route path="/programs/nutrition/:planId" element={<NutritionPlan />} />
        <Route path="/programs/nutrition/:planId/meal/:mealId" element={<Meal />} />
        <Route path="/programs/nutrition/:planId/meal/:mealId/recipe/:recipeId" element={<Recipe />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/questionnaires" element={<Questionnaires />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/profile/password" element={<ChangePassword />} />
        <Route path="/profile/preferences" element={<AppPreferences />} />
        <Route path="/profile/notifications" element={<NotificationsPage />} />
        <Route path="/favorites" element={<Favorites />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isExercisePage && !isAuthPage && <Navigation />}
      <GlobalCallFloat
        isCallActive={isCallActive}
        isVideoActive={isVideoActive}
        isCallMinimized={isCallMinimized}
        contact={contact}
        callDuration={formatDuration(callDuration)}
        onMaximize={handleMaximizeCall}
        onEnd={handleEndCall}
      />
    </div>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isCallMinimized, setIsCallMinimized] = useState(false);
  const [contact, setContact] = useState<Contact | null>(null);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    // Check if user has logged in before
    const hasLoggedIn = localStorage.getItem("hasLoggedIn");
    if (hasLoggedIn === "true") {
      setIsAuthenticated(true);
    }
    setIsInitialLoad(false);
  }, []);

  // Show loading while checking auth state
  if (isInitialLoad) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <CallContext.Provider value={{
        isCallActive,
        isVideoActive,
        isCallMinimized,
        contact,
        callDuration,
        setIsCallActive,
        setIsVideoActive,
        setIsCallMinimized,
        setContact,
        setCallDuration,
      }}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthWrapper isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
          </BrowserRouter>
        </TooltipProvider>
      </CallContext.Provider>
    </QueryClientProvider>
  );
};

const AuthWrapper = ({ 
  isAuthenticated, 
  setIsAuthenticated 
}: { 
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
}) => {
  const location = useLocation();
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setFadeIn(false);
    const timer = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // If not authenticated and not on auth pages, redirect to loading
  if (!isAuthenticated && location.pathname !== "/loading" && location.pathname !== "/login") {
    return <Navigate to="/loading" replace />;
  }

  // If authenticated and on auth pages, redirect to home
  if (isAuthenticated && (location.pathname === "/loading" || location.pathname === "/login")) {
    return <Navigate to="/" replace />;
  }

  return (
    <div 
      className={`transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}
    >
      <Routes>
        <Route path="/loading" element={<Loading />} />
        <Route path="/login" element={<Login onLogin={() => {
          setIsAuthenticated(true);
          localStorage.setItem("hasLoggedIn", "true");
        }} />} />
        <Route path="/*" element={<AppContent />} />
      </Routes>
    </div>
  );
};

export default App;
