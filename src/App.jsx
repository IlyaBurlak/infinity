import React, { useEffect, useCallback, useState, useRef, useReducer } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FixedSizeList } from 'react-window';
import { usersAdded, usersRemoved } from './store/store';
import UserEditor from './components/UserEditor';
import UserCard from './components/UserCard';
import './App.css';

const worker = new Worker(new URL('./utils/worker.js', import.meta.url), { type: 'module' });

function App() {
    const dispatch = useDispatch();
    const { ids } = useSelector(state => state.users);
    const [selectedId, setSelectedId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const listRef = useRef(null);
    const totalUsers = 1000000;
    const chunkSize = 50000;

    const [, forceUpdate] = useReducer(x => x + 1, 0);

    useEffect(() => {
        worker.onmessage = (event) => {
            console.log('Received chunk:', event.data.length);
            dispatch(usersAdded(event.data));
            forceUpdate();
            setIsLoading(false);
        };

        worker.postMessage({ total: totalUsers, chunkSize });
    }, [dispatch]);

    useEffect(() => {
        console.log('Total users:', ids.length);
    }, [ids.length]);

    const handleScroll = useCallback(() => {
        if (listRef.current) {
            const { scrollHeight, clientHeight, scrollTop } = listRef.current;
            const isNearBottom = scrollHeight - (scrollTop + clientHeight) <= 100;

            if (isNearBottom && !isLoading && ids.length < totalUsers) {
                setIsLoading(true);
                worker.postMessage({ total: totalUsers, chunkSize });
            }

            if (ids.length > totalUsers) {
                const visibleUserCount = Math.ceil(clientHeight / 250);
                const idsToRemove = ids.slice(0, ids.length - visibleUserCount);
                dispatch(usersRemoved(idsToRemove));
            }
        }
    }, [isLoading, ids.length, totalUsers, dispatch]);

    const Row = useCallback(({ index, style }) => (
        <div style={{
            ...style,
            transition: 'opacity 0.3s ease-in-out',
            opacity: 1
        }}>
            <UserCard
                userId={ids[index]}
                onClick={setSelectedId}
                isActive={selectedId === ids[index]}
            />
        </div>
    ), [ids, selectedId]);

    return (
        <div className="app">
            <div className="user-list-container">
                <FixedSizeList
                    ref={listRef}
                    height={window.innerHeight}
                    width={400}
                    itemSize={250}
                    itemCount={ids.length}
                    overscanCount={150}
                    onScroll={handleScroll}
                >
                    {Row}
                </FixedSizeList>
                {isLoading && <div className="loading-spinner">Loading...</div>}
            </div>
            {selectedId && <UserEditor userId={selectedId} />}
        </div>
    );
}

export default React.memo(App);