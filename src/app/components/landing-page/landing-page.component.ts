import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationHelper } from 'src/app/helpers/animation-helper';

@Component( {
    selector: 'app-landing-page',
    templateUrl: './landing-page.component.html',
    styleUrls: [ './landing-page.component.scss' ],
    animations: [ AnimationHelper.getSimpleFade( 'slowFade', 400 ) ],
} )
export class LandingPageComponent implements OnInit {
    constructor( private router: Router ) {}

    ngOnInit(): void {}

    openLoginPage(): void {
        this.router.navigate( [ '/login' ] );
    }

    openSignUpPage(): void {
        this.router.navigate( [ '/signup' ] );
    }
}
