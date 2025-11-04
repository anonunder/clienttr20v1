import { useEffect, useState, useRef } from "react";
import { PhoneOff, VideoOff, Minimize2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Contact {
  id: string;
  name: string;
  avatar?: string;
  online: boolean;
}

interface CallOverlayProps {
  isActive: boolean;
  isVideo: boolean;
  contact: Contact;
  onEnd: () => void;
  onMinimize: () => void;
}

export const CallOverlay = ({ isActive, isVideo, contact, onEnd, onMinimize }: CallOverlayProps) => {
  const [callDuration, setCallDuration] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (!isActive) {
      setCallDuration(0);
      setIsConnected(false);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      return;
    }

    // Start video stream if video call
    if (isVideo) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(mediaStream => {
          setStream(mediaStream);
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        })
        .catch(err => console.error("Error accessing camera:", err));
    }

    // Simulate connection after 2 seconds
    const connectionTimer = setTimeout(() => {
      setIsConnected(true);
    }, 2000);

    return () => {
      clearTimeout(connectionTimer);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isActive, isVideo]);

  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isConnected]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 bg-background/95 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="p-8 text-center space-y-6 bg-card border-border max-w-2xl w-full mx-4">
        {isVideo && stream ? (
          <div className="relative w-full aspect-video bg-surface rounded-lg overflow-hidden">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <Avatar className="h-16 w-16 border-2 border-on-surface">
                <AvatarImage src={contact.avatar} />
                <AvatarFallback className="text-2xl">{contact.name.charAt(0)}</AvatarFallback>
              </Avatar>
              {contact.online && (
                <div className="w-3 h-3 bg-success rounded-full" />
              )}
            </div>
          </div>
        ) : (
          <div className="relative mx-auto">
            <Avatar className="h-32 w-32">
              <AvatarImage src={contact.avatar} />
              <AvatarFallback className="text-4xl">{contact.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {contact.online && (
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-success rounded-full border-4 border-card" />
            )}
          </div>
        )}
        
        <div>
          <h2 className="text-2xl font-bold text-foreground">{contact.name}</h2>
          <div className="flex flex-col items-center gap-2 mt-2">
            {isConnected ? (
              <>
                <Badge variant="default" className="bg-success text-primary-foreground">
                  Connected
                </Badge>
                <p className="text-2xl font-mono text-foreground mt-1">
                  {formatDuration(callDuration)}
                </p>
              </>
            ) : (
              <p className="text-muted-foreground">
                {isVideo ? "Connecting video call..." : "Connecting..."}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-4 justify-center pt-4">
          <Button
            variant="outline"
            size="icon"
            className="h-14 w-14 rounded-full"
            onClick={onMinimize}
          >
            <Minimize2 className="h-6 w-6" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            className="h-14 w-14 rounded-full"
            onClick={onEnd}
          >
            {isVideo ? <VideoOff className="h-6 w-6" /> : <PhoneOff className="h-6 w-6" />}
          </Button>
        </div>
      </Card>
    </div>
  );
};
