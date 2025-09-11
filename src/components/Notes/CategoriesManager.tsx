'use client';

import { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Folder, 
  X, 
  Check,
  Palette
} from 'lucide-react';
import { Category } from '@/app/notes/page';

interface CategoriesManagerProps {
  categories: Category[];
  onUpdateCategories: (categories: Category[]) => void;
}

const colorOptions = [
  { name: 'Bleu', value: 'blue' },
  { name: 'Vert', value: 'green' },
  { name: 'Rouge', value: 'red' },
  { name: 'Violet', value: 'purple' },
  { name: 'Jaune', value: 'yellow' },
  { name: 'Rose', value: 'pink' },
  { name: 'Indigo', value: 'indigo' },
  { name: 'Gris', value: 'gray' },
];

export default function CategoriesManager({ categories, onUpdateCategories }: CategoriesManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    color: 'blue',
    icon: 'Folder'
  });

  const createCategory = () => {
    if (!formData.name.trim()) return;
    
    const newCategory: Category = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      color: formData.color,
      icon: formData.icon
    };

    onUpdateCategories([...categories, newCategory]);
    setFormData({ name: '', color: 'blue', icon: 'Folder' });
    setIsCreating(false);
  };

  const updateCategory = (id: string) => {
    if (!formData.name.trim()) return;
    
    const updatedCategories = categories.map(cat => 
      cat.id === id 
        ? { ...cat, name: formData.name.trim(), color: formData.color, icon: formData.icon }
        : cat
    );
    
    onUpdateCategories(updatedCategories);
    setEditingId(null);
    setFormData({ name: '', color: 'blue', icon: 'Folder' });
  };

  const deleteCategory = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      const updatedCategories = categories.filter(cat => cat.id !== id);
      onUpdateCategories(updatedCategories);
    }
  };

  const startEditing = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      color: category.color,
      icon: category.icon
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setIsCreating(false);
    setFormData({ name: '', color: 'blue', icon: 'Folder' });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-black">Catégories</h3>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Nouvelle</span>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Formulaire de création */}
        {isCreating && (
          <div className="p-4 border border-gray-200 rounded-xl bg-gray-50">
            <div className="space-y-3">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Nom de la catégorie..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <div className="flex items-center space-x-2">
                <Palette className="h-4 w-4 text-gray-500" />
                <select
                  value={formData.color}
                  onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {colorOptions.map(color => (
                    <option key={color.value} value={color.value}>
                      {color.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end space-x-2">
                <button
                  onClick={cancelEditing}
                  className="px-3 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={createCategory}
                  className="flex items-center space-x-1 px-3 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <Check className="h-4 w-4" />
                  <span>Créer</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Liste des catégories */}
        {categories.map(category => (
          <div
            key={category.id}
            className="flex items-center justify-between p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            {editingId === category.id ? (
              // Mode édition
              <div className="flex-1 space-y-3">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <div className="flex items-center space-x-2">
                  <Palette className="h-4 w-4 text-gray-500" />
                  <select
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {colorOptions.map(color => (
                      <option key={color.value} value={color.value}>
                        {color.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={cancelEditing}
                    className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => updateCategory(category.id)}
                    className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    <Check className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              // Mode affichage
              <>
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full bg-${category.color}-500`}></div>
                  <Folder className={`h-5 w-5 text-${category.color}-600`} />
                  <span className="font-medium text-black">{category.name}</span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => startEditing(category)}
                    className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                    title="Modifier"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteCategory(category.id)}
                    className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}