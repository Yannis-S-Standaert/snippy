
deep-watch
js
name:watcher,name:target
---
class @:name:Watcher:@ {
  constructor(@:name:target:@) {
    this.target = this._deepProxy(@:name:target:@);
    this._listeners = {};
  }

  _deepProxy(obj, path = '') {
    const handler = {
      set: (target, property, value) => {
        const oldValue = target[property];
        target[property] = value && typeof value === 'object' ? this._deepProxy(value, this._concatPath(path, property)) : value;

        if (!Array.isArray(target) || property !== 'length') {
          const currentPath = this._concatPath(path, property);
          this._trigger('change', currentPath, value, oldValue);
          this._bubbleTrigger('change', currentPath, value, oldValue);
        }
        return true;
      },
      deleteProperty: (target, property) => {
        const oldValue = target[property];
        delete target[property];
        const currentPath = this._concatPath(path, property);
        this._trigger('delete', currentPath, oldValue);
        this._bubbleTrigger('delete', currentPath, oldValue);
        return true;
      }
    };

    if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
      Object.keys(obj).forEach(key => {
        obj[key] = this._deepProxy(obj[key], this._concatPath(path, key));
      });
    }

    return new Proxy(obj, handler);
  }

  _concatPath(path, property) {
    return path ? `${path}.${property}` : property.toString();
  }

  on(event, propertyPath, listener) {
    if (!this._listeners[event]) {
      this._listeners[event] = [];
    }
    this._listeners[event].push({ propertyPath, listener });
  }

  _trigger(event, path, newValue, oldValue) {
    if (this._listeners[event]) {
      this._listeners[event].forEach(({ propertyPath, listener }) => {
        if (path === propertyPath) {
          listener(newValue, oldValue);
        }
      });
    }
  }

  _bubbleTrigger(event, path, newValue, oldValue) {
    const parts = path.split('.');
    while (parts.length) {
      parts.pop();
      this._trigger(event, parts.join('.'), newValue, oldValue);
    }
  }
}

function @:name:watcher:@(object) {
  return new @:name:Watcher:@(object);
}

// Usage example:
const myObject = { item1: { list: [0, 1, 2, 3] } };
const myWatchedObject = @:name:watcher:@(myObject);
myWatchedObject.on('change', 'item1.list', (newValue, oldValue) => console.log(`list changed: ${newValue}`));
myWatchedObject.on('change', 'item1', (newValue, oldValue) => console.log(`item1 changed: ${newValue}`));

// Trigger changes
myWatchedObject.target.item1.list.push(5); // should trigger both listeners
