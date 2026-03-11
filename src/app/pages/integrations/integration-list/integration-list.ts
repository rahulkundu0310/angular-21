import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
	selector: 'integration-list',
	styleUrl: './integration-list.scss',
	templateUrl: './integration-list.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class IntegrationList {}
