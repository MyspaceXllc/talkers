import React, { useState } from "react";
import NewTitle from "../extra/Title";
import Post from "../component/post/Post";
import FakePost from "../component/post/FakePost";
import { RootStore } from "../store/store";
import CreateFakePost from "../component/post/CreateFakePost";
import { useSelector } from "react-redux";
import RootLayout from "@/component/layout/Layout";
import SongCategory from "@/component/song/SongCategory";
import Song from "@/component/song/Song";
import CreateSongCategory from "@/component/song/CreateSongCategory";
import CreateSong from "@/component/song/CreateSong";
import UserReport from "@/component/report/UserReport";
import VideoReport from "@/component/report/VideoReport";
import PostReport from "@/component/report/PostReport";

interface ManagePostProps {}

const ManageReportType = (props) => {
  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state: RootStore) => state.dialogue
  );

  const [dayAnalytics, setDayAnalytics] = useState<string>("today");
  const [multiButtonSelect, setMultiButtonSelect] =
    useState<string>("User Report");
  const [startDate, setStartDate] = useState<string>("All");
  const [endDate, setEndDate] = useState<string>("All");

  return (
    <div className="userPage channelPage">
      {dialogueType === "fakePost" && <CreateFakePost />}
      <div>
        <div className="dashboardHeader primeHeader mb-3 p-0">
          <NewTitle
            dayAnalyticsShow={true}
            name={`Report`}
            titleShow={false}
            multiButtonSelect={multiButtonSelect}
            setMultiButtonSelect={setMultiButtonSelect}
            labelData={["User Report", "Post Report", "Video Report"]}
          />
        </div>
      </div>
      {multiButtonSelect === "User Report" && <UserReport />}

      {multiButtonSelect === "Video Report" && <VideoReport />}

      {multiButtonSelect === "Post Report" && <PostReport />}
    </div>
  );
};
ManageReportType.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default ManageReportType;
