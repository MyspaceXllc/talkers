"use client";
import { useEffect, useState } from "react";
import UserImage from "../../assets/images/8.jpg";
import Logo from "../../assets/images/logo.svg";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { adminProfileGet } from "../../store/adminSlice";
import MenuIcon from "@mui/icons-material/Menu";
import { useAppDispatch } from "../../store/store";
import { baseURL, projectName } from "@/util/config";

const Navbar = () => {
  const [showImage, setShowImage] = useState<string>();
  // const dispatch = useAppDispatch()
  // const dispatch = useAppDispatch()
  const getAdminIn =
    typeof window !== "undefined" &&
    JSON.parse(sessionStorage.getItem("admin_"));
  const [adminData, setAdminData] = useState<{ name?: string; image?: string }>(
    {}
  ); 

  console.log('adminData', adminData)

  useEffect(() => {
    if (getAdminIn) {
      setAdminData(getAdminIn);
    }
  }, [])



  return (
    <>
      <div className="mainNavbar webNav me-4">
        <div className="row">
          <div className="navBox " style={{ paddingTop: "8px" }}>
            <div
              className="navBar boxBetween px-4 "
              style={{ padding: "10px 0px" }}
            >
              <div className="navToggle" id={"toggle"}>
                <MenuIcon />
              </div>
              <div className=""></div>
              <div className="col-4 logo-show-nav">
                <div className="sideBarLogo boxCenter">
                  <Link
                    href={"/admin/dashboard"}
                    className="d-flex align-items-center"
                  >
                    <Image src={Logo} alt="logo" width={40} />
                    <span className="fs-3 fw-bold">{projectName}</span>
                  </Link>
                </div>
              </div>
              <div className="col-7">
                <div className="navIcons d-flex align-items-center justify-content-end">
                  <div
                    className="pe-4 cursor"
                    style={{ backgroundColor: "inherit", position: "relative" }}
                  >
                    {/* <NotificationIcon width="20px" height="25px" /> */}
                  </div>
                  <div className="cursor">
                    <Link
                      href="/adminProfile"
                      style={{ backgroundColor: "inherit" }}
                    >
                      {adminData?.image?.length > 0 && (
                        <img
                          src={baseURL + adminData?.image}
                          alt="Image"
                          width={50}
                          height={50}
                          style={{
                            borderRadius: "15px",
                            border: "1px solid white",
                            objectFit: "cover",
                          }}
                          // onError={(e: any) => {
                          //   e.target.src = UserImage;
                          // }}
                          className="cursor"
                        />
                      )}
                    </Link>
                  </div>
                  <div
                    className="pe-4 ml-1"
                    style={{ backgroundColor: "inherit", marginLeft: "10px" }}
                  >
                    <span
                      style={{
                        cursor: "pointer",
                        fontSize: "16px",
                        textTransform: "capitalize",
                      }}
                    >
                      {adminData ? adminData?.name : "admin"}
                    </span>
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

export default Navbar;
