export type TDashboardAction = 'creation' | 'modification' | 'deletion' | 'system';

export interface IDashboardActivity {
	id: string;
	actor: string;
	title: string;
	created_at: string;
	description: string;
	action: TDashboardAction;
}

export interface IDashboardMetrics {
	total_users: number;
	active_sessions: number;
	monthly_revenue: number;
	growth_percentage: number;
}
