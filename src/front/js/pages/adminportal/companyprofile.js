import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Context } from '../../store/appContext';

const CompanyProfile = () => {
    const navigate = useNavigate();
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
            const comp_id = sessionStorage.getItem('company_id');
            if (comp_id) {
                const company = await actions.getCompany(comp_id);
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
        try {
            const updatedCompany = await actions.updateCompany(sessionStorage.getItem('company_id'), formData);
            if (updatedCompany) {
                setEditMode(false);
            }
        } catch (error) {
            console.error('Error updating company:', error);
        }
    };

    const handleDelete = async () => {
        const confirmed = window.confirm('Are you sure you want to delete this company? This action cannot be undone.');
        if (confirmed) {
            try {
                const success = await actions.deleteCompanyWithDependencies(sessionStorage.getItem('company_id'));
                if (success) {
                    setDeleteSuccess(true);
                    await actions.logout();
                    navigate('/login');
                }
            } catch (error) {
                console.error('Error deleting company:', error);
            }
        }
    };

    if (deleteSuccess) return <div>Company profile deleted successfully. Redirecting...</div>;

    if (!sessionStorage.getItem('company_id')) return <div>Loading...</div>;

    return (
        <div className="card mt-4">
            <div className="card-body">
                <h2>Company Profile</h2>
                {!editMode ? (
                    <>
                        <p><strong>Name:</strong> {formData.name}</p>
                        <p><strong>Location:</strong> {formData.location}</p>
                        <p><strong>Owner:</strong> {formData.owner}</p>
                        {formData.image && <img src={formData.image} alt="Company Logo" className="img-fluid" />}
                        <button className="btn btn-outline-primary me-2 btnwid" onClick={() => setEditMode(true)}>Edit Profile</button>
                        <button className="btn btn-outline-danger btnwid" onClick={handleDelete}>Delete Company</button>
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
                            <label className="form-label">Location:</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>
                        <button type="submit" className="btn btn-outline-primary me-2">Save</button>
                        <button type="button" className="btn btn-outline-danger" onClick={() => setEditMode(false)}>Cancel</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default CompanyProfile;
