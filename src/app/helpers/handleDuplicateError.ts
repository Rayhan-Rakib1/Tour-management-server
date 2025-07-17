/* eslint-disable @typescript-eslint/no-explicit-any */
import { TGenericErrorResponse } from "../interfaces/error.types";

export const handleDuplicateError =(err: any) : TGenericErrorResponse =>{
    const matchedArray = err.massage.match((/"([^"]*)"/));

    return{
        statusCode: 400,
        message: `${matchedArray} is already exist`
    }
}