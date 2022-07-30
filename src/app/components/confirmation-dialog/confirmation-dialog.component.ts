import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IConfirmationDialog } from '../../../interfaces/confirmation-dialog.interface';

@Component( {
    selector: 'app-delete-confirmation-dialog',
    templateUrl: './confirmation-dialog.component.html',
    styleUrls: [ './confirmation-dialog.component.scss' ],
} )
export class ConfirmationDialogComponent implements OnInit {
    constructor(
        public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
        @Inject( MAT_DIALOG_DATA ) public data: IConfirmationDialog
    ) {}

    ngOnInit(): void {}

    onNoClick(): void {
        this.dialogRef.close();
    }
}
