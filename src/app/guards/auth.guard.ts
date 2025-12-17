import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth-service/auth.service';
import { CachingService } from '../services/caching-service/caching.service';

@Injectable( {
    providedIn: 'root',
} )
export class AuthGuard implements CanActivate {
    constructor( private authService: AuthService, private router: Router, private cachingService: CachingService ) {}

    canActivate() {
        if ( !this.authService.isLoggedIn() ) {
            this.cachingService.clearCache();
            this.router.navigate( [ '/login' ] );
        }
        return this.authService.isLoggedIn();
    }
}
