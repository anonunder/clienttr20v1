import { useRef } from "react";
import { Send, Paperclip, Mic, Smile } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MessageInputProps {
  newMessage: string;
  onMessageChange: (message: string) => void;
  onSend: () => void;
  onAttachment: (file: File) => void;
  onVoiceRecord: () => void;
  showEmojiPicker: boolean;
  onToggleEmojiPicker: () => void;
  onEmojiSelect: (emoji: string) => void;
  isRecording: boolean;
}

const emojis = ["😊", "😂", "❤️", "👍", "🎉", "🔥", "💪", "👏", "🙏", "✨"];

export const MessageInput = ({
  newMessage,
  onMessageChange,
  onSend,
  onAttachment,
  onVoiceRecord,
  showEmojiPicker,
  onToggleEmojiPicker,
  onEmojiSelect,
  isRecording,
}: MessageInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onAttachment(file);
    }
  };

  return (
    <div className="p-4 border-t border-border bg-card">
      <div className="max-w-4xl mx-auto">
        {/* Emoji Picker */}
        {showEmojiPicker && (
          <div className="mb-2 p-3 bg-secondary rounded-lg flex flex-wrap gap-2">
            {emojis.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => onEmojiSelect(emoji)}
                className="text-2xl hover:scale-125 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
        
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAttachmentChange}
            className="hidden"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full shrink-0"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="rounded-full shrink-0"
            onClick={onToggleEmojiPicker}
          >
            <Smile className="h-5 w-5" />
          </Button>
          
          <Input
            value={newMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-background border-border text-foreground"
          />
          
          {newMessage.trim() ? (
            <Button
              type="submit"
              size="icon"
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-10 w-10 shrink-0"
            >
              <Send className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              type="button"
              variant={isRecording ? "default" : "ghost"}
              size="icon"
              className="rounded-full h-10 w-10 shrink-0"
              onClick={onVoiceRecord}
            >
              <Mic className={`h-5 w-5 ${isRecording ? "animate-pulse" : ""}`} />
            </Button>
          )}
        </form>
      </div>
    </div>
  );
};
