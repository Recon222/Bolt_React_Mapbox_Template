import { useEffect } from 'react';
import { storageManager } from '../lib/StorageManager';
import { useFrameworkStore } from '../store/store';

export const useStorageInit = () => {
  useEffect(() => {
    const initStorage = async () => {
      storageManager.registerViewportListener();
      await storageManager.manageStorageQuota();
    };

    initStorage();
    return () => {
      // Cleanup listeners
    };
  }, []);
};

export const usePersistentPanels = () => {
  useEffect(() => {
    const savePanels = () => {
      const { panels } = useFrameworkStore.getState();
      storageManager.processChunk(panels)
        .then(chunk => {
          useFrameworkStore.getState().addStorageChunk(chunk);
        });
    };

    window.addEventListener('beforeunload', savePanels);
    return () => window.removeEventListener('beforeunload', savePanels);
  }, []);
};
