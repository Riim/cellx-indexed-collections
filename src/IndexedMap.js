import { ObservableMap } from 'cellx';
import IndexedCollectionMixin from './IndexedCollectionMixin';

let { contains, get } = ObservableMap.prototype;

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
export default ObservableMap.extend({
	Implements: [IndexedCollectionMixin],

	constructor: function IndexedMap(items, opts) {
		IndexedCollectionMixin.call(this, opts);
		ObservableMap.call(this, items, opts);
	},

	/**
	 * @override
	 * @typesign (value) -> boolean;
	 * @typesign (indexValue, indexKey: string) -> boolean;
	 */
	contains(indexValue, indexKey) {
		if (arguments.length >= 2) {
			let index = this._indexes[indexKey];
			return !!index && index.has(indexValue);
		}

		return contains.call(this, indexValue);
	},

	/**
	 * @override
	 * @typesign (key) -> *;
	 * @typesign (indexValue, indexKey: string) -> *;
	 */
	get(indexValue, indexKey) {
		if (arguments.length >= 2) {
			let index = this._indexes[indexKey];

			if (index) {
				let indexItems = index.get(indexValue);
				return indexItems && indexItems[indexItems.length - 1];
			}

			return void 0;
		}

		return get.call(this, indexValue);
	}
});
