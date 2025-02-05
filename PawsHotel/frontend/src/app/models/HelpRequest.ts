// HelpRequest model class to represent help request data
export class HelpRequest{
    constructor( 
        public _id?:string,
        public fullName?:string, 
        public email?:string,
        public phone?:number,
        public subject?:string,
        public message?:string,
        public active?:boolean,
    ){ }
}