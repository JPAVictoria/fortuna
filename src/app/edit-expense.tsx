import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { BorderRadius, FontSize, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useCategories, useUpdateExpense } from "@/hooks/useExpenses";
import { useHaptics } from "@/hooks/useHaptics";
import { DEFAULT_CURRENCY_SYMBOL } from "@/hooks/useSettings";
import { formatAmountInput, formatDate } from "@/lib/utils";
import { useToast } from "@/providers/ToastProvider";

export default function EditExpenseModal() {
  const theme = useTheme();
  const haptics = useHaptics();
  const toast = useToast();
  const { mutate: updateExpense, isPending } = useUpdateExpense();
  const { data: categories = [] } = useCategories();

  const params = useLocalSearchParams<{
    id: string;
    amount: string;
    description: string;
    categoryId: string;
    date: string;
    notes: string;
  }>();

  const [amount, setAmount] = useState(
    params.amount ? formatAmountInput(params.amount) : "",
  );
  const [description, setDescription] = useState(params.description ?? "");
  const [notes, setNotes] = useState(params.notes ?? "");
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    params.categoryId ?? "",
  );
  const [date, setDate] = useState(new Date(params.date ?? Date.now()));
  const [showDatePicker, setShowDatePicker] = useState(false);

  const parsedAmount = parseFloat(amount.replace(/,/g, ""));
  const canSubmit =
    !isNaN(parsedAmount) &&
    parsedAmount > 0 &&
    description.trim().length > 0 &&
    selectedCategoryId.length > 0;

  function handleSubmit() {
    const parsed = parseFloat(amount.replace(/,/g, ""));
    if (isNaN(parsed) || parsed <= 0) {
      haptics.error();
      Alert.alert(
        "Invalid Amount",
        "Please enter a valid amount greater than 0.",
      );
      return;
    }
    if (!description.trim()) {
      haptics.error();
      Alert.alert("Missing Description", "Please describe what you spent on.");
      return;
    }
    if (!selectedCategoryId) {
      haptics.error();
      Alert.alert("No Category", "Please select a category.");
      return;
    }

    updateExpense(
      {
        id: params.id,
        amount: parsed,
        description: description.trim(),
        categoryId: selectedCategoryId,
        date: date.toISOString(),
        notes: notes.trim() || undefined,
      },
      {
        onSuccess: () => {
          haptics.success();
          toast("Expense updated!");
          router.back();
        },
        onError: () => {
          haptics.error();
          toast("Failed to update expense", "error");
        },
      },
    );
  }

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.background }]}
      edges={["top", "bottom"]}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.kav}
        >
          <View style={styles.handleWrap}>
            <View style={[styles.handle, { backgroundColor: theme.border }]} />
          </View>

          <View style={styles.titleRow}>
            <Text style={[styles.title, { color: theme.text }]}>
              Edit Expense
            </Text>
            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss();
                router.back();
              }}
              hitSlop={16}
              accessibilityLabel="Close"
            >
              <Text style={[styles.close, { color: theme.textMuted }]}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.form}
            showsVerticalScrollIndicator={false}
          >
            <Input
              label="Amount"
              prefix={DEFAULT_CURRENCY_SYMBOL}
              placeholder="0.00"
              value={amount}
              onChangeText={(v) => setAmount(formatAmountInput(v))}
              keyboardType="decimal-pad"
              returnKeyType="next"
              autoFocus
            />
            <Input
              label="Description"
              placeholder="What did you spend on?"
              value={description}
              onChangeText={setDescription}
              returnKeyType="next"
              autoCorrect={false}
            />

            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>
                CATEGORY
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chips}
              >
                {categories.map((cat) => {
                  const active = selectedCategoryId === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      onPress={() => {
                        haptics.light();
                        setSelectedCategoryId(cat.id);
                      }}
                      style={[
                        styles.chip,
                        {
                          backgroundColor: active
                            ? cat.color + "33"
                            : theme.backgroundElement,
                          borderColor: active ? cat.color : theme.border,
                          borderWidth: active ? 1.5 : 1,
                        },
                      ]}
                    >
                      <Text style={styles.chipIcon}>{cat.icon}</Text>
                      <Text
                        style={[
                          styles.chipLabel,
                          { color: active ? cat.color : theme.textMuted },
                        ]}
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: theme.textSecondary }]}>
                DATE
              </Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={[
                  styles.dateRow,
                  {
                    backgroundColor: theme.backgroundElement,
                    borderColor: theme.border,
                  },
                ]}
              >
                <Text>📅</Text>
                <Text style={[styles.dateValue, { color: theme.text }]}>
                  {formatDate(date.toISOString())}
                </Text>
              </TouchableOpacity>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(_, d) => {
                  setShowDatePicker(Platform.OS === "ios");
                  if (d) setDate(d);
                }}
              />
            )}

            <Input
              label="Notes (optional)"
              placeholder="Add a note..."
              value={notes}
              onChangeText={setNotes}
              multiline
              style={{ minHeight: 64, textAlignVertical: "top" }}
            />
            <Button
              label="Save Changes"
              onPress={handleSubmit}
              loading={isPending}
              disabled={!canSubmit}
              fullWidth
              size="lg"
              style={styles.submit}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  kav: { flex: 1 },
  handleWrap: { alignItems: "center", paddingTop: Spacing.sm },
  handle: { width: 40, height: 4, borderRadius: 2 },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  title: { fontSize: FontSize.xl, fontWeight: "700" },
  close: { fontSize: FontSize.lg },
  form: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  field: { gap: 8 },
  label: {
    fontSize: FontSize.sm,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  chips: { gap: Spacing.sm, paddingBottom: Spacing.xs },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: BorderRadius.full,
  },
  chipIcon: { fontSize: 14 },
  chipLabel: { fontSize: FontSize.sm, fontWeight: "500" },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
  },
  dateValue: { fontSize: FontSize.md, fontWeight: "500", flex: 1 },
  submit: { marginTop: Spacing.sm },
});
