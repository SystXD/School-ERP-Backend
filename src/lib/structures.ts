export class ApiResponse {
    private statusCode: number;
    private data?: Record<any, any>;
    private message: string
    private success: boolean
    constructor(statusCode:number, message: string, data?:Record<any, any>){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}




export class ApiError extends Error {
    public message:string;
    private statusCode:number;
    private success:boolean
    constructor(statusCode:number, message:string, errors?:[], stack = ""){
        super(message)
        this.statusCode = statusCode
        this.message = message;
        this.success = false;
        if (stack) this.stack = stack; else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}
