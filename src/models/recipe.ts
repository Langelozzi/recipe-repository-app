import { Ingredient } from './ingredient';
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

    constructor(
        name: string,
        ingredients: Ingredient[],
        steps: string[],
        favourite: boolean,
        prepTime?: number,
        cookTime?: number,
        ovenTemp?: number,
        notes?: string,
        cuisine?: string,
        facts?: string[],
        tags?: string[],
        description?: string,
        _id?: string
    ) {
        this._id = _id;
        this.name = name;
        this.ingredients = ingredients;
        this.steps = steps;
        this.favourite = favourite;
        this.prepTime = prepTime;
        this.cookTime = cookTime;
        this.ovenTemp = ovenTemp;
        this.notes = notes;
        this.cuisine = cuisine;
        this.facts = facts;
        this.tags = tags;
        this.description = description;
    }

    update(
        name: string,
        ingredients: Ingredient[],
        steps: string[],
        favourite: boolean,
        prepTime?: number,
        cookTime?: number,
        ovenTemp?: number,
        notes?: string,
        cuisine?: string,
        facts?: string[],
        tags?: string[],
        description?: string
    ): void {
        this.name = name;
        this.ingredients = ingredients;
        this.steps = steps;
        this.favourite = favourite;
        this.prepTime = prepTime;
        this.cookTime = cookTime;
        this.ovenTemp = ovenTemp;
        this.notes = notes;
        this.cuisine = cuisine;
        this.facts = facts;
        this.tags = tags;
        this.description = description;
    }

    updateFavouriteStatus( favStatus: boolean ) {
        this.favourite = favStatus;
    }
}
