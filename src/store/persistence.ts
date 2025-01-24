import { migrate } from 'zustand/middleware';
import { StorageChunk } from '../types/store';

type Migration = (oldState: any) => any;

const storageMigrations: Record<string, Migration> = {
  '0.1': (state) => ({
    ...state,
    viewport: {
      ...state.viewport,
      padding: state.viewport.padding || { top: 0, bottom: 0, left: 0, right: 0 }
    }
  })
};

const createMigrations = () => ({
  version: 1,
  migrate: persist<migration>(async (oldState, version) => {
    let migratedState = oldState;
    
    for (let v = version; v < 1; v++) {
      const migration = storageMigrations[`${v}.${v+1}`];
      if (migration) {
        migratedState = await migration(migratedState);
      }
    }
    
    return migratedState;
  })
});

const handleStorageError = (error: unknown) => {
  console.error('Storage Error:', error);
  if (error instanceof DOMException && error.name === 'QuotaExceededError') {
    window.alert('Storage limit exceeded. Some data may not be saved.');
  }
};

export { createMigrations, handleStorageError };
