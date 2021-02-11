import { File } from "../depot/file";
import {Datestamp} from "./datestamp";

export enum ConfidenceLevel
{
    HIGH = 10,
    MEDIUM = 6,
    LOW = 3,
    NO_CLUE = 0
}


export interface IDatestampDeductionSuccess
{
    readonly confidence: ConfidenceLevel;
    readonly datestamp: Datestamp;
    readonly explanation: string;
    readonly destFile: File;
}


export interface IDatestampDeductionFailure
{
    readonly confidence: ConfidenceLevel.NO_CLUE;
    readonly explanation: string;
}



export type DatestampDeduction = IDatestampDeductionFailure | IDatestampDeductionSuccess;


export function isSuccesfulDatestampDeduction(deduction: DatestampDeduction): deduction is IDatestampDeductionSuccess
{
    return deduction.confidence !== ConfidenceLevel.NO_CLUE;
}


export function isFailureDatestampDeduction(deduction: DatestampDeduction): deduction is IDatestampDeductionFailure
{
    return deduction.confidence === ConfidenceLevel.NO_CLUE;
}
