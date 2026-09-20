import { Ionicons } from '@expo/vector-icons';
import { transitBlueColors } from '@droppd/shared';
import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import type { AppMapMarker, AppMapRegion } from './AppMapView.types';

interface Props {
  region: AppMapRegion;
  markers?: AppMapMarker[];
  style?: StyleProp<ViewStyle>;
}

// react-native-maps has no web implementation. This sibling file (picked by
// Metro for web builds via the .web.tsx extension) never imports it, so the
// real native map component in AppMapView.native.tsx is simply never part of
// the web bundle's module graph.
export function AppMapView({ region, markers = [], style }: Props) {
  return (
    <View style={[styles.webPlaceholder, style]}>
      <Ionicons name="map-outline" size={28} color={transitBlueColors.primary} />
      <Text style={styles.webPlaceholderTitle}>Map preview (iOS / Android only)</Text>
      <Text style={styles.webPlaceholderSubtitle}>
        {region.latitude.toFixed(4)}, {region.longitude.toFixed(4)}
      </Text>
      {markers.map((m, i) => (
        <Text key={i} style={styles.webPlaceholderMarker}>
          • {m.title ?? `Marker ${i + 1}`}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  webPlaceholder: {
    backgroundColor: transitBlueColors.surfaceTint,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    padding: 16,
  },
  webPlaceholderTitle: { fontSize: 12, fontWeight: '700', color: transitBlueColors.textPrimary, marginTop: 4 },
  webPlaceholderSubtitle: { fontSize: 11, color: transitBlueColors.textSecondary },
  webPlaceholderMarker: { fontSize: 11, color: transitBlueColors.textSecondary },
});
