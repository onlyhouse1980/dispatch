import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Animated } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, G, Line, Rect } from 'react-native-svg';
import { JobStatus } from '../data/mockJobs';
import COLORS from '../theme/colors';

interface MockMapProps {
  status: JobStatus;
  pickupAddress: string;
  dropoffAddress: string;
}

export const MockMap: React.FC<MockMapProps> = ({ status, pickupAddress, dropoffAddress }) => {
  // Pulse animation for the driver avatar
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 2,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, [pulseAnim]);

  // Determine driver position based on status
  // ViewBox: 0 0 320 180
  // Pickup: (60, 130)
  // Midpoint: (170, 100)
  // Dropoff: (260, 50)
  let driverX = 60;
  let driverY = 130;
  let statusText = 'Driver at pickup point';

  if (status === 'Picked Up') {
    driverX = 170;
    driverY = 100;
    statusText = 'En route to destination';
  } else if (status === 'Delivered') {
    driverX = 260;
    driverY = 50;
    statusText = 'Package delivered successfully';
  } else if (status === 'Available') {
    statusText = 'Driver pending acceptance';
  }

  return (
    <View style={styles.container}>
      {/* Visual Map Render */}
      <View style={styles.mapFrame}>
        <Svg width="100%" height="100%" viewBox="0 0 320 180">
          <Defs>
            <LinearGradient id="routeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor={COLORS.primary} stopOpacity={0.8} />
              <Stop offset="100%" stopColor={COLORS.success} stopOpacity={0.8} />
            </LinearGradient>
            
            <LinearGradient id="gridGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#0B1325" />
              <Stop offset="100%" stopColor="#06090F" />
            </LinearGradient>
          </Defs>

          {/* Grid Background */}
          <Rect x="0" y="0" width="320" height="180" fill="url(#gridGrad)" rx="12" />

          {/* Street Net (Mock City Grid Lines) */}
          {/* Horizontal Streets */}
          <Line x1="10" y1="30" x2="310" y2="30" stroke="#141E33" strokeWidth="2" />
          <Line x1="10" y1="80" x2="310" y2="80" stroke="#141E33" strokeWidth="2" />
          <Line x1="10" y1="130" x2="310" y2="130" stroke="#141E33" strokeWidth="2" />
          
          {/* Vertical Streets */}
          <Line x1="60" y1="10" x2="60" y2="170" stroke="#141E33" strokeWidth="2" />
          <Line x1="170" y1="10" x2="170" y2="170" stroke="#141E33" strokeWidth="2" />
          <Line x1="260" y1="10" x2="260" y2="170" stroke="#141E33" strokeWidth="2" />
          
          {/* Diagonal Avenues (Mock highway overlays) */}
          <Line x1="10" y1="170" x2="310" y2="20" stroke="#1B2844" strokeWidth="3" opacity={0.6} />
          <Line x1="10" y1="10" x2="310" y2="160" stroke="#1B2844" strokeWidth="3" opacity={0.6} />

          {/* Route path (Bezier curve) */}
          {status !== 'Available' && (
            <Path
              d="M 60 130 Q 140 140 170 100 T 260 50"
              fill="none"
              stroke="url(#routeGrad)"
              strokeWidth="4"
              strokeDasharray="4, 4"
            />
          )}

          {/* Pickup Marker */}
          <G id="pickup-marker">
            <Circle cx="60" cy="130" r="12" fill={COLORS.primary} opacity={0.15} />
            <Circle cx="60" cy="130" r="6" fill={COLORS.primary} />
            <Circle cx="60" cy="130" r="2" fill="#090D16" />
          </G>

          {/* Dropoff Marker */}
          <G id="dropoff-marker">
            <Circle cx="260" cy="50" r="12" fill={COLORS.success} opacity={0.15} />
            <Circle cx="260" cy="50" r="6" fill={COLORS.success} />
            <Circle cx="260" cy="50" r="2" fill="#090D16" />
          </G>

          {/* Driver Avatar (pulsing) */}
          {status !== 'Available' && (
            <G id="driver-marker">
              {/* Outer pulsing ring */}
              <AnimatedCircle
                cx={driverX}
                cy={driverY}
                r={pulseAnim.interpolate({
                  inputRange: [1, 2],
                  outputRange: [7, 18],
                })}
                fill={COLORS.primary}
                opacity={pulseAnim.interpolate({
                  inputRange: [1, 2],
                  outputRange: [0.4, 0],
                })}
              />
              <Circle cx={driverX} cy={driverY} r="8" fill={COLORS.primary} stroke="#FFFFFF" strokeWidth="1.5" />
              <Circle cx={driverX} cy={driverY} r="3" fill="#090D16" />
            </G>
          )}
        </Svg>

        {/* HUD overlay */}
        <View style={styles.hudOverlay}>
          <Text style={styles.hudTitle}>GPS SIMULATOR</Text>
          <Text style={styles.hudSubtitle}>{statusText}</Text>
        </View>

        {/* Map Scale */}
        <View style={styles.scaleContainer}>
          <View style={styles.scaleLine} />
          <Text style={styles.scaleText}>800 m</Text>
        </View>
      </View>

      {/* Map Details Card */}
      <View style={styles.detailsCard}>
        <View style={styles.detailRow}>
          <View style={[styles.indicatorPin, { backgroundColor: COLORS.primary }]} />
          <Text style={styles.addressText} numberOfLines={1}>A: {pickupAddress}</Text>
        </View>
        <View style={[styles.detailRow, { marginTop: 8 }]}>
          <View style={[styles.indicatorPin, { backgroundColor: COLORS.success }]} />
          <Text style={styles.addressText} numberOfLines={1}>B: {dropoffAddress}</Text>
        </View>
      </View>
    </View>
  );
};

// Wrap Circle in Animated components
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 12,
  },
  mapFrame: {
    height: 180,
    width: '100%',
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  hudOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(9, 13, 22, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  hudTitle: {
    fontSize: 8,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 1.5,
  },
  hudSubtitle: {
    fontSize: 10,
    fontWeight: '600',
    color: COLORS.white,
    marginTop: 2,
  },
  scaleContainer: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    alignItems: 'center',
  },
  scaleLine: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.white,
  },
  scaleText: {
    fontSize: 8,
    fontWeight: '700',
    color: COLORS.white,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  detailsCard: {
    backgroundColor: COLORS.cardBackground,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: COLORS.border,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicatorPin: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  addressText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textSecondary,
    flex: 1,
  },
});

export default MockMap;
