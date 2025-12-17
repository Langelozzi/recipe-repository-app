import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Recipe } from '../../../models/recipe';

@Component({
  selector: 'app-recipe-list-item',
  templateUrl: './recipe-list-item.component.html',
  styleUrls: ['./recipe-list-item.component.scss']
})
export class RecipeListItemComponent implements OnInit {
  @Input() recipe!: Recipe;
  @Input() showUserName: boolean = false;
  @Output() recipeClicked = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  onRecipeClick(): void {
    if (this.recipe._id) {
      this.recipeClicked.emit(this.recipe._id);
    }
  }

  getTotalTime(): number | undefined {
    if (this.recipe.prepTime && this.recipe.cookTime) {
      return this.recipe.prepTime + this.recipe.cookTime;
    } else if (this.recipe.prepTime) {
      return this.recipe.prepTime;
    } else if (this.recipe.cookTime) {
      return this.recipe.cookTime;
    }
    return undefined;
  }
}
