import { Recipe } from './recipe';

export class CookBook {
    title: string;
    description?: string;
    recipes: Recipe[] = [];

    constructor(title: string, description?: string) {
        this.title = title;
        this.description = description;
    }

    addRecipe(recipe: Recipe): void {
        this.recipes.push(recipe);
    }
}
