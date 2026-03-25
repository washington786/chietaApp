"use strict";
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// node_modules/is-plain-obj/index.js
var require_is_plain_obj = __commonJS({
  "node_modules/is-plain-obj/index.js"(exports2, module2) {
    "use strict";
    module2.exports = (value) => {
      if (Object.prototype.toString.call(value) !== "[object Object]") {
        return false;
      }
      const prototype = Object.getPrototypeOf(value);
      return prototype === null || prototype === Object.prototype;
    };
  }
});

// node_modules/merge-options/index.js
var require_merge_options = __commonJS({
  "node_modules/merge-options/index.js"(exports2, module2) {
    "use strict";
    var isOptionObject = require_is_plain_obj();
    var { hasOwnProperty } = Object.prototype;
    var { propertyIsEnumerable } = Object;
    var defineProperty = (object, name, value) => Object.defineProperty(object, name, {
      value,
      writable: true,
      enumerable: true,
      configurable: true
    });
    var globalThis = exports2;
    var defaultMergeOptions = {
      concatArrays: false,
      ignoreUndefined: false
    };
    var getEnumerableOwnPropertyKeys = (value) => {
      const keys = [];
      for (const key in value) {
        if (hasOwnProperty.call(value, key)) {
          keys.push(key);
        }
      }
      if (Object.getOwnPropertySymbols) {
        const symbols = Object.getOwnPropertySymbols(value);
        for (const symbol of symbols) {
          if (propertyIsEnumerable.call(value, symbol)) {
            keys.push(symbol);
          }
        }
      }
      return keys;
    };
    function clone(value) {
      if (Array.isArray(value)) {
        return cloneArray(value);
      }
      if (isOptionObject(value)) {
        return cloneOptionObject(value);
      }
      return value;
    }
    function cloneArray(array) {
      const result = array.slice(0, 0);
      getEnumerableOwnPropertyKeys(array).forEach((key) => {
        defineProperty(result, key, clone(array[key]));
      });
      return result;
    }
    function cloneOptionObject(object) {
      const result = Object.getPrototypeOf(object) === null ? /* @__PURE__ */ Object.create(null) : {};
      getEnumerableOwnPropertyKeys(object).forEach((key) => {
        defineProperty(result, key, clone(object[key]));
      });
      return result;
    }
    var mergeKeys = (merged, source, keys, config) => {
      keys.forEach((key) => {
        if (typeof source[key] === "undefined" && config.ignoreUndefined) {
          return;
        }
        if (key in merged && merged[key] !== Object.getPrototypeOf(merged)) {
          defineProperty(merged, key, merge(merged[key], source[key], config));
        } else {
          defineProperty(merged, key, clone(source[key]));
        }
      });
      return merged;
    };
    var concatArrays = (merged, source, config) => {
      let result = merged.slice(0, 0);
      let resultIndex = 0;
      [merged, source].forEach((array) => {
        const indices = [];
        for (let k = 0; k < array.length; k++) {
          if (!hasOwnProperty.call(array, k)) {
            continue;
          }
          indices.push(String(k));
          if (array === merged) {
            defineProperty(result, resultIndex++, array[k]);
          } else {
            defineProperty(result, resultIndex++, clone(array[k]));
          }
        }
        result = mergeKeys(result, array, getEnumerableOwnPropertyKeys(array).filter((key) => !indices.includes(key)), config);
      });
      return result;
    };
    function merge(merged, source, config) {
      if (config.concatArrays && Array.isArray(merged) && Array.isArray(source)) {
        return concatArrays(merged, source, config);
      }
      if (!isOptionObject(source) || !isOptionObject(merged)) {
        return clone(source);
      }
      return mergeKeys(merged, source, getEnumerableOwnPropertyKeys(source), config);
    }
    module2.exports = function(...options) {
      const config = merge(clone(defaultMergeOptions), this !== globalThis && this || {}, defaultMergeOptions);
      let merged = { _: {} };
      for (const option of options) {
        if (option === void 0) {
          continue;
        }
        if (!isOptionObject(option)) {
          throw new TypeError("`" + option + "` is not an Option Object");
        }
        merged = merge(merged, { _: option }, config);
      }
      return merged._;
    };
  }
});

// node_modules/@react-native-async-storage/async-storage/lib/commonjs/AsyncStorage.js
var require_AsyncStorage = __commonJS({
  "node_modules/@react-native-async-storage/async-storage/lib/commonjs/AsyncStorage.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.default = void 0;
    var _mergeOptions = _interopRequireDefault2(require_merge_options());
    function _interopRequireDefault2(e) {
      return e && e.__esModule ? e : { default: e };
    }
    var merge = _mergeOptions.default.bind({
      concatArrays: true,
      ignoreUndefined: true
    });
    function mergeLocalStorageItem(key, value) {
      const oldValue = window.localStorage.getItem(key);
      if (oldValue) {
        const oldObject = JSON.parse(oldValue);
        const newObject = JSON.parse(value);
        const nextValue = JSON.stringify(merge(oldObject, newObject));
        window.localStorage.setItem(key, nextValue);
      } else {
        window.localStorage.setItem(key, value);
      }
    }
    function createPromise(getValue, callback) {
      return new Promise((resolve, reject) => {
        try {
          const value = getValue();
          callback?.(null, value);
          resolve(value);
        } catch (err) {
          callback?.(err);
          reject(err);
        }
      });
    }
    function createPromiseAll(promises, callback, processResult) {
      return Promise.all(promises).then((result) => {
        const value = processResult?.(result) ?? null;
        callback?.(null, value);
        return Promise.resolve(value);
      }, (errors) => {
        callback?.(errors);
        return Promise.reject(errors);
      });
    }
    var AsyncStorage = {
      /**
       * Fetches `key` value.
       */
      getItem: (key, callback) => {
        return createPromise(() => window.localStorage.getItem(key), callback);
      },
      /**
       * Sets `value` for `key`.
       */
      setItem: (key, value, callback) => {
        return createPromise(() => window.localStorage.setItem(key, value), callback);
      },
      /**
       * Removes a `key`
       */
      removeItem: (key, callback) => {
        return createPromise(() => window.localStorage.removeItem(key), callback);
      },
      /**
       * Merges existing value with input value, assuming they are stringified JSON.
       */
      mergeItem: (key, value, callback) => {
        return createPromise(() => mergeLocalStorageItem(key, value), callback);
      },
      /**
       * Erases *all* AsyncStorage for the domain.
       */
      clear: (callback) => {
        return createPromise(() => window.localStorage.clear(), callback);
      },
      /**
       * Gets *all* keys known to the app, for all callers, libraries, etc.
       */
      getAllKeys: (callback) => {
        return createPromise(() => {
          const numberOfKeys = window.localStorage.length;
          const keys = [];
          for (let i = 0; i < numberOfKeys; i += 1) {
            const key = window.localStorage.key(i) || "";
            keys.push(key);
          }
          return keys;
        }, callback);
      },
      /**
       * (stub) Flushes any pending requests using a single batch call to get the data.
       */
      flushGetRequests: () => void 0,
      /**
       * multiGet resolves to an array of key-value pair arrays that matches the
       * input format of multiSet.
       *
       *   multiGet(['k1', 'k2']) -> [['k1', 'val1'], ['k2', 'val2']]
       */
      multiGet: (keys, callback) => {
        const promises = keys.map((key) => AsyncStorage.getItem(key));
        const processResult = (result) => result.map((value, i) => [keys[i], value]);
        return createPromiseAll(promises, callback, processResult);
      },
      /**
       * Takes an array of key-value array pairs.
       *   multiSet([['k1', 'val1'], ['k2', 'val2']])
       */
      multiSet: (keyValuePairs, callback) => {
        const promises = keyValuePairs.map((item) => AsyncStorage.setItem(item[0], item[1]));
        return createPromiseAll(promises, callback);
      },
      /**
       * Delete all the keys in the `keys` array.
       */
      multiRemove: (keys, callback) => {
        const promises = keys.map((key) => AsyncStorage.removeItem(key));
        return createPromiseAll(promises, callback);
      },
      /**
       * Takes an array of key-value array pairs and merges them with existing
       * values, assuming they are stringified JSON.
       *
       *   multiMerge([['k1', 'val1'], ['k2', 'val2']])
       */
      multiMerge: (keyValuePairs, callback) => {
        const promises = keyValuePairs.map((item) => AsyncStorage.mergeItem(item[0], item[1]));
        return createPromiseAll(promises, callback);
      }
    };
    var _default2 = exports2.default = AsyncStorage;
  }
});

// node_modules/@react-native-async-storage/async-storage/lib/commonjs/hooks.js
var require_hooks = __commonJS({
  "node_modules/@react-native-async-storage/async-storage/lib/commonjs/hooks.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", {
      value: true
    });
    exports2.useAsyncStorage = useAsyncStorage;
    var _AsyncStorage2 = _interopRequireDefault2(require_AsyncStorage());
    function _interopRequireDefault2(e) {
      return e && e.__esModule ? e : { default: e };
    }
    function useAsyncStorage(key) {
      return {
        getItem: (...args) => _AsyncStorage2.default.getItem(key, ...args),
        setItem: (...args) => _AsyncStorage2.default.setItem(key, ...args),
        mergeItem: (...args) => _AsyncStorage2.default.mergeItem(key, ...args),
        removeItem: (...args) => _AsyncStorage2.default.removeItem(key, ...args)
      };
    }
  }
});

// node_modules/@react-native-async-storage/async-storage/lib/commonjs/index.js
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
Object.defineProperty(exports, "useAsyncStorage", {
  enumerable: true,
  get: function() {
    return _hooks.useAsyncStorage;
  }
});
var _AsyncStorage = _interopRequireDefault(require_AsyncStorage());
var _hooks = require_hooks();
function _interopRequireDefault(e) {
  return e && e.__esModule ? e : { default: e };
}
var _default = exports.default = _AsyncStorage.default;
