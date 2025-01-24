import { useState, useEffect, useRef } from 'react'
import Map, {
  NavigationControl,
  ScaleControl,
  MapProvider,
  useMap
} from 'react-map-gl'
import { useFrameworkStore } from '@/store/store'
import { WebGLResourceManager } from '@/lib/webgl/ResourceManager'
import { MapFallback } from './MapFallback'

const MAP_STYLE = 'mapbox://styles/mapbox/streets-v12'

export const MapCore = () => {
  const { setViewport } = useFrameworkStore()
  const mapRef = useRef<any>(null)
  const [webglSupported, setWebglSupported] = useState(true)

  useEffect(() => {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')
    setWebglSupported(!!gl)
  }, [])

  const handleMove = (evt: any) => {
    setViewport({
      latitude: evt.viewState.latitude,
      longitude: evt.viewState.longitude,
      zoom: evt.viewState.zoom,
      bearing: evt.viewState.bearing,
      pitch: evt.viewState.pitch
    })
  }

  if (!webglSupported) return <MapFallback />

  return (
    <MapProvider>
      <Map
        ref={mapRef}
        initialViewState={useFrameworkStore.getState().viewport}
        mapStyle={MAP_STYLE}
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
        onMove={handleMove}
        reuseMaps
        optimizeForTerrain
        trackState
      >
        <WebGLResourceTracker />
        <NavigationControl position="top-left" showCompass={false} />
        <ScaleControl position="bottom-left" />
      </Map>
    </MapProvider>
  )
}

const WebGLResourceTracker = () => {
  const { current: map } = useMap()
  const resourceManager = WebGLResourceManager.getInstance()

  useEffect(() => {
    if (!map) return

    const handleContextLost = () => {
      resourceManager.clearResources()
      map.getMap().triggerRepaint()
    }

    const mapInstance = map.getMap()
    mapInstance.on('webglcontextlost', handleContextLost)
    
    return () => {
      mapInstance.off('webglcontextlost', handleContextLost)
    }
  }, [map, resourceManager])

  return null
}
