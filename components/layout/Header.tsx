import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { darkTheme } from '@/styles/theme';

interface HeaderProps {
  title: string;
  description?: string;
}

interface Company {
  id: string;
  name: string;
  members: number;
}

const Header = ({ title, description }: HeaderProps) => {
  const [selectedCompany, setSelectedCompany] = useState<string>('1');
  const [showDropdown, setShowDropdown] = useState(false);
  const windowWidth = Dimensions.get('window').width;
  const isTablet = windowWidth >= 768;

  const companies: Company[] = [
    { id: "1", name: "FitLife Studios", members: 250 },
    { id: "2", name: "PowerGym Elite", members: 180 },
    { id: "3", name: "Wellness Center Pro", members: 320 },
    { id: "4", name: "Iron Paradise", members: 150 },
    { id: "5", name: "Flex & Flow", members: 200 },
  ];

  const selectedCompanyData = companies.find(c => c.id === selectedCompany);

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.container}>
          {/* Left Section - Logo & Title */}
          <View style={styles.leftSection}>
            <Image
              source={require('@/assets/images/fitness-logo.png')}
              style={styles.logo}
              contentFit="contain"
            />
            {isTablet && (
              <Text style={styles.desktopTitle}>{title}</Text>
            )}
          </View>

          {/* Center Title - Mobile Only */}
          {!isTablet && (
            <View style={styles.mobileTitleContainer}>
              <Text style={styles.mobileTitle}>{title}</Text>
            </View>
          )}

          {/* Right Section - Company Selector */}
          <View style={styles.rightSection}>
            <Pressable
              style={styles.selectTrigger}
              onPress={() => setShowDropdown(true)}
            >
              <Text style={styles.selectValue} numberOfLines={1}>
                {selectedCompanyData?.name || 'Select company'}
              </Text>
              <Ionicons name="chevron-down" size={16} color={darkTheme.color.mutedForeground} />
            </Pressable>
          </View>
        </View>

        {/* Dropdown Modal */}
        <Modal
          visible={showDropdown}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDropdown(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setShowDropdown(false)}
          >
            <View style={styles.dropdownContent}>
              <ScrollView style={styles.dropdownScroll}>
                {companies.map((company) => (
                  <Pressable
                    key={company.id}
                    style={[
                      styles.dropdownItem,
                      selectedCompany === company.id && styles.dropdownItemSelected,
                    ]}
                    onPress={() => {
                      setSelectedCompany(company.id);
                      setShowDropdown(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownItemText,
                        selectedCompany === company.id && styles.dropdownItemTextSelected,
                      ]}
                    >
                      {company.name}
                    </Text>
                    {selectedCompany === company.id && (
                      <Ionicons name="checkmark" size={16} color={darkTheme.color.primary} />
                    )}
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          </Pressable>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: `${darkTheme.color.bg}F5`, // 95% opacity
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.color.border,
  },
  header: {
    backgroundColor: `${darkTheme.color.bg}F5`, // 95% opacity
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.color.border,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 80,
    paddingHorizontal: 16,
    position: 'relative',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  logo: {
    width: 32,
    height: 32,
  },
  desktopTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: darkTheme.color.foreground,
  },
  mobileTitleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: darkTheme.color.foreground,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    justifyContent: 'flex-end',
  },
  selectTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 40,
    minWidth: 200,
    maxWidth: 240,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: darkTheme.color.input,
    backgroundColor: darkTheme.color.card,
    gap: 8,
  },
  selectValue: {
    flex: 1,
    fontSize: 14,
    color: darkTheme.color.foreground,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContent: {
    backgroundColor: darkTheme.color.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: darkTheme.color.border,
    minWidth: 240,
    maxHeight: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  dropdownScroll: {
    maxHeight: 300,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.color.border,
  },
  dropdownItemSelected: {
    backgroundColor: `${darkTheme.color.accent}1A`, // 10% opacity
  },
  dropdownItemText: {
    fontSize: 14,
    color: darkTheme.color.foreground,
    fontWeight: '500',
  },
  dropdownItemTextSelected: {
    color: darkTheme.color.primary,
    fontWeight: '600',
  },
});

export default Header;

