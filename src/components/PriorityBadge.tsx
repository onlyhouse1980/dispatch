import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { JobPriority } from '../data/mockJobs';
import COLORS from '../theme/colors';

interface PriorityBadgeProps {
  priority: JobPriority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  let badgeColor = COLORS.priorityStandard;
  let bgGlow = 'rgba(0, 229, 255, 0.1)';
  
  if (priority === 'Express') {
    badgeColor = COLORS.priorityExpress;
    bgGlow = 'rgba(244, 63, 94, 0.1)';
  } else if (priority === 'Same-day') {
    badgeColor = COLORS.prioritySameDay;
    bgGlow = 'rgba(245, 158, 11, 0.1)';
  }

  return (
    <View style={[styles.container, { borderColor: badgeColor, backgroundColor: bgGlow }]}>
      <Text style={[styles.text, { color: badgeColor }]}>{priority.toUpperCase()}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
});

export default PriorityBadge;
