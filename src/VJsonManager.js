export default class VJsonManager {
  #data = new Map();
  #jsonPaths;

  constructor(jsonPaths) {
    this.#jsonPaths = jsonPaths;
  }

  static async create(jsonPaths) {
    const manager = new VJsonManager(jsonPaths);
    await manager.loadAll();
    return manager;
  }

  async loadAll() {
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

  get(key) {
    if (!this.#data.has(key)) {
      console.warn(`[WARN] 키 "${key}"에 해당하는 데이터가 없습니다.`);
    }
    return this.#data.get(key);
  }
}
