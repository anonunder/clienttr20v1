import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useSocket } from '../../../../hooks/use-socket';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../../state/store';

interface Message {
  id: string;
  text: string;
  userId: string;
  userName?: string;
  timestamp: string;
}

export default function ChatScreen() {
  const { t } = useTranslation();
  const token = useSelector((state: RootState) => state.auth.token);
  const socket = useSocket(token);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    socket.on('session:welcome', data => {
      console.log('Welcome:', data.message);
    });

    socket.on('chat:message', msg => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off('session:welcome');
      socket.off('chat:message');
    };
  }, [socket]);

  function send() {
    if (!text.trim()) return;
    socket.emit('chat:send', { text });
    setText('');
  }

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <KeyboardAvoidingView 
        className="flex-1" 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View className="px-4 py-3 border-b border-border">
          <Text className="text-text text-2xl font-bold">{t('chat.title')}</Text>
        </View>

        <ScrollView className="flex-1 px-4 py-3">
          {messages.length === 0 ? (
            <View className="flex-1 items-center justify-center py-8">
              <Text className="text-textMuted">{t('chat.noMessages')}</Text>
            </View>
          ) : (
            <View className="gap-3">
              {messages.map(msg => (
                <View key={msg.id} className="bg-card rounded-xl p-3 border border-border">
                  {msg.userName && (
                    <Text className="text-primary text-sm font-semibold mb-1">{msg.userName}</Text>
                  )}
                  <Text className="text-text">{msg.text}</Text>
                  <Text className="text-textMuted text-xs mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>

        <View className="px-4 py-3 border-t border-border bg-card">
          <View className="flex-row gap-2">
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder={t('chat.typeMessage')}
              placeholderTextColor="#94a3b8"
              className="flex-1 bg-bgMuted text-text px-4 py-3 rounded-xl"
            />
            <TouchableOpacity
              onPress={send}
              className="bg-primary px-6 py-3 rounded-xl items-center justify-center"
            >
              <Text className="text-white font-semibold">{t('chat.sendMessage')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

