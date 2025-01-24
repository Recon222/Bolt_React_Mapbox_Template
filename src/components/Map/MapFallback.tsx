export const MapFallback = () => (
  <div className="map-container bg-map-muted flex items-center justify-center">
    <div className="text-center p-8">
      <h2 className="text-xl font-bold mb-4">WebGL Not Supported</h2>
      <p className="text-map-secondary">
        Please enable WebGL in your browser settings or update your graphics drivers.
      </p>
    </div>
  </div>
)
