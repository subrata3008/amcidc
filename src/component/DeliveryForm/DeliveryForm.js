import React, { useState } from "react";
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import { validationSchema } from "../../utils";
import TextField from "@mui/material/TextField";  
import FormControl from "@mui/material/FormControl";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Radio from "@mui/material/Radio";
import "./DeliveryForm.scss";
import {  
  counterParties, 
  unitList,
  complienceList,
  feedBackStockList,
} from "../../constants";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const DeliveryForm = () => {
  const [openAlert, setOpenAlert] = useState(false);
  const [batchDetails, setBatchDetails] = useState([
    {quantity:'', origin:''}
  ]);
  const [selectedFile, setSelectedFile] = useState();
  const [success, setSuccess] = useState("success");
  const [msg, setMsg] = useState("");

  const formik = useFormik({
    initialValues: {
      sellerCompanyName: "",
      sellerCompAddress: "",
      contactPersonName: "",
      contectPersonTel: "",
      buyerRef: "",
      sellerRef: "",
      country: "",
      certSysName: "",
      certNumberOfSeller: "",
      nameOfCertBody: "",
      certIssueDate: "",
      vesselName: "",
      blData: "",
      emailId: "",
      phone: "",
      suppliedRawMaterial: "",
      activityScope: "",
      avgMonthVolume: "",
      rawCoo: "",
      rawCooDest: "",
      recipientAdd:[],
      loadedQuantity:"",
      feedBackStockType: [],
      compliences: [],
      batchDetails:''
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      console.log(selectedFile);
      values.file = selectedFile;
      //alert("Data successfully submitted, please check you e-mail for confirmation");
      submitDeliveryForm(values);
    },
  });

  /**
   * Form Sunmission method
   * @param {*} formValues
   */
  const submitDeliveryForm = (formValues) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      mode: "no-cors",
      body: JSON.stringify(JSON.stringify(formValues, null, 2)),
    };
    fetch(
      "https://ztb2dcu4lf.execute-api.us-east-1.amazonaws.com/createNew_Supplier_data",
      requestOptions
    )
      .then((response) => {
        console.log(response);
        formik.resetForm(); 
        setOpenAlert(!openAlert);
        setSuccess("success");
        setMsg(
          "Data successfully submitted, please check you e-mail for confirmation"
        );
      })
      .catch((error) => {
        setOpenAlert(!openAlert);
        formik.resetForm(); 
        setSuccess("error");
        setMsg("Some error occured");
        console.error("There was an error!", error);
      });
  };

  const addNewRow = () =>{
    if(batchDetails.length < 7){
      const newArr = {quantity:'', origin:''};
      setBatchDetails(oldArray => [...oldArray,newArr] );
    }
  }

const removeRow = (index) =>{
  if(batchDetails.length < 2){
    return;
  }
  let batch = [...batchDetails];
  batch.splice(index,1); 
  setBatchDetails(batch);

}

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
        >
          {msg}
        </Alert>
      </Snackbar>
      <div className="deliveryForm-wrapper">
        <h3>Delivery Form, Seller and Cargo details</h3>
        <div className="form-wrapper">
          <form onSubmit={formik.handleSubmit}>
            <h5>A1. Seller Details. Please provide here your own details</h5>
            <FormControl className="input-wrapper">
              <TextField
                fullWidth
                id="sellerCompanyName"
                name="sellerCompanyName"
                variant="standard"
                key={`dosis-${123}`}
                label="Seller company name *"
                value={formik.values.sellerCompanyName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                autoComplete="off"
                error={
                  formik.touched.sellerCompanyName &&
                  Boolean(formik.errors.sellerCompanyName)
                }
                helperText={
                  formik.touched.sellerCompanyName &&
                  formik.errors.sellerCompanyName
                }
              />
            </FormControl>

            <FormControl className="input-wrapper">
              <TextField
                fullWidth
                id="sellerCompAddress"
                variant="standard"
                name="sellerCompAddress"
                label="Seller company address *"
                value={formik.values.sellerCompAddress}
                onChange={formik.handleChange}
                autoComplete="off"
                onBlur={formik.handleBlur}
                error={
                  formik.touched.sellerCompAddress &&
                  Boolean(formik.errors.sellerCompAddress)
                }
                helperText={
                  formik.touched.sellerCompAddress &&
                  formik.errors.sellerCompAddress
                }
              />
            </FormControl>

            <FormControl className="input-wrapper">
              <TextField
                fullWidth
                id="contactPersonName"
                variant="standard"
                name="contactPersonName"
                label="Contact person name"
                value={formik.values.contactPersonName}
                onChange={formik.handleChange}
                autoComplete="off"
              />
            </FormControl>

            <FormControl className="input-wrapper">
              <TextField
                fullWidth
                id="contectPersonTel"
                variant="standard"
                name="contectPersonTel"
                label="Contact person telephone"
                value={formik.values.contectPersonTel}
                onChange={formik.handleChange}
                autoComplete="off"
              />
            </FormControl>

            <h5>Contract reference number</h5>
            <FormControl className="input-wrapper">
              <TextField
                fullWidth
                variant="standard"
                id="buyerRef"
                name="buyerRef"
                label="Buyer reference"
                value={formik.values.buyerRef}
                onChange={formik.handleChange}
                autoComplete="off"
              />
            </FormControl>

            <FormControl className="input-wrapper">
              <TextField
                fullWidth
                id="sellerRef"
                variant="standard"
                name="sellerRef"
                label="Seller reference"
                value={formik.values.sellerRef}
                onChange={formik.handleChange}
                autoComplete="off"
              />
            </FormControl>

            <h5>A2. Seller's Certificate Details.</h5>

            <FormControl className="input-wrapper">
              <TextField
                fullWidth
                id="vatNo"
                variant="standard"
                name="certSysName"
                label="Name of the certification system"
                value={formik.values.certSysName}
                onChange={formik.handleChange}
                autoComplete="off"
              />
            </FormControl>

            <FormControl className="input-wrapper">
              <TextField
                fullWidth
                id="certNumberOfSeller"
                variant="standard"
                name="certNumberOfSeller"
                label="Certificate number of the seller"
                value={formik.values.certNumberOfSeller}
                onChange={formik.handleChange}
                autoComplete="off"
              />
            </FormControl>

            <FormControl className="input-wrapper">
              <TextField
                width="50%"
                id="nameOfCertBody"
                name="nameOfCertBody"
                variant="standard"
                label="Name of the certification body"
                value={formik.values.nameOfCertBody}
                onChange={formik.handleChange}
                autoComplete="off"
              />
            </FormControl>

            <FormControl className="input-wrapper date-wrapper">
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  size="large"
                  slotProps={{ textField: { variant: "standard" } }}
                  onChange={(value) =>
                    formik.setFieldValue("certIssueDate", value, true)
                  }
                  renderInput={(params) => (
                    <TextField
                      // error={Boolean(touched.birthday && errors.birthday)}
                      // helperText={touched.birthday && errors.birthday}
                      label="Date of certificate issued"
                      margin="normal"
                      name="certIssueDate"
                      variant="standard"
                      fullWidth
                      {...params}
                    />
                  )}
                />
              </LocalizationProvider>
            </FormControl>

            <h5>B2. Loaded quantity, unit measure and feedstock type</h5>

            <FormControl className="input-wrapper">
              <TextField
                fullWidth
                id="vesselName"
                name="vesselName"
                variant="standard"
                label="Vessel/ Barge name"
                value={formik.values.vesselName}
                onChange={formik.handleChange}
                autoComplete="off"
              />
            </FormControl>

            <FormControl className="input-wrapper date-wrapper">
              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DatePicker
                  size="large"
                  slotProps={{ textField: { variant: "standard" } }}
                  onChange={(value) =>
                    formik.setFieldValue("blDate", value, true)
                  }
                  renderInput={(params) => (
                    <TextField
                      // error={Boolean(touched.birthday && errors.birthday)}
                      // helperText={touched.birthday && errors.birthday}
                      label="B/L date (dd/mm/yyyy)"
                      margin="normal"
                      name="blData"
                      size="large"
                      variant="blData"
                      fullWidth
                      {...params}
                    />
                  )}
                />
              </LocalizationProvider>
            </FormControl>

            <FormControl className="input-wrapper">
              <TextField
                fullWidth
                id="vesselName"
                name="vesselName"
                variant="standard"
                label="A unique delivery numbe"
                value={formik.values.vesselName}
                onChange={formik.handleChange}
                autoComplete="off"
              />
            </FormControl>
            <FormControl className="input-wrapper">
              <TextField
                fullWidth
                id="vesselName"
                name="vesselName"
                variant="standard"
                label="Loading port"
                value={formik.values.vesselName}
                onChange={formik.handleChange}
                autoComplete="off"
              />
            </FormControl>
            <FormControl className="input-wrapper">
              <TextField
                fullWidth
                id="vesselName"
                name="vesselName"
                variant="standard"
                label="Discharge port"
                value={formik.values.vesselName}
                onChange={formik.handleChange}
                autoComplete="off"
              />
            </FormControl>

            <FormControl component="fieldset" className="input-wrapper">
              <FormLabel component="legend" className="formLabel">
                Name and address of recipient (Neste Counterparty)
              </FormLabel>
              {counterParties.map((recipientAddOption) => (
                <FormControlLabel
                  key={recipientAddOption.value}
                  name="recipientAdd"
                  control={
                    <Checkbox
                      color="default"
                      checked={formik.values.recipientAdd.includes(
                        recipientAddOption.value
                      )}
                      value={recipientAddOption.value}
                      onChange={(ev) => {
                        if (ev.target.checked) {
                          formik.values.recipientAdd.push(
                            ev.target.value
                          );
                        } else {
                          const index =
                            formik.values.recipientAdd.indexOf(
                              ev.target.value
                            );
                          if (index > -1) {
                            formik.values.recipientAdd.splice(index, 1);
                          }
                        }
                        formik.validateForm();
                      }}
                      name={recipientAddOption.value}
                    />
                  }
                  label={recipientAddOption.label}
                />
              ))}
            </FormControl>

            <FormControl className="customInput-wrapper">
              <TextField
                fullWidth
                id="loadedQuantity"
                name="loadedQuantity"
                variant="standard"
                label="Loaded quantity"
                value={formik.values.loadedQuantity}
                onChange={formik.handleChange}
                autoComplete="off"
              />
              <div className="monthVol">
              <RadioGroup
                aria-label="avgMonthVolume"
                name="avgMonthVolume"
                value={formik.values.avgMonthVolume}
              >
                {unitList.map((option) => (
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
              </div>
              
            </FormControl> 
            
          
            <FormControl component="fieldset" className="input-wrapper">
              <FormLabel component="legend" className="formLabel">
                Feedstock type
              </FormLabel>
              {feedBackStockList.map((feedBackStockTypeOption) => (
                <FormControlLabel
                  key={feedBackStockTypeOption.value}
                  name="feedBackStockType"
                  control={
                    <Checkbox
                      color="default"
                      checked={formik.values.feedBackStockType.includes(
                        feedBackStockTypeOption.value
                      )}
                      value={feedBackStockTypeOption.value}
                      onChange={(ev) => {
                        if (ev.target.checked) {
                          formik.values.feedBackStockType.push(
                            ev.target.value
                          );
                        } else {
                          const index =
                            formik.values.feedBackStockType.indexOf(
                              ev.target.value
                            );
                          if (index > -1) {
                            formik.values.feedBackStockType.splice(index, 1);
                          }
                        }
                        formik.validateForm();
                      }}
                      name={feedBackStockTypeOption.value}
                    />
                  }
                  label={feedBackStockTypeOption.label}
                />
              ))}
            </FormControl>

            <h5>B3. Market Compliance information.</h5>
            <FormControl component="fieldset" className="input-wrapper">
              <FormLabel component="legend" className="formLabel">
                Compliance type
              </FormLabel>
              {complienceList.map((complienceOption) => (
                <FormControlLabel
                  key={complienceOption.value}
                  name="compliences"
                  control={
                    <Checkbox
                      color="default"
                      checked={formik.values.compliences.includes(
                        complienceOption.value
                      )}
                      value={complienceOption.value}
                      onChange={(ev) => {
                        if (ev.target.checked) {
                          formik.values.compliences.push(
                            ev.target.value
                          );
                        } else {
                          const index =
                            formik.values.compliences.indexOf(
                              ev.target.value
                            );
                          if (index > -1) {
                            formik.values.compliences.splice(index, 1);
                          }
                        }
                        formik.validateForm();
                      }}
                      name={complienceOption.value}
                    />
                  }
                  label={complienceOption.label}
                />
              ))}
            </FormControl>
            
              {
              batchDetails.map((batch,index) => {
                return <>   
                
            <FormControl className="customInput-wrapper">
                <FormLabel key={index} component="label" className="batchFormlabel">
                 {`Batch ${index+1}:`}
                </FormLabel>            
                <TextField
                 key={index}
                fullWidth
                id={batch.quantity}
                name="batch"
                variant="standard"
                label="Loaded quantity(mt)"
                value={batchDetails.quantity}
                onChange={formik.handleChange}
                autoComplete="off"
              />
              <TextField
               key={index}
                fullWidth
                id={batch.origin}
                name={batch.origin}
                variant="standard"
                label="Origin"
                value={formik.values.batchDetails.origin}
                onChange={formik.handleChange}
                autoComplete="off"
              />
              
            <p title="Remove" className={batchDetails.length < 2 ? 'remove notAllowed' : 'remove'} onClick={()=>removeRow(index)}>-</p>
                </FormControl> 
                </>
              })
            }  
            <p className="add" title="Add new Batch" onClick={addNewRow}> + </p> 

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

export default DeliveryForm;
