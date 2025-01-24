import { describe, it, expect, beforeEach } from 'vitest';
import { ViewportManager } from '../lib/ViewportManager';
import { useFrameworkStore } from '../store/store';

describe('ViewportManager', () => {
  let manager: ViewportManager;

  beforeEach(() => {
    manager = new ViewportManager();
    useFrameworkStore.setState({
      viewport: {
        latitude: 40.7128,
        longitude: -74.0060,
        zoom: 12,
        bearing: 0,
        pitch: 0,
        padding: { top: 0, bottom: 0, left: 0, right: 0 }
      }
    });
  });

  it('should calculate pixel coordinates', () => {
    // Mock map project method
    const mockProject = vi.fn(() => ({ x: 100, y: 200 }));
    manager.initialize({
      mapInstance: { project: mockProject } as any,
      containerRef: { current: null }
    });
    
    const result = manager.lngLatToPixel([40.7128, -74.0060]);
    expect(result).toEqual({ x: 100, y: 200 });
  });

  it('should sync store and map viewport', () => {
    const mockSetViewState = vi.fn();
    manager.initialize({
      mapInstance: { setViewState: mockSetViewState } as any,
      containerRef: { current: null }
    });
    
    useFrameworkStore.getState().setViewport({ zoom: 14 });
    expect(mockSetViewState).toHaveBeenCalled();
  });
});
