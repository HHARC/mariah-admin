import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, ExternalLink } from 'lucide-react';
import { formatsAPI } from '../../services/api';
import { Format } from '../../types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import LoadingSpinner from '../ui/LoadingSpinner';
import FormatModal from './FormatModal';

interface FormatsTabProps {
  onUpdate: () => void;
  showToast: (type: 'success' | 'error' | 'warning', message: string) => void;
}

const FormatsTab: React.FC<FormatsTabProps> = ({ onUpdate, showToast }) => {
  const [formats, setFormats] = useState<Format[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFormat, setEditingFormat] = useState<Format | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchFormats = async () => {
    try {
      setLoading(true);
      const response = await formatsAPI.getAll();
      setFormats(response.data.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Failed to fetch formats:', error);
      showToast('error', 'Failed to load TV formats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFormats();
  }, []);

  const handleCreate = () => {
    setEditingFormat(null);
    setModalOpen(true);
  };

  const handleEdit = (format: Format) => {
    setEditingFormat(format);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this format?')) return;

    try {
      setDeletingId(id);
      await formatsAPI.delete(id);
      await fetchFormats();
      onUpdate();
      showToast('success', 'Format deleted successfully');
    } catch (error) {
      console.error('Failed to delete format:', error);
      showToast('error', 'Failed to delete format');
    } finally {
      setDeletingId(null);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingFormat(null);
  };

  const handleModalSuccess = () => {
    fetchFormats();
    onUpdate();
    handleModalClose();
  };

  const filteredFormats = formats.filter(format =>
    format.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    format.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    format.description.toLowerCase().includes(searchTerm.toLowerCase())
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
          <h2 className="text-2xl font-bold text-gray-900">TV Formats</h2>
          <p className="text-gray-600">Manage your television show formats and content</p>
        </div>
        <Button
          onClick={handleCreate}
          icon={<Plus className="w-4 h-4" />}
        >
          Add Format
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search formats..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Formats Grid */}
      {filteredFormats.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Trash2 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No formats found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm ? 'Try adjusting your search terms' : 'Get started by creating your first TV format'}
          </p>
          {!searchTerm && (
            <Button onClick={handleCreate} icon={<Plus className="w-4 h-4" />}>
              Add Your First Format
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFormats.map((format) => (
            <div key={format.id} className="card p-6 card-hover">
              {/* Logo */}
              {format.logo && (
                <div className="mb-4">
                  <img
                    src={format.logo}
                    alt={format.title}
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Content */}
              <div className="space-y-3 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{format.title}</h3>
                  {format.subtitle && (
                    <p className="text-sm text-gray-600">{format.subtitle}</p>
                  )}
                </div>

                {format.description && (
                  <p className="text-sm text-gray-700 line-clamp-3">{format.description}</p>
                )}

                {format.tagline && (
                  <p className="text-sm font-medium text-primary-600">"{format.tagline}"</p>
                )}

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Order: {format.order}</span>
                  <span className={`px-2 py-1 rounded-full ${
                    format.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {format.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(format)}
                    icon={<Edit className="w-4 h-4" />}
                  >
                    Edit
                  </Button>
                  
                  {format.link && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(format.link, '_blank')}
                      icon={<ExternalLink className="w-4 h-4" />}
                    >
                      View
                    </Button>
                  )}
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(format.id)}
                  loading={deletingId === format.id}
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
      <FormatModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        format={editingFormat}
        showToast={showToast}
      />
    </div>
  );
};

export default FormatsTab;