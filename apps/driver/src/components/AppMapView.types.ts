export interface AppMapMarker {
  coordinate: { latitude: number; longitude: number };
  pinColor?: string;
  title?: string;
}

export interface AppMapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}
