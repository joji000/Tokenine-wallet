export class CustomError extends Error {
    public status: number;

    constructor(public code: string, status: number, message: string) {
        super(message);
        this.status = status;
        this.name = 'CustomError';
    }
}
