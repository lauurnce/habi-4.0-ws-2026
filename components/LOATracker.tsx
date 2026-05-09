import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card } from "./Card";

export type LOAStatus = "submitted" | "review" | "approved" | "denied";

interface LOATrackerProps {
  status: LOAStatus;
  compact?: boolean;
}

export function LOATracker({ status, compact = false }: LOATrackerProps) {
  const stages: { key: LOAStatus; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { key: "submitted", label: "Submitted", icon: "document-text-outline" },
    { key: "review", label: "In Review", icon: "search-outline" },
    { key: "approved", label: "Approved", icon: "checkmark-circle-outline" },
  ];

  // Adjust if status is denied
  if (status === "denied") {
    stages[2] = { key: "denied", label: "Denied", icon: "close-circle-outline" };
  }

  const currentIndex = stages.findIndex((s) => s.key === status);

  const currentStage = stages.find((s) => s.key === status) || stages[0];

  if (compact) {
    return (
      <Card className="bg-white p-4 rounded-3xl border border-neutral-100 shadow-sm">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-sm font-bold text-neutral-900 font-jakarta-bold">LOA Status</Text>
          <View className={`px-3 py-1 rounded-full ${status === 'approved' ? 'bg-mint/10' : status === 'denied' ? 'bg-red-50' : 'bg-neutral-100'}`}>
            <Text className={`text-[10px] font-bold uppercase tracking-wider ${status === 'approved' ? 'text-mint' : status === 'denied' ? 'text-red-500' : 'text-neutral-500'} font-jakarta-bold`}>
              {currentStage.label}
            </Text>
          </View>
        </View>
        <View className="flex-row items-center px-2">
          {stages.map((stage, index) => {
            const isCompleted = index <= currentIndex;
            const isLast = index === stages.length - 1;
            
            return (
              <View key={stage.key} className={`flex-row items-center ${!isLast ? 'flex-1' : ''}`}>
                <View className="items-center">
                  <View className={`h-8 w-8 rounded-full items-center justify-center ${isCompleted ? 'bg-mint' : 'bg-neutral-100'}`}>
                    <Ionicons name={stage.icon} size={16} color={isCompleted ? 'white' : '#A3A3A3'} />
                  </View>
                </View>
                {!isLast ? <View className={`flex-1 h-0.5 mx-2 ${index < currentIndex ? 'bg-mint' : 'bg-neutral-100'}`} /> : null}
              </View>
            );
          })}
        </View>
      </Card>
    );
  }

  return (
    <View className="gap-6">
      {stages.map((stage, index) => {
        const isCompleted = index <= currentIndex;
        const isCurrent = index === currentIndex;
        const isLast = index === stages.length - 1;

        return (
          <View key={stage.key} className="flex-row items-start">
            <View className="items-center">
              <View className={`h-12 w-12 rounded-full items-center justify-center ${isCompleted ? 'bg-mint' : 'bg-neutral-100'} ${isCurrent ? 'ring-4 ring-mint/20' : ''}`}><Ionicons name={stage.icon} size={24} color={isCompleted ? 'white' : '#A3A3A3'} /></View>{!isLast ? <View className={`w-0.5 h-12 my-2 ${index < currentIndex ? 'bg-mint' : 'bg-neutral-100'}`} /> : null}
            </View>
            <View className="ml-4 pt-1">
              <Text className={`text-base font-bold ${isCompleted ? 'text-neutral-900' : 'text-neutral-400'} font-jakarta-bold`}>
                {stage.label}
              </Text>
              <Text className="text-xs text-neutral-500 font-jakarta mt-1">{index === 0 ? "Request received and logged" : index === 1 ? "HR is currently evaluating your request" : status === 'approved' ? "Your request has been approved" : status === 'denied' ? "Request declined" : "Pending final decision"}</Text>{isCurrent ? (<View className="mt-2 bg-neutral-50 self-start px-3 py-1 rounded-lg border border-neutral-100"><Text className="text-[10px] text-neutral-500 font-jakarta">Current Stage</Text></View>) : null}
            </View>
          </View>
        );
      })}
    </View>
  );
}
