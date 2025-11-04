import { Phone, Video, Maximize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

interface Contact {
  id: string;
  name: string;
  avatar?: string;
}

interface MinimizedCallFloatProps {
  isVideo: boolean;
  contact: Contact;
  callDuration: string;
  onMaximize: () => void;
  onEnd: () => void;
}

export const MinimizedCallFloat = ({ 
  isVideo, 
  contact, 
  callDuration, 
  onMaximize, 
  onEnd 
}: MinimizedCallFloatProps) => {
  return (
    <Card className="fixed bottom-24 right-4 md:bottom-24 md:right-4 p-3 bg-card border-border shadow-lg z-40 flex items-center gap-3">
      <Avatar className="h-10 w-10">
        <AvatarImage src={contact.avatar} />
        <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col min-w-[100px]">
        <div className="flex items-center gap-2">
          {isVideo ? <Video className="h-3 w-3" /> : <Phone className="h-3 w-3" />}
          <span className="text-sm font-medium">{contact.name}</span>
        </div>
        <span className="text-xs text-muted-foreground font-mono">{callDuration}</span>
      </div>

      <div className="flex gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onMaximize}
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={onEnd}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};
