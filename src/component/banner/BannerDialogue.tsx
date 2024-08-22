import Button from "@/extra/Button";
import Input from "@/extra/Input";
import { createBanner, getBanner, updateBanner } from "@/store/bannerSlice";
import { addCurrency, updateCurrency } from "@/store/currencySlice";
import { closeDialog } from "@/store/dialogSlice";
import { RootStore, useAppDispatch, useAppSelector } from "@/store/store";

import { baseURL } from "@/util/config";
import { Box, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
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

interface ErrorState {
  image: string;
  serviceId: string;
  type: string;
  url: string;
}
const BannerDialogue = () => {


 
  const { dialogue, dialogueData , dialogueType } = useSelector(
    (state: RootStore) => state.dialogue
  );

  console.log("dialogueData", dialogueData);

  useEffect(() => {
    const payload: any = {
      start: 0,
      limit: 100,
      search: "ALL",
    };
    dispatch(getBanner(payload));
  }, [0, 100, "ALL"]);

  const dispatch = useAppDispatch();
  const [image, setImage] = useState<any>();
  const [imagePath, setImagePath] = useState<any>();
  const [addCurrencyOpen, setAddCurrencyOpen] = useState(false);

  console.log("image", image);

  console.log("image", image);
  console.log("imagePath", imagePath);

  const [error, setError] = useState({
    image: "",
    type: "",
  });

  useEffect(() => {
    if (dialogue) {
      setAddCurrencyOpen(dialogue);
    }
  }, [dialogue]);

  console.log("error", error);

  useEffect(() => {
    if (dialogueData) {
      setImagePath(baseURL + dialogueData?.image);
    }
  }, [dialogueData]);

  const handleCloseAddCurrency = () => {
    setAddCurrencyOpen(false);
    dispatch(closeDialog());
    localStorage.setItem("dialogueData", JSON.stringify(dialogueData));
  };

  const handleInputImage = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      setImage(e?.target?.files[0]);
      console.log("e.target.files[0]", e.target.files[0]);
      setImagePath(URL.createObjectURL(e.target.files[0]));
      setError({ ...error, image: "" });
    }
  };

  const handleSubmit = (e: any) => {
    

    if (!image) {
      let error = {} as ErrorState;
      if (!image) error.image = "Image is required";
      return setError({ ...error });
    } else {
      

      const formData: any = new FormData();
      formData.append("image", image);

      if (dialogueData) {
        let payload = {
          id: dialogueData?._id,
          formData: formData,
        };

        dispatch(updateBanner(payload));
      } else {
        dispatch(createBanner(formData));
      }

      dispatch(closeDialog());
    }
  };

  const types = [
    { value: 1, name: "Service" },
    { value: 2, name: "URL" },
  ];

  return (
    <div>
      <Modal
        open={addCurrencyOpen}
        onClose={handleCloseAddCurrency}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
          className="create-channel-model"
        >
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
          >
            {dialogueData ? "Edit Banner" : "Add Banner"}
          </Typography>
          <form>
            <div
              className="row sound-add-box"
              style={{ overflowX: "hidden" }}
            >
              <Input
                type={"file"}
                label={"Image"}
                accept={"image/png, image/jpeg"}
                errorMessage={error.image && error.image}
                onChange={handleInputImage}
              />

              {imagePath && (
                <>
                  <img
                    src={imagePath}
                    className="mt-3 rounded float-left mb-2"
                    alt="image"
                    style={{ width: "100px", height: "100px" }}
                  />
                </>
              )}
              <div className="mt-3 d-flex justify-content-end">
                <Button
                  onClick={handleCloseAddCurrency}
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
                    width: "80px",
                    marginLeft: "10px",
                  }}
                />
              </div>
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default BannerDialogue;
