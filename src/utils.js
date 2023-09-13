
import * as yup from 'yup';

export const validationSchema = yup.object({
  companyName: yup.mixed().required('Company name field is required.'),
  streetAddress: yup.mixed().required('Street address field is required.'),
});
