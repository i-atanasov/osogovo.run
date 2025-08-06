import { FormikErrors, FormikValues } from "formik";
import { FormValues } from "./RegistrationForm";

export const validateForm = (values: FormValues) => {
    const errors: FormikErrors<FormikValues> = {};
    if (!values.email) {
        errors.email = 'Задължително поле';
    } else {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(values.email)) {
            errors.email = 'Невалиден формат на имейл адрес';
        }
    }
    if (!values.name) {
        errors.name = 'Задължително поле';
    } else if (values.name.length < 4) {
        errors.name = 'Името трябва да е поне 4 символа';
    } else  {
        const nameParts = values.name.split(' ');
        if (nameParts.length < 2) {
            errors.name = 'Необходими са две имена';
        }
    }
    // if (values.phone) {
    //     const phonePatternTest = !/^(?:[+] *)?[0-9][0-9 ]*$/.test(values.phone)
    //     if (phonePatternTest) {
    //         errors.phone = 'Невалиден формат на телефонен номер. Използвайте "+35988 123 456" или "0888 123 456"';
    //     }
    //     if (values.phone.length < 8) {
    //         errors.phone = 'Телефонният номер трябва да е поне 8 символа';
    //     }
    // }
    if (!values.gender) {
        errors.gender = 'Задължително поле';
    }
    if (!values.birth) {
        errors.birth = 'Задължително поле';
    }
    if (values.termsAndConditions !== true) {
        errors.termsAndConditions = 'Трябва да се съгласите с условията за участие';
    }
    return errors;
};
