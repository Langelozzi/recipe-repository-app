import { Recipe } from './recipe';

export class RecipeBatch {
    recipes: Recipe[] = [];

    constructor( recipes: Recipe[] ) {
        this.recipes = recipes;
    }

    public getAllTags(): Set<string> {
        const allTags: Set<string> = new Set();

        for ( const recipe of this.recipes ) {
            if ( recipe.tags && recipe.tags?.length > 0 ) {
                for ( let i = 0; i < recipe.tags.length; i++ ) {
                    allTags.add( recipe.tags[i] );
                }
            }
        }

        return allTags;
    }

    public getRecipesByTag( tag: string ): Recipe[] {
        const sortedRecipes: Recipe[] = [];
        
        for ( const recipe of this.recipes ) {
            if ( recipe.tags?.includes( tag ) ) {
                sortedRecipes.push( recipe );
            }
        }

        return sortedRecipes;
    }

    public searchByName( searchString: string ): Recipe[] {
        const searchResults: Recipe[] = [];

        for ( const recipe of this.recipes ) {
            if ( 
                recipe.name.toLowerCase().includes( searchString.toLowerCase() )
            ) {
                searchResults.push( recipe );
            }
        }

        return searchResults;
    }
}
