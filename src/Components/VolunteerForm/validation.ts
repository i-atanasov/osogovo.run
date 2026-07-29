import { FormikErrors, FormikValues } from "formik";

export interface VolunteerFormValues {
    name: string;
    email: string;
    phoneNumber: string;
    gender: string;
    tShirtSize: 'XS' | 'S' | 'M' | 'L' | 'XL' | '';
}

export const validateVolunteerForm = (values: VolunteerFormValues) => {
    const errors: FormikErrors<FormikValues> = {};

    if (!values.name) {
        errors.name = 'Задължително поле';
    } else if (values.name.length < 4) {
        errors.name = 'Името трябва да е поне 4 символа';
    } else {
        const nameParts = values.name.split(' ');
        if (nameParts.length < 2) {
            errors.name = 'Необходими са две имена';
        }
    }

    if (!values.email) {
        errors.email = 'Задължително поле';
    } else {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(values.email)) {
            errors.email = 'Невалиден формат на имейл адрес';
        }
    }

    if (!values.phoneNumber) {
        errors.phoneNumber = 'Задължително поле';
    } else {
        const phonePattern = /^[0-9+\-\s]+$/;
        if (!phonePattern.test(values.phoneNumber)) {
            errors.phoneNumber = 'Телефонният номер може да съдържа само цифри, +, - и интервали';
        } else if (values.phoneNumber.length < 8) {
            errors.phoneNumber = 'Телефонният номер трябва да е поне 8 символа';
        }
    }

    if (!values.gender) {
        errors.gender = 'Задължително поле';
    }

    if (!values.tShirtSize) {
        errors.tShirtSize = 'Задължително поле';
    }

    return errors;
};
