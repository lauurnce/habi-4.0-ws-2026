import { createNativeStackNavigator } from "@react-navigation/native-stack";

import type { RootStackParamList } from "./types";
import { LoadingScreen } from "../screens/LoadingScreen";
import { LoginScreen } from "../screens/LoginScreen";
import { MainTabs } from "./MainTabs";
import { ArrivalScreen } from "../screens/onboarding/ArrivalScreen";
import { IdentityScreen } from "../screens/onboarding/IdentityScreen";
import { ProfileContextScreen } from "../screens/onboarding/ProfileContextScreen";
import { HealthContextScreen } from "../screens/onboarding/HealthContextScreen";
import { ReadyScreen } from "../screens/onboarding/ReadyScreen";
import { DashboardScreen } from "../screens/DashboardScreen";
import { LOAScreen } from "../screens/LOAScreen";
import { LOAApprovedScreen } from "../screens/LOAApprovedScreen";
import { LOADeniedScreen } from "../screens/LOADeniedScreen";
import { LOASubmittedScreen } from "../screens/LOASubmittedScreen";
import { LOAReviewScreen } from "../screens/LOAReviewScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Loading"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Loading" component={LoadingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />

      {/* Onboarding Flow */}
      <Stack.Screen name="Arrival" component={ArrivalScreen} />
      <Stack.Screen name="Identity" component={IdentityScreen} />
      <Stack.Screen name="ProfileContext" component={ProfileContextScreen} />
      <Stack.Screen name="HealthContext" component={HealthContextScreen} />
      <Stack.Screen name="Ready" component={ReadyScreen} />
      <Stack.Screen name="LOA" component={LOAScreen} />
      
      {/* LOA Results */}
      <Stack.Screen name="LOASubmitted" component={LOASubmittedScreen} />
      <Stack.Screen name="LOAReview" component={LOAReviewScreen} />
      <Stack.Screen name="LOAApproved" component={LOAApprovedScreen} />
      <Stack.Screen name="LOADenied" component={LOADeniedScreen} />
    </Stack.Navigator>
  );
}
