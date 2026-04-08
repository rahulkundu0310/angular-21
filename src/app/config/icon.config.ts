import type { LucideIcons } from 'lucide-angular';
import {
	X,
	Eye,
	Plug,
	Info,
	House,
	Check,
	Users,
	Search,
	LogOut,
	EyeOff,
	UserPen,
	ChartBar,
	Settings,
	ListFilter,
	ChevronDown,
	ChevronRight,
	ChevronsUpDown,
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
	X,
	Eye,
	Plug,
	Info,
	House,
	Check,
	Users,
	Search,
	LogOut,
	EyeOff,
	UserPen,
	ChartBar,
	Settings,
	ListFilter,
	ChevronDown,
	ChevronRight,
	ChevronsUpDown,
	LayoutDashboard
} as const;
