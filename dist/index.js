(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@riim/map-set-polyfill'), require('cellx')) :
	typeof define === 'function' && define.amd ? define(['exports', '@riim/map-set-polyfill', 'cellx'], factory) :
	(factory((global.cellxIndexedCollections = global['cellx-indexed-collections'] = {}),global._riim_mapSetPolyfill,global.cellx));
}(this, (function (exports,_riim_mapSetPolyfill,cellx) { 'use strict';

var _ObservableCollection = cellx.ObservableCollectionMixin.prototype;
var _registerValue2 = _ObservableCollection._registerValue;
var _unregisterValue2 = _ObservableCollection._unregisterValue;

var nextUID = cellx.Utils.nextUID;

function IndexedCollectionMixin(opts) {
	this._indexesConfig = opts && opts.indexes ? opts.indexes.map(function (indexConfig) {
		return typeof indexConfig == 'string' ? { key: indexConfig } : indexConfig;
	}) : [{ key: 'id', valueGenerator: nextUID }];

	this._indexes = Object.create(null);
}

IndexedCollectionMixin.prototype = {
	/**
  * @override
  */
	_registerValue: function _registerValue(value) {
		if (value === Object(value)) {
			var indexesConfig = this._indexesConfig;
			var indexes = this._indexes;

			for (var i = indexesConfig.length; i;) {
				var indexConfig = indexesConfig[--i];
				var indexKey = indexConfig.key;
				var index = indexes[indexKey] || (indexes[indexKey] = new _riim_mapSetPolyfill.Map());
				var indexValue = value[indexKey];

				if (indexValue === undefined) {
					var indexValueGenerator = indexConfig.valueGenerator;

					if (indexValueGenerator) {
						do {
							indexValue = indexValueGenerator();
						} while (index.has(indexValue));

						Object.defineProperty(value, indexKey, { value: indexValue });
					}
				}

				if (indexValue !== undefined) {
					var indexItems = index.get(indexValue);

					if (indexItems) {
						indexItems.push(value);
					} else {
						index.set(indexValue, [value]);
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
				var indexKey = indexesConfig[--i].key;
				var indexValue = value[indexKey];

				if (indexValue !== undefined) {
					var index = indexes[indexKey];
					var indexItems = index.get(indexValue);

					if (indexItems.length == 1) {
						index.delete(indexValue);
					} else {
						indexItems.pop();
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
};

var _ObservableMap$protot = cellx.ObservableMap.prototype;
var _contains = _ObservableMap$protot.contains;
var _get = _ObservableMap$protot.get;

/**
 * @class IndexedMap
 * @extends {cellx.ObservableMap}
 * @implements {IndexedCollectionMixin}
 *
 * @typesign new IndexedMap(entries?: Object | cellx.ObservableMap | Map | Array<{ 0, 1 }>, opts?: {
 *     adoptsValueChanges?: boolean,
 *     indexes?: Array<string | { key: string, valueGenerator?: () -> string }>
 * }) -> IndexedMap;
 */

function IndexedMap(items, opts) {
	IndexedCollectionMixin.call(this, opts);
	cellx.ObservableMap.call(this, items, opts);
}

IndexedMap.prototype = cellx.Utils.mixin({ __proto__: cellx.ObservableMap.prototype }, IndexedCollectionMixin.prototype, {
	constructor: IndexedMap,

	/**
  * @override
  * @typesign (value) -> boolean;
  * @typesign (indexValue, indexKey: string) -> boolean;
  */
	contains: function contains(indexValue, indexKey) {
		if (indexKey !== undefined) {
			var index = this._indexes[indexKey];
			return !!index && index.has(indexValue);
		}

		return _contains.call(this, indexValue);
	},


	/**
  * @override
  * @typesign (key) -> *;
  * @typesign (indexValue, indexKey: string) -> *;
  */
	get: function get(indexValue, indexKey) {
		if (indexKey !== undefined) {
			var index = this._indexes[indexKey];

			if (index) {
				var indexItems = index.get(indexValue);
				return indexItems && indexItems[indexItems.length - 1];
			}

			return undefined;
		}

		return _get.call(this, indexValue);
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
 * @typesign new IndexedList(items?: Array | cellx.ObservableList, opts?: {
 *     adoptsValueChanges?: boolean,
 *     comparator?: (a, b) -> int,
 *     sorted?: boolean,
 *     indexes?: Array<string | { key: string, valueGenerator?: () -> string }>
 * }) -> IndexedList;
 */

function IndexedList(items, opts) {
	IndexedCollectionMixin.call(this, opts);
	cellx.ObservableList.call(this, items, opts);
}

IndexedList.prototype = cellx.Utils.mixin({ __proto__: cellx.ObservableList.prototype }, IndexedCollectionMixin.prototype, {
	constructor: IndexedList,

	/**
  * @override
  * @typesign (value) -> boolean;
  * @typesign (indexValue, indexKey: string) -> boolean;
  */
	contains: function contains(indexValue, indexKey) {
		if (indexKey !== undefined) {
			var index = this._indexes[indexKey];
			return !!index && index.has(indexValue);
		}

		return _contains$1.call(this, indexValue);
	},


	/**
  * @override
  * @typesign (index: int) -> *;
  * @typesign (indexValue, indexKey: string) -> *;
  */
	get: function get(indexValue, indexKey) {
		if (indexKey !== undefined) {
			var index = this._indexes[indexKey];

			if (index) {
				var indexItems = index.get(indexValue);
				return indexItems && indexItems[indexItems.length - 1];
			}

			return undefined;
		}

		return _get$1.call(this, indexValue);
	}
});

exports.IndexedCollectionMixin = IndexedCollectionMixin;
exports.IndexedMap = IndexedMap;
exports.IndexedList = IndexedList;

Object.defineProperty(exports, '__esModule', { value: true });

})));
