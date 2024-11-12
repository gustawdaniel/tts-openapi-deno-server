export abstract class StorageAdapter {
  abstract get(key: string): Promise<Response | undefined>;
  abstract set(key: string, value: Uint8Array): Promise<Response>;
}
