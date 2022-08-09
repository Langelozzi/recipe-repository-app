import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeService } from '../../services/recipe-service/recipe.service';
import { plainToClass } from 'class-transformer';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarHelper } from 'src/app/helpers/snack-bar.helper';
import { Recipe } from '../../../models/recipe';
import { AnimationHelper } from 'src/app/helpers/animation-helper';
import { RecipeBatch } from 'src/models/recipe-batch';

@Component( {
    selector: 'app-recipe-listing',
    templateUrl: './recipe-listing.component.html',
    styleUrls: [ './recipe-listing.component.scss' ],
    animations: [ AnimationHelper.getSimpleFade( 'fastFade', 200 ) ],
} )
export class RecipeListingComponent implements OnInit {
    public recipeBatch!: RecipeBatch;
    public listedRecipes!: Recipe[];

    constructor(
        private recipeService: RecipeService,
        private router: Router,
        private _snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.recipeService.getAllRecipes().subscribe(
            // if the response is good then create list of recipes
            ( data: any ) => {
                this.recipeBatch = new RecipeBatch( plainToClass( Recipe, data.recipes ) );

                this.listedRecipes = this.recipeBatch.recipes;
            }
        );
    }

    viewRecipe( recipeId: string | undefined ): void {
        this.router.navigate( [ `/recipes/${recipeId}` ] );
    }

    sortByTag( tag: string ): void {
        this.listedRecipes = this.recipeBatch.getRecipesByTag( tag );

        // figure out a way to make it visibly clear which tag it is now sorting by
    }
}
