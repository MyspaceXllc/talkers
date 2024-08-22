import React, { useEffect, useState } from "react";
import $ from "jquery";
import CoverImg from "../../assets/images/userSettingCover.png";
// import { updateUser, getUserProfile } from "../../../redux/slice/userSlice";
import EditIcon from "@mui/icons-material/Edit";
import { connect, useDispatch, useSelector } from "react-redux";
// import { updateUser } from "../path/to/your/updateUser/action";
import { updateFakeUser } from "../../store/userSlice";
import { RootStore, useAppDispatch } from "../../store/store"; // Assuming RootState is your root state type
import Image from "next/image";
import { baseURL } from "@/util/config";
import CustomButton from "@/extra/Button";

interface AvatarSettingProps {
  userProfileData: any; // Adjust the type according to your data structure
}

const AvatarSetting: React.FC<AvatarSettingProps> = (props) => {
  $("input[type='image']").click(function () {
    $("input[id='my_file']").click();
  });

  const { userProfileData } = props;
  const [image, setImage] = useState<string>("");
  const [imageShow, setImageShow] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [isChannel, setIsChannel] = useState<boolean>(false); // Adjust according to your data type
  const { getUserProfileData, countryData } = useSelector(
    (state: RootStore) => state.user
  );
  const [data, setData] = useState<any>(); // Adjust the type according to your data structure
  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state: RootStore) => state.dialogue
  );

  const getDialogDataGet = typeof window !== 'undefined' && JSON.parse(localStorage.getItem("dialogueData"))

  console.log("dialogueData", dialogueData);
  console.log('imageShow', imageShow)

  const dispatch = useAppDispatch();

  useEffect(() => {
    setData(userProfileData);
    setImageShow(baseURL + userProfileData?.image)
  }, [userProfileData]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const getFile = e.target.files[0];
      const imageURL = URL.createObjectURL(getFile);
      if (imageURL) {
        setImageShow(imageURL);
        const formData = new FormData();
        formData.append("image", getFile);
        let payload: any = {
          id: userProfileData?._id,
          data: formData,
        };
        dispatch(updateFakeUser(payload));
      }
    }
  };

  useEffect(() => {
    setUserId(userProfileData?._id || "");
    setIsChannel(userProfileData?.isChannel || false);
    setImageShow(baseURL + getDialogDataGet?.dialogueData?.image || "");
  }, [userProfileData]);

  return (
    <div className="avatar-setting">
      <div className="userSettingBox">
        <div className="row d-flex align-items-center mt-3">
          <div className="col-12">
            <h5>Avatar & Cover</h5>
          </div>
        </div>
        <div className="image-avatar-box">
          <div className="cover-img-user">
            <img src={CoverImg.src} alt="Cover" />
          </div>
          <div className="avatar-img-user" style={{ cursor: "pointer" }}>
            <label htmlFor="image" onChange={(e: any) => handleFileUpload(e)}>
              <input
                type="file"
                name="image"
                id="image"
                style={{ display: "none" }}
              />
              {imageShow && (
                <img
                  src={imageShow}
                  alt="Avatar"
                  style={{ cursor: "pointer" }}
                />
              )}
              <div className="avatar-img-icon " style={{ cursor: "pointer" }}>
                <svg
                  className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv"
                  focusable="false"
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  data-testid="EditIcon"
                >
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75z"></path>
                </svg>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarSetting;
