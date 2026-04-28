import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import { DashboardScreen } from "../screens/DashboardScreen";
import { NotificationsScreen } from "../screens/NotificationsScreen";
import { ScheduleScreen } from "../screens/ScheduleScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { LOATrackerScreen } from "../screens/LOATrackerScreen";

type TabsParamList = {
  Schedule: undefined;
  Tracker: undefined;
  Home: undefined;
  Notifications: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabsParamList>();

export function MainTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#111827",
        tabBarInactiveTintColor: "#6B7280",
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case "Home":
              iconName = "home-outline";
              break;
            case "Notifications":
              iconName = "notifications-outline";
              break;
            case "Tracker":
              iconName = "analytics-outline";
              break;
            case "Schedule":
              iconName = "calendar-outline";
              break;
            default:
              iconName = "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Schedule" component={ScheduleScreen} />
      <Tab.Screen name="Tracker" component={LOATrackerScreen} />
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
