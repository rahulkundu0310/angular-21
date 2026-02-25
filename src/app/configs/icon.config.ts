import type { LucideIcons } from 'lucide-angular';
import {
	Info,
	List,
	Plus,
	House,
	Users,
	Pencil,
	ChartBar,
	Settings,
	ChevronRight,
	LayoutDashboard
} from 'lucide-angular';

/**
 * Defines icon registry configuration by mapping string tokens to reusable vector symbol references for consistent reuse.
 * Processes icon key mappings to provide reliable symbol selection for navigation and action cues within the application.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const iconConfig: LucideIcons = {
	Info,
	Plus,
	List,
	House,
	Users,
	Pencil,
	Settings,
	ChartBar,
	ChevronRight,
	LayoutDashboard
} as const;
