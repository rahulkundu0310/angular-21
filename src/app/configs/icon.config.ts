import type { LucideIcons } from 'lucide-angular';
import {
	Eye,
	Info,
	List,
	Plus,
	House,
	Check,
	Users,
	Search,
	Pencil,
	EyeOff,
	ChartBar,
	Settings,
	ChevronDown,
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
	Eye,
	Info,
	Plus,
	List,
	House,
	Check,
	Users,
	Search,
	Pencil,
	EyeOff,
	ChartBar,
	Settings,
	ChevronDown,
	ChevronRight,
	LayoutDashboard
} as const;
