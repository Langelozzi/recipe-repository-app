import { Router } from '@angular/router';
import { AuthService } from './../../services/auth-service/auth.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { AnimationHelper } from 'src/app/helpers/animation-helper';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.scss'],
    animations: [AnimationHelper.getSimpleFade('fastFade', 200)],
})
export class NavBarComponent implements OnInit {
    @ViewChild('sidenav') sideNav!: MatSidenav;

    constructor(public authService: AuthService, private router: Router) { }

    ngOnInit(): void { }

    isRootPath(): boolean {
        if (this.router.url === '/') {
            return true;
        } else {
            return false;
        }
    }

    isLoggedIn(): boolean {
        if (this.authService.isLoggedIn()) {
            return true;
        } else {
            return false;
        }
    }

    logout(): void {
        this.authService.logout();
        this.router.navigate(['/login']);
    }

    openLogInPage(): void {
        this.router.navigate(['/login']);
    }

    openSignUpPage(): void {
        this.router.navigate(['/signup']);
    }

    openCreatePage(): void {
        this.sideNav.close();
        this.router.navigate(['/recipes/create']);
    }

    openUploadPage(): void {
        this.sideNav.close();
        this.router.navigate(['/recipes/upload']);
    }

    openRecipeListingPage(): void {
        this.sideNav.close();
        this.router.navigate(['/recipes']);
    }

    openFavouritesPage(): void {
        this.sideNav.close();
        this.router.navigate(['/recipes/favourites']);
    }

    openUserHome(): void {
        this.sideNav.close();
        this.router.navigate(['/userhome']);
    }

    openFeed(): void {
        this.sideNav.close();
        this.router.navigate(['/feed']);
    }
}
