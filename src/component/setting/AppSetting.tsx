import Button from "@/extra/Button";
import Input, { Textarea } from "@/extra/Input";
import { getSetting, settingSwitch, updateSetting } from "@/store/settingSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import { useTheme } from "@emotion/react";
import { FormControlLabel, Switch, Typography, styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import Multiselect from "multiselect-react-dropdown";

import { useSelector } from "react-redux";
import useClearSessionStorageOnPopState from "@/extra/ClearStorage";
const MaterialUISwitch = styled(Switch)<{ theme: ThemeType }>(({ theme }) => ({
  width: "67px",
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    top: "8px",
    transform: "translateX(10px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(40px)",
      top: "8px",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M16.5992 5.06724L16.5992 5.06719C16.396 4.86409 16.1205 4.75 15.8332 4.75C15.546 4.75 15.2705 4.86409 15.0673 5.06719L15.0673 5.06721L7.91657 12.2179L4.93394 9.23531C4.83434 9.13262 4.71537 9.05067 4.58391 8.9942C4.45174 8.93742 4.30959 8.90754 4.16575 8.90629C4.0219 8.90504 3.87925 8.93245 3.74611 8.98692C3.61297 9.04139 3.49202 9.12183 3.3903 9.22355C3.28858 9.32527 3.20814 9.44622 3.15367 9.57936C3.0992 9.7125 3.07179 9.85515 3.07304 9.99899C3.07429 10.1428 3.10417 10.285 3.16095 10.4172C3.21742 10.5486 3.29937 10.6676 3.40205 10.7672L7.15063 14.5158L7.15066 14.5158C7.35381 14.7189 7.62931 14.833 7.91657 14.833C8.20383 14.833 8.47933 14.7189 8.68249 14.5158L8.68251 14.5158L16.5992 6.5991L16.5992 6.59907C16.8023 6.39592 16.9164 6.12042 16.9164 5.83316C16.9164 5.54589 16.8023 5.27039 16.5992 5.06724Z" fill="white" stroke="white" stroke-width="0.5"/></svg>')`,
      },
    },
    "& + .MuiSwitch-track": {
      opacity: 1,
      backgroundColor: theme === "dark" ? "#8796A5" : "#aab4be",
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme === "dark" ? "#0FB515" : "red",
    width: 24,
    height: 24,
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M14.1665 5.83301L5.83325 14.1663" stroke="white" stroke-width="2.5" stroke-linecap="round"/><path d="M5.83325 5.83301L14.1665 14.1663" stroke="white" stroke-width="2.5" stroke-linecap="round"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    borderRadius: "52px",
    border: "0.5px solid rgba(0, 0, 0, 0.14)",
    background: " #FFEDF0",
    boxShadow: "0px 0px 2px 0px rgba(0, 0, 0, 0.08) inset",
    opacity: 1,
    width: "79px",
    height: "28px",
  },
}));

interface SettingData {
  // Define types for setting data
  privacyPolicyLink?: string;
  privacyPolicyText?: string;
  agoraKey?: string;
  zegoAppSignIn?: string;
  adminCommissionOfPaidChannel?: number;
  adminCommissionOfPaidVideo?: number;
  durationOfShorts?: number;
  stripePublishableKey?: string;
  stripeSecretKey?: string;
  razorPayId?: string;
  razorSecretKey?: string;
  androidLicenseKey?: string;
  iosLicenseKey?: string;
  firebaseKeyText?: string;
  sightengineUser?: string;
  sightengineSecret?: string; 

}
// Define theme type
type ThemeType = "dark" | "light"; // Assuming there are only two possible theme values

const AppSetting = () => {
  const { settingData } = useSelector((state: RootStore) => state.setting);
  const dispatch = useAppDispatch();
  const [data, setData] = useState<SettingData>();
  const [privacyPolicyLink, setPrivacyPolicyLink] = useState<string>();
  const [privacyPolicyText, setPrivacyPolicyText] = useState<string>();
  const [zegoAppId, setZegoAppId] = useState<string>();
  const [zegoAppSignIn, setZegoAppSignIn] = useState<string>();
  const [coinCharge, setCoinCharge] = useState<number>();
  const [durationOfShorts, setDurationOfShorts] = useState<number>();
  const [stripePublishableKey, setStripePublishableKey] = useState<string>();
  const [currencySymbol, setCurrencySymbol] = useState<string>("");
  const [stripeSecretKey, setStripeSecretKey] = useState<string>();
  const [razorPayId, setRazorPayId] = useState<string>();
  const [razorSecretKey, setRazorSecretKey] = useState<string>();
  const [androidLicenseKey, setAndroidLicenseKey] = useState<string>();
  const [iosLicenseKey, setIosLicenseKey] = useState<string>();
  const [firebaseKeyText, setFirebaseKeyText] = useState<any>();
  const [stripeSwitch, setStripeSwitch] = useState<boolean>();
  const [razorPaySwitch, setRazorPaySwitch] = useState<boolean>();
  const [minCoinForCashOut, setMinCoinForCashOut] = useState<string>("");
  const [sightengineUser, setSightengineUser] = useState<string>("");
  const [sightengineSecret, setSightengineSecret] = useState<string>("");
  const [moderateData, setModerateData] = useState<any>([]);
  const [selectedValue, setSelectedValue] = useState([]);
  useClearSessionStorageOnPopState("multiButton")


  console.log("moderateData", moderateData);

  const theme: any = useTheme() as ThemeType; // Using useTheme hook and type assertion to cast Theme to ThemeType

  useEffect(() => {
    const payload: any = {};
    dispatch(getSetting(payload));
  }, []);

  useEffect(() => {
    setData(settingData);
  }, [settingData]);

  const moderateDataOption = settingData?.videoBanned?.map((data) => {
    return {
      name:
        (data == "1" && "Nudity and Adult Content") ||
        (data == "2" && "Hate and Offensive Signs") ||
        (data == "3" && "Violence") ||
        (data == "4" && "Gore and Disgusting") ||
        (data == "5" && "Weapons") ||
        (data == "6" && "Smoking and Tobacco Products") ||
        (data == "7" && "Recreational And Medical Drugs") ||
        (data == "8" && "Gambling") ||
        (data == "9" && "Alcoholic Beverages") ||
        (data == "10" && "Money And Banknotes") ||
        (data == "11" && "Selfharm"),
      id: data,
    };
  });

  console.log("moderateDataOption", moderateDataOption);
  useEffect(() => {
    setPrivacyPolicyLink(settingData?.privacyPolicyLink);
    setPrivacyPolicyText(settingData?.termsOfUsePolicyLink);
    setZegoAppId(settingData?.zegoAppId);
    setZegoAppSignIn(settingData?.zegoAppSignIn);
    setPrivacyPolicyLink(settingData?.privacyPolicyLink);
    setRazorPayId(settingData?.razorPayId);
    setRazorSecretKey(settingData?.razorSecretKey);
    setStripeSecretKey(settingData?.stripeSecretKey);
    setStripePublishableKey(settingData?.stripePublishableKey);
    setStripeSwitch(settingData?.stripeSwitch);
    setRazorPaySwitch(settingData?.razorPaySwitch);
    setDurationOfShorts(settingData?.durationOfShorts);
    setCoinCharge(settingData?.coinCharge);
    setCurrencySymbol(settingData?.currency?.symbol);
    setMinCoinForCashOut(settingData?.minCoinForCashOut);
    setModerateData(moderateDataOption);
    setSelectedValue(moderateDataOption);
    setAndroidLicenseKey(settingData?.androidLicenseKey);
    setIosLicenseKey(settingData?.iosLicenseKey);
    setFirebaseKeyText(JSON.stringify(settingData?.privateKey));
    setSightengineSecret(settingData?.sightengineSecret);
    setSightengineUser(settingData?.sightengineUser)

  }, [settingData]);

  const handleSubmit = () => {
    const idsString = moderateData.map((data) => data.id).join(",");
    const settingDataAd = {
      privacyPolicyLink: privacyPolicyLink,
      privacyPolicyText: privacyPolicyText,
      zegoAppId: zegoAppId,
      zegoAppSignIn: zegoAppSignIn,
      coinCharge: coinCharge,
      durationOfShorts: durationOfShorts,
      razorPayId: razorPayId,
      razorSecretKey: razorSecretKey,
      stripeSecretKey: stripeSecretKey,
      stripePublishableKey: stripePublishableKey,
      minCoinForCashOut: minCoinForCashOut,
      videoBanned: idsString,
      iosLicenseKey: iosLicenseKey,
      androidLicenseKey: androidLicenseKey,
      privateKey: firebaseKeyText,
      sightengineUser : sightengineUser,
      sightengineSecret : sightengineSecret
    };

    const payload: any = {
      data: settingDataAd,
      settingId: settingData?._id,
    };

    dispatch(updateSetting(payload));
  };

  const moderationOption = [
    { name: "Nudity and Adult Content", id: 1 },
    { name: "Hate and Offensive Signs", id: 2 },
    { name: "Violence", id: 3 },
    { name: "Gore and Disgusting", id: 4 },
    { name: "Weapons", id: 5 },
    { name: "Smoking and Tobacco Products", id: 6 },
    { name: "Recreational And Medical Drugs", id: 7 },
    { name: "Gambling", id: 8 },
    { name: "Alcoholic Beverages", id: 9 },
    { name: "Money And Banknotes", id: 10 },
    { name: "Selfharm", id: 11 },
  ];

  function onSelect(selectedList, selectedItem) {
    
    // console.log('selectedItem', selectedItem)
    // moderateData?.push(selectedItem.name);
    setModerateData(
      selectedList.map((data) => ({ id: data.id, name: data.name }))
    );
    
    console.log("moderateData---------203", moderateData);
  }

  console.log("moderateData", moderateData);

  function onRemove(selectedList, removedItem) {
    
    setModerateData(
      selectedList.map((data) => ({ id: data.id, name: data.name }))
    );

    

    console.log("moderateData---------203", moderateData);
  }

  return (
    <>
      <div className="payment-setting p-0">
        <div className="payment-setting-box">
          <div className="row" style={{ padding: "19px" }}>
            <div className="col-6"></div>
            <div className="col-6 d-flex justify-content-end">
              <Button
                btnName={"Submit"}
                type={"button"}
                onClick={handleSubmit}
                newClass={"submit-btn"}
                style={{
                  borderRadius: "0.5rem",
                  width: "88px",
                  marginLeft: "10px",
                }}
              />
            </div>
          </div>
          <div className="row" style={{ padding: "23px" }}>
            <div className="col-6">
              <div className="mb-4">
                <div className="withdrawal-box payment-box">
                  <h6>App Setting</h6>
                  <div className="row">
                    <div className="row">
                      <div className="col-6 withdrawal-input border-setting">
                        <Input
                          label={"Privacy Policy Link"}
                          name={"privacyPolicyLink"}
                          type={"text"}
                          value={privacyPolicyLink || ""}
                          placeholder={""}
                          onChange={(e) => {
                            setPrivacyPolicyLink(e.target.value);
                          }}
                        />
                      </div>
                      <div className="col-6 withdrawal-input">
                        <Input
                          label={"Terms and Condition"}
                          name={"privacyPolicyText"}
                          value={privacyPolicyText || ""}
                          type={"text"}
                          placeholder={""}
                          onChange={(e) => {
                            setPrivacyPolicyText(e.target.value);
                          }}
                        />
                      </div>
                      <div className="col-6 withdrawal-input">
                        <Input
                          label={"Zego AppId"}
                          name={"zegoAppId"}
                          type={"text"}
                          value={zegoAppId || ""}
                          placeholder={""}
                          onChange={(e) => {
                            setZegoAppId(e.target.value);
                          }}
                        />
                      </div>
                      <div className="col-6 withdrawal-input">
                        <Input
                          label={"Zego App SignIn"}
                          name={"zegoAppSignIn"}
                          value={zegoAppSignIn || ""}
                          type={"text"}
                          placeholder={""}
                          onChange={(e) => {
                            setZegoAppSignIn(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="withdrawal-box payment-box mt-2">
                  <h6>Coin Setting</h6>
                  <div className="row">
                    <div className="row">
                      <div className="col-6 withdrawal-input">
                        <div className="row">
                          <div className="col-11">
                            <Input
                              label={`Amount(${currencySymbol})`}
                              name={"durationOfShorts"}
                              type={"number"}
                              value={`1`}
                              placeholder={""}
                              readOnly
                            />
                          </div>

                          <p className="col-1 d-flex align-items-center mt-3 fs-5">
                            =
                          </p>
                        </div>
                      </div>

                      <div className="col-6 withdrawal-input">
                        <Input
                          label={"Coin  (how many coins for withdrawal)"}
                          name={"Coin"}
                          value={minCoinForCashOut}
                          type={"number"}
                          placeholder={""}
                          onChange={(e) => {
                            setMinCoinForCashOut(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="withdrawal-box payment-box mt-2">
                  <h6>Firebase Notification Setting</h6>
                  <div className="row">
                    <div className="row">
                      <div className="col-12 withdrawal-input">
                        <div className="row">
                          <div className="col-12">
                            {/* <label>Private Key JSON</label> */}
                            <Textarea 
                              row={10}
                              col = {60}
                              type={`text`}
                              id={`firebaseKey`}
                              name={`firebaseKey`}
                              label={`Private Key JSON`}
                              placeholder={`Enter firebaseKey`}                            
                              value={firebaseKeyText}
                              onChange= {
                                (e) => {
                                  setFirebaseKeyText(e.target.value);
                                }
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-6">
              <div className="mb-4">
                <div className="withdrawal-box payment-box">
                  <h6>Video Short Setting</h6>
                  <div className="row">
                    <div className="row">
                      {/* <div className="col-6 withdrawal-input">
                        <Input
                          label={"Coin Charge"}
                          name={"coinCharge"}
                          value={coinCharge}
                          type={"number"}
                          placeholder={""}
                          onChange={(e) => {
                            setCoinCharge(e.target.value);
                          }}
                        />
                      </div> */}
                      <div className="col-6 withdrawal-input">
                        <Input
                          label={"Duration Of Shorts (max second)"}
                          name={"durationOfShorts"}
                          type={"number"}
                          value={durationOfShorts}
                          placeholder={""}
                          onChange={(e) => {
                            setDurationOfShorts(e.target.value);
                          }}
                        />
                      </div>

                      <div></div>
                    </div>
                  </div>
                </div>

                <div className="withdrawal-box payment-box mt-2">
                  <h6>Video Moderation Setting</h6>
                  <div className="row">
                    <div style={{ display: "flex", rowGap: "10px" }}>
                      <Multiselect
                        options={moderationOption}
                        selectedValues={selectedValue} // Preselected value to persist in dropdown
                        onSelect={onSelect} // Function will trigger on select event
                        onRemove={onRemove} // Function will trigger on remove event
                        displayValue="name" // Property name to display in the dropdown options
                        className="form-control pointer"
                      />
                    </div>

                    <div className="col-6 withdrawal-input">
                        <Input
                          label={"Slightengine API Secret"}
                          name={"SightengineSecret"}
                          type={"text"}
                          value={sightengineSecret || ""}
                          placeholder={""}
                          onChange={(e) => {
                            setSightengineSecret(e.target.value);
                          }}
                        />
                      </div>

                      <div className="col-6 withdrawal-input">
                        <Input
                          label={"Slightengine API User"}
                          name={"Sightinuser"}
                          value={sightengineUser || ""}
                          type={"text"}
                          placeholder={""}
                          onChange={(e) => {
                            setSightengineUser(e.target.value);
                          }}
                        />
                      </div>

                  </div>
                </div>

                <div className="withdrawal-box payment-box mt-2">
                  <h6>Short Effect Setting</h6>
                  <div className="row">
                    <div className="row">
                      <div className="col-6 withdrawal-input">
                        <Input
                          label={"Android LicenseKey"}
                          name={"Android LicenseKey"}
                          type={"text"}
                          value={androidLicenseKey || ""}
                          placeholder={""}
                          onChange={(e) => {
                            setAndroidLicenseKey(e.target.value);
                          }}
                        />
                      </div>

                      <div className="col-6 withdrawal-input">
                        <Input
                          label={"IOS LicenseKey"}
                          name={"IOS LicenseKey"}
                          value={iosLicenseKey || ""}
                          type={"text"}
                          placeholder={""}
                          onChange={(e) => {
                            setIosLicenseKey(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppSetting;
