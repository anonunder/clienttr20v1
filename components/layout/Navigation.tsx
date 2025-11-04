import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, usePathname, useSegments } from 'expo-router';
import { darkTheme } from '@/styles/theme';

const Navigation = () => {
  const pathname = usePathname();
  const segments = useSegments();
  const windowWidth = Dimensions.get('window').width;
  const isTablet = windowWidth >= 768;

  // Mock pending reports count - in a real app this would come from API/state
  const pendingReportsCount = 2;

  const navItems = [
    { icon: 'home', label: 'Home', path: '/(protected)/(tabs)/home', segment: 'home' },
    { icon: 'barbell', label: 'Programs', path: '/(protected)/(tabs)/programs', segment: 'programs' },
    { icon: 'heart', label: 'Favorites', path: '/(protected)/(tabs)/favorites', segment: 'favorites' },
    { icon: 'chatbubble-ellipses', label: 'Chat', path: '/(protected)/(tabs)/chat', segment: 'chat' },
    { icon: 'bar-chart', label: 'Reports', path: '/(protected)/(tabs)/reports', segment: 'reports', badge: pendingReportsCount },
    { icon: 'resize', label: 'Measurements', path: '/(protected)/(tabs)/progress', segment: 'progress' },
    { icon: 'person', label: 'Profile', path: '/(protected)/(tabs)/profile', segment: 'profile' },
  ];

  const isActive = (path: string, segment: string) => {
    // First check using segments (more reliable in expo-router)
    // Find the last meaningful segment (excluding route groups like (protected), (tabs))
    const lastSegment = segments[segments.length - 1];
    const meaningfulSegments = segments.filter(s => !s.startsWith('(') && !s.endsWith(')'));
    const lastMeaningfulSegment = meaningfulSegments[meaningfulSegments.length - 1];
    
    // Check if current segment matches
    if (lastSegment === segment || lastMeaningfulSegment === segment) return true;
    
    // Fallback to pathname matching
    if (path === '/(protected)/(tabs)/home') {
      return pathname === path || 
             pathname === '/home' || 
             lastSegment === 'home' ||
             lastMeaningfulSegment === 'home';
    }
    
    // Check if pathname starts with the path or the segment
    return pathname?.startsWith(path) || 
           pathname?.startsWith(`/${segment}`) ||
           pathname?.includes(`/${segment}/`) ||
           pathname?.endsWith(`/${segment}`);
  };

  const handlePress = (path: string) => {
    router.push(path as any);
  };

  return (
    <View style={styles.nav}>
      <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        <View style={styles.navContainer}>
          {/* Fixed HOME button on mobile */}
          {!isTablet && (
            <Pressable
              style={[
                styles.homeButton,
                isActive(navItems[0].path, navItems[0].segment) ? styles.homeButtonActive : styles.homeButtonInactive,
              ]}
              onPress={() => handlePress(navItems[0].path)}
            >
              <Ionicons 
                name="home" 
                size={20} 
                color={isActive(navItems[0].path, navItems[0].segment) ? darkTheme.color.primaryForeground : darkTheme.color.foreground} 
              />
              <Text style={[
                styles.homeButtonText,
                isActive(navItems[0].path, navItems[0].segment) && styles.homeButtonTextActive,
              ]}>
                {navItems[0].label}
              </Text>
            </Pressable>
          )}

          {/* Scrollable navigation items */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.scrollView}
            contentContainerStyle={[
              styles.scrollContent,
              isTablet && styles.scrollContentDesktop,
            ]}
          >
            {/* Desktop: Show all items with HOME in the center */}
            {isTablet && (
              <View style={styles.desktopNavWrapper}>
                <View style={styles.desktopNav}>
                  {/* Reorder items to put Home in the middle on desktop: [Programs, Favorites, Measurements, Home, Chat, Reports, Profile] */}
                  {[navItems[1], navItems[2], navItems[5], navItems[0], navItems[3], navItems[4], navItems[6]].map((item) => {
                    const active = isActive(item.path, item.segment);
                    const isHomeItem = item.path === navItems[0].path;
                    return (
                      <Pressable
                        key={item.path}
                        style={[
                          styles.navItem,
                          isHomeItem ? styles.homeNavItem : styles.regularNavItem,
                          // Home ALWAYS has background (different color), other items only when active
                          isHomeItem 
                            ? (active ? styles.homeNavItemActive : styles.homeNavItemInactive)
                            : (active && styles.regularNavItemActive),
                        ]}
                        onPress={() => handlePress(item.path)}
                      >
                        <View style={styles.navIconContainer}>
                          <Ionicons 
                            name={item.icon as any} 
                            size={20} 
                            color={active 
                              ? darkTheme.color.primaryForeground 
                              : (isHomeItem ? darkTheme.color.foreground : darkTheme.color.mutedForeground)
                            } 
                          />
                          {item.badge && item.badge > 0 && (
                            <View style={styles.badge}>
                              <Text style={styles.badgeText}>{item.badge}</Text>
                            </View>
                          )}
                        </View>
                        <Text style={[
                          styles.navItemText,
                          active && styles.navItemTextActive,
                          isHomeItem && !active && styles.homeNavItemTextInactive,
                        ]}>
                          {item.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Mobile: Show all items EXCEPT HOME (since it's fixed) */}
            {!isTablet && (
              <View style={styles.mobileNav}>
                {navItems.slice(1).map((item) => {
                  const active = isActive(item.path, item.segment);
                  return (
                    <Pressable
                      key={item.path}
                      style={[
                        styles.navItem,
                        styles.regularNavItem,
                        active && styles.regularNavItemActive,
                      ]}
                      onPress={() => handlePress(item.path)}
                    >
                      <View style={styles.navIconContainer}>
                        <Ionicons 
                          name={item.icon as any} 
                          size={20} 
                          color={active ? darkTheme.color.primaryForeground : darkTheme.color.mutedForeground} 
                        />
                        {item.badge && item.badge > 0 && (
                          <View style={styles.badge}>
                            <Text style={styles.badgeText}>{item.badge}</Text>
                          </View>
                        )}
                      </View>
                      <Text style={[
                        styles.navItemText,
                        active && styles.navItemTextActive,
                      ]}>
                        {item.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </ScrollView>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  nav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: darkTheme.color.card,
    borderTopWidth: 1,
    borderTopColor: darkTheme.color.border,
    zIndex: 50,
  },
  safeArea: {
    backgroundColor: darkTheme.color.card,
  },
  navContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 64, // h-16
  },
  homeButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 70,
    height: 64,
    borderRightWidth: 1,
    borderRightColor: darkTheme.color.border,
    borderRadius: 2, // rounded-[2px]
  },
  homeButtonActive: {
    backgroundColor: darkTheme.color.primary,
  },
  homeButtonInactive: {
    backgroundColor: `${darkTheme.color.primary}1A`, // 10% opacity bg-primary/10
  },
  homeButtonText: {
    fontSize: 10,
    fontWeight: '500',
    color: darkTheme.color.foreground,
    textAlign: 'center',
  },
  homeButtonTextActive: {
    color: darkTheme.color.primaryForeground,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 64,
  },
  scrollContentDesktop: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  desktopNavWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  desktopNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    maxWidth: 896, // max-w-4xl equivalent
  },
  mobileNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  navItem: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 70,
  },
  homeNavItem: {
    borderRadius: 2, // rounded-[2px] for Home
  },
  regularNavItem: {
    borderRadius: 12, // rounded-xl for others
  },
  homeNavItemActive: {
    backgroundColor: darkTheme.color.primary,
  },
  homeNavItemInactive: {
    backgroundColor: `${darkTheme.color.primary}1A`, // bg-primary/10 - ALWAYS has background
  },
  regularNavItemActive: {
    backgroundColor: darkTheme.color.primary,
  },
  navIconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    height: 20,
    minWidth: 20,
    borderRadius: 10,
    backgroundColor: darkTheme.color.destructive,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: darkTheme.color.destructiveForeground,
  },
  navItemText: {
    fontSize: 10,
    fontWeight: '500',
    color: darkTheme.color.mutedForeground,
    textAlign: 'center',
  },
  navItemTextActive: {
    color: darkTheme.color.primaryForeground,
  },
  homeNavItemTextInactive: {
    color: darkTheme.color.foreground, // Home uses foreground color when inactive, not muted
  },
});

export default Navigation;
