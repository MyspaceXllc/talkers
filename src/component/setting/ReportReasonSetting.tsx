import Button from "@/extra/Button";
import Input from "@/extra/Input";
import {
  deleteReportSetting,
  getReportSetting,
  getSetting,
  settingSwitch,
  updateSetting,
} from "@/store/settingSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import { useTheme } from "@emotion/react";
import { FormControlLabel, Switch, styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import { openDialog } from "@/store/dialogSlice";
import ReportReasonDialogue from "../reportreason/ReportReasonDialogue";
import Table from "@/extra/Table";
import Image from "next/image";
import TrashIcon from "../../assets/icons/trashIcon.svg";
import EditIcon from "../../assets/icons/EditBtn.svg";
import { warning } from "@/util/Alert";
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
}

type ThemeType = "dark" | "light";
const ReportReasonSetting = () => {
  const { settingData } = useSelector((state: RootStore) => state.setting);

  const dispatch = useAppDispatch();

  console.log("settingData", settingData);

  const { dialogue, dialogueData, dialogueType } = useSelector(
    (state: RootStore) => state.dialogue
  );

  console.log("dialogueData", dialogueType);
  const [size, setSize] = useState(20);
  const [page, setPage] = useState(1);
  useClearSessionStorageOnPopState("multiButton")


  const theme: any = useTheme() as ThemeType;

  useEffect(() => {
    const payload: any = {};
    dispatch(getReportSetting(payload));
  }, [dispatch]);

  const handleDelete = (row) => {
    
    const data = warning();
    data
      .then((res) => {
        if (res) {
          const id = row?._id;
          dispatch(deleteReportSetting(id));
        }
      })
      .catch((err) => console.log(err));
  };

  const reportReasonTable = [
    {
      Header: "NO",
      body: "name",
      Cell: ({ index }) => <span>{index + 1}</span>,
    },
    {
      Header: "Title",
      body: "name",
      Cell: ({ row }) => <span className="text-capitalize">{row?.title}</span>,
    },

    {
      Header: "ACTION",
      body: "action",
      Cell: ({ row }) => (
        <div className="action-button">
          <Button
            btnIcon={
              <Image
                src={EditIcon}
                alt="Edit Icon"
                width={25}
                height={25}
              />
            }
            onClick={() => {
              dispatch(openDialog({ type: "editreportreason" , data : row }));
            }}
          />

          <Button
            btnIcon={
              <Image
                src={TrashIcon}
                alt="Trash Icon"
                width={25}
                height={25}
              />
            }
            onClick={() => handleDelete(row)}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      {dialogueType == "reportreason" && <ReportReasonDialogue />}
      {dialogueType == "editreportreason" && <ReportReasonDialogue />}


      <div className="payment-setting p-0">
        <div className="payment-setting-box">
          <div
            className="row"
            style={{ padding: "19px" }}
          >
            <div className="col-6">
              {}
              <div className="col-12 col-sm-6 col-md-6 col-lg-6 mt-2 m-sm-0 new-fake-btn">
                <Button
                  btnIcon={<AddIcon />}
                  btnName={"New"}
                  onClick={() => {
                    dispatch(openDialog({ type: "reportreason" }));
                  }}
                />
              </div>
            </div>
          </div>
          <div className="row px-4 pb-4">
            <div className="col-1fake2">
              <div className="withdrawal-box">
                <h6>Report Reason Setting</h6>
                <Table
                  data={settingData}
                  mapData={reportReasonTable}
                  PerPage={size}
                  Page={page}
                  type={"client"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReportReasonSetting;
