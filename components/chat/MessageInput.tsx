import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable,
  Platform,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { darkTheme } from '@/styles/theme';
import { layoutStyles, spacingStyles, borderStyles } from '@/styles/shared-styles';

interface MessageInputProps {
  newMessage: string;
  onMessageChange: (message: string) => void;
  onSend: () => void;
  onAttachment: (file: { name: string; uri: string; type?: string }) => void;
  onVoiceRecord: () => void;
  showEmojiPicker: boolean;
  onToggleEmojiPicker: () => void;
  onEmojiSelect: (emoji: string) => void;
  isRecording: boolean;
}

const emojis = ['😊', '😂', '❤️', '👍', '🎉', '🔥', '💪', '👏', '🙏', '✨'];

export function MessageInput({
  newMessage,
  onMessageChange,
  onSend,
  onAttachment,
  onVoiceRecord,
  showEmojiPicker,
  onToggleEmojiPicker,
  onEmojiSelect,
  isRecording,
}: MessageInputProps) {
  const handleAttachment = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        onAttachment({
          name: file.name,
          uri: file.uri,
          type: file.mimeType,
        });
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const handleSubmit = () => {
    if (newMessage.trim()) {
      onSend();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        {/* Emoji Picker */}
        {showEmojiPicker && (
          <View style={styles.emojiPicker}>
            {emojis.map((emoji) => (
              <Pressable
                key={emoji}
                onPress={() => onEmojiSelect(emoji)}
                style={styles.emojiButton}
              >
                <Text style={styles.emoji}>{emoji}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <View style={styles.inputRow}>
          <Button
            variant="ghost"
            size="icon"
            onPress={handleAttachment}
            icon={<Ionicons name="attach" size={22} color={darkTheme.color.foreground} />}
          />

          <Button
            variant="ghost"
            size="icon"
            onPress={onToggleEmojiPicker}
            icon={<Ionicons name="happy" size={22} color={darkTheme.color.foreground} />}
          />

          <View style={styles.textInputWrapper}>
            <Input
              value={newMessage}
              onChangeText={onMessageChange}
              placeholder="Type your message..."
              onSubmitEditing={handleSubmit}
              returnKeyType="send"
            />
          </View>

          {newMessage.trim() ? (
            <Button
              variant="default"
              size="icon"
              onPress={handleSubmit}
              icon={<Ionicons name="send" size={20} color={darkTheme.color.primaryForeground} />}
            />
          ) : (
            <Pressable
              onPress={onVoiceRecord}
              style={[
                styles.recordButton,
                isRecording && styles.recordButtonActive,
              ]}
            >
              <Ionicons 
                name="mic" 
                size={20} 
                color={isRecording ? darkTheme.color.destructiveForeground : darkTheme.color.foreground} 
              />
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderTopWidth: 1,
    borderTopColor: darkTheme.color.border,
    backgroundColor: darkTheme.color.card,
  },
  inputContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: 800,
    alignSelf: 'center',
    width: '100%',
  },
  emojiPicker: {
    ...layoutStyles.rowCenter,
    flexWrap: 'wrap',
    gap: 6,
    padding: 8,
    marginBottom: 6,
    backgroundColor: darkTheme.color.secondary,
    ...borderStyles.rounded8,
  },
  emojiButton: {
    padding: 2,
  },
  emoji: {
    fontSize: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  textInputWrapper: {
    flex: 1,
  },
  recordButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  recordButtonActive: {
    backgroundColor: darkTheme.color.destructive,
  },
});

