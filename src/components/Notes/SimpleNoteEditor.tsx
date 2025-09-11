'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Save, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { Note, Category } from '@/app/notes/page';

interface SimpleNoteEditorProps {
  note: Note;
  category: Category;
  onBack: () => void;
  onUpdate: (content: string, description?: string, title?: string) => void;
}

export default function SimpleNoteEditor({ note, category, onBack, onUpdate }: SimpleNoteEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [description, setDescription] = useState(note.description);
  const [showMarkdownHelp, setShowMarkdownHelp] = useState(false);

  const getCategoryStyles = (color: string) => {
    const styles: { [key: string]: string } = {
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      purple: 'bg-purple-100 text-purple-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      red: 'bg-red-100 text-red-800',
    };
    return styles[color] || 'bg-gray-100 text-gray-800';
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (content !== note.content || description !== note.description || title !== note.title) {
        onUpdate(content, description, title);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [content, description, title, note.content, note.description, note.title, onUpdate]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl font-semibold text-black bg-transparent border-none focus:outline-none focus:ring-0 p-0 w-full"
              placeholder="Titre de la note..."
            />
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryStyles(category.color)} mt-2`}>
              {category.name}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowMarkdownHelp(!showMarkdownHelp)}
            className="flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-blue-100 text-blue-700 hover:bg-blue-200"
            title={showMarkdownHelp ? 'Masquer l\'aide' : 'Afficher l\'aide Markdown'}
          >
            <HelpCircle className="h-4 w-4" />
            <span>Aide</span>
            {showMarkdownHelp ? (
              <ChevronUp className="h-3 w-3" />
            ) : (
              <ChevronDown className="h-3 w-3" />
            )}
          </button>
          <button
            onClick={() => {
              onUpdate(content, description, title);
              onBack();
            }}
            className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-green-100 text-green-700 hover:bg-green-200"
          >
            <Save className="h-4 w-4" />
            <span>Sauvegarder</span>
          </button>
        </div>
      </div>

      {/* Aide markdown - en haut et collapsible */}
      {showMarkdownHelp && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 transition-all duration-300">
          <h4 className="text-sm font-medium text-blue-900 mb-3">Aide Markdown</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <h5 className="font-semibold text-blue-800 mb-1">Formatage</h5>
              <div className="space-y-0.5 text-blue-700">
                <div><code className="bg-blue-100 px-1 rounded">**gras**</code> → <strong>gras</strong></div>
                <div><code className="bg-blue-100 px-1 rounded">*italique*</code> → <em>italique</em></div>
                <div><code className="bg-blue-100 px-1 rounded">`code`</code> → <code>code</code></div>
              </div>
            </div>
            <div>
              <h5 className="font-semibold text-blue-800 mb-1">Titres</h5>
              <div className="space-y-0.5 text-blue-700">
                <div><code className="bg-blue-100 px-1 rounded"># Titre 1</code></div>
                <div><code className="bg-blue-100 px-1 rounded">## Titre 2</code></div>
                <div><code className="bg-blue-100 px-1 rounded">### Titre 3</code></div>
              </div>
            </div>
            <div>
              <h5 className="font-semibold text-blue-800 mb-1">Listes</h5>
              <div className="space-y-0.5 text-blue-700">
                <div><code className="bg-blue-100 px-1 rounded">- Élément</code></div>
                <div><code className="bg-blue-100 px-1 rounded">1. Numéroté</code></div>
                <div><code className="bg-blue-100 px-1 rounded">&gt; Citation</code></div>
              </div>
            </div>
            <div>
              <h5 className="font-semibold text-blue-800 mb-1">Autres</h5>
              <div className="space-y-0.5 text-blue-700">
                <div><code className="bg-blue-100 px-1 rounded">[lien](url)</code></div>
                <div><code className="bg-blue-100 px-1 rounded">```code```</code></div>
                <div><code className="bg-blue-100 px-1 rounded">---</code> → ligne</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Description en haut */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description de la note..."
          className="w-full p-3 border border-gray-200 rounded-lg text-black resize-none focus:outline-none focus:border-blue-500"
          rows={2}
        />
      </div>

      {/* Éditeur markdown simple */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Contenu (Markdown)
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Écrivez votre note en markdown..."
          className="w-full h-96 p-4 border border-gray-200 rounded-lg text-black resize-none focus:outline-none focus:border-blue-500 font-mono text-sm"
          style={{ lineHeight: 1.6 }}
          autoFocus
        />
      </div>
    </div>
  );
}