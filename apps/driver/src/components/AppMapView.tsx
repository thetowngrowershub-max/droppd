// Metro resolves `./AppMapView` to AppMapView.native.tsx (iOS/Android, real
// react-native-maps) or AppMapView.web.tsx (browser placeholder) before ever
// considering this file — Metro's platform-extension resolution always
// prefers a `.native`/`.web` sibling over the bare file. TypeScript's
// resolver doesn't know that convention, though, so this plain file exists
// purely to give `tsc` something to resolve; pick either sibling's shape,
// it's never actually bundled for a real target platform.
export * from './AppMapView.web';
