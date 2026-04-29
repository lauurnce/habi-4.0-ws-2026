import React from "react";
import { View, Text, ScrollView, Pressable, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import { Card } from "../components/Card";

type Props = NativeStackScreenProps<RootStackParamList, "LOAApproved">;

const MOCK_CLINICS = [
  {
    id: "1",
    name: "HealthFirst Clinic - Makati",
    address: "123 Ayala Ave, Makati City",
    distance: "1.2 km away",
    hmoAccredited: true,
  },
  {
    id: "2",
    name: "St. Luke's Medical Center - BGC",
    address: "32nd St, Taguig",
    distance: "3.5 km away",
    hmoAccredited: true,
  },
  {
    id: "3",
    name: "Medical City Clinic",
    address: "SM Megamall, Mandaluyong",
    distance: "4.8 km away",
    hmoAccredited: false,
  },
  {
    id: "4",
    name: "QualiMed Hospital",
    address: "UP Town Center, Quezon City",
    distance: "8.1 km away",
    hmoAccredited: true,
  },
];

export function LOAApprovedScreen({ navigation }: Props) {
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
          <View className="h-24 w-24 rounded-full bg-mint/10 items-center justify-center mb-6">
            <Ionicons name="checkmark-circle" size={56} color="#4FB99F" />
          </View>
          <Text className="text-3xl font-bold text-neutral-900 font-jakarta-bold text-center leading-tight">
            Your Request is Approved
          </Text>
          <Text className="text-base text-neutral-500 font-jakarta mt-3 text-center px-4">
            You can now proceed with your medical consultation. Below are some recommended clinics nearby.
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-sm font-semibold text-neutral-900 mb-4 px-1 font-jakarta-bold">
            Recommended Clinics (Your HMO)
          </Text>
          
          <View className="gap-4">
            {MOCK_CLINICS.map((clinic) => (
              <Card key={clinic.id} className="p-5 border-none bg-white shadow-sm flex-row items-center">
                <View className="h-12 w-12 rounded-2xl bg-neutral-50 items-center justify-center mr-4">
                  <Ionicons name="medical" size={24} color="#4FB99F" />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center gap-2 mb-1">
                    <Text className="text-base font-bold text-neutral-900 font-jakarta-bold" numberOfLines={1}>
                      {clinic.name}
                    </Text>
                    {clinic.hmoAccredited ? <Ionicons name="shield-checkmark" size={16} color="#4FB99F" /> : null}
                  </View>
                  <Text className="text-xs text-neutral-500 font-jakarta mb-1" numberOfLines={1}>
                    {clinic.address}
                  </Text>
                  <Text className="text-[10px] font-medium text-neutral-400 font-jakarta uppercase tracking-wider">
                    {clinic.distance}
                  </Text>
                </View>
                <Pressable 
                  className="h-10 w-10 items-center justify-center rounded-full bg-mint/10"
                  onPress={() => {
                    Linking.openURL(`https://maps.google.com/?q=${encodeURIComponent(clinic.name + " " + clinic.address)}`).catch(() => {
                      alert("Unable to open map.");
                    });
                  }}
                >
                  <Ionicons name="navigate-outline" size={20} color="#4FB99F" />
                </Pressable>
              </Card>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
