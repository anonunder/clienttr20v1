import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '@/components/ui/Avatar';
import { darkTheme } from '@/styles/theme';
import { textStyles, layoutStyles, spacingStyles } from '@/styles/shared-styles';
import { Contact } from './types';

interface ChatHeaderProps {
  selectedContact: Contact;
  isCallActive: boolean;
  isVideoActive: boolean;
  onCallToggle: () => void;
  onVideoToggle: () => void;
  onSimulateCall: () => void;
  onSimulateVideo: () => void;
  isSheetOpen: boolean;
  onSheetOpenChange: (open: boolean) => void;
  contactsListElement: React.ReactNode;
}

export function ChatHeader({
  selectedContact,
  isCallActive,
  isVideoActive,
  onCallToggle,
  onVideoToggle,
  onSimulateCall,
  onSimulateVideo,
  isSheetOpen,
  onSheetOpenChange,
  contactsListElement,
}: ChatHeaderProps) {
  const windowWidth = Dimensions.get('window').width;
  const isMobile = windowWidth < 768;
  const [showMenu, setShowMenu] = useState(false);

  return (
    <View style={styles.header}>
      <View style={styles.leftSection}>
        {/* Mobile Menu Trigger */}
        {isMobile && (
          <Pressable 
            style={styles.menuButton}
            onPress={() => onSheetOpenChange(true)}
          >
            <Ionicons name="menu" size={24} color={darkTheme.color.foreground} />
          </Pressable>
        )}
        
        <Avatar
          source={selectedContact.avatar}
          fallback={selectedContact.name}
          size="sm"
        />
        
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{selectedContact.name}</Text>
          <View style={styles.roleRow}>
            {selectedContact.online && <View style={styles.onlineDot} />}
            <Text style={styles.contactRole}>{selectedContact.role}</Text>
          </View>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.iconButton} onPress={onCallToggle}>
          <Ionicons name="call-outline" size={18} color={darkTheme.color.foreground} />
        </Pressable>
        <Pressable style={styles.iconButton} onPress={onVideoToggle}>
          <Ionicons name="videocam-outline" size={18} color={darkTheme.color.foreground} />
        </Pressable>
        <Pressable 
          style={styles.iconButton} 
          onPress={() => setShowMenu(!showMenu)}
        >
          <Ionicons name="ellipsis-vertical" size={18} color={darkTheme.color.foreground} />
        </Pressable>
      </View>

      {/* Options Menu */}
      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <Pressable 
          style={styles.menuOverlay} 
          onPress={() => setShowMenu(false)}
        >
          <View style={styles.menuContent}>
            <Pressable 
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                onSimulateCall();
              }}
            >
              <Ionicons name="call" size={18} color={darkTheme.color.primary} />
              <Text style={styles.menuItemText}>Simulate Incoming Call</Text>
            </Pressable>
            <Pressable 
              style={styles.menuItem}
              onPress={() => {
                setShowMenu(false);
                onSimulateVideo();
              }}
            >
              <Ionicons name="videocam" size={18} color={darkTheme.color.primary} />
              <Text style={styles.menuItemText}>Simulate Incoming Video</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* Mobile Contacts Sheet */}
      <Modal
        visible={isSheetOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => onSheetOpenChange(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => onSheetOpenChange(false)}
        >
          <Pressable 
            style={styles.sheetContent}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.sheetHandle}>
              <View style={styles.handleBar} />
            </View>
            {contactsListElement}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 52,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: darkTheme.color.card,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.color.border,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuButton: {
    padding: 6,
    marginLeft: -6,
  },
  contactInfo: {
    gap: 1,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '600',
    color: darkTheme.color.foreground,
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: darkTheme.color.success,
  },
  contactRole: {
    fontSize: 12,
    color: darkTheme.color.mutedForeground,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  menuContent: {
    position: 'absolute',
    top: 100,
    right: 16,
    backgroundColor: darkTheme.color.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: darkTheme.color.border,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.color.border,
  },
  menuItemText: {
    ...textStyles.small,
    color: darkTheme.color.foreground,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  sheetContent: {
    backgroundColor: darkTheme.color.card,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
    minHeight: '50%',
  },
  sheetHandle: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: darkTheme.color.border,
  },
});

