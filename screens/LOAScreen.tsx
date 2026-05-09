import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Button } from "../components/Button";
import { Card } from "../components/Card";
import type { RootStackParamList } from "../navigation/types";
import { loaState } from "../lib/loaState";

type Props = NativeStackScreenProps<RootStackParamList, "LOA">;

export function LOAScreen({ navigation }: Props) {
  const [step, setStep] = useState<"initial" | "form">("initial");
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleProceed = () => {
    setStep("form");
  };

  const handleSubmit = () => {
    // Update global state and return to dashboard
    loaState.setStatus("submitted");
    alert("LOA Request Submitted");
    navigation.navigate("MainTabs");
  };

  const formatAsDate = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    let formatted = cleaned;
    if (cleaned.length > 2) formatted = cleaned.slice(0, 2) + "/" + cleaned.slice(2);
    if (cleaned.length > 4) formatted = formatted.slice(0, 5) + "/" + cleaned.slice(4, 8);
    return formatted;
  };

  return (
    <SafeAreaView className="flex-1 bg-snow">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1">
          {/* Header */}
          <View className="px-6 py-4 flex-row items-center justify-between border-b border-neutral-100 bg-white">
            <Pressable onPress={() => navigation.goBack()} className="p-1">
              <Ionicons name="arrow-back" size={24} color="#2D3748" />
            </Pressable>
            <Text className="text-lg font-bold text-neutral-900 font-jakarta-bold">
              Leave of Absence
            </Text>
            <View className="w-8" /> {/* Placeholder for balance */}
          </View>

          <ScrollView
            className="flex-1"
            contentContainerClassName="px-6 py-8"
            keyboardShouldPersistTaps="handled"
          >
            {step === "initial" ? (
              <View className="flex-1 items-center justify-center pt-10">
                <View className="h-24 w-24 items-center justify-center rounded-full bg-mint/10 mb-8">
                  <Ionicons name="calendar-outline" size={48} color="#4FB99F" />
                </View>
                
                <Text className="text-3xl font-bold text-neutral-900 text-center font-jakarta-bold leading-tight px-4">
                  Need some time off?
                </Text>
                
                <Text className="text-base text-neutral-500 text-center mt-4 font-jakarta px-6">
                  Submit a Leave of Absence (LOA) request easily through the app.
                </Text>

                <View className="w-full mt-12 gap-4">
                  <Button 
                    title="Yes, I want to submit" 
                    onPress={handleProceed} 
                  />
                  <Pressable 
                    onPress={() => navigation.goBack()}
                    className="h-14 items-center justify-center rounded-2xl bg-neutral-100"
                  >
                    <Text className="text-base font-bold text-neutral-600 font-jakarta-bold">
                      Not right now
                    </Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View className="gap-8">
                <View>
                  <Text className="text-2xl font-bold text-neutral-900 font-jakarta-bold">
                    Request Details
                  </Text>
                  <Text className="text-sm text-neutral-500 mt-1 font-jakarta">
                    Please fill out the form below to proceed.
                  </Text>
                </View>

                <View className="gap-6">
                  {/* Reason Input */}
                  <View className="gap-2">
                    <Text className="text-sm font-semibold text-neutral-700 font-jakarta-bold ml-1">
                      Reason for Leave
                    </Text>
                    <TextInput
                      value={reason}
                      onChangeText={setReason}
                      placeholder="e.g. Medical, Personal, Wellness"
                      className="h-14 rounded-2xl border border-neutral-100 bg-white px-5 text-base text-neutral-900 font-jakarta shadow-sm shadow-neutral-100"
                    />
                  </View>

                  {/* Dates Row */}
                  <View className="flex-row gap-4">
                    <View className="flex-1 gap-2">
                      <Text className="text-sm font-semibold text-neutral-700 font-jakarta-bold ml-1">
                        Start Date
                      </Text>
                      <TextInput
                        value={startDate}
                        onChangeText={(text) => setStartDate(formatAsDate(text))}
                        maxLength={10}
                        keyboardType="number-pad"
                        placeholder="MM/DD/YYYY"
                        className="h-14 rounded-2xl border border-neutral-100 bg-white px-5 text-base text-neutral-900 font-jakarta shadow-sm shadow-neutral-100"
                      />
                    </View>
                    <View className="flex-1 gap-2">
                      <Text className="text-sm font-semibold text-neutral-700 font-jakarta-bold ml-1">
                        End Date
                      </Text>
                      <TextInput
                        value={endDate}
                        onChangeText={(text) => setEndDate(formatAsDate(text))}
                        maxLength={10}
                        keyboardType="number-pad"
                        placeholder="MM/DD/YYYY"
                        className="h-14 rounded-2xl border border-neutral-100 bg-white px-5 text-base text-neutral-900 font-jakarta shadow-sm shadow-neutral-100"
                      />
                    </View>
                  </View>

                  {/* Mock Information Note */}
                  <Card className="bg-amber/5 border border-amber/10 p-5 mt-4">
                    <View className="flex-row items-center gap-3 mb-2">
                      <Ionicons name="information-circle" size={20} color="#F6AD55" />
                      <Text className="text-sm font-bold text-amber font-jakarta-bold">
                        Policy Note
                      </Text>
                    </View>
                    <Text className="text-xs text-neutral-600 font-jakarta leading-relaxed">
                      All LOA requests are subject to approval by your manager and HR. Please ensure you have sufficient leave credits.
                    </Text>
                  </Card>
                </View>

                <View className="mt-8 gap-4">
                  <Button 
                    title="Submit Request" 
                    disabled={!reason || !startDate || !endDate}
                    onPress={handleSubmit} 
                  />
                  <Pressable 
                    onPress={() => setStep("initial")}
                    className="h-14 items-center justify-center rounded-2xl border border-neutral-200"
                  >
                    <Text className="text-base font-bold text-neutral-600 font-jakarta-bold">
                      Back
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
