import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../../../models/recipe';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { Subject, catchError, first, map, of, tap } from 'rxjs';
import { CachingService } from '../caching-service/caching.service';

@Injectable({
    providedIn: 'root',
})
export class RecipeService {
    currentRecipe = new Subject<Recipe>();
    constructor( private http: HttpClient, private cachingService: CachingService ) {}

    createRecipe( body: any ): Observable<object> {
        return this.http.post( `${environment.baseApiUrl}/recipes/create`, body ).pipe(
            tap( () => this.cachingService.setRecipesChanged( true ) )
        );
    }

    uploadRecipe( body: any ) {
        return this.http.post( `${environment.baseApiUrl}/recipes/upload`, body ).pipe(
            tap( () => this.cachingService.setRecipesChanged( true ) )
        );
    }

    getAllRecipes(): Observable<object> {
        const cached = this.cachingService.getRecipesFromCache();
        const changed = this.cachingService.getRecipesChanged();

        if ( cached && !changed ) {
            return of( { recipes: cached } );
        }

        return this.http.get( `${environment.baseApiUrl}/recipes` ).pipe(
            tap( (data: any) => {
                if ( data?.recipes ) {
                    this.cachingService.setRecipesToCache( data.recipes );
                    this.cachingService.setRecipesChanged( false );
                }
            } )
        );
    }

    getPublicRecipes(): Observable<object> {
        return this.http.get( `${environment.baseApiUrl}/recipes/public` );
    }

    getFavouriteRecipes(): Observable<object> {
        const cached = this.cachingService.getRecipesFromCache();
        const changed = this.cachingService.getRecipesChanged();

        if ( cached && !changed ) {
            const favs = (cached as Recipe[]).filter( r => r.favourite );
            return of( { recipes: favs } );
        }

        return this.http.get( `${environment.baseApiUrl}/recipes/favourites` );
    }

    getRecipeById( recipeId: string | null ): Observable<object> {
        const cached = this.cachingService.getRecipesFromCache();
        const changed = this.cachingService.getRecipesChanged();

        if ( cached && !changed ) {
            const recipe = (cached as Recipe[]).find( r => r._id === recipeId );
            if ( recipe ) {
                return of( { recipe } );
            }
        }

        return this.http.get( `${environment.baseApiUrl}/recipes/${recipeId}` );
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
