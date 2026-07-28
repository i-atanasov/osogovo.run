import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Button from '../Button/Button';
import { HeaderComponent } from '../Header/Header';
import { FormResult, FormWrapper, ImageBackground, RegistrationFormWrapper } from './styles';

const DEFAULT_MESSAGE = 'Ако имейлът е вече регистриран и плащането не е било успешно, ще получите имейл с линк за повторно плащане. Ако не сте регистрирани, моля, използвайте страницата за регистрация.';

const PaymentRequestPage = () => {
    const navigate = useNavigate();
    const apiUrl = process.env.REACT_APP_REGISTRATION_API_URL;
    const [email, setEmail] = React.useState('');
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [submitted, setSubmitted] = React.useState(false);
    const [message, setMessage] = React.useState<string | null>(null);

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
            setMessage(DEFAULT_MESSAGE);
            setIsSubmitting(false);
        }
    };

    return (
        <RegistrationFormWrapper>
            <HeaderComponent hideDate />
            <ImageBackground image="https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/registration-bg.png" />
            <FormWrapper success>
                <FormResult>
                    <h2>Повторно плащане</h2>
                    {!submitted ? (
                        <>
                            <p>Въведете имейла, с който сте направили регистрацията.</p>
                            <label htmlFor="retry-payment-email">Имейл</label>
                            <input
                                id="retry-payment-email"
                                name="retry-payment-email"
                                type="email"
                                placeholder="Въведете валиден email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                            <Button
                                label={isSubmitting ? 'Изпращане...' : 'Изпрати линк за плащане'}
                                onClick={requestRetryEmail}
                                disabled={isSubmitting || !isValidEmail(email) || !apiUrl}
                            />
                            {!apiUrl && (
                                <p>Липсва настройка на API. Моля, опитайте отново по-късно.</p>
                            )}
                        </>
                    ) : (
                        <>
                            <p>{message}</p>
                            <Button label="Към регистрация" onClick={() => navigate('/register')} />
                        </>
                    )}
                </FormResult>
            </FormWrapper>
        </RegistrationFormWrapper>
    );
};

export default PaymentRequestPage;
