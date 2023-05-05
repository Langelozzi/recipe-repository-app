import { Ingredient } from '../../../interfaces/ingredient';
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
import { ColorPalletEnum } from 'src/enums/colorPallet.enum';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-create-recipe-form',
    templateUrl: './create-recipe-form.component.html',
    styleUrls: ['./create-recipe-form.component.scss'],
    animations: [AnimationHelper.getSimpleFade('fastFade', 200)],
})
export class CreateRecipeFormComponent implements OnInit {
    createForm: FormGroup;
    isDuplicateName!: boolean;
    private allRecipeNames: string[] = [];

    // tags chip variables
    tags: string[] = [];
    addOnBlur = true;
    readonly separatorKeysCodes = [ENTER, COMMA] as const;

    constructor(
        private _snackBar: MatSnackBar,
        private fb: FormBuilder,
        private recipeService: RecipeService,
        private router: Router,
        private location: Location,
        private dialog: MatDialog
    ) {
        this.createForm = this.fb.group({
            name: new FormControl('', [Validators.required]),
            ingredients: this.fb.array([
                this.fb.group({
                    quantity: new FormControl('', [Validators.required]),
                    units: new FormControl('', [Validators.required]),
                    ingredient: new FormControl('', [Validators.required]),
                }),
            ]),
            steps: this.fb.array([new FormControl('', [Validators.required])]),
            prepTime: new FormControl('', []),
            cookTime: new FormControl('', []),
            ovenTemp: new FormControl('', []),
            description: new FormControl('', []),
            notes: new FormControl('', []),
        });
    }

    ngOnInit(): void {
        this.recipeService.getAllRecipes().subscribe((data: any) => {
            const allRecipeNames: string[] = [];

            for (let i = 0; i < data.recipes.length; i++) {
                allRecipeNames.push(data.recipes[i].name);
            }

            this.allRecipeNames = allRecipeNames;
        });
    }

    goBack() {
        this.location.back();
    }

    openSaveDialog(): void {
        const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
            width: '450px',
            data: {
                title: 'Confirm Recipe',
                subtitle: `Create new recipe "${this.createForm.value.name}"?`,
                cancelBtnText: 'Cancel',
                cancelBtnColor: ColorPalletEnum.cancelRed,
                submitBtnText: 'Confirm',
                submitBtnColor: ColorPalletEnum.confirmGreen,
            },
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result == true) {
                this.saveRecipe();
            }
        });
    }

    openCancelDialog(): void {
        if (!this.formEmpty()) {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                width: '450px',
                data: {
                    title: 'Discard Recipe',
                    subtitle:
                        'Are you sure you want to discard your new recipe?',
                    cancelBtnText: 'Cancel',
                    cancelBtnColor: ColorPalletEnum.confirmGreen,
                    submitBtnText: 'Discard',
                    submitBtnColor: ColorPalletEnum.cancelRed,
                },
            });

            dialogRef.afterClosed().subscribe((result) => {
                if (result == true) {
                    this.goBack();
                }
            });
        } else {
            this.goBack();
        }
    }

    determineDuplicateName(): void {
        if (this.allRecipeNames.includes(this.createForm.value.name)) {
            this.isDuplicateName = true;
            this.createForm.controls['name'].setErrors({ incorrect: true });
        } else {
            this.isDuplicateName = false;
        }
    }

    // ingredient related methods
    ingredients(): FormArray {
        return this.createForm.get('ingredients') as FormArray;
    }

    newIngredient() {
        return this.fb.group({
            quantity: new FormControl('', [Validators.required]),
            units: new FormControl('', [Validators.required]),
            ingredient: new FormControl('', [Validators.required]),
        });
    }

    addIngredient() {
        this.ingredients().push(this.newIngredient());
    }

    removeIngredient(i: number) {
        this.ingredients().removeAt(i);
    }

    onIngredientDrop(event: CdkDragDrop<FormGroup>) {
        const sourceIndex = event.previousIndex;
        const targetIndex = event.currentIndex;

        this.moveFormGroupInArray(this.ingredients(), sourceIndex, targetIndex);
    }

    // steps related methods
    steps(): FormArray {
        return this.createForm.get('steps') as FormArray;
    }

    newStep() {
        return new FormControl('', [Validators.required]);
    }

    addStep() {
        this.steps().push(this.newStep());
    }

    removeStep(i: number) {
        this.steps().removeAt(i);
    }

    // tag related methods
    addTag(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();

        if (value) {
            this.tags.push(value.trim());
        }

        event.chipInput?.clear();
    }

    removeTag(tag: string): void {
        const index = this.tags.indexOf(tag);

        if (index >= 0) {
            this.tags.splice(index, 1);
        }
    }

    saveRecipe(): void {
        this.recipeService
            .createRecipe(this.getNewRecipe())
            .subscribe((data: any) => {
                SnackBarHelper.triggerSnackBar(
                    this._snackBar,
                    `New recipe "${data.recipe.name}" was successfully created`,
                    'Ok'
                );

                this.router.navigate(['/recipes']);
            });
    }

    // service related methods
    private getNewRecipe(): object {
        const formObject = this.createForm.value;
        const ingredients: Ingredient[] = [];
        const steps: string[] = [];

        formObject.ingredients.forEach((ingredient: any) => {
            const newIng: Ingredient = {
                quantity: ingredient.quantity,
                units: ingredient.units,
                ingredient: ingredient.ingredient.trim(),
            };

            ingredients.push(newIng);
        });

        formObject.steps.forEach((step: any) => {
            steps.push(step.trim());
        });

        const newRecipe: Recipe = new Recipe(
            formObject.name.trim(),
            ingredients,
            steps,
            false,
            formObject.prepTime,
            formObject.cookTime,
            formObject.ovenTemp,
            formObject.notes.trim(),
            undefined,
            undefined,
            this.tags,
            formObject.description.trim()
        );

        return newRecipe;
    }

    private formEmpty(): boolean {
        let noIngredients = true;

        for (let i = 0; i < this.createForm.value.ingredients.length; i++) {
            for (const key in this.createForm.value.ingredients[i]) {
                if (this.createForm.value.ingredients[i][key] != '') {
                    noIngredients = false;
                    break;
                }
            }
        }

        if (
            this.createForm.value.name != '' ||
            !noIngredients ||
            this.createForm.value.steps[0] != '' ||
            this.createForm.value.prepTime != '' ||
            this.createForm.value.cookTime != '' ||
            this.createForm.value.ovenTemp != '' ||
            this.createForm.value.description != '' ||
            this.createForm.value.notes != '' ||
            this.tags.length > 0
        ) {
            return false;
        } else {
            return true;
        }
    }

    private moveFormGroupInArray(formArray: FormArray, sourceIndex: number, destinationIndex: number) {
        const formGroupToMove = this.ingredients().at(sourceIndex) as FormGroup;
        formArray.removeAt(sourceIndex);
        formArray.insert(destinationIndex, formGroupToMove)
    }
}
