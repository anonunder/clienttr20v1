import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { darkTheme } from '@/styles/theme';
import { textStyles, borderStyles } from '@/styles/shared-styles';

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  options: string[];
  disabled?: boolean;
}

/**
 * Select Component
 * 
 * A dropdown select component for React Native that works on all platforms.
 */
export function Select({
  value,
  onValueChange,
  placeholder = 'Select an option',
  options,
  disabled = false,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option: string) => {
    onValueChange(option);
    setIsOpen(false);
  };

  const displayValue = value || placeholder;
  const hasValue = !!value;

  return (
    <>
      <TouchableOpacity
        style={[
          styles.selectButton,
          disabled && styles.selectButtonDisabled,
        ]}
        onPress={() => !disabled && setIsOpen(true)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.selectText,
            !hasValue && styles.placeholderText,
          ]}
          numberOfLines={1}
        >
          {displayValue}
        </Text>
        <Ionicons
          name="chevron-down"
          size={20}
          color={darkTheme.color.mutedForeground}
        />
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{placeholder}</Text>
              <TouchableOpacity
                onPress={() => setIsOpen(false)}
                style={styles.closeButton}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color={darkTheme.color.foreground}
                />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.optionsList}>
              {options.map((option, index) => {
                const isSelected = value === option;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.option,
                      isSelected && styles.optionSelected,
                    ]}
                    onPress={() => handleSelect(option)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.optionTextSelected,
                      ]}
                    >
                      {option}
                    </Text>
                    {isSelected && (
                      <Ionicons
                        name="checkmark"
                        size={20}
                        color={darkTheme.color.primary}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  selectButton: {
    height: 48,
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: darkTheme.color.border,
    backgroundColor: `${darkTheme.color.secondary}80`,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectButtonDisabled: {
    opacity: 0.5,
  },
  selectText: {
    ...textStyles.body,
    color: darkTheme.color.foreground,
    flex: 1,
  },
  placeholderText: {
    color: darkTheme.color.mutedForeground,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    backgroundColor: darkTheme.color.card,
    ...borderStyles.rounded12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.color.border,
  },
  modalTitle: {
    ...textStyles.h4,
    color: darkTheme.color.foreground,
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  optionsList: {
    maxHeight: 400,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.color.border,
  },
  optionSelected: {
    backgroundColor: `${darkTheme.color.primary}1A`, // 10% opacity
  },
  optionText: {
    ...textStyles.body,
    color: darkTheme.color.foreground,
    flex: 1,
  },
  optionTextSelected: {
    color: darkTheme.color.primary,
    fontWeight: '600',
  },
});

