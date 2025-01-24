import { useEffect } from 'react'
import { useFrameworkStore } from '@/store/store'
import { WebGLResourceManager } from '@/lib/webgl/ResourceManager'

export const useWebGLMemory = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      const { memoryThreshold } = useFrameworkStore.getState()
      const manager = WebGLResourceManager.getInstance()
      
      // Check memory pressure
      if (performance.memory) {
        const usedJSHeap = performance.memory.usedJSHeapSize
        const totalJSHeap = performance.memory.totalJSHeapSize
        if (usedJSHeap / totalJSHeap > memoryThreshold) {
          manager.clearResources()
        }
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])
}
