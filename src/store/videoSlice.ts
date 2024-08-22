import { apiInstance, apiInstanceFetch } from "@/util/ApiInstance";
import { setToast } from "@/util/toastServices";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface VideoState {
  realVideo: any[];
  totalRealVideo: number;
  fakeVideoData: any[];
  totalFakeVideo: number;
  countryData: any[];
  isLoading: boolean;
}

const initialState: VideoState = {
  realVideo: [],
  totalRealVideo: 0,
  fakeVideoData: [],
  totalFakeVideo: 0,
  countryData: [],
  isLoading: false,
};

interface AllVideoPayload {
  start?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  type?: string;
  meta: any;
  videoId: string;
  fakeUserId: String;
  id?: string;
  data: any;
}

export const allVideo = createAsyncThunk(
  "admin/video/getVideos  ",
  async (payload: AllVideoPayload | undefined) => {
    return apiInstanceFetch.get(
      `admin/video/getVideos?start=${payload?.start}&limit=${payload?.limit}&startDate=${payload?.startDate}&endDate=${payload?.endDate}&type=${payload?.type}`
    );
  }
);

export const deleteFakeVideo = createAsyncThunk(
  "admin/video/deleteVideo?videoId",
  async (payload: AllVideoPayload | undefined) => {
    return apiInstanceFetch.delete(
      `admin/video/deleteVideo?videoId=${payload?.id}`
    );
  }
);

export const addFakeVideo = createAsyncThunk(
  "admin/video/uploadfakevideo",
  async (payload: AllVideoPayload | undefined) => {
    return axios.post(
      `admin/video/uploadfakevideo?userId=${payload?.fakeUserId}`,
      payload?.data
    );
  }
);

export const updateFakeVideo = createAsyncThunk(
  "admin/video/updatefakevideo",
  async (payload: AllVideoPayload | undefined) => {
    return axios.patch(
      `admin/video/updatefakevideo?postId=${payload?.fakeUserId}&videoId=${payload?.videoId}`,
      payload.data
    );
  }
);

const videoReducer = createSlice({
  name: "video",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(allVideo.pending, (state, action: PayloadAction<any>) => {
      state.isLoading = true;
    });

    builder.addCase(
      allVideo.fulfilled,
      (state, action: PayloadAction<any, string, { arg: AllVideoPayload }>) => {
        if (action.meta.arg.type === "realVideo") {
          state.realVideo = action.payload.videos;
          state.totalRealVideo = action?.payload?.totalVideo;
        } else {
          state.fakeVideoData = action.payload.videos;
          state.totalFakeVideo = action?.payload?.totalVideo;
        }
        state.isLoading = false;
      }
    );

    builder.addCase(allVideo.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
    });
    builder.addCase(
      deleteFakeVideo.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );

    builder.addCase(
      deleteFakeVideo.fulfilled,
      (state, action: PayloadAction<any, string, { arg: AllVideoPayload }>) => {
        const deletedUserIds = action.meta.arg?.id;
        state.isLoading = false;
        state.fakeVideoData = state.fakeVideoData.filter(
          (post: any) => !deletedUserIds.includes(post?._id)
        );
        setToast("success", " Video Delete Successfully");
      }
    );

    builder.addCase(
      deleteFakeVideo.rejected,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      }
    );

    builder.addCase(addFakeVideo.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(
      addFakeVideo.fulfilled,
      (state, action: PayloadAction<any>) => {
        
        state.isLoading = false;
        if (action.payload.data.status === true) {
          state.fakeVideoData?.unshift(action?.payload?.data?.data);
          setToast("success", `New Video Created`);
        }
      }
    );

    builder.addCase(addFakeVideo.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(updateFakeVideo.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(
      updateFakeVideo.fulfilled,
      (state, action: PayloadAction<any, string, { arg: AllVideoPayload }>) => {
        state.isLoading = false;
        if (action.payload.data.status === true) {
          const videoIndex = state.fakeVideoData.findIndex(
            (video) => video?._id === action?.payload?.data?._id
          );
          if (videoIndex !== -1) {
            state.fakeVideoData[videoIndex] = {
              ...state.fakeVideoData[videoIndex],
              ...action.payload.data,
            };
          }
          setToast("success", ` Video Update Successfully`);
        }
      }
    );

    builder.addCase(updateFakeVideo.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export default videoReducer.reducer;
