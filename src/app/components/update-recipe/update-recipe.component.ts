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
import { plainToInstance } from 'class-transformer';
import { SnackBarHelper } from 'src/app/helpers/snack-bar.helper';
import { RecipeService } from 'src/app/services/recipe-service/recipe.service';
import { Ingredient } from 'src/interfaces/ingredient';
import { Recipe } from 'src/models/recipe';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Location } from '@angular/common';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ColorPalletEnum } from 'src/enums/colorPallet.enum';
import { AnimationHelper } from 'src/app/helpers/animation-helper';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { ArrayHelper } from '../../helpers/array-helper';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-update-recipe',
    templateUrl: './update-recipe.component.html',
    styleUrls: ['./update-recipe.component.scss'],
    animations: [AnimationHelper.getSimpleFade('fastFade', 200)],
})
export class UpdateRecipeComponent implements OnInit {
    private recipeId: string | null;
    public recipe!: any;
    public recipeObs!: any;

    public editForm!: FormGroup;
    allRecipeNames: string[] = [];
    isDuplicateName!: boolean;

    // tags chip variables
    tags: string[] = [];
    addOnBlur = true;
    readonly separatorKeysCodes = [ENTER, COMMA] as const;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private recipeService: RecipeService,
        private _snackBar: MatSnackBar,
        private location: Location,
        private dialog: MatDialog
    ) {
        this.recipeId = this.route.snapshot.paramMap.get('id');
    }

    ngOnInit(): void {
        this.editForm = this.fb.group({
            name: new FormControl('', [Validators.required]),
            ingredients: this.fb.array([]),
            steps: this.fb.array([]),
            prepTime: new FormControl('', []),
            cookTime: new FormControl('', []),
            ovenTemp: new FormControl('', []),
            description: new FormControl('', []),
            notes: new FormControl('', []),
        });

        this.recipeObs = this.recipeService.getRecipeById(this.recipeId).pipe(
            tap((data: any) => {
                for (let i = 0; i < data.recipe.ingredients.length; i++) {
                    this.addIngredient();
                }

                for (let i = 0; i < data.recipe.steps.length; i++) {
                    this.addStep(data.recipe.steps[i]);
                }

                this.tags = data.recipe.tags;

                this.editForm.patchValue(data.recipe);
            })
        );

        this.recipeService.getRecipeById(this.recipeId).subscribe(
            (data: any) => {
                this.recipe = plainToInstance(Recipe, data.recipe);

                this.recipeService.getAllRecipes().subscribe((data: any) => {
                    const allRecipeNames: string[] = [];

                    for (let i = 0; i < data.recipes.length; i++) {
                        allRecipeNames.push(data.recipes[i].name);
                    }

                    // delete the name of the recipe you are editing
                    delete allRecipeNames[
                        allRecipeNames.indexOf(this.recipe.name)
                    ];

                    this.allRecipeNames = allRecipeNames;
                });
            },
            (err: any) => {
                SnackBarHelper.triggerSnackBar(this._snackBar, err, 'Ok');
            }
        );
    }

    openSaveDialog(): void {
        if (this.formChanged()) {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                width: '450px',
                data: {
                    title: 'Save Changes',
                    subtitle: `Are you sure you want to save the changes made to ${this.recipe.name}?`,
                    cancelBtnText: 'Cancel',
                    cancelBtnColor: ColorPalletEnum.cancelRed,
                    submitBtnText: 'Save',
                    submitBtnColor: ColorPalletEnum.confirmGreen,
                },
            });

            dialogRef.afterClosed().subscribe((result) => {
                if (result == true) {
                    this.saveChanges();
                }
            });
        } else {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                width: '450px',
                data: {
                    title: 'No changes made',
                    subtitle: `Strange. You have not made any changes to ${this.recipe.name}. Are you sure you would like to stop editing?`,
                    cancelBtnText: 'No',
                    cancelBtnColor: ColorPalletEnum.cancelRed,
                    submitBtnText: 'Yes',
                    submitBtnColor: ColorPalletEnum.confirmGreen,
                },
            });

            dialogRef.afterClosed().subscribe((result) => {
                if (result == true) {
                    this.goBack();
                }
            });
        }
    }

    openCancelDialog(): void {
        if (this.formChanged()) {
            const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
                width: '450px',
                data: {
                    title: 'Discard Changes',
                    subtitle: `Are you sure you want to discard the changes made to ${this.recipe.name}?`,
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
        if (this.allRecipeNames.includes(this.editForm.value.name)) {
            this.isDuplicateName = true;
            this.editForm.controls['name'].setErrors({ incorrect: true });
        } else {
            this.isDuplicateName = false;
        }
    }

    goBack() {
        this.location.back();
    }

    // ingredient related methods
    ingredients(): FormArray {
        return this.editForm.get('ingredients') as FormArray;
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
        return this.editForm.get('steps') as FormArray;
    }

    newStep(value?: string) {
        return new FormControl(`${value}`, [Validators.required]);
    }

    addStep(value?: string) {
        if (!value) {
            this.steps().push(this.newStep(""));
        } else {
            this.steps().push(this.newStep(value));
        }
    }

    removeStep(i: number) {
        this.steps().removeAt(i);
    }

    onStepDrop(event: CdkDragDrop<FormGroup>) {
        const sourceIndex = event.previousIndex;
        const targetIndex = event.currentIndex;

        this.moveFormGroupInArray(this.steps(), sourceIndex, targetIndex);
    }

    // tag related methods
    addTag(event: MatChipInputEvent): void {
        const value = (event.value || '').trim();

        if (value) {
            this.tags.push(value);
        }

        event.chipInput?.clear();
    }

    removeTag(tag: string): void {
        const index = this.tags.indexOf(tag);

        if (index >= 0) {
            this.tags.splice(index, 1);
        }
    }

    saveChanges(): void {
        // console.log( typeof this.recipe, this.recipe.name );
        this.recipeService.updateRecipe(this.getUpdatedRecipe()).subscribe(
            (data: any) => {
                SnackBarHelper.triggerSnackBar(
                    this._snackBar,
                    `"${data.updatedRecipe.name}" was successfully updated`,
                    'Ok'
                );

                this.router.navigate([`/recipes/${this.recipeId}`]);
            },
            (err: any) => {
                SnackBarHelper.triggerSnackBar(
                    this._snackBar,
                    'Failed to create new recipe',
                    'Ok'
                );
            }
        );
    }

    // service related methods
    private getUpdatedRecipe(): Recipe {
        const formObject = this.editForm.value;
        const ingredients: Ingredient[] = [];

        formObject.ingredients.forEach((ingredient: any) => {
            const newIng: Ingredient = {
                quantity: ingredient.quantity,
                units: ingredient.units,
                ingredient: ingredient.ingredient,
            };

            ingredients.push(newIng);
        });

        this.recipe.update(
            formObject.name,
            ingredients,
            formObject.steps,
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

    private formChanged(): boolean {
        if (
            this.recipe.name != this.editForm.value.name ||
            !ArrayHelper.areEqualObjects(
                this.recipe.ingredients,
                this.editForm.value.ingredients
            ) ||
            !ArrayHelper.areEqual(
                this.recipe.steps,
                this.editForm.value.steps
            ) ||
            this.recipe.prepTime != this.editForm.value.prepTime ||
            this.recipe.cookTime != this.editForm.value.cookTime ||
            this.recipe.ovenTemp != this.editForm.value.ovenTemp ||
            this.recipe.description != this.editForm.value.description ||
            this.recipe.notes != this.editForm.value.notes ||
            !ArrayHelper.areEqual(this.recipe.tags, this.tags)
        ) {
            return true;
        } else {
            return false;
        }
    }

    private moveFormGroupInArray(formArray: FormArray, sourceIndex: number, destinationIndex: number) {
        const formGroupToMove = formArray.at(sourceIndex) as FormControl;
        formArray.removeAt(sourceIndex);
        formArray.insert(destinationIndex, formGroupToMove)
    }
}
