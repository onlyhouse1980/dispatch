import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';
import { Job, DeliveryProof } from '../data/mockJobs';

interface DeliveryConfirmModalProps {
  visible: boolean;
  job: Job;
  onConfirm: (proof: DeliveryProof) => void;
  onCancel: () => void;
}

const DeliveryConfirmModal: React.FC<DeliveryConfirmModalProps> = ({
  visible,
  job,
  onConfirm,
  onCancel,
}) => {
  const [signedBy, setSignedBy] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Reset fields when modal opens
      setSignedBy('');
      setDeliveryNotes('');
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        damping: 20,
        stiffness: 200,
      }).start();
    } else {
      slideAnim.setValue(0);
    }
  }, [visible]);

  const handleConfirm = () => {
    const proof: DeliveryProof = {};
    if (signedBy.trim()) proof.signedBy = signedBy.trim();
    if (deliveryNotes.trim()) proof.deliveryNotes = deliveryNotes.trim();
    onConfirm(proof);
  };

  const headerScale = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.9, 1],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onCancel}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.modalContainer}>
          {/* Drag Handle */}
          <View style={styles.dragHandle} />

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.scrollContent}
          >
            {/* Header */}
            <Animated.View
              style={[
                styles.headerSection,
                { transform: [{ scale: headerScale }] },
              ]}
            >
              <View style={styles.iconRing}>
                <Ionicons name="checkmark-circle" size={36} color={COLORS.success} />
              </View>
              <Text style={styles.modalTitle}>Confirm Delivery</Text>
              <Text style={styles.modalSubtitle}>
                {job.dropoff.address}, {job.dropoff.city}
              </Text>
              <Text style={styles.recipientText}>
                Recipient: {job.dropoff.contactName}
              </Text>
            </Animated.View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Optional Fields Section */}
            <View style={styles.fieldSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="document-text-outline" size={16} color={COLORS.primary} />
                <Text style={styles.sectionLabel}>DELIVERY DETAILS</Text>
                <View style={styles.optionalBadge}>
                  <Text style={styles.optionalText}>OPTIONAL</Text>
                </View>
              </View>

              {/* Signed By Field */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Signed / Received By</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="person-outline"
                    size={16}
                    color={COLORS.textMuted}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. John at front desk"
                    placeholderTextColor={COLORS.textMuted}
                    value={signedBy}
                    onChangeText={setSignedBy}
                    returnKeyType="next"
                    autoCapitalize="words"
                  />
                </View>
              </View>

              {/* Delivery Notes Field */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Delivery Notes</Text>
                <View style={[styles.inputContainer, styles.textAreaContainer]}>
                  <Ionicons
                    name="chatbox-ellipses-outline"
                    size={16}
                    color={COLORS.textMuted}
                    style={[styles.inputIcon, { marginTop: 2 }]}
                  />
                  <TextInput
                    style={[styles.textInput, styles.textArea]}
                    placeholder="Left at reception, handed to security guard, package condition notes…"
                    placeholderTextColor={COLORS.textMuted}
                    value={deliveryNotes}
                    onChangeText={setDeliveryNotes}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    returnKeyType="done"
                  />
                </View>
              </View>
            </View>

            {/* Payout Reminder */}
            <View style={styles.payoutReminder}>
              <Ionicons name="wallet-outline" size={16} color={COLORS.success} />
              <Text style={styles.payoutReminderText}>
                Payout of <Text style={styles.payoutAmount}>${job.earnings.toFixed(2)}</Text> will be credited upon confirmation.
              </Text>
            </View>
          </ScrollView>

          {/* Action Buttons — always pinned at bottom */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelBtnText}>NOT YET</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmBtn}
              onPress={handleConfirm}
              activeOpacity={0.8}
            >
              <Ionicons name="checkmark-done" size={18} color="#090D16" style={{ marginRight: 6 }} />
              <Text style={styles.confirmBtnText}>CONFIRM DELIVERY</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.cardBackground,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '88%',
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.textMuted,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  headerSection: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  iconRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.successGlow,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 4,
  },
  recipientText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primary,
    letterSpacing: 0.3,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
  fieldSection: {
    paddingVertical: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 1.5,
    marginLeft: 8,
  },
  optionalBadge: {
    marginLeft: 'auto',
    backgroundColor: COLORS.cardBackgroundElevated,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  optionalText: {
    fontSize: 8,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  fieldGroup: {
    marginBottom: 14,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackgroundElevated,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  textAreaContainer: {
    alignItems: 'flex-start',
    minHeight: 80,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '500',
    padding: 0,
  },
  textArea: {
    minHeight: 56,
    lineHeight: 20,
  },
  payoutReminder: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successGlow,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    padding: 12,
    marginBottom: 4,
  },
  payoutReminderText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  payoutAmount: {
    fontWeight: '800',
    color: COLORS.success,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackgroundElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  confirmBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.success,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  confirmBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#090D16',
    letterSpacing: 0.5,
  },
});

export default DeliveryConfirmModal;
