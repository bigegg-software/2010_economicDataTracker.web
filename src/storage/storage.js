let storage = window.sessionStorage;
export default {
  setItem(key, value) {
    storage.setItem(key, JSON.stringify(value))
  },
  getItem(key) {
    return JSON.parse(storage.getItem(key))
  },
  removeItem(key) {
    storage.removeItem(key)
  },
  clear(){
    storage.clear();
  }
}
