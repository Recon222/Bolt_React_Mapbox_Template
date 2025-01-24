// Core state interfaces
export interface ViewportState {
  latitude: number;
  longitude: number;
  zoom: number;
  bearing: number;
  pitch: number;
  padding: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

export interface StorageChunk {
  id: string;
  data: unknown;
  timestamp: number;
}

export interface MarkerState {
  id: string;
  type: string;
  coordinates: [number, number];
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface PanelState {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  state: 'docked' | 'floating' | 'minimized';
}
