import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { darkTheme } from '@/styles/theme';
import { textStyles, layoutStyles, spacingStyles } from '@/styles/shared-styles';
import { Contact } from './types';

interface MinimizedCallFloatProps {
  isVideo: boolean;
  contact: Contact;
  callDuration: string;
  onMaximize: () => void;
  onEnd: () => void;
}

export function MinimizedCallFloat({
  isVideo,
  contact,
  callDuration,
  onMaximize,
  onEnd,
}: MinimizedCallFloatProps) {
  return (
    <Pressable onPress={onMaximize}>
      <Card style={styles.container}>
        <View style={styles.content}>
          <Avatar
            source={contact.avatar}
            fallback={contact.name}
            size="md"
          />

          <View style={styles.info}>
            <View style={styles.nameRow}>
              <Ionicons 
                name={isVideo ? 'videocam' : 'call'} 
                size={14} 
                color={darkTheme.color.foreground} 
              />
              <Text style={styles.name} numberOfLines={1}>
                {contact.name}
              </Text>
            </View>
            <Text style={styles.duration}>{callDuration}</Text>
          </View>

          <View style={styles.actions}>
            <Pressable style={styles.maximizeButton} onPress={onMaximize}>
              <Ionicons name="expand" size={16} color={darkTheme.color.foreground} />
            </Pressable>
            <Pressable style={styles.endButton} onPress={onEnd}>
              <Ionicons name="close" size={16} color={darkTheme.color.destructive} />
            </Pressable>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 96, // Above navigation
    right: 16,
    zIndex: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    ...spacingStyles.p12,
    ...layoutStyles.rowCenterGap12,
  },
  info: {
    minWidth: 100,
    gap: 2,
  },
  nameRow: {
    ...layoutStyles.rowCenterGap4,
  },
  name: {
    ...textStyles.smallMedium,
  },
  duration: {
    ...textStyles.caption,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  actions: {
    ...layoutStyles.rowCenter,
    gap: 4,
  },
  maximizeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  endButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

