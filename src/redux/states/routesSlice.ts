import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RoutesState } from '../interfaces/routesInterface';

const initialState: RoutesState = {
  route: '',
};

const routesSlice = createSlice({
  name: 'routes',
  initialState,
  reducers: {
    routesAction(state, action: PayloadAction<string>) {
      state.route = action.payload;
    },
  },
});

export const { routesAction } = routesSlice.actions;
export default routesSlice.reducer;
