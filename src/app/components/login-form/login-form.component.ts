import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from './../../services/auth-service/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SnackBarHelper } from '../../helpers/snack-bar.helper';
import { AnimationHelper } from 'src/app/helpers/animation-helper';

@Component( {
    selector: 'app-login-form',
    templateUrl: './login-form.component.html',
    styleUrls: [ './login-form.component.scss' ],
    animations: [ AnimationHelper.getSimpleFade( 'fastFade', 200 ) ],
} )
export class LoginFormComponent implements OnInit {
    loginForm: FormGroup = new FormGroup( {
        email: new FormControl( '', [ Validators.required, Validators.email ] ),
        password: new FormControl( '', [ Validators.required ] ),
    } );

    hide = true;
    errorMessage!: boolean;

    constructor(
        private authService: AuthService,
        private router: Router,
        private _snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {}

    getErrorMessage() {
        if ( this.loginForm?.get( 'email' )?.hasError( 'required' ) ) {
            return 'You must enter a value';
        }

        return this.loginForm?.get( 'email' )?.hasError( 'email' )
            ? 'Not a valid email'
            : '';
    }

    loginUser() {
        const email: string | null = this.loginForm?.get( 'email' )?.value;
        const password: string | null = this.loginForm?.get( 'password' )?.value;

        this.authService.login( {
            email: <string>email,
            password: <string>password,
        }  ).subscribe( {
            next: ( tokens ) => {
                this.authService.doLoginUser( tokens );
                this.router.navigate( [ '/userhome' ] );
            },
            error: ( err ) => {
                SnackBarHelper.triggerSnackBar( this._snackBar, 'Email or Password is invalid', 'Ok' );
            }
        } );
    }
}
