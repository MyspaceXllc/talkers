'use-client'
import RootLayout from "../component/layout/Layout";
import React, { useEffect, useState } from "react";
import NewTitle from "../extra/Title";
import MultiButton from "../extra/MultiButton";
import { useSelector, useDispatch } from "react-redux"; // Added useDispatch for TypeScript inference
import FakeUser from "../component/user/FakeUser";
import User from "../component/user/User";
import NewFakeUser from "../component/user/NewFakeUser";
import UserSetting from "../component/user/UserSetting";
import { RootStore, useAppSelector } from "../store/store"; // Assuming RootState is defined in the Redux store
import HashTagShow from "@/component/hashTag/HashTagShow";
import CreateHashTag from "@/component/hashTag/CreateHashTag";
import useClearSessionStorageOnPopState from "@/extra/ClearStorage";

interface ManageUserProps {
    // Define props if any
}

const HashTagTable = (props) => {
    const { dialogue, dialogueType, dialogueData } = useAppSelector(
        (state: RootStore) => state.dialogue
    );
  useClearSessionStorageOnPopState("multiButton")


    return (
        <>
            <div className="userPage">
                <div
                >
                    <div className="dashboardHeader primeHeader mb-3 p-0">
                        <NewTitle
                            dayAnalyticsShow={false}
                            titleShow={true}
                            name={`Hashtags`}
                        />
                    </div>
                    <HashTagShow />
                </div>
                    {dialogueType === "CreateHashTag" && <CreateHashTag />}
            </div>
        </>
    );
};

HashTagTable.getLayout = function getLayout(page) {
    return <RootLayout>{page}</RootLayout>;
};

export default HashTagTable;
