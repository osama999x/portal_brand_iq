import validator from "validator";
import { LetterOfCreditRequiredConstants } from "../pages/letterOfCredit/LetterOfCreditConstants";

const isEmpty = (value) => value === undefined || value === null || (typeof value === "object" && Object.keys(value).length === 0) || (typeof value === "string" && value.trim().length === 0);

const letterofCreditValidation = async (post) => {
    let errors = {};

    Object.keys(post).forEach((key) => {
        if (LetterOfCreditRequiredConstants.hasOwnProperty(key)) {
            if (validator.isEmpty(post[key])) {
                errors[key] = "This field is required";
            }
        }
    });

    return {
        isValid: isEmpty(errors),
        errors,
    };
};

export { letterofCreditValidation };
