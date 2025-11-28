import React, { useState, useEffect } from 'react';
import { 
  View, 
  StyleSheet, 
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Header from '@/components/layout/Header';
import Navigation from '@/components/layout/Navigation';
import { darkTheme } from '@/styles/theme';
import { 
  ContactsList,
  ChatHeader,
  MessageList,
  MessageInput,
  CallOverlay,
  IncomingCallModal,
  GlobalCallFloat,
} from '@/components/chat';
import { Contact, Message, Group } from '@/components/chat/types';

/**
 * 💬 Chat Screen
 * 
 * Full-featured chat interface with:
 * - Contacts list (sidebar on desktop, drawer on mobile)
 * - Trainers/Groups tabs
 * - Message list with auto-scroll
 * - Message input with emoji picker and attachments
 * - Voice and video call support
 * - Incoming call handling
 * - Minimized call floating widget
 */
export default function ChatScreen() {
  // Mock contacts data
  const [contacts] = useState<Contact[]>([
    {
      id: '1',
      name: 'Coach Mike',
      role: 'Head Trainer',
      online: true,
      lastMessage: "That's awesome! Remember to stretch...",
      unread: 2,
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      role: 'Nutritionist',
      online: true,
      lastMessage: 'Your meal plan is ready!',
    },
    {
      id: '3',
      name: 'John Fitness',
      role: 'Personal Trainer',
      online: false,
      lastMessage: 'See you tomorrow at 9 AM',
    },
    {
      id: '4',
      name: 'Emma Wilson',
      role: 'Yoga Instructor',
      online: true,
      lastMessage: 'Great progress on flexibility!',
    },
  ]);

  // Mock groups data
  const [groups] = useState<Group[]>([
    {
      id: 'g1',
      name: 'Morning Workout Group',
      memberCount: 12,
      lastMessage: 'Great session today everyone!',
      unread: 3,
    },
    {
      id: 'g2',
      name: 'Nutrition Tips',
      memberCount: 45,
      lastMessage: 'Check out this recipe...',
    },
    {
      id: 'g3',
      name: 'Yoga & Meditation',
      memberCount: 28,
      lastMessage: 'New meditation session tomorrow',
      unread: 1,
    },
  ]);

  // State
  const [selectedContact, setSelectedContact] = useState<Contact | null>(contacts[0]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hey! How's your training going today?",
      sender: 'contact',
      timestamp: '10:30 AM',
    },
    {
      id: '2',
      text: 'Great! Just finished the upper body workout. Feeling strong!',
      sender: 'user',
      timestamp: '10:32 AM',
    },
    {
      id: '3',
      text: "That's awesome! Remember to stretch and stay hydrated. Keep up the great work! 💪",
      sender: 'contact',
      timestamp: '10:33 AM',
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  
  // Call state
  const [isCallActive, setIsCallActive] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isCallMinimized, setIsCallMinimized] = useState(false);
  const [showIncomingCall, setShowIncomingCall] = useState(false);
  const [incomingCallType, setIncomingCallType] = useState<'audio' | 'video'>('audio');
  const [callDuration, setCallDuration] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  const windowWidth = Dimensions.get('window').width;
  const isDesktop = windowWidth >= 768;

  // Handle message send
  const handleSend = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, message]);
    setNewMessage('');
    setShowEmojiPicker(false);

    // Simulate contact reply after 2 seconds
    setTimeout(() => {
      const replies = [
        "Thanks for your message! I'll get back to you soon.",
        "Got it! Let me check that for you.",
        "Sounds good! I'll look into it.",
        'Perfect! Keep up the great work! 💪',
        "That's awesome! Let's keep the momentum going!",
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      const reply: Message = {
        id: Date.now().toString(),
        text: randomReply,
        sender: 'contact',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, reply]);
    }, 2000);
  };

  // Handle attachment
  const handleAttachment = (file: { name: string; uri: string; type?: string }) => {
    const message: Message = {
      id: Date.now().toString(),
      text: `📎 Sent ${file.name}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages([...messages, message]);
  };

  // Handle voice recording
  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Simulate voice recording
      setTimeout(() => {
        const message: Message = {
          id: Date.now().toString(),
          text: '🎤 Voice message (0:05)',
          sender: 'user',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, message]);
        setIsRecording(false);
      }, 2000);
    }
  };

  // Handle emoji select
  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(newMessage + emoji);
  };

  // Handle calls
  const handleCall = () => {
    setIsCallActive(true);
    setIsVideoActive(false);
    setIsCallMinimized(false);
    setCallDuration(0);
  };

  const handleVideo = () => {
    setIsVideoActive(true);
    setIsCallActive(false);
    setIsCallMinimized(false);
    setCallDuration(0);
  };

  const handleAnswerCall = () => {
    setShowIncomingCall(false);
    if (incomingCallType === 'video') {
      setIsVideoActive(true);
      setIsCallActive(false);
    } else {
      setIsCallActive(true);
      setIsVideoActive(false);
    }
    setIsCallMinimized(false);
    setIsConnected(false);
    setCallDuration(0);
  };

  // Call duration timer
  useEffect(() => {
    if (!isCallActive && !isVideoActive) return;

    if (callDuration === 0) {
      const connectionTimeout = setTimeout(() => {
        setIsConnected(true);
      }, 2000);

      const interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      return () => {
        clearTimeout(connectionTimeout);
        clearInterval(interval);
      };
    } else {
      setIsConnected(true);

      const interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [isCallActive, isVideoActive, callDuration]);

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
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleContactSelect = (contact: Contact) => {
    setSelectedContact(contact);
    setSelectedGroup(null);
    setIsSheetOpen(false);
  };

  const handleGroupSelect = (group: Group) => {
    setSelectedGroup(group);
    setSelectedContact(null);
    setIsSheetOpen(false);
  };

  const handleSimulateCall = () => {
    setIncomingCallType('audio');
    setShowIncomingCall(true);
  };

  const handleSimulateVideo = () => {
    setIncomingCallType('video');
    setShowIncomingCall(true);
  };

  return (
    <View style={styles.container}>
      {/* Standard App Header */}
      <Header title="Chat" />

      {/* Chat Content */}
      <KeyboardAvoidingView 
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.content}>
          {/* Desktop Contacts Sidebar */}
          {isDesktop && (
            <View style={styles.sidebar}>
              <ContactsList
                contacts={contacts}
                groups={groups}
                selectedContact={selectedContact}
                selectedGroup={selectedGroup}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onContactSelect={handleContactSelect}
                onGroupSelect={handleGroupSelect}
              />
            </View>
          )}

          {/* Chat Area */}
          <View style={styles.chatArea}>
            {(selectedContact || selectedGroup) && (
              <ChatHeader
                selectedContact={selectedContact || {
                  id: selectedGroup?.id || '',
                  name: selectedGroup?.name || '',
                  role: `${selectedGroup?.memberCount || 0} members`,
                  online: true,
                }}
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
                    groups={groups}
                    selectedContact={selectedContact}
                    selectedGroup={selectedGroup}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onContactSelect={handleContactSelect}
                    onGroupSelect={handleGroupSelect}
                  />
                }
              />
            )}

            <MessageList 
              messages={messages} 
              contactName={selectedContact?.name || selectedGroup?.name || ''} 
            />

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
          </View>
        </View>

        {/* Call Overlay */}
        {!isCallMinimized && selectedContact && (
          <CallOverlay
            isActive={isCallActive || isVideoActive}
            isVideo={isVideoActive}
            contact={selectedContact}
            onEnd={handleEndCall}
            onMinimize={handleMinimizeCall}
          />
        )}

        {/* Incoming Call Modal */}
        {selectedContact && (
          <IncomingCallModal
            isVisible={showIncomingCall}
            isVideo={incomingCallType === 'video'}
            contact={selectedContact}
            onAnswer={handleAnswerCall}
            onDecline={handleDeclineCall}
            onHide={handleHideIncomingCall}
          />
        )}

        {/* Minimized Call Float */}
        {selectedContact && (
          <GlobalCallFloat
            isCallActive={isCallActive}
            isVideoActive={isVideoActive}
            isCallMinimized={isCallMinimized}
            contact={selectedContact}
            callDuration={formatDuration(callDuration)}
            onMaximize={handleMaximizeCall}
            onEnd={handleEndCall}
          />
        )}
      </KeyboardAvoidingView>
      
      {/* Bottom Navigation */}
      <Navigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.color.bg,
  },
  keyboardView: {
    flex: 1,
    marginBottom: 64, // Space for absolute positioned Navigation
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    width: 280,
    borderRightWidth: 1,
    borderRightColor: darkTheme.color.border,
    backgroundColor: darkTheme.color.card,
  },
  chatArea: {
    flex: 1,
    flexDirection: 'column',
  },
});
