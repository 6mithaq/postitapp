import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Cruise, InsertCruise } from "@shared/schema";
import axios from "axios";

interface CruiseState {
  cruises: Cruise[];
  selectedCruise: Cruise | null;
  loading: boolean;
  error: string | null;
}

const initialState: CruiseState = {
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
      const response = await axios.get("/api/cruises");
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
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/cruises/${id}`);
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
  async (cruiseData: InsertCruise, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/cruises", cruiseData);
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
  async ({ id, cruiseData }: { id: number; cruiseData: InsertCruise }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/cruises/${id}`, cruiseData);
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
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/cruises/${id}`);
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
      .addCase(fetchCruises.fulfilled, (state, action: PayloadAction<Cruise[]>) => {
        state.loading = false;
        state.cruises = action.payload;
      })
      .addCase(fetchCruises.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch cruise by ID
      .addCase(fetchCruiseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCruiseById.fulfilled, (state, action: PayloadAction<Cruise>) => {
        state.loading = false;
        state.selectedCruise = action.payload;
      })
      .addCase(fetchCruiseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create cruise
      .addCase(createCruise.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCruise.fulfilled, (state, action: PayloadAction<Cruise>) => {
        state.loading = false;
        state.cruises.push(action.payload);
      })
      .addCase(createCruise.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update cruise
      .addCase(updateCruise.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCruise.fulfilled, (state, action: PayloadAction<Cruise>) => {
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
        state.error = action.payload as string;
      })
      
      // Delete cruise
      .addCase(deleteCruise.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCruise.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.cruises = state.cruises.filter(cruise => cruise.id !== action.payload);
        if (state.selectedCruise?.id === action.payload) {
          state.selectedCruise = null;
        }
      })
      .addCase(deleteCruise.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedCruise, clearError } = cruiseSlice.actions;

export default cruiseSlice.reducer;
