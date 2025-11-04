import { Phone, Video, MoreVertical, Menu, PhoneIncoming, VideoIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface Contact {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  online: boolean;
}

interface ChatHeaderProps {
  selectedContact: Contact;
  isCallActive: boolean;
  isVideoActive: boolean;
  onCallToggle: () => void;
  onVideoToggle: () => void;
  onSimulateCall: () => void;
  onSimulateVideo: () => void;
  isSheetOpen: boolean;
  onSheetOpenChange: (open: boolean) => void;
  contactsListElement: React.ReactNode;
}

export const ChatHeader = ({
  selectedContact,
  isCallActive,
  isVideoActive,
  onCallToggle,
  onVideoToggle,
  onSimulateCall,
  onSimulateVideo,
  isSheetOpen,
  onSheetOpenChange,
  contactsListElement,
}: ChatHeaderProps) => {
  return (
    <div className="h-16 border-b border-border px-4 md:px-6 flex items-center justify-between bg-card">
      <div className="flex items-center gap-3">
        {/* Mobile Menu Trigger */}
        <Sheet open={isSheetOpen} onOpenChange={onSheetOpenChange}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <div className="flex flex-col h-full">
              {contactsListElement}
            </div>
          </SheetContent>
        </Sheet>
        <div className="relative">
          <Avatar>
            <AvatarImage src={selectedContact.avatar} />
            <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
          </Avatar>
          {selectedContact.online && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-card" />
          )}
        </div>
        <div>
          <h2 className="font-semibold text-foreground">{selectedContact.name}</h2>
          <p className="text-sm text-muted-foreground">{selectedContact.role}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button 
          variant="ghost"
          size="icon" 
          className="rounded-full"
          onClick={onCallToggle}
          title="Call"
        >
          <Phone className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost"
          size="icon" 
          className="rounded-full"
          onClick={onVideoToggle}
          title="Video Call"
        >
          <Video className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost"
          size="icon" 
          className="rounded-full bg-primary/10 hover:bg-primary/20"
          onClick={onSimulateCall}
          title="Simulate Incoming Call"
        >
          <PhoneIncoming className="h-5 w-5 text-primary" />
        </Button>
        <Button 
          variant="ghost"
          size="icon" 
          className="rounded-full bg-primary/10 hover:bg-primary/20"
          onClick={onSimulateVideo}
          title="Simulate Incoming Video"
        >
          <VideoIcon className="h-5 w-5 text-primary" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <MoreVertical className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
