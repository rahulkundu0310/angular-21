export interface IOptionItem {
	value: unknown;
	label: string;
}

export interface ITableColumn {
	field?: string;
	label: string;
}

export type TSeverity =
	| 'info'
	| 'light'
	| 'danger'
	| 'success'
	| 'warning'
	| 'primary'
	| 'contrast'
	| 'secondary';

export interface ICountryGeo {
	latitude: number;
	longitude: number;
	max_latitude: number;
	min_latitude: number;
	max_longitude: number;
	min_longitude: number;
	bounds: {
		northeast: {
			lat: number;
			lng: number;
		};
		southwest: {
			lat: number;
			lng: number;
		};
	};
}

export interface ICountry {
	id: number;
	gec: string;
	ioc: string;
	alpha2: string;
	alpha3: string;
	region: string;
	geo: ICountryGeo;
	subregion: string;
	continent: string;
	un_locode: string;
	dial_code: string;
	g7_member: boolean;
	g20_member: boolean;
	nationality: string;
	timezones: string[];
	postal_code: boolean;
	world_region: string;
	iso_long_name: string;
	start_of_week: string;
	currency_code: string;
	distance_unit: string;
	iso_short_name: string;
	address_format: string;
	national_prefix: string;
	iso_numeric_code: string;
	languages_spoken: string[];
	unofficial_names: string[];
	postal_code_format: string;
	languages_official: string[];
	international_prefix: string;
	sample_national_number: string;
	national_number_lengths: number[];
	sample_international_number: string;
	national_destination_code_lengths: number[];
}
