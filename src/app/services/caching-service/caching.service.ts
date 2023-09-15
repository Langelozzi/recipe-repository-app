import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable( {
    providedIn: 'root',
} )
export class CachingService {
    private readonly RECIPE_KEY = 'recipes';
    private readonly RECIPES_CHANGED_KEY = 'recipesChanged';

    public getRecipesFromCache(): any | null {
        const storageData: string | null = localStorage.getItem( this.RECIPE_KEY );
        const recipes: string | null = storageData ? JSON.parse( storageData ) : null;

        return recipes;
    }

    public setRecipesToCache( recipes: any ): void {
        localStorage.setItem( this.RECIPE_KEY, JSON.stringify( recipes ) );
    }

    public getRecipesChanged(): boolean {
        return Boolean( localStorage.getItem( this.RECIPES_CHANGED_KEY ) ?? false );
    }

    public setRecipesChanged( changed: boolean ): void {
        localStorage.setItem( this.RECIPES_CHANGED_KEY, JSON.stringify( changed ) );
    }
}
