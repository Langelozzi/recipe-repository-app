import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeService } from '../../services/recipe-service/recipe.service';
import { plainToClass } from 'class-transformer';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarHelper } from 'src/app/helpers/snack-bar.helper';
import { Recipe } from '../../../models/recipe';

@Component( {
    selector: 'app-recipe-listing',
    templateUrl: './recipe-listing.component.html',
    styleUrls: [ './recipe-listing.component.scss' ],
} )
export class RecipeListingComponent implements OnInit {
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
            },
            // if there is an error then show alert message snack bar
            ( err: any ) => {
                SnackBarHelper.triggerSnackBar(
                    this._snackBar,
                    'An unexpected error has occured while loading recipes',
                    'Ok'
                );
            }
        );
    }

    viewRecipe( recipeId: string | undefined ): void {
        this.router.navigate( [ `/recipes/${recipeId}` ] );
    }
}
