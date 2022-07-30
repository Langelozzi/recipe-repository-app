import { AuthService } from './../../services/auth-service/auth.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component( {
    selector: 'app-user-home',
    templateUrl: './user-home.component.html',
    styleUrls: [ './user-home.component.scss' ],
} )
export class UserHomeComponent implements OnInit {
    constructor( private authService: AuthService, private router: Router ) {}

    ngOnInit(): void {}
}
