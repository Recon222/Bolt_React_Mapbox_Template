declare class CompressionStream {
  constructor(format: 'gzip' | 'deflate' | 'deflate-raw');
  readonly readable: ReadableStream<Uint8Array>;
  readonly writable: WritableStream<Uint8Array>;
}

declare class DecompressionStream {
  constructor(format: 'gzip' | 'deflate' | 'deflate-raw');
  readonly readable: ReadableStream<Uint8Array>;
  readonly writable: WritableStream<Uint8Array>;
}
