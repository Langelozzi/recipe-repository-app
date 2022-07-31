import { Ingredient } from './../../../models/ingredient';
import { Component, OnInit } from '@angular/core';
import {
    FormArray,
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Recipe } from '../../../models/recipe';
import { RecipeService } from '../../services/recipe-service/recipe.service';
import { SnackBarHelper } from '../../helpers/snack-bar.helper';
import { Router } from '@angular/router';

import { Location } from '@angular/common';
import { AnimationHelper } from 'src/app/helpers/animation-helper';

@Component( {
    selector: 'app-create-recipe-form',
    templateUrl: './create-recipe-form.component.html',
    styleUrls: [ './create-recipe-form.component.scss' ],
    animations: [ AnimationHelper.getSimpleFade( 'fastFade', 200 ) ],
} )
export class CreateRecipeFormComponent implements OnInit {
    createForm: FormGroup;

    // tags chip variables
    tags: string[] = [];
    addOnBlur = true;
    readonly separatorKeysCodes = [ ENTER, COMMA ] as const;

    constructor(
        private _snackBar: MatSnackBar,
        private fb: FormBuilder,
        private recipeService: RecipeService,
        private router: Router,
        private location: Location
    ) {
        this.createForm = this.fb.group( {
            name: new FormControl( '', [ Validators.required ] ),
            ingredients: this.fb.array( [
                this.fb.group( {
                    quantity: new FormControl( '', [ Validators.required ] ),
                    units: new FormControl( '', [ Validators.required ] ),
                    ingredient: new FormControl( '', [ Validators.required ] ),
                } ),
            ] ),
            steps: this.fb.array( [
                this.fb.group( {
                    step: new FormControl( '', [ Validators.required ] ),
                } ),
            ] ),
            prepTime: new FormControl( '', [] ),
            cookTime: new FormControl( '', [] ),
            ovenTemp: new FormControl( '', [] ),
            description: new FormControl( '', [] ),
            notes: new FormControl( '', [] ),
        } );
    }

    ngOnInit(): void {}

    public goBack() {
        this.location.back();
    }

    // ingredient related methods
    ingredients(): FormArray {
        return this.createForm.get( 'ingredients' ) as FormArray;
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
        return this.createForm.get( 'steps' ) as FormArray;
    }

    newStep() {
        return this.fb.group( {
            step: new FormControl( '', [ Validators.required ] ),
        } );
    }

    addStep() {
        this.steps().push( this.newStep() );
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
    private getNewRecipe(): object {
        const formObject = this.createForm.value;
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

        const newRecipe: Recipe = new Recipe(
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

        return newRecipe;
    }

    saveRecipe(): void {
        this.recipeService
            .createRecipe( this.getNewRecipe() )
            .subscribe( ( data: any ) => {
                SnackBarHelper.triggerSnackBar(
                    this._snackBar,
                    `New recipe "${data.recipe.name}" was successfully created`,
                    'Ok'
                );

                this.router.navigate( [ '/recipes' ] );
            } );
    }
}
