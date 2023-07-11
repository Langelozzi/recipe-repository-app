/* eslint-disable linebreak-style */
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
    ErrorStateMatcher,
    ShowOnDirtyErrorStateMatcher,
} from '@angular/material/core';
import {
    MAT_FORM_FIELD_DEFAULT_OPTIONS,
    MatFormFieldModule,
} from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPasswordStrengthModule } from '@angular-material-extensions/password-strength';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { SignupFormComponent } from './components/signup-form/signup-form.component';
import { UserHomeComponent } from './components/user-home/user-home.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { AuthService } from './services/auth-service/auth.service';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { CreateRecipeFormComponent } from './components/create-recipe-form/create-recipe-form.component';
import { RecipeListingComponent } from './components/recipe-listing/recipe-listing.component';
import { RecipeViewerComponent } from './components/recipe-viewer/recipe-viewer.component';
import { UpdateRecipeComponent } from './components/update-recipe/update-recipe.component';
import { HttpRequestInterceptor } from './interceptors/request.interceptor';
import { FavouriteListingComponent } from './components/favourite-listing/favourite-listing.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';
import { RecipeUploadComponent } from './components/recipe-upload/recipe-upload.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { AutosizeModule } from 'ngx-autosize';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { NgxPrintModule } from 'ngx-print';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommunityRecipeListingComponent } from './components/community-recipe-listing/community-recipe-listing.component';

// Angular Material
@NgModule( {
    declarations: [
        AppComponent,
        LoginFormComponent,
        SignupFormComponent,
        UserHomeComponent,
        NavBarComponent,
        CreateRecipeFormComponent,
        RecipeListingComponent,
        RecipeViewerComponent,
        UpdateRecipeComponent,
        FavouriteListingComponent,
        ConfirmationDialogComponent,
        RecipeUploadComponent,
        LandingPageComponent,
        CommunityRecipeListingComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        MatButtonModule,
        MatCardModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatSnackBarModule,
        MatPasswordStrengthModule,
        MatSidenavModule,
        MatMenuModule,
        MatDividerModule,
        MatExpansionModule,
        MatChipsModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        AutosizeModule,
        NgxPrintModule,
        DragDropModule,
        MatToolbarModule
    ],
    providers: [
        {
            provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
            useValue: { appearance: 'outline' },
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpRequestInterceptor,
            multi: true,
        },
        // this must be last interceptor for the catch error to work properly and redirect to login
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true,
        },
        { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
        { provide: LocationStrategy, useClass: PathLocationStrategy },
        AuthService,
    ],
    bootstrap: [ AppComponent ],
} )
export class AppModule {}
