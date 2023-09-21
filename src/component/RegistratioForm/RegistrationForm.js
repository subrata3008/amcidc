import React, { useState } from "react";
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import { validationSchema } from "../../utils";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Radio from "@mui/material/Radio";
import "./RegistrationForm.scss";
import {
  activityScopeData,
  avgMonthVolumeList,
  suppliedRawMaterialList,
  countryList,
  partofVolutarySchemeList,
} from "../../constants";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const RegistrationForm = () => {
  const [openAlert, setOpenAlert] = useState(false);
  const [fileName, setFilename] = useState(""); 
  const [selectedFile, setSelectedFile] = useState();
  const [success, setSuccess] = useState('success');
  const [msg, setMsg] = useState('');
  

  const formik = useFormik({
    initialValues: {
      companyName: "",
      streetAddress: "",
      streetAddress1: "",
      postalCode: "",
      city: "",
      state: "",
      country: "",
      vatNo: "",
      companyWebsite: "",
      name: "",
      emailId: "",
      phone: "",
      suppliedRawMaterial: "",
      activityScope: "",
      avgMonthVolume: "",
      rawCoo: "",
      rawCooDest: "",
      partofVolutaryScheme: [],
      validCert: "",
      file: "",
      feeback: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      console.log(selectedFile); 
      values.file = selectedFile;
      //alert("Data successfully submitted, please check you e-mail for confirmation");
      submitRegistrationForm(values);
    },
  });

  /**
   * Form Sunmission method
   * @param {*} formValues
   */
  const submitRegistrationForm = (formValues) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "no-cors",
      body: JSON.stringify(JSON.stringify(formValues, null, 2)),
    };
    fetch(
      "https://ztb2dcu4lf.execute-api.us-east-1.amazonaws.com/createNew_Supplier_data",
      requestOptions
    ).then((response) => {
        console.log(response);
        formik.resetForm();
        setFilename("");
        setOpenAlert(!openAlert);
        setSuccess('success');
        setMsg('Data successfully submitted, please check you e-mail for confirmation'); 
      })
      .catch((error) => { 
        setOpenAlert(!openAlert);
        formik.resetForm();
        setFilename("");
        setSuccess('error');
        setMsg('Some error occured');
        console.error("There was an error!", error);
      });
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={openAlert}
        autoHideDuration={3000}
        onClose={() => setOpenAlert(!openAlert)}
      >
        <Alert
          onClose={() => setOpenAlert(false)}
          severity={success}
          sx={{ width: "100%" }}
        >{msg}</Alert>
      </Snackbar>
      <div className="registraion-wrapper">
        <h3>
          Renewable supplier registration form to sell renewable raw materials
        </h3>
        <div className="form-wrapper">
          <form onSubmit={formik.handleSubmit}>
            <FormControl className="input-wrapper">
              <TextField
                fullWidth
                id="companyName"
                name="companyName"
                variant="standard"
                key={`dosis-${123}`}
                label="Company Name *"
                value={formik.values.companyName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                autoComplete="off"
                error={
                  formik.touched.companyName &&
                  Boolean(formik.errors.companyName)
                }
                helperText={
                  formik.touched.companyName && formik.errors.companyName
                }
              />
            </FormControl>

            <FormControl className="input-wrapper">
              <TextField
                fullWidth
                id="streetAddress"
                variant="standard"
                name="streetAddress"
                label="Street address *"
                value={formik.values.streetAddress}
                onChange={formik.handleChange}
                autoComplete="off"
                onBlur={formik.handleBlur}
                error={
                  formik.touched.streetAddress &&
                  Boolean(formik.errors.streetAddress)
                }
                helperText={
                  formik.touched.streetAddress && formik.errors.streetAddress
                }
              />
            </FormControl>

            <FormControl className="input-wrapper">
              <TextField
                fullWidth
                id="streetAddress1"
                variant="standard"
                name="streetAddress1"
                label="Street address1"
                value={formik.values.streetAddress1}
                onChange={formik.handleChange}
                autoComplete="off"
              />
            </FormControl>

            <FormControl className="input-wrapper">
              <TextField
                fullWidth
                id="postalCode"
                variant="standard"
                name="postalCode"
                label="Postal Code"
                value={formik.values.postalCode}
                onChange={formik.handleChange}
                autoComplete="off"
              />
            </FormControl>

            <FormControl className="input-wrapper">
              <TextField
                fullWidth
                variant="standard"
                id="city"
                name="city"
                label="City"
                value={formik.values.city}
                onChange={formik.handleChange}
                autoComplete="off"
              />
            </FormControl>

            <FormControl className="input-wrapper">
              <TextField
                fullWidth
                id="state"
                variant="standard"
                name="state"
                label="State"
                value={formik.values.state}
                onChange={formik.handleChange}
                autoComplete="off"
              />
            </FormControl>
            <FormControl className="input-wrapper">
              <FormLabel component="legend" className="formLabel">
                Country
              </FormLabel>
              <Select
                labelId="country"
                variant="standard"
                id="country"
                name="country"
                value={formik.values.country}
                onChange={(event) => {
                  formik.setFieldValue("country", event.target.value);
                }}
              >
                {countryList.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl className="input-wrapper">
              <TextField
                fullWidth
                id="vatNo"
                variant="standard"
                name="vatNo"
                label="VAT number"
                value={formik.values.vatNo}
                onChange={formik.handleChange}
                autoComplete="off"
              />
              <FormHelperText>
                VAT is formed from your country code and company ID. E.g. FI
                99999999
              </FormHelperText>
            </FormControl>

            <FormControl className="input-wrapper">
              <TextField
                fullWidth
                id="companyWebsite"
                variant="standard"
                name="companyWebsite"
                label="Please provide your company website"
                value={formik.values.companyWebsite}
                onChange={formik.handleChange}
                autoComplete="off"
              />
            </FormControl>

            <FormControl className="input-wrapper">
              <TextField
                fullWidth
                id="name"
                name="name"
                variant="standard"
                label="Your name"
                value={formik.values.name}
                onChange={formik.handleChange}
                autoComplete="off"
              />
            </FormControl>

            <FormControl className="input-wrapper">
              <TextField
                fullWidth
                id="emailId"
                name="emailId"
                variant="standard"
                label="Your contact email"
                value={formik.values.emailId}
                onChange={formik.handleChange}
                autoComplete="off"
                onBlur={formik.handleBlur}
                error={formik.touched.emailId && Boolean(formik.errors.emailId)}
                helperText={formik.touched.emailId && formik.errors.emailId}
              />
            </FormControl>

            <FormControl className="input-wrapper">
              <TextField
                fullWidth
                id="phone"
                name="phone"
                variant="standard"
                label="Your phone number"
                value={formik.values.phone}
                onChange={formik.handleChange}
                autoComplete="off"
              />
            </FormControl>

            <FormControl className="input-wrapper">
              <FormLabel component="legend" className="formLabel">
                Please choose the type of raw materials you supply
              </FormLabel>
              <Select
                labelId="suppliedRawMaterial"
                variant="standard"
                id="suppliedRawMaterial"
                name="suppliedRawMaterial"
                value={formik.values.suppliedRawMaterial}
                onChange={(event) => {
                  formik.setFieldValue(
                    "suppliedRawMaterial",
                    event.target.value
                  );
                }}
              >
                {suppliedRawMaterialList.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl component="fieldset" className="input-wrapper">
              <FormLabel className="formLabel" component="legend">
                What is the scope of your activities?
              </FormLabel>
              <RadioGroup
                aria-label="activityScope"
                name="activityScope"
                value={formik.values.activityScope}
              >
                {activityScopeData.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    onChange={formik.handleChange}
                    control={<Radio color="default" />}
                    label={option.label}
                    defaultChecked={formik.values.gender === ""}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <FormControl component="fieldset" className="input-wrapper">
              <FormLabel component="legend" className="formLabel">
                What is your estimated average monthly volume of raw materials
                that you handle? (tonnes per month)
              </FormLabel>
              <RadioGroup
                aria-label="avgMonthVolume"
                name="avgMonthVolume"
                value={formik.values.avgMonthVolume}
              >
                {avgMonthVolumeList.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    onChange={formik.handleChange}
                    control={<Radio color="default" />}
                    label={option.label}
                    defaultChecked={formik.values.gender === ""}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <FormControl className="input-wrapper">
              <FormLabel component="legend" className="formLabel">
                Please specify the countries of origin of the raw materials
              </FormLabel>
              <Select
                labelId="suppliedRawMaterial"
                variant="standard"
                id="rawCoo"
                name="rawCoo"
                value={formik.values.rawCoo}
                onChange={(event) => {
                  formik.setFieldValue("rawCoo", event.target.value);
                }}
              >
                {countryList.map((option) => (
                  <MenuItem key={"rawCoo" + option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl className="input-wrapper">
              <FormLabel component="legend" className="formLabel">
                Please specify the desstination of countries of the raw
                materials
              </FormLabel>
              <Select
                labelId="suppliedRawMaterialDestination"
                variant="standard"
                id="rawCooDest"
                name="rawCooDest"
                value={formik.values.rawCooDest}
                onChange={(event) => {
                  formik.setFieldValue("rawCooDest", event.target.value);
                }}
              >
                {countryList.map((option) => (
                  <MenuItem
                    key={"rawCooDest" + option.value}
                    value={option.value}
                  >
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl component="fieldset" className="input-wrapper">
              <FormLabel component="legend" className="formLabel">
                Are you part of any voluntary schemes that demonstrate
                compliance with the sustainability criteria for biofuels?
              </FormLabel>
              {partofVolutarySchemeList.map((schemeOption) => (
                <FormControlLabel
                  key={schemeOption.value}
                  name="partofVolutaryScheme"
                  control={
                    <Checkbox
                      color="default"
                      checked={formik.values.partofVolutaryScheme.includes(
                        schemeOption.value
                      )}
                      value={schemeOption.value}
                      onChange={(ev) => {
                        if (ev.target.checked) {
                          formik.values.partofVolutaryScheme.push(
                            ev.target.value
                          );
                        } else {
                          const index =
                            formik.values.partofVolutaryScheme.indexOf(
                              ev.target.value
                            );
                          if (index > -1) {
                            formik.values.partofVolutaryScheme.splice(index, 1);
                          }
                        }
                        formik.validateForm();
                      }}
                      name={schemeOption.value}
                    />
                  }
                  label={schemeOption.label}
                />
              ))}
            </FormControl>

            <FormControl className="input-wrapper">
              <TextField
                fullWidth
                variant="standard"
                id="validCert"
                name="validCert"
                label="Please provide your valid certificate number below (if applicable). E.g. EU-ISCC-Cert-DE100-12345678
            "
                value={formik.values.validCert}
                onChange={formik.handleChange}
                autoComplete="off"
              />
            </FormControl>

            <FormControl className="button-wrapper">
              <Button variant="contained" component="label">
                Upload
                <input
                  id="file"
                  name="file"
                  hidden
                  type="file"
                  onChange={(event) => { 
                    setSelectedFile(event.target.files[0]);
                    setFilename(event.currentTarget.files[0].name); 
                  }}
                />
              </Button>
              {fileName}
            </FormControl>

            <FormControl className="textarea-wrapper">
              <FormLabel component="legend">
                Do you have any other comments or feedback?
              </FormLabel>
              <TextField
                id="feeback"
                name="feeback"
                multiline
                value={formik.feeback}
                onChange={formik.handleChange}
                variant="outlined"
              />
            </FormControl>

            <FormControl className="input-wrapper">
              <Button
                className="button-class"
                color="primary"
                variant="contained"
                fullWidth
                type="submit"
                width="10px"
                onClick={formik.handleSubmit}
              >
                Submit
              </Button>
            </FormControl>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegistrationForm;
