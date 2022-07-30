import {
    HttpErrorResponse,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

import { AuthService } from '../services/auth-service/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor( public authService: AuthService, private router: Router ) {}

    intercept( req: HttpRequest<any>, next: HttpHandler ) {
        const authToken = this.authService.getAccessToken();
        req = req.clone( {
            setHeaders: {
                'Access-Token': `${authToken}`,
            },
        } );
        return next.handle( req ).pipe(
            // if the response has error code 403 (invalid token) then log out the user and propmt them to log in
            catchError( ( error: HttpErrorResponse ) => {
                if ( error.status == 401 ) {
                    this.authService.logout();
                    this.router.navigate( [ '/login' ] );
                }

                return throwError( error );
            } )
        );
    }
}
