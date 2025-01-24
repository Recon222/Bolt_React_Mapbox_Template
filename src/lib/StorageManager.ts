import { useFrameworkStore } from '../store/store';
import { viewportManager } from './ViewportManager';
import { ChunkMetadata, StorageChunk } from '../types/storage';

const CHUNK_SIZE = 100 * 1024; // 100KB
const LRU_THRESHOLD = 0.9; // 90% of quota
const COMPRESSION_FORMAT = 'gzip' as const;

class StorageManager {
  private encoder = new TextEncoder();
  private decoder = new TextDecoder();
  
  async processChunk<T>(data: T): Promise<StorageChunk<T>> {
    const { compressedData, compressionRatio } = await this.compressData(data);
    const bounds = viewportManager.getVisibleBounds()?.toArray().flat() as [number, number, number, number];
    
    const metadata: ChunkMetadata = {
      id: crypto.randomUUID(),
      version: 1,
      spatialHash: this.generateSpatialHash(bounds),
      bounds,
      createdAt: Date.now(),
      lastAccessed: Date.now(),
      size: compressedData.byteLength,
      compressed: true,
      compressionRatio
    };

    return { data, metadata };
  }

  private generateSpatialHash(bounds: [number, number, number, number]): string {
    const precision = 3;
    return bounds.map(n => n.toFixed(precision)).join('-');
  }

  private async compressData<T>(data: T): Promise<{ 
    compressedData: Uint8Array;
    compressionRatio: number 
  }> {
    const jsonString = JSON.stringify(data);
    const inputBuffer = this.encoder.encode(jsonString);
    
    const cs = new CompressionStream(COMPRESSION_FORMAT);
    const writer = cs.writable.getWriter();
    writer.write(inputBuffer);
    writer.close();

    const compressedBuffer = await new Response(cs.readable).arrayBuffer();
    const compressedData = new Uint8Array(compressedBuffer);
    
    return {
      compressedData,
      compressionRatio: compressedData.byteLength / inputBuffer.byteLength
    };
  }

  async decompressData<T>(compressedData: Uint8Array): Promise<T> {
    const cs = new DecompressionStream(COMPRESSION_FORMAT);
    const writer = cs.writable.getWriter();
    writer.write(compressedData);
    writer.close();

    const decompressedBuffer = await new Response(cs.readable).arrayBuffer();
    return JSON.parse(this.decoder.decode(decompressedBuffer));
  }

  async manageStorageQuota() {
    const { storage, purgeStorage } = useFrameworkStore.getState();
    const chunks = Object.values(storage);
    
    const totalSize = chunks.reduce((sum, chunk) => sum + chunk.metadata.size, 0);
    const quota = navigator.storage?.estimate().then(estimate => estimate.quota || 5 * 1024 * 1024);
    
    if (totalSize > (await quota) * LRU_THRESHOLD) {
      const lruChunks = chunks.sort((a, b) => 
        a.metadata.lastAccessed - b.metadata.lastAccessed
      );
      
      purgeStorage(Date.now() - (1000 * 60 * 60 * 24 * 7)); // 1 week retention
      lruChunks.slice(0, Math.floor(lruChunks.length * 0.1)).forEach(chunk => 
        this.deleteChunk(chunk.metadata.id)
      );
    }
  }

  private deleteChunk(id: string) {
    useFrameworkStore.setState(state => {
      const { [id]: _, ...remaining } = state.storage;
      return { storage: remaining };
    });
  }

  registerViewportListener() {
    viewportManager.on('viewportChange', (viewport) => {
      const bounds = viewportManager.getVisibleBounds();
      if (bounds) {
        this.loadViewportChunks(bounds);
      }
    });
  }

  private loadViewportChunks(bounds: LngLatBounds) {
    const { storage } = useFrameworkStore.getState();
    const visibleChunks = Object.values(storage).filter(chunk => 
      this.chunkIntersectsViewport(chunk.metadata.bounds, bounds)
    );

    visibleChunks.forEach(chunk => {
      useFrameworkStore.getState().accessStorageChunk(chunk.metadata.id);
    });
  }

  private chunkIntersectsViewport(
    chunkBounds: [number, number, number, number],
    viewportBounds: LngLatBounds
  ): boolean {
    const [chunkWest, chunkSouth, chunkEast, chunkNorth] = chunkBounds;
    return viewportBounds.overlaps([
      [chunkWest, chunkSouth],
      [chunkEast, chunkNorth]
    ]);
  }
}

export const storageManager = new StorageManager();

// Background cleanup
setInterval(() => storageManager.manageStorageQuota(), 1000 * 60 * 5); // 5 minutes
