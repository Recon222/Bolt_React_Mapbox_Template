export const calculatePanelPosition = (
  viewport: any,
  panelSize: { width: number; height: number },
  containerSize: { width: number; height: number }
): { x: number; y: number } => {
  // Convert viewport center to pixel coordinates
  const centerPixel = viewportManager.lngLatToPixel([
    viewport.longitude, 
    viewport.latitude
  ]);

  if (!centerPixel) return { x: 0, y: 0 };

  // Calculate centered position accounting for panel size
  return {
    x: (containerSize.width - panelSize.width) / 2,
    y: (containerSize.height - panelSize.height) / 2
  };
};

export const getVisibleBounds = (): LngLatBounds | null => {
  if (!viewportManager.mapInstance) return null;
  
  return viewportManager.mapInstance.getBounds();
};
