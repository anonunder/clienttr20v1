import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal,
  Pressable,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { darkTheme } from '@/styles/theme';
import { textStyles, layoutStyles, spacingStyles } from '@/styles/shared-styles';
import { Contact } from './types';

interface IncomingCallModalProps {
  isVisible: boolean;
  isVideo: boolean;
  contact: Contact;
  onAnswer: () => void;
  onDecline: () => void;
  onHide: () => void;
}

export function IncomingCallModal({
  isVisible,
  isVideo,
  contact,
  onAnswer,
  onDecline,
  onHide,
}: IncomingCallModalProps) {
  const windowWidth = Dimensions.get('window').width;
  const maxWidth = Math.min(400, windowWidth - 32);

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onHide}
    >
      <View style={styles.overlay}>
        <Card style={[styles.card, { maxWidth }]}>
          <Pressable style={styles.closeButton} onPress={onHide}>
            <Ionicons name="close" size={20} color={darkTheme.color.foreground} />
          </Pressable>

          <View style={styles.content}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatarRing}>
                <Avatar
                  source={contact.avatar}
                  fallback={contact.name}
                  size="xl"
                />
              </View>
              <View style={styles.callTypeIndicator}>
                <Ionicons 
                  name={isVideo ? 'videocam' : 'call'} 
                  size={16} 
                  color={darkTheme.color.primaryForeground} 
                />
              </View>
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.contactName}>{contact.name}</Text>
              {contact.role && (
                <Text style={styles.contactRole}>{contact.role}</Text>
              )}
            </View>

            <Text style={styles.callText}>
              Incoming {isVideo ? 'video' : 'audio'} call...
            </Text>

            <View style={styles.actions}>
              <Pressable
                style={styles.declineButton}
                onPress={onDecline}
              >
                <Ionicons name="call" size={24} color={darkTheme.color.destructiveForeground} />
              </Pressable>

              <Pressable
                style={styles.answerButton}
                onPress={onAnswer}
              >
                <Ionicons 
                  name={isVideo ? 'videocam' : 'call'} 
                  size={24} 
                  color={darkTheme.color.foreground} 
                />
              </Pressable>
            </View>
          </View>
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: `${darkTheme.color.bg}CC`, // 80% opacity
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },
  card: {
    width: '100%',
    marginHorizontal: 16,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  content: {
    ...spacingStyles.p32,
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarRing: {
    padding: 4,
    borderRadius: 52,
    borderWidth: 3,
    borderColor: `${darkTheme.color.primary}33`,
  },
  callTypeIndicator: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: darkTheme.color.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    alignItems: 'center',
    gap: 4,
  },
  contactName: {
    ...textStyles.h2,
  },
  contactRole: {
    ...textStyles.smallMuted,
  },
  callText: {
    ...textStyles.body,
    color: darkTheme.color.mutedForeground,
  },
  actions: {
    ...layoutStyles.rowCenter,
    gap: 24,
    marginTop: 16,
  },
  declineButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: darkTheme.color.destructive,
    alignItems: 'center',
    justifyContent: 'center',
  },
  answerButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: darkTheme.color.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

