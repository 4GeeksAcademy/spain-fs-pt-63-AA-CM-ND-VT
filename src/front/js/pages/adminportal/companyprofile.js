import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../../store/appContext';

const CompanyProfile = () => {
    const { store, actions } = useContext(Context);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        owner: '',
        logo: ''
    });

    useEffect(() => {
        const fetchCompanyData = async () => {
            const company = await actions.getCompany(store.company_id);
            if (company) {
                setFormData({
                    name: company.name,
                    email: company.email,
                    owner: company.owner,
                    logo: company.logo
                });
            }
        };
        fetchCompanyData();
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
        const updatedCompany = await actions.updateCompany(store.company_id, formData);
        if (updatedCompany) {
            setEditMode(false);
        }
    };

    if (!store.company) return <div>Loading...</div>;

    return (
        <div>
            <h2>Perfil de la Compañía</h2>
            {!editMode ? (
                <>
                    <p><strong>Nombre:</strong> {store.company.name}</p>
                    <p><strong>Email:</strong> {store.company.email}</p>
                    <p><strong>Dueño:</strong> {store.company.owner}</p>
                    {store.company.logo && <img src={store.company.logo} alt="Company Logo" />}
                    <button onClick={() => setEditMode(true)}>Editar Perfil</button>
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
                        <label>Dueño:</label>
                        <input 
                            type="text" 
                            name="owner" 
                            value={formData.owner} 
                            onChange={handleChange} 
                        />
                    </div>
                    <div>
                        <label>Logo URL:</label>
                        <input 
                            type="text" 
                            name="logo" 
                            value={formData.logo} 
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

export default CompanyProfile;

