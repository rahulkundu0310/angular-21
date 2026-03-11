import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'analytics-overview',
	styleUrl: './analytics-overview.scss',
	templateUrl: './analytics-overview.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalyticsOverview {}
