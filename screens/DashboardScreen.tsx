import { useState } from "react";
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

import { Card } from "../components/Card";
import { supabase } from "../lib/supabase";
import { processTriageLog } from "../services/triageService";

function StatCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: string;
  helper: string;
}) {
  return (
    <Card className="flex-1">
      <Text className="text-xs font-medium text-neutral-500">{label}</Text>
      <Text className="mt-2 text-2xl font-bold text-neutral-900">{value}</Text>
      <Text className="mt-1 text-xs text-neutral-500">{helper}</Text>
    </Card>
  );
}

const LOCAL_TEST_USER_ID = "509c5ac9-e461-448c-b26b-66425b7ef65";
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
  onPress,
  isHighlighted = false,
}: {
  title: string;
  subtitle: string;
  onPress?: () => void;
  isHighlighted?: boolean;
}) {
  return (
    <Pressable onPress={onPress}>
      <Card
        className={`flex-row items-center justify-between ${
          isHighlighted ? "bg-rose-50" : ""
        }`}
      >
        <View className="gap-1">
          <Text className="text-base font-semibold text-neutral-900">
            {title}
          </Text>
          <Text className="text-xs text-neutral-500">{subtitle}</Text>
        </View>
        <View
          className={`h-10 w-10 items-center justify-center rounded-full ${
            isHighlighted ? "bg-rose-100" : "bg-neutral-100"
          }`}
        >
          <Text className="text-neutral-900">{">"}</Text>
        </View>
      </Card>
    </Pressable>
  );
}

export function DashboardScreen() {
  const [isTriageModalVisible, setIsTriageModalVisible] = useState(false);
  const [assessmentAnswers, setAssessmentAnswers] = useState<Array<number | null>>(
    Array.from({ length: ASSESSMENT_QUESTIONS.length }, () => null)
  );
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isSubmittingTriage, setIsSubmittingTriage] = useState(false);

  const handleCancelTriage = () => {
    if (isSubmittingTriage) {
      return;
    }
    setIsTriageModalVisible(false);
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
    const userInput =
      notes.length > 0
        ? notes
        : `PHQ-9 score: ${phq9Score}; GAD-7 score: ${gad7Score}; no additional notes provided.`;

    setIsSubmittingTriage(true);

    try {
      const { data } = await supabase.auth.getUser();
    if (!data.user) {
      Alert.alert(
        "Not Logged In",
        "Please sign in to submit a triage assessment."
      );
      return;
    }
    const userId = data.user.id;

      const response = await processTriageLog(
        userId,
        userInput,
        phq9Score,
        gad7Score
      );

      setIsTriageModalVisible(false);
      setAssessmentAnswers(
        Array.from({ length: ASSESSMENT_QUESTIONS.length }, () => null)
      );
      setAdditionalNotes("");

      Alert.alert(
        "Assessment submitted",
        `Pathway: ${
          response.ai_triage_pathway ?? "Triage complete"
        }\n\nPHQ-9: ${phq9Score} | GAD-7: ${gad7Score}`
      );
    } catch (error) {
      console.error("Triage submission error:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error ?? "");
      const hasMissingProfile = errorMessage
        .toLowerCase()
        .includes("no employee profile");

      if (hasMissingProfile) {
        Alert.alert(
          "Profile Setup Required",
          "We need a bit more context about your role to give you the best care. Please complete your onboarding profile before using the Triage tool!"
        );
      } else {
        Alert.alert(
          "Submission Failed",
          "We couldn't submit your assessment right now. Please check your connection and try again."
        );
      }
    } finally {
      setIsSubmittingTriage(false);
    }
  };

  return (
    <>
      <ScrollView
        className="flex-1 bg-neutral-50"
        contentContainerClassName="px-6 pb-10 pt-6"
      >
        <View className="gap-1">
          <Text className="text-sm font-medium text-neutral-500">
            Welcome back
          </Text>
          <Text className="text-3xl font-bold text-neutral-900">Dashboard</Text>
        </View>

        <View className="mt-6 flex-row gap-3">
          <StatCard label="Today" value="3" helper="Tasks completed" />
          <StatCard label="Streak" value="7" helper="Days active" />
        </View>

        <View className="mt-3">
          <Card className="bg-black">
            <Text className="text-sm font-medium text-white/70">Focus</Text>
            <Text className="mt-2 text-2xl font-bold text-white">
              Plan your next 15 minutes
            </Text>
            <Text className="mt-2 text-xs text-white/70">
              Keep it small. Keep it consistent.
            </Text>
          </Card>
        </View>

        <Pressable
          className="mx-2 mt-8 items-center justify-center rounded-2xl bg-green-600 px-4 py-4"
          onPress={() => setIsTriageModalVisible(true)}
        >
          <Text className="text-lg font-bold text-white">LOG</Text>
        </Pressable>

        <View className="mt-6 gap-3">
          <Text className="text-sm font-semibold text-neutral-900">
            Quick actions
          </Text>
          <QuickAction
            title="Add a task"
            subtitle="Capture it before it disappears"
          />
          <QuickAction title="Review week" subtitle="See what you shipped" />
          <QuickAction title="Set a goal" subtitle="Pick one thing to improve" />
        </View>
      </ScrollView>

      <Modal
        visible={isTriageModalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={handleCancelTriage}
      >
        <View className="flex-1 bg-neutral-50">
          <View className="border-b border-neutral-200 bg-white px-5 pb-4 pt-12">
            <Text className="text-lg font-bold text-neutral-900">
              Over the last 2 weeks, how often have you been bothered by the
              following?
            </Text>
            <Text className="mt-2 text-xs text-neutral-500">
              0 = Not at all, 1 = Several days, 2 = More than half the days, 3 =
              Nearly every day
            </Text>
          </View>

          <ScrollView
            className="flex-1"
            contentContainerClassName="gap-4 px-5 pb-8 pt-4"
          >
            {ASSESSMENT_QUESTIONS.map((question, questionIndex) => (
              <Card key={question} className="p-4">
                <Text className="text-xs font-semibold text-neutral-500">
                  Item {questionIndex + 1}
                </Text>
                <Text className="mt-1 text-sm font-medium text-neutral-900">
                  {question}
                </Text>

                <View className="mt-3 flex-row flex-wrap gap-2">
                  {ASSESSMENT_OPTIONS.map((option) => {
                    const isSelected =
                      assessmentAnswers[questionIndex] === option.value;

                    return (
                      <Pressable
                        key={`${questionIndex}-${option.value}`}
                        className={`rounded-full border px-3 py-2 ${
                          isSelected
                            ? "border-green-600 bg-green-100"
                            : "border-neutral-200 bg-white"
                        }`}
                        onPress={() =>
                          handleSelectAnswer(questionIndex, option.value)
                        }
                        disabled={isSubmittingTriage}
                      >
                        <Text
                          className={`text-xs font-semibold ${
                            isSelected ? "text-green-700" : "text-neutral-600"
                          }`}
                        >
                          {option.value}: {option.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </Card>
            ))}

            <Card className="p-4">
              <Text className="text-sm font-semibold text-neutral-900">
                Additional notes (optional)
              </Text>
              <TextInput
                value={additionalNotes}
                onChangeText={setAdditionalNotes}
                placeholder="Share context you want the triage team to know..."
                placeholderTextColor="#a3a3a3"
                multiline
                textAlignVertical="top"
                className="mt-3 min-h-[100px] rounded-2xl border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-900"
                editable={!isSubmittingTriage}
              />
            </Card>
          </ScrollView>

          <View className="border-t border-neutral-200 bg-white px-5 pb-6 pt-4">
            <View className="flex-row gap-3">
              <Pressable
                className="flex-1 items-center justify-center rounded-2xl bg-neutral-200 px-4 py-3"
                onPress={handleCancelTriage}
                disabled={isSubmittingTriage}
              >
                <Text className="text-sm font-semibold text-neutral-700">
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                className="flex-1 items-center justify-center rounded-2xl bg-green-600 px-4 py-3"
                onPress={handleSubmitTriage}
                disabled={isSubmittingTriage}
              >
                {isSubmittingTriage ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <Text className="text-sm font-semibold text-white">
                    Submit Assessment
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
