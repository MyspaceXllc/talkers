import React, { useEffect, useState } from "react";
import { Box, CircularProgress, Modal, Typography } from "@mui/material";
import Selector from "../../extra/Selector";
import Input from "../../extra/Input";
import ReactSelect from "react-select";
import Button from "../../extra/Button";
import { useDispatch, useSelector } from "react-redux";
import SmallLoader from "../../extra/SmallLoader";
import { allUsers, getCountry } from "../../store/userSlice";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { closeDialog } from "../../store/dialogSlice";
import ReactDropzone from "react-dropzone";
import { addFakeVideo, updateFakeVideo } from "../../store/videoSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import { allHashTag } from "@/store/postSlice";
import { baseURL } from "@/util/config";
import hashPlcaholder from "../../assets/images/hashTagPlace.png";

interface CreateFakeVideoProps {}

const style: React.CSSProperties = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  backgroundColor: "background.paper",
  borderRadius: "13px",
  border: "1px solid #C9C9C9",
  boxShadow: "24px",
  padding: "19px",
};

interface CountryData {
  name: {
    common: string;
  };
  flags: {
    png: string;
  };
  latlng: [any, any];
}

const CreateFakeVideo: React.FC<CreateFakeVideoProps> = () => {
  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state: any) => state.dialogue
  );

  const { fakeUserData, countryData } = useSelector(
    (state: RootStore) => state.user
  );
  const { allHashTagData } = useSelector((state: RootStore) => state.post);
  const [mongoId, setMongoId] = useState<string>("");
  const [addVideoOpen, setAddVideoOpen] = useState<boolean>(false);

  console.log("addVideoOpen", addVideoOpen);
  console.log("dialogue", dialogue);

  const [caption, setCaption] = useState<string>("");
  // const [location, setLocation] = useState<string>("");
  // const [latitude, setLatitude] = useState<number>();
  // const [longitude, setLongitude] = useState<number>();
  const [fakeUserId, setFakeUserId] = useState<string>();
  // const [countryDataSelect, setCountryDataSelect] = useState<CountryData>();
  const [videoTime, setVideoTime] = useState<number>();
  const [fakePostDataGet, setFakeUserDataGet] = useState<any[]>([]);
  const [video, setVideo] = useState<{
    file: File | null;
    thumbnailBlob: File | null;
  }>({
    file: null,
    thumbnailBlob: null,
  });
  const [selectedHashtag, setSelectedHashtag] = useState<any>();
  const [selectedHashTagId, setSelectedHashTagId] = useState<any>([]);
  const [videoPath, setVideoPath] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<File[]>([]);
  const [thumbnailKey, setThumbnailKey] = useState<number>(0);
  const [error, setError] = useState({
    caption: "",
    video: "",
    fakeUserId: "",
    hashTag: "",
    country: "",
  });

  const dispatch = useAppDispatch();
  useEffect(() => {
    setAddVideoOpen(dialogue);
    if (dialogueData) {
      setMongoId(dialogueData?._id);
      setCaption(dialogueData?.caption || "");
      // setCountryDataSelect(dialogueData?.location || "");
      setFakeUserId(dialogueData?.userId || "");
      setVideoPath(baseURL + dialogueData?.videoUrl || null);
      setThumbnail(dialogueData?.videoImage || []);
      setVideoTime(dialogueData?.videoTime || 0);
    }
  }, [dialogue, dialogueData]);
  useEffect(() => {
    const payload: any = {
      type: "fakeUser",
      start: 1,
      limit: 100,
      startDate: "All",
      endDate: "All",
    };
    dispatch(allUsers(payload));
    // dispatch(getCountry());
  }, []);

  useEffect(() => {
    setFakeUserDataGet(fakeUserData);
  }, [fakeUserData]);

  // const handleSelectChange = (selected: CountryData | null) => {
  //   setCountryDataSelect(selected);
  //   setLatitude(selected?.latlng[0]);
  //   setLongitude(selected?.latlng[1]);
  //   if (!selected) {
  //     return setError({
  //       ...error,
  //       country: `Country Is Required`,
  //     });
  //   } else {
  //     return setError({
  //       ...error,
  //       country: "",
  //     });com
  //   }
  // };

  // const CustomOption: React.FC<{ innerProps: any; label: string; data: any }> = ({
  //   innerProps,
  //   label,
  //   data,
  // }) => (
  //   <div {...innerProps} className="country-optionList"  >
  //     <img src={data?.flags?.png && data?.flags?.png} alt={label} />
  //     <span>{data?.name?.common && data?.name?.common}</span>
  //   </div>
  // );

  const handleVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setVideoPath(URL.createObjectURL(e.target.files?.[0]));

    if (file) {
      const thumbnailBlob: any = await generateThumbnailBlob(file);

      if (thumbnailBlob) {
        const videoFileName = file ? file?.name : "video";
        const thumbnailFileName = `${videoFileName.replace(
          /\.[^/.]+$/,
          ""
        )}.jpeg`;

        const thumbnailFile = new File([thumbnailBlob], thumbnailFileName, {
          type: "image/jpeg",
        });
        setThumbnail([thumbnailFile]);
        setVideo({
          file: file,
          thumbnailBlob: thumbnailFile,
        });
      }
      setThumbnailKey((prevKey) => prevKey + 1);
    } else {
      setError((prevErrors) => ({
        ...prevErrors,
        video: "Please select a video!",
      }));
    }
    const selectedFile = e.target.files?.[0];

    const videoElement = document.createElement("video");
    if (selectedFile) {
      videoElement.src = URL.createObjectURL(selectedFile);
      videoElement.addEventListener("loadedmetadata", () => {
        const durationInSeconds = videoElement.duration;
        const durationInMilliseconds = durationInSeconds;
        setVideoTime(durationInMilliseconds);
      });
    }
  };

  const generateThumbnailBlob = async (file: File) => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        video.currentTime = 1; // Set to capture the frame at 1 second
      };

      video.onseeked = async () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert the canvas to blob
        canvas.toBlob((blob) => {
          resolve(blob);
        }, "image/jpeg");
      };

      const objectURL = URL.createObjectURL(file);
      video.src = objectURL;

      return () => {
        URL.revokeObjectURL(objectURL);
      };
    });
  };

  const handleCloseAddCategory = () => {
    setAddVideoOpen(false);
    dispatch(closeDialog());
  };

  const handleSelectChangeHashTag = (selected: any | null) => {
    setSelectedHashtag(selected || []);
    const selectedIds = selected?.map((option: any) => option?._id);
    const updatedData = selectedIds?.join(",");
    setSelectedHashTagId(updatedData);
    if (!selected) {
      return setError({
        ...error,
        hashTag: `HashTag Is Required`,
      });
    } else {
      return setError({
        ...error,
        hashTag: "",
      });
    }
  };

  const handleRemoveApp = (removedOption: any) => {
    const updatedOptions = selectedHashtag?.filter(
      (option: any) => option._id !== removedOption?._id
    );
    setSelectedHashtag(updatedOptions);
    const selectedIds = updatedOptions?.map((option: any) => option?._id);
    const updatedData = selectedIds?.join(",");
    setSelectedHashTagId(updatedData);
  };

  useEffect(() => {
    const payload: any = {};
    dispatch(allHashTag(payload));
  }, []);

  const CustomOptionHashTag: React.FC<{
    innerProps: any;
    label: string;
    data: any;
  }> = ({ innerProps, data }) => (
    <div
      {...innerProps}
      className="country-optionList"
      style={{ height: "40px" }}
    >
      <img
        src={baseURL + data?.hashTagBanner}
        alt="hashTagBanner"
        style={{ objectFit: "cover", width: "25px", height: "25px" }}
      />
      <span>{data?.hashTag && data?.hashTag}</span>
    </div>
  );

  const CustomMultiValueHashTag: React.FC<{
    children: React.ReactNode;
    data: any;
  }> = ({ children, data }) => (
    <div className="custom-multi-value">
      {children}
      <span
        className="custom-multi-value-remove"
        onClick={() => handleRemoveApp(data)}
      >
        <HighlightOffIcon />
      </span>
    </div>
  );

  const handleSubmit = () => {
    if (
      !caption ||
      !fakeUserId ||
      !video.file ||
      selectedHashTagId?.length === 0
    ) {
      let error: any = {};
      if (!caption) error.caption = "Caption Is Required !";
      if (!fakeUserId) error.fakeUserId = "User Is Required !";
      // if (!countryDataSelect) error.country = "Country is required !";
      if (!video.file) error.video = "Please select video!";
      if (selectedHashTagId?.length === 0)
        error.hashTag = "Please select hashTag!";
      return setError({ ...error });
    } else {
      let formData = new FormData();

      formData.append("caption", caption);
      formData.append("videoUrl", video.file);
      formData.append("videoImage", thumbnail[0]);
      // formData.append("location", countryDataSelect?.name?.common);
      formData.append("hashTagId", selectedHashTagId);
      // formData.append("latitude", String(countryDataSelect?.latlng[0]));
      // formData.append("longitude", String(countryDataSelect?.latlng[1]));
      formData.append("videoTime", videoTime?.toString() || "");

      if (mongoId) {
        let payload: any = {
          data: formData,
          fakeUserId: fakeUserId,
          id: mongoId,
        };
        dispatch(updateFakeVideo(payload));
      } else {
        let payload: any = { data: formData, fakeUserId: fakeUserId };
        dispatch(addFakeVideo(payload));
      }
      dispatch(closeDialog());
    }
  };

  return (
    <div>
      <Modal
        open={addVideoOpen}
        onClose={handleCloseAddCategory}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="create-channel-model">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {dialogueData ? "Edit Video" : "Add Video"}
          </Typography>
          <form>
            <div className="row sound-add-box videoCreateModel">
              {!dialogueData && (
                <div className="col-12 col-lg-6 col-sm-6  mt-2 country-dropdown">
                  <Selector
                    label={"Fake User"}
                    selectValue={fakeUserId}
                    placeholder={"Enter Details..."}
                    selectData={fakePostDataGet}
                    selectId={true}
                    errorMessage={error.fakeUserId}
                    onChange={(e) => {
                      setFakeUserId(e.target.value);
                      if (!e.target.value) {
                        setError({
                          ...error,
                          fakeUserId: "Fake User Is Required",
                        });
                      } else {
                        setError({ ...error, fakeUserId: "" });
                      }
                    }}
                  />
                </div>
              )}
              <div className="col-lg-6 col-sm-12">
                <Input
                  label={"Caption"}
                  name={"caption"}
                  placeholder={"Enter Details..."}
                  value={caption}
                  errorMessage={error.caption}
                  onChange={(e) => {
                    setCaption(e.target.value);
                    if (!e.target.value) {
                      setError({ ...error, caption: "Caption Is Required" });
                    } else {
                      setError({ ...error, caption: "" });
                    }
                  }}
                />
              </div>
              {/* <div className="col-12 col-lg-6 col-sm-6  mt-2 country-dropdown">
                <label>Country</label>
                <ReactSelect
                  options={countryData || []}
                  value={countryDataSelect}
                  isClearable={false}
                  onChange={(selected) => handleSelectChange(selected)}
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
                {
                  error.country && (
                    <p className="errorMessage">{error.country && error.country}</p>
                  )
                }
              </div>
              <div className="col-12 col-lg-6 col-sm-6  mt-2">
                <Input
                  label={"Latitude"}
                  name={"latitude"}
                  disabled={true}
                  value={latitude?.toString() || ""}
                  placeholder={"Country Select"}
                />
              </div>
              <div className="col-12 col-lg-6 col-sm-6  mt-2">
                <Input
                  label={"Longitude"}
                  disabled={true}
                  name={"longitude"}
                  value={longitude?.toString() || ""}
                  placeholder={"Country Select"}
                />  
              </div> */}
              <div className="col-12 col-lg-6 col-sm-6  mt-2">
                <Input
                  label={"Video Time (Seconds)"}
                  name={"videoTime"}
                  accept={"video/*"}
                  placeholder={"Video Time"}
                  value={videoTime?.toString() || ""}
                  disabled={true}
                />
              </div>
              <div className="col-12 mt-2 country-dropdown">
                <label>HashTag</label>
                <ReactSelect
                  isMulti
                  options={allHashTagData || []}
                  value={selectedHashtag}
                  isClearable={false}
                  onChange={(selected) => handleSelectChangeHashTag(selected)}
                  getOptionValue={(option) => option?._id}
                  formatOptionLabel={(option) => (
                    <div
                      className="optionShow-option"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <img
                        src={
                          typeof option?.hashTagBanner === "string"
                            ? baseURL + option?.hashTagBanner
                            : option?.hashTagBanner?.src 
                        }
                        style={{
                          objectFit: "cover",
                          width: "25px",
                          height: "25px",
                        }}
                        alt="Banner"
                      />

                      <span>{option?.hashTag ? option?.hashTag : ""}</span>
                    </div>
                  )}
                  components={{
                    Option: CustomOptionHashTag,
                    MultiValue: CustomMultiValueHashTag,
                  }}
                />
                {error.hashTag && (
                  <p className="errorMessage">
                    {error.hashTag && error.hashTag}
                  </p>
                )}
              </div>
              <div className="col-12 mt-2">
                <Input
                  label={`Video`}
                  id={`video`}
                  type={`file`}
                  accept={`video/*`}
                  errorMessage={error.video}
                  onChange={handleVideo}
                />
              </div>

              {video.file ? (
                <div className="col-12 d-flex mt-4 videoShow">
                  <video
                    controls
                    style={{ width: "150px", height: "150px" }}
                    src={video.file ? URL?.createObjectURL(video.file) : ""}
                  />
                  <img
                    src={
                      video.thumbnailBlob
                        ? URL?.createObjectURL(video.thumbnailBlob)
                        : ""
                    }
                    style={{
                      width: "150px",
                      height: "150px",
                      marginLeft: "20px",
                    }}
                  />
                </div>
              ) : (
                <>
                  <div className="col-12 d-flex mt-4">
                    <video
                      controls
                      style={{ width: "200px", height: "200px" }}
                      src={videoPath || ""}
                    />
                    {/* <img
                      src={thumbnail[0]?.name ? thumbnail[0]?.name : thumbnail}
                      style={{
                        width: "200px",
                        height: "200px",
                        marginLeft: "20px",
                      }}
                    /> */}
                  </div>
                </>
              )}
            </div>
            <div className="mt-3 pt-3 d-flex justify-content-end">
              <Button
                onClick={handleCloseAddCategory}
                btnName={"Close"}
                newClass={"close-model-btn"}
              />
              <Button
                onClick={handleSubmit}
                btnName={dialogueData ? "Update" : "Submit"}
                type={"button"}
                newClass={"submit-btn"}
                style={{
                  borderRadius: "0.5rem",
                  width: "88px",
                  marginLeft: "10px",
                }}
              />
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};
export default CreateFakeVideo;
