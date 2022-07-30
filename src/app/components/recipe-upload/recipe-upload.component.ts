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

@Component( {
    selector: 'app-recipe-upload',
    templateUrl: './recipe-upload.component.html',
    styleUrls: [ './recipe-upload.component.scss' ],
    animations: [ AnimationHelper.getSimpleFade( 'fastFade', 200 ) ],
} )
export class RecipeUploadComponent implements OnInit {
    selectedImages!: File[];

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
        console.log( this.selectedImages );
    }

    saveRecipe() {
        const fd = new FormData();

        for ( let i = 0; i < this.selectedImages.length; i++ ) {
            fd.append( 'images', this.selectedImages[i] );
        }

        this.recipeService.uploadRecipe( fd ).subscribe( ( data: any ) => {
            console.log( data );
        } );
    }
}
