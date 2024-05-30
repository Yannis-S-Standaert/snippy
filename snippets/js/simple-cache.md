
simple-cache
js

---
function createCache(expirationTimeMs = 60000) {
  const cache = new Map();

  function set(key, value) {
    const expiry = Date.now() + expirationTimeMs;
    cache.set(key, { value, expiry });
  }

  function get(key) {
    const cached = cache.get(key);
    if (!cached) return null;

    if (Date.now() > cached.expiry) {
      cache.delete(key);
      return null;
    }
    
    return cached.value;
  }

  function clear() {
    cache.clear();
  }

  return { set, get, clear };
}

// Usage example:
const cache = createCache(5000); // items expire in 5 seconds

cache.set('foo', 'bar');
console.log(cache.get('foo')); // 'bar'
setTimeout(() => console.log(cache.get('foo')), 6000); // null after expiration
