import React from 'react';
import { Field, Form, Formik } from 'formik';
import { FormFields, FormSection, RegistrationFormWrapper, ImageBackground, FormWrapper, FormResult, Price, IBANWrapper } from './styles';
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
    const [email, setEmail] = React.useState<string>('');
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

    interface PaymentDetailsProps {
        price: number;
        email: string;
    }

    const PaymentDetails: React.FC<PaymentDetailsProps> = ({ price, email }) => {
        return (
            <>
                <Price>Плащане на стартова такса: {price} лв.</Price>
                <IBANWrapper>
                    <p>IBAN: BG29 IABG 7490 1002 0275 01 </p>
                    <p>BIC: IABGSF</p>
                    <p>Получател: Сдружение "Спортен клуб по ориентиране и бягане Осогово"</p>
                    <p>Основание за плащане: <b>{email}</b> (Вашият имейл) </p>
                </IBANWrapper>
            </>
        );
    }

  return (
    <RegistrationFormWrapper distance={distance}>
        <HeaderComponent hideDate image="https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/Profile.svg" />
        <ImageBackground image="https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/registration-bg.png" />
            <FormWrapper success={success}>
                {!success && <h1>Регистрация</h1>}
                {!success ? <Formik
                    initialValues={ initialValues }
                    validate={ validateForm }
                    onSubmit={(values, { setSubmitting }) => {
                        if (typeof apiUrl === 'string' && apiUrl.length > 0) {
                            const res = axios.post(apiUrl, {
                                data: values,
                                headers: {
                                    'Content-Type': 'application/json',
                                    Connection: 'Keep-Alive',
                                },
                            })
                            .then(response => {
                                setSubmitting(false);
                                setEmail(values.email);
                                resetServerError();
                                navigate('/register?success=true');
                            })
                            .catch(error => {
                                if (error?.response?.status === 409) {
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
                        errors,
                        touched,
                        dirty,
                        handleSubmit,
                        isSubmitting,
                        values,
                        handleChange
                    }) => {
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
                                        onChange={(e: { target: { value: number; }; }) => {
                                            setDistance(Number(e.target.value) as Distance)
                                            values.distance = Number(e.target.value) as Distance;
                                        }} 
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
                                    Моля, попълнете всички задължителни полета. При проблем, моля свържетe се с info@osogovo.run
                                </div>
                            )}
                            <PaymentDetails price={price} email={values.email} />
                        </Form>
                    );
                }}
                </Formik> :
                <FormResult>
                    <h2>Благодарим Ви за регистрацията!</h2>
                    <p>Очакваме Ви на старта на състезанието!</p>
                    <PaymentDetails price={price} email={email} />
                </FormResult>}
            </FormWrapper> 
  </RegistrationFormWrapper>
  );
};
export default RegistrationForm;