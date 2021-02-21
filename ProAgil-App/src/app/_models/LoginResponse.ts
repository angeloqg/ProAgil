import { Login } from './Login';

export interface LoginResponse {
    token: string;
    user: Login;
}
