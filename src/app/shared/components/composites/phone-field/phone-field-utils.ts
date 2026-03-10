import type { ICountry } from '@shared/types';
import type {
	IPhoneFieldConfig,
	IPhoneFieldCountry,
	IDerivedPhoneFieldConfig
} from './phone-field.types';

/**
 * Derives the initial field configuration by allocating comprehensive fallback values for consistent interface rendering.
 * Processes the source parameters by merging predefined rules to ensure missing attributes receive compatible assignment.
 *
 * @param config - The partial specification object containing current properties before the resolution process concludes.
 * @returns A normalized derivation object specifying essential styling and functional provisions for evaluated structure.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function derivePhoneFieldConfig(config: IPhoneFieldConfig): IDerivedPhoneFieldConfig {
	return {
		...config,
		placeholder: config.placeholder ?? 'Enter Phone Number'
	};
}

/**
 * Transforms the provided country profile into a tailored version designed strictly to support the phone input component.
 * Processes the input parameters to extract required mapping details and generate the correct national symbol image path.
 *
 * @param country - The initial object containing detailed attributes parsed to satisfy standard regional dialing formats.
 * @returns A restructured model returning essential contact properties alongside the proper national flag image resource.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function transformCountry(country: ICountry): IPhoneFieldCountry {
	return {
		id: country.id,
		alpha2: country.alpha2,
		dialCode: country.dial_code,
		isoShortName: country.iso_short_name,
		sampleNationalNumber: country.sample_national_number,
		flagImage: `images/flags/${country.alpha2.toUpperCase()}.svg`
	};
}
