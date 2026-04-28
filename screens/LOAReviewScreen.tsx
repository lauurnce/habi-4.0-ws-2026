import React from "react";
import { View, Text, ScrollView, Pressable, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { Card } from "../components/Card";

type Props = NativeStackScreenProps<RootStackParamList, "LOAReview">;

export function LOAReviewScreen({ navigation }: Props) {
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
          <View className="h-24 w-24 rounded-full bg-orange-50 items-center justify-center mb-6">
            <Ionicons name="search" size={48} color="#F97316" />
          </View>
          <Text className="text-3xl font-bold text-neutral-900 font-jakarta-bold text-center leading-tight">
            Currently In Review
          </Text>
          <Text className="text-base text-neutral-500 font-jakarta mt-3 text-center px-4">
            HR is currently evaluating your request. This process usually takes 1-2 business days.
          </Text>
        </View>

        <View className="mb-10">
          <Text className="text-sm font-semibold text-neutral-900 mb-4 px-1 font-jakarta-bold">
            Need an update?
          </Text>
          
          <Card className="p-5 border-none bg-white shadow-sm flex-row items-center mb-4">
            <View className="h-12 w-12 rounded-2xl bg-neutral-50 items-center justify-center mr-4">
              <Ionicons name="chatbubbles" size={24} color="#6B7280" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-neutral-900 font-jakarta-bold mb-1">
                Contact HR Direct
              </Text>
              <Text className="text-xs text-neutral-500 font-jakarta leading-relaxed pr-2">
                If it has been more than 2 business days, you can follow up via email.
              </Text>
            </View>
            <Pressable 
              className="h-10 w-10 items-center justify-center rounded-full bg-neutral-100"
              onPress={() => {
                Linking.openURL("mailto:hr@company.com?subject=Following up on my LOA request").catch(() => {
                  alert("No email client found. Please contact hr@company.com directly.");
                });
              }}
            >
              <Ionicons name="mail" size={18} color="#2D3748" />
            </Pressable>
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
