import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { api } from '../../utils/api';

const Services = () => {
    // State for services list
    const [services, setServices] = useState([]);

    // State for loading and error handling
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for form inputs
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: null
    });

    // State to store preview URL for image
    const [imagePreview, setImagePreview] = useState(null);

    // State to track if we're editing and which service
    const [editingId, setEditingId] = useState(null);

    // State to track expanded service for showing subservices
    const [expandedServiceId, setExpandedServiceId] = useState(null);

    // API endpoint
    const API_URL = 'api/services';

    // Fetch services from API
    const fetchServices = async () => {
        try {
            setLoading(true);
            const response = await api.get(API_URL);
            // Access the data array inside the response
            if (response.data && response.data.data && Array.isArray(response.data.data)) {
                setServices(response.data.data);
            } else {
                console.error('Unexpected API response format:', response.data);
                setError('Received unexpected data format from the server.');
                setServices([]);
            }
            setError(null);
        } catch (err) {
            setError('Failed to fetch services. Please try again later.');
            console.error('Error fetching services:', err);
            setServices([]);
        } finally {
            setLoading(false);
        }
    };

    // Load services on component mount
    useEffect(() => {
        fetchServices();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle image input change
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                image: file
            });

            // Create a preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create FormData object for file upload
        const submitData = new FormData();
        submitData.append('name', formData.name);
        submitData.append('description', formData.description);

        if (formData.image) {
            submitData.append('image', formData.image);
        }

        try {
            setLoading(true);

            if (editingId) {
                // Update existing service
                await api.put(`${API_URL}/${editingId}`, submitData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                // Add new service
                await api.post(API_URL, submitData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            // Refresh services list
            fetchServices();

            // Reset form
            setFormData({ name: '', description: '', image: null });
            setImagePreview(null);
            setEditingId(null);

            setError(null);
        } catch (err) {
            setError('Failed to save service. Please try again.');
            console.error('Error saving service:', err);
        } finally {
            setLoading(false);
        }
    };

    // Handle edit button click
    const handleEdit = (service) => {
        setFormData({
            name: service.name,
            description: service.description,
            image: null // We don't get the actual file back from API
        });

        // If service has an image, set the preview
        if (service.image) {
            setImagePreview(service.image);
        } else {
            setImagePreview(null);
        }

        setEditingId(service._id);
    };

    // Handle delete button click
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this service?')) {
            try {
                setLoading(true);
                await api.delete(`${API_URL}/${id}`);
                fetchServices();
            } catch (err) {
                setError('Failed to delete service. Please try again.');
                console.error('Error deleting service:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    // Toggle expanded service to show/hide subservices
    const toggleExpandService = (id) => {
        if (expandedServiceId === id) {
            setExpandedServiceId(null);
        } else {
            setExpandedServiceId(id);
        }
    };

    // Format price with currency symbol
    const formatPrice = (price) => {
        if (!price) return 'Price not set';
        return `$${parseFloat(price).toFixed(2)}`;
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Services</h2>

            {/* Display error message if any */}
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {/* Form for adding or editing services */}
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Name:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="description" className="form-label">Description:</label>
                            <textarea
                                className="form-control"
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="serviceImage" className="form-label">Service Image:</label>
                            <input
                                type="file"
                                className="form-control"
                                id="serviceImage"
                                accept="image/*"
                                onChange={handleImageChange}
                                required={!editingId}
                            />
                            {imagePreview && (
                                <div className="mt-2">
                                    <p>Image Preview:</p>
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="img-thumbnail"
                                        style={{ maxHeight: '150px' }}
                                    />
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className={`btn ${editingId ? 'btn-success' : 'btn-primary'}`}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    {editingId ? 'Updating...' : 'Adding...'}
                                </>
                            ) : (
                                editingId ? 'Update Service' : 'Add Service'
                            )}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                className="btn btn-outline-secondary ms-2"
                                onClick={() => {
                                    setFormData({ name: '', description: '', image: null });
                                    setImagePreview(null);
                                    setEditingId(null);
                                }}
                            >
                                Cancel Edit
                            </button>
                        )}
                    </form>
                </div>
            </div>

            {/* List of services */}
            <div className="card shadow-sm">
                <div className="card-header bg-light">
                    <h3 className="h5 mb-0">Current Services</h3>
                </div>
                <div className="card-body">
                    {loading && !services.length ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-2">Loading services...</p>
                        </div>
                    ) : services.length === 0 ? (
                        <p className="text-center text-muted">No services available.</p>
                    ) : (
                        services.map((service) => (
                            <div key={service._id} className="card mb-4">
                                <div className="card-body">
                                    <div className="row align-items-center">
                                        {service.image && (
                                            <div className="col-md-3">
                                                <img
                                                    src={service.image}
                                                    alt={service.name}
                                                    className="img-fluid rounded"
                                                    style={{ maxHeight: '150px' }}
                                                />
                                            </div>
                                        )}
                                        <div className={service.image ? "col-md-5" : "col-md-8"}>
                                            <h4 className="card-title h5">{service.name}</h4>
                                            <p className="card-text text-muted">{service.description}</p>
                                            {service.subServices && service.subServices.length > 0 && (
                                                <p className="card-text">
                                                    <span className="badge bg-info">
                                                        {service.subServices.length} Sub-Services
                                                    </span>
                                                </p>
                                            )}
                                        </div>
                                        <div className="col-md-4 text-md-end mt-3 mt-md-0">
                                            <button
                                                onClick={() => handleEdit(service)}
                                                className="btn btn-outline-primary me-2"
                                                disabled={loading}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(service._id)}
                                                className="btn btn-outline-danger me-2"
                                                disabled={loading}
                                            >
                                                Delete
                                            </button>
                                            {service.subServices && service.subServices.length > 0 && (
                                                <button
                                                    onClick={() => toggleExpandService(service._id)}
                                                    className="btn btn-outline-info"
                                                >
                                                    {expandedServiceId === service._id ? 'Hide Sub-Services' : 'Show Sub-Services'}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Sub-services section, shown when expanded */}
                                    {expandedServiceId === service._id && service.subServices && service.subServices.length > 0 && (
                                        <div className="mt-4">
                                            <hr />
                                            <h5>Sub-Services</h5>
                                            <div className="row mt-3">
                                                {service.subServices.map(subService => (
                                                    <div key={subService._id} className="col-md-6 col-lg-4 mb-3">
                                                        <div className="card h-100">
                                                            {subService.image && (
                                                                <img
                                                                    src={subService.image}
                                                                    alt={subService.name}
                                                                    className="card-img-top"
                                                                    style={{ height: '150px', objectFit: 'cover' }}
                                                                />
                                                            )}
                                                            <div className="card-body">
                                                                <h6 className="card-title">{subService.name}</h6>
                                                                {subService.description && (
                                                                    <p className="card-text small">{subService.description}</p>
                                                                )}
                                                                {subService.price && (
                                                                    <p className="card-text">
                                                                        <span className="badge bg-primary">
                                                                            {formatPrice(subService.price)}
                                                                        </span>
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Services;
