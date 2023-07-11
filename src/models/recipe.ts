import { RecipeVisibility } from 'src/enums/recipe-visibility.enum';
import { Ingredient } from '../interfaces/ingredient';
export class Recipe {
    _id?: string;
    name: string;
    ingredients: Ingredient[];
    steps: string[];
    favourite: boolean;
    prepTime?: number;
    cookTime?: number;
    ovenTemp?: number;
    notes?: string;
    cuisine?: string;
    facts?: string[];
    tags?: string[];
    description?: string;
    imageData?: string[];
    visibility: RecipeVisibility;

    constructor(
        name: string,
        ingredients: Ingredient[],
        steps: string[],
        favourite: boolean,
        visibility: RecipeVisibility,
        prepTime?: number,
        cookTime?: number,
        ovenTemp?: number,
        notes?: string,
        cuisine?: string,
        facts?: string[],
        tags?: string[],
        description?: string,
        _id?: string,
        imageData?: string[]
    ) {
        this._id = _id;
        this.name = name;
        this.ingredients = ingredients;
        this.steps = steps;
        this.favourite = favourite;
        this.visibility = visibility;
        this.prepTime = prepTime;
        this.cookTime = cookTime;
        this.ovenTemp = ovenTemp;
        this.notes = notes;
        this.cuisine = cuisine;
        this.facts = facts;
        this.tags = tags;
        this.description = description;
        this.imageData = imageData;
    }

    public update(
        name: string,
        ingredients: Ingredient[],
        steps: string[],
        favourite: boolean,
        visibility: RecipeVisibility,
        prepTime?: number,
        cookTime?: number,
        ovenTemp?: number,
        notes?: string,
        cuisine?: string,
        facts?: string[],
        tags?: string[],
        description?: string,
        imageData?: string[]
    ): void {
        this.name = name;
        this.ingredients = ingredients;
        this.steps = steps;
        this.favourite = favourite;
        this.visibility = visibility;
        this.prepTime = prepTime;
        this.cookTime = cookTime;
        this.ovenTemp = ovenTemp;
        this.notes = notes;
        this.cuisine = cuisine;
        this.facts = facts;
        this.tags = tags;
        this.description = description;
        this.imageData = imageData;
    }

    public updateFavouriteStatus( favStatus: boolean ) {
        this.favourite = favStatus;
    }

    public getIngredientNames(): string[] {
        const ingArray: string[] = [];

        for ( const ingredient of this.ingredients ) {
            ingArray.push( ingredient.ingredient.toLowerCase() );
        }

        return ingArray;
    }

    public getNameAsArray(): string[] {
        const nameArray: string[] = this.name.split( ' ' );

        for ( let i = 0; i < nameArray.length; i++ ) {
            nameArray[i] = nameArray[i].toLowerCase();
        }

        return nameArray;
    }
}
