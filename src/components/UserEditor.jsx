import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userUpdated, selectUserById } from '../store/store';

const UserEditor = React.memo(({ userId }) => {
    const user = useSelector(state => selectUserById(state, userId));
    const dispatch = useDispatch();
    const [formData, setFormData] = useState(user);
    const [showNotification, setShowNotification] = useState(false);

    useEffect(() => {
        setFormData(user);
    }, [user]);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = e => {
        e.preventDefault();
        dispatch(userUpdated({
            id: userId,
            changes: formData
        }));
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 1500);
    };

    return (
        <div className="editor-panel">
            {showNotification && (
                <div className="save-notification" data-testid="save-notification">
                    Changes saved successfully!
                </div>
            )}

            <form className="editor" onSubmit={handleSubmit}>
                <h2>Edit User Profile</h2>

                <div className="form-grid">
                    <label>
                        First Name
                        <input
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Last Name
                        <input
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </label>

                    <label>
                        Age
                        <input
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={handleChange}
                            min="18"
                            max="100"
                        />
                    </label>

                    <label>
                        Email
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </label>
                </div>

                <button type="submit" data-testid="save-button">
                    Save Changes
                </button>
            </form>
        </div>
    )
});

export default UserEditor;