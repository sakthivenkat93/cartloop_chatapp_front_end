import { createSlice } from '@reduxjs/toolkit'

export const messageSlice = createSlice({
  name: 'message',
  initialState: {
    value: [{}],
    currentMessage: ""
  },
  reducers: {
    setMessages: (state, action) => {
        state.value.push(action.payload);
    },
    setCurrentMessage: (state, action) => {
        state.currentMessage = action.payload;
    }
  }
})

// Action creators are generated for each case reducer function
export const { setMessages, setCurrentMessage } = messageSlice.actions

export default messageSlice.reducer