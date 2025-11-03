import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

export default function QuestionnairesScreen() {
  return (
    <SafeAreaView className="flex-1 bg-bg">
      <ScrollView className="flex-1 px-4 py-3">
        <Text className="text-text text-2xl font-bold mb-4">Questionnaires</Text>

        <View className="gap-3">
          <Link href="/questionnaires/active" asChild>
            <View className="bg-card rounded-xl p-4 border border-border">
              <Text className="text-text font-semibold text-lg">Active Questionnaires</Text>
              <Text className="text-textMuted text-sm mt-1">View and complete active forms</Text>
            </View>
          </Link>

          <Link href="/questionnaires/completed" asChild>
            <View className="bg-card rounded-xl p-4 border border-border">
              <Text className="text-text font-semibold text-lg">Completed Questionnaires</Text>
              <Text className="text-textMuted text-sm mt-1">View your submission history</Text>
            </View>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

