import { Phone, Video, PhoneOff, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  role?: string;
}

interface IncomingCallModalProps {
  isVideo: boolean;
  contact: Contact;
  onAnswer: () => void;
  onDecline: () => void;
  onHide: () => void;
}

export const IncomingCallModal = ({ 
  isVideo, 
  contact, 
  onAnswer, 
  onDecline, 
  onHide 
}: IncomingCallModalProps) => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="p-8 text-center space-y-6 bg-card border-border max-w-md w-full mx-4 relative animate-in fade-in-0 zoom-in-95">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8"
          onClick={onHide}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Avatar className="h-24 w-24 ring-4 ring-primary/20 animate-pulse">
              <AvatarImage src={contact.avatar} />
              <AvatarFallback className="text-3xl">{contact.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 p-2 bg-primary rounded-full">
              {isVideo ? <Video className="h-4 w-4 text-primary-foreground" /> : <Phone className="h-4 w-4 text-primary-foreground" />}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-foreground">{contact.name}</h2>
            {contact.role && (
              <p className="text-sm text-muted-foreground">{contact.role}</p>
            )}
          </div>

          <p className="text-lg text-muted-foreground">
            Incoming {isVideo ? "video" : "audio"} call...
          </p>
        </div>

        <div className="flex gap-4 justify-center pt-4">
          <Button
            variant="destructive"
            size="icon"
            className="h-16 w-16 rounded-full"
            onClick={onDecline}
          >
            <PhoneOff className="h-6 w-6" />
          </Button>
          
          <Button
            variant="default"
            size="icon"
            className="h-16 w-16 rounded-full bg-success hover:bg-success/90"
            onClick={onAnswer}
          >
            {isVideo ? <Video className="h-6 w-6" /> : <Phone className="h-6 w-6" />}
          </Button>
        </div>
      </Card>
    </div>
  );
};
