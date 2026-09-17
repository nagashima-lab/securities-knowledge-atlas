(function () {
  const prefix = 'ska';
  const storageKeys = {
    theme: `${prefix}-theme`,
    viewMode: `${prefix}-view-mode`,
    bookmarks: `${prefix}-bookmarks`,
    recentItems: `${prefix}-recent-items`,
    learningProgress: `${prefix}-learning-progress`
  };

  function safeStorage() {
    try {
      const testKey = '__ska_test__';
      localStorage.setItem(testKey, '1');
      localStorage.removeItem(testKey);
      return true;
    } catch (error) {
      return false;
    }
  }

  const available = safeStorage();

  function readJson(key, fallback) {
    if (!available) {
      return fallback;
    }
    try {
      const raw = localStorage.getItem(key);
      if (!raw) {
        return fallback;
      }
      return JSON.parse(raw);
    } catch (error) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    if (!available) {
      return false;
    }
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      return false;
    }
  }

  function removeItem(key) {
    if (!available) {
      return false;
    }
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      return false;
    }
  }

  function readString(key, fallback) {
    if (!available) {
      return fallback;
    }
    try {
      return localStorage.getItem(key) || fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeString(key, value) {
    if (!available) {
      return false;
    }
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      return false;
    }
  }

  window.SKA = window.SKA || {};
  window.SKA.storage = {
    available,
    keys: storageKeys,
    readJson,
    writeJson,
    readString,
    writeString,
    removeItem
  };
})();
