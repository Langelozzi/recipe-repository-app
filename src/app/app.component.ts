import { Component } from '@angular/core';
import { delay } from 'rxjs';
import { LoadingService } from './services/loading-service/loading.service';

@Component( {
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: [ './app.component.scss' ],
} )
export class AppComponent {
    title = 'recipe-repository';
    loading = false;

    constructor( private _loading: LoadingService ) {}

    ngOnInit() {
        this.listenToLoading();
    }

    listenToLoading(): void {
        this._loading.loadingSub
            .pipe( delay( 0 ) ) // This prevents a ExpressionChangedAfterItHasBeenCheckedError for subsequent requests
            .subscribe( ( loading: any ) => {
                this.loading = loading;
            } );
    }
}
