export class User {

    private username: string;
    private email: string;
    private password: string;
    private fullname: string;

    constructor() {
        this.username = '';
        this.email = '';
        this.password = '';
        this.fullname = '';
    }

    public get Username(): string {
        return this.username;
    }
    public set Username(value: string) {
        this.username = value;
    }
    public get Email(): string {
        return this.email;
    }
    public set Email(value: string) {
        this.email = value;
    }
    public get Password(): string {
        return this.password;
    }
    public set Password(value: string) {
        this.password = value;
    }
    public get FullName(): string {
        return this.fullname;
    }
    public set FullName(value: string) {
        this.fullname = value;
    }
}
