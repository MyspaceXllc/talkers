import { apiInstance, apiInstanceFetch } from "@/util/ApiInstance";
import { setToast } from "@/util/toastServices";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface PostState {
    realPost: any[];
    totalRealPost: number;
    fakePostData: any[];
    totalFakePost: number;
    countryData: any[];
    allHashTagData: any[];
    getUserProfileData: Object;
    isLoading: boolean;
}

const initialState: PostState = {
    realPost: [],
    totalRealPost: 0,
    fakePostData: [],
    totalFakePost: 0,
    allHashTagData: [],
    getUserProfileData: {},
    countryData: [],
    isLoading: false
}


interface AllPostPayload {
    start?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    type?: string;
    meta: any,
    fakeUserId: String,
    userId: String,
    id?: string;
    data: any;
}


export const allPost = createAsyncThunk(
    "admin/post/getPosts",
    async (payload: AllPostPayload | undefined) => {
        return apiInstanceFetch.get(
            `admin/post/getPosts?start=${payload?.start}&limit=${payload?.limit}&startDate=${payload?.startDate}&endDate=${payload?.endDate}&type=${payload?.type}`
        );
    }
);

export const deleteFakePost = createAsyncThunk(
    "admin/post/deletePost?postId",
    async (payload: AllPostPayload | undefined) => {
        
        return apiInstanceFetch.delete(`admin/post/deletePost?postId=${payload}`);
    }
);


export const allHashTag = createAsyncThunk(
    "admin/hashTag/getHashtag",
    async (payload: AllPostPayload | undefined) => {
        return apiInstanceFetch.get(
            `admin/hashTag/getHashtag`
        );
    }
);

export const addFakePost = createAsyncThunk(
    "admin/post/uploadfakePost",
    async (payload: AllPostPayload | undefined) => {
        
        return axios.post(`admin/post/uploadfakePost?userId=${payload.fakeUserId}`, payload?.data);
    }
);

export const updateFakePost = createAsyncThunk(
    "admin/post/updatefakePost",
    async (payload: AllPostPayload | undefined) => {
        
        return axios.patch(`admin/post/updatefakePost?userId=${payload?.fakeUserId}&postId=${payload?.id}`, payload.data);
    }
);

const postReducer = createSlice({
    name: "post",
    initialState,
    reducers: {
        setGetProfileRemove(state, action: PayloadAction<{ type?: string; data?: any }>) {
            state.getUserProfileData = action.payload.data;
        },

    },
    extraReducers: (builder) => {
        builder.addCase(allPost.pending, (state, action: PayloadAction<any>) => {
            state.isLoading = true;
        });

        builder.addCase(allPost.fulfilled, (state, action: PayloadAction<any, string, { arg: AllPostPayload }>) => {
            if (action.meta.arg.type === "realPost") {
                state.realPost = action.payload.data;
                state.totalRealPost = action?.payload?.total;
            } else {
                state.fakePostData = action.payload.data;
                state.totalFakePost = action?.payload?.total;
            }
            state.isLoading = false;
        });

        builder.addCase(allPost.rejected, (state, action: PayloadAction<any>) => {
            state.isLoading = false;
        });
        builder.addCase(allHashTag.pending, (state, action: PayloadAction<any>) => {
            state.isLoading = true;
        });

        builder.addCase(allHashTag.fulfilled, (state, action: PayloadAction<any>) => {
            state.isLoading = false;
            state.allHashTagData = action.payload.data;
        });

        builder.addCase(allHashTag.rejected, (state, action: PayloadAction<any>) => {
            state.isLoading = false;
        });
        builder.addCase(deleteFakePost.pending, (state, action: PayloadAction<any>) => {
            state.isLoading = true;
        });

        builder.addCase(deleteFakePost.fulfilled, (state, action: PayloadAction<any, string, { arg: AllPostPayload }>) => {
            
            const deletedUserIds = action.meta.arg;
            state.isLoading = false;
            state.fakePostData = state.fakePostData.filter(
                (post: any) => post?._id !== deletedUserIds
            );

            state.realPost = state.realPost.filter(
                (post: any) => post?._id !== deletedUserIds
            );
            setToast("success", " Post Delete Successfully")
        });

        builder.addCase(deleteFakePost.rejected, (state, action: PayloadAction<any>) => {
            state.isLoading = false;
        });

        builder.addCase(addFakePost.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(addFakePost.fulfilled, (state, action: PayloadAction<any>) => {
            state.isLoading = false;
            if (action.payload.data.status === true) {

                state.fakePostData?.unshift(action?.payload?.data?.data)
                setToast("success", `New Post Created`)
            }
        });

        builder.addCase(addFakePost.rejected, (state) => {
            state.isLoading = false;
        });

        builder.addCase(updateFakePost.pending, (state) => {
            state.isLoading = true;
        });

        builder.addCase(updateFakePost.fulfilled, (state, action: PayloadAction<any, string, { arg: AllPostPayload }>) => {
            state.isLoading = false;
            if (action.payload.data.status === true) {
                
                const postIndex = state.fakePostData.findIndex((post) => post?._id === action?.payload?.data?.data?._id);
                if (postIndex !== -1) {
                    
                    state.fakePostData[postIndex] = { ...state.fakePostData[postIndex], ...action.payload.data?.data };
                }
                setToast("success", ` Post Update Successfully`)
            }
        });

        builder.addCase(updateFakePost.rejected, (state) => {
            state.isLoading = false;
        });
    }
})

export default postReducer.reducer;
