import { UserHomeComponent } from './components/user-home/user-home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginFormComponent } from './components/login-form/login-form.component';
import { SignupFormComponent } from './components/signup-form/signup-form.component';
import { AuthGuard } from './guards/auth.guard';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { CreateRecipeFormComponent } from './components/create-recipe-form/create-recipe-form.component';
import { RecipeListingComponent } from './components/recipe-listing/recipe-listing.component';
import { RecipeViewerComponent } from './components/recipe-viewer/recipe-viewer.component';
import { UpdateRecipeComponent } from './components/update-recipe/update-recipe.component';
import { FavouriteListingComponent } from './components/favourite-listing/favourite-listing.component';
import { RecipeUploadComponent } from './components/recipe-upload/recipe-upload.component';

const routes: Routes = [
    {
        path: '',
        component: NavBarComponent,
    },
    { path: 'login', component: LoginFormComponent },
    { path: 'signup', component: SignupFormComponent },
    {
        path: 'userhome',
        component: UserHomeComponent,
        canActivate: [ AuthGuard ],
    },
    {
        path: 'recipes/create',
        component: CreateRecipeFormComponent,
        canActivate: [ AuthGuard ],
    },
    {
        path: 'recipes/upload',
        component: RecipeUploadComponent,
        canActivate: [ AuthGuard ],
    },
    {
        path: 'recipes',
        component: RecipeListingComponent,
        canActivate: [ AuthGuard ],
    },
    {
        path: 'recipes/favourites',
        component: FavouriteListingComponent,
        canActivate: [ AuthGuard ],
    },
    {
        path: 'recipes/:id',
        component: RecipeViewerComponent,
        canActivate: [ AuthGuard ],
    },
    {
        path: 'recipes/:id/edit',
        component: UpdateRecipeComponent,
        canActivate: [ AuthGuard ],
    },
];

@NgModule( {
    imports: [ RouterModule.forRoot( routes ) ],
    exports: [ RouterModule ],
} )
export class AppRoutingModule {}
