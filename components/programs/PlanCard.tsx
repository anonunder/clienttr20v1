import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { Card } from '@/components/ui/Card';
import { darkTheme } from '@/styles/theme';
import { spacingStyles, layoutStyles, textStyles } from '@/styles/shared-styles';
import { Ionicons } from '@expo/vector-icons';

interface PlanCardInfo {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}

interface PlanCardProps {
  onPress: () => void;
  image: string;
  name: string;
  info: PlanCardInfo[];
}

export function PlanCard({ onPress, image, name, info }: PlanCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.pressable}>
      <Card>
        <View style={styles.container}>
          {/* Image */}
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: image }} 
              style={styles.image}
              resizeMode="cover"
            />
          </View>

          {/* Content */}
          <View style={styles.content}>
            <Text style={styles.name}>{name}</Text>
            <View style={styles.infoContainer}>
              {info.map((item, index) => (
                <React.Fragment key={index}>
                  {index > 0 && (
                    <Text style={styles.separator}>•</Text>
                  )}
                  <View style={layoutStyles.rowCenterGap8}>
                    <Ionicons 
                      name={item.icon} 
                      size={16} 
                      color={darkTheme.color.mutedForeground} 
                    />
                    <Text style={styles.infoText}>{item.text}</Text>
                  </View>
                </React.Fragment>
              ))}
            </View>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: '100%',
  },
  container: {
    flexDirection: 'row',
    gap: 16,
    overflow: 'hidden',
  },
  imageContainer: {
    width: 128, // w-32
    height: 128, // h-32
    flexShrink: 0,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 16,
    gap: 8,
    justifyContent: 'center',
  },
  name: {
    ...textStyles.h4,
    fontWeight: '600',
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  infoText: {
    ...textStyles.small,
    color: darkTheme.color.mutedForeground,
  },
  separator: {
    ...textStyles.small,
    color: darkTheme.color.mutedForeground,
    marginRight: 8,
  },
});

