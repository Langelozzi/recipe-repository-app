import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
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

@Component( {
    selector: 'app-recipe-upload',
    templateUrl: './recipe-upload.component.html',
    styleUrls: [ './recipe-upload.component.scss' ],
    animations: [ AnimationHelper.getSimpleFade( 'fastFade', 200 ) ],
} )
export class RecipeUploadComponent implements OnInit {
    selectedImages!: File[];
    selectedImageNames: string[] = [];

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
        }
    }

    removeUploads() {
        this.selectedImages = [];
        this.selectedImageNames = [];
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
