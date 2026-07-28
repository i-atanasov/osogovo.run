import React from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../Button/Button';
import { HeaderComponent } from '../Header/Header';
import { FormResult, FormWrapper, ImageBackground, PaymentActions, RegistrationFormWrapper } from './styles';

const PaymentCancelPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const product = searchParams.get('product');
    const sessionId = searchParams.get('session_id');
    const apiUrl = process.env.REACT_APP_REGISTRATION_API_URL;
    const [message, setMessage] = React.useState('Регистрацията е запазена като изчакваща, но не е потвърдена. Можете да стартирате плащането отново, когато сте готови.');
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
                    setMessage('Регистрацията е запазена. Изпратихме имейл с инструкции за плащане по банков път. При нужда: info@osogovo.run');
                }
            } catch (error) {
                if (!isCancelled) {
                    setMessage('Регистрацията е запазена като изчакваща. Ако не получите инструкции за плащане, пишете ни на info@osogovo.run');
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
                setRetryError('Възникна грешка при повторно стартиране на плащането. Моля, опитайте отново.');
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
                    <h2>Плащането не беше завършено</h2>
                    <p>{message}</p>
                    {retryError && <p>{retryError}</p>}
                    <PaymentActions>
                        <Button
                            label={retrying ? 'Пренасочване...' : 'Опитайте отново'}
                            onClick={retryPayment}
                            disabled={retrying}
                        />
                           
                        <Button label="Начална страница" onClick={() => navigate('/')} />
                    </PaymentActions>
                </FormResult>
            </FormWrapper>
        </RegistrationFormWrapper>
    );
};

export default PaymentCancelPage;