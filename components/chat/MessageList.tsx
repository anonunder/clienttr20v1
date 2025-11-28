import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { darkTheme } from '@/styles/theme';
import { Message } from './types';

interface MessageListProps {
  messages: Message[];
  contactName: string;
}

export function MessageList({ messages, contactName }: MessageListProps) {
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No messages yet</Text>
        <Text style={styles.emptySubtext}>
          Start a conversation with {contactName}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {messages.map((message) => (
        <View
          key={message.id}
          style={[
            styles.messageWrapper,
            message.sender === 'user' ? styles.userMessageWrapper : styles.contactMessageWrapper,
          ]}
        >
          <View
            style={[
              styles.messageBubble,
              message.sender === 'user' ? styles.userMessage : styles.contactMessage,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                message.sender === 'user' ? styles.userMessageText : styles.contactMessageText,
              ]}
            >
              {message.text}
            </Text>
            <Text
              style={[
                styles.timestamp,
                message.sender === 'user' ? styles.userTimestamp : styles.contactTimestamp,
              ]}
            >
              {message.timestamp}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.color.bg,
  },
  contentContainer: {
    padding: 16,
    gap: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: darkTheme.color.foreground,
  },
  emptySubtext: {
    fontSize: 14,
    color: darkTheme.color.mutedForeground,
    textAlign: 'center',
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  contactMessageWrapper: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 4,
  },
  userMessage: {
    backgroundColor: darkTheme.color.primary,
    borderBottomRightRadius: 4,
  },
  contactMessage: {
    backgroundColor: darkTheme.color.card,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: darkTheme.color.border,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userMessageText: {
    color: darkTheme.color.primaryForeground,
  },
  contactMessageText: {
    color: darkTheme.color.foreground,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  userTimestamp: {
    color: `${darkTheme.color.primaryForeground}CC`,
    textAlign: 'right',
  },
  contactTimestamp: {
    color: darkTheme.color.mutedForeground,
    textAlign: 'left',
  },
});

