
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from 'store';

interface SettingsState {
    fontFamily: string;
    fontSizeRSVP: number;
    fontSizeReader: number;
}

const initialState: SettingsState = {
    fontFamily: '',
    fontSizeRSVP: 42,
    fontSizeReader: 16,
} as const;

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setValue: (state, action: PayloadAction<{ key: keyof SettingsState, value: SettingsState[typeof key] }>) => {
            const { key, value } = action.payload;
            state[key] = value;
        }
    },
})

export const {
    setValue,
} = settingsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectSettings = (state: RootState) => state;

export default settingsSlice.reducer;