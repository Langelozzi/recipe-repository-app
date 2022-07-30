import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { plainToClass } from 'class-transformer';
import { SnackBarHelper } from 'src/app/helpers/snack-bar.helper';
import { RecipeService } from 'src/app/services/recipe-service/recipe.service';
import { Recipe } from 'src/models/recipe';

@Component( {
    selector: 'app-favourite-listing',
    templateUrl: './favourite-listing.component.html',
    styleUrls: [ './favourite-listing.component.scss' ],
} )
export class FavouriteListingComponent implements OnInit {
    public recipes!: Recipe[];

    constructor(
        private recipeService: RecipeService,
        private router: Router,
        private _snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.recipeService.getFavouriteRecipes().subscribe(
            // if the response is good then create list of recipes
            ( data: any ) => {
                this.recipes = plainToClass( Recipe, data.recipes );
            }
        );
    }

    viewRecipe( recipeId: string | undefined ): void {
        this.router.navigate( [ `/recipes/${recipeId}` ] );
    }
}
