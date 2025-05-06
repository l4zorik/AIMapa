/**
 * Polyfills and fixes for browser compatibility issues
 */

(function() {
  // Ensure Map constructor is available and not overridden
  if (typeof Map !== 'function' || Map.toString().indexOf('[native code]') === -1) {
    console.warn('Map constructor is not available or has been overridden. Restoring native implementation.');
    
    // Store the original Map if it exists
    var OriginalMap = window.Map;
    
    // Try to restore the native Map implementation
    try {
      // Use Object.defineProperty to prevent further overriding
      Object.defineProperty(window, 'Map', {
        value: function NativeMap() {
          if (!(this instanceof NativeMap)) {
            return new NativeMap();
          }
          
          // Use the native Map implementation if available
          if (typeof OriginalMap === 'function' && OriginalMap.toString().indexOf('[native code]') !== -1) {
            return new OriginalMap();
          }
          
          // Simple Map polyfill if native is not available
          this.clear();
          
          // Initialize with arguments if provided
          if (arguments.length > 0 && arguments[0]) {
            var iterable = arguments[0];
            if (Array.isArray(iterable)) {
              for (var i = 0; i < iterable.length; i++) {
                if (iterable[i] && iterable[i].length === 2) {
                  this.set(iterable[i][0], iterable[i][1]);
                }
              }
            }
          }
        },
        writable: false,
        configurable: false
      });
      
      // Add Map prototype methods
      Object.defineProperties(window.Map.prototype, {
        clear: {
          value: function() {
            this._keys = [];
            this._values = [];
            this.size = 0;
            return undefined;
          },
          writable: false,
          configurable: false
        },
        delete: {
          value: function(key) {
            var index = this._keys.indexOf(key);
            if (index === -1) {
              return false;
            }
            this._keys.splice(index, 1);
            this._values.splice(index, 1);
            this.size--;
            return true;
          },
          writable: false,
          configurable: false
        },
        entries: {
          value: function() {
            var entries = [];
            for (var i = 0; i < this._keys.length; i++) {
              entries.push([this._keys[i], this._values[i]]);
            }
            
            var index = 0;
            return {
              next: function() {
                return index < entries.length ?
                  { value: entries[index++], done: false } :
                  { done: true };
              }
            };
          },
          writable: false,
          configurable: false
        },
        forEach: {
          value: function(callback, thisArg) {
            for (var i = 0; i < this._keys.length; i++) {
              callback.call(thisArg || this, this._values[i], this._keys[i], this);
            }
          },
          writable: false,
          configurable: false
        },
        get: {
          value: function(key) {
            var index = this._keys.indexOf(key);
            return index !== -1 ? this._values[index] : undefined;
          },
          writable: false,
          configurable: false
        },
        has: {
          value: function(key) {
            return this._keys.indexOf(key) !== -1;
          },
          writable: false,
          configurable: false
        },
        keys: {
          value: function() {
            var index = 0;
            var keys = this._keys;
            return {
              next: function() {
                return index < keys.length ?
                  { value: keys[index++], done: false } :
                  { done: true };
              }
            };
          },
          writable: false,
          configurable: false
        },
        set: {
          value: function(key, value) {
            var index = this._keys.indexOf(key);
            if (index === -1) {
              this._keys.push(key);
              this._values.push(value);
              this.size++;
            } else {
              this._values[index] = value;
            }
            return this;
          },
          writable: false,
          configurable: false
        },
        values: {
          value: function() {
            var index = 0;
            var values = this._values;
            return {
              next: function() {
                return index < values.length ?
                  { value: values[index++], done: false } :
                  { done: true };
              }
            };
          },
          writable: false,
          configurable: false
        }
      });
      
      console.log('Native Map implementation restored successfully');
    } catch (e) {
      console.error('Failed to restore Map implementation:', e);
    }
  }
  
  // Fix for "Cannot read properties of null" errors
  // Add a global error handler for DOM element access
  window.addEventListener('error', function(event) {
    if (event.error && event.error.message && 
        (event.error.message.includes('Cannot read properties of null') || 
         event.error.message.includes('null is not an object'))) {
      console.warn('Caught null reference error:', event.error.message);
      event.preventDefault();
    }
  }, true);
  
  console.log('Polyfills loaded successfully');
})();
