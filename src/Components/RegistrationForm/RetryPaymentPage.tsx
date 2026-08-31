import React from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HeaderComponent } from '../Header/Header';
import { FormResult, FormWrapper, ImageBackground, RegistrationFormWrapper } from './styles';
import Button from '../Button/Button';

const RetryPaymentPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const apiUrl = process.env.REACT_APP_REGISTRATION_API_URL;
    const email = searchParams.get('email');

    React.useEffect(() => {
        const retryPayment = async () => {
            if (!email || !apiUrl) {
                setError(t('registration:paymentPages.retry.missingEmail'));
                setLoading(false);
                return;
            }

            try {
                const response = await axios.post(`${apiUrl}/create-checkout-session`, {
                    data: { email },
                });

                const checkoutUrl = response.data?.checkoutUrl;
                if (typeof checkoutUrl !== 'string' || checkoutUrl.length === 0) {
                    throw new Error('Missing checkout redirect URL');
                }

                window.location.assign(checkoutUrl);
            } catch (err) {
                console.error('Failed to create checkout session for retry:', err);
                if (axios.isAxiosError(err) && typeof err.response?.data?.error === 'string') {
                    setError(err.response.data.error);
                } else {
                    setError(t('registration:paymentPages.retry.failedInit'));
                }
                setLoading(false);
            }
        };

        retryPayment();
    }, [email, apiUrl, t]);

    return (
        <RegistrationFormWrapper>
            <HeaderComponent hideDate />
            <ImageBackground image="https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/registration-bg.png" />
            <FormWrapper success>
                <FormResult>
                    {loading ? (
                        <>
                            <h2>{t('registration:paymentPages.retry.loadingTitle')}</h2>
                            <p>{t('registration:paymentPages.retry.loadingMessage')}</p>
                        </>
                    ) : (
                        <>
                            <h2>{t('registration:paymentPages.retry.errorTitle')}</h2>
                            <p>{error}</p>
                            <Button onClick={() => navigate('/participants')} label={t('registration:paymentPages.retry.toRegistered')} />
                        </>
                    )}
                </FormResult>
            </FormWrapper>
        </RegistrationFormWrapper>
    );
};

export default RetryPaymentPage;
