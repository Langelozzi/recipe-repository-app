import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { plainToInstance } from 'class-transformer';
import { AnimationHelper } from 'src/app/helpers/animation-helper';
import { RecipeService } from 'src/app/services/recipe-service/recipe.service';
import { Recipe } from 'src/models/recipe';
import { User } from 'src/models/user';

import { AuthService } from './../../services/auth-service/auth.service';

@Component( {
    selector: 'app-user-home',
    templateUrl: './user-home.component.html',
    styleUrls: [ './user-home.component.scss' ],
    animations: [ AnimationHelper.getSimpleFade( 'slowFade', 400 ) ],
} )
export class UserHomeComponent implements OnInit {
    public recipes!: Recipe[];
    public currentUser!: any;

    constructor(
        private recipeService: RecipeService,
        private authService: AuthService,
        private router: Router,
        private _snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.recipeService.getAllRecipes().subscribe(
            // if the response is good then create list of recipes
            ( data: any ) => {
                this.recipes = plainToInstance( Recipe, data.recipes );
                this.recipes = this.recipes.reverse();
            }
        );

        this.authService.getCurrentUser().subscribe( ( user: any ) => {
            this.currentUser = plainToInstance( User, user );
        } );
    }

    viewRecipe( recipeId: string | undefined ): void {
        this.router.navigate( [ `/recipes/${recipeId}` ] );
    }

    getRecentRecipes(): Recipe[] {
        let recentRecipes: Recipe[];

        if ( this.recipes.length < 5 ) {
            recentRecipes = this.recipes;
        } else {
            recentRecipes = this.recipes.slice(
                this.recipes.length - 5,
                this.recipes.length
            );
        }

        return recentRecipes;
    }

    openCreatePage(): void {
        this.router.navigate( [ '/recipes/create' ] );
    }

    openUploadPage(): void {
        this.router.navigate( [ '/recipes/upload' ] );
    }
}
