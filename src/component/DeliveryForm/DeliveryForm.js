import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { validationSchema } from "../../utils";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import {
  TextField,
  Radio,
  Checkbox,
  FormLabel,
  FormControlLabel,
  RadioGroup,
  FormControl,
  Button,
  Snackbar,
  Tab,
  MenuItem,
  Select,
  Card,
} from "@mui/material";
import "./DeliveryForm.scss";
import {
  counterParties,
  unitList,
  complienceList,
  feedBackStockList,
  tabList,
  compliantList,
} from "../../constants";
import MuiAlert from "@mui/material/Alert";
import { TabContext, TabPanel } from "@mui/lab";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const DeliveryForm = () => {
  const [openAlert, setOpenAlert] = useState(false);
  const [fileName, setFilename] = useState(""); 
  const [selectedFile, setSelectedFile] = useState();
  const [batchDetails, setBatchDetails] = useState([
    { quantity: "", origin: "" },
  ]);
  const [millBatchDetails, setMillBatchDetails] = useState([
    { millName: "", certNum: "", estateName: "", certNumCover: "", isEpa: "", isEU: "", wareHouseName: "", wareHouseLoc: "", loadedQuantity: "", batchNo: "", totalGhgEMission:'' },
  ]);
  const [tabIndex, setTabindex] = useState("0");
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
      blDate: "",
      uniqDelNum: "",
      loadingPort: "",
      dischargePort: "", 
      avgMonthVolume: "",  
      recipientAdd: [],
      loadedQuantity: "",
      feedBackStockType: [],
      file:"",
      compliences: [],
      batchDetails:  '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(values);
      //alert("Data successfully submitted, please check you e-mail for confirmation");
      submitDeliveryForm(values);
    },
  });

  const updateFieldVal = (eve,dataList,index,keyName) =>{ 
    debugger;
      const updatedBatch = {...batchDetails[index], [keyName]: eve.target.value};
      const newBatches = [
        ...batchDetails.slice(0, index),
        updatedBatch,
        ...batchDetails.slice(index + 1)
      ];
      console.log(newBatches);
      setBatchDetails(newBatches); 
  }


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

  /**
   * 
   * @param {*} batchDetails 
   * @param {*} limit 
   */
  const addNewRow = (batchDetails, limit,type) => {
    if (batchDetails.length < limit) {
      if(type === 'estate'){ 
        const newObj = { quantity: "", origin: "" };
        setBatchDetails((oldArray) => [...oldArray, newObj]); 
      }
      // if(type === 'estateAndMill'){
      //   const newArr = { quantity: "", origin: "" };
      //   setBatchDetails((oldArray) => [...oldArray, newArr]);
      // }
    }
  };

  const removeRow = (delindex) => {
    if (batchDetails.length < 2) {
      return;
    }
    setBatchDetails((batchs) => batchs.filter((_, index) => index !== delindex));
  };

  // const tabIndexSet = (index) =>{
  // setTabindex(index.toString());
  //  console.log(batchDetails);
  // }
  useEffect(()=>{
    console.log(formik.values)
  },[formik])

  return (
    <>
      <TabContext value={tabIndex}>
        <form onSubmit={formik.handleSubmit}>
          <div className="tab-wrapper">
            {tabList.map((tabData, index) => {
              return (
                <Tab
                  label={tabData.label}
                  value={index.toString()}
                  className={index.toString() === tabIndex ? "activeTab" : ""}
                  onClick={()=>{
                    setTabindex(index.toString());
                    console.log(formik.values.batchDetails);
                    formik.setFieldValue('batchDetails',batchDetails)
                  }}
                />
              );
            })}
          </div>

          {/** Seller & Cargo Details Tab Content Start*/}
          <TabPanel value="0">
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
              <h3>Seller and Cargo details</h3>
              <div className="form-wrapper">
                <h4>
                  A1. Seller Details. Please provide here your own details
                </h4>
                <FormControl className="input-wrapper">
                  <TextField
                    fullWidth
                    id="sellerCompanyName"
                    name="sellerCompanyName"
                    variant="standard"
                    key="sellerCompanyName"
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

                <h4>Contract reference number</h4>
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

                <h4>A2. Seller's Certificate Details.</h4>

                <FormControl className="input-wrapper">
                  <TextField
                    fullWidth
                    id="certSysName"
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
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                   <DatePicker
                    disableFuture
                    size="large"
                    label="B/L date (dd/mm/yyyy)"
                    format="DD/MM/YYYY"
                    value={formik.values.certIssueDate}
                    onChange={(value) => formik.setFieldValue("certIssueDate", value, true)}
                    slotProps={{
                    textField: {
                    variant: "standard",
                    error: false, 
                    }
                    }}
                  />
                  </LocalizationProvider>
                </FormControl>

                <h4>B2. Loaded quantity, unit measure and feedstock type</h4>

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
                   
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    disableFuture
                    size="large"
                    label="B/L date (dd/mm/yyyy)"
                    format="DD/MM/YYYY"
                    value={formik.values.blDate}
                    onChange={(value) => formik.setFieldValue("blDate", value, true)}
                    slotProps={{
                    textField: {
                    variant: "standard",
                    error: false, 
                    }
                    }}
                  />
                  </LocalizationProvider>
                </FormControl>

                <FormControl className="input-wrapper">
                  <TextField
                    fullWidth
                    id="uniqDelNum"
                    name="uniqDelNum"
                    variant="standard"
                    label="A unique delivery number"
                    value={formik.values.uniqDelNum}
                    onChange={formik.handleChange}
                    autoComplete="off"
                  />
                </FormControl>
                <FormControl className="input-wrapper">
                  <TextField
                    fullWidth
                    id="loadingPort"
                    name="loadingPort"
                    variant="standard"
                    label="Loading port"
                    value={formik.values.loadingPort}
                    onChange={formik.handleChange}
                    autoComplete="off"
                  />
                </FormControl>
                <FormControl className="input-wrapper">
                  <TextField
                    fullWidth
                    id="dischargePort"
                    name="dischargePort"
                    variant="standard"
                    label="Discharge port"
                    value={formik.values.dischargePort}
                    onChange={formik.handleChange}
                    autoComplete="off"
                  />
                </FormControl>

                <FormControl component="fieldset" className="input-wrapper">
                  <FormLabel component="legend" className="formLabel">
                    Name and address of recipient (Neste Counterparty)
                  </FormLabel>
                  {counterParties.map((recipientAddOption,indx) => (
                    <FormControlLabel
                      key={recipientAddOption.value+indx}
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
                              formik.values.recipientAdd.push(ev.target.value);
                            } else {
                              const index = formik.values.recipientAdd.indexOf(
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
                      {unitList.map((option,indx) => (
                        <FormControlLabel
                          key={option.value+indx}
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
                  {feedBackStockList.map((feedBackStockTypeOption,indx) => (
                    <FormControlLabel
                      key={feedBackStockTypeOption.value+indx}
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
                                formik.values.feedBackStockType.splice(
                                  index,
                                  1
                                );
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
                
                <FormControl className="upload-button-wrapper">
                <FormLabel component="legend" className="formLabel">
                    Upload Cerirficate :
                  </FormLabel>
              <Button variant="contained" component="label">
                Upload
                <input
                  id="file"
                  name="file"
                  multiple={true}
                  hidden
                  type="file"
                  onChange={(event) => { 
                    setSelectedFile(event.target.files);
                    setFilename(event.target.files.length > 1? event.target.files.length+" Files selected" : event.currentTarget.files[0].name); 
                  }}
                />
              </Button>
              {fileName}
            </FormControl>
                <br></br>
                <h4>B3. Market Compliance information.</h4>
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
                              formik.values.compliences.push(ev.target.value);
                            } else {
                              const index = formik.values.compliences.indexOf(
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

                {batchDetails.map((batch, index) => {
                  return (
                    <>
                      <FormControl className="customInput-wrapper">
                        <FormLabel 
                          component="label"
                          className="batchFormlabel"
                        >
                          {`Batch ${index + 1}:`}
                        </FormLabel>
                        <TextField 
                          fullWidth
                          id={batch.quantity}
                          name="batch"
                          variant="standard"
                          label="Loaded quantity(mt)"
                          value={batchDetails[index].quantity}
                          onChange={(event)=> updateFieldVal(event,batchDetails,index,'quantity')}
                          autoComplete="off"
                        />
                        <TextField 
                          fullWidth
                          id={batch.origin}
                          name={batch.origin}
                          variant="standard"
                          label="Origin"
                          value={batchDetails[index].origin}
                          onChange={(event)=> updateFieldVal(event,batchDetails,index,'origin')}
                          autoComplete="off"
                        />

                        <p
                          title="Remove"
                          className={
                            batchDetails.length < 2
                              ? "remove notAllowed"
                              : "remove"
                          }
                          onClick={() => removeRow(index)}
                        >
                          -
                        </p>
                      </FormControl>
                    </>
                  );
                })}
                <p className="add" title="Add new Batch" onClick={
                  () => addNewRow(batchDetails,7,'estate')}> 
                  + 
                </p>
              </div>
            </div>
          </TabPanel>

          {/** Seller & Cargo Details Tab Content End*/}

          {/** Traceability & GHG details Tab Content Start*/}

          <TabPanel value="1">
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
            <div className="traceability-ghgform-wrapper">
              <h3>Traceability & GHG information details</h3>
              <div className="form-wrapper">
                <h4>D1. Estate and Mill Data</h4>
                {millBatchDetails.map((batch, index) => {
                  return (
                    <>
                    <Card className="eachTranciability-wrapper">
                      <FormControl className="customInput-wrapper"> 
                        <TextField 
                          key={index+batch.millName}
                          fullWidth
                          id={batch.millName}
                          name="millName"
                          variant="standard"
                          label="Mill name"
                          value={batch.millName}
                          onChange={formik.handleChange}
                          autoComplete="off"
                        />
                        <TextField
                          key={index+batch.certNum}
                          fullWidth
                          id={batch.certNum}
                          name={batch.certNum}
                          variant="standard"
                          label="Certificate number of the mill"
                          value={batch.certNum}
                          onChange={formik.handleChange}
                          autoComplete="off"
                        />
                        <TextField 
                          key={index+batch.estateName}
                          fullWidth
                          id={batch.estateName}
                          name="estateName"
                          variant="standard"
                          label="Name of estate (s) or smallholders"
                          value={batch.estateName}
                          onChange={formik.handleChange}
                          autoComplete="off"
                        />
                        <TextField
                          key={index+batch.certNumCover}
                          fullWidth
                          id={batch.certNumCover}
                          name={batch.certNumCover}
                          variant="standard"
                          label="Certificate number covering the smallholders (if applicable)"
                          value={formik.values.batchDetails.certNumCover}
                          onChange={formik.handleChange}
                          autoComplete="off"
                        />
                        </FormControl>


                        <FormControl className="customInput-wrapper">  
                        <FormLabel component="label" className="optionLabel">
                          Dec 19th 2007, if EPA compliant
                        </FormLabel>
                        <Select
                          className="optionEpa"
                          labelId="country"
                          variant="standard"
                          id={batch.isEU}
                          name={batch.isEU}
                          value={batch.isEU}
                          onChange={(event) => {
                            formik.setFieldValue("country", event.target.value);
                          }}
                        >
                          {compliantList.map((option,indx) => (
                            <MenuItem key={option.value+indx} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>

                        
                        <FormLabel component="label" className="optionLabel">
                        Jan 1th 2008, if EU RED compliant
                        </FormLabel>
                        <Select
                          className="optionEpa"
                          labelId="country"
                          variant="standard"
                          id="country"
                          name="country"
                          value={formik.values.country}
                          onChange={(event) => {
                            formik.setFieldValue("country", event.target.value);
                          }}
                        >
                          {compliantList.map((option,indx) => (
                            <MenuItem key={option.value+indx} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>

                      </FormControl>

                      <FormControl className="customInput-wrapper">
                        
                      <TextField
                          key={index+batch.origin}
                          fullWidth
                          id={formik.batchDetails}
                          name={batch.batchDetails}
                          variant="standard"
                          label="Name of the warehouse / port prior to shipment"
                          value={formik.values.batchDetails.origin}
                          onChange={formik.handleChange}
                          autoComplete="off"
                        />
                        <TextField
                          key={formik.certNum+index}
                          fullWidth
                          id={formik.certNum}
                          name={formik.certNum}
                          variant="standard"
                          label="Certificate number of the warehouse / port"
                          value={formik.values.batchDetails.origin}
                          onChange={formik.handleChange}
                          autoComplete="off"
                        /> 
                        <TextField
                          key={batch.origin+index}
                          fullWidth
                          id={batch.origin}
                          name={batch.origin}
                          variant="standard"
                          label="Location of the warehouse (city, country)"
                          value={formik.values.batchDetails.origin}
                          onChange={formik.handleChange}
                          autoComplete="off"
                        />
                    </FormControl>
                    
                    <FormControl className="customInput-wrapper">
                    <TextField
                          key={index}
                          fullWidth
                          id={batch.origin}
                          name={batch.origin}
                          variant="standard"
                          label="Loaded quantity (mt)"
                          value={formik.values.batchDetails.origin}
                          onChange={formik.handleChange}
                          autoComplete="off"
                        />
                         <TextField
                        key={index}
                        fullWidth
                        id={batch.origin}
                        name={batch.origin}
                        variant="standard"
                        label="Batch no (from section C, tab 1)"
                        value={formik.values.batchDetails.origin}
                        onChange={formik.handleChange}
                        autoComplete="off"
                      />
                       <TextField
                          key={index}
                          fullWidth
                          id={batch.origin}
                          name={batch.origin}
                          variant="standard"
                          label="Total GHG Emission from the supply and use of the fuel"
                          value={formik.values.batchDetails.origin}
                          onChange={formik.handleChange}
                          autoComplete="off"
                        />
                        <p
                          title="Remove"
                          className={
                            batchDetails.length < 2
                              ? "remove notAllowed"
                              : "remove"
                          }
                          onClick={() => removeRow(index)}
                        >-</p>
                      </FormControl>
                      </Card>
                    </>
                  );
                })}
                <p className="add" title="Add new Batch" onClick={()=>addNewRow(batchDetails,7,'estateAndMill')}>+</p>

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
              </div>
            </div>
          </TabPanel>

          {/** Traceability & GHG details Tab Content END */}
        </form>
      </TabContext>
    </>
  );
};

export default DeliveryForm;
