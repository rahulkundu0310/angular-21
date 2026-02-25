import { environment } from '@env/environment';
import { AES, CBC, Pkcs7, Utf8, Base64, WordArray, CipherParams } from 'crypto-es';

/**
 * The secret key retrieved from environment used for cryptographic key derivation in encryption and decryption operation.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
const cryptoSecret: string = environment.cryptoSecret;

/**
 * Encrypts plain text using AES-256-CBC algorithm with secure key derivation returning a base64 encoded encrypted output.
 * Processes random seed generation and key derivation from secret to ensure secure encryption status for data protection.
 *
 * @param plainText - The original text content to be encrypted using AES algorithm for extremely secure input operations.
 * @param secretKey - The secret key used for key derivation and encryption processes for security within encryption flow.
 * @returns A base64 encoded string containing IV and encrypted input for secure storage and transport handling protocols.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function encryption(plainText: string, secretKey: string = cryptoSecret): string {
	// Converts the provided secret key string into a UTF-8 encoded key format
	const encryptionKey = Utf8.parse(secretKey);

	// Generates a random 16-byte initialization vector for the AES encryption
	const initializationVector = WordArray.random(16);

	// Encrypts UTF-8 encoded plain texts using AES with CBC and PKCS7 padding
	const { ciphertext } = AES.encrypt(Utf8.parse(plainText), encryptionKey, {
		mode: CBC,
		padding: Pkcs7,
		iv: initializationVector
	});

	// Validates encryption result and throw an error if ciphertext is missing
	if (!ciphertext) throw new Error('Encryption failed: ciphertext is undefined');

	// Returns Base64 string containing IV concatenated using ciphertext bytes
	return initializationVector.concat(ciphertext).toString(Base64);
}

/**
 * Decrypts the base64 encoded input using AES-256-CBC algorithm with secure key derivation returning a plain text output.
 * Processes vector extraction and key derivation from secret to ensure secure decryption status for plain output content.
 *
 * @param encryptedInput - The base64 encoded encrypted string to decrypt using AES algorithm for correct input structure.
 * @param secretKey - The secret key used for key derivation and decryption processes for security during data decryption.
 * @returns A standard text string containing the original decrypted content for secure data retrieval and logic handling.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export function decryption(encryptedInput: string, secretKey: string = cryptoSecret): string {
	// Converts the provided secret key string into a UTF-8 encoded key format
	const decryptionKey = Utf8.parse(secretKey);

	// Decodes the Base64-encoded input strings to retrieve raw encrypted data
	const encodedCombinedData = Base64.parse(encryptedInput);

	// Extracts the first 16 bytes from combined data as initialization vector
	const extractedInitializationVector = WordArray.create(
		encodedCombinedData.words.slice(0, 4),
		16
	);

	// Extracts remaining byte data from combined data as encrypted ciphertext
	const extractedCipherText = WordArray.create(
		encodedCombinedData.words.slice(4),
		encodedCombinedData.sigBytes - 16
	);

	// Creates CipherParams object to hold extracted ciphertext for decryption
	const cipherParameters = CipherParams.create({ ciphertext: extractedCipherText });

	// Decrypts using AES through CBC mode, PKCS7 padding, and the original IV
	const decryptedWordArray = AES.decrypt(cipherParameters, decryptionKey, {
		mode: CBC,
		padding: Pkcs7,
		iv: extractedInitializationVector
	});

	// Returns decrypted words array again into UTF-8 plain text string format
	return decryptedWordArray.toString(Utf8);
}
