import { useEffect } from 'react';
import { useMap } from 'react-map-gl';
import { viewportManager } from '../lib/ViewportManager';
import { useFrameworkStore } from '../store/store';

export const useViewportSync = (containerRef: React.RefObject<HTMLDivElement>) => {
  const { current: map } = useMap();
  
  useEffect(() => {
    if (map) {
      viewportManager.initialize({
        mapInstance: map,
        containerRef
      });

      // Event handlers
      const syncViewport = () => viewportManager.syncWithMapState();
      
      map.on('move', syncViewport);
      map.on('resize', syncViewport);
      map.on('rotate', syncViewport);

      return () => {
        map.off('move', syncViewport);
        map.off('resize', syncViewport);
        map.off('rotate', syncViewport);
      };
    }
  }, [map, containerRef]);

  // Sync store changes to map
  useEffect(() => {
    return useFrameworkStore.subscribe(
      (state) => state.viewport,
      (viewport) => {
        if (map && viewportManager) {
          map.setViewState(viewport);
        }
      },
      { equalityFn: (a, b) => 
        a.latitude === b.latitude &&
        a.longitude === b.longitude &&
        a.zoom === b.zoom &&
        a.pitch === b.pitch &&
        a.bearing === b.bearing
      }
    );
  }, [map]);
};
