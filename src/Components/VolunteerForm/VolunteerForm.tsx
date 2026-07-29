import React from 'react';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import axios from 'axios';
import { HeaderComponent } from '../Header/Header';
import { validateVolunteerForm, VolunteerFormValues } from './validation';
import { VolunteerFormWrapper, ImageBackground, FormSection, VolunteerCounter } from './styles';
import { FormFields, FormWrapper } from '../RegistrationForm/styles';
import Button from '../Button/Button';
import { tShirtImages } from '../../config/constants';

const VolunteerForm = () => {
    const [serverError, setServerError] = React.useState<string | null>(null);
    const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
    const [maxVolunteers, setMaxVolunteers] = React.useState<number>(10);
    const [spacesLeft, setSpacesLeft] = React.useState<number>(10);
    const [isFull, setIsFull] = React.useState<boolean>(false);
    const [isLoading, setIsLoading] = React.useState<boolean>(true);

    const apiUrl = process.env.REACT_APP_REGISTRATION_API_URL;

    const resetServerError = () => {
        setServerError(null);
    };

    const resetSuccessMessage = () => {
        setSuccessMessage(null);
    };

    // Fetch volunteer count on component mount
    React.useEffect(() => {
        const fetchVolunteerCount = async () => {
            if (!apiUrl) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await axios.get(`${apiUrl}/get-volunteer`);
                setMaxVolunteers(response.data.maxVolunteers || 10);
                setSpacesLeft(response.data.spacesLeft || 0);
                setIsFull(response.data.isFull || false);
            } catch (error) {
                console.error('Failed to fetch volunteer count:', error);
                setSpacesLeft(0);
            } finally {
                setIsLoading(false);
            }
        };

        fetchVolunteerCount();
    }, [apiUrl]);

    const initialValues: VolunteerFormValues = {
        name: '',
        email: '',
        phoneNumber: '',
        gender: '',
        tShirtSize: '',
    };

    const handleSubmit = async (
        values: VolunteerFormValues,
        { setSubmitting }: FormikHelpers<VolunteerFormValues>
    ) => {
        try {
            resetServerError();
            resetSuccessMessage();

            if (!apiUrl) {
                setServerError('API URL not configured');
                setSubmitting(false);
                return;
            }

            if (isFull) {
                setServerError('Максималният брой доброволци е достигнат');
                setSubmitting(false);
                return;
            }

            const response = await axios.post(`${apiUrl}/register-volunteer`, {
                data: values,
            });

            setSuccessMessage(response.data.message || 'Успешна регистрация като доброволец');
            
            // Refresh volunteer count
            try {
                const countResponse = await axios.get(`${apiUrl}/get-volunteer`);
                setSpacesLeft(countResponse.data.spacesLeft || 0);
                setIsFull(countResponse.data.isFull || false);
            } catch (error) {
                console.error('Failed to refresh volunteer count:', error);
            }

            // Reset form after successful submission
            setSubmitting(false);
        } catch (error: any) {
            const message =
                error.response?.data?.error || 'Възникна грешка при регистрацията';
            setServerError(message);
            setSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <VolunteerFormWrapper>
                <HeaderComponent hideDate />
                <FormWrapper>
                    <h1>Зареждане...</h1>
                </FormWrapper>
            </VolunteerFormWrapper>
        );
    }

    return (
        <VolunteerFormWrapper>
            <HeaderComponent hideDate />
            <ImageBackground image="https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/registration-bg.png" />
            <FormWrapper>
                <h1>Регистрация като доброволец</h1>
                
                <VolunteerCounter isFull={isFull}>
                    <p>Свободни места: <strong>{spacesLeft}</strong> от {maxVolunteers}</p>
                    {isFull && (
                        <p style={{ color: '#e74c3c', marginTop: '10px' }}>
                            Максималният брой доброволци е достигнат
                        </p>
                    )}
                </VolunteerCounter>

                {serverError && (
                    <div className="server">
                        {serverError}
                    </div>
                )}

                {successMessage && (
                    <div className="server" style={{ backgroundColor: '#d4edda', color: '#155724', borderLeftColor: '#28a745' }}>
                        {successMessage}
                    </div>
                )}

                <Formik
                    initialValues={initialValues}
                    validate={validateVolunteerForm}
                    onSubmit={handleSubmit}
                    validateOnChange={false}
                    validateOnBlur={true}
                >
                    {({ errors, touched, isSubmitting }) => (
                        <Form>
                            <FormFields>
                                <FormSection>
                                    <label htmlFor="name">Име</label>
                                    <Field
                                        id="name"
                                        name="name"
                                        placeholder="Въведете пълното си име"
                                        disabled={isFull || isSubmitting}
                                    />
                                    {errors.name && touched.name && (
                                        <div className="error">{errors.name}</div>
                                    )}

                                    <label htmlFor="email">Email</label>
                                    <Field
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="Въведете валиден email"
                                        disabled={isFull || isSubmitting}
                                    />
                                    {errors.email && touched.email && (
                                        <div className="error">{errors.email}</div>
                                    )}

                                    <label htmlFor="phoneNumber">Телефонен номер</label>
                                    <Field
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        placeholder="+359 / 0898 / +1-234-567-8900"
                                        disabled={isFull || isSubmitting}
                                        required
                                    />
                                    {errors.phoneNumber && touched.phoneNumber && (
                                        <div className="error">{errors.phoneNumber}</div>
                                    )}

                                    <label htmlFor="gender">Пол</label>
                                    <Field
                                        as="select"
                                        id="gender"
                                        name="gender"
                                        disabled={isFull || isSubmitting}
                                    >
                                        <option value="">Изберете пол</option>
                                        <option value="male">Мъж</option>
                                        <option value="female">Жена</option>
                                    </Field>
                                    {errors.gender && touched.gender && (
                                        <div className="error">{errors.gender}</div>
                                    )}

                                    <label htmlFor="tShirtSize">Размер тениска</label>
                                    <Field
                                        as="select"
                                        id="tShirtSize"
                                        name="tShirtSize"
                                        disabled={isFull || isSubmitting}
                                    >
                                        <option value="">Изберете размер</option>
                                        <option value="XS">XS</option>
                                        <option value="S">S</option>
                                        <option value="M">M</option>
                                        <option value="L">L</option>
                                        <option value="XL">XL</option>
                                    </Field>
                                    {errors.tShirtSize && touched.tShirtSize && (
                                        <div className="error">{errors.tShirtSize}</div>
                                    )}
                                </FormSection>
                                <FormSection>
                                    <label>Доброволците получават официалната тениска за бягане Osogovo Run</label>
                                    <img src={tShirtImages.front} alt="Официална тениска" />
                                </FormSection>
                            </FormFields>
                            <Button
                                disabled={isFull || isSubmitting}
                                label={isSubmitting ? 'Регистриране...' : 'Регистрирай се'}
                            />
                            {successMessage && (
                                <div className="server" style={{ backgroundColor: '#d4edda', color: '#155724', borderLeftColor: '#28a745' }}>
                                    {successMessage}
                                </div>
                            )}
                        </Form>
                    )}
                </Formik>
            </FormWrapper>
        </VolunteerFormWrapper>
    );
};

export default VolunteerForm;
