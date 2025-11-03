import Header from "@/components/Header";
import { ProgramCard } from "@/components/programs/ProgramCard/ProgramCard";

const Programs = () => {
  const programs = [
    {
      id: "1",
      name: "Beginner Full-Body",
      description: "Perfect for getting started with strength training and building foundational fitness",
      image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80",
      duration: "4 weeks",
      workouts: 12,
      difficulty: "Beginner",
      hasTraining: true,
      hasNutrition: true,
    },
    {
      id: "2",
      name: "Advanced Strength Training",
      description: "High-intensity program designed for experienced lifters seeking muscle growth",
      image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80",
      duration: "8 weeks",
      workouts: 24,
      difficulty: "Advanced",
      hasTraining: true,
      hasNutrition: true,
    },
    {
      id: "3",
      name: "Cardio Blast",
      description: "Fat-burning cardio workouts to improve endurance and torch calories",
      image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800&q=80",
      duration: "6 weeks",
      workouts: 18,
      difficulty: "Intermediate",
      hasTraining: true,
      hasNutrition: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header title="Programs" description="Choose your fitness program" />
      
      <div className="container px-4 py-8 md:px-6 pb-24">
        <div className="max-w-6xl mx-auto space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {programs.map((program) => (
            <ProgramCard
              key={program.id}
              id={program.id}
              name={program.name}
              description={program.description}
              image={program.image}
              duration={program.duration}
              workouts={program.workouts}
              difficulty={program.difficulty as "Beginner" | "Intermediate" | "Advanced"}
            />
          ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Programs;
