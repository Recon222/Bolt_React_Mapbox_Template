export interface ChunkMetadata {
  id: string;
  version: number;
  spatialHash: string;
  bounds: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
  createdAt: number;
  lastAccessed: number;
  size: number;
  compressed: boolean;
  compressionRatio?: number;
}

export interface StorageChunk<T = unknown> {
  data: T;
  metadata: ChunkMetadata;
}
