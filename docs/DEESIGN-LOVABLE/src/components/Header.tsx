import { Building2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import logo from "@/assets/logo.png";

interface HeaderProps {
  title: string;
  description: string;
}

const Header = ({ title, description }: HeaderProps) => {
  const companies = [
    { id: "1", name: "FitLife Studios", members: 250 },
    { id: "2", name: "PowerGym Elite", members: 180 },
    { id: "3", name: "Wellness Center Pro", members: 320 },
    { id: "4", name: "Iron Paradise", members: 150 },
    { id: "5", name: "Flex & Flow", members: 200 },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-20 items-center justify-between px-4 md:px-6">
        {/* Left Section - Logo & Title */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="Train Anywhere" className="h-2 md:h-4" />
          <h1 className="hidden md:block text-s md:text-m font-bold text-foreground">{title}</h1>
        </div>

        {/* Center Title - Mobile Only */}
        <h1 className="md:hidden absolute left-1/2 -translate-x-1/2 text-lg font-bold text-foreground">{title}</h1>

        {/* Right Section - Company Selector */}
        <div className="flex items-center gap-3">
          <Select defaultValue="1">
            <SelectTrigger className="w-[200px] md:w-[240px] bg-card">
              <SelectValue placeholder="Select company" />
            </SelectTrigger>
            <SelectContent className="bg-card z-50">
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  <div className="flex flex-col">
                    <span className="font-medium">{company.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
};

export default Header;
