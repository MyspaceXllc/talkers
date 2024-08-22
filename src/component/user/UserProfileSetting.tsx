import React, { useEffect, useState } from "react";
import Button from "../../extra/Button";
import Input from "../../extra/Input";
import Selector from "../../extra/Selector";
import { connect, useDispatch, useSelector } from "react-redux";
import { getCountry, updateFakeUser } from "../../store/userSlice";
import { closeDialog } from "../../store/dialogSlice";
import { useAppDispatch } from "@/store/store";
import { useRouter } from "next/router";
import { baseURL } from "@/util/config";

interface UserProfileSettingProps {
  userProfileData: any;
  multiButtonSelectNavigateSet: (value: string) => void;
}

const UserProfileSetting: React.FC<UserProfileSettingProps> = (props) => {
  const { userProfileData, multiButtonSelectNavigateSet } = props;
  const AgeNumber = Array.from(
    { length: 100 - 18 + 1 },
    (_, index) => index + 18
  );
  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state: any) => state.dialogue
  );
  const { countryData } = useSelector((state: any) => state.user);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [gender, setGender] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [nickName, setNickName] = useState<string>("");
  const [mobileNumber, setMobileNumber] = useState<string>("");
  const [ipAddress, setIpAddress] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [data, setData] = useState<any>();
  const [countryDataSelect, setCountryDataSelect] = useState<any>();
  const [image, setImage] = useState<any[]>([]);
  const [bio, setBio] = useState<string>("");
  const [imagePath, setImagePath] = useState<string>(
    dialogueData ? dialogueData?.image : ""
  );
  const [age, setAge] = useState<string>("");
  const [error, setError] = useState<any>({
    fullName: "",
    nickName: "",
    bio: "",
    mobileNumber: "",
    email: "",
    ipAddress: "",
    gender: "",
    country: "",
    age: "",
    image: "",
  });

  useEffect(() => {
    setNickName("");
    setAge("");
    setEmail("");
    setGender("");
    setMobileNumber("");
  }, [dialogue]);

  // useEffect(() => {
  //   // dispatch(getCountry());
  // }, []);

  useEffect(() => {
    if (userProfileData && Object?.values(userProfileData)?.length > 0) {
      setData(userProfileData);
    }
  }, [userProfileData]);

  useEffect(() => {
    if (userProfileData) {
      setFullName(userProfileData?.name);
      setNickName(userProfileData?.userName);
      setGender(userProfileData?.gender);
      setAge(userProfileData?.age);
      setEmail(userProfileData?.email);
      setIpAddress(userProfileData?.ipAddress);
      setBio(userProfileData?.bio);
      setMobileNumber(userProfileData?.mobileNumber);
      setImagePath(baseURL + userProfileData?.image);
      const filterData = countryData?.filter(
        (item: any) =>
          item?.name?.common?.toLowerCase() ===
          userProfileData?.country?.toString()
      );
      if (filterData) {
        setCountryDataSelect(filterData[0]);
      }
    }
  }, [userProfileData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !fullName ||
      !nickName ||
      !mobileNumber ||
      !email ||
      !age ||
      !gender
      // !bio ||
      // !countryDataSelect ||
      // !image
      // !ipAddress
    ) {
      let errors: any = {};
      if (!fullName) errors.fullName = "Name Is Required !";
      if (!nickName) errors.nickName = "User Name Is Required !";
      if (!mobileNumber) errors.mobileNumber = "Mobile Number Is Required !";
      if (!email) errors.email = "Email Is Required !";
      if (!gender) errors.gender = "Gender Is Required !";
      if (!bio) errors.bio = "Bio Is Required !";
      if (!image) errors.image = "Image Is Required !";
      if (!age) errors.age = "Age is required !";
      if (!ipAddress) errors.ipAddress = "Ip Address is required !";
      if (!countryDataSelect) errors.country = "Country is required !";
      setError(errors);
    } else {
      const formData = new FormData();
      formData.append("name", fullName);
      formData.append("userName", nickName);
      formData.append("gender", gender);
      formData.append("age", age);
      formData.append("email", email);
      formData.append("mobileNumber", mobileNumber);
      const payload: any = {
        id: userProfileData?._id,
        data: formData,
      };
      dispatch(updateFakeUser(payload));
      dispatch(closeDialog());
      router.back();
      // multiButtonSelectNavigateSet("Fake User");
      localStorage.setItem("multiButton", JSON.stringify("Fake User"));
    }
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage([e.target.files[0]]);
      setImagePath(URL.createObjectURL(e.target.files[0]));
      setError("");
    }
  };

  const handleSelectChange = (selected: any) => {
    setCountryDataSelect(selected);
    if (!selected) {
      setError({
        ...error,
        country: `Country Is Required`,
      });
    } else {
      setError({
        ...error,
        country: "",
      });
    }
  };

  return (
    <div>
   
      <div className="general-setting fake-user">
        <div className=" userSettingBox">
          <form>
            <div className="row d-flex  align-items-center">
              <div className="col-12 col-sm-6 col-md-6 col-lg-6 mb-1 mb-sm-0">
                <h5 className="mb-0">General Setting</h5>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-md-6 col-lg-6 d-flex justify-content-end">
              <Button
                newClass={"submit-btn"}
                btnName={"Submit"}
                type={"button"}
                onClick={(e) => handleSubmit(e)}
              />
            </div>
            <div className="row mt-3">
              <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                <Input
                  label={"Name"}
                  name={"name"}
                  placeholder={"Enter Details..."}
                  value={fullName}
                  errorMessage={error.fullName && error.fullName}
                  // defaultValue={userProfileData && userProfileData?.name}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    if (!e.target.value) {
                      setError({
                        ...error,
                        fullName: `Name Is Required`,
                      });
                    } else {
                      setError({
                        ...error,
                        fullName: "",
                      });
                    }
                  }}
                />
              </div>
              <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                <Input
                  label={"User Name"}
                  name={"nickName"}
                  value={nickName}
                  placeholder={"Enter Details..."}
                  errorMessage={error.nickName && error.nickName}
                  // defaultValue={userProfileData && userProfileData?.userName}
                  onChange={(e) => {
                    setNickName(e.target.value);
                    if (!e.target.value) {
                      return setError({
                        ...error,
                        nickName: `User Name Is Required`,
                      });
                    } else {
                      return setError({
                        ...error,
                        nickName: "",
                      });
                    }
                  }}
                />
              </div>
              <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                <Input
                  label={"E-mail Address"}
                  name={"email"}
                  value={email}
                  errorMessage={error.email && error.email}
                  // defaultValue={userProfileData && userProfileData?.email}
                  placeholder={"Enter Details..."}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (!e.target.value) {
                      return setError({
                        ...error,
                        email: `Email Is Required`,
                      });
                    } else {
                      return setError({
                        ...error,
                        email: "",
                      });
                    }
                  }}
                />
              </div>

              <div>
                {/* <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                  <Input
                    label={"Mobile Number"}
                    name={"mobileNumber"}
                    type={"number"}
                    value={mobileNumber}
                    placeholder={"Enter Details..."}
                    errorMessage={error.mobileNumber && error.mobileNumber}
                    onChange={(e) => {
                      setMobileNumber(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          mobileNumber: `Mobile Number Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          mobileNumber: "",
                        });
                      }
                    }}
                  />
                </div> */}
                {/* 
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                  <Input
                    label={"Ip Address"}
                    name={"ipAddress"}
                    type={"text"}
                    value={ipAddress}
                    placeholder={"Enter Details..."}
                    errorMessage={error.ipAddress && error.ipAddress}
                    defaultValue={userProfileData && userProfileData.ipAddress}
                    onChange={(e) => {
                      setIpAddress(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          ipAddress: `Ip Address Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          ipAddress: "",
                        });
                      }
                    }}
                  />
                </div> */}
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                  <Selector
                    label={"Gender"}
                    selectValue={gender}
                    placeholder={"Select Gender"}
                    selectData={["Male", "Female"]}
                    defaultValue={userProfileData && userProfileData?.gender}
                    errorMessage={error.gender && error.gender}
                    onChange={(e) => {
                      setGender(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          gender: `Gender Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          gender: "",
                        });
                      }
                    }}
                  />
                </div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2">
                  <Selector
                    label={"Age"}
                    selectValue={age}
                    placeholder={"Select Age"}
                    errorMessage={error.age && error.age}
                    defaultValue={userProfileData && userProfileData?.age}
                    selectData={AgeNumber}
                    onChange={(e) => {
                      setAge(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          age: `Age Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          age: "",
                        });
                      }
                    }}
                  />
                </div>

                {/* <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2 country-dropdown">
                  <label>Country</label>
                  <ReactSelect
                    options={countryData || []}
                    value={countryDataSelect}
                    isClearable={false}
                    onChange={(e) => handleSelectChange(e)}
                    // getOptionLabel={(option) => option.title}
                    getOptionValue={(option) => option?.name?.common}
                    formatOptionLabel={(option) => (
                      <div className="optionShow-option">
                        <img
                          src={option?.flags?.png ? option?.flags?.png : ""}
                        />
                        <span>
                          {option?.name?.common ? option?.name?.common : ""}
                        </span>
                      </div>
                    )}
                    components={{
                      Option: CustomOption,
                    }}
                  />
                </div> */}
                {/* <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2 ">
                  <Input
                    type={"file"}
                    label={"Image"}
                    accept={"image/png, image/jpeg"}
                    errorMessage={error.image && error.image}
                    onChange={handleImage}
                  />
                </div> */}
                {/* <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2 "></div>
                <div className="col-12 col-sm-12 col-md-6 col-lg-6 mt-2 fake-create-img">
                  <img
                    src={imagePath && imagePath}
                    alt=""
                    draggable="false"
                    className={`${
                      (!imagePath || imagePath === "") && "d-none"
                    } `}
                    data-class={`showImage`}
                    style={{ width: "100px", height: "100px" }}
                  />
                </div> */}
                {/* <div className="col-12 mt-25 text-about">
                  <label className="label-form">Bio</label>
                  <textarea
                    cols={6}
                    rows={6}
                    value={bio}
                    onChange={(e) => {
                      setBio(e.target.value);
                      if (!e.target.value) {
                        return setError({
                          ...error,
                          bio: `Bio Is Required`,
                        });
                      } else {
                        return setError({
                          ...error,
                          bio: "",
                        });
                      }
                    }}
                  ></textarea>
                  {error.bio && (
                    <p className="errorMessage">{error.bio && error.bio}</p>
                  )}
                {/* Add other Input, Selector components similarly */}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSetting;
