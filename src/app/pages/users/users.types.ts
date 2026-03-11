export type TUserRole = 'admin' | 'manager' | 'member';

export type TUserStatus = 'active' | 'inactive' | 'suspended';

export interface IUser {
	id: string;
	email: string;
	role: TUserRole;
	last_name: string;
	first_name: string;
	created_at: string;
	status: TUserStatus;
	image: string | null;
}
