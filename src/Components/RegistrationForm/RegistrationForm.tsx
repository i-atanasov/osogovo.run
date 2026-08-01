import React from 'react';
import { Field, Form, Formik, FormikHelpers, useFormikContext } from 'formik';
import { FormFields, FormSection, RegistrationFormWrapper, ImageBackground, FormWrapper, Price, IBANWrapper, TShirtCardButton, TShirtSelector, TShirtSizes, TShirtSizeButton } from './styles';
import { useSearchParams } from 'react-router-dom';
import { validateForm } from './validation';
import { HeaderComponent } from '../Header/Header';
import Button from '../Button/Button';
import axios from 'axios';
import { euConversionRate, products, tShirtImages } from '../../config/constants';

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
                <Price>Плащане на стартова такса: {basePrice} eur / {(basePrice * euConversionRate).toFixed(2)} лв.</Price>
                {discountPercent > 0 && (
                    <Price>Отстъпка от стартовата такса: ({discountPercent}%): -{appliedDiscount} eur / {(-appliedDiscount * euConversionRate).toFixed(2)} лв.</Price>
                )}
                {withTShirt && (
                    <Price>Тениска: {tShirtPrice} eur / {(tShirtPrice * euConversionRate).toFixed(2)} лв.</Price>
                )}
                <Price>Общо: {total} eur / {(total * euConversionRate).toFixed(2)} лв.</Price>
                <IBANWrapper>
                    {total === 0 ? (
                        <p>Регистрацията е безплатна с приложения код за отстъпка. Натиснете бутона, за да завършите регистрацията си.</p>
                    ) : (
                        <>
                            <p>След валидиране на данните ще бъдете пренасочени към защитената платежна страница.</p>
                            <p>Регистрацията се потвърждава след успешно плащане и сървърна проверка на транзакцията.</p>
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
            setServerError('Липсва конфигурация за плащането. Моля, свържете се с info@osogovo.run.');
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
                setServerError('Имейлът вече е регистриран с потвърдено плащане. Моля, свържете се с info@osogovo.run за повече информация.');
            } else if (axios.isAxiosError(error) && error.response?.status === 402) {
                console.error('Email already registered but payment pending:', error, values.email);
                const retryUrl = `/register/retry-payment?email=${encodeURIComponent(values.email)}`;
                setServerError(`Имейлът вече е регистриран, но плащането не е завършено. <a href="${retryUrl}">Опитайте отново с плащането</a> или <a href="mailto:info@osogovo.run">се свържете с нас</a>.`);
            } else if (axios.isAxiosError(error) && typeof error.response?.data?.error === 'string') {
                console.error('Registration validation error:', error, values.email);
                setServerError(error.response.data.error);
            } else {
                console.error('Registration error:', error, values.email);
                setServerError('Възникна грешка при пренасочването към плащането. Моля, опитайте отново по-късно или се свържете с info@osogovo.run.');
            }
        } finally {
            setSubmitting(false);
        }
    };

  return (
    <RegistrationFormWrapper distance={distance}>
        <HeaderComponent hideDate />
        <ImageBackground image="https://pvmolqp98bhv9my7.public.blob.vercel-storage.com/registration-bg.png" />
            <FormWrapper>
                {isTestMode && (
                    <div className="server error">TEST MODE: Плащането е с тестова цена.</div>
                )}
                {!isTestMode && uniqueCode && discountCodeChecked && discountPercent > 0 && (
                    <div className="server error">Активен код за отстъпка от таксата за регистрация: {discountPercent}%</div>
                )}
                {!isTestMode && uniqueCode && discountCodeChecked && discountCodeInactive && (
                    <div className="server error">Кодът за отстъпка вече не е активен.</div>
                )}
                {!isTestMode && uniqueCode && discountCodeChecked && !discountCodeInactive && discountPercent === 0 && (
                    <div className="server error">Невалиден или неактивен код за отстъпка.</div>
                )}
                <a href="/register/payment">Към плащане за вече регистрирани потребители</a><br /><br />
                <a href="/participants">Виж регистрираните участници</a><br /><br />
                <a href="/results?year=2025">Виж резултатите за 2025 г.</a><br /><br />
                <Formik
                    initialValues={ initialValues }
                    validate={ validateForm }
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
                                    <label htmlFor="distance">Дистанция</label>
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
                                        <option value={14}>х.Осогово - 14км</option>
                                        <option value={26}>вр.Руен - 26км</option>
                                    </Field>

                                    <label htmlFor="email">Email</label>
                                    <Field
                                        id="email"
                                        name="email"
                                        placeholder="Въведете валиден email"
                                        type="email"
                                        minLength={4}
                                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                            handleBlur(e);
                                            handleEmailBlur(e.target.value.trim().toLowerCase(), setFieldValue);
                                        }}
                                    />
                                    {errors.email && touched.email && <div className="error">{errors.email}</div>}

                                    <label htmlFor="name">Име и фамилия</label>
                                    <Field id="name" name="name" placeholder="Име и фамилия" />
                                    {errors.name && touched.name && <div className="error">{errors.name}</div>}
                                    <label htmlFor="phoneNumber">Телефонен номер</label>
                                    <Field
                                        id="phoneNumber"
                                        name="phoneNumber"
                                        placeholder="+359 / 0898 / +1-234-567-8900"
                                        required
                                    />
                                    {errors.phoneNumber && touched.phoneNumber && <div className="error">{errors.phoneNumber}</div>}
                                    <label htmlFor="gender">Пол</label>
                                    <Field as="select" name="gender" id="gender">
                                        <option value="" hidden></option>
                                        <option value="male">Мъж</option>
                                        <option value="female">Жена</option>
                                    </Field>
                                    {errors.gender && touched.gender && <div className="error">{errors.gender}</div>}
                                    <label htmlFor="birth">Година на раждане</label>
                                    <Field className='year-option' as="select" id="birth" name="birth" required placeholder="Година на раждане" >
                                        <option value="" hidden></option>
                                        {Array.from({ length: 60 }, (_, i) => {
                                            const year = new Date().getFullYear() - i - 15; // 15 is the minimum age
                                            return <option key={year} value={year}>{year}</option>;
                                        })}
                                    </Field>
                                    {errors.birth && touched.birth && <div className="error">{errors.birth}</div>}
                                    <label htmlFor="team">Отбор <span>(по желание)</span></label>
                                    <Field id="team" name="team" placeholder="Отбор" />
                                    <label className="checkbox-label" htmlFor="termsAndConditions">
                                        <Field
                                            type="checkbox"
                                            name="termsAndConditions"
                                            id="termsAndConditions"
                                            required
                                        />
                                        <span className="checkmark"></span>
                                        <p>Подавайки заявка за участие декларирам, че съм съгласен с правилата и условията на всяко състезание и ще ги спазвам. Ще участвам по собствено желание и на собствена отговорност, като освобождавам от такава организаторите.</p>
                                    </label>
                                    {errors.termsAndConditions && touched.termsAndConditions && (
                                        <div className="error">{errors.termsAndConditions}</div>
                                    )}
                                </FormSection>
                                <FormSection>
                                    <label>Добави официална тениска за бягане Osogovo Run (по желание)</label>
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
                                            <img src={tShirtImages.front} alt="Официална тениска" onError={handleImageFallback} />
                                            <span className="cta">{values.withTShirt ? 'Премахни тениска' : 'Добави тениска'}</span>
                                            <span className="caption">
                                                {values.withTShirt
                                                    ? `Тениската е добавена (+${tShirtPrice} eur / ${(tShirtPrice * euConversionRate).toFixed(2)} лв) - натиснете за премахване`
                                                    : `Добави тениска (+${tShirtPrice} eur / ${(tShirtPrice * euConversionRate).toFixed(2)} лв)`
                                                }
                                            </span>
                                        </TShirtCardButton>
                                    </TShirtSelector>
                                    <Field type="hidden" name="withTShirt" />
                                    <Field type="hidden" name="tShirtSize" />

                                    {values.withTShirt && (
                                        <>
                                            <label>Избери размер</label>
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
                                    <Price>Текуща обща сума: {total} eur / {(total * euConversionRate).toFixed(2)} лв</Price>
                                </FormSection>
                            </FormFields>
                            {serverError && (
                                <div className="server error" dangerouslySetInnerHTML={{ __html: serverError }} />
                            )}
                            {errors && Object.keys(errors).length > 0 && (
                                <div className="error">
                                    Моля, попълнете всички задължителни полета. При проблем, моля свържетe се с info@osogovo.run
                                </div>
                            )}
                            <PaymentDetails
                                basePrice={price}
                                tShirtPrice={tShirtPrice}
                                withTShirt={values.withTShirt}
                                discountPercent={discountPercent}
                            />
                            <Button
                                label={isSubmitting ? 'Пренасочване...' : (total === 0 ? 'Завърши регистрацията' : `Плати ${total} eur / ${(total * euConversionRate).toFixed(2)} лв`)}
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