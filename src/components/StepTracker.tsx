import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Job } from '../data/mockJobs';
import COLORS from '../theme/colors';

interface StepTrackerProps {
  job: Job;
}

export const StepTracker: React.FC<StepTrackerProps> = ({ job }) => {
  const { status, acceptedAt, pickedUpAt, deliveredAt } = job;

  // Determine step states
  // Step 1: Accepted (Status can be Accepted, Picked Up, Delivered)
  // Step 2: Picked Up (Status can be Picked Up, Delivered)
  // Step 3: Delivered (Status can be Delivered)

  const steps = [
    {
      title: 'Job Accepted',
      subtitle: 'Order assigned to you',
      time: acceptedAt,
      isCompleted: status === 'Accepted' || status === 'Picked Up' || status === 'Delivered',
      isActive: status === 'Accepted',
      icon: 'checkmark-circle',
      activeColor: COLORS.statusAccepted,
    },
    {
      title: 'Picked Up',
      subtitle: 'Cargo received at origin',
      time: pickedUpAt,
      isCompleted: status === 'Picked Up' || status === 'Delivered',
      isActive: status === 'Picked Up',
      icon: 'cube',
      activeColor: COLORS.statusPickedUp,
    },
    {
      title: 'Delivered',
      subtitle: 'Handover complete at drop-off',
      time: deliveredAt,
      isCompleted: status === 'Delivered',
      isActive: status === 'Delivered',
      icon: 'location',
      activeColor: COLORS.statusDelivered,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>DELIVERY TIMELINE</Text>
      
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        
        // Compute colors/icons based on state
        let circleColor = COLORS.border;
        let iconName = 'ellipse-outline';
        let iconColor = COLORS.textMuted;
        let lineStyleColor = COLORS.border;
        
        if (step.isCompleted) {
          circleColor = step.isActive ? step.activeColor : COLORS.success;
          iconName = step.isActive ? 'arrow-forward-circle' : 'checkmark-circle';
          iconColor = COLORS.white;
          lineStyleColor = COLORS.success;
        } else {
          circleColor = COLORS.border;
          iconName = 'ellipse-outline';
          iconColor = COLORS.textMuted;
          lineStyleColor = COLORS.border;
        }

        return (
          <View key={index} style={styles.stepRow}>
            {/* Left Column: Icons and Connectors */}
            <View style={styles.leftCol}>
              <View style={[
                styles.iconCircle,
                { backgroundColor: step.isCompleted ? circleColor : 'transparent', borderColor: circleColor }
              ]}>
                <Ionicons
                  name={iconName as any}
                  size={step.isCompleted ? 16 : 14}
                  color={step.isCompleted ? iconColor : COLORS.textMuted}
                />
              </View>
              {!isLast && (
                <View style={[
                  styles.connectorLine,
                  { backgroundColor: lineStyleColor, borderStyle: step.isCompleted && !step.isActive ? 'solid' : 'dashed' }
                ]} />
              )}
            </View>

            {/* Right Column: Text Information */}
            <View style={styles.rightCol}>
              <View style={styles.stepHeader}>
                <Text style={[
                  styles.stepTitle,
                  { color: step.isCompleted ? COLORS.white : COLORS.textMuted, fontWeight: step.isActive || step.isCompleted ? '700' : '500' }
                ]}>
                  {step.title}
                </Text>
                {step.time && (
                  <Text style={styles.stepTime}>{step.time}</Text>
                )}
              </View>
              <Text style={styles.stepSubtitle}>{step.subtitle}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 1.5,
    marginBottom: 20,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: 60,
  },
  leftCol: {
    width: 30,
    alignItems: 'center',
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  connectorLine: {
    width: 2,
    flex: 1,
    marginVertical: 4,
  },
  rightCol: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 20,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepTitle: {
    fontSize: 14,
    color: COLORS.white,
  },
  stepSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  stepTime: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
  },
});

export default StepTracker;
