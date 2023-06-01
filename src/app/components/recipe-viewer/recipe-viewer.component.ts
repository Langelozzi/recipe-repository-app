import { Recipe } from './../../../models/recipe';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../../services/recipe-service/recipe.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarHelper } from 'src/app/helpers/snack-bar.helper';
import { plainToInstance } from 'class-transformer';
import { ArrayHelper } from '../../helpers/array-helper';
import { ColorPalletEnum } from '../../../enums/colorPallet.enum';
import { Ingredient } from '../../../interfaces/ingredient';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { AnimationHelper } from 'src/app/helpers/animation-helper';
import { concatMap, first, tap } from 'rxjs';

@Component( {
    selector: 'app-recipe-viewer',
    templateUrl: './recipe-viewer.component.html',
    styleUrls: [ './recipe-viewer.component.scss' ],
    animations: [ AnimationHelper.getSimpleFade( 'fastFade', 200 ) ],
} )
export class RecipeViewerComponent implements OnInit {
    private recipeId: string | null;
    public recipe!: any;
    public hasOptionalDetails!: boolean;
    public images?: any = [];
    private previousPage: string | undefined;

    // ingredient arrays
    public firstHalfOfIngredients!: Ingredient[];
    public secondHalfOfIngredients!: Ingredient[];

    constructor(
        private route: ActivatedRoute,
        private recipeService: RecipeService,
        private _snackBar: MatSnackBar,
        private router: Router,
        private location: Location,
        private dialog: MatDialog
    ) {
        this.recipeId = this.route.snapshot.paramMap.get( 'id' );
        this.previousPage = this.router
            .getCurrentNavigation()
            ?.previousNavigation?.finalUrl?.toString();
    }

    ngOnInit(): void {
        this.recipeService
            .getRecipeById( this.recipeId )
            .subscribe( ( data: any ) => {
                this.recipe = plainToInstance( Recipe, data.recipe );
                this.splitIngredients();
            } );
    }

    openDialog(): void {
        const dialogRef = this.dialog.open( ConfirmationDialogComponent, {
            width: '450px',
            data: {
                title: 'Delete Recipe',
                subtitle: `Are you sure you want to delete ${this.recipe.name}?`,
                cancelBtnText: 'Cancel',
                cancelBtnColor: ColorPalletEnum.confirmGreen,
                submitBtnText: 'Delete',
                submitBtnColor: ColorPalletEnum.cancelRed,
            },
        } );

        dialogRef.afterClosed().subscribe( ( result ) => {
            if ( result == true ) {
                this.deleteRecipe();
            }
        } );
    }

    goBack(): void {
        if ( !( this.previousPage == '/recipes' || this.previousPage == '/userhome' || this.previousPage == '/recipes/favourites' ) ) {
            this.router.navigate( [ '/recipes' ] );
        } else {
            this.location.back();
        }
    }

    getRandomChipColor(): string {
        return ArrayHelper.getRandomArrItem( [
            ColorPalletEnum.darkPrimary,
            ColorPalletEnum.primary,
            ColorPalletEnum.accent,
        ] );
    }

    getDividerHeight(): string {
        const height = 40 * this.firstHalfOfIngredients.length;

        return `${height}px`;
    }

    isLastIngredient( ingrArray: Ingredient[], index: number ): boolean {
        if ( index == ingrArray.length ) {
            return true;
        } else {
            return false;
        }
    }


    openEditPage(): void {
        this.router.navigate( [ `/recipes/${this.recipeId}/edit` ] );
    }

    deleteRecipe(): void {
        this.recipeService.deleteRecipeById( this.recipeId ).subscribe(
            ( data: any ) => {
                SnackBarHelper.triggerSnackBar(
                    this._snackBar,
                    `"${this.recipe.name}" was successfully deleted`,
                    'Ok'
                );

                this.router.navigate( [ '/recipes' ] );
            },
            ( err: any ) => {
                SnackBarHelper.triggerSnackBar(
                    this._snackBar,
                    `An unexpected error occurred while deleting "${this.recipe.name}"`,
                    'Ok'
                );
            }
        );
    }

    addToFavourites(): void {
        this.recipe.updateFavouriteStatus( true );

        this.recipeService.updateRecipe( this.recipe ).subscribe(
            ( data: any ) => {
                SnackBarHelper.triggerSnackBar(
                    this._snackBar,
                    `"${this.recipe.name}" successfully added to favourites`,
                    'Ok'
                );
            },
            ( err: any ) => {
                SnackBarHelper.triggerSnackBar(
                    this._snackBar,
                    `An unexpected error occurred. "${this.recipe.name}" was not added to favourites`,
                    'Ok'
                );
            }
        );
    }

    removeFromFavourites(): void {
        this.recipe.favourite = false;

        this.recipeService.updateRecipe( this.recipe ).subscribe(
            ( data: any ) => {
                SnackBarHelper.triggerSnackBar(
                    this._snackBar,
                    `"${this.recipe.name}" successfully removed from favourites`,
                    'Ok'
                );
            },
            ( err: any ) => {
                SnackBarHelper.triggerSnackBar(
                    this._snackBar,
                    `An unexpected error occurred. "${this.recipe.name}" was not removed from favourites`,
                    'Ok'
                );
            }
        );
    }

    duplicateRecipe(): void {
        this.recipeService.duplicateRecipe( this.recipeId ).pipe( first() ).subscribe( {
            next: ( data: any ) => {
                const snackBarRef = SnackBarHelper.triggerSnackBar(
                    this._snackBar,
                    `"${this.recipe.name}" successfully duplicated. "${data.recipe.name}" was created`,
                    'Open'
                );
                snackBarRef.onAction().subscribe( () => {
                    this.router.navigate( [ `/recipes/${data.recipe._id}` ] )
                        .then( () => window.location.reload() );
                } );
            },
            error: ( err: any ) => {
                SnackBarHelper.triggerSnackBar(
                    this._snackBar,
                    `An unexpected error occurred. "${this.recipe.name}" was not duplicated`,
                    'Ok'
                );
            }
        } );
    }


    private splitIngredients(): void {
        const middleIndex = Math.ceil( this.recipe.ingredients.length / 2 );

        this.firstHalfOfIngredients = this.recipe.ingredients.slice(
            0,
            middleIndex
        );

        this.secondHalfOfIngredients = this.recipe.ingredients.slice(
            middleIndex,
            this.recipe.ingredients.length
        );
    }
}
