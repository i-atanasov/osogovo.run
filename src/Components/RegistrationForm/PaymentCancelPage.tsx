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

    return (
        <RegistrationFormWrapper>
            <HeaderComponent hideDate image="https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/Profile.svg" />
            <ImageBackground image="https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/registration-bg.png" />
            <FormWrapper success>
                <FormResult>
                    <h2>Плащането не беше завършено</h2>
                    <p>{message}</p>
                    <PaymentActions>
                        <Button
                            label="Опитай отново"
                            onClick={() => navigate(product ? `/register?product=${product}` : '/register')}
                        />
                        <Button label="Начална страница" onClick={() => navigate('/')} />
                    </PaymentActions>
                </FormResult>
            </FormWrapper>
        </RegistrationFormWrapper>
    );
};

export default PaymentCancelPage;