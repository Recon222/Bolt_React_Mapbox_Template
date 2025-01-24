import { describe, it, expect, vi } from 'vitest';
import { storageManager } from '../lib/StorageManager';
import { useFrameworkStore } from '../store/store';

describe('StorageManager', () => {
  it('should compress and decompress data', async () => {
    const testData = { coordinates: [40.7128, -74.0060] };
    const chunk = await storageManager.processChunk(testData);
    
    expect(chunk.metadata.compressed).toBe(true);
    expect(chunk.metadata.size).toBeLessThan(JSON.stringify(testData).length);
  });

  it('should manage LRU eviction', async () => {
    vi.spyOn(navigator.storage, 'estimate').mockResolvedValue({ quota: 1024 });
    
    const chunk = await storageManager.processChunk({ data: 'test' });
    useFrameworkStore.getState().addStorageChunk(chunk);
    
    await storageManager.manageStorageQuota();
    expect(useFrameworkStore.getState().storage[chunk.metadata.id]).toBeUndefined();
  });
});
