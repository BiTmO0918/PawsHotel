// User model class to represent user data
export class User{
    constructor( 
        public _id?:string,
        public firstName?:string, 
        public lastName?:string,
        public address?:string,
        public email?:string,
        public phone?:number,
        public active?:boolean,
    ){ }
}
