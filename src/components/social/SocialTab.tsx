import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, ExternalLink } from 'lucide-react';
import { socialAPI } from '../../services/api';
import { SocialMedia } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import LoadingSpinner from '../ui/LoadingSpinner';
import SocialModal from './SocialModal';
import { getSocialIcon } from '../../utils/socialIcons';

interface SocialTabProps {
  onUpdate: () => void;
  showToast: (type: 'success' | 'error' | 'warning', message: string) => void;
}

const SocialTab: React.FC<SocialTabProps> = ({ onUpdate, showToast }) => {
  const [socialLinks, setSocialLinks] = useState<SocialMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialMedia | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchSocialLinks = async () => {
    try {
      setLoading(true);
      const response = await socialAPI.getAll();
      setSocialLinks(response.data.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Failed to fetch social links:', error);
      showToast('error', 'Failed to load social media links');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  const handleCreate = () => {
    setEditingLink(null);
    setModalOpen(true);
  };

  const handleEdit = (link: SocialMedia) => {
    setEditingLink(link);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this social media link?')) return;

    try {
      setDeletingId(id);
      await socialAPI.delete(id);
      await fetchSocialLinks();
      onUpdate();
      showToast('success', 'Social media link deleted successfully');
    } catch (error) {
      console.error('Failed to delete social link:', error);
      showToast('error', 'Failed to delete social media link');
    } finally {
      setDeletingId(null);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingLink(null);
  };

  const handleModalSuccess = () => {
    fetchSocialLinks();
    onUpdate();
    handleModalClose();
  };

  const filteredLinks = socialLinks.filter(link =>
    link.platform.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.link.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Social Media</h2>
          <p className="text-gray-600">Manage your social media links and presence</p>
        </div>
        <Button
          onClick={handleCreate}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Social Link
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search social links..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Social Links Grid */}
      {filteredLinks.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Trash2 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No social links found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by adding your first social media link'}
          </p>
          {!searchTerm && (
            <Button onClick={handleCreate} icon={<Plus className="w-4 h-4" />}>
              Add Your First Link
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLinks.map((link) => {
            const SocialIcon = getSocialIcon(link.platform);
            
            return (
              <div key={link._id} className="card p-6 card-hover">
                {/* Platform Icon and Name */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <SocialIcon className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 capitalize">
                      {link.platform}
                    </h3>
                    <p className="text-sm text-gray-600">Order: {link.order}</p>
                  </div>
                </div>

                {/* Link */}
                <div className="mb-4">
                  <p className="text-sm text-gray-700 break-all">{link.link}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(link)}
                      icon={<Edit className="w-4 h-4" />}
                    >
                      Edit
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(link.link, '_blank')}
                      icon={<ExternalLink className="w-4 h-4" />}
                    >
                      View
                    </Button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(link._id)}
                    loading={deletingId === link._id}
                    icon={<Trash2 className="w-4 h-4 text-red-500" />}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <SocialModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        socialLink={editingLink}
        showToast={showToast}
      />
    </div>
  );
};

export default SocialTab;