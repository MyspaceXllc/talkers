import { RootStore } from "@/store/store";
import { Box, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Button from "@/extra/Button";
import { closeDialog } from "@/store/dialogSlice";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  borderRadius: "13px",
  border: "1px solid #C9C9C9",
  boxShadow: 24,
  p: "19px",
};
const PostDialogue: React.FC = () => {
  const swiperRef = React.useRef(null);
  const { dialogue, dialogueData } = useSelector(
    (state: RootStore) => state.dialogue
  );

  console.log("dialogueData", dialogueData);

  const [addPostOpen, setAddPostOpen] = useState(false);

  useEffect(() => {
    setAddPostOpen(dialogue);
  }, [dialogue]);

  const handleCloseAddCategory = () => {
    setAddPostOpen(false);
    closeDialog();
  };
  return (
    <div>
      <Modal
        open={addPostOpen}
        onClose={handleCloseAddCategory}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="create-channel-model">
          <Typography
            id="modal-modal-title"
            style={{ borderBottom: "1px solid #000" }}
            variant="h6"
            component="h2"
          >
            View Post
          </Typography>

          <div className="row mt-3">
            <div className="col-12">
              <span className="fw-bold">Description</span>
              <p className="mt-2">{dialogueData?.caption}</p>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <Swiper
                modules={[Navigation]}
                spaceBetween={0}
                slidesPerView={1}
                navigation
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                onSlideChange={() => console.log("slide change")}
              >
                {dialogueData?.postImage?.map((img: any, index: any) => (
                  <SwiperSlide key={index}>
                    <img
                      src={img}
                      style={{
                        width: "100%",
                        height: "400px",
                        objectFit: "cover",
                        boxSizing: "border-box",
                        borderRadius: "0.25rem",
                      }}
                      alt={`Slide ${index}`}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
          <div className="mt-3 pt-3 d-flex justify-content-end">
            <Button
              onClick={handleCloseAddCategory}
              btnName={"Close"}
              newClass={"close-model-btn"}
            />
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default PostDialogue;
