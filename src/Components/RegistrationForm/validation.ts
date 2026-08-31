import { FormikErrors, FormikValues } from "formik";
import { FormValues } from "./RegistrationForm";

type Translate = (key: string, options?: Record<string, unknown>) => string;

export const createValidateForm = (t: Translate) => (values: FormValues) => {
    const errors: FormikErrors<FormikValues> = {};
    if (!values.email) {
        errors.email = t('registration:errors.required');
    } else {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(values.email)) {
            errors.email = t('registration:errors.invalidEmail');
        }
    }
    if (!values.phoneNumber) {
        errors.phoneNumber = t('registration:errors.required');
    } else {
        const phonePattern = /^[0-9+\-\s]+$/;
        if (!phonePattern.test(values.phoneNumber)) {
            errors.phoneNumber = t('registration:errors.invalidPhoneCharacters');
        } else if (values.phoneNumber.length < 8) {
            errors.phoneNumber = t('registration:errors.phoneTooShort');
        }
    }
    if (!values.name) {
        errors.name = t('registration:errors.required');
    } else if (values.name.length < 4) {
        errors.name = t('registration:errors.nameTooShort');
    } else  {
        const nameParts = values.name.split(' ');
        if (nameParts.length < 2) {
            errors.name = t('registration:errors.fullNameRequired');
        }
    }
    if (!values.gender) {
        errors.gender = t('registration:errors.required');
    }
    if (!values.birth) {
        errors.birth = t('registration:errors.required');
    }
    if (values.termsAndConditions !== true) {
        errors.termsAndConditions = t('registration:errors.termsRequired');
    }
    if (values.withTShirt && !values.tShirtSize) {
        errors.tShirtSize = t('registration:errors.tShirtSizeRequired');
    }
    return errors;
};