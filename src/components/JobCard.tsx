import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Job, JobStatus } from '../data/mockJobs';
import COLORS from '../theme/colors';
import PriorityBadge from './PriorityBadge';

interface JobCardProps {
  job: Job;
  onPress: () => void;
  onActionPress?: () => void;
  actionButtonText?: string;
  actionButtonColor?: string;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onPress,
  onActionPress,
  actionButtonText,
  actionButtonColor,
}) => {
  // Determine status color/tag
  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case 'Available': return COLORS.statusAvailable;
      case 'Accepted': return COLORS.statusAccepted;
      case 'Picked Up': return COLORS.statusPickedUp;
      case 'Delivered': return COLORS.statusDelivered;
      default: return COLORS.textSecondary;
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <PriorityBadge priority={job.priority} />
        <View style={styles.headerRight}>
          <Text style={styles.jobId}>{job.id}</Text>
          <Text style={styles.earnings}>${job.earnings.toFixed(2)}</Text>
        </View>
      </View>

      {/* Address Connection Timeline */}
      <View style={styles.routeContainer}>
        {/* Visual Line */}
        <View style={styles.timelineVisual}>
          <Ionicons name="ellipse" size={12} color={COLORS.primary} />
          <View style={styles.timelineLine} />
          <Ionicons name="location" size={14} color={COLORS.success} />
        </View>

        {/* Text Details */}
        <View style={styles.addressContainer}>
          <View style={styles.addressBlock}>
            <Text style={styles.addressLabel}>PICKUP</Text>
            <Text style={styles.cityText}>{job.pickup.city}</Text>
            <Text style={styles.streetText}>{job.pickup.address}</Text>
          </View>
          
          <View style={[styles.addressBlock, { marginTop: 14 }]}>
            <Text style={styles.addressLabel}>DROP-OFF</Text>
            <Text style={styles.cityText}>{job.dropoff.city}</Text>
            <Text style={styles.streetText}>{job.dropoff.address}</Text>
          </View>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Footer / Meta Row */}
      <View style={styles.footerRow}>
        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Ionicons name="map-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.metaText}>{job.distance}</Text>
          </View>
          <View style={[styles.metaItem, { marginLeft: 16 }]}>
            <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
            <Text style={styles.metaText}>{job.duration}</Text>
          </View>
        </View>

        {/* Status Indicator */}
        {job.status !== 'Available' && (
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(job.status) + '15', borderColor: getStatusColor(job.status) }]}>
            <Text style={[styles.statusText, { color: getStatusColor(job.status) }]}>{job.status}</Text>
          </View>
        )}
      </View>

      {/* Action Button (e.g. Accept, Confirm Pickup, etc.) */}
      {onActionPress && actionButtonText && (
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: actionButtonColor || COLORS.primary }
          ]}
          onPress={(e) => {
            e.stopPropagation(); // Avoid triggering card onPress
            onActionPress();
          }}
          activeOpacity={0.7}
        >
          <Text style={styles.actionButtonText}>{actionButtonText}</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerRight: {
    alignItems: 'flex-end',
  },
  jobId: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  earnings: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.white,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginVertical: 4,
  },
  timelineVisual: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: COLORS.border,
    marginVertical: 4,
    borderStyle: 'dashed',
  },
  addressContainer: {
    flex: 1,
    paddingLeft: 8,
  },
  addressBlock: {
    justifyContent: 'center',
  },
  addressLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  cityText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.white,
  },
  streetText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 14,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginLeft: 4,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  actionButton: {
    marginTop: 16,
    height: 44,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#090D16', // Dark background theme color for contrast on Cyan/Emerald
    letterSpacing: 0.5,
  },
});

export default JobCard;
