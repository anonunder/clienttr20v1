import { useState, useEffect } from "react";
import { ContactsList } from "@/components/chat/ContactsList";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageList } from "@/components/chat/MessageList";
import { MessageInput } from "@/components/chat/MessageInput";
import { CallOverlay } from "@/components/chat/CallOverlay";
import { IncomingCallModal } from "@/components/chat/IncomingCallModal";
import { useCall } from "@/App";

interface Message {
  id: string;
  text: string;
  sender: "user" | "contact";
  timestamp: string;
}

interface Contact {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  online: boolean;
  lastMessage?: string;
  unread?: number;
}

const Chat = () => {
  const [contacts] = useState<Contact[]>([
    {
      id: "1",
      name: "Coach Mike",
      role: "Head Trainer",
      online: true,
      lastMessage: "That's awesome! Remember to stretch...",
      unread: 2,
    },
    {
      id: "2",
      name: "Sarah Johnson",
      role: "Nutritionist",
      online: true,
      lastMessage: "Your meal plan is ready!",
    },
    {
      id: "3",
      name: "John Fitness",
      role: "Personal Trainer",
      online: false,
      lastMessage: "See you tomorrow at 9 AM",
    },
    {
      id: "4",
      name: "Emma Wilson",
      role: "Yoga Instructor",
      online: true,
      lastMessage: "Great progress on flexibility!",
    },
  ]);

  const [selectedContact, setSelectedContact] = useState<Contact>(contacts[0]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hey! How's your training going today?",
      sender: "contact",
      timestamp: "10:30 AM",
    },
    {
      id: "2",
      text: "Great! Just finished the upper body workout. Feeling strong!",
      sender: "user",
      timestamp: "10:32 AM",
    },
    {
      id: "3",
      text: "That's awesome! Remember to stretch and stay hydrated. Keep up the great work! 💪",
      sender: "contact",
      timestamp: "10:33 AM",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showIncomingCall, setShowIncomingCall] = useState(false);
  const [incomingCallType, setIncomingCallType] = useState<"audio" | "video">("audio");
  const [isConnected, setIsConnected] = useState(false);

  const {
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
  } = useCall();

  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages([...messages, message]);
    setNewMessage("");
    setShowEmojiPicker(false);

    // Simulate contact reply after 2 seconds
    setTimeout(() => {
      const replies = [
        "Thanks for your message! I'll get back to you soon.",
        "Got it! Let me check that for you.",
        "Sounds good! I'll look into it.",
        "Perfect! Keep up the great work! 💪",
        "That's awesome! Let's keep the momentum going!",
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      const reply: Message = {
        id: Date.now().toString(),
        text: randomReply,
        sender: "contact",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, reply]);
    }, 2000);
  };

  const handleAttachment = (file: File) => {
    const message: Message = {
      id: Date.now().toString(),
      text: `📎 Sent ${file.name}`,
      sender: "user",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages([...messages, message]);
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate voice recording
      setTimeout(() => {
        const message: Message = {
          id: Date.now().toString(),
          text: "🎤 Voice message (0:05)",
          sender: "user",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setMessages([...messages, message]);
        setIsRecording(false);
      }, 2000);
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(newMessage + emoji);
  };

  const handleCall = () => {
    setIsCallActive(true);
    setIsVideoActive(false);
    setIsCallMinimized(false);
    setContact(selectedContact);
    setCallDuration(0);
  };

  const handleVideo = () => {
    setIsVideoActive(true);
    setIsCallActive(false);
    setIsCallMinimized(false);
    setContact(selectedContact);
    setCallDuration(0);
  };

  const handleAnswerCall = () => {
    setShowIncomingCall(false);
    if (incomingCallType === "video") {
      setIsVideoActive(true);
      setIsCallActive(false);
    } else {
      setIsCallActive(true);
      setIsVideoActive(false);
    }
    setIsCallMinimized(false);
    setIsConnected(false);
    setCallDuration(0);
    setContact(selectedContact);
  };

  useEffect(() => {
    if (!isCallActive && !isVideoActive) return;

    // Only simulate connection if not already connected (new call)
    if (callDuration === 0) {
      const connectionTimeout = setTimeout(() => {
        setIsConnected(true);
      }, 2000);
      
      // Start call duration timer
      const interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      return () => {
        clearTimeout(connectionTimeout);
        clearInterval(interval);
      };
    } else {
      // Call is already in progress, just set as connected
      setIsConnected(true);
      
      // Continue the timer
      const interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isCallActive, isVideoActive, callDuration, setCallDuration]);

  const handleDeclineCall = () => {
    setShowIncomingCall(false);
  };

  const handleHideIncomingCall = () => {
    setShowIncomingCall(false);
  };

  const handleMinimizeCall = () => {
    setIsCallMinimized(true);
  };

  const handleMaximizeCall = () => {
    setIsCallMinimized(false);
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setIsVideoActive(false);
    setIsCallMinimized(false);
    setCallDuration(0);
    setIsConnected(false);
    setContact(null);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    setIsSheetOpen(false);
  };

  const handleSimulateCall = () => {
    setIncomingCallType("audio");
    setShowIncomingCall(true);
  };

  const handleSimulateVideo = () => {
    setIncomingCallType("video");
    setShowIncomingCall(true);
  };

  return (
    <div className="h-screen bg-background flex overflow-hidden relative pb-16">
      {/* Desktop Contacts Sidebar */}
      <div className="hidden md:flex w-80 border-r border-border flex-col bg-card">
        <ContactsList
          contacts={contacts}
          selectedContact={selectedContact}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onContactSelect={handleContactSelect}
        />
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full">
        <ChatHeader
          selectedContact={selectedContact}
          isCallActive={isCallActive}
          isVideoActive={isVideoActive}
          onCallToggle={handleCall}
          onVideoToggle={handleVideo}
          onSimulateCall={handleSimulateCall}
          onSimulateVideo={handleSimulateVideo}
          isSheetOpen={isSheetOpen}
          onSheetOpenChange={setIsSheetOpen}
          contactsListElement={
            <ContactsList
              contacts={contacts}
              selectedContact={selectedContact}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onContactSelect={handleContactSelect}
            />
          }
        />

        <MessageList messages={messages} contactName={selectedContact.name} />

        <MessageInput
          newMessage={newMessage}
          onMessageChange={setNewMessage}
          onSend={handleSend}
          onAttachment={handleAttachment}
          onVoiceRecord={handleVoiceRecord}
          showEmojiPicker={showEmojiPicker}
          onToggleEmojiPicker={() => setShowEmojiPicker(!showEmojiPicker)}
          onEmojiSelect={handleEmojiSelect}
          isRecording={isRecording}
        />
      </div>

      {!isCallMinimized && (
        <CallOverlay
          isActive={isCallActive || isVideoActive}
          isVideo={isVideoActive}
          contact={contact || selectedContact}
          onEnd={handleEndCall}
          onMinimize={handleMinimizeCall}
        />
      )}

      {showIncomingCall && (
        <IncomingCallModal
          isVideo={incomingCallType === "video"}
          contact={selectedContact}
          onAnswer={handleAnswerCall}
          onDecline={handleDeclineCall}
          onHide={handleHideIncomingCall}
        />
      )}
    </div>
  );
};

export default Chat;
