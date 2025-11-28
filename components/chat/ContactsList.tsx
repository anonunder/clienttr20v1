import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Pressable, 
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { darkTheme } from '@/styles/theme';
import { textStyles, layoutStyles, spacingStyles, borderStyles } from '@/styles/shared-styles';
import { Contact, Group } from './types';

type TabType = 'trainers' | 'groups';

interface ContactsListProps {
  contacts: Contact[];
  groups?: Group[];
  selectedContact: Contact | null;
  selectedGroup?: Group | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onContactSelect: (contact: Contact) => void;
  onGroupSelect?: (group: Group) => void;
}

export function ContactsList({
  contacts,
  groups = [],
  selectedContact,
  selectedGroup,
  searchQuery,
  onSearchChange,
  onContactSelect,
  onGroupSelect,
}: ContactsListProps) {
  const [activeTab, setActiveTab] = useState<TabType>('trainers');

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={16} color={darkTheme.color.mutedForeground} style={styles.searchIcon} />
          <TextInput
            placeholder="Search contacts..."
            placeholderTextColor={darkTheme.color.mutedForeground}
            value={searchQuery}
            onChangeText={onSearchChange}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <Pressable
          style={[styles.tab, activeTab === 'trainers' && styles.tabActive]}
          onPress={() => setActiveTab('trainers')}
        >
          <Text style={[styles.tabText, activeTab === 'trainers' && styles.tabTextActive]}>
            Trainers
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'groups' && styles.tabActive]}
          onPress={() => setActiveTab('groups')}
        >
          <Text style={[styles.tabText, activeTab === 'groups' && styles.tabTextActive]}>
            Groups
          </Text>
        </Pressable>
      </View>

      {/* Contacts/Groups List */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contactsContainer}>
          {activeTab === 'trainers' ? (
            // Trainers List
            filteredContacts.map((contact) => (
              <Pressable
                key={contact.id}
                onPress={() => onContactSelect(contact)}
                style={[
                  styles.contactItem,
                  selectedContact?.id === contact.id && styles.contactItemSelected,
                ]}
              >
                <View style={styles.contactContent}>
                  <View style={styles.avatarWrapper}>
                    <Avatar
                      source={contact.avatar}
                      fallback={contact.name}
                      size="sm"
                    />
                    {contact.online && <View style={styles.onlineIndicator} />}
                  </View>
                  <View style={styles.contactInfo}>
                    <View style={styles.contactHeader}>
                      <Text style={styles.contactName} numberOfLines={1}>
                        {contact.name}
                      </Text>
                      {contact.unread && contact.unread > 0 && (
                        <View style={styles.unreadBadge}>
                          <Text style={styles.unreadText}>{contact.unread}</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.contactRole} numberOfLines={1}>
                      {contact.role}
                    </Text>
                    {contact.lastMessage && (
                      <Text style={styles.lastMessage} numberOfLines={1}>
                        {contact.lastMessage}
                      </Text>
                    )}
                  </View>
                </View>
              </Pressable>
            ))
          ) : (
            // Groups List
            filteredGroups.length > 0 ? (
              filteredGroups.map((group) => (
                <Pressable
                  key={group.id}
                  onPress={() => onGroupSelect?.(group)}
                  style={[
                    styles.contactItem,
                    selectedGroup?.id === group.id && styles.contactItemSelected,
                  ]}
                >
                  <View style={styles.contactContent}>
                    <View style={styles.groupAvatarWrapper}>
                      <Ionicons name="people" size={20} color={darkTheme.color.primary} />
                    </View>
                    <View style={styles.contactInfo}>
                      <View style={styles.contactHeader}>
                        <Text style={styles.contactName} numberOfLines={1}>
                          {group.name}
                        </Text>
                        {group.unread && group.unread > 0 && (
                          <View style={styles.unreadBadge}>
                            <Text style={styles.unreadText}>{group.unread}</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.contactRole} numberOfLines={1}>
                        {group.memberCount} members
                      </Text>
                      {group.lastMessage && (
                        <Text style={styles.lastMessage} numberOfLines={1}>
                          {group.lastMessage}
                        </Text>
                      )}
                    </View>
                  </View>
                </Pressable>
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="people-outline" size={32} color={darkTheme.color.mutedForeground} />
                <Text style={styles.emptyText}>No groups yet</Text>
              </View>
            )
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.color.card,
  },
  searchContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.color.border,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: darkTheme.color.bg,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: darkTheme.color.border,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    height: 34,
    fontSize: 13,
    color: darkTheme.color.foreground,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.color.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: darkTheme.color.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: darkTheme.color.mutedForeground,
  },
  tabTextActive: {
    color: darkTheme.color.primary,
  },
  scrollView: {
    flex: 1,
  },
  contactsContainer: {
    padding: 6,
    gap: 2,
  },
  contactItem: {
    padding: 10,
    borderRadius: 6,
  },
  contactItemSelected: {
    backgroundColor: darkTheme.color.secondary,
  },
  contactContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatarWrapper: {
    position: 'relative',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: darkTheme.color.success,
    borderWidth: 2,
    borderColor: darkTheme.color.card,
  },
  groupAvatarWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${darkTheme.color.primary}1A`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
    minWidth: 0,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  contactName: {
    fontSize: 14,
    fontWeight: '500',
    color: darkTheme.color.foreground,
    flex: 1,
  },
  contactRole: {
    fontSize: 12,
    color: darkTheme.color.mutedForeground,
  },
  lastMessage: {
    fontSize: 11,
    color: darkTheme.color.mutedForeground,
    marginTop: 1,
  },
  unreadBadge: {
    backgroundColor: darkTheme.color.primary,
    borderRadius: 8,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  unreadText: {
    fontSize: 10,
    fontWeight: '600',
    color: darkTheme.color.primaryForeground,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    gap: 6,
  },
  emptyText: {
    fontSize: 12,
    color: darkTheme.color.mutedForeground,
  },
});

