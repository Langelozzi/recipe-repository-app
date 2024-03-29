import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { plainToInstance } from 'class-transformer';
import { AnimationHelper } from 'src/app/helpers/animation-helper';
import { SnackBarHelper } from 'src/app/helpers/snack-bar.helper';
import { RecipeService } from 'src/app/services/recipe-service/recipe.service';
import { Recipe } from 'src/models/recipe';

@Component( {
    selector: 'app-favourite-listing',
    templateUrl: './favourite-listing.component.html',
    styleUrls: [ './favourite-listing.component.scss' ],
    animations: [ AnimationHelper.getSimpleFade( 'fastFade', 200 ) ],
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
                this.recipes = plainToInstance( Recipe, data.recipes );
            }
        );
    }

    viewRecipe( recipe: Recipe | undefined ): void {
        this.router.navigate( [ `/recipes/${recipe?._id}` ], { state: { recipe: recipe } } );
    }
}
