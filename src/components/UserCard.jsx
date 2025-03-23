import React from 'react';
import { useSelector } from 'react-redux';
import { shallowEqual } from 'react-redux';

const UserCard = React.memo(({ userId, onClick, isActive }) => {
        const user = useSelector(state => state.users.entities[userId], shallowEqual);

        return (
            <div
                className={`user-card ${isActive ? 'active' : ''}`}
                onClick={() => onClick(userId)}
                data-testid="user-card"
            >
                <div className="user-info-header">Full Name</div>
                <h3>{user.firstName} {user.lastName}</h3>

                <div className="user-info-header">Age</div>
                <p className="user-info-value">{user.age}</p>

                <div className="user-info-header">Email</div>
                <p className="user-info-value">{user.email}</p>
            </div>
        );
    }, (prev, next) =>
        prev.userId === next.userId &&
        prev.isActive === next.isActive
);

export default UserCard;