
simple-reactive-component
js

---
function Component(rootElement, initialState, template) {
  function reactive(obj) {
    if (Array.isArray(obj)) {
      return new Proxy(obj, arrayHandler);
    } else if (obj instanceof Set) {
      return new Proxy(obj, setHandler);
    } else if (obj instanceof Map) {
      return new Proxy(obj, mapHandler);
    } else if (typeof obj === "object" && obj !== null) {
      return new Proxy(obj, objectHandler);
    } else {
      return obj;
    }
  }

  const objectHandler = {
    get(target, prop) {
      if (typeof target[prop] === "function" && prop !== "constructor") {
        return target[prop].bind(target);
      }
      return reactive(target[prop]);
    },
    set(target, prop, value) {
      target[prop] = value;
      update();
      return true;
    }
  };

  const arrayHandler = {
    get(target, prop) {
      if (prop in target) {
        return reactive(target[prop]);
      }
      return undefined;
    },
    set(target, prop, value) {
      target[prop] = value;
      update();
      return true;
    }
  };

  const setHandler = {
    get(target, prop) {
      if (prop === "add") {
        return function(value) {
          let result = target[prop].call(target, value);
          update();
          return result;
        };
      } else if (prop === "delete") {
        return function(value) {
          let result = target[prop].call(target, value);
          update();
          return result;
        };
      }
      return target[prop];
    }
  };

  const mapHandler = {
    get(target, prop) {
      if (prop === "set") {
        return function(key, value) {
          let result = target[prop].call(target, key, value);
          update();
          return result;
        };
      } else if (prop === "delete") {
        return function(key) {
          let result = target[prop].call(target, key);
          update();
          return result;
        };
      }
      return target[prop];
    }
  };

  const state = reactive(initialState);

  function createElement(tagName, cssClass, attributes, children) {
    let el = document.createElement(tagName);

    if (attributes) {
      for (let key in attributes) {
        let value = attributes[key];
        el.setAttribute(key, value);
      }
    }

    if (cssClass) {
      el.classList = cssClass.split(' ');
    }

    if (children) {
      for (let child of children) {
        if (child instanceof Node) {
          el.append(child);
        } else {
          el.append(document.createTextNode(child));
        }
      }
    }

    return el;
  }

  function el(selector, ...children) {
    const {
      tagName,
      id,
      classes,
      attributes
    } = parseCSSSelector(selector);
    if (id) {
      attributes.id = id;
    }
    const cssClass = classes.length ? classes.join(' ') : null;
    return createElement(tagName, cssClass, attributes, children);
  }

  function parseCSSSelector(selector) {
    const result = {
      tagName: null,
      id: null,
      classes: [],
      attributes: []
    };

    const tagPattern = /^[a-zA-Z][a-zA-Z0-9-]*/;
    const idPattern = /#([a-zA-Z][a-zA-Z0-9-_]*)/;
    const classPattern = /\.([a-zA-Z0-9-_:\[\]#]+(\[[^\]]+\])?)/g;
    const attrPattern = /(?=[^.])\[([a-zA-Z0-9-_]+)(?:=("[^"]*"|'[^']*'|[^\]]+))?\]/g;

    const tagMatch = selector.match(tagPattern);
    if (tagMatch) {
      result.tagName = tagMatch[0];
      selector = selector.slice(tagMatch[0].length);
    }

    const idMatch = selector.match(idPattern);
    if (idMatch) {
      result.id = idMatch[1];
      selector = selector.replace(idPattern, '');
    }

    let classMatch;
    while ((classMatch = classPattern.exec(selector)) !== null) {
      result.classes.push(classMatch[1]);
    }
    selector = selector.replace(classPattern, '');

    let attrMatch;
    while ((attrMatch = attrPattern.exec(selector)) !== null) {
      let attributeValue = attrMatch[2] ? attrMatch[2].slice(1, -1) : attrMatch[2];
      result.attributes[attrMatch[1]] = attributeValue;
    }

    return result;
  }

  function render() {
    rootElement.innerHTML = ''; // Clear previous content
    const element = template(state, el);
    rootElement.append(element);
  }

  function update() {
    render();
  }

  render(); // Initial render

  return {
    state
  };
}
