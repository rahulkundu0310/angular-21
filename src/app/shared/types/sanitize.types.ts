import type {
	SafeUrl,
	SafeHtml,
	SafeStyle,
	SafeScript,
	SafeResourceUrl
} from '@angular/platform-browser';

export type TSanitizeType = 'html' | 'style' | 'script' | 'url' | 'resourceUrl';

export type TSanitizedContent =
	| string
	| SafeUrl
	| SafeHtml
	| SafeStyle
	| SafeScript
	| SafeResourceUrl;
