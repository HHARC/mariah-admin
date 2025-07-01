import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { testimonialsService } from '../../services';

const Testimonials = () => {
    // State for testimonials list
    const [testimonials, setTestimonials] = useState([]);

    // State for loading and error handling
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for form inputs
    const [formData, setFormData] = useState({
        name: '',
        designation: '',
        review: '',
        profile_image: null
    });

    // State to store preview URL for image
    const [imagePreview, setImagePreview] = useState(null);

    // State to track if we're editing and which testimonial
    const [editingId, setEditingId] = useState(null);

    // Fetch testimonials from API
    const fetchTestimonials = async () => {
        try {
            setLoading(true);
            const result = await testimonialsService.getAll();
            
            if (result.success) {
                setTestimonials(result.data);
                setError(null);
            } else {
                setError(result.error || 'Failed to fetch testimonials');
                setTestimonials([]);
            }
        } catch (err) {
            setError('Failed to fetch testimonials. Please try again later.');
            console.error('Error fetching testimonials:', err);
            setTestimonials([]);
        } finally {
            setLoading(false);
        }
    };

    // Load testimonials on component mount
    useEffect(() => {
        fetchTestimonials();
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
                profile_image: file
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
        submitData.append('designation', formData.designation);
        submitData.append('review', formData.review);

        if (formData.profile_image) {
            submitData.append('profile_image', formData.profile_image);
        }

        try {
            setLoading(true);
            let result;

            if (editingId) {
                // Update existing testimonial
                result = await testimonialsService.update(editingId, submitData);
            } else {
                // Add new testimonial
                result = await testimonialsService.create(submitData);
            }

            if (result.success) {
                // Refresh testimonials list
                fetchTestimonials();

                // Reset form
                setFormData({ name: '', designation: '', review: '', profile_image: null });
                setImagePreview(null);
                setEditingId(null);
                setError(null);
            } else {
                setError(result.error || 'Failed to save testimonial. Please try again.');
            }
        } catch (err) {
            setError('Failed to save testimonial. Please try again.');
            console.error('Error saving testimonial:', err);
        } finally {
            setLoading(false);
        }
    };

    // Handle edit button click
    const handleEdit = (testimonial) => {
        setFormData({
            name: testimonial.name,
            designation: testimonial.designation,
            review: testimonial.review,
            profile_image: null // We don't get the actual file back from API
        });

        // If testimonial has an image, set the preview
        if (testimonial.profile_image) {
            setImagePreview(testimonial.profile_image);
        } else {
            setImagePreview(null);
        }

        setEditingId(testimonial._id);
    };

    // Handle delete button click
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this testimonial?')) {
            try {
                setLoading(true);
                const result = await testimonialsService.delete(id);
                
                if (result.success) {
                    fetchTestimonials();
                    setError(null);
                } else {
                    setError(result.error || 'Failed to delete testimonial. Please try again.');
                }
            } catch (err) {
                setError('Failed to delete testimonial. Please try again.');
                console.error('Error deleting testimonial:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Testimonials</h2>

            {/* Display error message if any */}
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {/* Form for adding or editing testimonials */}
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
                            <label htmlFor="designation" className="form-label">Designation:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="designation"
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="review" className="form-label">Review:</label>
                            <textarea
                                className="form-control"
                                id="review"
                                name="review"
                                value={formData.review}
                                onChange={handleChange}
                                rows="3"
                                required
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="profileImage" className="form-label">Profile Image:</label>
                            <input
                                type="file"
                                className="form-control"
                                id="profileImage"
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
                                        className="img-thumbnail rounded-circle"
                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
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
                                editingId ? 'Update Testimonial' : 'Add Testimonial'
                            )}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                className="btn btn-outline-secondary ms-2"
                                onClick={() => {
                                    setFormData({ name: '', designation: '', review: '', profile_image: null });
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

            {/* List of testimonials */}
            <div className="card shadow-sm">
                <div className="card-header bg-light">
                    <h3 className="h5 mb-0">Current Testimonials</h3>
                </div>
                <div className="card-body">
                    {loading && !testimonials.length ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-2">Loading testimonials...</p>
                        </div>
                    ) : testimonials.length === 0 ? (
                        <p className="text-center text-muted">No testimonials available.</p>
                    ) : (
                        <div className="row">
                            {testimonials.map((testimonial) => (
                                <div key={testimonial._id} className="col-md-6 col-lg-4 mb-4">
                                    <div className="card h-100">
                                        <div className="card-body">
                                            <div className="d-flex align-items-center mb-3">
                                                <div>
                                                    {testimonial.profile_image ? (
                                                        <img
                                                            src={testimonial.profile_image}
                                                            alt={testimonial.name}
                                                            className="rounded-circle me-3"
                                                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                                        />
                                                    ) : (
                                                        <div
                                                            className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center me-3"
                                                            style={{ width: '60px', height: '60px' }}
                                                        >
                                                            {testimonial.name.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h5 className="card-title mb-0">{testimonial.name}</h5>
                                                    <p className="text-muted mb-0">{testimonial.designation}</p>
                                                </div>
                                            </div>
                                            <p className="card-text">"{testimonial.review}"</p>
                                        </div>
                                        <div className="card-footer d-flex justify-content-between">
                                            <button
                                                onClick={() => handleEdit(testimonial)}
                                                className="btn btn-sm btn-outline-primary"
                                                disabled={loading}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(testimonial._id)}
                                                className="btn btn-sm btn-outline-danger"
                                                disabled={loading}
                                            >
                                                Delete
                                            </button>
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

export default Testimonials;
