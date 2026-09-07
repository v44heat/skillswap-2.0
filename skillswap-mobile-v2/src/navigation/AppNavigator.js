import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import { useAuth } from '../context/AuthContext';
import { LoadingScreen } from '../components/UI';
import { colors } from '../utils/theme';

// Auth
import LoginScreen    from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Student
import DashboardScreen     from '../screens/student/DashboardScreen';
import MySkillsScreen      from '../screens/student/MySkillsScreen';
import BrowseSkillsScreen  from '../screens/student/BrowseSkillsScreen';
import MyRequestsScreen    from '../screens/student/MyRequestsScreen';
import MySessionsScreen    from '../screens/student/MySessionsScreen';
import NotificationsScreen from '../screens/student/NotificationsScreen';
import ProfileScreen       from '../screens/student/ProfileScreen';

// Admin
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import AdminUsersScreen     from '../screens/admin/AdminUsersScreen';
import {
  AdminSkillsScreen,
  AdminRequestsScreen,
  AdminSessionsScreen,
  ActivityLogsScreen,
} from '../screens/admin/AdminScreens';

const Stack = createNativeStackNavigator();
const Tab   = createBottomTabNavigator();

// ── shared header style ──
const headerOpts = {
  headerStyle:           { backgroundColor: colors.bg2 },
  headerTintColor:       colors.text,
  headerTitleStyle:      { fontWeight: '700', fontSize: 17 },
  headerShadowVisible:   false,
  contentStyle:          { backgroundColor: colors.bg },
};

// ── shared tab bar style ──
const tabBarOpts = {
  tabBarStyle: {
    backgroundColor:   colors.bg2,
    borderTopColor:    colors.border,
    height:            62,
    paddingBottom:     8,
    paddingTop:        4,
  },
  tabBarActiveTintColor:   colors.accent,
  tabBarInactiveTintColor: colors.text3,
  tabBarLabelStyle:        { fontSize: 11, fontWeight: '500' },
};

function TabIcon({ emoji, focused }) {
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.45, marginTop: 2 }}>
      {emoji}
    </Text>
  );
}

// ─────────────────────────────────────────────
// Student bottom tabs
// ─────────────────────────────────────────────
function StudentTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...headerOpts,
        ...tabBarOpts,
        tabBarIcon: ({ focused }) => {
          const icons = {
            Home:        '🏠',
            Browse:      '🔍',
            Requests:    '📬',
            Sessions:    '📅',
            Profile:     '👤',
          };
          return <TabIcon emoji={icons[route.name] || '•'} focused={focused} />;
        },
      })}
    >
      <Tab.Screen name="Home"     component={DashboardScreen}    options={{ title: 'Home'     }} />
      <Tab.Screen name="Browse"   component={BrowseSkillsScreen} options={{ title: 'Browse'   }} />
      <Tab.Screen name="Requests" component={MyRequestsScreen}   options={{ title: 'Requests' }} />
      <Tab.Screen name="Sessions" component={MySessionsScreen}   options={{ title: 'Sessions' }} />
      <Tab.Screen name="Profile"  component={ProfileScreen}      options={{ title: 'Profile'  }} />
    </Tab.Navigator>
  );
}

// ─────────────────────────────────────────────
// Student stack  (tabs + extra screens)
// ─────────────────────────────────────────────
function StudentStack() {
  return (
    <Stack.Navigator screenOptions={headerOpts}>
      <Stack.Screen
        name="StudentTabs"
        component={StudentTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MySkills"
        component={MySkillsScreen}
        options={{ title: 'My Skills' }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: 'Notifications' }}
      />
    </Stack.Navigator>
  );
}

// ─────────────────────────────────────────────
// Admin bottom tabs
// ─────────────────────────────────────────────
function AdminTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        ...headerOpts,
        ...tabBarOpts,
        tabBarIcon: ({ focused }) => {
          const icons = {
            Overview:   '📊',
            Users:      '👥',
            Skills:     '⭐',
            Requests:   '📬',
            Sessions:   '📅',
            Logs:       '📋',
          };
          return <TabIcon emoji={icons[route.name] || '•'} focused={focused} />;
        },
      })}
    >
      <Tab.Screen name="Overview" component={AdminDashboardScreen} options={{ title: 'Overview'  }} />
      <Tab.Screen name="Users"    component={AdminUsersScreen}     options={{ title: 'Users'     }} />
      <Tab.Screen name="Skills"   component={AdminSkillsScreen}    options={{ title: 'Skills'    }} />
      <Tab.Screen name="Requests" component={AdminRequestsScreen}  options={{ title: 'Requests'  }} />
      <Tab.Screen name="Sessions" component={AdminSessionsScreen}  options={{ title: 'Sessions'  }} />
      <Tab.Screen name="Logs"     component={ActivityLogsScreen}   options={{ title: 'Logs'      }} />
    </Tab.Navigator>
  );
}

// ─────────────────────────────────────────────
// Auth stack
// ─────────────────────────────────────────────
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ ...headerOpts, headerShown: false }}>
      <Stack.Screen name="Login"    component={LoginScreen}    />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: true, title: 'Create Account' }}
      />
    </Stack.Navigator>
  );
}

// ─────────────────────────────────────────────
// Navigation theme
// ─────────────────────────────────────────────
const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card:       colors.bg2,
    text:       colors.text,
    border:     colors.border,
    primary:    colors.accent,
  },
};

// ─────────────────────────────────────────────
// Root navigator
// ─────────────────────────────────────────────
export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <NavigationContainer theme={navTheme}>
      {!user
        ? <AuthStack />
        : user.role === 'ADMIN'
          ? <AdminTabs />
          : <StudentStack />
      }
    </NavigationContainer>
  );
}
