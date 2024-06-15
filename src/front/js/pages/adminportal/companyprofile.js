import React, { useState, useEffect, useContext } from 'react';
import { Context } from '../../store/appContext';

const CompanyProfile = () => {
    const { store, actions } = useContext(Context);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        owner: '',
        image: ''
    });

    useEffect(() => {
        const fetchCompanyData = async () => {
            if (store.company_id) {
                const company = await actions.getCompany(store.company_id);
                console.log("company a ver?", company);
                if (company) {
                    setFormData({
                        name: company[0].name,
                        location: company[0].location,
                        owner: company[0].owner,
                        image: company[0].image
                    });
                    console.log("a ver si funciona ", formData);
                }
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
                    <p><strong>Nombre:</strong> {formData.name}</p>
                    <p><strong>Ubicación:</strong> {formData.location}</p>
                    <p><strong>Dueño:</strong> {formData.owner}</p>
                    {formData.image && <img src={formData.image} alt="Company Logo" />}
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
                        <label>Ubicación:</label>
                        <input 
                            type="text" 
                            name="location" 
                            value={formData.location} 
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

export default CompanyProfile;
