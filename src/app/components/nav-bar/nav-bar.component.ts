import { Router } from '@angular/router';
import { AuthService } from './../../services/auth-service/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component( {
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: [ './nav-bar.component.scss' ],
} )
export class NavBarComponent implements OnInit {
    @ViewChild( 'sidenav' ) sideNav!: MatSidenav;

    constructor( public authService: AuthService, private router: Router ) {}

    ngOnInit(): void {}

    logout(): void {
        this.authService.logout();
        this.router.navigate( [ '/login' ] );
    }

    openLogInPage(): void {
        this.router.navigate( [ '/login' ] );
    }

    openSignUpPage(): void {
        this.router.navigate( [ '/signup' ] );
    }

    openCreatePage(): void {
        this.router.navigate( [ '/recipes/create' ] );
        this.sideNav.close();
    }

    openRecipeListingPage(): void {
        this.router.navigate( [ '/recipes' ] );
        this.sideNav.close();
    }

    openFavouritesPage(): void {
        this.router.navigate( [ '/recipes/favourites' ] );
        this.sideNav.close();
    }

    openUserHome(): void {
        this.router.navigate( [ '/userhome' ] );
        this.sideNav.close();
    }
}
