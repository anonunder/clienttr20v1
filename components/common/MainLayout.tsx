import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Header from './Header';
import Navigation from './Navigation';
import { darkTheme } from '@/styles/theme';

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
  hideNavigation?: boolean;
}

export function MainLayout({ children, title, description, hideNavigation = false }: MainLayoutProps) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <Header title={title} description={description} />

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentWrapper}>
          {children}
        </View>
      </ScrollView>

      {/* Footer/Navigation */}
      {!hideNavigation && <Navigation />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.color.bg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 96, // pb-24 (64 nav + 32 padding)
  },
  contentWrapper: {
    paddingHorizontal: 16, // px-4
    paddingTop: 32, // py-8
    paddingBottom: 0,
    gap: 24, // space-y-6
    maxWidth: 1200, // max-w-6xl equivalent
    alignSelf: 'center',
    width: '100%',
  },
});

