import { LinkingOptions } from '@react-navigation/native';

export const linking: LinkingOptions<Record<string, unknown>> = {
  prefixes: ['tr20://', 'https://tr20.app'],
  config: {
    screens: {
      '(tabs)': {
        screens: {
          home: 'home',
          programs: {
            screens: {
              index: 'programs',
              'training-plans': {
                path: 'programs/training-plans/:planId',
                screens: {
                  workouts: {
                    path: 'workouts/:workoutId',
                    screens: {
                      index: '',
                      exercises: 'exercises/:exerciseId',
                    },
                  },
                },
              },
              'nutrition-plans': {
                path: 'programs/nutrition-plans/:planId',
                screens: {
                  meals: 'meals/:mealId',
                },
              },
            },
          },
          progress: 'progress',
          chat: 'chat',
          profile: 'profile',
        },
      },
      questionnaires: {
        screens: {
          index: 'questionnaires',
          active: 'questionnaires/active',
          completed: 'questionnaires/completed',
        },
      },
    },
  },
};

