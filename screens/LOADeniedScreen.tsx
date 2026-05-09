import React from "react";
import { View, Text, ScrollView, Pressable, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { Card } from "../components/Card";

type Props = NativeStackScreenProps<RootStackParamList, "LOADenied">;

const MOCK_HOTLINES = [
  {
    id: "1",
    title: "HR Support Desk",
    description: "For questions about your benefits or LOA denial reasons.",
    phone: "1-800-HR-SUPPORT",
    icon: "briefcase" as const,
  },
  {
    id: "2",
    title: "Mental Health Support",
    description: "Free and confidential 24/7 counseling for employees.",
    phone: "1-800-WELLNESS",
    icon: "heart" as const,
  },
  {
    id: "3",
    title: "Medical Consultation Line",
    description: "Speak with a nurse for immediate medical advice.",
    phone: "1-800-NURSE-24",
    icon: "medkit" as const,
  },
];

export function LOADeniedScreen({ navigation }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFA]">
      <View className="px-6 py-4 flex-row items-center border-b border-neutral-100 bg-white">
        <Pressable onPress={() => navigation.goBack()} className="p-1 mr-4">
          <Ionicons name="arrow-back" size={24} color="#2D3748" />
        </Pressable>
        <Text className="text-xl font-bold text-neutral-900 font-jakarta-bold">
          LOA Result
        </Text>
      </View>

      <ScrollView className="flex-1" contentContainerClassName="px-6 py-8">
        <View className="items-center mb-10">
          <View className="h-24 w-24 rounded-full bg-red-50 items-center justify-center mb-6">
            <Ionicons name="close-circle" size={56} color="#EF4444" />
          </View>
          <Text className="text-3xl font-bold text-neutral-900 font-jakarta-bold text-center leading-tight">
            Request Not Approved
          </Text>
          <Text className="text-base text-neutral-500 font-jakarta mt-3 text-center px-4">
            "Every setback is a setup for a comeback." We're sorry, but your LOA request could not be approved at this time.
          </Text>
        </View>

        <View className="mb-10">
          <Text className="text-sm font-semibold text-neutral-900 mb-4 px-1 font-jakarta-bold">
            Support & Resources
          </Text>
          
          <View className="gap-4">
            {MOCK_HOTLINES.map((hotline) => (
              <Card key={hotline.id} className="p-5 border-none bg-white shadow-sm flex-row items-center">
                <View className="h-12 w-12 rounded-2xl bg-neutral-50 items-center justify-center mr-4">
                  <Ionicons name={hotline.icon} size={24} color="#6B7280" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold text-neutral-900 font-jakarta-bold mb-1">
                    {hotline.title}
                  </Text>
                  <Text className="text-xs text-neutral-500 font-jakarta leading-relaxed pr-2">
                    {hotline.description}
                  </Text>
                </View>
                <Pressable 
                  className="h-10 w-10 items-center justify-center rounded-full bg-neutral-100"
                  onPress={() => {
                    Linking.openURL(`tel:${hotline.phone}`).catch(() => {
                      alert(`Unable to open dialer. Please call ${hotline.phone}`);
                    });
                  }}
                >
                  <Ionicons name="call" size={18} color="#2D3748" />
                </Pressable>
              </Card>
            ))}
          </View>
        </View>

        <View className="items-center">
          <Pressable
            className="w-full flex-row items-center justify-center rounded-[32px] bg-neutral-900 px-8 py-5 shadow-lg shadow-neutral-900/20"
            onPress={() => navigation.navigate("LOA")}
          >
            <Ionicons name="document-text" size={20} color="white" />
            <Text className="text-lg font-bold text-white ml-2 font-jakarta-bold">
              FILE ANOTHER REQUEST
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
