import React from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { Card } from "../components/Card";

type Props = NativeStackScreenProps<RootStackParamList, "LOASubmitted">;

export function LOASubmittedScreen({ navigation }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFA]">
      <View className="px-6 py-4 flex-row items-center border-b border-neutral-100 bg-white">
        <Pressable onPress={() => navigation.goBack()} className="p-1 mr-4">
          <Ionicons name="arrow-back" size={24} color="#2D3748" />
        </Pressable>
        <Text className="text-xl font-bold text-neutral-900 font-jakarta-bold">
          Application Status
        </Text>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="px-6 py-8">
        <View className="items-center mb-10 mt-4">
          <View className="h-24 w-24 rounded-full bg-blue-50 items-center justify-center mb-6">
            <Ionicons name="document-text" size={48} color="#3B82F6" />
          </View>
          <Text className="text-3xl font-bold text-neutral-900 font-jakarta-bold text-center leading-tight">
            Request Submitted
          </Text>
          <Text className="text-base text-neutral-500 font-jakarta mt-3 text-center px-4">
            Your Leave of Absence request has been successfully logged into the system and is awaiting review.
          </Text>
        </View>

        <View className="mb-10">
          <Text className="text-sm font-semibold text-neutral-900 mb-4 px-1 font-jakarta-bold">
            What Happens Next?
          </Text>
          
          <Card className="p-5 border-none bg-white shadow-sm mb-4">
            <View className="flex-row items-start mb-4">
              <View className="h-8 w-8 rounded-full bg-neutral-100 items-center justify-center mr-4">
                <Text className="text-sm font-bold text-neutral-600 font-jakarta-bold">1</Text>
              </View>
              <View className="flex-1 pt-1">
                <Text className="text-base font-bold text-neutral-900 font-jakarta-bold mb-1">HR Review</Text>
                <Text className="text-xs text-neutral-500 font-jakarta leading-relaxed">
                  Our Human Resources team will review your application and attached medical context within 1-2 business days.
                </Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <View className="h-8 w-8 rounded-full bg-neutral-100 items-center justify-center mr-4">
                <Text className="text-sm font-bold text-neutral-600 font-jakarta-bold">2</Text>
              </View>
              <View className="flex-1 pt-1">
                <Text className="text-base font-bold text-neutral-900 font-jakarta-bold mb-1">Final Decision</Text>
                <Text className="text-xs text-neutral-500 font-jakarta leading-relaxed">
                  You will receive a notification once a decision has been made. If approved, you'll be provided with next steps.
                </Text>
              </View>
            </View>
          </Card>
        </View>

        <View className="items-center mt-auto pb-6">
          <Pressable
            className="w-full flex-row items-center justify-center rounded-[32px] bg-neutral-900 px-8 py-5 shadow-lg shadow-neutral-900/20"
            onPress={() => navigation.navigate("MainTabs")}
          >
            <Text className="text-lg font-bold text-white font-jakarta-bold">
              RETURN TO DASHBOARD
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
