import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Booking, CreateBookingInput } from "@shared/schema";
import axios from "axios";

interface BookingState {
  bookings: Booking[];
  userBookings: Booking[];
  selectedBooking: Booking | null;
  priceCalculation: PriceCalculation | null;
  loading: boolean;
  error: string | null;
}

interface PriceCalculation {
  totalPrice: number;
  breakdown: {
    basePrice: number;
    cabinUpgrade: number;
    taxesFees: number;
    gratuities: number;
  };
}

const initialState: BookingState = {
  bookings: [],
  userBookings: [],
  selectedBooking: null,
  priceCalculation: null,
  loading: false,
  error: null,
};

// Async thunks
export const fetchAllBookings = createAsyncThunk(
  "bookings/fetchAllBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/admin/bookings");
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const fetchUserBookings = createAsyncThunk(
  "bookings/fetchUserBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/bookings");
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const calculateBookingPrice = createAsyncThunk(
  "bookings/calculateBookingPrice",
  async (bookingData: CreateBookingInput, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/calculate-price", bookingData);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const createBooking = createAsyncThunk(
  "bookings/createBooking",
  async (bookingData: CreateBookingInput, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/bookings", bookingData);
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

export const updateBookingStatus = createAsyncThunk(
  "bookings/updateBookingStatus",
  async ({ id, status }: { id: number; status: string }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/api/bookings/${id}/status`, { status });
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue("An unknown error occurred");
    }
  }
);

// Slice
const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    clearSelectedBooking: (state) => {
      state.selectedBooking = null;
    },
    clearPriceCalculation: (state) => {
      state.priceCalculation = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all bookings (admin)
      .addCase(fetchAllBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action: PayloadAction<Booking[]>) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch user bookings
      .addCase(fetchUserBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action: PayloadAction<Booking[]>) => {
        state.loading = false;
        state.userBookings = action.payload;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Calculate booking price
      .addCase(calculateBookingPrice.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(calculateBookingPrice.fulfilled, (state, action: PayloadAction<PriceCalculation>) => {
        state.loading = false;
        state.priceCalculation = action.payload;
      })
      .addCase(calculateBookingPrice.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create booking
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action: PayloadAction<Booking>) => {
        state.loading = false;
        state.userBookings.push(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Update booking status
      .addCase(updateBookingStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBookingStatus.fulfilled, (state, action: PayloadAction<Booking>) => {
        state.loading = false;
        // Update in all bookings array (admin)
        const bookingIndex = state.bookings.findIndex(
          (booking) => booking.id === action.payload.id
        );
        if (bookingIndex !== -1) {
          state.bookings[bookingIndex] = action.payload;
        }
        
        // Update in user bookings array
        const userBookingIndex = state.userBookings.findIndex(
          (booking) => booking.id === action.payload.id
        );
        if (userBookingIndex !== -1) {
          state.userBookings[userBookingIndex] = action.payload;
        }
        
        // Update selected booking if it matches
        if (state.selectedBooking?.id === action.payload.id) {
          state.selectedBooking = action.payload;
        }
      })
      .addCase(updateBookingStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedBooking, clearPriceCalculation, clearError } = bookingSlice.actions;

export default bookingSlice.reducer;
