import React from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Button from '../Button/Button';
import { HeaderComponent } from '../Header/Header';
import { FormResult, FormWrapper, ImageBackground, PaymentActions, RegistrationFormWrapper } from './styles';

type PaymentState = 'loading' | 'paid' | 'pending' | 'cancelled' | 'missing' | 'error';

const PaymentSuccessPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [paymentState, setPaymentState] = React.useState<PaymentState>('loading');
    const [participantName, setParticipantName] = React.useState<string>('');
    const apiUrl = process.env.REACT_APP_REGISTRATION_API_URL;
    const sessionId = searchParams.get('session_id');

    React.useEffect(() => {
        let isCancelled = false;

        const loadRegistrationStatus = async () => {
            if (!sessionId || !apiUrl) {
                setPaymentState('missing');
                return;
            }

            try {
                const response = await axios.get(`${apiUrl}/registration-status`, {
                    params: {
                        session_id: sessionId,
                    },
                });

                if (isCancelled) {
                    return;
                }

                const registration = response.data;
                setParticipantName(typeof registration?.name === 'string' ? registration.name : '');

                if (registration?.payment_status === 'paid' || registration?.paid === true) {
                    setPaymentState('paid');
                    return;
                }

                if (registration?.payment_status === 'cancelled') {
                    setPaymentState('cancelled');
                    return;
                }

                setPaymentState('pending');
            } catch (error) {
                if (isCancelled) {
                    return;
                }

                console.error('Failed to verify payment status:', error);
                setPaymentState('error');
            }
        };

        loadRegistrationStatus();

        return () => {
            isCancelled = true;
        };
    }, [apiUrl, sessionId]);

    const title = t(`registration:paymentPages.success.titles.${paymentState}`, {
        namePart: participantName ? t('registration:paymentPages.success.namePart', { name: participantName }) : '',
    });

    const message = t(`registration:paymentPages.success.messages.${paymentState}`);

    return (
        <RegistrationFormWrapper>
            <HeaderComponent hideDate />
            <ImageBackground image="https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/registration-bg.png" />
            <FormWrapper success>
                <FormResult>
                    <h2>{title}</h2>
                    <p>{message}</p>
                    <PaymentActions>
                        {paymentState === 'pending' && (
                            <Button label={t('registration:paymentPages.success.checkAgain')} onClick={() => window.location.reload()} />
                        )}
                        {(paymentState === 'cancelled' || paymentState === 'missing' || paymentState === 'error') && (
                            <Button label={t('registration:paymentPages.common.toRegistrationDefinite')} onClick={() => navigate('/register')} />
                        )}
                        {paymentState === 'paid' && (
                            <Button label={t('registration:paymentPages.common.toParticipants')} onClick={() => navigate('/participants')} />
                        )}
                        <Button label={t('registration:paymentPages.common.home')} onClick={() => navigate('/')} />
                    </PaymentActions>
                </FormResult>
            </FormWrapper>
        </RegistrationFormWrapper>
    );
};

export default PaymentSuccessPage;