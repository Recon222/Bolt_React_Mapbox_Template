export class WebGLResourceManager {
  private static instance: WebGLResourceManager
  private textures = new Map<string, WebGLTexture>()
  private buffers = new Map<string, WebGLBuffer>()
  private registry: FinalizationRegistry<string>

  private constructor() {
    this.registry = new FinalizationRegistry((id: string) => {
      this.deleteTexture(id)
      this.deleteBuffer(id)
    })
  }

  static getInstance(): WebGLResourceManager {
    if (!WebGLResourceManager.instance) {
      WebGLResourceManager.instance = new WebGLResourceManager()
    }
    return WebGLResourceManager.instance
  }

  trackTexture(id: string, texture: WebGLTexture) {
    this.textures.set(id, texture)
    this.registry.register(texture, id)
  }

  trackBuffer(id: string, buffer: WebGLBuffer) {
    this.buffers.set(id, buffer)
    this.registry.register(buffer, id)
  }

  deleteTexture(id: string) {
    const texture = this.textures.get(id)
    if (texture) {
      const gl = this.getGLContext()
      gl?.deleteTexture(texture)
      this.textures.delete(id)
    }
  }

  deleteBuffer(id: string) {
    const buffer = this.buffers.get(id)
    if (buffer) {
      const gl = this.getGLContext()
      gl?.deleteBuffer(buffer)
      this.buffers.delete(id)
    }
  }

  clearResources() {
    this.textures.forEach((_, id) => this.deleteTexture(id))
    this.buffers.forEach((_, id) => this.deleteBuffer(id))
  }

  private getGLContext(): WebGLRenderingContext | null {
    const canvas = document.querySelector('.mapboxgl-canvas')
    return canvas ? canvas.getContext('webgl') : null
  }
}
