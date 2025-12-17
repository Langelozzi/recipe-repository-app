import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../../../models/recipe';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { Subject, catchError, first, map } from 'rxjs';
import { response } from 'express';
import { CachingService } from '../caching-service/caching.service';
import { plainToInstance } from 'class-transformer';

@Injectable({
    providedIn: 'root',
})
export class RecipeService {
    currentRecipe = new Subject<Recipe>();

<<<<<<< HEAD
    constructor(private http: HttpClient) { }

    createRecipe(body: any): Observable<object> {
        return this.http.post(`${environment.baseApiUrl}/recipes/create`, body);
    }

    uploadRecipe(body: any) {
        return this.http.post(`${environment.baseApiUrl}/recipes/upload`, body);
    }

    getAllRecipes(): Observable<object> {
        return this.http.get(`${environment.baseApiUrl}/recipes`);
    }

    getPublicRecipes(): Observable<object> {
        return this.http.get(`${environment.baseApiUrl}/recipes/public`);
    }

    getFavouriteRecipes(): Observable<object> {
        return this.http.get(`${environment.baseApiUrl}/recipes/favourites`);
    }

    getRecipeById(recipeId: string | null): Observable<object> {
        return this.http.get(`${environment.baseApiUrl}/recipes/${recipeId}`);
=======
    constructor( private http: HttpClient, private cachingService: CachingService ) {}

    createRecipe( body: any ): Observable<object> {
        return this.http.post( `${environment.baseApiUrl}/recipes/create`, body ).pipe(
            map( ( data: any ) => {
                this.cachingService.setRecipesChanged( true );
                return data;
            } ),
            catchError( error => {
                // Handle errors here if needed
                console.error( 'Error creating recipe:', error );
                throw error;
            } )
        );
    }

    uploadRecipe( body: any ) {
        return this.http.post( `${environment.baseApiUrl}/recipes/upload`, body ).pipe(
            map( ( data: any ) => {
                this.cachingService.setRecipesChanged( true );
                return data;
            } ),
            catchError( error => {
                // Handle errors here if needed
                console.error( 'Error uploading recipe:', error );
                throw error;
            } )
        );
    }

    getAllRecipes(): Observable<object> {
        const cachedRecipes = this.cachingService.getRecipesFromCache();
        const recipesChanged = this.cachingService.getRecipesChanged();

        if ( cachedRecipes && !recipesChanged ) {
            return new Observable( ( observer ) => {
                observer.next( { recipes: cachedRecipes } );
                observer.complete();
            } );
        }

        return this.http.get( `${environment.baseApiUrl}/recipes` ).pipe(
            map( ( data: any ) => {
                const recipes = plainToInstance( Recipe, data.recipes );
                this.cachingService.setRecipesToCache( recipes );
                this.cachingService.setRecipesChanged( false );
                return data;
            } ),
            catchError( error => {
                // Handle errors here if needed
                console.error( 'Error fetching recipes:', error );
                throw error;
            } ) );
    }

    getFavouriteRecipes(): Observable<object> {
        const cachedRecipes = this.cachingService.getRecipesFromCache();
        const recipesChanged = this.cachingService.getRecipesChanged();

        if ( cachedRecipes && !recipesChanged ) {
            return new Observable( ( observer ) => {
                observer.next( { recipes: this.filterFavorites( cachedRecipes ) } );
                observer.complete();
            } );
        }

        return this.http.get( `${environment.baseApiUrl}/recipes/favourites` );
    }

    getRecipeById( recipeId: string | null ): Observable<object> {
        const cachedRecipes = this.cachingService.getRecipesFromCache();
        const recipesChanged = this.cachingService.getRecipesChanged();

        if ( cachedRecipes && !recipesChanged ) {
            return new Observable( ( observer ) => {
                const recipe = cachedRecipes.find( ( recipe: any ) => recipe._id === recipeId );

                observer.next( { recipe: recipe } );
                observer.complete();
            } );
        }

        return this.http.get( `${environment.baseApiUrl}/recipes/${recipeId}` );
>>>>>>> origin/master
    }

    updateRecipe(recipe: Recipe): Observable<object> {
        return this.http.put(
            `${environment.baseApiUrl}/recipes/${recipe._id}`,
            {
                _id: recipe._id,
                name: recipe.name,
                ingredients: recipe.ingredients,
                steps: recipe.steps,
                favourite: recipe.favourite,
                ovenTemp: recipe.ovenTemp,
                prepTime: recipe.prepTime,
                cookTime: recipe.cookTime,
                notes: recipe.notes,
                cuisine: recipe.cuisine,
                facts: recipe.facts,
                tags: recipe.tags,
                description: recipe.description,
            }
        ).pipe(
            map( ( data: any ) => {
                this.cachingService.setRecipesChanged( true );
                return data;
            } ),
            catchError( error => {
                // Handle errors here if needed
                console.error( 'Error updating recipe:', error );
                throw error;
            } )
        );
    }

    deleteRecipeById(recipeId: string | null): Observable<object> {
        return this.http.delete(
            `${environment.baseApiUrl}/recipes/${recipeId}`
        ).pipe(
            map( ( data: any ) => {
                this.cachingService.setRecipesChanged( true );
                return data;
            } ),
            catchError( error => {
                // Handle errors here if needed
                console.error( 'Error creating recipe:', error );
                throw error;
            } )
        );
    }

    getImage(imgPath: string): Observable<object> {
        return this.http.post(
            `${environment.baseApiUrl}/img`,
            {
                path: imgPath,
            },
            { responseType: 'blob' }
        );
    }

    duplicateRecipe(recipeId: string | null): Observable<object> {
        return this.http.post(
            `${environment.baseApiUrl}/recipes/${recipeId}/duplicate`,
            {}
        ).pipe(
            map( ( data: any ) => {
                this.cachingService.setRecipesChanged( true );
                return data;
            } ),
            catchError( error => {
                // Handle errors here if needed
                console.error( 'Error duplicating recipe:', error );
                throw error;
            } )
        );
    }

    private filterFavorites( recipes: Recipe[] ): Recipe[] {
        const favRecipes = recipes.filter( ( recipe ) => recipe.favourite );
        return favRecipes;
    }
}
