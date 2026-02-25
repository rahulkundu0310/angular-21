/**
 * Generates numeric identifier by combining timestamp value with additional random digits for unique identifier creation.
 * Processes timestamp extraction, with random suffix generation, and concatenation to produce unique numeric identifiers.
 *
 * @returns A numeric identifier value containing timestamp and random digit components for unique numeric identification.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function generateNumericId(): number {
	// Gets current timestamp in milliseconds for unique identifier generation
	const currentTimestamp = Date.now();

	// Generates random number between zero ten thousand for uniqueness factor
	const randomSuffix = Math.floor(Math.random() * 10000);

	// Extracts the last three digits from random number for identifier suffix
	const randomDigits = randomSuffix.toString().slice(-3);

	// Extracts the last five digits from full timestamp for identifier prefix
	const timestampSuffix = currentTimestamp.toString().slice(-5);

	// Returns timestamp and random digits for final unique numeric identifier
	return parseInt(timestampSuffix + randomDigits);
}

/**
 * Generates ObjectId by combining a Unix timestamp with random hex characters for MongoDB-compatible identifier creation.
 * Processes timestamp conversion to hexadecimal, generates random hex characters, and concatenates them to form ObjectId.
 *
 * @returns An ObjectId string value containing timestamp and random hex components for MongoDB-compatible identification.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function generateObjectId(): string {
	// Converts the current timestamp to seconds since Unix epoch for ObjectId
	const timestampInSeconds = Math.floor(Date.now() / 1000);

	// Transforms timestamp data to hexadecimal string for ObjectId formatting
	const timestampHex = timestampInSeconds.toString(16);

	// Defines random hexadecimal string length for ObjectId suffix generation
	const randomHexLength = 16;

	// Creates placeholder pattern string for random hex character replacement
	const hexCharacterPattern = 'x'.repeat(randomHexLength);

	// Replaces each placeholder using random hexadecimal digit for unique key
	const randomHexString = hexCharacterPattern.replace(/x/g, () => {
		// Generates a random integer from zero and fifteen for hex digit creation
		const randomHexDigit = Math.floor(Math.random() * 16);

		// Convert the random value to hexadecimal string for ObjectId composition
		return randomHexDigit.toString(16);
	});

	// Returns final ObjectId by combining timestamp and random hex components
	return timestampHex + randomHexString.toLowerCase();
}
