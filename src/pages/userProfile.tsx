import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
import { RootStore, useAppDispatch } from "@/store/store";
import { getUserProfile } from "@/store/userSlice";
import Button from "@/extra/Button";
import UserProfileSetting from "@/component/user/UserProfileSetting";
import AvatarSetting from "@/component/user/AvatarSetting";
import PasswordSetting from "@/component/user/PasswordSetting";
import NewTitle from "@/extra/Title";
import RootLayout from "@/component/layout/Layout";
import { localeData } from "moment";
import { closeDialog } from "@/store/dialogSlice";

interface UserSettingProps {
  multiButtonSelectNavigateSet: (value: string) => void;
  multiButtonSelectNavigate: any;
}

const userProfile = (props: any) => {
  const { multiButtonSelectNavigateSet, multiButtonSelectNavigate } = props;
  const { admin } = useSelector((state: RootStore) => state.admin);


  const [multiButtonSelect, setMultiButtonSelect] = useState<string>("Profile");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [data, setData] = useState<any>();
  const labelData: string[] = ["Profile","Avatar"];
  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state: any) => state.dialogue
  );

 const id = router.query.id;
 console.log('data', data)

  const getDialogDataGet = typeof window !== 'undefined' && JSON.parse(localStorage.getItem("dialogueData"))

  console.log('localData', getDialogDataGet)

  console.log('dialogueData', dialogueData)
  const location = usePathname();

  console.log('location', location)
  const { getUserProfileData , fakeUserData  } = useSelector((state: any) => state.user);

  console.log('getUserProfileData', fakeUserData)

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
      debugger
        dispatch(closeDialog());
      

    } else {
      router.back();
    }
    // multiButtonSelectNavigateSet("Fake User");
    // localStorage.setItem("multiButton", JSON.stringify("Fake User"));
  };

  useEffect(() => {
    if (dialogueData) {
      const payload: any = {
        id: dialogueData?._id,
      };
      dispatch(getUserProfile(payload));
    } else if (id) {
      const payload: any = {
        id : id
      };
      dispatch(getUserProfile(payload));
    }else {

      const payload: any = {
        id : getDialogDataGet?.dialogueData?._id
      };

      dispatch(getUserProfile(payload));

    }
  }, [router.query.id, dialogueData]);

  useEffect(() => {
    setData(getDialogDataGet?.dialogueData);
  }, []);
  return (
    <>
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
                    <ToggleButton value={item} aria-label={item}>
                      <span className="text-capitalize">{item}</span>
                    </ToggleButton>
                  </ToggleButtonGroup>
                );
              })}
            </div>
          </div>
          <div className="col-5" style={{display : "flex" , justifyContent : "end"}}>
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
       
      </div>
    </>
  );
};

userProfile.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default userProfile;