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
            if (store.user_id) {
                const user = await actions.getUser(store.user_id);
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
            const updatedUser = await actions.updateUser(store.user_id, formData);
            if (updatedUser) {
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
                const success = await actions.deleteUser(store.user_id);
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
            <h2>Mi Perfil</h2>
            {!editMode ? (
                <>
                    <p><strong>Nombre:</strong> {store.user.name}</p>
                    <p><strong>Email:</strong> {store.user.email}</p>
                    <p><strong>Rol:</strong> {store.user.rol}</p>
                    {store.user.image && <img src={store.user.image} alt="Profile" />}
                    <button onClick={() => setEditMode(true)}>Editar Perfil</button>
                    <button onClick={handleDelete}>Eliminar Perfil</button>
                </>
            ) : (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Nombre:</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                        />
                    </div>
                    <div>
                        <label>Rol:</label>
                        <input 
                            type="text" 
                            name="rol" 
                            value={formData.rol} 
                            onChange={handleChange} 
                        />
                    </div>
                    <div>
                        <label>Imagen URL:</label>
                        <input 
                            type="text" 
                            name="image" 
                            value={formData.image} 
                            onChange={handleChange} 
                        />
                    </div>
                    <button type="submit">Guardar</button>
                    <button type="button" onClick={() => setEditMode(false)}>Cancelar</button>
                </form>
            )}
        </div>
    );
};

export default UserProfile;
