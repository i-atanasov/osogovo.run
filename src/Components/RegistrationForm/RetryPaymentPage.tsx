import React from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HeaderComponent } from '../Header/Header';
import { FormResult, FormWrapper, ImageBackground, RegistrationFormWrapper } from './styles';
import Button from '../Button/Button';
import PopUp from '../PopUp/PopUp';

const RetryPaymentPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);
    const [showTShirtUnavailablePopup, setShowTShirtUnavailablePopup] = React.useState(false);
    const apiUrl = process.env.REACT_APP_REGISTRATION_API_URL;
    const email = searchParams.get('email');

    const retryPayment = async (withoutTShirt = false) => {
        if (!email || !apiUrl) {
            setError(t('registration:paymentPages.retry.missingEmail'));
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${apiUrl}/create-checkout-session`, {
                data: { email, ...(withoutTShirt ? { withoutTShirt: true } : {}) },
            });

            const checkoutUrl = response.data?.checkoutUrl;
            if (typeof checkoutUrl !== 'string' || checkoutUrl.length === 0) {
                throw new Error('Missing checkout redirect URL');
            }

            window.location.assign(checkoutUrl);
        } catch (requestError) {
            console.error('Failed to create checkout session for retry:', requestError);
            if (axios.isAxiosError(requestError) && requestError.response?.data?.code === 'tshirt_unavailable') {
                setShowTShirtUnavailablePopup(true);
            } else if (axios.isAxiosError(requestError) && typeof requestError.response?.data?.error === 'string') {
                setError(requestError.response.data.error);
            } else {
                setError(t('registration:paymentPages.retry.failedInit'));
            }
            setLoading(false);
        }
    };

    React.useEffect(() => {
        retryPayment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <PopUp showPopUp={showTShirtUnavailablePopup} closePopUp={setShowTShirtUnavailablePopup}>
                <p>{t('registration:tShirt.unavailable')}</p>
                <Button
                    label={t('registration:tShirt.proceedWithout')}
                    onClick={() => retryPayment(true)}
                />
            </PopUp>
        </RegistrationFormWrapper>
    );
};

export default RetryPaymentPage;
