import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import productService from '../services/productService';

const AddProductPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: 'PAINTING',
    images: [],
    stock: 1,
    status: 'ACTIVE',
    tags: '',
    dimensions: {
      width: '',
      height: '',
      unit: 'cm',
    },
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadingImages, setUploadingImages] = useState(false);


  const categories = ['PAINTING', 'SCULPTURE', 'DIGITAL', 'PHOTOGRAPHY', 'OTHER'];

  // Check if user is seller
  if (user?.role !== 'SELLER' && user?.role !== 'BOTH') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600 mb-6">
            Only sellers can add products
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      dimensions: {
        ...prev.dimensions,
        [name]: value,
      },
    }));
  };

const handleImageUpload = async (e) => {
  const files = Array.from(e.target.files);
  if (files.length === 0) return;

  const validTypes = ['image/jpeg','image/jpg','image/png','image/gif','image/webp'];
  const invalidFiles = files.filter(file => !validTypes.includes(file.type));

  if(invalidFiles.length > 0) {
setError('Please upload only image files (jpg, png, gif, webp)');
    return;
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  const oversizedFiles = files.filter(file => file.size > maxSize);

  if(oversizedFiles.length > 0) {
    setError('Each image must be less than 5MB');
    return; 
  }

  setUploadingImages(true);
  setError('');

  try{
    const base64Images = await Promise.all(
      files.map(file => convertToBase64(file))
    );

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...base64Images],
    }));

    console.log(`Uploaded ${files.length} images successfully`);
  }catch(err){
  console.error("Error uploading images: ", err);
  setError('Failed to upload images. Please try again.');
  }finally{
    setUploadingImages(false);
  }
  }

   const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

 const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Please enter a valid price');
      return false;
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      setError('Please enter a valid stock quantity');
      return false;
    }

    if (formData.images.length === 0) {
      setError('Please upload at least one image');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const productData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        images: formData.images,
        stock: parseInt(formData.stock),
        status: formData.status,
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag !== ''),
        dimensions: {
          width: parseFloat(formData.dimensions.width) || null,
          height: parseFloat(formData.dimensions.height) || null,
          unit: formData.dimensions.unit,
        },
      };

       console.log(' Creating product:', {
        ...productData,
        images: `${productData.images.length} image(s)`
      });

      await productService.createProduct(productData);
      
      console.log(' Product created successfully');
      
      // Success - navigate to my products
      navigate('/my-products');
    } catch (err) {
      console.error('Error creating product:', err);
      setError(
        err.response?.data?.message ||
        err.response?.data ||
        'Failed to create product. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600 mt-2">List your artwork for sale</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Abstract Sunset Painting"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="5"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe your artwork in detail..."
            />
          </div>

          {/* Price and Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                required
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="1"
              />
            </div>
          </div>

          {/* Category and Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="ACTIVE">Active</option>
                <option value="DRAFT">Draft</option>
              </select>
            </div>
          </div>

          {/* Dimensions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dimensions (Optional)
            </label>
            <div className="grid grid-cols-3 gap-4">
              <input
                type="number"
                name="width"
                value={formData.dimensions.width}
                onChange={handleDimensionChange}
                step="0.1"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Width"
              />
              <input
                type="number"
                name="height"
                value={formData.dimensions.height}
                onChange={handleDimensionChange}
                step="0.1"
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Height"
              />
              <select
                name="unit"
                value={formData.dimensions.unit}
                onChange={handleDimensionChange}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="cm">cm</option>
                <option value="inch">inch</option>
                <option value="px">px</option>
              </select>
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Images *
            </label>
            {/*Uplaod Button */}
           <div className='mb-4'>
             <label className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition">
                  <div className="text-4xl mb-2">📸</div>
                  <p className="text-gray-600 mb-1">
                    {uploadingImages ? 'Uploading...' : 'Click to upload images'}
                  </p>
                  <p className="text-sm text-gray-500">
                    PNG, JPG, GIF, WEBP up to 5MB each
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploadingImages}
                />
              </label>
           </div>
          </div>

{/* Image Previews */}
{formData.images.length > 0 && (
  <div>
    <p className="text-sm text-gray-600 mb-3">
      {formData.images.length} image(s) uploaded
    </p>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {formData.images.map((image, index) => (
        <div key={index} className="relative group">
          <img
            src={image}
            alt={`Preview ${index}`}
            className="w-full h-full object-cover rounded-lg"
          />

          <button
            type="button"
            onClick={() => removeImage(index)}
            className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition"
            title="Remove image"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            #{index + 1}
          </div>
        </div>
      ))}
    </div>
  </div>
)}

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (Optional)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="abstract, modern, colorful (comma separated)"
            />
            <p className="text-sm text-gray-500 mt-1">
              Separate tags with commas
            </p>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={loading || uploadingImages}
              className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : uploadingImages ? 'Uploading Images...' : 'Create Product'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="px-8 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductPage;
