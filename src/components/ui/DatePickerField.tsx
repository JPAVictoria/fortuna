import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { BorderRadius, FontSize, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { formatDate } from '@/lib/utils';

type Props = {
  value: Date;
  onChange: (date: Date) => void;
  maximumDate?: Date;
  label?: string;
};

export function DatePickerField({ value, onChange, maximumDate, label = 'DATE' }: Props) {
  const theme = useTheme();
  const [show, setShow] = useState(false);
  const [tempDate, setTempDate] = useState(value);

  function open() {
    setTempDate(value);
    setShow(true);
  }

  function handleChange(_: unknown, d?: Date) {
    if (Platform.OS === 'android') {
      setShow(false);
      if (d) onChange(d);
    } else {
      if (d) setTempDate(d);
    }
  }

  function confirm() {
    onChange(tempDate);
    setShow(false);
  }

  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>

      <TouchableOpacity
        onPress={open}
        accessibilityLabel={`Date: ${formatDate(value.toISOString())}`}
        style={[styles.row, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
        <Ionicons name="calendar-outline" size={16} color={theme.textMuted} />
        <Text style={[styles.value, { color: theme.text }]}>{formatDate(value.toISOString())}</Text>
        <Ionicons name="chevron-down" size={14} color={theme.textMuted} />
      </TouchableOpacity>

      {Platform.OS === 'ios' && (
        <Modal visible={show} transparent animationType="slide" onRequestClose={() => setShow(false)}>
          <View style={styles.overlay}>
            <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setShow(false)} />
            <View style={[styles.sheet, { backgroundColor: theme.surface, borderTopColor: theme.border }]}>
              <View style={[styles.sheetHeader, { borderBottomColor: theme.border }]}>
                <TouchableOpacity onPress={() => setShow(false)} hitSlop={16}>
                  <Text style={[styles.sheetAction, { color: theme.textMuted }]}>Cancel</Text>
                </TouchableOpacity>
                <Text style={[styles.sheetTitle, { color: theme.text }]}>Select Date</Text>
                <TouchableOpacity onPress={confirm} hitSlop={16}>
                  <Text style={[styles.sheetAction, styles.sheetDone, { color: theme.primary }]}>Done</Text>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                maximumDate={maximumDate}
                onChange={handleChange}
                style={styles.picker}
                textColor={theme.text}
              />
            </View>
          </View>
        </Modal>
      )}

      {Platform.OS === 'android' && show && (
        <DateTimePicker
          value={value}
          mode="date"
          display="default"
          maximumDate={maximumDate}
          onChange={handleChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 8 },
  label: { fontSize: FontSize.sm, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.6 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
  },
  value: { fontSize: FontSize.md, fontWeight: '500', flex: 1 },
  overlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.45)' },
  backdrop: { flex: 1 },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingBottom: 34,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sheetTitle: { fontSize: FontSize.md, fontWeight: '600' },
  sheetAction: { fontSize: FontSize.md },
  sheetDone: { fontWeight: '700' },
  picker: { marginHorizontal: Spacing.sm },
});
