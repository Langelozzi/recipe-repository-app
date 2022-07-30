import { MatSnackBar } from '@angular/material/snack-bar';
import {
    HttpErrorResponse,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { SnackBarHelper } from '../helpers/snack-bar.helper';

import { AuthService } from '../services/auth-service/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    constructor(
        public authService: AuthService,
        private router: Router,
        private _snackBar: MatSnackBar
    ) {}

    intercept( req: HttpRequest<any>, next: HttpHandler ) {
        const authToken = this.authService.getAccessToken();
        req = req.clone( {
            setHeaders: {
                'Access-Token': `${authToken}`,
            },
        } );
        return next.handle( req ).pipe(
            tap( {
                next: () => null,
                error: ( err: HttpErrorResponse ) => {
                    // if the response has error code 401 (invalid token) then log out the user and propmt them to log in
                    if ( [ 401, 403 ].includes( err.status ) ) {
                        this.authService.logout();
                        this.router.navigate( [ '/login' ] );

                        SnackBarHelper.triggerSnackBar(
                            this._snackBar,
                            'Session expired, please log back in',
                            'Ok'
                        );
                    } else {
                        // if any other error occurs then give this message
                        SnackBarHelper.triggerSnackBar(
                            this._snackBar,
                            'An unexpected error has occurred',
                            'Ok'
                        );
                    }

                    const error = err.error?.message || err.status;
                    return throwError( error );
                },
            } )
        );
    }
}
