import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

export default function ProgressScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <ScrollView className="flex-1 px-4 py-3">
        <Text className="text-text text-2xl font-bold mb-4">{t('progress.title')}</Text>

        <View className="gap-4">
          <View className="bg-card rounded-xl p-4 border border-border">
            <Text className="text-textMuted text-sm mb-1">{t('progress.streak')}</Text>
            <Text className="text-text text-3xl font-bold">7 days</Text>
          </View>

          <View className="bg-card rounded-xl p-4 border border-border">
            <Text className="text-textMuted text-sm mb-1">{t('progress.workouts')}</Text>
            <Text className="text-text text-3xl font-bold">24</Text>
          </View>

          <View className="bg-card rounded-xl p-4 border border-border">
            <Text className="text-text text-lg font-semibold mb-3">{t('progress.weekly')}</Text>
            <View className="flex-row justify-between">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                <View
                  key={index}
                  className={`w-10 h-10 rounded-full items-center justify-center ${
                    index < 4 ? 'bg-primary' : 'bg-bgMuted'
                  }`}
                >
                  <Text className={index < 4 ? 'text-white font-semibold' : 'text-textMuted'}>
                    {day}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

