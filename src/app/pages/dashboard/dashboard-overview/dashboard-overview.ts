import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'dashboard-overview',
	styleUrl: './dashboard-overview.scss',
	templateUrl: './dashboard-overview.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardOverview {}
