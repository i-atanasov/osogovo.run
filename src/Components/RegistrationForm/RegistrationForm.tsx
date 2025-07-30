import React from 'react';
import { Formik } from 'formik';
import { FormWrapper } from './styles';

interface FormValues {
    email: string;
    password: string;
    name: string;
    phone: string;
    distance: string;
    address?: string;
    city?: string;
    country?: string;
    termsAndConditions: boolean;
}

const RegistrationForm = () => (
  <FormWrapper>
    <h1>Очаквайте през август!</h1>
    <Formik
      initialValues={{ email: '', password: '' }}
      validate={ values => {
        const errors: Partial<FormValues> = {};
        if (!values.email) {
          errors.email = 'Required';
        }
      }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.email}
          />
          {errors.email && touched.email && errors.email}
          <input
            type="password"
            name="password"
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.password}
          />
          {errors.password && touched.password && errors.password}
          <button type="submit" disabled={isSubmitting}>
            Submit
          </button>
        </form>
      )}
    </Formik>
  </FormWrapper>
);

export default RegistrationForm;