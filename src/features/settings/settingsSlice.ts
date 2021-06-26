
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from 'store';

interface SettingsState {
    fontFamily: string;
    fontSizeRSVP: number;
    fontSizeReader: number;
    fontWidthRSVP: number;
    fontWidthReader: number;
}

const initialState: SettingsState = {
    fontFamily: '',
    fontSizeRSVP: 42,
    fontSizeReader: 16,
    fontWidthRSVP: 0, 
    fontWidthReader: 0,
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setFontFamily: (state, action: PayloadAction<string>) => {
            state.fontFamily = action.payload;
            // Calculate font width;
        },
        setFontSizeRSVP: (state, action: PayloadAction<number>) => {
            state.fontSizeRSVP = action.payload;
            // Calculate font width;
        },
        setFontSizeReader: (state, action: PayloadAction<number>) => {
            state.fontSizeReader = action.payload;
            // Calculate font width;
        },

    },
})

export const {
    setFontFamily,
    setFontSizeRSVP,
    setFontSizeReader,
} = settingsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectSettings = (state: RootState, type: 'RSVP' | 'Reader') => {
    if(type === 'RSVP') {
        return {
            fontFamily: state.settings.fontFamily,
            fontSize: state.settings.fontSizeRSVP,
            fontWidth: state.settings.fontWidthRSVP,
        }
    } else {
        return {
            fontFamily: state.settings.fontFamily,
            fontSize: state.settings.fontSizeReader,
            fontWidth: state.settings.fontWidthReader,
        }
    }
};

export default settingsSlice.reducer;