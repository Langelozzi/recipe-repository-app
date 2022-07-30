import { MatSnackBar } from '@angular/material/snack-bar';
export class SnackBarHelper {
    public static triggerSnackBar(
        snackbar: MatSnackBar,
        message: string,
        btnText = 'Ok',
        duration = 6000
    ) {
        snackbar.open( message, btnText, {
            duration: duration,
        } );
    }
}
