import React, { useState, useEffect } from 'react';
import { visionAPI } from '../../services/api';
import { VisionButton } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';

interface VisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  button: VisionButton | null;
  showToast: (type: 'success' | 'error' | 'warning', message: string) => void;
}

const VisionModal: React.FC<VisionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  button,
  showToast
}) => {
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    color: 'bg-blue-500',
    glowColor: 'rgba(59, 130, 246, 0.5)',
    rgbColor: '59, 130, 246',
    link: '',
    order: 1,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (button) {
      setFormData({
        id: button.id,
        title: button.title,
        color: button.color,
        glowColor: button.glowColor,
        rgbColor: button.rgbColor,
        link: button.link,
        order: button.order,
      });
    } else {
      setFormData({
        id: '',
        title: '',
        color: 'bg-blue-500',
        glowColor: 'rgba(59, 130, 246, 0.5)',
        rgbColor: '59, 130, 246',
        link: '',
        order: 1,
      });
    }
    setErrors({});
  }, [button, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.id.trim()) newErrors.id = 'ID is required';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.link.trim()) newErrors.link = 'Link is required';
    if (formData.order < 1) newErrors.order = 'Order must be at least 1';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (button) {
        await visionAPI.update(button._id, formData);
        showToast('success', 'Vision button updated successfully');
      } else {
        await visionAPI.create(formData);
        showToast('success', 'Vision button created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save vision button:', error);
      showToast('error', `Failed to ${button ? 'update' : 'create'} vision button`);
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
      title={button ? 'Edit Vision Button' : 'Create New Vision Button'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Button Preview */}
        <div className="p-4 bg-gray-50 rounded-lg text-center">
          <div
            className={`inline-block px-6 py-3 rounded-lg text-white font-medium transition-all ${formData.color}`}
            style={{
              boxShadow: formData.glowColor ? `0 4px 15px ${formData.glowColor}` : undefined
            }}
          >
            {formData.title || 'Button Preview'}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="ID *"
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            error={errors.id}
            placeholder="unique-button-id"
            disabled={!!button}
          />

          <Input
            label="Title *"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={errors.title}
            placeholder="Button text"
          />
        </div>

        <Input
          label="Link *"
          type="url"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          error={errors.link}
          placeholder="https://example.com"
          helperText="The URL this button will navigate to"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            helperText="Display order (lower numbers appear first)"
          />
        </div>

        {/* Advanced Color Settings */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Advanced Color Settings</h4>
          
          <Input
            label="Glow Color"
            value={formData.glowColor}
            onChange={(e) => setFormData({ ...formData, glowColor: e.target.value })}
            placeholder="rgba(59, 130, 246, 0.5)"
            helperText="RGBA color for button glow effect"
          />

          <Input
            label="RGB Color"
            value={formData.rgbColor}
            onChange={(e) => setFormData({ ...formData, rgbColor: e.target.value })}
            placeholder="59, 130, 246"
            helperText="RGB values without parentheses"
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
            {button ? 'Update Button' : 'Create Button'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default VisionModal;