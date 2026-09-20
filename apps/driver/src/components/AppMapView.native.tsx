import React from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import type { AppMapMarker, AppMapRegion } from './AppMapView.types';

interface Props {
  region: AppMapRegion;
  markers?: AppMapMarker[];
  style?: StyleProp<ViewStyle>;
}

// Resolved on iOS/Android via Metro's platform-extension convention
// (AppMapView.native.tsx). The .web.tsx sibling never imports
// react-native-maps at all, so Metro's web bundle never has to resolve it —
// a runtime Platform.OS check isn't enough, since Metro statically resolves
// every reachable `require`/`import` when building each platform's bundle,
// regardless of what a runtime branch would skip.
export function AppMapView({ region, markers = [], style }: Props) {
  return (
    <MapView provider={PROVIDER_GOOGLE} style={[StyleSheet.absoluteFill, style]} initialRegion={region} region={region}>
      {markers.map((m, i) => (
        <Marker key={i} coordinate={m.coordinate} pinColor={m.pinColor} title={m.title} />
      ))}
    </MapView>
  );
}
