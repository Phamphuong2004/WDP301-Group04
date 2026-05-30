// This file is intentionally blank — screen is no longer used.
// All navigation is handled via the 5-tab layout.
import { Redirect } from 'expo-router';
export default function ExploreRedirect() {
  return <Redirect href="/(tabs)" />;
}
