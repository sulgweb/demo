export default class LRUCache {
  size = 10;
  cache = new Map();
  storageKey = null;
  constructor({ size, storageKey = null }) {
    if (size) {
      this.size = size;
    }
    if (storageKey) {
      this.storageKey = 'lru_storage_' + storageKey;
      const newList = JSON.parse(localStorage.getItem(this.storageKey));
      if (newList) {
        this.cache = new Map([...newList]);
        return;
      }
    }
    this.cache = new Map();
  }

  // 推送
  put(key, info) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else {
      if (this.cache.size >= this.size) {
        this.cache.delete(this.cache.keys().next().value);
      }
    }
    this.update(key, info);
  }

  // 使用
  get(key) {
    if (this.cache.has(key)) {
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.update(key, value);
      return value;
    }
    return null;
  }

  // 更新
  update(key, value) {
    this.cache.set(key, value);
    if (this.storageKey) {
      const newList = [...this.cache];
      localStorage.setItem(this.storageKey, JSON.stringify(newList));
    }
  }
}
