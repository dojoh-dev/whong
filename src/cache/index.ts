class Cache {
  private _cache: Map<string, string>;

  constructor() {
    this._cache = new Map();
  }

  set(key: string, value: string) {
    this._cache.set(key, value);
  }

  get(key: string): string | undefined {
    console.debug("Cache Hit!", key);
    return this._cache.get(key);
  }

  has(key: string): boolean {
    return this._cache.has(key);
  }

  delete(key: string) {
    this._cache.delete(key);
  }

  clear() {
    this._cache.clear();
  }
}

export default new Cache();
