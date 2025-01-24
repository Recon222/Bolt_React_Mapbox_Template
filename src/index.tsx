<!-- Add to main app component -->
import { useStorageInit, usePersistentPanels } from './hooks/useStorage';

function App() {
  useStorageInit();
  usePersistentPanels();
  // ... rest of app
}
