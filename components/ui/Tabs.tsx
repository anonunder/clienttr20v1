import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { darkTheme } from '@/styles/theme';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | null>(null);

interface TabsProps {
  defaultValue: string;
  children: React.ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
}

export function Tabs({ defaultValue, children, value, onValueChange }: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  
  const activeTab = value !== undefined ? value : internalValue;
  const setActiveTab = onValueChange || setInternalValue;

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <View style={styles.tabsContainer}>
        {children}
      </View>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: React.ReactNode;
  style?: any;
}

export function TabsList({ children, style }: TabsListProps) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.tabsList, style]}
    >
      {children}
    </ScrollView>
  );
}

interface TabsTriggerProps {
  value: string;
  children: React.ReactNode;
}

export function TabsTrigger({ value, children }: TabsTriggerProps) {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('TabsTrigger must be used within Tabs');
  }

  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;

  return (
    <Pressable
      onPress={() => setActiveTab(value)}
      style={[
        styles.tabsTrigger,
        isActive && styles.tabsTriggerActive,
      ]}
    >
      <Text style={[
        styles.tabsTriggerText,
        isActive && styles.tabsTriggerTextActive,
      ]}>
        {children}
      </Text>
    </Pressable>
  );
}

interface TabsContentProps {
  value: string;
  children: React.ReactNode;
}

export function TabsContent({ value, children }: TabsContentProps) {
  const context = React.useContext(TabsContext);
  if (!context) {
    throw new Error('TabsContent must be used within Tabs');
  }

  const { activeTab } = context;

  if (activeTab !== value) {
    return null;
  }

  return (
    <View style={styles.tabsContent}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    gap: 24,
  },
  tabsList: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: darkTheme.color.muted,
    borderRadius: 6,
    padding: 4,
    gap: 4,
  },
  tabsTrigger: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsTriggerActive: {
    backgroundColor: darkTheme.color.bg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabsTriggerText: {
    fontSize: 14,
    fontWeight: '500',
    color: darkTheme.color.mutedForeground,
  },
  tabsTriggerTextActive: {
    color: darkTheme.color.foreground,
  },
  tabsContent: {
    marginTop: 8,
  },
});

