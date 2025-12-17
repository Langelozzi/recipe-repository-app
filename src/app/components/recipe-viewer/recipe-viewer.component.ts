import { Recipe } from './../../../models/recipe';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Navigation, Router } from '@angular/router';
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
import { forkJoin, first } from 'rxjs';
import { AuthService } from '../../services/auth-service/auth.service';

@Component({
    selector: 'app-recipe-viewer',
    templateUrl: './recipe-viewer.component.html',
    styleUrls: ['./recipe-viewer.component.scss'],
    animations: [AnimationHelper.getSimpleFade('fastFade', 200)],
})
export class RecipeViewerComponent implements OnInit {
    public recipeId: string | null;
    public recipe!: any;
    public isOwner = false;
    private currentUserId?: string;
    public hasOptionalDetails!: boolean;
    public images?: any = [];
    public ingredientMultiplier = 1;
    private previousPage: string | undefined;
    private navigation: Navigation | null;

    // ingredient arrays
    public firstHalfOfIngredients!: Ingredient[];
    public secondHalfOfIngredients!: Ingredient[];

    constructor(
        private route: ActivatedRoute,
        private recipeService: RecipeService,
        private _snackBar: MatSnackBar,
        private router: Router,
        private location: Location,
        private dialog: MatDialog,
        private authService: AuthService
    ) {
<<<<<<< HEAD
        this.recipeId = this.route.snapshot.paramMap.get('id');
        this.previousPage = this.router
            .getCurrentNavigation()
=======
        this.recipeId = this.route.snapshot.paramMap.get( 'id' );
        this.navigation = this.router.getCurrentNavigation();
        this.previousPage = this.navigation
>>>>>>> origin/master
            ?.previousNavigation?.finalUrl?.toString();
    }

    ngOnInit(): void {
<<<<<<< HEAD
        if (!this.recipeId) { return; }

        forkJoin([
            this.authService.getCurrentUser(),
            this.recipeService.getRecipeById(this.recipeId)
        ]).subscribe((results: any[]) => {
            const userRes = results[0];
            const recipeRes = results[1];

            this.currentUserId = userRes?.user?._id || userRes?._id;
            this.recipe = plainToInstance(Recipe, recipeRes.recipe);

            this.isOwner = !!(
                this.currentUserId &&
                (this.recipe.userId === this.currentUserId || this.recipe.user?.userId === this.currentUserId)
            );

            this.splitIngredients();
            this.cleanIngredientData();
        });
=======
        if ( this.navigation?.extras.state ) {
            const recipe = this.navigation.extras.state['recipe'];
            this.recipe = recipe;
            this.splitIngredients();
            this.cleanIngredientData();
        } else {
            this.recipeService
                .getRecipeById( this.recipeId )
                .subscribe( ( data: any ) => {
                    this.recipe = plainToInstance( Recipe, data.recipe );
                    this.splitIngredients();
                    this.cleanIngredientData();
                } );
        }

>>>>>>> origin/master
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '450px',
            data: {
                title: 'Delete Recipe',
                subtitle: `Are you sure you want to delete ${this.recipe.name}?`,
                cancelBtnText: 'Cancel',
                cancelBtnColor: ColorPalletEnum.confirmGreen,
                submitBtnText: 'Delete',
                submitBtnColor: ColorPalletEnum.cancelRed,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result == true) {
                this.deleteRecipe();
            }
        });
    }

    goBack(): void {
        if (!(this.previousPage == '/recipes' || this.previousPage == '/userhome' || this.previousPage == '/recipes/favourites' || this.previousPage == '/feed')) {
            this.router.navigate(['/recipes']);
        } else {
            this.location.back();
        }
    }

    getRandomChipColor(): string {
        return ArrayHelper.getRandomArrItem([
            ColorPalletEnum.darkPrimary,
            ColorPalletEnum.primary,
            ColorPalletEnum.accent,
        ]);
    }

    getDividerHeight(): string {
        const height = 40 * this.firstHalfOfIngredients.length;

        return `${height}px`;
    }

    isLastIngredient(ingrArray: Ingredient[], index: number): boolean {
        if (index == ingrArray.length) {
            return true;
        } else {
            return false;
        }
    }

    openEditPage(): void {
        if (!this.isOwner) { return; }
        this.router.navigate([`/recipes/${this.recipeId}/edit`]);
    }

    deleteRecipe(): void {
        if (!this.isOwner) { return; }
        this.recipeService.deleteRecipeById(this.recipeId).subscribe(
            (data: any) => {
                SnackBarHelper.triggerSnackBar(
                    this._snackBar,
                    `"${this.recipe.name}" was successfully deleted`,
                    'Ok'
                );

                this.router.navigate(['/recipes']);
            },
            (err: any) => {
                SnackBarHelper.triggerSnackBar(
                    this._snackBar,
                    `An unexpected error occurred while deleting "${this.recipe.name}"`,
                    'Ok'
                );
            }
        );
    }

    addToFavourites(): void {
        if (!this.isOwner) { return; }
        this.recipe.updateFavouriteStatus(true);

        this.recipeService.updateRecipe(this.recipe).subscribe(
            (data: any) => {
                SnackBarHelper.triggerSnackBar(
                    this._snackBar,
                    `"${this.recipe.name}" successfully added to favourites`,
                    'Ok'
                );
            },
            (err: any) => {
                SnackBarHelper.triggerSnackBar(
                    this._snackBar,
                    `An unexpected error occurred. "${this.recipe.name}" was not added to favourites`,
                    'Ok'
                );
            }
        );
    }

    removeFromFavourites(): void {
        if (!this.isOwner) { return; }
        this.recipe.favourite = false;

        this.recipeService.updateRecipe(this.recipe).subscribe(
            (data: any) => {
                SnackBarHelper.triggerSnackBar(
                    this._snackBar,
                    `"${this.recipe.name}" successfully removed from favourites`,
                    'Ok'
                );
            },
            (err: any) => {
                SnackBarHelper.triggerSnackBar(
                    this._snackBar,
                    `An unexpected error occurred. "${this.recipe.name}" was not removed from favourites`,
                    'Ok'
                );
            }
        );
    }

    makeRecipePublic(): void {
        if (!this.isOwner) { return; }
        this.recipe.visibility = 1;

        this.recipeService.updateRecipe(this.recipe).subscribe(
            (data: any) => {
                SnackBarHelper.triggerSnackBar(
                    this._snackBar,
                    `"${this.recipe.name}" is now public`,
                    'Ok'
                );
            },
            (err: any) => {
                SnackBarHelper.triggerSnackBar(
                    this._snackBar,
                    `An unexpected error occurred. "${this.recipe.name}" visibility was not changed`,
                    'Ok'
                );
            }
        );
    }

    makeRecipePrivate(): void {
        if (!this.isOwner) { return; }
        this.recipe.visibility = 0;
        this.recipeService.updateRecipe(this.recipe).subscribe(
            (data: any) => {
                SnackBarHelper.triggerSnackBar(
                    this._snackBar,
                    `"${this.recipe.name}" is now private`,
                    'Ok'
                );
            },
            (err: any) => {
                SnackBarHelper.triggerSnackBar(
                    this._snackBar,
                    `An unexpected error occurred. "${this.recipe.name}" visibility was not changed`,
                    'Ok'
                );
            }
        );
    }

    duplicateRecipe(): void {
        this.recipeService.duplicateRecipe(this.recipeId).pipe(first()).subscribe({
            next: (data: any) => {
                const snackBarRef = SnackBarHelper.triggerSnackBar(
                    this._snackBar,
                    `"${this.recipe.name}" successfully duplicated. "${data.recipe.name}" was created`,
                    'Open'
                );
                snackBarRef.onAction().subscribe(() => {
                    this.router.navigate([`/recipes/${data.recipe._id}`])
                        .then(() => window.location.reload());
                });
            },
            error: (err: any) => {
                SnackBarHelper.triggerSnackBar(
                    this._snackBar,
                    `An unexpected error occurred. "${this.recipe.name}" was not duplicated`,
                    'Ok'
                );
            }
        });
    }

    onMultiplyServings(multiplier: number): void {
        this.ingredientMultiplier = multiplier;
    }

<<<<<<< HEAD
    calculateIngredientAmount(amount: any): string {
        if (this.isNumber(amount)) return `${this.decimalToFraction(amount * this.ingredientMultiplier)}`;

        try {
            const decimalNum = this.twoPartFractionToDecimal(amount);

            return `${this.decimalToFraction(decimalNum * this.ingredientMultiplier)}`;
        } catch (error) {
=======
    calculateIngredientAmount( amount: any ): string {
        if ( this.isNumber( amount ) ) return `${this.decimalToFraction( amount * this.ingredientMultiplier )}`;

        try {
            const decimalNum = this.twoPartFractionToDecimal( amount );
            if ( decimalNum == null || decimalNum == undefined || Number.isNaN( decimalNum ) ) return amount;

            return `${this.decimalToFraction( decimalNum * this.ingredientMultiplier )}`;
        } catch ( error ) {
>>>>>>> origin/master
            return amount;
        }
    }

    private isNumber(value: any): boolean {
        try {
            return !isNaN(eval(value));
        } catch (e) {
            return false;
        }
    }

    private decimalToFraction(value: number): string {
        // if its a whole number, return it
        if (value % 1 == 0) return value.toString();

        const tolerance = 1.0E-6;
        let numerator = 1;
        let h2 = 0;
        let denominator = 0;
        let k2 = 1;
        let b = value;
        do {
            const a = Math.floor(b);
            let aux = numerator;
            numerator = a * numerator + h2;
            h2 = aux;
            aux = denominator;
            denominator = a * denominator + k2;
            k2 = aux;
            b = 1 / (b - a);
        }
        while (Math.abs(value - numerator / denominator) > value * tolerance);

        return numerator > denominator ?
<<<<<<< HEAD
            this.fractionToTwoPartFraction(`${numerator}/${denominator}`)
=======
            this.fractionToTwoPartFraction( `${numerator}/${denominator}` )
>>>>>>> origin/master
            : `${numerator}/${denominator}`;
    }

    private twoPartFractionToDecimal(value: string): number {
        const fraction = value.trim().split(/\s+/);
        const wholeNumber = Number(fraction[0]);
        const fractionParts = fraction[1].split('/');
        const denominator = Number(fractionParts[1]);
        const numerator = (wholeNumber * denominator) + Number(fractionParts[0]);

        return numerator / denominator;
    }

    private fractionToTwoPartFraction(value: string): string {
        const splitFraction = value.trim().split('/');
        const numerator = Number(splitFraction[0]);
        const denominator = Number(splitFraction[1]);
        const wholeNumber = Math.floor(numerator / denominator);

        return `${wholeNumber} ${numerator % denominator}/${denominator}`;
    }

    private splitIngredients(): void {
        const middleIndex = Math.ceil(this.recipe.ingredients.length / 2);

        this.firstHalfOfIngredients = this.recipe.ingredients.slice(
            0,
            middleIndex
        );

        this.secondHalfOfIngredients = this.recipe.ingredients.slice(
            middleIndex,
            this.recipe.ingredients.length
        );
    }

    private cleanIngredientData(): void {
        this.recipe.ingredients.map((ingr: Ingredient) => {
            ingr.quantity = this.isNumber(ingr.quantity) ? eval(`${ingr.quantity}`) : ingr.quantity;
        });
    }

}
