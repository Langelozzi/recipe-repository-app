import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../../../models/recipe';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs';
import { response } from 'express';

@Injectable( {
    providedIn: 'root',
} )
export class RecipeService {
    currentRecipe = new Subject<Recipe>();

    constructor( private http: HttpClient ) {}

    createRecipe( body: any ): Observable<object> {
        return this.http.post( `${environment.baseApiUrl}/recipes/create`, body );
    }

    uploadRecipe( body: any ) {
        return this.http.post( `${environment.baseApiUrl}/recipes/upload`, body );
    }

    getAllRecipes(): Observable<object> {
        return this.http.get( `${environment.baseApiUrl}/recipes` );
    }

    getFavouriteRecipes(): Observable<object> {
        return this.http.get( `${environment.baseApiUrl}/recipes/favourites` );
    }

    getRecipeById( recipeId: string | null ): Observable<object> {
        return this.http.get( `${environment.baseApiUrl}/recipes/${recipeId}` );
    }

    updateRecipe( recipe: Recipe ): Observable<object> {
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
        );
    }

    deleteRecipeById( recipeId: string | null ): Observable<object> {
        return this.http.delete(
            `${environment.baseApiUrl}/recipes/${recipeId}`
        );
    }

    getImage( imgPath: string ): Observable<object> {
        return this.http.post(
            `${environment.baseApiUrl}/img`,
            {
                path: imgPath,
            },
            { responseType: 'blob' }
        );
    }
}
