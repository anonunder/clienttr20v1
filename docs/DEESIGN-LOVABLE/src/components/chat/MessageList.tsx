import { User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Message {
  id: string;
  text: string;
  sender: "user" | "contact";
  timestamp: string;
}

interface MessageListProps {
  messages: Message[];
  contactName: string;
}

export const MessageList = ({ messages, contactName }: MessageListProps) => {
  return (
    <ScrollArea className="flex-1 p-4 md:p-6 h-[calc(100vh-theme(spacing.16)-140px)]">
      <div className="space-y-4 max-w-4xl mx-auto pb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 ${message.sender === "user" ? "flex-row-reverse" : ""}`}
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {message.sender === "user" ? <User className="h-4 w-4" /> : contactName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div
              className={`flex-1 max-w-md space-y-1 ${message.sender === "user" ? "items-end" : "items-start"}`}
            >
              <div
                className={`rounded-2xl p-4 ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground ml-auto"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
              <p className="text-xs text-muted-foreground px-2">{message.timestamp}</p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};
