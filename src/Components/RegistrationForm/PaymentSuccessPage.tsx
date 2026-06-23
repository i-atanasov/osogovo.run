import React from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Button from '../Button/Button';
import { HeaderComponent } from '../Header/Header';
import { FormResult, FormWrapper, ImageBackground, PaymentActions, RegistrationFormWrapper } from './styles';

type PaymentState = 'loading' | 'paid' | 'pending' | 'cancelled' | 'missing' | 'error';

const PaymentSuccessPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
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

    const title = paymentState === 'paid'
        ? `Благодарим Ви за регистрацията${participantName ? `, ${participantName}` : ''}!`
        : paymentState === 'pending'
            ? 'Плащането се обработва'
            : paymentState === 'cancelled'
                ? 'Плащането е прекратено'
                : paymentState === 'missing'
                    ? 'Липсва информация за плащането'
                    : paymentState === 'error'
                        ? 'Не успяхме да потвърдим плащането'
                        : 'Проверяваме плащането';

    const message = paymentState === 'paid'
        ? 'Плащането е потвърдено успешно и регистрацията Ви е активна. Очакваме Ви на старта на състезанието.'
        : paymentState === 'pending'
            ? 'Сървърът все още изчаква окончателно потвърждение. Обновете страницата след няколко секунди.'
            : paymentState === 'cancelled'
                ? 'Не получихме успешно потвърдено плащане за тази регистрация. Можете да опитате отново.'
                : paymentState === 'missing'
                    ? 'Отворете тази страница само след връщане от системата за плащане или започнете нова регистрация.'
                    : paymentState === 'error'
                        ? 'Възникна проблем при проверката на плащането. Ако сумата е била удържана, свържете се с info@osogovo.run.'
                        : 'Моля, изчакайте, докато проверим състоянието на плащането.';

    return (
        <RegistrationFormWrapper>
            <HeaderComponent hideDate image="https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/Profile.svg" />
            <ImageBackground image="https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/registration-bg.png" />
            <FormWrapper success>
                <FormResult>
                    <h2>{title}</h2>
                    <p>{message}</p>
                    <PaymentActions>
                        {paymentState === 'pending' && (
                            <Button label="Провери отново" onClick={() => window.location.reload()} />
                        )}
                        {(paymentState === 'cancelled' || paymentState === 'missing' || paymentState === 'error') && (
                            <Button label="Към регистрацията" onClick={() => navigate('/register')} />
                        )}
                        {paymentState === 'paid' && (
                            <Button label="Виж участниците" onClick={() => navigate('/participants')} />
                        )}
                        <Button label="Начална страница" onClick={() => navigate('/')} />
                    </PaymentActions>
                </FormResult>
            </FormWrapper>
        </RegistrationFormWrapper>
    );
};

export default PaymentSuccessPage;