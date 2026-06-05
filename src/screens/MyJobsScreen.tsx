import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Alert,
  LayoutAnimation,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useJobStore } from '../store/useJobStore';
import { RootStackParamList } from '../navigation/AppNavigator';
import { DeliveryProof } from '../data/mockJobs';
import JobCard from '../components/JobCard';
import DeliveryConfirmModal from '../components/DeliveryConfirmModal';
import COLORS from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type TabSegment = 'Active' | 'Completed';

export const MyJobsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { jobs, updateJobStatus } = useJobStore();
  const [activeSegment, setActiveSegment] = useState<TabSegment>('Active');
  const [deliveryModalJobId, setDeliveryModalJobId] = useState<string | null>(null);

  // Filter jobs based on active vs completed segments
  const activeJobs = jobs.filter((job) => job.status === 'Accepted' || job.status === 'Picked Up');
  const completedJobs = jobs.filter((job) => job.status === 'Delivered');

  const displayJobs = activeSegment === 'Active' ? activeJobs : completedJobs;

  const deliveryModalJob = deliveryModalJobId
    ? jobs.find((j) => j.id === deliveryModalJobId)
    : null;

  const handleCardPress = (jobId: string) => {
    navigation.navigate('JobDetail', { jobId });
  };

  const handleSegmentChange = useCallback((segment: TabSegment) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveSegment(segment);
  }, []);

  const handleActionPress = useCallback((jobId: string, currentStatus: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;

    if (currentStatus === 'Accepted') {
      Alert.alert(
        'Confirm Pickup',
        `Confirm you have picked up the cargo?\n\n"${job.cargoDescription}" at ${job.pickup.address}, ${job.pickup.city}`,
        [
          { text: 'Not Yet', style: 'cancel' },
          {
            text: 'Confirm Pickup',
            onPress: () => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              updateJobStatus(jobId, 'Picked Up');
            },
          },
        ]
      );
    } else if (currentStatus === 'Picked Up') {
      // Open the delivery confirmation modal
      setDeliveryModalJobId(jobId);
    }
  }, [jobs, updateJobStatus]);

  const handleDeliveryConfirm = useCallback((proof: DeliveryProof) => {
    if (!deliveryModalJobId) return;
    setDeliveryModalJobId(null);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    updateJobStatus(deliveryModalJobId, 'Delivered', proof);
  }, [deliveryModalJobId, updateJobStatus]);

  const getActionButtonText = (status: string) => {
    if (status === 'Accepted') return 'CONFIRM PICKUP';
    if (status === 'Picked Up') return 'CONFIRM DELIVERY';
    return undefined;
  };

  const getActionButtonColor = (status: string) => {
    if (status === 'Accepted') return COLORS.statusPickedUp;
    if (status === 'Picked Up') return COLORS.success;
    return undefined;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Custom Segmented Tab Controller */}
      <View style={styles.segmentContainer}>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            activeSegment === 'Active' && styles.segmentButtonActive,
          ]}
          onPress={() => handleSegmentChange('Active')}
          activeOpacity={0.8}
        >
          <View style={styles.segmentContent}>
            <Ionicons
              name="car"
              size={16}
              color={activeSegment === 'Active' ? COLORS.primary : COLORS.textMuted}
            />
            <Text
              style={[
                styles.segmentText,
                activeSegment === 'Active' && styles.segmentTextActive,
              ]}
            >
              Active ({activeJobs.length})
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.segmentButton,
            activeSegment === 'Completed' && styles.segmentButtonActive,
          ]}
          onPress={() => handleSegmentChange('Completed')}
          activeOpacity={0.8}
        >
          <View style={styles.segmentContent}>
            <Ionicons
              name="checkmark-circle-sharp"
              size={16}
              color={activeSegment === 'Completed' ? COLORS.success : COLORS.textMuted}
            />
            <Text
              style={[
                styles.segmentText,
                activeSegment === 'Completed' && styles.segmentTextActive,
              ]}
            >
              Completed ({completedJobs.length})
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Deliveries List */}
      <FlatList
        data={displayJobs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <JobCard
            job={item}
            onPress={() => handleCardPress(item.id)}
            onActionPress={
              item.status !== 'Delivered'
                ? () => handleActionPress(item.id, item.status)
                : undefined
            }
            actionButtonText={getActionButtonText(item.status)}
            actionButtonColor={getActionButtonColor(item.status)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons
                name={activeSegment === 'Active' ? 'cube-outline' : 'archive-outline'}
                size={40}
                color={activeSegment === 'Active' ? COLORS.textSecondary : COLORS.success}
              />
            </View>
            <Text style={styles.emptyTitle}>
              {activeSegment === 'Active' ? 'No Active Shipments' : 'No Delivery History'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {activeSegment === 'Active'
                ? "You haven't accepted any jobs yet. Head over to the Job Feed tab and accept a delivery load to get started."
                : "Deliveries you complete will appear here as part of your shipment history."}
            </Text>
          </View>
        }
      />

      {/* Delivery Confirmation Modal */}
      {deliveryModalJob && (
        <DeliveryConfirmModal
          visible={!!deliveryModalJobId}
          job={deliveryModalJob}
          onConfirm={handleDeliveryConfirm}
          onCancel={() => setDeliveryModalJobId(null)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBackground,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentButtonActive: {
    backgroundColor: COLORS.cardBackgroundElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  segmentContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
  segmentTextActive: {
    color: COLORS.white,
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default MyJobsScreen;
