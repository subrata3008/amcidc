import React, { useState } from "react";
import { useFormik } from "formik";
//import { validationSchema } from "../../utils";
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
  batchType,
  baseApiUrl,
} from "../../constants";
import MuiAlert from "@mui/material/Alert";
import { TabContext, TabPanel } from "@mui/lab";
//import { formSubmitService } from "../services/formService";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const DeliveryForm = () => {
  const [openAlert, setOpenAlert] = useState(false);
  const [fileName, setFilename] = useState("");
  const [selectedFile, setSelectedFile] = useState();

  const initialBatchDetails = { quantity: "", origin: "" };
  const [batchDetails, setBatchDetails] = useState([initialBatchDetails]);

  const initialMillBatchDetails = {
    millName: "",
    certNum: "",
    estateName: "",
    certNumCover: "",
    isEpa: "",
    isEU: "",
    wareHouseName: "",
    certNumWareHouse: "",
    wareHouseLoc: "",
    loadedQuantity: "",
    batchNo: "",
    totalGhgEMission: "",
  };
  const [millBatchDetails, setMillBatchDetails] = useState([
    initialMillBatchDetails,
  ]);

  const initialRefineryDetails = {
    refinaryName: "",
    certNumOfRefinery: "",
    refineryLoc: "",
    warePriorshipment: "",
    wareCertNum: "",
    warehousecity: "",
    loadedQuant: "",
    batchNoTwo: "",
  };
  const [refineryDetails, setRefineryDetails] = useState([
    initialRefineryDetails,
  ]);

  const initialShippedVolumeDetails = {
    estateNamelast: "",
    prodFrom: "",
    prodTo: "",
    febSupplied: "",
    cpoProduced: "",
  };
  const [shippedVolumeDetails, setShippedVolumeDetails] = useState([
    initialShippedVolumeDetails,
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
      recipientAdd: "",
      loadedQuantity: "",
      feedBackStockType: [],
      file: "",
      compliences: [],
      batchDetails: "",
      millBatchDetails: "",
      refineryDetails: "",
      shippedVolumeDetails: "",
    },
    //validationSchema: validationSchema,
    onSubmit: (values) => { 
      const files = selectedFile ? [...selectedFile] : []; 
      values.file = files;
      values.batchDetails = batchDetails;
      values.millBatchDetails = millBatchDetails;
      values.refineryDetails = refineryDetails;
      values.shippedVolumeDetails = shippedVolumeDetails;
      console.log(values);
      //formService
      formSubmission(values,selectedFile); 
    },
  });



  /**
   * Update each filed in loop generic function
   * @param {*} eve
   * @param {*} dataList
   * @param {*} index
   * @param {*} keyName
   * @param {*} type
   */
  const updateFieldVal = (eve, dataList, index, keyName, type) => {
    //debugger;
    const updatedList = { ...dataList[index], [keyName]: eve.target.value };
    const newList = [
      ...dataList.slice(0, index),
      updatedList,
      ...dataList.slice(index + 1),
    ];
    if (type === batchType.SELLER) {
      setBatchDetails(newList);
    }
    if (type === batchType.ESTATEMILL) {
      setMillBatchDetails(newList);
    }
    if (type === batchType.REFINERYWAREHOUSEDATA) {
      setRefineryDetails(newList);
    }
    if (type === batchType.SHIPPEDPRODUCEDVOL) {
      setShippedVolumeDetails(newList);
    }
  };


  /**
   * Form Sunmission method
   * @param {*} formValues
   */
  const formSubmission = (formValues,filesArr) => { 
    delete formValues.file;
    const files = filesArr ? [...filesArr] : [];
    const requestOptionsFormData = {
      method: "POST",
      headers: { 'content-type': 'application/json' },
      mode: "no-cors",
      body: JSON.stringify(JSON.stringify(formValues, null, 2)),
    };
    const data = new FormData();
    console.log(files);
    files.forEach((file, i) => {
        data.append(`file-${i}`, file);
      }); 
      const uploadRequestOptions = {
        method: "POST",
        headers: { 'content-type': 'application/json' },
        mode: "no-cors",
        body: data
      };
    Promise.all([
      fetch(baseApiUrl + "/formdataSupplier_Criteria_Input", requestOptionsFormData),
      fetch(baseApiUrl + "/createSupplier_Criteria_Input", uploadRequestOptions),
    ]).then(([formData, uploadData]) => 
        Promise.all([formData.json(), uploadData.json()])
      )
    .then(async (formDataResponse,uploadDataResponse) => { 
      formik.resetForm();
      setOpenAlert(!openAlert);
      setSuccess("success");
      setMsg("Data successfully submitted!!");
    })
    .catch((error) => {
      setOpenAlert(!openAlert);
      formik.resetForm();
      setSuccess("error");
      setMsg("Some error occured");
    }); 
}



  /**
   * Add new Row universal Function
   * @param {*} batchDetails
   * @param {*} limit
   */
  const addNewRow = (dataList, limit, type) => {
    if (dataList.length < limit) {
      if (type === batchType.SELLER) {
        setBatchDetails((oldArray) => [...oldArray, initialBatchDetails]);
      }
      if (type === batchType.ESTATEMILL) {
        setMillBatchDetails((oldArray) => [
          ...oldArray,
          initialMillBatchDetails,
        ]);
      }
      if (type === batchType.REFINERYWAREHOUSEDATA) {
        setRefineryDetails((oldArray) => [...oldArray, initialRefineryDetails]);
      }
      if (type === batchType.SHIPPEDPRODUCEDVOL) {
        setShippedVolumeDetails((oldArray) => [
          ...oldArray,
          initialShippedVolumeDetails,
        ]);
      }
    }
  };

  /**
   *  Remove fields from a loop
   *
   * @param {*} delindex
   * @param {*} datalist
   * @param {*} type
   * @returns
   */
  const removeRow = (delindex, datalist, type) => {
    if (datalist.length < 2) {
      return;
    }
    if (type === batchType.SELLER) {
      setBatchDetails((batchs) =>
        batchs.filter((_, index) => index !== delindex)
      );
    }
    if (type === batchType.ESTATEMILL) {
      setMillBatchDetails((batchs) =>
        batchs.filter((_, index) => index !== delindex)
      );
    }
    if (type === batchType.REFINERYWAREHOUSEDATA) {
      setRefineryDetails((batchs) =>
        batchs.filter((_, index) => index !== delindex)
      );
    }
    if (type === batchType.SHIPPEDPRODUCEDVOL) {
      setShippedVolumeDetails((batchs) =>
        batchs.filter((_, index) => index !== delindex)
      );
    }
  };

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
                  onClick={() => {
                    setTabindex(index.toString());
                    console.log(formik.values.batchDetails);
                    formik.setFieldValue("batchDetails", batchDetails);
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
                  Seller Details. Please provide here your own details
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

                <h4>Seller's Certificate Details.</h4>

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
                      size="large"
                      label="Date of certificate issued"
                      format="DD/MM/YYYY"
                      value={formik.values.certIssueDate}
                      onChange={(value) =>
                        formik.setFieldValue("certIssueDate", value, true)
                      }
                      slotProps={{
                        textField: {
                          variant: "standard",
                          error: false,
                        },
                      }}
                    />
                  </LocalizationProvider>
                </FormControl>

                <h4>Loaded quantity, unit measure and feedstock type</h4>

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
                      size="large"
                      label="B/L date (dd/mm/yyyy)"
                      format="DD/MM/YYYY"
                      value={formik.values.blDate}
                      onChange={(value) =>
                        formik.setFieldValue("blDate", value, true)
                      }
                      slotProps={{
                        textField: {
                          variant: "standard",
                          error: false,
                        },
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
                    Name and address of recipient 
                  </FormLabel>
                  <RadioGroup
                    aria-label="recipientAdd"
                    name="recipientAdd"
                    value={formik.values.recipientAdd}
                  >
                    {counterParties.map((option, indx) => (
                      <FormControlLabel
                        key={option.value + indx}
                        value={option.value}
                        onChange={formik.handleChange}
                        control={<Radio color="default" />}
                        label={option.label}
                        defaultChecked={formik.values.recipientAdd === ""}
                      />
                    ))}
                  </RadioGroup>
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
                      {unitList.map((option, indx) => (
                        <FormControlLabel
                          key={option.value + indx}
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
                  <RadioGroup
                    aria-label="feedBackStockType"
                    name="feedBackStockType"
                    value={formik.values.feedBackStockType}
                  >
                    {feedBackStockList.map((option, indx) => (
                      <FormControlLabel
                        key={option.value + indx}
                        value={option.value}
                        onChange={formik.handleChange}
                        control={<Radio color="default" />}
                        label={option.label}
                        defaultChecked={formik.values.feedBackStockType === ""}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>



                {/* <FormControl component="fieldset" className="input-wrapper">
                  <FormLabel component="legend" className="formLabel">
                    Feedstock type
                  </FormLabel>
                  {feedBackStockList.map((feedBackStockTypeOption, indx) => (
                    <FormControlLabel
                      key={feedBackStockTypeOption.value + indx}
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
                </FormControl> */}

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
                        setFilename(
                          event.target.files.length > 1
                            ? event.target.files.length + " Files selected"
                            : event.currentTarget.files[0].name
                        );
                      }}
                    />
                  </Button>
                  {fileName}
                </FormControl>
                <br></br>
                <h4>Market Compliance information.</h4>
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
                      <div className="customInput-wrapper">
                        <FormLabel component="label" className="batchFormlabel">
                          {`Batch ${index + 1}:`}
                        </FormLabel>
                        <TextField
                          fullWidth
                          id={batch.quantity}
                          name="batch"
                          variant="standard"
                          label="Loaded quantity(mt)"
                          value={batchDetails[index].quantity}
                          onChange={(event) =>
                            updateFieldVal(
                              event,
                              batchDetails,
                              index,
                              "quantity",
                              batchType.SELLER
                            )
                          }
                          autoComplete="off"
                        />
                        <TextField
                          fullWidth
                          id={batch.origin}
                          name={batch.origin}
                          variant="standard"
                          label="Origin"
                          value={batchDetails[index].origin}
                          onChange={(event) =>
                            updateFieldVal(
                              event,
                              batchDetails,
                              index,
                              "origin",
                              batchType.SELLER
                            )
                          }
                          autoComplete="off"
                        />

                        <p
                          title="Remove"
                          className={
                            batchDetails.length < 2
                              ? "remove notAllowed"
                              : "remove"
                          }
                          onClick={() =>
                            removeRow(index, batchDetails, batchType.SELLER)
                          }
                        >
                          -
                        </p>
                      </div>
                    </>
                  );
                })}
                <p
                  className="add"
                  title="Add new Batch"
                  onClick={() => addNewRow(batchDetails, 7, batchType.SELLER)}
                >
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
                <h4>Estate and Mill Data</h4>
                {millBatchDetails.map((millbatch, index) => {
                  return (
                    <>
                      <Card className="eachTranciability-wrapper">
                        <div className="customInput-wrapper">
                          <TextField
                            fullWidth
                            id={millbatch.millName}
                            name="millName"
                            variant="standard"
                            label="Mill name"
                            value={millbatch.millName}
                            onChange={(event) =>
                              updateFieldVal(
                                event,
                                millBatchDetails,
                                index,
                                "millName",
                                batchType.ESTATEMILL
                              )
                            }
                            autoComplete="off"
                          />
                          <TextField
                            fullWidth
                            id={millbatch.certNum}
                            name={millbatch.certNum}
                            variant="standard"
                            label="Certificate number of the mill"
                            value={millbatch.certNum}
                            onChange={(event) =>
                              updateFieldVal(
                                event,
                                millBatchDetails,
                                index,
                                "certNum",
                                batchType.ESTATEMILL
                              )
                            }
                            autoComplete="off"
                          />
                          <TextField
                            fullWidth
                            id={millbatch.estateName}
                            name="estateName"
                            variant="standard"
                            label="Name of estate (s) or smallholders"
                            value={millbatch.estateName}
                            onChange={(event) =>
                              updateFieldVal(
                                event,
                                millBatchDetails,
                                index,
                                "estateName",
                                batchType.ESTATEMILL
                              )
                            }
                            autoComplete="off"
                          />
                          <TextField
                            fullWidth
                            id={millbatch.certNumCover}
                            name={millbatch.certNumCover}
                            variant="standard"
                            label="Certificate number covering the smallholders (if applicable)"
                            value={formik.values.batchDetails.certNumCover}
                            onChange={(event) =>
                              updateFieldVal(
                                event,
                                millBatchDetails,
                                index,
                                "certNumCover",
                                batchType.ESTATEMILL
                              )
                            }
                            autoComplete="off"
                          />
                        </div>

                        <div className="customInput-wrapper">
                          <FormLabel component="label" className="optionLabel">
                            Dec 19th 2007, if EPA compliant
                          </FormLabel>
                          <Select
                            className="optionEpa"
                            labelId="isEpa"
                            variant="standard"
                            id={millbatch.isEpa}
                            name={millbatch.isEpa}
                            value={millbatch.isEpa}
                            onChange={(event) =>
                              updateFieldVal(
                                event,
                                millBatchDetails,
                                index,
                                "isEpa",
                                batchType.ESTATEMILL
                              )
                            }
                          >
                            {compliantList.map((option, indx) => (
                              <MenuItem
                                key={option.value + indx}
                                value={option.value}
                              >
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>

                          <FormLabel component="label" className="optionLabel">
                            Jan 1th 2008, if EU RED compliant
                          </FormLabel>
                          <Select
                            className="optionEpa"
                            labelId="isEU"
                            variant="standard"
                            id={millbatch.isEU}
                            name={millbatch.isEU}
                            value={millbatch.isEU}
                            onChange={(event) =>
                              updateFieldVal(
                                event,
                                millBatchDetails,
                                index,
                                "isEU",
                                batchType.ESTATEMILL
                              )
                            }
                          >
                            {compliantList.map((option, indx) => (
                              <MenuItem
                                key={option.value + indx}
                                value={option.value}
                              >
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </div>

                        <div className="customInput-wrapper">
                          <TextField
                            key={index + millbatch.origin}
                            fullWidth
                            id={formik.millbatchDetails}
                            name={millbatch.wareHouseName}
                            variant="standard"
                            label="Name of the warehouse / port prior to shipment"
                            value={formik.values.batchDetails.origin}
                            onChange={(event) =>
                              updateFieldVal(
                                event,
                                millBatchDetails,
                                index,
                                "wareHouseName",
                                batchType.ESTATEMILL
                              )
                            }
                            autoComplete="off"
                          />
                          <TextField
                            fullWidth
                            id={formik.certNumWareHouse}
                            name={formik.certNumWareHouse}
                            variant="standard"
                            label="Certificate number of the warehouse / port"
                            value={formik.values.batchDetails.origin}
                            onChange={(event) =>
                              updateFieldVal(
                                event,
                                millBatchDetails,
                                index,
                                "certNumWareHouse",
                                batchType.ESTATEMILL
                              )
                            }
                            autoComplete="off"
                          />
                          <TextField
                            fullWidth
                            id={millbatch.origin}
                            name={millbatch.origin}
                            variant="standard"
                            label="Location of the warehouse (city, country)"
                            value={formik.values.batchDetails.origin}
                            onChange={(event) =>
                              updateFieldVal(
                                event,
                                millBatchDetails,
                                index,
                                "wareHouseLoc",
                                batchType.ESTATEMILL
                              )
                            }
                            autoComplete="off"
                          />
                        </div>

                        <div className="customInput-wrapper">
                          <TextField
                            fullWidth
                            id={millbatch.origin}
                            name={millbatch.origin}
                            variant="standard"
                            label="Loaded quantity (mt)"
                            value={formik.values.batchDetails.origin}
                            onChange={(event) =>
                              updateFieldVal(
                                event,
                                millBatchDetails,
                                index,
                                "loadedQuantity",
                                batchType.ESTATEMILL
                              )
                            }
                            autoComplete="off"
                          />
                          <TextField
                            fullWidth
                            id={millbatch.origin}
                            name={millbatch.origin}
                            variant="standard"
                            label="Batch no (from section C, tab 1)"
                            value={formik.values.batchDetails.origin}
                            onChange={(event) =>
                              updateFieldVal(
                                event,
                                millBatchDetails,
                                index,
                                "batchNo",
                                batchType.ESTATEMILL
                              )
                            }
                            autoComplete="off"
                          />
                          <TextField
                            fullWidth
                            id={millbatch.origin}
                            name={millbatch.origin}
                            variant="standard"
                            label="Total GHG Emission from the supply and use of the fuel"
                            value={formik.values.batchDetails.origin}
                            onChange={(event) =>
                              updateFieldVal(
                                event,
                                millBatchDetails,
                                index,
                                "totalGhgEMission",
                                batchType.ESTATEMILL
                              )
                            }
                            autoComplete="off"
                          />
                          <p
                            title="Remove"
                            className={
                              millBatchDetails.length < 2
                                ? "remove notAllowed"
                                : "remove"
                            }
                            onClick={() =>
                              removeRow(
                                index,
                                millBatchDetails,
                                batchType.ESTATEMILL
                              )
                            }
                          >
                            -
                          </p>
                        </div>
                      </Card>
                    </>
                  );
                })}
                <p
                  className="add"
                  title="Add new Batch"
                  onClick={() =>
                    addNewRow(
                      millBatchDetails,
                      batchDetails.length,
                      batchType.ESTATEMILL
                    )
                  }
                >
                  +
                </p>
              </div>

              <div className="form-wrapper">
                <h4>Refinery and Warehouse Data</h4>
                {refineryDetails.map((refinerybatch, index) => {
                  return (
                    <>
                      <Card className="eachTranciability-wrapper">
                        <div className="customInput-wrapper">
                          <TextField
                            fullWidth
                            id={refinerybatch.refinaryName}
                            name="refinaryName"
                            variant="standard"
                            label="Name of the refinery"
                            value={refinerybatch.refinaryName}
                            onChange={(event) =>
                              updateFieldVal(
                                event,
                                refineryDetails,
                                index,
                                "refinaryName",
                                batchType.REFINERYWAREHOUSEDATA
                              )
                            }
                            autoComplete="off"
                          />
                          <TextField
                            fullWidth
                            id={refinerybatch.certNumOfRefinery}
                            name={refinerybatch.certNumOfRefinery}
                            variant="standard"
                            label="Certificate number of the refinery"
                            value={refinerybatch.certNumOfRefinery}
                            onChange={(event) =>
                              updateFieldVal(
                                event,
                                refineryDetails,
                                index,
                                "certNumOfRefinery",
                                batchType.REFINERYWAREHOUSEDATA
                              )
                            }
                            autoComplete="off"
                          />
                          <TextField
                            fullWidth
                            id={refinerybatch.refineryLoc}
                            name="refineryLoc"
                            variant="standard"
                            label="Location of the refinery
                            (city, country)"
                            value={refinerybatch.refineryLoc}
                            onChange={(event) =>
                              updateFieldVal(
                                event,
                                refineryDetails,
                                index,
                                "refineryLoc",
                                batchType.REFINERYWAREHOUSEDATA
                              )
                            }
                            autoComplete="off"
                          />
                          <TextField
                            fullWidth
                            id={refinerybatch.warePriorshipment}
                            name={refinerybatch.warePriorshipment}
                            variant="standard"
                            label="Name of the warehouse / port prior to shipment"
                            value={refinerybatch.warePriorshipment}
                            onChange={(event) =>
                              updateFieldVal(
                                event,
                                refineryDetails,
                                index,
                                "warePriorshipment",
                                batchType.REFINERYWAREHOUSEDATA
                              )
                            }
                            autoComplete="off"
                          />
                        </div>

                        <div className="customInput-wrapper">
                          <TextField
                            fullWidth
                            id={refinerybatch.wareCertNum}
                            name={refinerybatch.wareCertNum}
                            variant="standard"
                            label="Certificate number of the warehouse / port"
                            value={refinerybatch.origin}
                            onChange={(event) =>
                              updateFieldVal(
                                event,
                                refineryDetails,
                                index,
                                "wareCertNum",
                                batchType.REFINERYWAREHOUSEDATA
                              )
                            }
                            autoComplete="off"
                          />
                          <TextField
                            fullWidth
                            id={refinerybatch.warehousecity}
                            name={refinerybatch.warehousecity}
                            variant="standard"
                            label="Location of the warehouse
                            (city, country)"
                            value={refinerybatch.warehousecity}
                            onChange={(event) =>
                              updateFieldVal(
                                event,
                                refineryDetails,
                                index,
                                "warehousecity",
                                batchType.REFINERYWAREHOUSEDATA
                              )
                            }
                            autoComplete="off"
                          />
                          <TextField
                            fullWidth
                            id={refinerybatch.loadedQuant}
                            name={refinerybatch.loadedQuant}
                            variant="standard"
                            label="Loaded 
                            quantity (mt)"
                            value={refinerybatch.loadedQuant}
                            onChange={(event) =>
                              updateFieldVal(
                                event,
                                refineryDetails,
                                index,
                                "loadedQuant",
                                batchType.REFINERYWAREHOUSEDATA
                              )
                            }
                            autoComplete="off"
                          />
                        </div>

                        <div className="customInput-wrapper">
                          <TextField
                            fullWidth
                            id={refinerybatch.batchNoTwo}
                            name={refinerybatch.batchNoTwo}
                            variant="standard"
                            label="Batch no
                            (from section C, tab 1)"
                            value={refinerybatch.batchNoTwo}
                            onChange={(event) =>
                              updateFieldVal(
                                event,
                                refineryDetails,
                                index,
                                "batchNoTwo",
                                batchType.REFINERYWAREHOUSEDATA
                              )
                            }
                            autoComplete="off"
                          />
                          <p
                            title="Remove"
                            className={
                              refineryDetails.length < 2
                                ? "remove refineryRemove notAllowed"
                                : "remove refineryRemove"
                            }
                            onClick={() =>
                              removeRow(
                                index,
                                refineryDetails,
                                batchType.REFINERYWAREHOUSEDATA
                              )
                            }
                          >
                            -
                          </p>
                        </div>
                      </Card>
                    </>
                  );
                })}
                <p
                  className="add"
                  title="Add new Batch"
                  onClick={() =>
                    addNewRow(
                      refineryDetails,
                      batchDetails.length,
                      batchType.REFINERYWAREHOUSEDATA
                    )
                  }
                >
                  +
                </p>
              </div>

              <div className="form-wrapper">
                <h4>Volumes produced, as shipped. </h4>
                {shippedVolumeDetails.map((shippedbatch, index) => {
                  return (
                    <>
                      <Card className="eachTranciability-wrapper">
                        <div className="customInput-wrapper">
                          <TextField
                            fullWidth
                            id={shippedbatch.estateNamelast}
                            name="estateNamelast"
                            variant="standard"
                            label="Estate Names"
                            value={shippedbatch.estateNamelast}
                            onChange={(event) =>
                              updateFieldVal(
                                event,
                                shippedVolumeDetails,
                                index,
                                "estateNamelast",
                                batchType.SHIPPEDPRODUCEDVOL
                              )
                            }
                            autoComplete="off"
                          />

                          <FormLabel
                            component="legend"
                            className="formLabel periodLabel"
                          >
                            Period of Production (DD/MM/YY)
                          </FormLabel>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              size="large"
                              label="From"
                              format="DD/MM/YYYY"
                              value={shippedbatch.prodFrom}
                              onChange={(event) =>
                                updateFieldVal(
                                  event,
                                  shippedVolumeDetails,
                                  index,
                                  "prodFrom",
                                  batchType.SHIPPEDPRODUCEDVOL
                                )
                              }
                              slotProps={{
                                textField: {
                                  variant: "standard",
                                  error: false,
                                },
                              }}
                            />
                          </LocalizationProvider>

                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              size="large"
                              label="To"
                              format="DD/MM/YYYY"
                              value={shippedbatch.prodTo}
                              onChange={(event) =>
                                updateFieldVal(
                                  event,
                                  shippedVolumeDetails,
                                  index,
                                  "prodTo",
                                  batchType.SHIPPEDPRODUCEDVOL
                                )
                              }
                              slotProps={{
                                textField: {
                                  variant: "standard",
                                  error: false,
                                },
                              }}
                            />
                          </LocalizationProvider>
                        </div>

                        <div className="customInput-wrapper">
                          <TextField
                            fullWidth
                            id={shippedbatch.febSupplied}
                            name={shippedbatch.febSupplied}
                            variant="standard"
                            label="FFB supplied (mt)"
                            value={shippedbatch.febSupplied}
                            onChange={(event) =>
                              updateFieldVal(
                                event,
                                shippedVolumeDetails,
                                index,
                                "febSupplied",
                                batchType.SHIPPEDPRODUCEDVOL
                              )
                            }
                            autoComplete="off"
                          />
                          <TextField
                            fullWidth
                            id={shippedbatch.cpoProduced}
                            name="cpoProduced"
                            variant="standard"
                            label="CPO produced (mt)"
                            value={shippedbatch.cpoProduced}
                            onChange={(event) =>
                              updateFieldVal(
                                event,
                                shippedVolumeDetails,
                                index,
                                "cpoProduced",
                                batchType.SHIPPEDPRODUCEDVOL
                              )
                            }
                            autoComplete="off"
                          />
                          <p
                            title="Remove"
                            className={
                              shippedVolumeDetails.length < 2
                                ? "remove refineryRemove notAllowed"
                                : "remove refineryRemove"
                            }
                            onClick={() =>
                              removeRow(
                                index,
                                shippedVolumeDetails,
                                batchType.SHIPPEDPRODUCEDVOL
                              )
                            }
                          >
                            -
                          </p>
                        </div>
                      </Card>
                    </>
                  );
                })}
                <p
                  className="add"
                  title="Add new Batch"
                  onClick={() =>
                    addNewRow(
                      shippedVolumeDetails,
                      10,
                      batchType.SHIPPEDPRODUCEDVOL
                    )
                  }
                >
                  +
                </p>

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
