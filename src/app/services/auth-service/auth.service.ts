import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, mapTo, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable( {
    providedIn: 'root',
} )
export class AuthService {
    private readonly AccessToken = 'Access-Token';
    private loggedUser!: string | null;

    constructor( private http: HttpClient ) {}

    register(
        email: string,
        firstName: string,
        lastName: string,
        password: string
    ) {
        return this.http.post( `${environment.baseApiUrl}/auth/register`, {
            email: email,
            firstName: firstName,
            lastName: lastName,
            password: password,
        } );
    }

    login( user: { email: string; password: string } ) {
        return this.http.post<any>(
            `${environment.baseApiUrl}/auth/login`,
            user
        );
    }

    logout() {
        this.loggedUser = null;
        this.removeAccessTokenFromLocalStorage();
    }

    getCurrentUser() {
        return this.http.get( `${environment.baseApiUrl}/auth/current-user` );
    }

    isLoggedIn() {
        return !!this.getAccessToken();
    }

    getAccessToken() {
        return localStorage.getItem( this.AccessToken );
    }

    doLoginUser( tokens: any ) {
        this.storeAccessTokenInLocalStorage( tokens.accessToken );
    }

    private removeAccessTokenFromLocalStorage() {
        localStorage.removeItem( this.AccessToken );
    }

    private storeAccessTokenInLocalStorage( accessToken: string ) {
        localStorage.setItem( this.AccessToken, accessToken );
    }
}
