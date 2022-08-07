import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators,
} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RecipeService } from 'src/app/services/recipe-service/recipe.service';
import { Location } from '@angular/common';
import { AnimationHelper } from 'src/app/helpers/animation-helper';
import { SnackBarHelper } from 'src/app/helpers/snack-bar.helper';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ColorPalletEnum } from 'src/enums/colorPallet.enum';

@Component( {
    selector: 'app-recipe-upload',
    templateUrl: './recipe-upload.component.html',
    styleUrls: [ './recipe-upload.component.scss' ],
    animations: [ AnimationHelper.getSimpleFade( 'fastFade', 200 ) ],
} )
export class RecipeUploadComponent implements OnInit {
    @ViewChild( 'uploader' ) uploader!: ElementRef;

    selectedImages: File[] = [];
    selectedImageNames: string[] = [];
    selectedImagePaths: string[] = [];

    createForm: FormGroup;
    isDuplicateName!: boolean;
    allRecipeNames: string[] = [];

    // tags chip variables
    tags: string[] = [];
    addOnBlur = true;
    readonly separatorKeysCodes = [ ENTER, COMMA ] as const;

    constructor(
        private _snackBar: MatSnackBar,
        private fb: FormBuilder,
        private recipeService: RecipeService,
        private router: Router,
        private location: Location,
        private dialog: MatDialog
    ) {
        this.createForm = this.fb.group( {
            name: new FormControl( '', [ Validators.required ] ),
            prepTime: new FormControl( '', [] ),
            cookTime: new FormControl( '', [] ),
            ovenTemp: new FormControl( '', [] ),
            description: new FormControl( '', [] ),
            notes: new FormControl( '', [] ),
        } );
    }

    ngOnInit(): void {
        this.recipeService.getAllRecipes().subscribe( ( data: any ) => {
            const allRecipeNames: string[] = [];

            for ( let i = 0; i < data.recipes.length; i++ ) {
                allRecipeNames.push( data.recipes[i].name );
            }

            this.allRecipeNames = allRecipeNames;
        } );
    }

    imagePreview( file: any ) {
        this.selectedImagePaths = [];

        const reader = new FileReader();
        reader.onload = () => {
            this.selectedImagePaths.push( reader.result as string );
        };
        reader.readAsDataURL( file );
    }

    openSaveDialog(): void {
        const dialogRef = this.dialog.open( ConfirmationDialogComponent, {
            width: '450px',
            data: {
                title: 'Confirm Recipe',
                subtitle: `Create new recipe "${this.createForm.value.name}"?`,
                cancelBtnText: 'Cancel',
                cancelBtnColor: ColorPalletEnum.cancelRed,
                submitBtnText: 'Confirm',
                submitBtnColor: ColorPalletEnum.confirmGreen,
            },
        } );

        dialogRef.afterClosed().subscribe( ( result ) => {
            if ( result == true ) {
                this.saveRecipe();
            }
        } );
    }

    openCancelDialog(): void {
        if ( !this.formEmpty() ) {
            const dialogRef = this.dialog.open( ConfirmationDialogComponent, {
                width: '450px',
                data: {
                    title: 'Discard Recipe',
                    subtitle:
                        'Are you sure you want to discard your new recipe?',
                    cancelBtnText: 'Back',
                    cancelBtnColor: ColorPalletEnum.confirmGreen,
                    submitBtnText: 'Discard',
                    submitBtnColor: ColorPalletEnum.cancelRed,
                },
            } );

            dialogRef.afterClosed().subscribe( ( result ) => {
                if ( result == true ) {
                    this.goBack();
                }
            } );
        } else {
            this.goBack();
        }
    }

    private formEmpty(): boolean {
        if (
            this.createForm.value.name != '' ||
            this.uploader.nativeElement.value != '' ||
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

    determineDuplicateName(): void {
        if ( this.allRecipeNames.includes( this.createForm.value.name ) ) {
            this.isDuplicateName = true;
            this.createForm.controls['name'].setErrors( { incorrect: true } );
        } else {
            this.isDuplicateName = false;
        }
    }

    goBack() {
        this.location.back();
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

    onFileSelected( event: any ) {
        this.selectedImages = <File[]>event.target.files;
        this.selectedImageNames = [];

        for ( const file of event.target.files ) {
            this.selectedImageNames.push( file.name );
            this.imagePreview( file );
        }
    }

    removeUploads() {
        this.selectedImages = [];
        this.selectedImageNames = [];
        this.selectedImagePaths = [];
        this.uploader.nativeElement.value = '';
    }

    saveRecipe() {
        const fd = new FormData();
        const formObject = this.createForm.value;

        for ( let i = 0; i < this.selectedImages.length; i++ ) {
            fd.append( 'files', this.selectedImages[i] );
        }

        for ( let i = 0; i < this.tags.length; i++ ) {
            fd.append( 'tags', this.tags[i] );
        }

        fd.append( 'name', formObject.name );
        fd.append( 'prepTime', formObject.prepTime );
        fd.append( 'cookTime', formObject.cookTime );
        fd.append( 'ovenTemp', formObject.ovenTemp );
        fd.append( 'notes', formObject.notes );
        fd.append( 'description', formObject.description );

        this.recipeService.createRecipe( fd ).subscribe( ( data: any ) => {
            SnackBarHelper.triggerSnackBar(
                this._snackBar,
                `New recipe "${data.recipe.name}" was successfully created`,
                'Ok'
            );

            this.router.navigate( [ '/recipes' ] );
        } );
    }
}
