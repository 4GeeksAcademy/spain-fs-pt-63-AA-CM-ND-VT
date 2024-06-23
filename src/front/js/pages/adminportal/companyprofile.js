import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import { Context } from '../../store/appContext';

const CompanyProfile = () => {
    const navigate = useNavigate(); // Inicializa useNavigate
    const { store, actions } = useContext(Context);
    const [editMode, setEditMode] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
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
                if (company) {
                    setFormData({
                        name: company[0].name,
                        location: company[0].location,
                        owner: company[0].owner,
                        image: company[0].image
                    });
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

    const handleDelete = async () => {
        const confirmed = window.confirm('Are you sure you want to delete this company? This action cannot be undone.');
        if (confirmed) {
            try {
                const success = await actions.deleteCompanyWithDependencies(store.company_id);
                if (success) {
                    setDeleteSuccess(true);
                    navigate('/login'); // Navega al usuario a /login después de eliminar
                }
            } catch (error) {
                console.error('Error deleting company:', error);
            }
        }
    };

    if (deleteSuccess) return <div>Company profile deleted successfully. Redirecting...</div>;

    if (!store.company) return <div>Loading...</div>;

    return (
        <div className="card mt-4">
            <div className="card-body">
                <h2>Perfil de la Compañía</h2>
                {!editMode ? (
                    <>
                        <p><strong>Nombre:</strong> {formData.name}</p>
                        <p><strong>Ubicación:</strong> {formData.location}</p>
                        <p><strong>Dueño:</strong> {formData.owner}</p>
                        {formData.image && <img src={formData.image} alt="Company Logo" className="img-fluid" />}
                        <button className="btn btn-outline-primary me-2" onClick={() => setEditMode(true)}>Editar Perfil</button>
                        <button className="btn btn-outline-danger" onClick={handleDelete}>Delete Company</button>
                    </>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Nombre:</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Ubicación:</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Dueño:</label>
                            <input
                                type="text"
                                name="owner"
                                value={formData.owner}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Logo URL:</label>
                            <input
                                type="text"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                        <button type="submit" className="btn btn-outline-primary me-2">Guardar</button>
                        <button type="button" className="btn btn-outline-secondary" onClick={() => setEditMode(false)}>Cancelar</button>
                    </form>
                )}
            </div>
        </div>

    );
};

export default CompanyProfile;
