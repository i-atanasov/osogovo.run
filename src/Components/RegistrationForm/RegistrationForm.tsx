import React from 'react';
import { Field, Form, Formik, FormikHelpers, useFormikContext } from 'formik';
import { FormFields, FormSection, RegistrationFormWrapper, ImageBackground, FormWrapper, Price, IBANWrapper, TShirtCardButton, TShirtSelector, TShirtSizes, TShirtSizeButton } from './styles';
import { useSearchParams } from 'react-router-dom';
import { createValidateForm } from './validation';
import { HeaderComponent } from '../Header/Header';
import Button from '../Button/Button';
import axios from 'axios';
import { euConversionRate, products, tShirtImages } from '../../config/constants';
import { useTranslation } from 'react-i18next';

type Distance = 14 | 26;

export interface FormValues {
    email: string;
    name: string;
    distance: Distance;
    gender: string;
    termsAndConditions: boolean;
    birth: string;
    team?: string;
    phoneNumber: string;
    withTShirt: boolean;
    tShirtSize: '' | 'XS' | 'S' | 'M' | 'L' | 'XL';
    paid: boolean;
}

const RegistrationForm = () => {
    React.useEffect(() => { window.scrollTo(0, 0); }, []);
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const [serverError, setServerError] = React.useState<string | null>(null);
    const [discountPercent, setDiscountPercent] = React.useState<number>(0);
    const [discountCodeChecked, setDiscountCodeChecked] = React.useState<boolean>(false);
    const [discountCodeInactive, setDiscountCodeInactive] = React.useState<boolean>(false);
    const [distance, setDistance] = React.useState<Distance>(Number(searchParams.get('product')) as Distance || 26);
    const isTestMode = (searchParams.get('test') || '').toLowerCase().trim() === 'true';
    const uniqueCode = searchParams.get('uniqueCode') || '';
    const observePointCode = searchParams.get('observePoint') || '';
    const emailParam = searchParams.get('email') || '';
    const selectedProduct = products.find(product => product.distance === distance);
    const price = isTestMode
        ? (selectedProduct?.testProductPrice || selectedProduct?.price || 0)
        : (selectedProduct?.price || 0);

    const tShirtPrice = selectedProduct?.tShirtPrice || 0;
    const initialValues: FormValues = {
        email: emailParam,
        name: '',
        distance: distance as Distance,
        gender: '',
        termsAndConditions: false,
        birth: '',
        team: '',
        withTShirt: false,
        tShirtSize: '',
        phoneNumber: '',
        paid: false
    };
    const apiUrl = process.env.REACT_APP_REGISTRATION_API_URL;
    const validateRegistrationForm = React.useMemo(() => createValidateForm(t), [t]);
    const fallbackTShirtImage = 'https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/product-box-image.png';
    const resetServerError = () => {
        setServerError(null);
    }

    const handleEmailBlur = async (email: string, setFieldValue: (field: string, value: unknown) => void) => {
        if (!apiUrl || !email || uniqueCode) return;
        try {
            const response = await axios.post(`${apiUrl}/check-email`, { email });
            if (response.data?.eligible === true) {
                setFieldValue('name', response.data.name ?? '');
                setFieldValue('birth', String(response.data.birth ?? ''));
                setFieldValue('gender', response.data.gender ?? '');
                setFieldValue('team', response.data.team ?? '');
                setDiscountPercent(response.data.longDistanceWinner ? 100 : 10);
            }
        } catch {
            // not eligible or network error — no action needed
        }
    };

    React.useEffect(() => {
        const fetchDiscount = async () => {
            if (!uniqueCode || !apiUrl) {
                setDiscountPercent(0);
                setDiscountCodeInactive(false);
                setDiscountCodeChecked(false);
                return;
            }

            try {
                const response = await axios.get(`${apiUrl}/discount-code`, {
                    params: { code: uniqueCode },
                });
                const isValid = response.data?.valid === true;
                const isInactive = response.data?.inactive === true;
                const discount = Number(response.data?.discount ?? 0);
                setDiscountPercent(isValid ? Math.max(0, Math.min(100, discount)) : 0);
                setDiscountCodeInactive(isInactive);
                setDiscountCodeChecked(true);
            } catch (error) {
                console.error('Discount code validation failed:', error, uniqueCode);
                setDiscountPercent(0);
                setDiscountCodeInactive(false);
                setDiscountCodeChecked(true);
            }
        };

        fetchDiscount();
    }, [apiUrl, uniqueCode]);

    const handleImageFallback = (event: React.SyntheticEvent<HTMLImageElement>) => {
        const image = event.currentTarget;
        if (image.src !== fallbackTShirtImage) {
            image.src = fallbackTShirtImage;
        }
    };

    const EmailParamEffect: React.FC = () => {
        const { setFieldValue } = useFormikContext();
        React.useEffect(() => {
            if (emailParam) {
                handleEmailBlur(emailParam, setFieldValue);
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
        return null;
    };

    interface PaymentDetailsProps {
        basePrice: number;
        tShirtPrice: number;
        withTShirt: boolean;
        discountPercent: number;
    }

    const PaymentDetails: React.FC<PaymentDetailsProps> = ({ basePrice, tShirtPrice, withTShirt, discountPercent }) => {
    const appliedDiscount = basePrice * (Math.max(0, Math.min(100, discountPercent)) / 100);
    const discountedBase = Math.max(0, basePrice - appliedDiscount);
    const total = discountedBase + (withTShirt ? tShirtPrice : 0);

        return (
            <>
                <Price>{t('registration:payment.entryFee', { amount: basePrice })}</Price>
                {discountPercent > 0 && (
                    <Price>{t('registration:payment.discount', { discountPercent, amount: appliedDiscount })}</Price>
                )}
                {withTShirt && (
                    <Price>{t('registration:payment.tShirt', { amount: tShirtPrice })}</Price>
                )}
                <Price>{t('registration:payment.total', { amount: total })}</Price>
                <IBANWrapper>
                    {total === 0 ? (
                        <p>{t('registration:payment.freeRegistration')}</p>
                    ) : (
                        <>
                            <p>{t('registration:payment.redirectInfo')}</p>
                            <p>{t('registration:payment.confirmationInfo')}</p>
                        </>
                    )}
                </IBANWrapper>
            </>
        );
    }

    const handleRegistrationSubmit = async (
        values: FormValues,
        { setSubmitting }: FormikHelpers<FormValues>
    ) => {
        if (typeof apiUrl !== 'string' || apiUrl.length === 0) {
            console.error('Registration API URL is not defined.');
            setServerError(t('registration:errors.missingPaymentConfiguration'));
            setSubmitting(false);
            return;
        }

        try {
            const payload: Record<string, unknown> = {
                ...values,
            };

            if (isTestMode) {
                payload.test = 'true';
                payload.observePointCode = observePointCode;
            }

            if (uniqueCode.trim().length > 0) {
                payload.uniqueCode = uniqueCode.trim();
            }

            const response = await axios.post(`${apiUrl}/create-checkout-session`, {
                data: payload,
            });
            const checkoutUrl = response.data?.checkoutUrl;

            if (typeof checkoutUrl !== 'string' || checkoutUrl.length === 0) {
                throw new Error('Missing checkout redirect URL');
            }

            resetServerError();
            window.location.assign(checkoutUrl);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 409) {
                console.error('Email already registered with paid status:', error, values.email);
                setServerError(t('registration:errors.emailAlreadyPaid'));
            } else if (axios.isAxiosError(error) && error.response?.status === 402) {
                console.error('Email already registered but payment pending:', error, values.email);
                const retryUrl = `/register/retry-payment?email=${encodeURIComponent(values.email)}`;
                setServerError(t('registration:errors.paymentPending', { retryUrl }));
            } else if (axios.isAxiosError(error) && typeof error.response?.data?.error === 'string') {
                console.error('Registration validation error:', error, values.email);
                setServerError(error.response.data.error);
            } else {
                console.error('Registration error:', error, values.email);
                setServerError(t('registration:errors.checkoutRedirectFailed'));
            }
        } finally {
            setSubmitting(false);
        }
    };

  return (
    <RegistrationFormWrapper distance={distance}>
        <HeaderComponent hideDate />
        <ImageBackground image="https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/Register_Background.jpg" />
            <FormWrapper>
                {isTestMode && (
                    <div className="server error">{t('registration:notices.testMode')}</div>
                )}
                {!isTestMode && uniqueCode && discountCodeChecked && discountPercent > 0 && (
                    <div className="server error">{t('registration:notices.activeDiscount', { discountPercent })}</div>
                )}
                {!isTestMode && uniqueCode && discountCodeChecked && discountCodeInactive && (
                    <div className="server error">{t('registration:notices.inactiveDiscount')}</div>
                )}
                {!isTestMode && uniqueCode && discountCodeChecked && !discountCodeInactive && discountPercent === 0 && (
                    <div className="server error">{t('registration:notices.invalidDiscount')}</div>
                )}
                <a href="/register/payment">{t('registration:links.payment')}</a><br /><br />
                <a href="/participants">{t('registration:links.participants')}</a><br /><br />
                <a href="/results?year=2025">{t('registration:links.results2025')}</a><br /><br />
                <Formik
                    initialValues={ initialValues }
                    validate={ validateRegistrationForm }
                    onSubmit={ handleRegistrationSubmit }
                >
                    {({
                        errors,
                        touched,
                        dirty,
                        handleSubmit,
                        handleBlur,
                        isSubmitting,
                        values,
                        setFieldValue,
                    }) => {
                        const appliedDiscount = price * (Math.max(0, Math.min(100, discountPercent)) / 100);
                        const discountedBase = Math.max(0, price - appliedDiscount);
                        const total = discountedBase + (values.withTShirt ? tShirtPrice : 0);

                        return (
                        <Form onChange={resetServerError}>
                            <EmailParamEffect />
                            <FormFields>
                                <FormSection>
                                    <label htmlFor="distance">{t('registration:fields.distance')}</label>
                                    <Field 
                                        as="select" 
                                        required 
                                        name="distance" 
                                        id="distance" 
                                        value={distance} 
                                        onChange={(e: { target: { value: number; }; }) => {
                                            const nextDistance = Number(e.target.value) as Distance;
                                            setDistance(nextDistance);
                                            setFieldValue('distance', nextDistance);
                                        }} 
                                    >
                                        <option value={14}>{t('registration:fields.distance14')}</option>
                                        <option value={26}>{t('registration:fields.distance26')}</option>
                                    </Field>

                                    <label htmlFor="email">{t('registration:fields.email')}</label>
                                    <Field
                                        id="email"
                                        name="email"
                                        placeholder={t('registration:fields.emailPlaceholder')}
                                        type="email"
                                        minLength={4}
                                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                            handleBlur(e);
                                            handleEmailBlur(e.target.value.trim().toLowerCase(), setFieldValue);
                                        }}
                                    />
                                    {errors.email && touched.email && <div className="error">{errors.email}</div>}

                                    <label htmlFor="name">{t('registration:fields.name')}</label>
                                    <Field id="name" name="name" placeholder={t('registration:fields.namePlaceholder')} />
                                    {errors.name && touched.name && <div className="error">{errors.name}</div>}
                                    <label htmlFor="phoneNumber">{t('registration:fields.phoneNumber')}</label>
                                    <Field
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        placeholder={t('registration:fields.phonePlaceholder')}
                                        required
                                    />
                                    {errors.phoneNumber && touched.phoneNumber && <div className="error">{errors.phoneNumber}</div>}
                                    <label htmlFor="gender">{t('registration:fields.gender')}</label>
                                    <Field as="select" name="gender" id="gender">
                                        <option value="" hidden></option>
                                        <option value="male">{t('registration:fields.genderMale')}</option>
                                        <option value="female">{t('registration:fields.genderFemale')}</option>
                                    </Field>
                                    {errors.gender && touched.gender && <div className="error">{errors.gender}</div>}
                                    <label htmlFor="birth">{t('registration:fields.birth')}</label>
                                    <Field className='year-option' as="select" id="birth" name="birth" required placeholder={t('registration:fields.birth')} >
                                        <option value="" hidden></option>
                                        {Array.from({ length: 60 }, (_, i) => {
                                            const year = new Date().getFullYear() - i - 15; // 15 is the minimum age
                                            return <option key={year} value={year}>{year}</option>;
                                        })}
                                    </Field>
                                    {errors.birth && touched.birth && <div className="error">{errors.birth}</div>}
                                    <label htmlFor="team">{t('registration:fields.team')} <span>{t('registration:fields.optional')}</span></label>
                                    <Field id="team" name="team" placeholder={t('registration:fields.team')} />
                                    <label className="checkbox-label" htmlFor="termsAndConditions">
                                        <Field
                                            type="checkbox"
                                            name="termsAndConditions"
                                            id="termsAndConditions"
                                            required
                                        />
                                        <span className="checkmark"></span>
                                        <p>{t('registration:terms')}</p>
                                    </label>
                                    {errors.termsAndConditions && touched.termsAndConditions && (
                                        <div className="error">{errors.termsAndConditions}</div>
                                    )}
                                </FormSection>
                                <FormSection>
                                    <label>{t('registration:tShirt.label')}</label>
                                    <TShirtSelector>
                                        <TShirtCardButton
                                            type="button"
                                            onClick={() => {
                                                const nextSelected = !values.withTShirt;
                                                setFieldValue('withTShirt', nextSelected);
                                                if (!nextSelected) {
                                                    setFieldValue('tShirtSize', '');
                                                }
                                            }}
                                            selected={values.withTShirt}
                                            grayscale={!values.withTShirt}
                                        >
                                            <img src={tShirtImages.front} alt={t('registration:tShirt.imageAlt')} onError={handleImageFallback} />
                                            <span className="cta">{values.withTShirt ? t('registration:tShirt.remove') : t('registration:tShirt.add')}</span>
                                            <span className="caption">
                                                {values.withTShirt
                                                    ? t('registration:tShirt.addedCaption', { price: tShirtPrice })
                                                    : t('registration:tShirt.addCaption', { price: tShirtPrice })
                                                }
                                            </span>
                                        </TShirtCardButton>
                                    </TShirtSelector>
                                    <Field type="hidden" name="withTShirt" />
                                    <Field type="hidden" name="tShirtSize" />

                                    {values.withTShirt && (
                                        <>
                                            <label>{t('registration:tShirt.sizeLabel')}</label>
                                            <TShirtSizes>
                                                {(['XS', 'S', 'M', 'L', 'XL'] as const).map((size) => (
                                                    <TShirtSizeButton
                                                        key={size}
                                                        type="button"
                                                        selected={values.tShirtSize === size}
                                                        onClick={() => setFieldValue('tShirtSize', size)}
                                                    >
                                                        {size}
                                                    </TShirtSizeButton>
                                                ))}
                                            </TShirtSizes>
                                            {errors.tShirtSize && touched.withTShirt && (
                                                <div className="error">{errors.tShirtSize}</div>
                                            )}
                                        </>
                                    )}
                                    <Price>{t('registration:payment.currentTotal', { amount: total })}</Price>
                                </FormSection>
                            </FormFields>
                            {serverError && (
                                <div className="server error" dangerouslySetInnerHTML={{ __html: serverError }} />
                            )}
                            {errors && Object.keys(errors).length > 0 && (
                                <div className="error">
                                    {t('registration:notices.formHasErrors')}
                                </div>
                            )}
                            <PaymentDetails
                                basePrice={price}
                                tShirtPrice={tShirtPrice}
                                withTShirt={values.withTShirt}
                                discountPercent={discountPercent}
                            />
                            <Button
                                label={isSubmitting ? t('registration:payment.redirecting') : (total === 0 ? t('registration:payment.finishFree') : t('registration:payment.payAmount', { amount: total }))}
                                onClick={handleSubmit}
                            />
                        </Form>
                    );
                }}
                </Formik>
            </FormWrapper> 
  </RegistrationFormWrapper>
  );
};
export default RegistrationForm;