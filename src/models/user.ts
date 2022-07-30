export class User {
    id: string;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    password: string;

    constructor(
        id: string,
        firstName: string,
        lastName: string,
        email: string,
        password: string
    ) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.fullName = `${firstName} ${lastName}`;
        this.email = email;
        this.password = password;
    }
}
