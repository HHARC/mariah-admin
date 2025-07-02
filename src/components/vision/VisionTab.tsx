import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, ExternalLink } from 'lucide-react';
import { visionAPI } from '../../services/api';
import { VisionButton } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import LoadingSpinner from '../ui/LoadingSpinner';
import VisionModal from './VisionModal';

interface VisionTabProps {
  onUpdate: () => void;
  showToast: (type: 'success' | 'error' | 'warning', message: string) => void;
}

const VisionTab: React.FC<VisionTabProps> = ({ onUpdate, showToast }) => {
  const [visionButtons, setVisionButtons] = useState<VisionButton[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingButton, setEditingButton] = useState<VisionButton | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchVisionButtons = async () => {
    try {
      setLoading(true);
      const response = await visionAPI.getAll();
      setVisionButtons(response.data.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Failed to fetch vision buttons:', error);
      showToast('error', 'Failed to load vision buttons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisionButtons();
  }, []);

  const handleCreate = () => {
    setEditingButton(null);
    setModalOpen(true);
  };

  const handleEdit = (button: VisionButton) => {
    setEditingButton(button);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vision button?')) return;

    try {
      setDeletingId(id);
      await visionAPI.delete(id);
      await fetchVisionButtons();
      onUpdate();
      showToast('success', 'Vision button deleted successfully');
    } catch (error) {
      console.error('Failed to delete vision button:', error);
      showToast('error', 'Failed to delete vision button');
    } finally {
      setDeletingId(null);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingButton(null);
  };

  const handleModalSuccess = () => {
    fetchVisionButtons();
    onUpdate();
    handleModalClose();
  };

  const filteredButtons = visionButtons.filter(button =>
    button.title.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h2 className="text-2xl font-bold text-gray-900">Vision Buttons</h2>
          <p className="text-gray-600">Manage navigation buttons for your website</p>
        </div>
        <Button
          onClick={handleCreate}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Button
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search buttons..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Vision Buttons Grid */}
      {filteredButtons.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Trash2 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No vision buttons found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first vision button'}
          </p>
          {!searchTerm && (
            <Button onClick={handleCreate} icon={<Plus className="w-4 h-4" />}>
              Add Your First Button
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredButtons.map((button) => (
            <div key={button._id} className="card p-6 card-hover">
              {/* Button Preview */}
              <div className="mb-4 p-4 bg-gray-50 rounded-lg text-center">
                <div
                  className={`inline-block px-6 py-3 rounded-lg text-white font-medium ${button.color || 'bg-blue-500'}`}
                  style={{
                    boxShadow: button.glowColor ? `0 4px 15px ${button.glowColor}` : undefined
                  }}
                >
                  {button.title}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{button.title}</h3>
                  {button.link && (
                    <p className="text-sm text-gray-600 break-all">{button.link}</p>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Order: {button.order}</span>
                  <span>ID: {button.id}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(button)}
                    icon={<Edit className="w-4 h-4" />}
                  >
                    Edit
                  </Button>
                  
                  {button.link && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(button.link, '_blank')}
                      icon={<ExternalLink className="w-4 h-4" />}
                    >
                      View
                    </Button>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(button._id)}
                  loading={deletingId === button._id}
                  icon={<Trash2 className="w-4 h-4 text-red-500" />}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <VisionModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        button={editingButton}
        showToast={showToast}
      />
    </div>
  );
};

export default VisionTab;