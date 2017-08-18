import { Map } from '@riim/map-set-polyfill';
import { ObservableCollectionMixin, Utils } from 'cellx';

let { _registerValue, _unregisterValue } = ObservableCollectionMixin.prototype;
let nextUID = Utils.nextUID;

export default function IndexedCollectionMixin(opts) {
	this._indexesConfig = opts && opts.indexes ?
		opts.indexes.map(indexConfig => typeof indexConfig == 'string' ? { key: indexConfig } : indexConfig) :
		[{ key: 'id', valueGenerator: nextUID }];

	this._indexes = Object.create(null);
}

IndexedCollectionMixin.prototype = {
	/**
	 * @override
	 */
	_registerValue(value) {
		if (value === Object(value)) {
			let indexesConfig = this._indexesConfig;
			let indexes = this._indexes;

			for (let i = indexesConfig.length; i;) {
				let indexConfig = indexesConfig[--i];
				let indexKey = indexConfig.key;
				let index = indexes[indexKey] || (indexes[indexKey] = new Map());
				let indexValue = value[indexKey];

				if (indexValue === undefined) {
					let indexValueGenerator = indexConfig.valueGenerator;

					if (indexValueGenerator) {
						do {
							indexValue = indexValueGenerator();
						} while (index.has(indexValue));

						Object.defineProperty(value, indexKey, { value: indexValue });
					}
				}

				if (indexValue !== undefined) {
					let indexItems = index.get(indexValue);

					if (indexItems) {
						indexItems.push(value);
					} else {
						index.set(indexValue, [value]);
					}
				}
			}
		}

		_registerValue.call(this, value);
	},

	/**
	 * @override
	 */
	_unregisterValue(value) {
		if (value === Object(value)) {
			let indexesConfig = this._indexesConfig;
			let indexes = this._indexes;

			for (let i = indexesConfig.length; i;) {
				let indexKey = indexesConfig[--i].key;
				let indexValue = value[indexKey];

				if (indexValue !== undefined) {
					let index = indexes[indexKey];
					let indexItems = index.get(indexValue);

					if (indexItems.length == 1) {
						index.delete(indexValue);
					} else {
						indexItems.pop();
					}
				}
			}
		}

		_unregisterValue.call(this, value);
	},

	/**
	 * @override
	 */
	clear() {
		this._indexes = Object.create(null);
		Object.getPrototypeOf(this.constructor.prototype).clear.call(this);
	}
};
