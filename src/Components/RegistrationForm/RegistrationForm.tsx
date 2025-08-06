import React from 'react';
import { Field, Form, Formik } from 'formik';
import { FormFields, FormSection, RegistrationFormWrapper, ImageBackground, FormWrapper, FormResult, Price } from './styles';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { validateForm } from './validation';
import { HeaderComponent } from '../Header/Header';
import Button from '../Button/Button';
import axios from 'axios';
import { Logo } from '../Header/styles';
import { products } from '../../config/constants';

type Distance = 14 | 26;

export interface FormValues {
    email: string;
    name: string;
    distance: Distance;
    gender: string;
    termsAndConditions: boolean;
    birth: string;
    team?: string;
    paid: boolean;
}

const RegistrationForm = () => {
    const [searchParams] = useSearchParams();
    const [serverError, setServerError] = React.useState<string | null>(null);
    const [distance, setDistance] = React.useState<Distance>(Number(searchParams.get('product')) as Distance || 26);
    const price = products.find(product => product.distance === distance)?.price || 0;
    const success = searchParams.get('success') === 'true';
    const navigate = useNavigate();
    const initialValues: FormValues = {
        email: '',
        name: '',
        distance: distance as Distance,
        gender: '',
        termsAndConditions: false,
        birth: '',
        team: '',
        paid: false
    };
    const apiUrl = process.env.REACT_APP_REGISTRATION_API_URL;
    const resetServerError = () => {
        setServerError('')
    }
    
  return (
    <RegistrationFormWrapper>
        <HeaderComponent hideDate image="https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/Profile.svg" />
        <ImageBackground image="https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/registration-bg.png" />
        
            <FormWrapper success={success}>
                {!success && <h1>Регистрация</h1>}
                {!success ? <Formik
                    initialValues={ initialValues }
                    validate={ validateForm }
                    onSubmit={(values, { setSubmitting }) => {
                        if (typeof apiUrl === 'string' && apiUrl.length > 0) {
                            axios.post(apiUrl, {
                                data: values
                            })
                            .then(response => {
                                setSubmitting(false);
                                resetServerError();
                                // Optionally, redirect or show a success message
                                navigate('/register?success=true');
                            })
                            .catch(error => {
                                console.error('Error submitting form:', error);
                                if (error.response.status === 409) {
                                    setServerError('Имейлът вече е регистриран. Моля, използвайте друг имейл адрес или се свържете с нас на info@osogovo.run');
                                } else {
                                    setServerError('Възникна грешка при регистрацията. Моля, опитайте отново по-късно или се свържете с нас на info@osogovo.run.');
                                }
                            });
                        } else {
                            console.error('Registration API URL is not defined.');
                        }
                        setTimeout(() => {
                        setSubmitting(false);
                        }, 400);
                    }}
                >
                    {({
                        values,
                        errors,
                        touched,
                        dirty,
                        handleChange,
                        handleSubmit,
                        isSubmitting,
                    }) => {
                        console.log('Form errors:', errors, dirty);
                        return (
                        <Form onChange={resetServerError}>
                            <FormFields>
                                <FormSection>
                                    <label htmlFor="distance">Дистанция</label>
                                    <Field 
                                        as="select" 
                                        required 
                                        name="distance" 
                                        id="distance" 
                                        value={distance} 
                                        onChange={(e: { target: { value: number; }; }) => {setDistance(Number(e.target.value) as Distance)}} 
                                    >
                                        <option value={14}>х.Осогово - 14км</option>
                                        <option value={26}>вр.Руен - 26км</option>
                                    </Field>

                                    <label htmlFor="name">Име и фамилия</label>
                                    <Field id="name" name="name" placeholder="Име и фамилия" />
                                    {errors.name && touched.name && <div className="error">{errors.name}</div>}
                                    <label htmlFor="email">Email</label>
                                    <Field
                                        id="email"
                                        name="email"
                                        placeholder="Въведете валиден email"
                                        type="email"
                                        minLength={4}
                                    />
                                    {errors.email && touched.email && <div className="error">{errors.email}</div>}
                                </FormSection>
                                <FormSection>
                                    <label htmlFor="gender">Пол</label>
                                    <Field as="select" name="gender" id="gender">
                                        <option value="" hidden></option>
                                        <option value="male">Мъж</option>
                                        <option value="female">Жена</option>
                                    </Field>
                                    {errors.gender && touched.gender && <div className="error">{errors.gender}</div>}
                                    <label htmlFor="birth">Година на раждане</label>
                                    <Field className='year-option' as="select" id="birth" name="birth" required placeholder="Година на раждане" >
                                        <option value="" hidden></option>
                                        {Array.from({ length: 100 }, (_, i) => {
                                            const year = new Date().getFullYear() - i - 16; // 16 is the minimum age
                                            return <option key={year} value={year}>{year}</option>;
                                        })}
                                    </Field>
                                    <label htmlFor="team">Отбор <span>(по желание)</span></label>
                                    <Field id="team" name="team" placeholder="Отбор" />
                                    <label className="checkbox-label" htmlFor="termsAndConditions">
                                        <Field
                                            type="checkbox"
                                            name="termsAndConditions"
                                            id="termsAndConditions"
                                            required
                                        />
                                        <span className="checkmark"></span>
                                        <p>Подавайки заявка за участие декларирам, че съм съгласен с правилата и условията на всяко състезание и ще ги спазвам. Ще участвам по собствено желание и на собствена отговорност, като освобождавам от такава организаторите.</p>
                                    </label>
                                    {errors.termsAndConditions && dirty && (
                                        <div className="error">{errors.termsAndConditions}</div>
                                    )}
                                </FormSection>
                            </FormFields>
                            <Button
                                label="Регистрация"
                                disabled={!dirty || isSubmitting || Object.keys(errors).length > 0}
                                onClick={handleSubmit}
                            />
                            {serverError && (
                                <div className="server error">
                                    {serverError}
                                </div>
                            )}
                            {errors && Object.keys(errors).length > 0 && (
                                <div className="error">
                                    Моля, попълнете всички задължителни полета. При проблем моля свържетe се с info@osogovo.run
                                </div>
                            )}
                            <Price>Плащане на стартова такса: {price} лв.</Price>
                        </Form>
                    );
                }}
                </Formik> :
                <FormResult>
                    <h2>Благодарим Ви за регистрацията!</h2>
                    <div>Очакваме Ви на старта на състезанието!</div>
                    <Logo left='50%' top='-200px'/>
                </FormResult>}
            </FormWrapper> 
  </RegistrationFormWrapper>
  );
};

export default RegistrationForm;