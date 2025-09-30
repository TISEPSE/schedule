'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  Bold, 
  Italic, 
  Link, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Heading, 
  Tag,
  X,
  HelpCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Category } from '@/app/notes/page';

// Import dynamique pour éviter les erreurs SSR
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor'),
  { ssr: false }
);

interface NotesEditorProps {
  title: string;
  content: string;
  category: string;
  tags: string[];
  categories: Category[];
  isEditing?: boolean;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onCategoryChange: (category: string) => void;
  onTagsChange: (tags: string[]) => void;
}

export default function NotesEditor({
  title,
  content,
  category,
  tags,
  categories,
  isEditing = true,
  onTitleChange,
  onContentChange,
  onCategoryChange,
  onTagsChange
}: NotesEditorProps) {
  const [newTag, setNewTag] = useState('');
  const [localContent, setLocalContent] = useState(content);
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout>();
  const [showMarkdownHelp, setShowMarkdownHelp] = useState(false);

  // Auto-save avec délai
  useEffect(() => {
    if (autoSaveTimeout) {
      clearTimeout(autoSaveTimeout);
    }
    
    const timeout = setTimeout(() => {
      if (localContent !== content) {
        onContentChange(localContent);
      }
    }, 1000); // Sauvegarde après 1 seconde d'inactivité

    setAutoSaveTimeout(timeout);

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [localContent, content, onContentChange, autoSaveTimeout]);

  // Synchroniser le contenu local avec les props
  useEffect(() => {
    setLocalContent(content);
  }, [content]);

  const getCategoryColor = (categoryId: string) => {
    const cat = categories.find(c => c.id === categoryId);
    if (!cat) return 'blue';
    return cat.color;
  };

  const getCategoryName = (categoryId: string) => {
    const cat = categories.find(c => c.id === categoryId);
    if (!cat) return 'Général';
    return cat.name;
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      onTagsChange([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  // Boutons de formatage pour le mode édition simple
  const formatButtons = [
    { icon: Bold, label: 'Gras', markdown: '**texte**' },
    { icon: Italic, label: 'Italique', markdown: '*texte*' },
    { icon: Heading, label: 'Titre', markdown: '# ' },
    { icon: List, label: 'Liste', markdown: '- ' },
    { icon: ListOrdered, label: 'Liste numérotée', markdown: '1. ' },
    { icon: Quote, label: 'Citation', markdown: '> ' },
    { icon: Code, label: 'Code', markdown: '`code`' },
    { icon: Link, label: 'Lien', markdown: '[texte](url)' },
  ];

  const insertMarkdown = (markdown: string) => {
    // Simple insertion à la fin pour la démo
    setLocalContent(prev => prev + '\n' + markdown);
  };

  return (
    <div className="space-y-6">
      {/* Métadonnées */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Titre */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">Titre</label>
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Titre de la note..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          ) : (
            <div className="px-4 py-3 bg-gray-50 rounded-xl font-medium text-gray-900">
              {title || 'Sans titre'}
            </div>
          )}
        </div>

        {/* Catégorie */}
        <div>
          <label className="block text-sm font-medium text-black mb-2">Catégorie</label>
          {isEditing ? (
            <select
              value={category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          ) : (
            <div className={`px-4 py-3 rounded-xl font-medium bg-${getCategoryColor(category)}-50 text-${getCategoryColor(category)}-700`}>
              {getCategoryName(category)}
            </div>
          )}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-black mb-2">Tags</label>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {tags.map(tag => (
            <span
              key={tag}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
            >
              <Tag className="h-3 w-3" />
              <span>{tag}</span>
              {isEditing && (
                <button
                  onClick={() => removeTag(tag)}
                  className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </span>
          ))}
        </div>
        
        {isEditing && (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ajouter un tag..."
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={addTag}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Ajouter
            </button>
          </div>
        )}
      </div>

      {/* Éditeur de contenu */}
      <div>
        <label className="block text-sm font-medium text-black mb-2">Contenu</label>
        
        {isEditing ? (
          <div className="space-y-4">
            {/* Barre d'outils de formatage simple */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-gray-50 rounded-xl border">
              <div className="flex flex-wrap items-center gap-2">
                {formatButtons.map((button, index) => {
                  const Icon = button.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => insertMarkdown(button.markdown)}
                      className="flex items-center justify-center w-8 h-8 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
                      title={button.label}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  );
                })}
              </div>
              
              {/* Bouton d'aide */}
              <button
                onClick={() => setShowMarkdownHelp(!showMarkdownHelp)}
                className="flex items-center space-x-1 px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors text-sm"
                title={showMarkdownHelp ? 'Masquer l\'aide' : 'Afficher l\'aide Markdown'}
              >
                <HelpCircle className="h-4 w-4" />
                <span className="hidden sm:inline">Aide</span>
                {showMarkdownHelp ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </button>
            </div>

            {/* Zone d'édition */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <MDEditor
                value={localContent}
                onChange={(value) => setLocalContent(value || '')}
                preview="edit"
                hideToolbar
                visibleDragbar={false}
                data-color-mode="light"
                height={400}
                textareaProps={{
                  placeholder: 'Écrivez votre note en markdown...',
                  style: {
                    fontSize: 14,
                    lineHeight: 1.6,
                    fontFamily: 'ui-monospace, SFMono-Regular, Monaco, Cascadia Code, Segoe UI Mono, Roboto Mono, Oxygen Mono, Ubuntu Monospace, Source Code Pro, Fira Mono, Droid Sans Mono, Courier New, monospace'
                  }
                }}
              />
            </div>

            {/* Aide markdown - collapsible */}
            {showMarkdownHelp && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 transition-all duration-300">
                <h4 className="text-sm font-medium text-blue-900 mb-2">Aide Markdown</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div><code className="bg-blue-100 px-1 rounded">**gras**</code> → <strong>gras</strong></div>
                  <div><code className="bg-blue-100 px-1 rounded">*italique*</code> → <em>italique</em></div>
                  <div><code className="bg-blue-100 px-1 rounded"># Titre</code> → Titre</div>
                  <div><code className="bg-blue-100 px-1 rounded">- Liste</code> → • Liste</div>
                  <div><code className="bg-blue-100 px-1 rounded">[lien](url)</code> → lien</div>
                  <div><code className="bg-blue-100 px-1 rounded">`code`</code> → <code>code</code></div>
                  <div><code className="bg-blue-100 px-1 rounded">&gt; Citation</code> → Citation</div>
                  <div><code className="bg-blue-100 px-1 rounded">---</code> → Séparateur</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          // Mode prévisualisation
          <div className="prose prose-sm max-w-none border border-gray-200 rounded-xl p-6 bg-gray-50 min-h-[400px]">
            {content ? (
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => <h1 className="text-2xl font-bold text-gray-900 mb-4">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-bold text-gray-900 mb-3 mt-6">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg font-semibold text-gray-900 mb-2 mt-4">{children}</h3>,
                  p: ({ children }) => <p className="text-gray-700 mb-4 leading-relaxed">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="text-gray-700">{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-50 text-gray-700 italic">
                      {children}
                    </blockquote>
                  ),
                  code: ({ children }) => <code className="bg-gray-200 px-1 py-0.5 rounded text-sm font-mono">{children}</code>,
                  pre: ({ children }) => <pre className="bg-gray-900 text-gray-100 p-4 rounded-xl overflow-x-auto mb-4">{children}</pre>,
                  a: ({ children, href }) => (
                    <a href={href} className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  ),
                  hr: () => <hr className="my-8 border-t-2 border-gray-200" />,
                  table: ({ children }) => <table className="min-w-full table-auto border-collapse mb-4">{children}</table>,
                  th: ({ children }) => <th className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-left">{children}</th>,
                  td: ({ children }) => <td className="border border-gray-300 px-4 py-2">{children}</td>,
                }}
              >
                {content}
              </ReactMarkdown>
            ) : (
              <div className="text-gray-500 italic text-center py-12">
                Aucun contenu à afficher. Cliquez sur &quot;Modifier&quot; pour commencer à écrire.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}