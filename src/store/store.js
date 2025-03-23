import { configureStore, createSlice, createEntityAdapter } from '@reduxjs/toolkit';

const usersAdapter = createEntityAdapter({
    selectId: (user) => user.id,
    sortComparer: (a, b) => a.id - b.id
});

const usersSlice = createSlice({
    name: 'users',
    initialState: usersAdapter.getInitialState(),
    reducers: {
        usersLoaded: usersAdapter.setAll,
        userUpdated: usersAdapter.updateOne,
        usersAdded: {
            reducer: (state, action) => {
                usersAdapter.addMany(state, action.payload);
            },
            prepare: (users) => ({
                payload: users.map(user => ({
                    ...user,
                    createdAt: Date.now()
                }))
            })
        },
        usersRemoved: usersAdapter.removeMany
    }
});

export const {
    selectAll: selectAllUsers,
    selectById: selectUserById,
    selectIds: selectUserIds
} = usersAdapter.getSelectors(state => state.users);

export const { usersLoaded, userUpdated, usersAdded, usersRemoved } = usersSlice.actions;

export default configureStore({
    reducer: {
        users: usersSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
            immutableCheck: false
        }).concat(
            store => next => action => {
                if (action.type === 'users/executeMutation') {
                    performance.mark('startUpdate');
                }
                const result = next(action);
                if (action.type === 'users/executeMutation') {
                    performance.mark('endUpdate');
                    performance.measure('Update duration', 'startUpdate', 'endUpdate');
                }
                return result;
            }
        )
});