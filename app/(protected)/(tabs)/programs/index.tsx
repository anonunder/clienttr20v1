import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { usePlans } from '../../../../hooks/use-plans';

export default function ProgramsScreen() {
  const { t } = useTranslation();
  const { data: plans, isLoading } = usePlans();

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <ScrollView className="flex-1 px-4 py-3">
        <Text className="text-text text-2xl font-bold mb-4">{t('programs.training')}</Text>

        {isLoading ? (
          <View className="flex-1 items-center justify-center py-8">
            <ActivityIndicator size="large" color="#10b981" />
          </View>
        ) : (
          <View className="gap-3">
            {plans?.map(plan => (
              <View key={plan.id} className="bg-card rounded-xl p-4 border border-border">
                <Text className="text-text font-bold text-lg mb-2">{plan.name}</Text>
                {plan.description && (
                  <Text className="text-textMuted text-sm mb-2">{plan.description}</Text>
                )}
                <Text className="text-primary text-sm">
                  {plan.weeks} weeks • {plan.workouts.length} workouts
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

