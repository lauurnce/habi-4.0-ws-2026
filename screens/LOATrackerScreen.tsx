import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LOATracker, LOAStatus } from "../components/LOATracker";
import { Card } from "../components/Card";
import { loaState } from "../lib/loaState";
import { useEffect, useState } from "react";



export function LOATrackerScreen({ navigation }: any) {
  const [currentStatus, setCurrentStatus] = useState<LOAStatus>(loaState.getStatus());

  useEffect(() => {
    return loaState.subscribe((status) => setCurrentStatus(status));
  }, []);

  const handleStatusChange = (status: LOAStatus) => {
    loaState.setStatus(status);
  };

  return (
    <SafeAreaView className="flex-1 bg-snow">
      <View className="px-6 py-4 flex-row items-center justify-between border-b border-neutral-100 bg-white">
        <Text className="text-xl font-bold text-neutral-900 font-jakarta-bold">LOA Tracking</Text>
        <Pressable className="p-1">
          <Ionicons name="help-circle-outline" size={24} color="#2D3748" />
        </Pressable>
      </View>
      <ScrollView className="flex-1" contentContainerClassName="px-6 py-8">
        <Card className="bg-white p-6 rounded-[32px] border-none shadow-xl shadow-neutral-100 mb-8">
          <View className="flex-row items-center gap-4 mb-6">
            <View className="h-14 w-14 items-center justify-center rounded-2xl bg-mint/10">
              <Ionicons name="calendar" size={28} color="#4FB99F" />
            </View>
            <View>
              <Text className="text-lg font-bold text-neutral-900 font-jakarta-bold">Medical Leave</Text>
              <Text className="text-sm text-neutral-500 font-jakarta">Requested on Apr 28, 2026</Text>
            </View>
          </View>
          <LOATracker status={currentStatus} />
        </Card>
        <View className="gap-4">
          <Text className="text-sm font-semibold text-neutral-900 px-1 font-jakarta-bold">Actions</Text>
          <Pressable onPress={() => {
            if (currentStatus === "approved") navigation.navigate("LOAApproved");
            else if (currentStatus === "denied") navigation.navigate("LOADenied");
            else if (currentStatus === "submitted") navigation.navigate("LOASubmitted");
            else if (currentStatus === "review") navigation.navigate("LOAReview");
          }}>
            <Card className="p-4 border border-mint bg-mint/5 shadow-sm flex-row items-center">
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-mint/20 mr-4">
                <Ionicons name="document-text" size={20} color="#4FB99F" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-neutral-900 font-jakarta-bold">View Application Details</Text>
                <Text className="text-xs text-neutral-500 font-jakarta">See outcomes and next steps</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#4FB99F" />
            </Card>
          </Pressable>
          <Card className="p-4 border-none bg-white shadow-sm flex-row items-center">
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-neutral-50 mr-4">
              <Ionicons name="chatbubble-ellipses-outline" size={20} color="#2D3748" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-neutral-900 font-jakarta-bold">Message HR</Text>
              <Text className="text-xs text-neutral-500 font-jakarta">Inquire about status</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#A3A3A3" />
          </Card>
          <Card className="p-4 border-none bg-white shadow-sm flex-row items-center">
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-neutral-50 mr-4">
              <Ionicons name="document-attach-outline" size={20} color="#2D3748" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-neutral-900 font-jakarta-bold">View Documents</Text>
              <Text className="text-xs text-neutral-500 font-jakarta">Medical certificate, etc.</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#A3A3A3" />
          </Card>
        </View>
        <View className="mt-12 p-4 bg-neutral-100 rounded-2xl">
          <Text className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">UI Demo Controls</Text>
          <View className="flex-row flex-wrap gap-2">
            {(["submitted", "review", "approved", "denied"] as LOAStatus[]).map((s) => {
              const label = s === "review" ? "In Review" : s.charAt(0).toUpperCase() + s.slice(1);
              return (
                <Pressable key={s} onPress={() => handleStatusChange(s)} className={`px-3 py-2 rounded-xl border ${currentStatus === s ? 'bg-mint border-mint' : 'bg-white border-neutral-200'}`}>
                  <Text className={`text-xs font-bold ${currentStatus === s ? 'text-white' : 'text-neutral-600'}`}>{label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


