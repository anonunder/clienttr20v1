import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  StyleSheet, 
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Text,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
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
import { useChatSocket } from '@/hooks/chat';
import { RootState, AppDispatch } from '@/state/store';
import {
  fetchContacts,
  fetchGroups,
  fetchChatHistory,
  sendMessage as sendMessageThunk,
  sendGroupMessage as sendGroupMessageThunk,
} from '@/features/chat/chat-thunks';
import { setActiveChat } from '@/features/chat/chat-slice';
import { useAuth } from '@/hooks/use-auth';
import { useUserRole } from '@/hooks/use-user-role';

/**
 * 💬 Chat Screen - Real-time Socket Implementation
 * 
 * Full-featured chat interface with:
 * - Real-time Socket.IO connection
 * - Direct messaging (client ↔ trainer)
 * - Group chat
 * - Typing indicators
 * - Online status
 * - Read receipts
 * - Voice and video call support
 */
export default function ChatScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const userRole = useUserRole();
  
  // Socket connection
  const {
    isReady,
    isConnected,
    sendTyping,
    sendGroupTyping,
    markAsRead,
  } = useChatSocket();

  // Redux state
  const {
    contacts,
    groups,
    messagesByChat,
    activeChatId,
    activeChatType,
    loading,
    onlineUsers,
  } = useSelector((state: RootState) => state.chat);

  // Local UI state
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Call state
  const [isCallActive, setIsCallActive] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isCallMinimized, setIsCallMinimized] = useState(false);
  const [showIncomingCall, setShowIncomingCall] = useState(false);
  const [incomingCallType] = useState<'audio' | 'video'>('audio');
  const [callDuration, setCallDuration] = useState(0);

  const windowWidth = Dimensions.get('window').width;
  const isDesktop = windowWidth >= 768;

  // Load initial data when socket is ready
  useEffect(() => {
    if (isReady) {
      console.log('✅ Socket ready, loading chat data...');
      dispatch(fetchContacts({}));
      dispatch(fetchGroups());
    }
  }, [isReady, dispatch]);

  // Convert socket types to component types
  const convertedContacts: Contact[] = contacts.map(c => ({
    id: c.id,
    name: c.name,
    role: c.role,
    avatar: c.avatar,
    online: c.is_online || onlineUsers.has(c.id),
    lastMessage: c.last_message?.content,
    unread: c.unread_count,
  }));

  const convertedGroups: Group[] = groups.map(g => ({
    id: g.id,
    name: g.name,
    avatar: g.avatar,
    memberCount: g.member_count,
    lastMessage: g.last_message?.content,
    unread: g.unread_count,
  }));

  // Get current messages
  const currentMessages: Message[] = activeChatId
    ? [...(messagesByChat[activeChatId] || [])] // Create a copy first!
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) // Sort oldest first
        .map(m => {
          // Format timestamp properly
          let formattedTime = 'Invalid Date';
          try {
            const date = new Date(m.created_at);
            if (!isNaN(date.getTime())) {
              formattedTime = date.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              });
            }
          } catch (error) {
            console.error('Error formatting date:', m.created_at, error);
          }

          return {
            id: m.id,
            text: m.content,
            sender: m.sender_id === user?.id ? 'user' : 'contact',
            timestamp: formattedTime,
          };
        })
    : [];

  // Log messages for debugging
  console.log('💬 Current Messages:', {
    activeChatId,
    activeChatType,
    messagesCount: currentMessages.length,
    rawMessagesCount: activeChatId ? (messagesByChat[activeChatId] || []).length : 0,
    allChats: Object.keys(messagesByChat),
    messages: currentMessages.slice(-3), // Last 3 messages
  });

  // Get selected contact/group
  const selectedContact = activeChatType === 'direct' && activeChatId
    ? convertedContacts.find(c => c.id === activeChatId) || null
    : null;

  const selectedGroup = activeChatType === 'group' && activeChatId
    ? convertedGroups.find(g => g.id === activeChatId) || null
    : null;

  // Handle contact selection
  const handleContactSelect = useCallback((contact: Contact) => {
    console.log('👤 Contact selected:', {
      contactId: contact.id,
      contactName: contact.name,
      unreadCount: contact.unread,
    });
    
    dispatch(setActiveChat({ chatId: contact.id, type: 'direct' }));
    dispatch(fetchChatHistory({ 
      chatId: contact.id, 
      isGroup: false,
      options: { limit: 50 }
    }));
    setIsSheetOpen(false);
    
    // Mark messages as read if there are unread messages
    if (contact.unread && contact.unread > 0) {
      const isTrainer = userRole && ['trainer', 'manager', 'admin'].includes(userRole);
      
      // Get message IDs from the current chat
      const messagesToMark = messagesByChat[contact.id] || [];
      const unreadMessageIds = messagesToMark
        .filter(m => !m.read_at && m.sender_id !== user?.id)
        .map(m => m.id);
      
      if (unreadMessageIds.length > 0) {
        markAsRead({
          [isTrainer ? 'client_id' : 'trainer_id']: contact.id,
          message_ids: unreadMessageIds,
        });
      }
    }
  }, [dispatch, markAsRead, userRole, messagesByChat, user?.id]);

  // Handle group selection
  const handleGroupSelect = useCallback((group: Group) => {
    dispatch(setActiveChat({ chatId: group.id, type: 'group' }));
    dispatch(fetchChatHistory({ 
      chatId: group.id, 
      isGroup: true,
      options: { limit: 50 }
    }));
    setIsSheetOpen(false);
  }, [dispatch]);

  // Handle message send
  const handleSend = useCallback(async () => {
    if (!newMessage.trim() || !activeChatId) return;

    console.log('📤 Sending message:', {
      activeChatId,
      activeChatType,
      content: newMessage.trim(),
    });

    try {
      if (activeChatType === 'group') {
        // Send group message
        await dispatch(sendGroupMessageThunk({
          group_id: activeChatId,
          type: 'text',
          content: newMessage.trim(),
        })).unwrap();
      } else {
        // Send direct message
        await dispatch(sendMessageThunk({
          recipient_id: activeChatId,
          type: 'text',
          content: newMessage.trim(),
        })).unwrap();
      }

      console.log('✅ Message sent successfully');
      setNewMessage('');
      setShowEmojiPicker(false);

      // Stop typing indicator
      if (activeChatType === 'group') {
        sendGroupTyping({ group_id: activeChatId, is_typing: false });
      } else {
        const isTrainer = userRole && ['trainer', 'manager', 'admin'].includes(userRole);
        sendTyping({
          [isTrainer ? 'client_id' : 'trainer_id']: activeChatId,
          is_typing: false,
        });
      }
    } catch (error) {
      console.error('❌ Failed to send message:', error);
    }
  }, [newMessage, activeChatId, activeChatType, dispatch, sendGroupTyping, sendTyping, userRole]);

  // Handle message change with typing indicator
  const handleMessageChange = useCallback((text: string) => {
    setNewMessage(text);

    if (!activeChatId) return;

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Send typing indicator
    if (text.trim()) {
      if (activeChatType === 'group') {
        sendGroupTyping({ group_id: activeChatId, is_typing: true });
      } else {
        const isTrainer = userRole && ['trainer', 'manager', 'admin'].includes(userRole);
        sendTyping({
          [isTrainer ? 'client_id' : 'trainer_id']: activeChatId,
          is_typing: true,
        });
      }

      // Stop typing after 3 seconds
      const timeout = setTimeout(() => {
        if (activeChatType === 'group') {
          sendGroupTyping({ group_id: activeChatId, is_typing: false });
        } else {
          const isTrainer = userRole && ['trainer', 'manager', 'admin'].includes(userRole);
          sendTyping({
            [isTrainer ? 'client_id' : 'trainer_id']: activeChatId,
            is_typing: false,
          });
        }
      }, 3000);

      setTypingTimeout(timeout);
    }
  }, [activeChatId, activeChatType, typingTimeout, sendGroupTyping, sendTyping, userRole]);

  // Handle attachment
  const handleAttachment = useCallback((file: { name: string; uri: string; type?: string }) => {
    // TODO: Implement file upload
    console.log('Upload file:', file);
  }, []);

  // Handle voice recording
  const handleVoiceRecord = useCallback(() => {
    setIsRecording(!isRecording);
    // TODO: Implement voice recording
  }, [isRecording]);

  // Handle emoji select
  const handleEmojiSelect = useCallback((emoji: string) => {
    setNewMessage(prev => prev + emoji);
  }, []);

  // Call handlers
  const handleCall = useCallback(() => {
    setIsCallActive(true);
    setIsVideoActive(false);
    setIsCallMinimized(false);
    setCallDuration(0);
  }, []);

  const handleVideo = useCallback(() => {
    setIsVideoActive(true);
    setIsCallActive(false);
    setIsCallMinimized(false);
    setCallDuration(0);
  }, []);

  const handleAnswerCall = useCallback(() => {
    setShowIncomingCall(false);
    if (incomingCallType === 'video') {
      setIsVideoActive(true);
      setIsCallActive(false);
    } else {
      setIsCallActive(true);
      setIsVideoActive(false);
    }
    setIsCallMinimized(false);
    setCallDuration(0);
  }, [incomingCallType]);

  const handleDeclineCall = useCallback(() => {
    setShowIncomingCall(false);
  }, []);

  const handleHideIncomingCall = useCallback(() => {
    setShowIncomingCall(false);
  }, []);

  const handleMinimizeCall = useCallback(() => {
    setIsCallMinimized(true);
  }, []);

  const handleMaximizeCall = useCallback(() => {
    setIsCallMinimized(false);
  }, []);

  const handleEndCall = useCallback(() => {
    setIsCallActive(false);
    setIsVideoActive(false);
    setIsCallMinimized(false);
    setCallDuration(0);
  }, []);

  const formatDuration = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Call duration timer
  useEffect(() => {
    if (!isCallActive && !isVideoActive) return;

    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isCallActive, isVideoActive]);

  // Show loading state
  if (!isReady) {
    return (
      <View style={styles.container}>
        <Header title="Chat" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={darkTheme.color.primary} />
          <Text style={styles.loadingText}>
            {isConnected ? 'Initializing chat...' : 'Connecting to chat...'}
          </Text>
        </View>
        <Navigation />
      </View>
    );
  }

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
                contacts={convertedContacts}
                groups={convertedGroups}
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
                onSimulateCall={() => {}} // Remove in production
                onSimulateVideo={() => {}} // Remove in production
                isSheetOpen={isSheetOpen}
                onSheetOpenChange={setIsSheetOpen}
                contactsListElement={
                  <ContactsList
                    contacts={convertedContacts}
                    groups={convertedGroups}
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

            {loading && !currentMessages.length ? (
              <View style={styles.loadingMessages}>
                <ActivityIndicator color={darkTheme.color.primary} />
              </View>
            ) : (
              <MessageList 
                messages={currentMessages} 
                contactName={selectedContact?.name || selectedGroup?.name || ''} 
              />
            )}

            {(selectedContact || selectedGroup) && (
              <MessageInput
                newMessage={newMessage}
                onMessageChange={handleMessageChange}
                onSend={handleSend}
                onAttachment={handleAttachment}
                onVoiceRecord={handleVoiceRecord}
                showEmojiPicker={showEmojiPicker}
                onToggleEmojiPicker={() => setShowEmojiPicker(!showEmojiPicker)}
                onEmojiSelect={handleEmojiSelect}
                isRecording={isRecording}
              />
            )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: darkTheme.color.mutedForeground,
    fontSize: 14,
  },
  loadingMessages: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
