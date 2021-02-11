import * as _ from "lodash";
import { Datestamp } from "./datestamp";
import
    {
        DatestampDeduction,
        isSuccesfulDatestampDeduction,
        IDatestampDeductionSuccess,
        isFailureDatestampDeduction, ConfidenceLevel
    } from "./datestampDeduction";


export class DatestampDeductionAggregate
{
    // #region Instance Data Members
    private _deductions: Array<DatestampDeduction> = [];
    // #endregion


    public get deductions(): ReadonlyArray<DatestampDeduction>
    {
        return this._deductions;
    }


    public push(deduction: DatestampDeduction): void
    {
        this._deductions.push(deduction);
    }


    public hasSuccessfulDeductions(): boolean
    {
        const hasSuccessfulDeductions = _.some(this._deductions, isSuccesfulDatestampDeduction);
        return hasSuccessfulDeductions;
    }


    public getSuccessfulDeductions(): Array<IDatestampDeductionSuccess>
    {
        const successfulDeductions = _.filter(this._deductions, isSuccesfulDatestampDeduction);
        return successfulDeductions;
    }

    public getFailedDeductionExplanations(): Array<string>
    {
        const explanations = _.chain(this._deductions)
            .filter(isFailureDatestampDeduction)
            .map((curFailedDeduction) => curFailedDeduction.explanation)
            .value();
        return explanations;
    }


    public isConflicted(): boolean
    {
        const successfulDeductions = this.getSuccessfulDeductions();
        if (successfulDeductions.length === 0)
        {
            throw new Error("isConflicted() called with no successful deductions. Test to see if this aggregate is successful first.");
        }

        const firstDatestamp: Datestamp = successfulDeductions[0].datestamp!;
        const allAreEqual = _.every(successfulDeductions, (curDeduction) => curDeduction.datestamp.equals(firstDatestamp));
        return !allAreEqual;
    }


    /**
     * Gets this aggregate's highest confidence deductions.
     * @return Description
     */
    public getHighestConfidenceDeductions(): Array<IDatestampDeductionSuccess>
    {
        const successfulDeductions = this.getSuccessfulDeductions();
        if (successfulDeductions.length === 0)
        {
            return [];
        }

        const confidenceGroups = _.groupBy(successfulDeductions, (curDeduction) => curDeduction.confidence);

        const highestConfidenceLevelFound = _.find(
            [ConfidenceLevel.HIGH, ConfidenceLevel.MEDIUM, ConfidenceLevel.LOW],
            (curConfidenceLevel) =>
            {
                const deductions = confidenceGroups[curConfidenceLevel];
                return deductions && deductions.length > 0;
            }
        )!;

        return confidenceGroups[highestConfidenceLevelFound];
    }
}
