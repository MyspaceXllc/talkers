import { apiInstanceFetch } from "@/util/ApiInstance";
import { setToast } from "@/util/toastServices";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    dashCount: Object;
    chartAnalyticOfUsers: any;
    chartAnalyticOfPosts: any;
    chartAnalyticOfVideos: any;
    isLoading: boolean;
}

const initialState: UserState = {
    dashCount: {},
    chartAnalyticOfUsers: [],
    chartAnalyticOfPosts: [],
    chartAnalyticOfVideos: [],
    isLoading: false
}


interface AllUsersPayload {
    start?: number;
    limit?: number;
    startDate?: string;
    endDate?: string;
    type?: string;
}


export const dashboardCount = createAsyncThunk(
    "admin/dashboard/dashboardCount",
    async (payload: AllUsersPayload | undefined) => {
        return apiInstanceFetch.get(
            `admin/dashboard/dashboardCount?startDate=${payload?.startDate}&endDate=${payload?.endDate}`
        );
    }
);
export const getChart = createAsyncThunk(
    "admin/dashboard/chartAnalytic",
    async (payload: AllUsersPayload | undefined) => {
        return apiInstanceFetch.get(
            `admin/dashboard/chartAnalytic?startDate=${payload?.startDate}&endDate=${payload?.endDate}&type=${payload?.type}`
        );
    }
);
const dashSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(dashboardCount.pending, (state: any, action: PayloadAction<any>) => {
            state.isLoading = true;
        })
        builder.addCase(
            dashboardCount.fulfilled, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                state.dashCount = action.payload.data;
            }
        )
        builder.addCase(dashboardCount.rejected, (state: any, action: PayloadAction<any>) => {
            state.isLoading = false;
            setToast("error", action.payload?.message);
        })

        builder.addCase(getChart.pending, (state: any, action: PayloadAction<any>) => {
            state.isLoading = true;
        })
        builder.addCase(
            getChart.fulfilled, (state, action: PayloadAction<any>) => {
                state.isLoading = false;
                (state.chartAnalyticOfUsers =
                    action.payload.data || state.chartAnalyticOfUsers),
                    (state.chartAnalyticOfPosts =
                        action.payload.data || state.chartAnalyticOfPosts),
                    (state.chartAnalyticOfVideos =
                        action.payload.data || state.chartAnalyticOfVideos)
            }
        )
        builder.addCase(getChart.rejected, (state: any, action: PayloadAction<any>) => {
            state.isLoading = false;
            setToast("error", action.payload?.message);
        })
    }
})

export default dashSlice.reducer;
