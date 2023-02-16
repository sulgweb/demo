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
      console.log(newList);
      if (newList) {
        this.cache = new Map([...newList]);
        console.log(this.cache);
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
    console.log(this.cache);
    if (this.storageKey) {
      const newList = [...this.cache];
      console.log(newList);
      localStorage.setItem(this.storageKey, JSON.stringify(newList));
    }
  }
}
