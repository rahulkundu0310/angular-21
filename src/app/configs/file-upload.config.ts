import type { IFileUploadConfig } from '@shared/types';

/**
 * Defines upload policy specifications by setting strict boundary limits and format allowances for the media attachments.
 * Processes specific restrictions and capacity constraints to establish secure resource transfers within the application.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const fileUploadConfig: IFileUploadConfig = {
	video: {
		maxFileSize: 30e6,
		fileSizeUnit: 'mb',
		acceptAttribute: '.mp4,.ogv,.webm',
		allowedExtensions: ['mp4', 'ogv', 'webm']
	},
	image: {
		maxFileSize: 1e6,
		fileSizeUnit: 'mb',
		acceptAttribute: '.jpeg,.jpg,.png',
		allowedExtensions: ['jpeg', 'jpg', 'png']
	},
	document: {
		maxFileSize: 5e6,
		fileSizeUnit: 'mb',
		acceptAttribute: '.pdf,.doc,.docx,.txt',
		allowedExtensions: ['pdf', 'doc', 'docx', 'txt']
	}
} as const;
