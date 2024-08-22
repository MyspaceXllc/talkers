"use-client";
import RootLayout from "../component/layout/Layout";
import React, { useEffect, useState } from "react";
import NewTitle from "../extra/Title";
import { RootStore, useAppSelector } from "../store/store";
import GiftShow from "@/component/gift/GiftShow";
import AddSvgaDialogue from "@/component/gift/AddSvgaDialogue";
import CreateGift from "@/component/gift/CreateGift";
import useClearSessionStorageOnPopState from "@/extra/ClearStorage";

interface GiftPageProps {
  // Define props if any
}

const GiftPage = (props) => {
  const { dialogue, dialogueType, dialogueData } = useAppSelector(
    (state: RootStore) => state.dialogue
  );

  const [multiButtonSelect, setMultiButtonSelect] = useState<string>("User");


  return (
    <>
      <div className="userPage">
        <div
          style={{
            display: `${
              dialogueType === "manageUser"
                ? "none"
                : dialogueType === "hostSettleMent"
                ? "none"
                : dialogueType === "hostHistory"
                ? "none"
                : dialogueType === "fakeUserAdd"
                ? "none"
                : dialogueType === "fakeUser"
                ? "none"
                : dialogueType === "hostReport"
                ? "none"
                : "block"
            }`,
          }}
        >
          <GiftShow />

          {dialogueType === "svgaGift" && <AddSvgaDialogue />}
          {dialogueType === "imageGift" && <CreateGift />}
        </div>
      </div>
    </>
  );
};

GiftPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default GiftPage;
