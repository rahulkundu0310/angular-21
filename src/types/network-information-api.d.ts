declare interface Navigator extends NavigatorNetworkInformation {}
declare interface WorkerNavigator extends NavigatorNetworkInformation {}

declare interface NavigatorNetworkInformation {
	readonly connection?: NetworkInformation;
}

type Megabit = number;

type Millisecond = number;

type EffectiveType = '2g' | '3g' | '4g' | 'slow-2g';

type ConnectionType =
	| 'none'
	| 'wifi'
	| 'other'
	| 'mixed'
	| 'wimax'
	| 'unknown'
	| 'ethernet'
	| 'cellular'
	| 'bluetooth';

interface NetworkInformation extends EventTarget {
	// Time taken for data to travel to the destination and back to the source
	readonly rtt?: Millisecond;

	// Specifies if the user has enabled reduced data usage preference setting
	readonly saveData?: boolean;

	// Estimated effective bandwidth of the connection in megabits per seconds
	readonly downlink?: Megabit;

	// Specifies the network connection type such as wifi cellular or ethernet
	readonly type?: ConnectionType;

	// Maximum possible downlink bandwidth supported by the current connection
	readonly downlinkMax?: Megabit;

	// Represents effective network quality types like slow-2g, 2g, 3g, and 4g
	readonly effectiveType?: EffectiveType;

	// Handles an event whenever network related information has been modified
	onchange?: (this: NetworkInformation, event: Event) => unknown;

	// Attaches a listener for all the network change event on this connection
	addEventListener(
		type: 'change',
		listener: (this: NetworkInformation, event: Event) => unknown
	): void;

	// Detaches the listeners for the network change events on this connection
	removeEventListener(
		type: 'change',
		listener: (this: NetworkInformation, event: Event) => unknown
	): void;
}
