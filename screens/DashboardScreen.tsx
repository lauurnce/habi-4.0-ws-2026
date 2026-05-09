import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";


import { Card } from "../components/Card";
import { ProgressBar } from "../components/ProgressBar";
import { LOATracker, LOAStatus } from "../components/LOATracker";
import { loaState } from "../lib/loaState";
import { supabase } from "../lib/supabase";


function StatCard({
  label,
  value,
  helper,
  icon,
}: {
  label: string;
  value: string;
  helper: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <Card className="flex-1 p-5 border-none bg-white shadow-sm">
      <View className="flex-row items-center justify-between">
        <View className="h-10 w-10 items-center justify-center rounded-2xl bg-neutral-50">
          <Ionicons name={icon} size={20} color="#4FB99F" />
        </View>
      </View>
      <View className="mt-4">
        <Text className="text-3xl font-bold text-neutral-900 font-jakarta-bold">{value}</Text>
        <Text className="text-xs font-medium text-neutral-500 mt-1 font-jakarta">{label}</Text>
        <Text className="mt-2 text-[10px] text-neutral-400 italic font-jakarta">{helper}</Text>
      </View>
    </Card>
  );
}

const ASSESSMENT_OPTIONS = [
  { value: 0, label: "Not at all" },
  { value: 1, label: "Several days" },
  { value: 2, label: "More than half the days" },
  { value: 3, label: "Nearly every day" },
];
const ASSESSMENT_QUESTIONS = [
  "Little interest or pleasure in doing things.",
  "Feeling down, depressed, or hopeless.",
  "Trouble falling or staying asleep, or sleeping too much.",
  "Feeling tired or having little energy.",
  "Poor appetite or overeating.",
  "Feeling bad about yourself-or that you are a failure or have let yourself or your family down.",
  "Trouble concentrating on things, such as reading the newspaper or watching television.",
  "Moving or speaking so slowly that other people could have noticed. Or the opposite-being so fidgety or restless that you have been moving around a lot more than usual.",
  "Thoughts that you would be better off dead, or of hurting yourself in some way.",
  "Feeling nervous, anxious or on edge.",
  "Not being able to stop or control worrying.",
  "Worrying too much about different things.",
  "Trouble relaxing.",
  "Being so restless that it is hard to sit still.",
  "Becoming easily annoyed or irritable.",
  "Feeling afraid as if something awful might happen.",
] as const;

function QuickAction({
  title,
  subtitle,
  icon,
  onPress,
}: {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress}>
      <Card className="flex-row items-center p-4 border-none bg-white shadow-sm">
        <View className="h-12 w-12 items-center justify-center rounded-2xl bg-neutral-50 mr-4">
          <Ionicons name={icon} size={24} color="#2D3748" />
        </View>
        <View className="flex-1 gap-1">
          <Text className="text-base font-semibold text-neutral-900 font-jakarta-bold">
            {title}
          </Text>
          <Text className="text-xs text-neutral-500 font-jakarta">{subtitle}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#A3A3A3" />
      </Card>
    </Pressable>
  );
}

export function DashboardScreen({ navigation }: any) {
  const [userName, setUserName] = useState<string>("there");
  const [isTriageModalVisible, setIsTriageModalVisible] = useState(false);
  const [triageStep, setTriageStep] = useState(0);
  const [assessmentAnswers, setAssessmentAnswers] = useState<Array<number | null>>(
    Array.from({ length: ASSESSMENT_QUESTIONS.length }, () => null)
  );
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isSubmittingTriage, setIsSubmittingTriage] = useState(false);
  const [loaStatus, setLoaStatus] = useState<LOAStatus>(loaState.getStatus());

  useEffect(() => {
    return loaState.subscribe((status) => setLoaStatus(status));
  }, []);

  useEffect(() => {
    async function fetchProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("nickname, first_name")
          .eq("id", user.id)
          .maybeSingle();
        
        if (profile) {
          setUserName(profile.nickname || profile.first_name || "there");
        }
      }
    }
    fetchProfile();
  }, []);

  const handleCancelTriage = () => {
    if (isSubmittingTriage) {
      return;
    }
    setIsTriageModalVisible(false);
    setTriageStep(0);
    setAssessmentAnswers(
      Array.from({ length: ASSESSMENT_QUESTIONS.length }, () => null)
    );
    setAdditionalNotes("");
  };

  const handleSelectAnswer = (questionIndex: number, value: number) => {
    setAssessmentAnswers((currentAnswers) => {
      const nextAnswers = [...currentAnswers];
      nextAnswers[questionIndex] = value;
      return nextAnswers;
    });
    
    setTimeout(() => {
      if (triageStep < ASSESSMENT_QUESTIONS.length) {
        setTriageStep(prev => prev + 1);
      }
    }, 300);
  };

  const handleSubmitTriage = async () => {
    const hasUnansweredQuestion = assessmentAnswers.some(
      (answer) => answer === null
    );

    if (hasUnansweredQuestion) {
      Alert.alert(
        "Assessment incomplete",
        "Please answer all 16 assessment questions before submitting."
      );
      return;
    }

    const completeAnswers = assessmentAnswers as number[];
    const phq9Score = completeAnswers.slice(0, 9).reduce((sum, value) => sum + value, 0);
    const gad7Score = completeAnswers
      .slice(9)
      .reduce((sum, value) => sum + value, 0);
    const notes = additionalNotes.trim();

    setIsSubmittingTriage(true);

    try {
      const triageData = {
        timestamp: new Date().toISOString(),
        scores: {
          phq9: phq9Score,
          gad7: gad7Score,
        },
        answers: assessmentAnswers,
        notes: notes,
      };

      console.log("Saving Triage Data to JSON:", JSON.stringify(triageData, null, 2));
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsTriageModalVisible(false);
      setTriageStep(0);
      setAssessmentAnswers(
        Array.from({ length: ASSESSMENT_QUESTIONS.length }, () => null)
      );
      setAdditionalNotes("");
      navigation.navigate("LOA");
    } catch (error) {
      console.error("Triage submission error:", error);
      Alert.alert("Error", "Failed to process assessment. Please try again.");
    } finally {
      setIsSubmittingTriage(false);
    }
  };

  const isAtNotesStep = triageStep === ASSESSMENT_QUESTIONS.length;
  const totalTriageSteps = ASSESSMENT_QUESTIONS.length + 1;

  return (
    <View className="flex-1">
      <ScrollView className="flex-1 bg-[#F8FAFA]" contentContainerClassName="px-6 pb-12 pt-12">
        <View className="mb-8">
          <Text className="text-base font-medium text-neutral-500 font-jakarta">Welcome back,</Text>
          <Text className="text-4xl font-bold text-neutral-900 font-jakarta-bold mt-1">Hello, {userName}</Text>
        </View>
        <View className="mb-10">
          <Card className="bg-white p-8 rounded-[40px] border-none shadow-xl shadow-mint/10 items-center justify-center min-h-[260px]">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-mint/10 mb-6">
              <Ionicons name="sparkles" size={32} color="#4FB99F" />
            </View>
            <Text className="text-neutral-500 text-sm font-medium uppercase tracking-[2px] mb-3 font-jakarta text-center">Kind Words for You</Text>
            <Text className="text-2xl font-bold text-neutral-900 text-center leading-tight font-jakarta-bold">{"Mahalaga ang iyong kapayapaan. Take a deep breath; you're doing great."}</Text>
          </Card>
        </View>
        <View className="mb-10">
          <Text className="text-sm font-semibold text-neutral-900 mb-4 px-1 font-jakarta-bold">LOA Tracker</Text>
          <LOATracker status={loaStatus} compact />
        </View>
        <View className="items-center mb-10">
          {loaStatus === "submitted" || loaStatus === "review" ? (
            <View className="w-full flex-row items-center justify-center rounded-[32px] bg-neutral-200 px-8 py-5">
              <Ionicons name="lock-closed" size={24} color="#A3A3A3" />
              <Text className="text-lg font-bold text-neutral-500 ml-2 font-jakarta-bold">TRIAGE LOG ACTIVE</Text>
            </View>
          ) : (
            <Pressable className="w-full flex-row items-center justify-center rounded-[32px] bg-mint px-8 py-5 shadow-lg shadow-mint/30" onPress={() => setIsTriageModalVisible(true)}>
              <Ionicons name="add-circle" size={24} color="white" />
              <Text className="text-lg font-bold text-white ml-2 font-jakarta-bold">START TRIAGE LOG</Text>
            </Pressable>
          )}
        </View>
        <View className="gap-4">
          <Text className="text-sm font-semibold text-neutral-900 px-1 font-jakarta-bold">Quick Actions</Text>
          <QuickAction title="Request Leave" subtitle="Apply for a Leave of Absence" icon="calendar-outline" onPress={() => navigation.navigate("LOA")} />
          <QuickAction title="Review week" subtitle="See what you shipped" icon="stats-chart-outline" />
          <QuickAction title="Set a goal" subtitle="Pick one thing to improve" icon="ribbon-outline" />
        </View>
      </ScrollView>
      <Modal visible={isTriageModalVisible} animationType="slide" transparent={false} onRequestClose={handleCancelTriage}>
        <View className="flex-1 bg-neutral-50">
          <View className="border-b border-neutral-200 bg-white px-5 pb-4 pt-12">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                {triageStep > 0 ? (
                  <Pressable onPress={() => setTriageStep(prev => prev - 1)} className="p-1">
                    <Ionicons name="arrow-back" size={24} color="#2D3748" />
                  </Pressable>
                ) : null}
                <Text className="text-xl font-bold text-neutral-900 font-jakarta-bold">{isAtNotesStep ? "Final Notes" : "Triage Log"}</Text>
              </View>
              <Pressable onPress={handleCancelTriage} className="p-1">
                <Ionicons name="close" size={28} color="#2D3748" />
              </Pressable>
            </View>
            <View className="mt-6">
              <ProgressBar currentStep={triageStep + 1} totalSteps={totalTriageSteps} />
              <View className="flex-row justify-between mt-2">
                <Text className="text-[10px] font-bold text-mint uppercase tracking-wider font-jakarta-bold">Step {triageStep + 1} of {totalTriageSteps}</Text>
                <Text className="text-[10px] font-medium text-neutral-400 font-jakarta">{Math.round(((triageStep + 1) / totalTriageSteps) * 100)}% Complete</Text>
              </View>
            </View>
          </View>
          <ScrollView className="flex-1" contentContainerClassName="px-5 py-8">
            {!isAtNotesStep ? (
              <View className="gap-6">
                <View>
                  <Text className="text-sm font-medium text-neutral-500 mb-2 font-jakarta uppercase tracking-widest text-left">Question {triageStep + 1}</Text>
                  <Text className="text-2xl font-bold text-neutral-900 font-jakarta-bold leading-tight text-left">{ASSESSMENT_QUESTIONS[triageStep]}</Text>
                </View>
                <View className="gap-3 mt-4">
                  {ASSESSMENT_OPTIONS.map((option) => {
                    const isSelected = assessmentAnswers[triageStep] === option.value;
                    return (
                      <Pressable key={option.value} className={`rounded-3xl border p-5 flex-row items-center justify-between ${isSelected ? "border-mint bg-mint/5" : "border-neutral-100 bg-white"}`} onPress={() => handleSelectAnswer(triageStep, option.value)} disabled={isSubmittingTriage}>
                        <View className="flex-1 pr-4">
                          <Text className={`text-base font-semibold ${isSelected ? "text-mint" : "text-neutral-700"} font-jakarta`}>{option.label}</Text>
                        </View>
                        <View className={`h-6 w-6 rounded-full border-2 items-center justify-center ${isSelected ? "border-mint bg-mint" : "border-neutral-200"}`}>
                          {isSelected ? <Ionicons name="checkmark" size={14} color="white" /> : null}
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
                <Text className="mt-8 text-center text-xs text-neutral-400 font-jakarta italic">Tap an option to automatically advance</Text>
              </View>
            ) : (
              <View className="gap-6">
                <View>
                  <Text className="text-sm font-medium text-neutral-500 mb-2 font-jakarta uppercase tracking-widest">Wrapping up</Text>
                  <Text className="text-2xl font-bold text-neutral-900 font-jakarta-bold leading-tight">Anything else on your mind?</Text>
                  <Text className="text-sm text-neutral-500 mt-2 font-jakarta">Your notes help our triage team understand your context better.</Text>
                </View>
                <TextInput value={additionalNotes} onChangeText={setAdditionalNotes} placeholder="Share context you want the triage team to know..." placeholderTextColor="#a3a3a3" multiline textAlignVertical="top" className="mt-2 min-h-[200px] rounded-[32px] border border-neutral-100 bg-white p-6 text-base text-neutral-900 font-jakarta shadow-sm shadow-neutral-100" editable={!isSubmittingTriage} />
              </View>
            )}
          </ScrollView>
          <View className="border-t border-neutral-100 bg-white px-5 pb-10 pt-4">
            {isAtNotesStep ? (
              <Pressable className={`items-center justify-center rounded-[24px] py-4 ${isSubmittingTriage ? "bg-mint/50" : "bg-mint"} shadow-lg shadow-mint/20`} onPress={handleSubmitTriage} disabled={isSubmittingTriage}>
                {isSubmittingTriage ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text className="text-base font-bold text-white font-jakarta-bold">Complete Assessment</Text>
                )}
              </Pressable>
            ) : (
              <View className="flex-row gap-3">
                <Pressable className="flex-1 items-center justify-center rounded-[24px] bg-neutral-100 py-4" onPress={() => { if (triageStep > 0) { setTriageStep((prev) => prev - 1); } else { handleCancelTriage(); } }} disabled={isSubmittingTriage}>
                  <Text className="text-base font-bold text-neutral-600 font-jakarta-bold">{triageStep === 0 ? "Cancel" : "Back"}</Text>
                </Pressable>
                <Pressable className={`flex-1 items-center justify-center rounded-[24px] py-4 ${assessmentAnswers[triageStep] === null ? "bg-mint/30" : "bg-mint"}`} onPress={() => setTriageStep((prev) => prev + 1)} disabled={isSubmittingTriage || assessmentAnswers[triageStep] === null}>
                  <Text className="text-base font-bold text-white font-jakarta-bold">Next</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}


