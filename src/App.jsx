import React, { useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FixedSizeList } from 'react-window'
import { usersAdded, usersLoaded } from './store/store'
import { generateUsers } from './utils/generateUsers'
import UserEditor from './components/UserEditor'
import './App.css'
import UserCard from "./components/UserCard";

function App() {
    const dispatch = useDispatch()
    const { ids } = useSelector(state => state.users)
    const [selectedId, setSelectedId] = React.useState(null)

    useEffect(() => {
        const loadUsers = async () => {
            const generator = generateUsers(1000000)
            for await (const chunk of generator) {
                dispatch(usersAdded(chunk))
            }
        }
        loadUsers()
    }, [dispatch])

    const Row = useCallback(({ index, style }) => (
        <div style={style}>
            <UserCard
                userId={ids[index]}
                onClick={setSelectedId}
                isActive={selectedId === ids[index]}
            />
        </div>
    ), [ids, selectedId])

    return (
        <div className="app">
            <div className="user-list-container">
                <FixedSizeList
                    height={window.innerHeight}
                    width={400}
                    itemSize={250}
                    itemCount={ids.length}
                    overscanCount={5}
                >
                    {Row}
                </FixedSizeList>
            </div>

            {selectedId && <UserEditor userId={selectedId} />}
        </div>
    )
}

export default React.memo(App)