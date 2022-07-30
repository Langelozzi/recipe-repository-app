import { AuthService } from './../../services/auth-service/auth.service';
import { Component, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormControl,
    FormGroup,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component( {
    selector: 'app-signup-form',
    templateUrl: './signup-form.component.html',
    styleUrls: [ './signup-form.component.scss' ],
} )
export class SignupFormComponent implements OnInit {
    signupForm: FormGroup = new FormGroup( {
        firstName: new FormControl( '', [ Validators.required ] ),
        lastName: new FormControl( '', [ Validators.required ] ),
        email: new FormControl( '', [ Validators.required, Validators.email ] ),
        password: new FormControl( '', [
            Validators.required,
            Validators.pattern( '(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).+' ),
            Validators.minLength( 8 ),
        ] ),
        repeatPassword: new FormControl( '', [
            Validators.required,
            this.confirmPasswordRepeat(),
        ] ),
    } );

    hidePassword = true;
    hideRepeat = true;
    repPassError!: boolean;

    constructor(
        private authService: AuthService,
        private router: Router,
        private _snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {}

    getEmailError() {
        if ( this.signupForm?.get( 'email' )?.hasError( 'required' ) ) {
            return 'You must enter a value';
        }

        return this.signupForm?.get( 'email' )?.hasError( 'email' )
            ? 'Not a valid email'
            : '';
    }

    confirmPasswordRepeat(): ValidatorFn {
        return ( control: AbstractControl ): { [key: string]: any } | null =>
            control.value === this.signupForm?.get( 'password' )?.value
                ? null
                : { noMatch: true };
    }

    registerUser() {
        this.authService
            .register(
                <string>this.signupForm?.get( 'email' )?.value,
                <string>this.signupForm?.get( 'firstName' )?.value,
                <string>this.signupForm?.get( 'lastName' )?.value,
                <string>this.signupForm?.get( 'password' )?.value
            )
            .subscribe(
                ( data ) => {
                    this.router.navigate( [ '/login' ] );
                },
                ( err ) => {
                    this._snackBar.open( `${err.error}`, 'Close', {
                        duration: 6000,
                    } );
                }
            );
    }
}
