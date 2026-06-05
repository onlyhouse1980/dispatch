import React, { useCallback, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  StatusBar,
  TouchableOpacity,
  Alert,
  Animated,
  LayoutAnimation,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useJobStore } from '../store/useJobStore';
import { RootStackParamList } from '../navigation/AppNavigator';
import JobCard from '../components/JobCard';
import COLORS from '../theme/colors';
import { Ionicons } from '@expo/vector-icons';


type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const JobFeedScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { jobs, acceptJob, resetMockData } = useJobStore();

  // Filter jobs to only show "Available" ones
  const availableJobs = jobs.filter((job) => job.status === 'Available');

  const handleCardPress = (jobId: string) => {
    navigation.navigate('JobDetail', { jobId });
  };

  const handleAcceptJob = useCallback((jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (!job) return;

    Alert.alert(
      'Accept Shipment',
      `Accept delivery of "${job.cargoDescription}" from ${job.pickup.city} to ${job.dropoff.city}?\n\nEst. Payout: $${job.earnings.toFixed(2)}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          style: 'default',
          onPress: () => {
            // Animate the card out smoothly
            LayoutAnimation.configureNext(
              LayoutAnimation.create(
                300,
                LayoutAnimation.Types.easeInEaseOut,
                LayoutAnimation.Properties.opacity
              )
            );
            acceptJob(jobId);
          },
        },
      ]
    );
  }, [jobs, acceptJob]);

  const handleReset = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    resetMockData();
  }, [resetMockData]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Feed Stats Header */}
      <View style={styles.statsBar}>
        <View style={styles.statLeft}>
          <Text style={styles.statLabel}>SHIPMENTS AVAILABLE</Text>
          <View style={styles.badgeRow}>
            <View style={[styles.activeDot, availableJobs.length === 0 && styles.inactiveDot]} />
            <Text style={styles.statValue}>
              {availableJobs.length} Load{availableJobs.length !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
        
        {/* Reset Dev Button */}
        <TouchableOpacity style={styles.resetButton} onPress={handleReset} activeOpacity={0.7}>
          <Ionicons name="refresh-outline" size={14} color={COLORS.primary} />
          <Text style={styles.resetText}>RESET DEMO</Text>
        </TouchableOpacity>
      </View>

      {/* Available Jobs List */}
      <FlatList
        data={availableJobs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <JobCard
            job={item}
            onPress={() => handleCardPress(item.id)}
            onActionPress={() => handleAcceptJob(item.id)}
            actionButtonText="ACCEPT SHIPMENT"
            actionButtonColor={COLORS.primary}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="sparkles-outline" size={48} color={COLORS.primary} />
            </View>
            <Text style={styles.emptyTitle}>All Loads Dispatched</Text>
            <Text style={styles.emptySubtitle}>
              Great work! You have accepted or completed all available delivery jobs. Tap 'Reset Demo' above or load new mock postings below.
            </Text>
            <TouchableOpacity style={styles.emptyResetBtn} onPress={handleReset} activeOpacity={0.8}>
              <Ionicons name="refresh" size={16} color="#090D16" style={{ marginRight: 6 }} />
              <Text style={styles.emptyResetText}>Load Mock Jobs</Text>
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  statLeft: {
    flexDirection: 'column',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.textMuted,
    letterSpacing: 1,
    marginBottom: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
    marginRight: 6,
  },
  inactiveDot: {
    backgroundColor: COLORS.textMuted,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.white,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBackground,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resetText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
    marginLeft: 6,
    letterSpacing: 0.5,
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
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.cardBackground,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
  },
  emptyResetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  emptyResetText: {
    color: '#090D16',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.5,
  },
});

export default JobFeedScreen;
