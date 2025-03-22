import { configureStore, createSlice, createEntityAdapter } from '@reduxjs/toolkit'

const usersAdapter = createEntityAdapter()

const usersSlice = createSlice({
    name: 'users',
    initialState: usersAdapter.getInitialState(),
    reducers: {
        usersLoaded: usersAdapter.setAll,
        userUpdated: usersAdapter.updateOne,
        usersAdded: usersAdapter.addMany
    }
})

export const {
    selectAll: selectAllUsers,
    selectById: selectUserById
} = usersAdapter.getSelectors(state => state.users)

export const { usersLoaded, userUpdated, usersAdded } = usersSlice.actions

export default configureStore({
    reducer: {
        users: usersSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
            immutableCheck: { warnAfter: 100 }
        })
})