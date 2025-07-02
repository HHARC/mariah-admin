import React, { useState, useEffect } from 'react';
import { formatsAPI } from '../../services/api';
import { Format } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import ImageUpload from '../ui/ImageUpload';

interface FormatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  format: Format | null;
  showToast: (type: 'success' | 'error' | 'warning', message: string) => void;
}

const FormatModal: React.FC<FormatModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  format,
  showToast
}) => {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    subtitle: '',
    description: '',
    tagline: '',
    coCreated: '',
    whyThisShowWins: '',
    color: 'bg-blue-500',
    glowColor: 'rgba(59, 130, 246, 0.5)',
    rgbColor: '59, 130, 246',
    link: '',
    logo: '',
    order: 1,
    isActive: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (format) {
      setFormData(format);
    } else {
      setFormData({
        id: '',
        title: '',
        subtitle: '',
        description: '',
        tagline: '',
        coCreated: '',
        whyThisShowWins: '',
        color: 'bg-blue-500',
        glowColor: 'rgba(59, 130, 246, 0.5)',
        rgbColor: '59, 130, 246',
        link: '',
        logo: '',
        order: 1,
        isActive: true,
      });
    }
    setErrors({});
  }, [format, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.id.trim()) newErrors.id = 'ID is required';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.whyThisShowWins.trim()) newErrors.whyThisShowWins = 'Why This Show Wins is required';
    if (formData.order < 1) newErrors.order = 'Order must be at least 1';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (format) {
        await formatsAPI.update(format.id, formData);
        showToast('success', 'Format updated successfully');
      } else {
        await formatsAPI.create(formData);
        showToast('success', 'Format created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save format:', error);
      showToast('error', `Failed to ${format ? 'update' : 'create'} format`);
    } finally {
      setLoading(false);
    }
  };

  const colorOptions = [
    { value: 'bg-blue-500', label: 'Blue' },
    { value: 'bg-green-500', label: 'Green' },
    { value: 'bg-purple-500', label: 'Purple' },
    { value: 'bg-red-500', label: 'Red' },
    { value: 'bg-yellow-500', label: 'Yellow' },
    { value: 'bg-pink-500', label: 'Pink' },
    { value: 'bg-indigo-500', label: 'Indigo' },
    { value: 'bg-gray-500', label: 'Gray' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={format ? 'Edit Format' : 'Create New Format'}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Basic Information</h4>
            
            <Input
              label="ID *"
              value={formData.id}
              onChange={(e) => setFormData({ ...formData, id: e.target.value })}
              error={errors.id}
              placeholder="unique-format-id"
              disabled={!!format}
            />

            <Input
              label="Title *"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              error={errors.title}
              placeholder="Format title"
            />

            <Input
              label="Subtitle"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="Format subtitle"
            />

            <Textarea
              label="Description *"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              error={errors.description}
              placeholder="Detailed description of the format..."
              rows={4}
            />
          </div>

          {/* Additional Details */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Additional Details</h4>
            
            <Input
              label="Tagline"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="Catchy tagline"
            />

            <Input
              label="Co-Created"
              value={formData.coCreated}
              onChange={(e) => setFormData({ ...formData, coCreated: e.target.value })}
              placeholder="Co-creation details"
            />

            <Textarea
              label="Why This Show Wins *"
              value={formData.whyThisShowWins}
              onChange={(e) => setFormData({ ...formData, whyThisShowWins: e.target.value })}
              error={errors.whyThisShowWins}
              placeholder="Explain what makes this show unique..."
              rows={3}
            />

            <Input
              label="Website Link"
              type="url"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              placeholder="https://example.com"
            />
          </div>
        </div>

        {/* Logo Upload */}
        <div>
          <ImageUpload
            label="Logo"
            value={formData.logo}
            onChange={(url) => setFormData({ ...formData, logo: url })}
          />
        </div>

        {/* Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Select
            label="Color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            options={colorOptions}
          />

          <Input
            label="Order"
            type="number"
            min="1"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
            error={errors.order}
          />

          <Select
            label="Status"
            value={formData.isActive ? 'true' : 'false'}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.value === 'true' })}
            options={[
              { value: 'true', label: 'Active' },
              { value: 'false', label: 'Inactive' },
            ]}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
          >
            {format ? 'Update Format' : 'Create Format'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default FormatModal;