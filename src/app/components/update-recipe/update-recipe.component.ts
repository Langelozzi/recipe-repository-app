import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { plainToClass } from 'class-transformer';
import { SnackBarHelper } from 'src/app/helpers/snack-bar.helper';
import { RecipeService } from 'src/app/services/recipe-service/recipe.service';
import { Ingredient } from 'src/models/ingredient';
import { Recipe } from 'src/models/recipe';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Location } from '@angular/common';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ColorPalletEnum } from 'src/enums/colorPallet.enum';

@Component( {
    selector: 'app-update-recipe',
    templateUrl: './update-recipe.component.html',
    styleUrls: [ './update-recipe.component.scss' ],
} )
export class UpdateRecipeComponent implements OnInit {
    private recipeId: string | null;
    public recipe!: any;
    public recipeObs!: any;

    public editForm!: FormGroup;

    // tags chip variables
    tags: string[] = [];
    addOnBlur = true;
    readonly separatorKeysCodes = [ ENTER, COMMA ] as const;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private recipeService: RecipeService,
        private _snackBar: MatSnackBar,
        private location: Location,
        private dialog: MatDialog
    ) {
        this.recipeId = this.route.snapshot.paramMap.get( 'id' );
    }

    ngOnInit(): void {
        this.editForm = this.fb.group( {
            name: new FormControl( '', [ Validators.required ] ),
            ingredients: this.fb.array( [] ),
            steps: this.fb.array( [] ),
            prepTime: new FormControl( '', [] ),
            cookTime: new FormControl( '', [] ),
            ovenTemp: new FormControl( '', [] ),
            description: new FormControl( '', [] ),
            notes: new FormControl( '', [] ),
        } );

        this.recipeObs = this.recipeService.getRecipeById( this.recipeId ).pipe(
            tap( ( data: any ) => {
                for ( let i = 0; i < data.recipe.ingredients.length; i++ ) {
                    this.addIngredient();
                }

                for ( let i = 0; i < data.recipe.steps.length; i++ ) {
                    this.addStep( data.recipe.steps[i] );
                }

                this.tags = data.recipe.tags;

                this.editForm.patchValue( data.recipe );
            } )
        );

        this.recipeService.getRecipeById( this.recipeId ).subscribe(
            ( data: any ) => {
                this.recipe = plainToClass( Recipe, data.recipe );
            },
            ( err: any ) => {
                SnackBarHelper.triggerSnackBar( this._snackBar, err, 'Ok' );
            }
        );
    }

    openDialog(): void {
        const dialogRef = this.dialog.open( ConfirmationDialogComponent, {
            width: '450px',
            data: {
                title: 'Save Changes',
                subtitle: `Are you sure you want to save the changes made to ${this.recipe.name}?`,
                cancelBtnText: 'Cancel',
                cancelBtnColor: ColorPalletEnum.cancelRed,
                submitBtnText: 'Save',
                submitBtnColor: ColorPalletEnum.confirmGreen,
            },
        } );

        dialogRef.afterClosed().subscribe( ( result ) => {
            if ( result == true ) {
                this.saveChanges();
            }
        } );
    }

    goBack() {
        this.location.back();
    }

    // ingredient related methods
    ingredients(): FormArray {
        return this.editForm.get( 'ingredients' ) as FormArray;
    }

    newIngredient() {
        return this.fb.group( {
            quantity: new FormControl( '', [ Validators.required ] ),
            units: new FormControl( '', [ Validators.required ] ),
            ingredient: new FormControl( '', [ Validators.required ] ),
        } );
    }

    addIngredient() {
        this.ingredients().push( this.newIngredient() );
    }

    removeIngredient( i: number ) {
        this.ingredients().removeAt( i );
    }

    // steps related methods
    steps(): FormArray {
        return this.editForm.get( 'steps' ) as FormArray;
    }

    newStep( value?: string ) {
        return this.fb.group( {
            step: new FormControl( `${value}`, [ Validators.required ] ),
        } );
    }

    addStep( value?: string ) {
        this.steps().push( this.newStep( value ) );
    }

    removeStep( i: number ) {
        this.steps().removeAt( i );
    }

    // tag related methods
    addTag( event: MatChipInputEvent ): void {
        const value = ( event.value || '' ).trim();

        if ( value ) {
            this.tags.push( value );
        }

        event.chipInput?.clear();
    }

    removeTag( tag: string ): void {
        const index = this.tags.indexOf( tag );

        if ( index >= 0 ) {
            this.tags.splice( index, 1 );
        }
    }

    // service related methods
    private getUpdatedRecipe(): Recipe {
        const formObject = this.editForm.value;
        const ingredients: Ingredient[] = [];
        const steps: string[] = [];

        formObject.ingredients.forEach( ( ingredient: any ) => {
            const newIng: Ingredient = {
                quantity: ingredient.quantity,
                units: ingredient.units,
                ingredient: ingredient.ingredient,
            };

            ingredients.push( newIng );
        } );

        formObject.steps.forEach( ( step: any ) => {
            steps.push( step.step );
        } );

        this.recipe.update(
            formObject.name,
            ingredients,
            steps,
            false,
            formObject.prepTime,
            formObject.cookTime,
            formObject.ovenTemp,
            formObject.notes,
            undefined,
            undefined,
            this.tags,
            formObject.description
        );

        return this.recipe;
    }

    saveChanges(): void {
        // console.log( typeof this.recipe, this.recipe.name );
        this.recipeService.updateRecipe( this.getUpdatedRecipe() ).subscribe(
            ( data: any ) => {
                SnackBarHelper.triggerSnackBar(
                    this._snackBar,
                    `"${data.updatedRecipe.name}" was successfully updated`,
                    'Ok'
                );

                this.router.navigate( [ `/recipes/${this.recipeId}` ] );
            },
            ( err: any ) => {
                SnackBarHelper.triggerSnackBar(
                    this._snackBar,
                    'Failed to create new recipe',
                    'Ok'
                );
            }
        );
    }
}
