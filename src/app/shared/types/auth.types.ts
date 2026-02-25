export interface IAuthUser {
	id: number;
	role: string;
	email: string;
	last_name: string;
	first_name: string;
	is_verified: boolean;
	phone_number: string;
}

export interface IAuthSession {
	access_token: string;
	user_details: IAuthUser;
}

export interface ISignInPayload {
	email: string;
	password: string;
}

export interface IForgotPasswordPayload {
	email: string;
}

export interface IResetPasswordPayload {
	password: string;
	reset_token: string;
}
