import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeService } from '../../services/recipe-service/recipe.service';
import { plainToInstance } from 'class-transformer';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarHelper } from 'src/app/helpers/snack-bar.helper';
import { Recipe } from '../../../models/recipe';
import { AnimationHelper } from 'src/app/helpers/animation-helper';
import { RecipeBatch } from 'src/models/recipe-batch';
import { FormControl, FormGroup } from '@angular/forms';
import { RecipeVisibilityEnum } from 'src/enums/recipeVisibility.enum';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
  animations: [AnimationHelper.getSimpleFade('fastFade', 200)],
})
export class FeedComponent implements OnInit {
  public recipeBatch!: RecipeBatch;
  public listedRecipes!: Recipe[];
  public sorted = false;
  public currentTag!: string;

  searchFg: FormGroup = new FormGroup({
    searchBox: new FormControl(''),
  });

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.recipeService.getPublicRecipes().subscribe(
      (data: any) => {
        // Filter for public recipes (visibility = 1)
        const publicRecipes = plainToInstance(Recipe, data.recipes).filter(
          (recipe: Recipe) => recipe.visibility === RecipeVisibilityEnum.PUBLIC
        );
        this.recipeBatch = new RecipeBatch(publicRecipes);
        this.listedRecipes = this.recipeBatch.recipes;
      },
      (error: any) => {
        SnackBarHelper.triggerSnackBar(
          this._snackBar,
          'Failed to load recipes',
          'Ok',
          6000
        );
      }
    );
  }

  viewRecipe(recipeId: string): void {
    this.router.navigate([`/recipes/${recipeId}`]);
  }

  showAllRecipes(): void {
    this.listedRecipes = this.recipeBatch.recipes;
    this.sorted = false;
  }

  sortByTag(tag: string): void {
    this.listedRecipes = this.recipeBatch.getRecipesByTag(tag);
    this.currentTag = tag;
    this.sorted = true;
  }

  searchByName(): void {
    const searchString = this.searchFg.get('searchBox')?.value;

    if (searchString == '') {
      this.showAllRecipes();
    } else {
      this.listedRecipes = this.recipeBatch.searchByNameOrUser(searchString);
    }
  }
}
