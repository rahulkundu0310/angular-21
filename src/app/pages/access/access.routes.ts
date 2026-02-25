import { SignIn } from './sign-in/sign-in';
import type { IRoute } from '@shared/types';
import { ResetPassword } from './reset-password/reset-password';
import { ForgotPassword } from './forgot-password/forgot-password';

/**
 * Defines module routes by configuring all required navigation paths and components for feature access and route controls.
 * Handles route configurations using components mapping to maintain consistent flow and navigation across the application.
 *
 * @since 01 December 2025
 * @author Rahul Kundu
 */
export const accessRoutes: IRoute[] = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'sign-in'
	},
	{
		path: 'sign-in',
		title: 'Sign In',
		component: SignIn
	},
	{
		path: 'forgot-password',
		title: 'Forgot Password',
		component: ForgotPassword
	},
	{
		path: 'reset-password',
		title: 'Reset Password',
		component: ResetPassword
	}
];
