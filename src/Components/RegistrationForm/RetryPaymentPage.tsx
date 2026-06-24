import React from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HeaderComponent } from '../Header/Header';
import { FormResult, FormWrapper, ImageBackground, RegistrationFormWrapper } from './styles';
import Button from '../Button/Button';

const RetryPaymentPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const apiUrl = process.env.REACT_APP_REGISTRATION_API_URL;
    const email = searchParams.get('email');

    React.useEffect(() => {
        const retryPayment = async () => {
            if (!email || !apiUrl) {
                setError('Липсва имейл адрес. Моля, опитайте отново.');
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
                    setError('Възникна грешка при инициализиране на плащането. Моля, свържете се с info@osogovo.run.');
                }
                setLoading(false);
            }
        };

        retryPayment();
    }, [email, apiUrl]);

    return (
        <RegistrationFormWrapper>
            <HeaderComponent hideDate />
            <ImageBackground image="https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/registration-bg.png" />
            <FormWrapper success>
                <FormResult>
                    {loading ? (
                        <>
                            <h2>Пренасочваме Ви към плащането...</h2>
                            <p>Моля, изчакайте.</p>
                        </>
                    ) : (
                        <>
                            <h2>Възникна проблем</h2>
                            <p>{error}</p>
                            <Button onClick={() => navigate('/participants')} label="Към регистрираните" />
                        </>
                    )}
                </FormResult>
            </FormWrapper>
        </RegistrationFormWrapper>
    );
};

export default RetryPaymentPage;
