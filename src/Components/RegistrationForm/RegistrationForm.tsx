import React from 'react';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import { FormFields, FormSection, RegistrationFormWrapper, ImageBackground, FormWrapper, FormResult, Price, IBANWrapper } from './styles';
import { useSearchParams } from 'react-router-dom';
import { validateForm } from './validation';
import { HeaderComponent } from '../Header/Header';
import Button from '../Button/Button';
import axios from 'axios';
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
        setServerError(null);
    }

    interface PaymentDetailsProps {
        price: number;
    }

    const PaymentDetails: React.FC<PaymentDetailsProps> = ({ price }) => {
        return (
            <>
                <Price>Плащане на стартова такса: {price} eur.</Price>
                <IBANWrapper>
                    <p>След валидиране на данните ще бъдете пренасочени към защитената платежна страница на Stripe.</p>
                    <p>Регистрацията се потвърждава след успешно плащане и сървърна проверка на транзакцията.</p>
                </IBANWrapper>
            </>
        );
    }

    const handleRegistrationSubmit = async (
        values: FormValues,
        { setSubmitting }: FormikHelpers<FormValues>
    ) => {
        if (typeof apiUrl !== 'string' || apiUrl.length === 0) {
            console.error('Registration API URL is not defined.');
            setServerError('Липсва конфигурация за плащането. Моля, свържете се с info@osogovo.run.');
            setSubmitting(false);
            return;
        }

        try {
            const response = await axios.post(`${apiUrl}/create-checkout-session`, {
                data: values,
            });
            const checkoutUrl = response.data?.checkoutUrl;

            if (typeof checkoutUrl !== 'string' || checkoutUrl.length === 0) {
                throw new Error('Missing checkout redirect URL');
            }

            resetServerError();
            window.location.assign(checkoutUrl);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 409) {
                console.error('Email already registered:', error, values.email);
                setServerError('Имейлът вече е регистриран с потвърдено плащане. Използвайте друг имейл адрес или се свържете с info@osogovo.run.');
            } else if (axios.isAxiosError(error) && typeof error.response?.data?.error === 'string') {
                console.error('Registration validation error:', error, values.email);
                setServerError(error.response.data.error);
            } else {
                console.error('Registration error:', error, values.email);
                setServerError('Възникна грешка при пренасочването към плащането. Моля, опитайте отново по-късно или се свържете с info@osogovo.run.');
            }
        } finally {
            setSubmitting(false);
        }
    };

  return (
    <RegistrationFormWrapper distance={distance}>
        <HeaderComponent hideDate image="https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/Profile.svg" />
        <ImageBackground image="https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/registration-bg.png" />
            <FormWrapper>
                <a href="/participants">Виж регистрираните участници</a><br /><br />
                <a href="/results">Виж резултатите</a>
                <Formik
                    initialValues={ initialValues }
                    validate={ validateForm }
                    onSubmit={ handleRegistrationSubmit }
                >
                    {({
                        errors,
                        touched,
                        dirty,
                        handleSubmit,
                        isSubmitting,
                        values,
                        setFieldValue,
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
                                            const nextDistance = Number(e.target.value) as Distance;
                                            setDistance(nextDistance);
                                            setFieldValue('distance', nextDistance);
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
                                            const year = new Date().getFullYear() - i - 15; // 15 is the minimum age
                                            return <option key={year} value={year}>{year}</option>;
                                        })}
                                    </Field>
                                    {errors.birth && touched.birth && <div className="error">{errors.birth}</div>}
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
                                    {errors.termsAndConditions && touched.termsAndConditions && (
                                        <div className="error">{errors.termsAndConditions}</div>
                                    )}
                                </FormSection>
                            </FormFields>
                            <Button
                                label={isSubmitting ? 'Пренасочване...' : 'Продължи към плащане'}
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
                            <PaymentDetails price={price} />
                        </Form>
                    );
                }}
                </Formik>
            </FormWrapper> 
  </RegistrationFormWrapper>
  );
};
export default RegistrationForm;