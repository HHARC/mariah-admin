import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { api } from '../../utils/api';

const SubServices = () => {
    const [subServices, setSubServices] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        image: null,
        serviceId: ''
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [editingId, setEditingId] = useState(null);

    const [selectedServiceFilter, setSelectedServiceFilter] = useState('');

    const SUB_SERVICES_API_URL = 'api/sub-services';
    const SERVICES_API_URL = 'api/services';

    useEffect(() => {
        fetchSubServices();
        fetchServices();
    }, []);

    const fetchSubServices = async () => {
        try {
            setLoading(true);
            const response = await api.get(SUB_SERVICES_API_URL);
            if (response.data?.data && Array.isArray(response.data.data)) {
                setSubServices(response.data.data);
            } else {
                setError('Unexpected API response format.');
                setSubServices([]);
            }
            setError(null);
        } catch (err) {
            setError('Failed to fetch sub-services.');
            setSubServices([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchServices = async () => {
        try {
            const response = await api.get(SERVICES_API_URL);
            if (response.data?.data && Array.isArray(response.data.data)) {
                setServices(response.data.data);
            } else {
                setServices([]);
            }
        } catch (err) {
            setServices([]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submitData = new FormData();
        submitData.append('name', formData.name);
        submitData.append('description', formData.description);
        submitData.append('price', formData.price);
        if (formData.serviceId) submitData.append('serviceId', formData.serviceId);
        if (formData.image) submitData.append('image', formData.image);

        try {
            setLoading(true);
            if (editingId) {
                await api.put(`${SUB_SERVICES_API_URL}/${editingId}`, submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post(SUB_SERVICES_API_URL, submitData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            fetchSubServices();
            setFormData({ name: '', description: '', price: '', image: null, serviceId: '' });
            setImagePreview(null);
            setEditingId(null);
            setError(null);
        } catch (err) {
            setError('Failed to save sub-service.');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (subservice) => {
        setFormData({
            name: subservice.name || '',
            description: subservice.description || '',
            price: subservice.price?.toString() || '',
            image: null,
            serviceId: subservice.serviceId || ''
        });
        setImagePreview(subservice.image || null);
        setEditingId(subservice._id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this sub-service?')) {
            try {
                setLoading(true);
                await api.delete(`${SUB_SERVICES_API_URL}/${id}`);
                fetchSubServices();
            } catch {
                setError('Failed to delete sub-service.');
            } finally {
                setLoading(false);
            }
        }
    };

    const formatPrice = (price) => {
        return price ? `$${parseFloat(price).toFixed(2)}` : 'Price not set';
    };

    const getServiceName = (serviceId) => {
        const service = services.find(s => s._id === serviceId);
        return service ? service.name : 'Unknown service';
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Sub Services</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name:</label>
                            <input type="text" className="form-control" id="name" name="name" value={formData.name} onChange={handleChange} required />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Description:</label>
                            <textarea className="form-control" id="description" name="description" rows="3" value={formData.description} onChange={handleChange} required />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="price" className="form-label">Price ($):</label>
                            <input type="number" className="form-control" id="price" name="price" value={formData.price} onChange={handleChange} step="0.01" min="0" required />
                        </div>

                        {services.length > 0 && (
                            <div className="mb-3">
                                <label htmlFor="serviceId" className="form-label">Parent Service:</label>
                                <select className="form-select" id="serviceId" name="serviceId" value={formData.serviceId} onChange={handleChange}>
                                    <option value="">Select a parent service</option>
                                    {services.map(service => (
                                        <option key={service._id} value={service._id}>{service.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="mb-3">
                            <label htmlFor="subServiceImage" className="form-label">Image:</label>
                            <input type="file" className="form-control" id="subServiceImage" accept="image/*" onChange={handleImageChange} required={!editingId} />
                            {imagePreview && (
                                <div className="mt-2">
                                    <p>Image Preview:</p>
                                    <img src={imagePreview} alt="Preview" className="img-thumbnail" style={{ maxHeight: '150px' }} />
                                </div>
                            )}
                        </div>

                        <button type="submit" className={`btn ${editingId ? 'btn-success' : 'btn-primary'}`} disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    {editingId ? 'Updating...' : 'Adding...'}
                                </>
                            ) : editingId ? 'Update Sub Service' : 'Add Sub Service'}
                        </button>

                        {editingId && (
                            <button type="button" className="btn btn-outline-secondary ms-2" onClick={() => {
                                setFormData({ name: '', description: '', price: '', image: null, serviceId: '' });
                                setImagePreview(null);
                                setEditingId(null);
                            }}>
                                Cancel Edit
                            </button>
                        )}
                    </form>
                </div>
            </div>

            {/* 🔍 Filter by parent service */}
            <div className="mb-4">
                <label htmlFor="filterService" className="form-label">Filter by Parent Service:</label>
                <select
                    className="form-select"
                    id="filterService"
                    value={selectedServiceFilter}
                    onChange={(e) => setSelectedServiceFilter(e.target.value)}
                >
                    <option value="">All Services</option>
                    {services.map(service => (
                        <option key={service._id} value={service._id}>
                            {service.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="card shadow-sm">
                <div className="card-header bg-light">
                    <h3 className="h5 mb-0">Current Sub Services</h3>
                </div>
                <div className="card-body">
                    {loading && !subServices.length ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary"></div>
                            <p className="mt-2">Loading sub-services...</p>
                        </div>
                    ) : subServices.length === 0 ? (
                        <p className="text-center text-muted">No sub-services available.</p>
                    ) : (
                        <div className="row">
                            {subServices
                                .filter(sub => !selectedServiceFilter || sub.serviceId === selectedServiceFilter)
                                .map((subservice) => (
                                    <div key={subservice._id} className="col-md-6 col-lg-4 mb-4">
                                        <div className="card h-100">
                                            {subservice.image && (
                                                <img src={subservice.image} alt={subservice.name} className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} />
                                            )}
                                            <div className="card-body">
                                                <h5 className="card-title">{subservice.name}</h5>
                                                {subservice.description && (
                                                    <p className="card-text">{subservice.description}</p>
                                                )}
                                                <p className="card-text">
                                                    <span className="badge bg-primary me-2">{formatPrice(subservice.price)}</span>
                                                    {subservice.serviceId && (
                                                        <span className="badge bg-secondary">{getServiceName(subservice.serviceId)}</span>
                                                    )}
                                                </p>
                                            </div>
                                            <div className="card-footer d-flex justify-content-between">
                                                <button onClick={() => handleEdit(subservice)} className="btn btn-sm btn-outline-primary" disabled={loading}>Edit</button>
                                                <button onClick={() => handleDelete(subservice._id)} className="btn btn-sm btn-outline-danger" disabled={loading}>Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SubServices;
