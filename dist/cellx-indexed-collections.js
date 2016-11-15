(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('cellx')) :
	typeof define === 'function' && define.amd ? define(['exports', 'cellx'], factory) :
	(factory((global.cellxIndexedCollections = global['cellx-indexed-collections'] = global.cellxIndexedCollections || {}),global.cellx));
}(this, (function (exports,cellx) { 'use strict';

var _ObservableCollection = cellx.ObservableCollectionMixin.prototype;
var _registerValue2 = _ObservableCollection._registerValue;
var _unregisterValue2 = _ObservableCollection._unregisterValue;

var Map = cellx.JS.Map;
var nextUID = cellx.Utils.nextUID;

var IndexedCollectionMixin$1 = cellx.ObservableCollectionMixin.extend({
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
	},


	/**
  * @override
  */
	clear: function clear() {
		this._indexes = Object.create(null);
		Object.getPrototypeOf(this.constructor.prototype).clear.call(this);
	}
});

var _ObservableMap$protot = cellx.ObservableMap.prototype;
var _contains = _ObservableMap$protot.contains;
var _get = _ObservableMap$protot.get;

/**
 * @class IndexedMap
 * @extends {cellx.ObservableMap}
 * @implements {IndexedCollectionMixin}
 *
 * @typesign new IndexedMap(entries?: Object|cellx.ObservableMap|Map|Array<{ 0, 1 }>, opts?: {
 *     adoptsValueChanges?: boolean,
 *     indexes?: Array<string|{ keyName: string, keyGenerator?: () -> string }>
 * }) -> IndexedMap;
 */

var IndexedMap$1 = cellx.ObservableMap.extend({
	Implements: [IndexedCollectionMixin$1],

	constructor: function IndexedMap(items, opts) {
		IndexedCollectionMixin$1.call(this, opts);
		cellx.ObservableMap.call(this, items, opts);
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

var _ObservableList$proto = cellx.ObservableList.prototype;
var _contains$1 = _ObservableList$proto.contains;
var _get$1 = _ObservableList$proto.get;

/**
 * @class IndexedList
 * @extends {cellx.ObservableList}
 * @implements {IndexedCollectionMixin}
 *
 * @typesign new IndexedList(items?: Array|cellx.ObservableList, opts?: {
 *     adoptsValueChanges?: boolean,
 *     comparator?: (a, b) -> int,
 *     sorted?: boolean,
 *     indexes?: Array<string|{ keyName: string, keyGenerator?: () -> string }>
 * }) -> IndexedList;
 */

var IndexedList$1 = cellx.ObservableList.extend({
	Implements: [IndexedCollectionMixin$1],

	constructor: function IndexedList(items, opts) {
		IndexedCollectionMixin$1.call(this, opts);
		cellx.ObservableList.call(this, items, opts);
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

		return _contains$1.call(this, key);
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

		return _get$1.call(this, key);
	}
});

exports.IndexedCollectionMixin = IndexedCollectionMixin$1;
exports.IndexedMap = IndexedMap$1;
exports.IndexedList = IndexedList$1;

Object.defineProperty(exports, '__esModule', { value: true });

})));
