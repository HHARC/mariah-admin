import React, { useState, useEffect } from 'react';
import { socialAPI } from '../../services/api';
import { SocialMedia } from '../../types';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { getSocialIcon } from '../../utils/socialIcons';

interface SocialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  socialLink: SocialMedia | null;
  showToast: (type: 'success' | 'error' | 'warning', message: string) => void;
}

const SocialModal: React.FC<SocialModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  socialLink,
  showToast
}) => {
  const [formData, setFormData] = useState({
    platform: 'instagram' as SocialMedia['platform'],
    link: '',
    order: 1,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (socialLink) {
      setFormData({
        platform: socialLink.platform,
        link: socialLink.link,
        order: socialLink.order,
      });
    } else {
      setFormData({
        platform: 'instagram',
        link: '',
        order: 1,
      });
    }
    setErrors({});
  }, [socialLink, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.platform) newErrors.platform = 'Platform is required';
    if (!formData.link.trim()) newErrors.link = 'Link is required';
    if (!formData.link.startsWith('http://') && !formData.link.startsWith('https://')) {
      newErrors.link = 'Link must start with http:// or https://';
    }
    if (formData.order < 1) newErrors.order = 'Order must be at least 1';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (socialLink) {
        await socialAPI.update(socialLink._id, formData);
        showToast('success', 'Social media link updated successfully');
      } else {
        await socialAPI.create(formData);
        showToast('success', 'Social media link created successfully');
      }
      onSuccess();
    } catch (error) {
      console.error('Failed to save social link:', error);
      showToast('error', `Failed to ${socialLink ? 'update' : 'create'} social media link`);
    } finally {
      setLoading(false);
    }
  };

  const platformOptions = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'threads', label: 'Threads' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'youtube', label: 'YouTube' },
  ];

  const SocialIcon = getSocialIcon(formData.platform);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={socialLink ? 'Edit Social Media Link' : 'Add New Social Media Link'}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Platform Preview */}
        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-soft">
            <SocialIcon className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 capitalize">{formData.platform}</h4>
            <p className="text-sm text-gray-600">
              {formData.link || 'No link provided'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Platform *"
            value={formData.platform}
            onChange={(e) => setFormData({ ...formData, platform: e.target.value as SocialMedia['platform'] })}
            options={platformOptions}
            error={errors.platform}
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

        <Input
          label="Profile Link *"
          type="url"
          value={formData.link}
          onChange={(e) => setFormData({ ...formData, link: e.target.value })}
          error={errors.link}
          placeholder="https://instagram.com/username"
          helperText="Full URL to your social media profile"
        />

        {/* Platform-specific examples */}
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 font-medium mb-1">Example URLs:</p>
          <div className="text-xs text-blue-700 space-y-1">
            <p>Instagram: https://instagram.com/username</p>
            <p>Twitter: https://twitter.com/username</p>
            <p>LinkedIn: https://linkedin.com/company/company-name</p>
            <p>TikTok: https://tiktok.com/@username</p>
            <p>YouTube: https://youtube.com/@username</p>
          </div>
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
            {socialLink ? 'Update Link' : 'Add Link'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SocialModal;