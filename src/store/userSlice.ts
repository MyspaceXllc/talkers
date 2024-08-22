import { apiInstance, apiInstanceFetch } from "@/util/ApiInstance";
import { setToast } from "@/util/toastServices";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface UserState {
  realUserData: any[];
  totalRealUser: number;
  totalVerifiedUser: number;
  fakeUserData: any[];
  verifiedUserData: any[];
  totalFakeUser: number;
  countryData: any[];
  getUserProfileData: Object;
  isLoading: boolean;
}

const initialState: UserState = {
  realUserData: [],
  totalRealUser: 0,
  fakeUserData: [],
  verifiedUserData : [],
  totalFakeUser: 0,
  totalVerifiedUser : 0,
  getUserProfileData: {},
  countryData: [],
  isLoading: false,
};

interface AllUsersPayload {
  start?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  type?: string;
  meta: any;
  id?: string;
  data: any;
}

export const allUsers = createAsyncThunk(
  "admin/user/getUsers",
  async (payload: AllUsersPayload | undefined) => {
    return apiInstanceFetch.get(
      `admin/user/getUsers?start=${payload?.start}&limit=${payload?.limit}&startDate=${payload?.startDate}&endDate=${payload?.endDate}&type=${payload?.type}`
    );
  }
);

export const getUserProfile : any = createAsyncThunk(
  "admin/user/getProfile?userId",
  async (payload: AllUsersPayload | undefined) => {
    return apiInstanceFetch.get(`admin/user/getProfile?userId=${payload?.id}`);
  }
);

export const getCountry = createAsyncThunk(
  "https://restcountries.com/v3.1/all",
  async () => {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const data = await response.json();
    return data;
  }
);

export const deleteUser = createAsyncThunk(
  "admin/user/deleteUsers",
  async (payload: AllUsersPayload | undefined) => {
    return apiInstanceFetch.delete(
      `admin/user/deleteUsers?userId=${payload?.id}`
    );
  }
);

export const blockUser = createAsyncThunk(
  "admin/user/isBlock",
  async (payload: AllUsersPayload | undefined) => {
    return apiInstance.patch(
      `admin/user/isBlock?userId=${payload?.id ? payload?.id : payload}`
    );
  }
);

export const addFakeUser = createAsyncThunk(
  "admin/user/fakeUser",
  async (payload: AllUsersPayload | undefined) => {
    return axios.post("admin/user/fakeUser", payload?.data);
  }
);

export const updateFakeUser = createAsyncThunk(
  "admin/user/updateUser",
  async (payload: AllUsersPayload | undefined) => {
    return axios.patch(
      `admin/user/updateUser?userId=${payload?.id}`,
      payload.data
    );
  }
);

export const userPasswordChange = createAsyncThunk(
  "admin/user/userPasswordChange",
  async (payload: AllUsersPayload | undefined) => {
    return axios.patch(
      `admin/user/userPasswordChange?userId=${payload?.id}`,
      payload.data
    );
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setGetProfileRemove(
      state,
      action: PayloadAction<{ type?: string; data?: any }>
    ) {
      state.getUserProfileData = action.payload.data;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(allUsers.pending, (state, action: PayloadAction<any>) => {
      state.isLoading = true;
    });

    builder.addCase(
      allUsers.fulfilled,
      (state, action: PayloadAction<any, string, { arg: AllUsersPayload }>) => {
        if (action.meta.arg.type === "realUser") {
          state.realUserData = action.payload.data;
          state.totalRealUser = action?.payload?.total;
        } else if (action.meta.arg.type === "verifiedUser") {
          state.verifiedUserData = action.payload.data;
          state.totalVerifiedUser = action?.payload?.total;
        } else {
          state.fakeUserData = action.payload.data;
          state.totalFakeUser = action?.payload?.total;
        }
        state.isLoading = false;
      }
    );

    builder.addCase(allUsers.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
    });

    builder.addCase(
      getUserProfile.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );

    builder.addCase(
      getUserProfile.fulfilled,
      (state, action: PayloadAction<any, string, { arg: AllUsersPayload }>) => {
        state.getUserProfileData = action.payload?.data;
        state.isLoading = false;
      }
    );

    builder.addCase(
      getUserProfile.rejected,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      }
    );

    builder.addCase(
      blockUser.fulfilled,
      (state, action: PayloadAction<any, string, { arg: AllUsersPayload }>) => {
        if (action.payload.status) {
          const userId = action.meta.arg?.id;
          const userValue = action.meta.arg?.data;
          state.realUserData = state?.realUserData?.map((userData: any) => {
            if (userId?.includes(userData?._id)) {
              const matchingUserData = action.payload.data?.find(
                (user: any) => user?._id === userData?._id
              );
              return {
                ...userData,
                isBlock: matchingUserData?.isBlock,
              };
            }

            return userData;
          });

          state.fakeUserData = state?.fakeUserData?.map((userData: any) => {
            if (userId?.includes(userData?._id)) {
              const matchingUserData = action.payload.data?.find(
                (user: any) => user?._id === userData?._id
              );
              return {
                ...userData,
                isBlock: matchingUserData?.isBlock,
              };
            }

            return userData;
          });

          setToast(
            "success",
            userValue === true
              ? "User Block SuccessFully"
              : "User Unblock SuccessFully"
          );
        }
      }
    );
    builder.addCase(blockUser.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
    });

    builder.addCase(deleteUser.pending, (state, action: PayloadAction<any>) => {
      state.isLoading = true;
    });

    builder.addCase(
      deleteUser.fulfilled,
      (state, action: PayloadAction<any, string, { arg: AllUsersPayload }>) => {
        const deletedUserIds = action.meta.arg?.id;

        state.isLoading = false;
        state.realUserData = state.realUserData.filter(
          (user: any) => !deletedUserIds.includes(user?._id)
        );
        setToast("success", " User Delete Successfully");
      }
    );

    builder.addCase(
      deleteUser.rejected,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
      }
    );

    builder.addCase(getCountry.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(
      getCountry.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.countryData = action.payload;
        state.isLoading = false;
      }
    );

    builder.addCase(getCountry.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(addFakeUser.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(
      addFakeUser.fulfilled,
      (state, action: PayloadAction<any>) => {
        if (action.payload.data.status === true) {
          state.fakeUserData?.unshift(action?.payload?.data?.data);
          setToast(
            "success",
            `${action.payload.data?.data.userName} New User Created`
          );
        }
        state.isLoading = false;
      }
    );

    builder.addCase(addFakeUser.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(updateFakeUser.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(
      updateFakeUser.fulfilled,
      (state, action: PayloadAction<any, string, { arg: AllUsersPayload }>) => {
        if (action.payload.data.status === true) {
          state.fakeUserData = state?.fakeUserData?.map((user) => {
            if (user?._id === action.meta.arg?.id) {
              return action.payload?.data?.data;
            }
            return user;
          });
          setToast(
            "success",
            `${action.payload.data?.data?.userName} User Updated Successfully`
          );
        }
        state.isLoading = false;
      }
    );

    builder.addCase(updateFakeUser.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(
      userPasswordChange.pending,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );
    builder.addCase(
      userPasswordChange.fulfilled,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
      }
    );
    builder.addCase(
      userPasswordChange.rejected,
      (state: any, action: PayloadAction<any>) => {
        state.isLoading = false;
        setToast("error", action.payload?.message);
      }
    );
  },
});

export default userSlice.reducer;
export const { setGetProfileRemove } = userSlice.actions;
