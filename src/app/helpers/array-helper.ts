import * as _ from 'lodash';

export class ArrayHelper {
    public static getRandomArrItem( arr: string[] ): string {
        return arr[Math.floor( Math.random() * arr.length )];
    }

    public static areEqual( arr1: any[], arr2: any[] ): boolean {
        if ( arr1.length === arr2.length ) {
            return arr1.every( ( element, index ) => {
                if ( element === arr2[index] ) {
                    return true;
                }

                return false;
            } );
        }

        return false;
    }

    public static areEqualObjects( arr1: object[], arr2: object[] ): boolean {
        if ( arr1.length === arr2.length ) {
            for ( let i = 0; i < arr1.length; i++ ) {
                if ( !_.isEqual( arr1[i], arr2[i] ) ) {
                    return false;
                }
            }

            return true;
        }

        return false;
    }
}
