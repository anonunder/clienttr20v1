import React from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { usePlans } from '../../../../hooks/use-plans';

export default function HomeScreen() {
  const { t } = useTranslation();
  const { data: plans, isLoading, error } = usePlans();

  return (
    <SafeAreaView className="flex-1 bg-bg">
      <ScrollView className="flex-1 px-4 py-3">
        <Text className="text-text text-2xl font-bold mb-4">{t('home.dashboard')}</Text>

        <View className="mb-6">
          <Text className="text-text text-lg font-semibold mb-3">{t('home.todayWorkout')}</Text>

          {isLoading && (
            <View className="bg-card rounded-xl p-4 border border-border">
              <ActivityIndicator size="large" color="#10b981" />
            </View>
          )}

          {error && (
            <View className="bg-card rounded-xl p-4 border border-border">
              <Text className="text-danger">{t('common.error')}</Text>
            </View>
          )}

          {!isLoading && !error && plans && (
            <View className="gap-3">
              {plans.length === 0 ? (
                <View className="bg-card rounded-xl p-4 border border-border">
                  <Text className="text-textMuted">{t('programs.noPlans')}</Text>
                </View>
              ) : (
                plans.slice(0, 3).map(plan => (
                  <View key={plan.id} className="bg-card rounded-xl p-4 border border-border">
                    <Text className="text-text font-semibold text-base mb-1">{plan.name}</Text>
                    {plan.description && (
                      <Text className="text-textMuted text-sm">{plan.description}</Text>
                    )}
                    <Text className="text-primary text-sm mt-2">
                      {plan.weeks} {plan.weeks === 1 ? 'week' : 'weeks'}
                    </Text>
                  </View>
                ))
              )}
            </View>
          )}
        </View>

        <View className="mb-6">
          <Text className="text-text text-lg font-semibold mb-3">{t('home.quickActions')}</Text>
          <View className="flex-row flex-wrap gap-3">
            <View className="bg-primary rounded-xl p-4 flex-1 min-w-[45%]">
              <Text className="text-white font-semibold">Start Workout</Text>
            </View>
            <View className="bg-card rounded-xl p-4 flex-1 min-w-[45%] border border-border">
              <Text className="text-text font-semibold">View Nutrition</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

