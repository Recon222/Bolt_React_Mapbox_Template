import { useFrameworkStore } from '../store/store';
import type { Map, LngLatBounds, Point } from 'react-map-gl';
import { EventEmitter } from 'events';

type ViewportCalculatorConfig = {
  mapInstance: Map | null;
  containerRef: React.RefObject<HTMLDivElement>;
};

class ViewportManager extends EventEmitter {
  private mapInstance: Map | null = null;
  private containerRef: React.RefObject<HTMLDivElement> | null = null;

  initialize(config: ViewportCalculatorConfig) {
    this.mapInstance = config.mapInstance;
    this.containerRef = config.containerRef;
  }

  // Coordinate transformations
  lngLatToPixel(coords: [number, number]): Point | null {
    if (!this.mapInstance) return null;
    return this.mapInstance.project(coords);
  }

  pixelToLngLat(point: Point): [number, number] | null {
    if (!this.mapInstance) return null;
    return this.mapInstance.unproject([point.x, point.y]);
  }

  // Viewport synchronization
  syncWithMapState() {
    if (!this.mapInstance) return;

    const viewState = this.mapInstance.getMap().getViewState();
    const padding = this.calculateEffectivePadding();

    useFrameworkStore.getState().setViewport({
      ...viewState,
      padding
    });
  }

  // Panel-aware padding calculation
  private calculateEffectivePadding() {
    const { panels } = useFrameworkStore.getState();
    const containerRect = this.containerRef?.current?.getBoundingClientRect();
    
    return Object.values(panels).reduce((acc, panel) => {
      if (panel.state === 'docked') {
        const panelWidth = panel.size.width;
        const panelHeight = panel.size.height;

        return {
          top: panel.position.y === 0 ? acc.top + panelHeight : acc.top,
          bottom: panel.position.y === (containerRect?.height || 0) - panelHeight 
            ? acc.bottom + panelHeight 
            : acc.bottom,
          left: panel.position.x === 0 ? acc.left + panelWidth : acc.left,
          right: panel.position.x === (containerRect?.width || 0) - panelWidth 
            ? acc.right + panelWidth 
            : acc.right
        };
      }
      return acc;
    }, { top: 0, bottom: 0, left: 0, right: 0 });
  }

  // Event handling
  handleMapMove = () => {
    this.syncWithMapState();
    this.emit('viewportChange', useFrameworkStore.getState().viewport);
  };

  handleStoreUpdate = (state: any) => {
    if (this.mapInstance && state.viewport) {
      this.mapInstance.setViewState(state.viewport);
    }
  };
}

export const viewportManager = new ViewportManager();

// Zustand store synchronization
let isUpdatingFromStore = false;

useFrameworkStore.subscribe((state) => {
  if (!isUpdatingFromStore) {
    isUpdatingFromStore = true;
    viewportManager.handleStoreUpdate(state);
    isUpdatingFromStore = false;
  }
});

export type ViewportManagerType = typeof viewportManager;
