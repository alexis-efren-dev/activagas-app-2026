// slices/loggedUserSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILoggedUser } from '../interfaces/loggedUserInterface';

const initialState: ILoggedUser = {
  cellPhone: 0,
  _id: '',
  idRol: '',
  idGas: '',
};

const loggedUserSlice = createSlice({
  name: 'loggedUser',
  initialState,
  reducers: {
    loggedUserAction: (state, action: PayloadAction<ILoggedUser>) => {
      return action.payload;
    },
  },
});

export const { loggedUserAction } = loggedUserSlice.actions;

export default loggedUserSlice.reducer;
