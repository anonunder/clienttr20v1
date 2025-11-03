import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ActiveQuestionnairesScreen() {
  return (
    <SafeAreaView className="flex-1 bg-bg">
      <ScrollView className="flex-1 px-4 py-3">
        <Text className="text-text text-2xl font-bold mb-4">Active Questionnaires</Text>

        <View className="bg-card rounded-xl p-4 border border-border">
          <Text className="text-textMuted">No active questionnaires</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

