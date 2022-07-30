export class ArrayHelper {
    public static getRandomArrItem( arr: string[] ): string {
        return arr[Math.floor( Math.random() * arr.length )];
    }
}
