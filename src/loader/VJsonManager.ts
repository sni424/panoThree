import type { JsonPaths } from "@/type";

export default class VJsonManager<T extends JsonPaths> {
  #data = new Map<keyof T, unknown>();
  #jsonPaths: T;

  constructor(jsonPaths: T) {
    this.#jsonPaths = jsonPaths;
  }

  static async create<T extends JsonPaths>(
    jsonPaths: T
  ): Promise<VJsonManager<T>> {
    const manager = new VJsonManager<T>(jsonPaths);
    await manager.loadAll();
    return manager;
  }

  async loadAll(): Promise<void> {
    const fetchPromises = Object.entries(this.#jsonPaths).map(
      async ([key, path]) => {
        try {
          const response = await fetch(path);
          if (!response.ok)
            throw new Error(`HTTP error! Status: ${response.status}`);
          const jsonData = await response.json();
          this.#data.set(key, jsonData);
        } catch (error) {
          console.error(`❌ ${key}.json 로드 실패:`, error);
          this.#data.set(key, null);
        }
      }
    );
    await Promise.all(fetchPromises);
  }

  get<K extends keyof T>(key: K): unknown | null {
    if (!this.#data.has(key)) {
      console.warn(`[WARN] 키 "${String(key)}"에 해당하는 데이터가 없습니다.`);
    }
    return this.#data.get(key) ?? null;
  }
}
