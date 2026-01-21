// slices/loggedUserSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {IGeneralConfigurations} from '../interfaces/generalConfigurationsInterface';

const initialState: IGeneralConfigurations = {
  gradients: [],
  colorFonts: '',
  imageUrl: '',
};
const generalConfigurationsSlice = createSlice({
  name: 'generalConfigurations',
  initialState,
  reducers: {
    updateGeneralConfigurations: (state, action: PayloadAction<any>) => {
      const data = action.payload;
      if (
        !data.imageUrl ||
        data.imageUrl ===
          'https://activagas-files.s3.amazonaws.com/initialimage.png'
      ) {
        data.imageUrl =
          'https://activagas-files.s3.amazonaws.com/initialimage.png';
      }

      state.colorFonts = data.colorFonts;
      state.gradients = data.gradients;
      state.imageUrl = data.imageUrl;
    },
    updateGeneralConfigurationsImage: (
      state,
      action: PayloadAction<string>,
    ) => {
      const data = action.payload;
      const internalImageUrl =
        !data ||
        data === 'https://activagas-files.s3.amazonaws.com/initialimage.png'
          ? 'https://activagas-files.s3.amazonaws.com/initialimage.png'
          : data;
      state.imageUrl = internalImageUrl;
    },
  },
});

export const {updateGeneralConfigurations, updateGeneralConfigurationsImage} =
  generalConfigurationsSlice.actions;

export default generalConfigurationsSlice.reducer;
