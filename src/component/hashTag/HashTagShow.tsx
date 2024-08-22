"use-client";
import React, { useEffect, useState } from "react";
import Button from "../../extra/Button";
import TrashIcon from "../../assets/icons/trashIcon.svg";
import EditIcon from "../../assets/icons/EditBtn.svg";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch, useSelector } from "react-redux";
import { openDialog } from "../../store/dialogSlice";
import Table from "../../extra/Table";
import Pagination from "../../extra/Pagination";
import { warning } from "../../util/Alert";
import dayjs from "dayjs";
import { deleteHastTag, getHashtag } from "../../store/hashTagSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import Image from "next/image";
import Searching from "@/extra/Searching";
import { baseURL } from "@/util/config";
import male from "@/assets/images/UserSettingAvtar.jpg";
import useClearSessionStorageOnPopState from "@/extra/ClearStorage";

interface hashTagData {
  _id: string;
  hashTagBanner: string;
  hashTag: string;
  hashTagIcon?: string;
  usageCount: string;
  createdAt: string;
}

const HashTagShow = () => {
  const { allHashTagData, totalHashTag } = useSelector(
    (state: RootStore) => state.hashTag
  );

  console.log("allHashTagData", allHashTagData);

  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state: any) => state.dialogue
  );
  const dispatch = useAppDispatch();

  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string | undefined>();
  const [size, setSize] = useState<number>(10);
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  useClearSessionStorageOnPopState("multiButton")


  useEffect(() => {
    let payload: any = {
      start: page,
      limit: size,
    };
    dispatch(getHashtag(payload));
  }, [page, size]);

  useEffect(() => {
    setData(allHashTagData);
    console.log("allHashTagData", allHashTagData);
  }, [allHashTagData]);

  const handleFilterData = (filteredData: string | any[]) => {
    if (typeof filteredData === "string") {
      setSearch(filteredData);
    } else {
      setData(filteredData);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value: number) => {
    setPage(1);
    setSize(value);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setSelectAllChecked(checked);
    // if (checked) {
    //     setSelectCheckData([...data]);
    // } else {
    //     setSelectCheckData([]);
    // }
  };

  const handleDeleteCategory = (row: hashTagData) => {
    const data = warning();
    data
      .then((logouts) => {
        if (logouts) {
          const payload: any = {
            hashTagId: row?._id,
          };
          dispatch(deleteHastTag(payload));
        }
      })
      .catch((err) => console.log(err));
  };

  const hashTagTable = [
    {
      Header: "NO",
      body: "no",
      Cell: ({ index }: { index: number }) => (
        <span className="  text-nowrap">{(page - 1) * size + index + 1}</span>
      ),
    },

    {
      Header: "HASHTAG ICON",
      body: "hashTagIcon",
      Cell: ({ row, index }: { row: hashTagData; index: number }) => (
        <img
          src={row?.hashTagIcon ? `${baseURL}${row.hashTagIcon}` : '-'}
          width="40px"
          height="40px"
          alt={`Song ${index + 1}`}
        />
      ),
    },
    {
      Header: "HASHTAG BANNER",
      body: "hashTagBanner",
      Cell: ({ row, index }: { row: hashTagData; index: number }) => (
        <img
          src={row?.hashTagBanner ? baseURL + row?.hashTagBanner : "-"}
          width="40px"
          height="40px"
          alt={`Song ${index + 1}`}
        />
      ),
    },

    {
      Header: "HASHTAG",
      body: "hashTag",
      Cell: ({ row }: { row: hashTagData }) => <span>{row?.hashTag}</span>,
    },
    {
      Header: "USAGE COUNT",
      body: "usageCount",
      Cell: ({ row }: { row: hashTagData }) => (
        <span className="text-capitalize">
          {row?.usageCount ? row?.usageCount : 0}
        </span>
      ),
    },
    {
      Header: "CREATE DATE",
      body: "createdAt",
      Cell: ({ row }: { row: any }) => (
        <span className="text-capitalize">
          {row?.createdAt ? dayjs(row?.createdAt).format("DD MMMM YYYY") : ""}
        </span>
      ),
    },
    {
      Header: "ACTION",
      body: "action",
      Cell: ({ row }: { row: hashTagData }) => (
        <div className="action-button">
          <Button
            btnIcon={
              <Image src={EditIcon} alt="EditIcon" width={25} height={25} />
            }
            onClick={() => {
              dispatch(openDialog({ type: "CreateHashTag", data: row }));
            }}
          />
          <Button
            btnIcon={
              <Image src={TrashIcon} alt="TrashIcon" width={25} height={25} />
            }
            onClick={() => handleDeleteCategory(row)}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="user-table">
        <div className="user-table-top">
          <div className="row align-items-start">
            <div className="col-6">
              <h5
                style={{
                  fontWeight: "500",
                  fontSize: "20px",
                  marginTop: "5px",
                  marginBottom: "15px",
                }}
              >
                Hashtag Table
              </h5>
            </div>
            <div
              className="col-6 new-fake-btn d-flex justify-content-end"
              style={{ marginTop: "5px" }}
            >
              <Button
                btnIcon={<AddIcon />}
                btnName={"New"}
                onClick={() => {
                  dispatch(openDialog({ type: "CreateHashTag" }));
                }}
              />
            </div>
          </div>
          <Searching
            label={
              "Search for ID, Keyword, E-mail, Username, First Name, LastName"
            }
            placeholder={"Search..."}
            data={allHashTagData}
            type={"client"}
            actionShow={false}
            setData={setData}
            onFilterData={handleFilterData}
            searchValue={search}
          />
        </div>
        <Table
          data={data}
          mapData={hashTagTable}
          serverPerPage={size}
          serverPage={page}
          handleSelectAll={handleSelectAll}
          selectAllChecked={selectAllChecked}
          type={"server"}
        />
        <div className="mt-3">
          <Pagination
            type={"server"}
            activePage={page}
            rowsPerPage={size}
            userTotal={totalHashTag}
            setPage={setPage}
            handleRowsPerPage={handleRowsPerPage}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default HashTagShow;
