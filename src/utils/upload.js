import axios from 'axios';

const cloudinaryUpload = async (
    file,
    { folder = '' } = {}
) => {
    const CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const preset = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', "react-upload-v1");
    formData.append('folder', folder);

    try {
        const response = await axios.post(
            `https://api.cloudinary.com/v1_1/dpo9vd7te/upload`,
            formData
        );
        return response.data.secure_url; // Returns the URL of the uploaded file as a promise
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload to Cloudinary');
    }
};

export default cloudinaryUpload;

