import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { ProgressBar } from "../../components/ProgressBar";
import { Button } from "../../components/Button";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../navigation/types";

type Props = NativeStackScreenProps<RootStackParamList, "HealthContext">;

export function HealthContextScreen({ navigation }: Props) {
  const [consent, setConsent] = useState(false);
  const [agreed, setAgreed] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-snow">
      <View className="px-8 pt-4">
        <ProgressBar currentStep={3} totalSteps={4} />
      </View>
      
      <ScrollView className="flex-1" contentContainerClassName="px-8 py-12">
        <View className="gap-10">
          <View className="gap-2">
            <Text className="text-2xl font-bold text-charcoal font-jakarta-bold">
              Health Consent
            </Text>
            <Text className="text-base text-neutral-500 font-jakarta">
              Your data is protected under the PH Data Privacy Act of 2012.
            </Text>
          </View>

          <View className="rounded-3xl bg-mint/5 p-6 border border-mint/10 gap-6">
            <TouchableOpacity 
              className="flex-row items-start gap-4"
              onPress={() => setConsent(!consent)}
              activeOpacity={0.7}
            >
              <View className={`w-6 h-6 mt-1 rounded border items-center justify-center ${consent ? 'bg-mint border-mint' : 'border-neutral-300 bg-white'}`}>
                {consent && <Feather name="check" size={16} color="white" />}
              </View>
              <View className="flex-1">
                <Text className="text-base font-bold text-charcoal font-jakarta-bold">
                  Consent to document
                </Text>
                <Text className="text-xs text-neutral-500 font-jakarta mt-2 leading-relaxed">
                  I allow the documentation of my mental health status to provide better care. I understand that my data will be strictly confidential and protected under the Philippine Data Privacy Act of 2012 (Republic Act No. 10173).
                </Text>
              </View>
            </TouchableOpacity>

            <View className="h-px bg-mint/10" />

            <TouchableOpacity 
              className="flex-row items-center gap-4" 
              onPress={() => setAgreed(!agreed)}
              activeOpacity={0.7}
            >
              <View className={`w-6 h-6 rounded border items-center justify-center ${agreed ? 'bg-mint border-mint' : 'border-neutral-300 bg-white'}`}>
                {agreed && <Feather name="check" size={16} color="white" />}
              </View>
              <Text className="text-sm font-semibold text-charcoal font-jakarta flex-1">
                I agree to proceed with this context
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View className="px-8 pb-10">
        <Button 
          title="Continue" 
          disabled={!consent || !agreed}
          onPress={() => navigation.navigate("Ready")} 
        />
      </View>
    </SafeAreaView>
  );
}
