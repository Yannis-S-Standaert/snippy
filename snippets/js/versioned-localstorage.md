
versioned-localstorage
js

---
function StorageManager(key, maxVersions = 5) {
  const storageKey = `${key}_versions`;

  const _getVersions = () => JSON.parse(localStorage.getItem(storageKey)) || [];

  const _saveVersions = (versions) => localStorage.setItem(storageKey, JSON.stringify(versions));

  const _initialize = () => {
    if (!_getVersions().length) {
      _saveVersions([]);
    }
  };

  const save = (obj) => {
    const versions = _getVersions();
    const timestamp = Date.now();
    const versionedKey = `${key}_v${timestamp}`;
    versions.push(versionedKey);

    // Remove old versions if maxVersions exceeded
    if (versions.length > maxVersions) {
      const removedKey = versions.shift();
      localStorage.removeItem(removedKey);
    }

    _saveVersions(versions);
    localStorage.setItem(versionedKey, JSON.stringify(obj));
  };

  const retrieve = (version = 0) => {
    const versions = _getVersions();
    if (versions.length > version) {
      const versionedKey = versions[versions.length - 1 - version];
      return JSON.parse(localStorage.getItem(versionedKey));
    }
    return null;
  };

  // Immediately initialize
  _initialize();

  // Return the public methods
  return {
    save,
    retrieve
  };
}

// Usage example:
const storage = StorageManager('myObject');

// Save objects with delays
const saveWithDelay = (obj, delay) => {
  setTimeout(() => storage.save(obj), delay);
};

saveWithDelay({ value: 1 }, 0);
saveWithDelay({ value: 2 }, 100);
saveWithDelay({ value: 3 }, 200);
saveWithDelay({ value: 4 }, 300);
saveWithDelay({ value: 5 }, 400);
saveWithDelay({ value: 6 }, 500); // triggers removal of the oldest version

// Retrieve the latest version after all saves
setTimeout(() => {
  console.log(storage.retrieve());    // { value: 6 }
  console.log(storage.retrieve(1));   // { value: 5 }
  console.log(storage.retrieve(4));   // { value: 2 }
}, 1000); // ensuring all previous setTimeouts have executed
