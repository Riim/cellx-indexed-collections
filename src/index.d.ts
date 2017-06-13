import { IComparator, ObservableMapEntries, ObservableMap, ObservableListItems, ObservableList } from 'cellx';

interface IIndexedMapOptions {
	adoptsValueChanges?: boolean;
	indexes: Array<string | { keyName: string, keyGenerator?: () => string }>;
}

export declare class IndexedMap<K = any, V = any> extends ObservableMap<K, V> {
	constructor(entries?: ObservableMapEntries<K, V> | null, opts?: IIndexedMapOptions);
	contains(value: V): boolean;
	contains(indexValue: any, indexKey: string): boolean;
	get(key: K): V;
	get(indexValue: any, indexKey: string): V;
}

interface IIndexedListOptions<T> {
	adoptsValueChanges?: boolean;
	comparator?: IComparator<T>;
	sorted?: boolean;
	indexes: Array<string | { keyName: string, keyGenerator?: () => string }>;
}

export declare class IndexedList<T = any> extends ObservableList<T> {
	constructor(items?: ObservableListItems<T> | null, opts?: IIndexedListOptions<T>);
	contains(value: T): boolean;
	contains(indexValue: any, indexKey: string): boolean;
	get(index: number): T;
	get(indexValue: any, indexKey: string): T;
}
