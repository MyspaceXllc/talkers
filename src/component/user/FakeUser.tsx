import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TrashIcon from "../../assets/icons/trashIcon.svg";
import EditIcon from "../../assets/icons/EditBtn.svg";
import Button from "../../extra/Button";
import Pagination from "../../extra/Pagination";
import Table from "../../extra/Table";
import Searching from "../../extra/Searching";
import AddIcon from "@mui/icons-material/Add";
import Image from "next/image";
import ToggleSwitch from "../../extra/ToggleSwitch";
import {
  allUsers,
  blockUser,
  deleteUser,
  setGetProfileRemove,
} from "../../store/userSlice";
import { RootStore, useAppDispatch } from "../../store/store";
import { openDialog } from "../../store/dialogSlice";
import { warning } from "../../util/Alert";
import { baseURL } from "@/util/config";
import { useRouter } from "next/router";
import useClearSessionStorageOnPopState from "@/extra/ClearStorage";


const FakeUser = ({ startDate, endDate, setMultiButtonSelect }) => {
  const { dialogue, dialogueType } = useSelector(
    (state: RootStore) => state.dialogue
  );
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(20);
  const [actionPagination, setActionPagination] = useState("delete");
  const [selectCheckData, setSelectCheckData] = useState<any[]>([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [search, setSearch] = useState("");
  const { fakeUserData, totalFakeUser } = useSelector(
    (state: RootStore) => state.user
  );
  useClearSessionStorageOnPopState('multiButton');


  console.log('fakeUserData', fakeUserData)


  const router  = useRouter()
  const [data, setData] = useState<any[]>([]);
  const [showURLs, setShowURLs] = useState<string[]>([]);

  useEffect(() => {
    setData(fakeUserData);
  }, [fakeUserData]);

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value: number) => {
    setPage(1);
    setSize(value);
  };

  const handleEdit = (row: any, type: string) => {
    
    
    // const payload: any = {
    //   data: {},
    // };

    router.push({
      pathname: "/userProfile",
      query: { id: row?._id },
    });
    // dispatch(setGetProfileRemove(payload));
    dispatch(openDialog({ type: type, data: row }));

      let dialogueData_ = {
        dialogue: true,
        type: type,
        dialogueData: row,
      };

      localStorage.setItem("dialogueData", JSON.stringify(dialogueData_));

  };

  const handleSelectCheckData = (
    e: React.ChangeEvent<HTMLInputElement>,
    row: any
  ) => {
    
    const checked = e.target.checked;
    if (checked) {
      setSelectCheckData((prevSelectedRows) => [...prevSelectedRows, row]);
    } else {
      setSelectCheckData((prevSelectedRows) =>
        prevSelectedRows.filter((selectedRow) => selectedRow._id !== row._id)
      );
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    
    setSelectAllChecked(checked);
    if (checked) {
      setSelectCheckData([...data]);
    } else {
      setSelectCheckData([]);
    }
  };

  const paginationSubmitButton = () => {
    
    const selectCheckDataGetId = selectCheckData?.map((item) => item?._id);
    const isActiveData = fakeUserData?.filter((user) => {
      return (
        user.isBlock === false &&
        selectCheckData.some((ele) => ele._id === user._id)
      );
    });
    const deActiveData = fakeUserData?.filter((user) => {
      return (
        user.isBlock === true &&
        selectCheckData.some((ele) => ele._id === user._id)
      );
    });

    const getId = isActiveData?.map((item) => item?._id);
    const getId_ = deActiveData?.map((item) => item?._id);
    if (actionPagination === "block") {
      const data = true;
      // props.isActiveUser(getId, "user", data);
      const payload: any = {
        id: getId,
        data: data,
      };
      dispatch(blockUser(payload));
    } else if (actionPagination === "unblock") {
      const data = false;
      // props.isActiveUser(getId_, "user", data);
      const payload: any = {
        id: getId_,
        data: data,
      };
      dispatch(blockUser(payload));
    } else if (actionPagination === "delete") {
      const getIdFind = selectCheckDataGetId?.join(",");
      const data = warning();
      data
        .then((res) => {
          if (res) {
            const payload: any = {
              id: getIdFind,
            };
            dispatch(deleteUser(payload));
          }
        })
        .catch((err) => console.log(err));
    }
  };

  const ManageUserData = [
   
    {
      Header: "NO",
      body: "no",
      Cell: ({ index }) => (
        <span className="  text-nowrap">
          {(page - 1) * size + parseInt(index) + 1}
        </span>
      ),
    },
    {
      Header: "Unique ID",
      body: "id",
      Cell: ({ row }) => (
        <span className="text-capitalize    cursorPointer">
          {row?.uniqueId}
        </span>
      ),
    },
    {
      Header: "User Name",
      body: "name",
      Cell: ({ row, index }) => (
        <div
          className="d-flex align-items-center "
          style={{ cursor: "pointer" }}
          onClick={() => handleEdit(row, "manageUser")}
        >
          {row?.image && (
            // <Image src={row?.image} width={40} height={40} alt="User Image" />
            <img src={baseURL + row?.image} width="50px" height="50px" />
          )}
          <span className="text-capitalize ms-3  cursorPointer text-nowrap">
            {row?.name}
          </span>
        </div>
      ),
    },

    {
      Header: "User Id",
      body: "userName",
      Cell: ({ row }) => (
        <span className="text-lowercase    cursorPointer">{row?.userName}</span>
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
            onClick={() => handleEdit(row, "manageUser")}
          />
          <Button
            btnIcon={
              <Image src={TrashIcon} alt="Trash Icon" width={25} height={25} />
            }
            onClick={() => handleDeleteUser(row)}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    const payload: any = {
      type: "fakeUser",
      start: page,
      limit: size,
      startDate,
      endDate,
    };
    dispatch(allUsers(payload));
  }, [startDate, endDate, page, size]);

  const handleIsActive = (row: any) => {
    
    const id = row?._id;
    const data = row?.isBlock === false ? true : false;
    const payload: any = { id, data };
    dispatch(blockUser(payload));
  };

  const handleDeleteUser = (row: any) => {
    
    const data = warning();
    data
      .then((res) => {
        if (res) {
          const payload: any = {
            id: row?._id,
            data: row?.userName,
          };
          dispatch(deleteUser(payload));
        }
      })
      .catch((err) => console.log(err));
  };

  const handleFilterData = (filteredData: string | any[]) => {
    if (typeof filteredData === "string") {
      setSearch(filteredData);
    } else {
      setData(filteredData);
    }
  };

  return (
    <div>
      <div className="user-table real-user mb-3">
        <div className="user-table-top">
          <div className="row">
            <div className="col-6">
              <h5
                style={{
                  fontWeight: "500",
                  fontSize: "20px",
                  marginBottom: "5px",
                  marginTop: "5px",
                }}
              >
                User Table
              </h5>
            </div>
            <div className="col-6 d-flex justify-content-end">
              <div className=" mt-2">
                <div className="new-fake-btn d-flex ">
                  <Button
                    btnIcon={<AddIcon />}
                    btnName={"New"}
                    onClick={() => {
                      dispatch(openDialog({ type: "fakeUser" }));
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <Searching
            label={
              "Search for ID, Keyword, E-mail, Username, First Name, LastName"
            }
            placeholder={"Search..."}
            data={fakeUserData}
            type={"client"}
            setData={setData}
            onFilterData={handleFilterData}
            searchValue={search}
            actionPagination={actionPagination}
            setActionPagination={setActionPagination}
            paginationSubmitButton={paginationSubmitButton}
            actionShow={false}
            customSelectDataShow={true}
          />
        </div>
        <Table
          data={data}
          mapData={ManageUserData}
          serverPerPage={size}
          serverPage={page}
          handleSelectAll={handleSelectAll}
          selectAllChecked={selectAllChecked}
          type={"server"}
        />
        <Pagination
          type={"server"}
          activePage={page}
          rowsPerPage={size}
          userTotal={totalFakeUser}
          setPage={setPage}
          handleRowsPerPage={handleRowsPerPage}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default FakeUser;
