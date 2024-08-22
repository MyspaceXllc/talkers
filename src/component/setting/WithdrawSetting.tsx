import Button from "@/extra/Button";
import Input from "@/extra/Input";
import Pagination from "@/extra/Pagination";
import Table from "@/extra/Table";
import ToggleSwitch from "@/extra/ToggleSwitch";
import TrashIcon from "../../assets/icons/trashIcon.svg";
import EditIcon from "../../assets/icons/EditBtn.svg";
import AddIcon from "@mui/icons-material/Add";
import {
  activeWithdrawMethod,
  deleteWithdrawMethod,
  getSetting,
  getWithdrawMethod,
  updateSetting,
} from "@/store/settingSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import { warning } from "@/util/Alert";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AddWithdrawDialogue from "./AddWithdrawDialogue";
import { openDialog } from "@/store/dialogSlice";
import Image from "next/image";
import { baseURL } from "@/util/config";
import useClearSessionStorageOnPopState from "@/extra/ClearStorage";

const WithdrawSetting = () => {
  const { settingData, withdrawSetting } = useSelector(
    (state: RootStore) => state.setting
  );

  const { dialogue, dialogueType } = useSelector(
    (state: RootStore) => state.dialogue
  );

  const dispatch = useAppDispatch();
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [showImg, setShowImg] = useState();
  const [actionPagination, setActionPagination] = useState("delete");
  const [selectCheckData, setSelectCheckData] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [minWithdrawalRequestedCoin, setMinWithdrawalRequestedCoin] =
    useState();
  const [error, setError] = useState<any>({
    minWithdrawalRequestedCoin: "",
  });
  useClearSessionStorageOnPopState("multiButton")


  useEffect(() => {
    let payload: any = {};
    dispatch(getWithdrawMethod());
    dispatch(getSetting(payload));
  }, [dispatch]);

  useEffect(() => {
    setMinWithdrawalRequestedCoin(settingData?.minWithdrawalRequestedCoin);
  }, [settingData]);

  useEffect(() => {
    setData(withdrawSetting);
  }, [withdrawSetting]);

  const handleEdit = (row: any, type: any) => {
    

    dispatch(openDialog({ type: type, data: row }));
  };

  const withdrawTable = [
    {
      Header: "NO",
      body: "name",
      Cell: ({ index }) => <span>{(page - 1) * size + index + 1}</span>,
    },
    {
      Header: "NAME",
      body: "name",
      Cell: ({ row }) => <span className="text-capitalize">{row?.name}</span>,
    },
    {
      Header: "IMAGE",
      body: "image",
      Cell: ({ row, index }) => (
        <img
          src={baseURL + row?.image}
          width="96px"
          height="auto"
          style={{ objectFit: "cover" }}
        />
      ),
    },
    {
      Header: "DETAILS",
      body: "details",
      Cell: ({ row }) => (
        <span className="text-capitalize">
          <ul>
            {row?.details?.map((detail, index) => (
              <li>{detail}</li>
            ))}
          </ul>
        </span>
      ),
    },
    {
      Header: "CREATE DATE",
      body: "createdAt",
      Cell: ({ row }) => (
        <span className="text-capitalize">
          {row?.createdAt ? dayjs(row?.createdAt).format("DD MMMM YYYY") : ""}
        </span>
      ),
    },
    {
      Header: "IS ACTIVE",
      body: "isActive",
      Cell: ({ row }) => (
        <ToggleSwitch
          value={row?.isActive}
          onChange={() => handleIsActive(row)}
        />
      ),
    },
    {
      Header: "ACTION",
      body: "action",
      Cell: ({ row }) => (
        <div className="action-button">
          <Button
            btnIcon={
              <Image src={EditIcon} alt="Edit Icon" width={25} height={25} />
            }
            onClick={() => handleEdit(row, "withdraw")}
          />

          <Button
            btnIcon={
              <Image src={TrashIcon} alt="Trash Icon" width={25} height={25} />
            }
            onClick={() => handleDeleteWithdraw(row)}
          />
        </div>
      ),
    },
  ];

  const handleOpenNew = (type: any) => {
    
    dispatch(openDialog({ type: type }));
  };

  const handleSelectAll = (event: any) => {
    const checked = event.target.checked;
    setSelectAllChecked(checked);
    if (checked) {
      setSelectCheckData([...data]);
    } else {
      setSelectCheckData([]);
    }
  };

  const handleDeleteWithdraw = (row) => {
    
    const data = warning();
    data
      .then((res) => {
        if (res) {
          const id = row?._id;
          dispatch(deleteWithdrawMethod(id));
        }
      })
      .catch((err) => console.log(err));
  };

  const paginationSubmitButton = () => {
    const selectCheckDataGetId = selectCheckData?.map((item) => item?._id);
    //  if (actionPagination === "delete") {
    //   const data = warning();
    //   data
    //     .then((res) => {
    //       if (res) {
    //         props.deleteUser(selectCheckDataGetId);
    //       }
    //     })
    //     .catch((err) => console.log(err));
    // }
  };

  const handleIsActive = (row) => {
    
    const id = row?._id;

    dispatch(activeWithdrawMethod(id));
  };

  const handleSubmit = () => {
    
    const minWithdrawalRequestedCoinValue = parseInt(
      minWithdrawalRequestedCoin
    );

    if (minWithdrawalRequestedCoinValue <= 0) {
      let error: any = {};

      if (minWithdrawalRequestedCoin === "")
        if (minWithdrawalRequestedCoinValue <= 0)
          // error.minWithdrawalRequestedCoin = "Amount Is Required !";

          error.minWithdrawalRequestedCoin = "Amount Invalid !";

      return setError({ ...error });
    } else {
      let data: any = {
        minWithdrawalRequestedCoin: parseInt(minWithdrawalRequestedCoin),
      };

      let payload: any = {
        settingId: settingData?._id,
        data: data,
      };
      dispatch(updateSetting(payload));
    }
  };
  return (
    <>
      {dialogueType === "withdraw" && <AddWithdrawDialogue />}
      <div className="  userPage withdrawal-page p-0">
        <div className="dashboardHeader primeHeader mb-3 p-0"></div>
        <div className="row">
          <div className="col-6">
            <div className="withdrawal-box payment-setting ">
              <div className="row align-items-center p-2">
                <div className="col-12 col-sm-6 "></div>
                <div className="col-12 col-sm-6 sm-m-0 d-flex justify-content-end p-0">
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
              <div className="row">
                <div className="col-12 withdrawal-input mt-1">
                  <Input
                    label={"Minimum Withdrawal request Amount"}
                    name={"minWithdrawalRequestedCoin"}
                    type={"number"}
                    value={minWithdrawalRequestedCoin}
                    errorMessage={
                      error.minWithdrawalRequestedCoin &&
                      error.minWithdrawalRequestedCoin
                    }
                    placeholder={"Enter Amount"}
                    onChange={(e) => {
                      setMinWithdrawalRequestedCoin(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          minWithdrawalRequestedCoin: `Amount Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          minWithdrawalRequestedCoin: "",
                        });
                      }
                    }}
                  />
                  <h6>
                    Minimum withdrawal Request Amount the users can request
                  </h6>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="payment-setting-box user-table mt-3">
          <div className="row align-items-center mb-2 p-3 ml-1">
            <div className="col-12 col-sm-6 col-md-6 col-lg-6">
              <h5 className="mb-0">Withdraw Payment Method</h5>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-6 new-fake-btn d-flex justify-content-end mt-3 m-sm-0">
              <Button
                btnIcon={<AddIcon />}
                newClass={"rounded"}
                btnName={"New"}
                onClick={() => handleOpenNew("withdraw")}
              />
            </div>
          </div>
          <div className="mt-3">
            <Table
              data={data}
              mapData={withdrawTable}
              PerPage={size}
              Page={page}
              type={"client"}
              handleSelectAll={handleSelectAll}
              selectAllChecked={selectAllChecked}
            />
            <div className="mt-3">
              <Pagination
                type={"client"}
                activePage={page}
                rowsPerPage={size}
                userTotal={withdrawSetting?.length}
                setPage={setPage}
                setData={setData}
                data={data}
                actionShow={false}
                actionPagination={actionPagination}
                setActionPagination={setActionPagination}
                paginationSubmitButton={paginationSubmitButton}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WithdrawSetting;
