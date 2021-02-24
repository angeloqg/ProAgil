import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Login } from '../_models/Login';
import { LoginResponse } from '../_models/LoginResponse';
import { User } from '../_models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // baseURL = 'http://localhost:5000/api/User/';

  baseURL = environment.apiUrl + 'api/User/';

  jwtHelper = new JwtHelperService();

  token: any;
  decodedToken: any;

  constructor(private http: HttpClient) {

  }

  login(model: Login): Observable<any>{

    return this.http.post<LoginResponse>(`${this.baseURL}Login`, model).pipe(

      map( (response) => {

        const user = response;

        if (user){
          localStorage.setItem('token', user.token);
          this.decodedToken = this.jwtHelper.decodeToken( user.token );
        }
      })
    );
  }

  register(model: User): any{

    return this.http.post(`${this.baseURL}Register`, model);
  }

  loggedIn(): boolean{

    this.token = localStorage.getItem('token');

    return this.jwtHelper.isTokenExpired(this.token);
  }
}
