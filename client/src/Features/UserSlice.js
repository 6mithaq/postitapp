import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { UsersData } from "../Exampledata";
import axios from "axios";

import * as ENV from "../config";

//const initialState = { value: [] }; //list of user is an object with empty array as initial value
const initialState = {
  value: UsersData,
  logged: "Anthony",

  user: {},
  isLoading: false,
  isSuccess: false,
  isError: false,
};

//Create the thunk for register
export const registerUser = createAsyncThunk(
  "users/registerUser",
  async (userData) => {
    try {
      //sends a POST request to the server along the request body object
      //const response = await axios.post("http://localhost:3001/registerUser", {
        const response = await axios.post(`${ENV.SERVER_URL}/registerUser`, {
        name: userData.name,
        email: userData.email,
        password: userData.password,
      });
      console.log(response);
      const user = response.data.user; //retrieve the response from the server
      return user; //return the response from the server as payload to the thunk
    } catch (error) {
      console.log(error);
    }
  }
);

//Create the thunk for login
export const login = createAsyncThunk("users/login", async (userData) => {
  try {
    //const response = await axios.post("http://localhost:3001/login", {
      const response = await axios.post(`${ENV.SERVER_URL}/login`, {
      email: userData.email,
      password: userData.password,
    });

    const user = response.data.user;
    console.log(response);
    return user;
  } catch (error) {
    //handle the error
    const errorMessage = "Invalid credentials";
    alert(errorMessage);
    throw new Error(errorMessage);
  }
});

//thunk for logout
export const logout = createAsyncThunk("/users/logout", async () => {
  try {
    // Send a request to your server to log the user out
    //const response = await axios.post("http://localhost:3001/logout");
    const response = await axios.post(`${ENV.SERVER_URL}/logout`);
  } catch (error) {}
});

export const userSlice = createSlice({
  name: "users", //name of the state
  initialState, // initial value of the state
  reducers: {
    addUser: (state, action) => {
      state.value.push(action.payload); //add the payload to the state
    },
    deleteUser: (state, action) => {
      //create a new array with the value that excludes the user with the email value from the action payload, and assign the new array to the state.
      state.value = state.value.filter((user) => user.email !== action.payload);
    },
    updateUser: (state, action) => {
      state.value.map((user) => {
        //iterate the array and compare the email with the email from the payload;
        if (user.email === action.payload.email) {
          user.name = action.payload.name;
          user.password = action.payload.password;
        }
      });
    },
  },

  //builder.addCase(action creator(pending, fulfilled, rejected), reducer)

  extraReducers: (builder) => {
    //Asynchronous actions that update the state directly,
    //extrareducer for register
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = true;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
      })

      //extrareducer for login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload; //assign the payload which is the user object return from the server after authentication
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      })

      //extrareducer for logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        // Clear user data or perform additional cleanup if needed
        state.user = {};
        state.isLoading = false;
        state.isSuccess = false;
      })
      .addCase(logout.rejected, (state) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export const { addUser, deleteUser, updateUser } = userSlice.actions; //export the function

export default userSlice.reducer;
