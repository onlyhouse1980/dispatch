import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  LayoutAnimation,
} from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useJobStore } from '../store/useJobStore';
import { RootStackParamList } from '../navigation/AppNavigator';
import { DeliveryProof } from '../data/mockJobs';
import MockMap from '../components/MockMap';
import StepTracker from '../components/StepTracker';
import PriorityBadge from '../components/PriorityBadge';
import DeliveryConfirmModal from '../components/DeliveryConfirmModal';
import COLORS from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

type DetailRouteProp = RouteProp<RootStackParamList, 'JobDetail'>;
type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const JobDetailScreen: React.FC = () => {
  const route = useRoute<DetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const { jobId } = route.params;
  
  const { jobs, acceptJob, updateJobStatus } = useJobStore();
  const job = jobs.find((j) => j.id === jobId);

  const [deliveryModalVisible, setDeliveryModalVisible] = useState(false);

  const handleAction = useCallback(() => {
    if (!job) return;

    if (job.status === 'Available') {
      Alert.alert(
        'Accept Shipment',
        `Accept delivery of "${job.cargoDescription}" from ${job.pickup.city} to ${job.dropoff.city}?\n\nEst. Payout: $${job.earnings.toFixed(2)}`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Accept',
            onPress: () => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              acceptJob(job.id);
            },
          },
        ]
      );
    } else if (job.status === 'Accepted') {
      Alert.alert(
        'Confirm Pickup',
        `Confirm you have picked up the cargo?\n\n"${job.cargoDescription}" at ${job.pickup.address}, ${job.pickup.city}`,
        [
          { text: 'Not Yet', style: 'cancel' },
          {
            text: 'Confirm Pickup',
            onPress: () => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              updateJobStatus(job.id, 'Picked Up');
            },
          },
        ]
      );
    } else if (job.status === 'Picked Up') {
      // Open the delivery confirmation modal instead of a basic Alert
      setDeliveryModalVisible(true);
    }
  }, [job, acceptJob, updateJobStatus]);

  const handleDeliveryConfirm = useCallback((proof: DeliveryProof) => {
    if (!job) return;
    setDeliveryModalVisible(false);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    updateJobStatus(job.id, 'Delivered', proof);
  }, [job, updateJobStatus]);

  if (!job) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.danger} />
        <Text style={styles.errorText}>Job not found</Text>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backBtnText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Determine button styles and labels
  let buttonText = '';
  let buttonColor = COLORS.primary;
  let buttonIcon = 'checkmark-circle';
  let showButton = true;

  if (job.status === 'Available') {
    buttonText = 'ACCEPT SHIPMENT';
    buttonColor = COLORS.primary;
    buttonIcon = 'add-circle';
  } else if (job.status === 'Accepted') {
    buttonText = 'CONFIRM PICKUP';
    buttonColor = COLORS.statusPickedUp;
    buttonIcon = 'cube';
  } else if (job.status === 'Picked Up') {
    buttonText = 'CONFIRM DELIVERY';
    buttonColor = COLORS.success;
    buttonIcon = 'location';
  } else {
    showButton = false; // Delivered
  }

  // Bottom drawer dynamic padding for safe area
  const drawerPaddingBottom = Math.max(insets.bottom, 14);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Detail Header */}
        <View style={styles.header}>
          <View style={styles.headerTitleRow}>
            <PriorityBadge priority={job.priority} />
            <Text style={styles.jobId}>{job.id}</Text>
          </View>
          <View style={styles.payoutContainer}>
            <Text style={styles.payoutLabel}>Est. Payout</Text>
            <Text style={styles.payoutValue}>${job.earnings.toFixed(2)}</Text>
          </View>
        </View>

        {/* Cargo Summary */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>CARGO DETAILS</Text>
          <View style={styles.cargoRow}>
            <Ionicons name="cube" size={18} color={COLORS.primary} />
            <Text style={styles.cargoDescription}>{job.cargoDescription}</Text>
          </View>
          {job.notes && (
            <View style={styles.notesBox}>
              <Ionicons name="information-circle" size={16} color={COLORS.textSecondary} style={{ marginRight: 6 }} />
              <Text style={styles.notesText}>{job.notes}</Text>
            </View>
          )}
        </View>

        {/* Route Map Section */}
        <MockMap
          status={job.status}
          pickupAddress={job.pickup.address}
          dropoffAddress={job.dropoff.address}
        />

        {/* Distance & Duration Pills */}
        <View style={styles.metaRow}>
          <View style={styles.metaPill}>
            <Ionicons name="map-outline" size={14} color={COLORS.primary} />
            <Text style={styles.metaLabel}>DISTANCE</Text>
            <Text style={styles.metaVal}>{job.distance}</Text>
          </View>
          <View style={[styles.metaPill, { marginLeft: 12 }]}>
            <Ionicons name="time-outline" size={14} color={COLORS.primary} />
            <Text style={styles.metaLabel}>EST. DURATION</Text>
            <Text style={styles.metaVal}>{job.duration}</Text>
          </View>
        </View>

        {/* Step Timeline tracker */}
        {job.status !== 'Available' && <StepTracker job={job} />}

        {/* Delivery Proof Section — shown on completed deliveries */}
        {job.status === 'Delivered' && job.deliveryProof && (job.deliveryProof.signedBy || job.deliveryProof.deliveryNotes) && (
          <View style={styles.sectionCard}>
            <View style={styles.proofHeader}>
              <Text style={styles.sectionTitle}>DELIVERY PROOF</Text>
              <View style={styles.verifiedBadge}>
                <Ionicons name="shield-checkmark" size={12} color={COLORS.success} />
                <Text style={styles.verifiedText}>VERIFIED</Text>
              </View>
            </View>

            {job.deliveryProof.signedBy ? (
              <View style={styles.proofRow}>
                <View style={styles.proofIconWrap}>
                  <Ionicons name="person" size={14} color={COLORS.primary} />
                </View>
                <View style={styles.proofContent}>
                  <Text style={styles.proofLabel}>Signed / Received By</Text>
                  <Text style={styles.proofValue}>{job.deliveryProof.signedBy}</Text>
                </View>
              </View>
            ) : null}

            {job.deliveryProof.deliveryNotes ? (
              <View style={[styles.proofRow, { marginTop: job.deliveryProof.signedBy ? 12 : 0 }]}>
                <View style={styles.proofIconWrap}>
                  <Ionicons name="chatbox-ellipses" size={14} color={COLORS.primary} />
                </View>
                <View style={styles.proofContent}>
                  <Text style={styles.proofLabel}>Driver Notes</Text>
                  <Text style={styles.proofValue}>{job.deliveryProof.deliveryNotes}</Text>
                </View>
              </View>
            ) : null}
          </View>
        )}

        {/* Pickup & Drop-off Addresses */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>ROUTE ADDRESSES</Text>

          <View style={styles.addressBlock}>
            <View style={styles.addressHeader}>
              <View style={[styles.addressDot, { backgroundColor: COLORS.primary }]} />
              <Text style={styles.addressType}>PICKUP</Text>
            </View>
            <Text style={styles.addressCity}>{job.pickup.city}</Text>
            <Text style={styles.addressStreet}>{job.pickup.address}</Text>
            <View style={styles.timeWindowRow}>
              <Ionicons name="time-outline" size={12} color={COLORS.textMuted} />
              <Text style={styles.timeWindowText}>{job.pickup.timeWindow}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.addressBlock}>
            <View style={styles.addressHeader}>
              <View style={[styles.addressDot, { backgroundColor: COLORS.success }]} />
              <Text style={styles.addressType}>DROP-OFF</Text>
            </View>
            <Text style={styles.addressCity}>{job.dropoff.city}</Text>
            <Text style={styles.addressStreet}>{job.dropoff.address}</Text>
            <View style={styles.timeWindowRow}>
              <Ionicons name="time-outline" size={12} color={COLORS.textMuted} />
              <Text style={styles.timeWindowText}>{job.dropoff.timeWindow}</Text>
            </View>
          </View>
        </View>

        {/* Contact Sheets */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>CONTACT DETAILS</Text>
          
          <View style={styles.contactBlock}>
            <Text style={styles.contactLabel}>PICKUP CONTACT</Text>
            <View style={styles.contactRow}>
              <View>
                <Text style={styles.contactName}>{job.pickup.contactName}</Text>
                <Text style={styles.contactPhone}>{job.pickup.contactPhone}</Text>
              </View>
              <TouchableOpacity style={styles.callButton} activeOpacity={0.7}>
                <Ionicons name="call" size={16} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.contactBlock}>
            <Text style={styles.contactLabel}>DROP-OFF CONTACT</Text>
            <View style={styles.contactRow}>
              <View>
                <Text style={styles.contactName}>{job.dropoff.contactName}</Text>
                <Text style={styles.contactPhone}>{job.dropoff.contactPhone}</Text>
              </View>
              <TouchableOpacity style={styles.callButton} activeOpacity={0.7}>
                <Ionicons name="call" size={16} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Persistent Bottom Action Drawer */}
      <View style={[styles.actionDrawer, { paddingBottom: drawerPaddingBottom }]}>
        {showButton ? (
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: buttonColor }]}
            onPress={handleAction}
            activeOpacity={0.8}
          >
            <Ionicons name={buttonIcon as any} size={18} color="#090D16" style={{ marginRight: 8 }} />
            <Text style={styles.actionBtnText}>{buttonText}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.completedBanner}>
            <Ionicons name="checkmark-done-circle" size={24} color={COLORS.success} />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.completedTitle}>DELIVERY COMPLETED</Text>
              <Text style={styles.completedSub}>Handover finalized at {job.deliveredAt}</Text>
            </View>
          </View>
        )}
      </View>

      {/* Delivery Confirmation Modal */}
      <DeliveryConfirmModal
        visible={deliveryModalVisible}
        job={job}
        onConfirm={handleDeliveryConfirm}
        onCancel={() => setDeliveryModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110, // Cushion for the bottom persistent drawer
  },
  errorContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 24,
  },
  backBtn: {
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  backBtnText: {
    color: COLORS.white,
    fontWeight: '700',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 12,
  },
  headerTitleRow: {
    flexDirection: 'column',
  },
  jobId: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textSecondary,
    marginTop: 6,
    letterSpacing: 0.5,
  },
  payoutContainer: {
    alignItems: 'flex-end',
  },
  payoutLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginBottom: 2,
  },
  payoutValue: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.white,
  },
  sectionCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginVertical: 6,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  cargoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cargoDescription: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
    marginLeft: 10,
    flex: 1,
  },
  notesBox: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBackgroundElevated,
    padding: 10,
    borderRadius: 10,
    marginTop: 12,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  notesText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 16,
  },
  metaRow: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  metaPill: {
    flex: 1,
    backgroundColor: COLORS.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginTop: 4,
  },
  metaVal: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
    marginTop: 2,
  },
  // Delivery Proof section
  proofHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successGlow,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
    marginBottom: 12,
  },
  verifiedText: {
    fontSize: 8,
    fontWeight: '800',
    color: COLORS.success,
    letterSpacing: 1,
    marginLeft: 4,
  },
  proofRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  proofIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.cardBackgroundElevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 10,
    marginTop: 2,
  },
  proofContent: {
    flex: 1,
  },
  proofLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginBottom: 4,
  },
  proofValue: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
    lineHeight: 20,
  },
  // Route Address section
  addressBlock: {
    marginVertical: 4,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  addressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  addressType: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1,
  },
  addressCity: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
    marginLeft: 16,
  },
  addressStreet: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginLeft: 16,
    marginTop: 2,
  },
  timeWindowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    marginTop: 6,
  },
  timeWindowText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginLeft: 4,
  },
  // Contacts
  contactBlock: {
    marginVertical: 4,
  },
  contactLabel: {
    fontSize: 8,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
  },
  contactPhone: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  callButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.cardBackgroundElevated,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  actionDrawer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.cardBackground,
    borderTopWidth: 1.5,
    borderTopColor: COLORS.border,
    paddingHorizontal: 16,
    paddingTop: 14,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 10,
  },
  actionBtn: {
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#090D16',
    letterSpacing: 0.5,
  },
  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.successGlow,
    borderColor: COLORS.success,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
  },
  completedTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.success,
    letterSpacing: 0.5,
  },
  completedSub: {
    fontSize: 11,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
});

export default JobDetailScreen;
