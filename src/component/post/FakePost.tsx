import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TrashIcon from "../../assets/icons/trashIcon.svg";
import EditIcon from "../../assets/icons/EditBtn.svg";
import Pagination from "../../extra/Pagination";
import Button from "../../extra/Button";
import Table from "../../extra/Table";
import dayjs from "dayjs";
import { RootStore, useAppDispatch } from "../../store/store";
import { openDialog } from "../../store/dialogSlice";
import { allPost, deleteFakePost } from "../../store/postSlice";
import AddIcon from "@mui/icons-material/Add";
import { warning } from "../../util/Alert";
import Image from "next/image";
import { baseURL } from "@/util/config";
import { useRouter } from "next/router";
import useClearSessionStorageOnPopState from "@/extra/ClearStorage";

interface FakePostProps {
  startDate: string;
  endDate: string;
}

const FakePost: React.FC<FakePostProps> = (props) => {
  const router = useRouter();
  const { fakePostData, totalFakePost } = useSelector((state: RootStore) => state.post);
  const { dialogue, dialogueType } = useSelector((state: RootStore) => state.dialogue);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectCheckData, setSelectCheckData] = useState<any[]>([]);
  const dispatch = useAppDispatch();
  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  useClearSessionStorageOnPopState("multiButton")


  useEffect(() => {
    const payload: any = {
      type: "fakePost",
      start: page,
      limit: size,
      startDate: props.startDate,
      endDate: props.endDate,
    };
    dispatch(allPost(payload));
  }, [page, size, props.startDate, props.endDate]);

  useEffect(() => {
    setData(fakePostData);
  }, [fakePostData]);

  const handleSelectCheckData = (e: React.ChangeEvent<HTMLInputElement>, row: any) => {
    
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

  const handleEdit = (row: any) => {
    

    router.push({
      pathname: "/userProfile",
      query: { id: row?.userId },
    });

    let dialogueData_ = {
      dialogue: true,
      dialogueData: row,
    };
    localStorage.setItem("dialogueData", JSON.stringify(dialogueData_));
  };

  const postTable = [
    {
      Header: "NO",
      body: "NO",
      Cell: ({ index }: { index: number }) => <span>{(page - 1) * size + index + 1}</span>,
    },
    {
      Header: "IMAGE",
      body: "soundImage",
      Cell: ({ row }: { row: any }) => (
        <img src={baseURL + row?.mainPostImage} width="60px" height="60px" alt="Sound Image" />
      ),
    },
    {
      Header: "User",
      body: "planBenefit",
      Cell: ({ row }: { row: any }) => (
        <div
        className="d-flex align-items-center"
        style={{
          cursor: "pointer",
          textDecoration: "underline",
          display : "flex",
          columnGap : "20px"
          // display: "flex",
          // justifyContent: "center",
        }}

        onClick={() => handleEdit(row)}

      >
        <img src={baseURL + row?.userImage} width="50px" height="50px" />
        <span className="text-capitalize fw-bold">{row?.userId?.name ? row?.userId?.name : row?.name}</span>
        </div>

      ),
    },
    {
      Header: "Caption",
      body: "caption",
      Cell: ({ row }: { row: any }) => (
        <span className="text-capitalize">{row?.caption}</span>
      ),
    },
    {
      Header: "Share Count",
      body: "shareCount",
      Cell: ({ row }: { row: any }) => (
        <span className="text-capitalize">{row?.shareCount}</span>
      ),
    },
    {
      Header: "Likes",
      body: "totalLikes",
      Cell: ({ row }: { row: any }) => (
        <span className="text-capitalize">{row?.totalLikes ?  row?.totalLikes : 0}</span>
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
      Cell: ({ row }: { row: any }) => (
        <div className="action-button">
          <Button
            btnIcon={<Image src={EditIcon} alt="editIcon"  width={25}
            height={25} />}
            onClick={() => {
              dispatch(openDialog({ type: "fakePost", data: row }));
            }}
          />
          <Button btnIcon={<Image src={TrashIcon} alt="TrashIcon"  width={25}
            height={25}/>} onClick={() => handleDeletePost(row)} />
        </div>
      ),
    },
  ];

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value: number) => {
    setPage(1);
    setSize(value);
  };

  const handleDeletePost = (row: any) => {
    const data = warning();
    data
      .then((logouts: any) => {
        
        if (logouts) {
          
          dispatch(deleteFakePost(row?._id));
        }
      })
      .catch((err: any) => console.log(err));
  };



  return (
    <div>
      <div className="user-table mb-3">
        <div className="user-table-top">
          <div className="row align-items-start">
            <div className="col-6">
              <h5
                style={{
                  fontWeight: "500",
                  fontSize: "20px",
                  marginTop: "5px",
                  marginBottom: "4px",
                }}
              >
                Fake Post
              </h5>
            </div>
            <div className="col-6 d-flex justify-content-end">
              <div className="ms-auto mt-2">
                <div className="new-fake-btn d-flex ">
                  <Button
                    btnIcon={<AddIcon />}
                    btnName={"New"}
                    onClick={() => {
                      dispatch(openDialog({ type: "fakePost" }));
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <Table
          data={data}
          mapData={postTable}
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
            userTotal={totalFakePost}
            setPage={setPage}
            handleRowsPerPage={handleRowsPerPage}
            handlePageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default FakePost;
