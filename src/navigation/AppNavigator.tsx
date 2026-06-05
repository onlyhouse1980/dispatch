import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useJobStore } from '../store/useJobStore';
import COLORS from '../theme/colors';

// Import Screens
import JobFeedScreen from '../screens/JobFeedScreen';
import MyJobsScreen from '../screens/MyJobsScreen';
import JobDetailScreen from '../screens/JobDetailScreen';

// Navigation types
export type TabParamList = {
  AvailableJobs: undefined;
  ActiveJobs: undefined;
};

export type RootStackParamList = {
  HomeTabs: undefined;
  JobDetail: { jobId: string };
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const TabNavigator = () => {
  const insets = useSafeAreaInsets();
  const jobs = useJobStore((state) => state.jobs);
  const activeJobCount = jobs.filter(
    (j) => j.status === 'Accepted' || j.status === 'Picked Up'
  ).length;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = 'car-outline';
          if (route.name === 'AvailableJobs') {
            iconName = 'briefcase-outline';
          } else if (route.name === 'ActiveJobs') {
            iconName = 'checkbox-outline';
          }
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.cardBackground,
          borderTopColor: COLORS.border,
          borderTopWidth: 1.5,
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 8,
          height: 64 + Math.max(insets.bottom - 8, 0),
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: COLORS.background,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
          letterSpacing: 0.5,
        },
      })}
    >
      <Tab.Screen
        name="AvailableJobs"
        component={JobFeedScreen}
        options={{
          title: 'Job Feed',
          headerTitle: 'Available Shipments',
        }}
      />
      <Tab.Screen
        name="ActiveJobs"
        component={MyJobsScreen}
        options={{
          title: 'My Jobs',
          headerTitle: 'Active Deliveries',
          tabBarBadge: activeJobCount > 0 ? activeJobCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: COLORS.primary,
            color: COLORS.background,
            fontSize: 10,
            fontWeight: '700',
            minWidth: 18,
            height: 18,
            lineHeight: 18,
          },
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.background,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
        headerShadowVisible: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="HomeTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="JobDetail"
        component={JobDetailScreen}
        options={{
          title: 'Delivery Details',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
