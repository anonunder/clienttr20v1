import React, { useEffect, useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions,
  Platform,
} from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { darkTheme } from '@/styles/theme';
import { textStyles, layoutStyles, spacingStyles } from '@/styles/shared-styles';
import { Contact } from './types';

interface CallOverlayProps {
  isActive: boolean;
  isVideo: boolean;
  contact: Contact;
  onEnd: () => void;
  onMinimize: () => void;
}

export function CallOverlay({ 
  isActive, 
  isVideo, 
  contact, 
  onEnd, 
  onMinimize 
}: CallOverlayProps) {
  const [callDuration, setCallDuration] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (!isActive) {
      setCallDuration(0);
      setIsConnected(false);
      return;
    }

    // Request camera permission for video calls
    if (isVideo) {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    }

    // Simulate connection after 2 seconds
    const connectionTimer = setTimeout(() => {
      setIsConnected(true);
    }, 2000);

    return () => {
      clearTimeout(connectionTimer);
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
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isActive) return null;

  const windowWidth = Dimensions.get('window').width;
  const maxWidth = Math.min(600, windowWidth - 32);

  return (
    <View style={styles.overlay}>
      <Card style={[styles.card, { maxWidth }]}>
        <View style={styles.content}>
          {isVideo && hasPermission ? (
            <View style={styles.videoContainer}>
              <CameraView
                ref={cameraRef}
                style={styles.camera}
                facing="front"
              />
              <View style={styles.videoAvatarContainer}>
                <Avatar
                  source={contact.avatar}
                  fallback={contact.name}
                  size="xl"
                  showOnlineStatus
                  isOnline={contact.online}
                />
              </View>
            </View>
          ) : (
            <View style={styles.avatarContainer}>
              <Avatar
                source={contact.avatar}
                fallback={contact.name}
                size="2xl"
                showOnlineStatus
                isOnline={contact.online}
              />
            </View>
          )}

          <View style={styles.infoContainer}>
            <Text style={styles.contactName}>{contact.name}</Text>
            <View style={styles.statusContainer}>
              {isConnected ? (
                <>
                  <Badge variant="success">
                    <Text style={styles.connectedText}>Connected</Text>
                  </Badge>
                  <Text style={styles.duration}>{formatDuration(callDuration)}</Text>
                </>
              ) : (
                <Text style={styles.connectingText}>
                  {isVideo ? 'Connecting video call...' : 'Connecting...'}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.actions}>
            <Button
              variant="outline"
              size="icon"
              onPress={onMinimize}
              icon={<Ionicons name="remove" size={24} color={darkTheme.color.foreground} />}
            />
            <Button
              variant="destructive"
              size="icon"
              onPress={onEnd}
              icon={
                <Ionicons 
                  name={isVideo ? 'videocam-off' : 'call'} 
                  size={24} 
                  color={darkTheme.color.destructiveForeground} 
                />
              }
            />
          </View>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: `${darkTheme.color.bg}F2`, // 95% opacity
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 50,
  },
  card: {
    width: '100%',
    marginHorizontal: 16,
  },
  content: {
    ...spacingStyles.p32,
    alignItems: 'center',
    gap: 24,
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: darkTheme.color.surface,
    position: 'relative',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  videoAvatarContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarContainer: {
    position: 'relative',
  },
  infoContainer: {
    alignItems: 'center',
    gap: 8,
  },
  contactName: {
    ...textStyles.h2,
  },
  statusContainer: {
    alignItems: 'center',
    gap: 8,
  },
  connectedText: {
    fontSize: 12,
    fontWeight: '600',
    color: darkTheme.color.success,
  },
  duration: {
    ...textStyles.h3,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginTop: 4,
  },
  connectingText: {
    ...textStyles.bodyMuted,
  },
  actions: {
    ...layoutStyles.rowCenter,
    gap: 16,
    marginTop: 16,
  },
});

