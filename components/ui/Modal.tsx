import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal as RNModal, 
  Pressable, 
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { darkTheme } from '@/styles/theme';
import { spacingStyles, textStyles, borderStyles } from '@/styles/shared-styles';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxHeight?: number | string;
}

export function Modal({ visible, onClose, title, description, children, maxHeight = '90%' }: ModalProps) {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <Pressable style={styles.backdrop} onPress={onClose} />
        
        <View style={[styles.modal, { maxHeight }]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              {title && <Text style={styles.title}>{title}</Text>}
              {description && <Text style={styles.description}>{description}</Text>}
            </View>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={darkTheme.color.foreground} />
            </Pressable>
          </View>

          {/* Content */}
          <ScrollView 
            style={styles.content}
            showsVerticalScrollIndicator={true}
          >
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    backgroundColor: darkTheme.color.card,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 34, // Account for safe area
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    ...spacingStyles.p24,
    ...spacingStyles.pb16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.color.border,
  },
  headerContent: {
    flex: 1,
    gap: 4,
    paddingRight: 16,
  },
  title: {
    ...textStyles.h3,
    color: darkTheme.color.foreground,
  },
  description: {
    ...textStyles.small,
    color: darkTheme.color.mutedForeground,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    ...spacingStyles.p24,
    ...spacingStyles.pt16,
  },
});

