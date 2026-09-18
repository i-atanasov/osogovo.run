import React from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../Button/Button';
import { HeaderComponent } from '../Header/Header';
import { FormResult, FormWrapper, ImageBackground, RegistrationFormWrapper } from './styles';

const PaymentRequestPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { t } = useTranslation();
    const apiUrl = process.env.REACT_APP_REGISTRATION_API_URL;
    const [email, setEmail] = React.useState(searchParams.get('email') || '');
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [submitted, setSubmitted] = React.useState(false);
    const [isRegistrationFull, setIsRegistrationFull] = React.useState(false);

    React.useEffect(() => {
        const fetchParticipantsAvailability = async () => {
            if (!apiUrl) return;
            try {
                const response = await axios.get(`${apiUrl}/get-participants-count`);
                setIsRegistrationFull(response.data?.isFull === true);
            } catch (error) {
                console.error('Failed to fetch participants availability:', error);
            }
        };

        fetchParticipantsAvailability();
    }, [apiUrl]);

    const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

    const requestRetryEmail = async () => {
        if (!isValidEmail(email) || !apiUrl) {
            return;
        }

        setIsSubmitting(true);

        try {
            await axios.post(`${apiUrl}/request-retry-payment-email`, {
                data: { email: email.trim().toLowerCase() },
            });
        } catch (error) {
            console.error('Retry payment email request failed:', error);
        } finally {
            setSubmitted(true);
            setIsSubmitting(false);
        }
    };

    return (
        <RegistrationFormWrapper>
            <HeaderComponent hideDate />
            <ImageBackground image="https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/registration-bg.png" />
            <FormWrapper success>
                <FormResult>
                    <h2>{t('registration:paymentPages.request.title')}</h2>
                    {isRegistrationFull && (
                        <p>{t('registration:notices.registrationFull')}</p>
                    )}
                    {!submitted ? (
                        <>
                            {!isRegistrationFull && <p>{t('registration:paymentPages.request.instructions')}</p>}
                            <label htmlFor="retry-payment-email">{t('registration:paymentPages.request.emailLabel')}</label>
                            <input
                                id="retry-payment-email"
                                name="retry-payment-email"
                                type="email"
                                placeholder={t('registration:paymentPages.request.emailPlaceholder')}
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                disabled={isRegistrationFull}
                            />
                            <Button
                                label={isSubmitting ? t('registration:paymentPages.request.submitting') : t('registration:paymentPages.request.submit')}
                                onClick={requestRetryEmail}
                                disabled={isSubmitting || !isValidEmail(email) || !apiUrl || isRegistrationFull}
                            />
                            {!apiUrl && (
                                <p>{t('registration:paymentPages.request.missingApi')}</p>
                            )}
                        </>
                    ) : (
                        <>
                            <p>{t('registration:paymentPages.request.defaultMessage')}</p>
                            <Button label={t('registration:paymentPages.common.toRegistration')} onClick={() => navigate('/register')} />
                        </>
                    )}
                </FormResult>
            </FormWrapper>
        </RegistrationFormWrapper>
    );
};

export default PaymentRequestPage;
