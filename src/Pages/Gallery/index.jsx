import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { api } from '../../utils/api';
import cloudinaryUpload from '../../utils/upload';

const Gallery = () => {
    // State for gallery items
    const [galleryItems, setGalleryItems] = useState([]);

    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [editingCategoryName, setEditingCategoryName] = useState('');

    // State for categories
    const [categories, setCategories] = useState([]);

    // State for loading and error handling
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for form inputs
    const [formData, setFormData] = useState({
        name: '',
        categoryId: '',
        image: null
    });

    const handleEditCategory = async () => {
        if (!editingCategoryName.trim()) {
            alert('Please enter a category name');
            return;
        }

        try {
            setLoading(true);
            await api.put(`${CATEGORIES_API_URL}/${editingCategoryId}`, { name: editingCategoryName });
            fetchCategories();
            setEditingCategoryId(null);
            setEditingCategoryName('');
        } catch (err) {
            setError('Failed to edit category. Please try again.');
            console.error('Error editing category:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                setLoading(true);
                await api.delete(`${CATEGORIES_API_URL}/${id}`);
                fetchCategories();
            } catch (err) {
                setError('Failed to delete category. Please try again.');
                console.error('Error deleting category:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    // State to store preview URL for image
    const [imagePreview, setImagePreview] = useState(null);

    // State to track if we're editing and which gallery item
    const [editingId, setEditingId] = useState(null);

    // State for new category name
    const [newCategoryName, setNewCategoryName] = useState('');

    // API endpoints
    const GALLERY_API_URL = 'api/gallery';
    const CATEGORIES_API_URL = 'api/categories';

    // Fetch gallery items from API
    const fetchGalleryItems = async () => {
        try {
            setLoading(true);
            const response = await api.get(GALLERY_API_URL);
            if (response.data && response.data.data && Array.isArray(response.data.data)) {
                setGalleryItems(response.data.data);
            } else {
                console.error('Unexpected API response format:', response.data);
                setError('Received unexpected data format from the server.');
                setGalleryItems([]);
            }
            setError(null);
        } catch (err) {
            setError('Failed to fetch gallery items. Please try again later.');
            console.error('Error fetching gallery items:', err);
            setGalleryItems([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch categories from API
    const fetchCategories = async () => {
        try {
            const response = await api.get(CATEGORIES_API_URL);
            if (response.data && response.data.data && Array.isArray(response.data.data)) {
                setCategories(response.data.data);
            } else {
                console.error('Unexpected API response format for categories:', response.data);
                setCategories([]);
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
            setCategories([]);
        }
    };

    // Load data on component mount
    useEffect(() => {
        fetchGalleryItems();
        fetchCategories();
    }, []);

    // Handle input changes for text fields
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

    // Handle category creation
    const handleCreateCategory = async () => {
        if (!newCategoryName.trim()) {
            alert('Please enter a category name');
            return;
        }

        try {
            setLoading(true);
            const response = await api.post(CATEGORIES_API_URL, { name: newCategoryName });
            if (response.data && response.data.data) {
                fetchCategories();
                // Set the newly created category as the selected one
                setFormData({
                    ...formData,
                    categoryId: response.data.data._id
                });
                setNewCategoryName('');
            }
        } catch (err) {
            setError('Failed to create category. Please try again.');
            console.error('Error creating category:', err);
        } finally {
            setLoading(false);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Create FormData object for file upload
        const submitData = new FormData();
        submitData.append('name', formData.name);

        try {
            setLoading(true);
            let imageUrl = ''

            if (formData.image) {
                imageUrl = await cloudinaryUpload(formData.image, { folder: 'gallery' });
                console.log(imageUrl)
                submitData.append('image', imageUrl);
            }

            if (editingId) {
                // Update existing gallery item
                await api.put(`${GALLERY_API_URL}/${editingId}`, submitData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } else {
                // Add new gallery item
                await api.post(GALLERY_API_URL, submitData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            }

            // Refresh gallery items list
            fetchGalleryItems();

            // Reset form
            setFormData({ name: '', categoryId: '', image: null });
            setImagePreview(null);
            setEditingId(null);

            setError(null);
        } catch (err) {
            setError('Failed to save gallery item. Please try again.');
            console.error('Error saving gallery item:', err);
        } finally {
            setLoading(false);
        }
    };

    // Handle edit button click
    const handleEdit = (item) => {
        setFormData({
            name: item.name,
            categoryId: item.categoryId || '',
            image: null
        });

        // If item has an image, set the preview
        if (item.image) {
            setImagePreview(item.image);
        } else {
            setImagePreview(null);
        }

        setEditingId(item._id);
    };

    // Handle delete button click
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this gallery item?')) {
            try {
                setLoading(true);
                await api.delete(`${GALLERY_API_URL}/${id}`);
                fetchGalleryItems();
            } catch (err) {
                setError('Failed to delete gallery item. Please try again.');
                console.error('Error deleting gallery item:', err);
            } finally {
                setLoading(false);
            }
        }
    };

    // Get category name by ID
    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat._id === categoryId);
        return category ? category.name : 'Unknown';
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Gallery Management</h2>

            {/* Display error message if any */}
            {error && (
                <div className="alert alert-danger" role="alert">
                    {error}
                </div>
            )}

            {/* Form for adding or editing gallery items */}
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">
                            <label className="form-label">Name:</label>
                            <div className="row">
                                <div className="col-md-8 mb-2">
                                    <select
                                        className="form-select"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map(category => (
                                            <option key={category._id} value={category.name}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="New category"
                                            value={newCategoryName}
                                            onChange={(e) => setNewCategoryName(e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            onClick={handleCreateCategory}
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Editable list of categories */}
                            <div className="mt-3">
                                <h6>Manage Categories:</h6>
                                <ul className="list-group">
                                    {categories.map(cat => (
                                        <li key={cat._id} className="list-group-item d-flex justify-content-between align-items-center">
                                            {editingCategoryId === cat._id ? (
                                                <>
                                                    <input
                                                        type="text"
                                                        className="form-control me-2"
                                                        value={editingCategoryName}
                                                        onChange={(e) => setEditingCategoryName(e.target.value)}
                                                    />
                                                    <button className="btn btn-sm btn-success me-1" onClick={handleEditCategory}>
                                                        Save
                                                    </button>
                                                    <button className="btn btn-sm btn-secondary" onClick={() => {
                                                        setEditingCategoryId(null);
                                                        setEditingCategoryName('');
                                                    }}>
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <span>{cat.name}</span>
                                                    <div>
                                                        <button
                                                            className="btn btn-sm btn-outline-primary me-2"
                                                            onClick={() => {
                                                                setEditingCategoryId(cat._id);
                                                                setEditingCategoryName(cat.name);
                                                            }}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => handleDeleteCategory(cat._id)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>





                        <div className="mb-3">
                            <label htmlFor="galleryImage" className="form-label">Upload Image:</label>
                            <input
                                type="file"
                                className="form-control"
                                id="galleryImage"
                                accept="image/*,video/*"
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
                                editingId ? 'Update Gallery Item' : 'Add Gallery Item'
                            )}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                className="btn btn-outline-secondary ms-2"
                                onClick={() => {
                                    setFormData({ name: '', categoryId: '', image: null });
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

            {/* Gallery items list */}
            <div className="card shadow-sm">
                <div className="card-header bg-light">
                    <h3 className="h5 mb-0">Gallery Items</h3>
                </div>
                <div className="card-body">
                    {loading && !galleryItems.length ? (
                        <div className="text-center py-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                            <p className="mt-2">Loading gallery items...</p>
                        </div>
                    ) : galleryItems.length === 0 ? (
                        <p className="text-center text-muted">No gallery items available.</p>
                    ) : (
                        <div className="row">
                            {galleryItems.map((item) => (
                                <div key={item._id} className="col-md-4 mb-4">
                                    <div className="card h-100">
                                        <div className="card-header">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <h5 className="card-title mb-0">{item.name}</h5>
                                                {item.categoryId && (
                                                    <span className="badge bg-info">
                                                        {getCategoryName(item.categoryId)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="card-body text-center">
                                            {item.image ? (
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="img-fluid rounded"
                                                    style={{ height: '200px', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <div className="p-4 bg-light rounded">
                                                    <p className="text-muted">No image uploaded</p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="card-footer d-flex justify-content-between">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="btn btn-sm btn-outline-primary"
                                                disabled={loading}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item._id)}
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



export default Gallery;
