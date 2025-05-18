import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import * as ENV from "../config";

const initialState = {
  cruises: [],
  selectedCruise: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchCruises = createAsyncThunk(
  "cruises/fetchCruises",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${ENV.SERVER_URL}/api/cruises`);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchCruiseById = createAsyncThunk(
  "cruises/fetchCruiseById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${ENV.SERVER_URL}/api/cruises/${id}`);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const createCruise = createAsyncThunk(
  "cruises/createCruise",
  async (cruiseData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${ENV.SERVER_URL}/api/cruises`, cruiseData);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const updateCruise = createAsyncThunk(
  "cruises/updateCruise",
  async ({ id, cruiseData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${ENV.SERVER_URL}/api/cruises/${id}`, cruiseData);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const deleteCruise = createAsyncThunk(
  "cruises/deleteCruise",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${ENV.SERVER_URL}/api/cruises/${id}`);
      return id;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

// Slice
const cruiseSlice = createSlice({
  name: "cruises",
  initialState,
  reducers: {
    clearSelectedCruise: (state) => {
      state.selectedCruise = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all cruises
      .addCase(fetchCruises.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCruises.fulfilled, (state, action) => {
        state.loading = false;
        state.cruises = action.payload;
      })
      .addCase(fetchCruises.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch cruise by ID
      .addCase(fetchCruiseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCruiseById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCruise = action.payload;
      })
      .addCase(fetchCruiseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create cruise
      .addCase(createCruise.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCruise.fulfilled, (state, action) => {
        state.loading = false;
        state.cruises.push(action.payload);
      })
      .addCase(createCruise.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update cruise
      .addCase(updateCruise.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCruise.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.cruises.findIndex(cruise => cruise.id === action.payload.id);
        if (index !== -1) {
          state.cruises[index] = action.payload;
        }
        if (state.selectedCruise?.id === action.payload.id) {
          state.selectedCruise = action.payload;
        }
      })
      .addCase(updateCruise.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete cruise
      .addCase(deleteCruise.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCruise.fulfilled, (state, action) => {
        state.loading = false;
        state.cruises = state.cruises.filter(cruise => cruise.id !== action.payload);
        if (state.selectedCruise?.id === action.payload) {
          state.selectedCruise = null;
        }
      })
      .addCase(deleteCruise.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedCruise, clearError } = cruiseSlice.actions;

export default cruiseSlice.reducer;
