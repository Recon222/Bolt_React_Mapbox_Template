import { describe, it, expect, beforeEach } from 'vitest';
import { useFrameworkStore } from '../store/store';

describe('Framework Store', () => {
  beforeEach(() => {
    localStorage.clear();
    useFrameworkStore.setState({
      viewport: {
        latitude: 0,
        longitude: 0,
        zoom: 1,
        bearing: 0,
        pitch: 0,
        padding: { top: 0, bottom: 0, left: 0, right: 0 }
      },
      panels: {},
      markers: {},
      storage: {}
    });
  });

  it('should update viewport correctly', () => {
    const newViewport = { latitude: 40.7128, longitude: -74.0060 };
    useFrameworkStore.getState().setViewport(newViewport);
    
    expect(useFrameworkStore.getState().viewport.latitude)
      .toBe(40.7128);
  });

  it('should handle storage chunks', () => {
    const chunk = {
      id: 'test',
      data: { foo: 'bar' },
      timestamp: Date.now()
    };
    
    useFrameworkStore.getState().addStorageChunk(chunk);
    expect(useFrameworkStore.getState().storage['test']).toBeTruthy();
  });
});
