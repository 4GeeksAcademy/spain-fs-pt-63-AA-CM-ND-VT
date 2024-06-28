import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../../store/appContext';

const UserProfile = () => {
    const { store, actions } = useContext(Context);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        rol: '',
        image: ''
    });
    const [deleteSuccess, setDeleteSuccess] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            if (sessionStorage.getItem('user_id')) {
                const user = await actions.getUser(sessionStorage.getItem('user_id'));
                if (user) {
                    setFormData({
                        name: user.name,
                        email: user.email,
                        rol: user.rol,
                        image: user.image
                    });
                }
            }
        };
        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedUser = await actions.updateUser(sessionStorage.getItem('user_id'), formData);
            if (updatedUser) {
                await actions.getUser(sessionStorage.getItem('user_id'));
                setEditMode(false);
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm('Are you sure you want to delete your profile? This action cannot be undone.');
        if (confirmed) {
            try {
                const success = await actions.deleteUser(sessionStorage.getItem('user_id'));
                if (success) {
                    setDeleteSuccess(true);
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    if (!store.user) return <div>Loading...</div>;

    if (deleteSuccess) return <div>User profile deleted successfully.</div>;

    return (
        <div>
            <div className="card mt-4">
                <div className="card-body">
                    <h2 className='text-center'>My Profile</h2>
                    {!editMode ? (
                        <>
                            <p><strong>Name:</strong> {store.user.name}</p>
                            <p><strong>Email:</strong> {store.user.email}</p>
                            {store.user.image && <img src={store.user.image} alt="Profile" className="img-fluid" />}
                            <button className="btn btn-outline-primary me-2" onClick={() => setEditMode(true)}>Edit Profile</button>
                            <button className="btn btn-outline-danger" onClick={handleDelete}>Delete Profile</button>
                        </>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email:</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="form-control"
                                />
                            </div>
                            <button type="submit" className="btn btn-outline-primary me-2 btnwid">Save</button>
                            <button type="button" className="btn btn-outline-danger btnwid" onClick={() => setEditMode(false)}>Cancel</button>
                        </form>
                    )}
                </div>
            </div>

        </div>
    );
};

export default UserProfile;
