class Exception extends Error {
    statusCode: number

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode

        // Create Stack property
        Error.captureStackTrace(this, this.constructor)
    }

}

export default Exception