(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("cellx"));
	else if(typeof define === 'function' && define.amd)
		define(["cellx"], factory);
	else if(typeof exports === 'object')
		exports["cellx-indexed-collections"] = factory(require("cellx"));
	else
		root["cellx-indexed-collections"] = factory(root["cellx"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var IndexedCollectionMixin = __webpack_require__(1);
	var IndexedMap = __webpack_require__(3);
	var IndexedList = __webpack_require__(4);

	module.exports = {
		IndexedCollectionMixin: IndexedCollectionMixin,
		IndexedMap: IndexedMap,
		IndexedList: IndexedList
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(2);

	var ObservableCollectionMixin = _require.ObservableCollectionMixin;
	var Map = _require.js.Map;
	var nextUID = _require.utils.nextUID;
	var _ObservableCollection = ObservableCollectionMixin.prototype;
	var _registerValue2 = _ObservableCollection._registerValue;
	var _unregisterValue2 = _ObservableCollection._unregisterValue;


	var IndexedCollectionMixin = ObservableCollectionMixin.extend({
		constructor: function IndexedCollectionMixin(opts) {
			this._indexesConfig = opts && opts.indexes ? opts.indexes.map(function (indexConfig) {
				return typeof indexConfig == 'string' ? { keyName: indexConfig } : indexConfig;
			}) : [{ keyName: 'id', keyGenerator: nextUID }];

			this._indexes = Object.create(null);
		},

		/**
	  * @override
	  */
		_registerValue: function _registerValue(value) {
			if (value === Object(value)) {
				var indexesConfig = this._indexesConfig;
				var indexes = this._indexes;

				for (var i = indexesConfig.length; i;) {
					var indexConfig = indexesConfig[--i];
					var keyName = indexConfig.keyName;
					var index = indexes[keyName] || (indexes[keyName] = new Map());
					var key = value[keyName];

					if (key == null) {
						var keyGenerator = indexConfig.keyGenerator;

						if (keyGenerator) {
							do {
								key = keyGenerator();
							} while (index.has(key));

							Object.defineProperty(value, keyName, {
								configurable: false,
								enumerable: false,
								writable: false,
								value: key
							});
						}
					}

					if (key != null) {
						var items = index.get(key);

						if (items) {
							items.push(value);
						} else {
							index.set(key, [value]);
						}
					}
				}
			}

			_registerValue2.call(this, value);
		},


		/**
	  * @override
	  */
		_unregisterValue: function _unregisterValue(value) {
			if (value === Object(value)) {
				var indexesConfig = this._indexesConfig;
				var indexes = this._indexes;

				for (var i = indexesConfig.length; i;) {
					var keyName = indexesConfig[--i].keyName;
					var key = value[keyName];

					if (key != null) {
						var index = indexes[keyName];
						var items = index.get(key);

						if (items.length == 1) {
							index.delete(key);
						} else {
							items.pop();
						}
					}
				}
			}

			_unregisterValue2.call(this, value);
		}
	});

	module.exports = IndexedCollectionMixin;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(2);

	var ObservableMap = _require.ObservableMap;

	var IndexedCollectionMixin = __webpack_require__(1);

	var _ObservableMap$protot = ObservableMap.prototype;
	var _contains = _ObservableMap$protot.contains;
	var _get = _ObservableMap$protot.get;

	/**
	 * @class IndexedMap
	 * @extends {cellx.ObservableMap}
	 * @implements {IndexedCollectionMixin}
	 *
	 * @typesign new IndexedMap(entries?: Object|cellx.ObservableMap|Map|Array<{ 0, 1 }>, opts?: {
	 *     adoptsItemChanges?: boolean,
	 *     indexes?: Array<string|{ keyName: string, keyGenerator?: () -> string }>
	 * }) -> IndexedMap;
	 */

	var IndexedMap = ObservableMap.extend({
		Implements: [IndexedCollectionMixin],

		constructor: function IndexedMap(items, opts) {
			IndexedCollectionMixin.call(this, opts);
			ObservableMap.call(this, items, opts);
		},

		/**
	  * @override
	  * @typesign (value) -> boolean;
	  * @typesign (key, keyName?: string) -> boolean;
	  */
		contains: function contains(key, keyName) {
			if (arguments.length >= 2) {
				var index = this._indexes[keyName];
				return index ? index.has(key) : false;
			}

			return _contains.call(this, key);
		},


		/**
	  * @override
	  * @typesign (key) -> *;
	  * @typesign (key, keyName?: string) -> *;
	  */
		get: function get(key, keyName) {
			if (arguments.length >= 2) {
				var index = this._indexes[keyName];

				if (index) {
					var items = index.get(key);
					return items && items[items.length - 1];
				}

				return void 0;
			}

			return _get.call(this, key);
		}
	});

	module.exports = IndexedMap;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _require = __webpack_require__(2);

	var ObservableList = _require.ObservableList;

	var IndexedCollectionMixin = __webpack_require__(1);

	var _ObservableList$proto = ObservableList.prototype;
	var _contains = _ObservableList$proto.contains;
	var _get = _ObservableList$proto.get;

	/**
	 * @class IndexedList
	 * @extends {cellx.ObservableList}
	 * @implements {IndexedCollectionMixin}
	 *
	 * @typesign new IndexedList(items?: Array|cellx.ObservableList, opts?: {
	 *     adoptsItemChanges?: boolean,
	 *     comparator?: (a, b) -> int,
	 *     sorted?: boolean,
	 *     indexes?: Array<string|{ keyName: string, keyGenerator?: () -> string }>
	 * }) -> IndexedList;
	 */

	var IndexedList = ObservableList.extend({
		Implements: [IndexedCollectionMixin],

		constructor: function IndexedList(items, opts) {
			IndexedCollectionMixin.call(this, opts);
			ObservableList.call(this, items, opts);
		},

		/**
	  * @override
	  * @typesign (value) -> boolean;
	  * @typesign (key, keyName?: string) -> boolean;
	  */
		contains: function contains(key, keyName) {
			if (arguments.length >= 2) {
				var index = this._indexes[keyName];
				return index ? index.has(key) : false;
			}

			return _contains.call(this, key);
		},


		/**
	  * @override
	  * @typesign (index: int) -> *;
	  * @typesign (key, keyName?: string) -> *;
	  */
		get: function get(key, keyName) {
			if (arguments.length >= 2) {
				var index = this._indexes[keyName];

				if (index) {
					var items = index.get(key);
					return items && items[items.length - 1];
				}

				return void 0;
			}

			return _get.call(this, key);
		}
	});

	module.exports = IndexedList;

/***/ }
/******/ ])
});
;