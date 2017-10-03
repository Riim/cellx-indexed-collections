import {
	ObservableList,
	ObservableMap,
	TComparator,
	TObservableListItems,
	TObservableMapEntries
	} from 'cellx';

interface IIndexedMapOptions {
	adoptsValueChanges?: boolean;
	indexes: Array<string | { keyName: string, keyGenerator?: () => string }>;
}

export declare class IndexedMap<K = any, V = any> extends ObservableMap<K, V> {
	constructor(entries?: TObservableMapEntries<K, V> | null, opts?: IIndexedMapOptions);
	contains(value: V): boolean;
	contains(indexValue: any, indexKey: string): boolean;
	get(key: K): V | undefined;
	get(indexValue: any, indexKey: string): V | undefined;
}

interface IIndexedListOptions<T> {
	adoptsValueChanges?: boolean;
	comparator?: TComparator<T>;
	sorted?: boolean;
	indexes: Array<string | { keyName: string, keyGenerator?: () => string }>;
}

export declare class IndexedList<T = any> extends ObservableList<T> {
	constructor(items?: TObservableListItems<T> | null, opts?: IIndexedListOptions<T>);
	contains(value: T): boolean;
	contains(indexValue: any, indexKey: string): boolean;
	get(index: number): T | undefined;
	get(indexValue: any, indexKey: string): T | undefined;
}
