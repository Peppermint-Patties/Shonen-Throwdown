import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import { supabase } from "../../lib/supabase";

const initialState = {};

export const searchUser = createAsyncThunk("search4user", async (hope) => {
  try {
    console.log(hope, "hope");
    const user = await supabase.from("users").select().eq("id", hope).single();
    console.log(user.data);
    return user.data;
  } catch (error) {
    console.log(error, "Error Search");
  }
});

export const updateUser = createAsyncThunk("updateUser", async (hope) => {
  try {
    const updatedUser = await supabase
      .from("users")
      .update(hope)
      .eq("id", hope.id);
    return updatedUser;
  } catch (error) {
    console.log(error);
  }
});

export const updateWallet = createAsyncThunk('updateWallet', async({updatedWallet, userId})=>{
  try{
    console.log(updatedWallet)
    console.log(userId)
    const {data} = await supabase
    .from("users")
    .update({wallet: updatedWallet})
    .eq('id', userId)
    .select()
    .single();
    return data
  } catch(err){
    console.log(err)
  }
})

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(searchUser.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(searchUser.fulfilled, (state, action) => {
        console.log("Fulfilled Search");
        // console.log(action.payload, "ACTION PAYLOAD");
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(updateUser.pending, (state, action) => {
        console.log("Initiating update user");
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        console.log(" Update User fulfilled");
        state.loading = false;
      })
      .addCase(updateWallet.fulfilled, (state,action)=>{
        state.user = action.payload
        return state
      });
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
