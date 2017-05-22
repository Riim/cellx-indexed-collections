import { ObservableList, Utils } from 'cellx';
import IndexedCollectionMixin from './IndexedCollectionMixin';

let { contains, get } = ObservableList.prototype;

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
export default function IndexedList(items, opts) {
	IndexedCollectionMixin.call(this, opts);
	ObservableList.call(this, items, opts);
}

IndexedList.prototype = Utils.mixin({ __proto__: ObservableList.prototype }, IndexedCollectionMixin.prototype, {
	constructor: IndexedList,

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
	 * @typesign (index: int) -> *;
	 * @typesign (indexValue, indexKey: string) -> *;
	 */
	get(indexValue, indexKey) {
		if (arguments.length >= 2) {
			let index = this._indexes[indexKey];

			if (index) {
				let indexItems = index.get(indexValue);
				return indexItems && indexItems[indexItems.length - 1];
			}

			return undefined;
		}

		return get.call(this, indexValue);
	}
});
