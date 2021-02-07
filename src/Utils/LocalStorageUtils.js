export const LIST_KEYS = {
  SELECTED_FILE: "selected-file"
};
class LocalStorageUtils {
  static setItem(key, value) {
    localStorage.setItem(key, value);
  }
  static getItem(key) {
    return localStorage.getItem(key);
  }
}

export default LocalStorageUtils;
