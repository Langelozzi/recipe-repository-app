import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeService } from '../../services/recipe-service/recipe.service';
import { plainToInstance } from 'class-transformer';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarHelper } from 'src/app/helpers/snack-bar.helper';
import { Recipe } from '../../../models/recipe';
import { AnimationHelper } from 'src/app/helpers/animation-helper';
import { RecipeBatch } from 'src/models/recipe-batch';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, observable } from 'rxjs';
import { RecipeVisibility } from 'src/enums/recipe-visibility.enum';

@Component( {
    selector: 'app-recipe-listing',
    templateUrl: './recipe-listing.component.html',
    styleUrls: [ './recipe-listing.component.scss' ],
    animations: [ AnimationHelper.getSimpleFade( 'fastFade', 200 ) ],
} )
export class RecipeListingComponent implements OnInit {
    @Input() communityRecipes = false;

    public listTitle = '';

    public recipeBatch!: RecipeBatch;
    public listedRecipes!: Recipe[];

    public sorted = false;
    public currentTag!: string;

    searchFg: FormGroup = new FormGroup( {
        searchBox: new FormControl( '' ),
    } );

    constructor(
        private recipeService: RecipeService,
        private router: Router,
        private _snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.listTitle = this.communityRecipes ? 'Community Recipes' : 'My Recipes';

        // define an observable to get the recipes
        const observable: Observable<object> = this.communityRecipes ? this.recipeService.getCommunityRecipes() : this.recipeService.getAllRecipes();

        observable.subscribe(
            // if the response is good then create list of recipes
            ( data: any ) => {
                this.recipeBatch = new RecipeBatch( plainToInstance( Recipe, data.recipes ) );

                if ( this.communityRecipes ) {
                    this.listedRecipes = this.recipeBatch.recipes.filter( recipe => recipe.visibility == RecipeVisibility.PUBLIC );
                } else {
                    this.listedRecipes = this.recipeBatch.recipes;
                }
            }
        );
    }

    viewRecipe( recipeId: string | undefined ): void {
        this.router.navigate( [ `/recipes/${recipeId}` ] );
    }

    showAllRecipes(): void {
        this.listedRecipes = this.recipeBatch.recipes;
        this.sorted = false;
    }

    sortByTag( tag: string ): void {
        this.listedRecipes = this.recipeBatch.getRecipesByTag( tag );
        this.currentTag = tag;

        this.sorted = true;
    }

    searchByName(): void {
        const searchString = this.searchFg.get( 'searchBox' )?.value;

        if ( searchString == '' ) {
            this.showAllRecipes();
        } else {
            this.listedRecipes = this.recipeBatch.searchByName( searchString );
        }

    }
}
