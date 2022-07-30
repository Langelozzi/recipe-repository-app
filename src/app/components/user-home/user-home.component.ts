import { AuthService } from './../../services/auth-service/auth.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Recipe } from 'src/models/recipe';
import { RecipeService } from 'src/app/services/recipe-service/recipe.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { plainToClass } from 'class-transformer';
import { SnackBarHelper } from 'src/app/helpers/snack-bar.helper';
import { catchError, tap, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component( {
    selector: 'app-user-home',
    templateUrl: './user-home.component.html',
    styleUrls: [ './user-home.component.scss' ],
} )
export class UserHomeComponent implements OnInit {
    public recipes!: Recipe[];

    constructor(
        private recipeService: RecipeService,
        private router: Router,
        private _snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.recipeService.getAllRecipes().subscribe(
            // if the response is good then create list of recipes
            ( data: any ) => {
                this.recipes = plainToClass( Recipe, data.recipes );
                this.recipes = this.recipes.reverse();
            }
        );
    }

    viewRecipe( recipeId: string | undefined ): void {
        this.router.navigate( [ `/recipes/${recipeId}` ] );
    }
}
