import React from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../Button/Button';
import { HeaderComponent } from '../Header/Header';
import { FormResult, FormWrapper, ImageBackground, PaymentActions, RegistrationFormWrapper } from './styles';

type CancelMessageKey = 'defaultMessage' | 'payLaterEmailSent' | 'pendingWithoutEmail';

const PaymentCancelPage = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const product = searchParams.get('product');
    const sessionId = searchParams.get('session_id');
    const apiUrl = process.env.REACT_APP_REGISTRATION_API_URL;
    const [messageKey, setMessageKey] = React.useState<CancelMessageKey>('defaultMessage');
    const [retrying, setRetrying] = React.useState(false);
    const [retryError, setRetryError] = React.useState<string | null>(null);

    React.useEffect(() => {
        let isCancelled = false;

        const notifyCancelledCheckout = async () => {
            if (!apiUrl || !sessionId) {
                return;
            }

            try {
                const response = await axios.post(`${apiUrl}/checkout-cancelled`, {
                    session_id: sessionId,
                });

                if (!isCancelled && response.data?.payLaterEmailSent) {
                    setMessageKey('payLaterEmailSent');
                }
            } catch (error) {
                if (!isCancelled) {
                    setMessageKey('pendingWithoutEmail');
                }
            }
        };

        notifyCancelledCheckout();

        return () => {
            isCancelled = true;
        };
    }, [apiUrl, sessionId]);

    const retryPayment = async () => {
        if (!apiUrl || !sessionId) {
            navigate(product ? `/register?product=${product}` : '/register');
            return;
        }

        setRetrying(true);
        setRetryError(null);

        try {
            const response = await axios.post(`${apiUrl}/create-checkout-session`, {
                data: {
                    session_id: sessionId,
                },
            });

            const checkoutUrl = response.data?.checkoutUrl;
            if (typeof checkoutUrl !== 'string' || checkoutUrl.length === 0) {
                throw new Error('Missing checkout redirect URL');
            }

            window.location.assign(checkoutUrl);
        } catch (error) {
            if (axios.isAxiosError(error) && typeof error.response?.data?.error === 'string') {
                setRetryError(error.response.data.error);
            } else {
                setRetryError(t('registration:paymentPages.cancel.retryError'));
            }
            setRetrying(false);
        }
    };

    return (
        <RegistrationFormWrapper>
            <HeaderComponent hideDate />
            <ImageBackground image="https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/registration-bg.png" />
            <FormWrapper success>
                <FormResult>
                    <h2>{t('registration:paymentPages.cancel.title')}</h2>
                    <p>{t(`registration:paymentPages.cancel.${messageKey}`)}</p>
                    {retryError && <p>{retryError}</p>}
                    <PaymentActions>
                        <Button
                            label={retrying ? t('registration:paymentPages.common.redirecting') : t('registration:paymentPages.cancel.retry')}
                            onClick={retryPayment}
                            disabled={retrying}
                        />
                           
                        <Button label={t('registration:paymentPages.common.home')} onClick={() => navigate('/')} />
                    </PaymentActions>
                </FormResult>
            </FormWrapper>
        </RegistrationFormWrapper>
    );
};

export default PaymentCancelPage;