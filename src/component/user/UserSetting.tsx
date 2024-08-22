import React, { useEffect, useState } from "react";
import NewTitle from "../../extra/Title";
import MultiButton from "../../extra/MultiButton";
import UserProfileSetting from "./UserProfileSetting";
import AvatarSetting from "./AvatarSetting";
import { connect, useDispatch, useSelector } from "react-redux";
import Button from "../../extra/Button";
import PasswordSetting from "./PasswordSetting";
import { getUserProfile } from "../../store/userSlice";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { closeDialog } from "../../store/dialogSlice";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import { useAppDispatch } from "@/store/store";

interface UserSettingProps {
  multiButtonSelectNavigateSet: (value: string) => void;
  multiButtonSelectNavigate: any;
}

const UserSetting: React.FC<UserSettingProps> = (props) => {
  const { multiButtonSelectNavigateSet, multiButtonSelectNavigate } = props;

  const [multiButtonSelect, setMultiButtonSelect] = useState<string>("Profile");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [data, setData] = useState<any>();
  const labelData: string[] = ["Profile", "Avatar"];
  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state: any) => state.dialogue
  );
  const location = usePathname();
  const { getUserProfileData } = useSelector((state: any) => state.user);

  const handleAlignment = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string | null
  ) => {
    if (newAlignment !== null && newAlignment !== undefined) {
      setMultiButtonSelect(newAlignment);
    }
  };

  const handleClose = () => {
    if (dialogueData) {
      dispatch(closeDialog());
    } else {
      router.back();
    }
    // multiButtonSelectNavigateSet("Fake User");
    localStorage.setItem("multiButton", JSON.stringify("Fake User"));
  };

  useEffect(() => {
    if (dialogueData) {
      const payload: any = {
        id: dialogueData?._id,
      };
      dispatch(getUserProfile(payload));
    } else {
      const payload: any = {
        id: router.query.id,
      };
      dispatch(getUserProfile(payload));
    }
  }, [router.query.id, dialogueData]);

  useEffect(() => {
    setData(getUserProfileData);
  }, [getUserProfileData, dialogue]);

  return (
    <div className="userSetting">
      <div className="dashboardHeader primeHeader mb-3 p-0">
        <NewTitle name={`User / ${multiButtonSelect}`} />
      </div>
      <div className="row">
        <div className="col-7">
          <div className="multi-user-btn mb-3 pb-2 multiButton">
            {labelData?.map((item: string, index: number) => {
              return (
                <ToggleButtonGroup
                  key={index}
                  value={multiButtonSelect}
                  exclusive={true}
                  onChange={handleAlignment}
                  aria-label="text alignment"
                >
                  <ToggleButton
                    value={item}
                    aria-label={item}
                  >
                    <span className="text-capitalize">{item}</span>
                  </ToggleButton>
                </ToggleButtonGroup>
              );
            })}
          </div>
        </div>
        <div className="col-5">
          <Button
            btnName={"Back"}
            newClass={"back-btn"}
            onClick={handleClose}
          />
        </div>
      </div>

      {multiButtonSelect === "Profile" && (
        <UserProfileSetting
          userProfileData={data}
          multiButtonSelectNavigateSet={multiButtonSelectNavigateSet}
        />
      )}
      {multiButtonSelect === "Avatar" && (
        <AvatarSetting userProfileData={data} />
      )}
      {/* {multiButtonSelect === "Password" && (
        <PasswordSetting userProfileData={data} />
      )} */}
    </div>
  );
};

export default UserSetting;
