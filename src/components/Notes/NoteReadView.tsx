'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ArrowLeft, Edit3 } from 'lucide-react';
import { Note, Category } from '@/app/notes/page';

interface NoteReadViewProps {
  note: Note;
  category: Category;
  onBack: () => void;
  onEdit: () => void;
}

export default function NoteReadView({ note, category, onBack, onEdit }: NoteReadViewProps) {
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

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header avec boutons */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-black mb-2">{note.title}</h1>
            <div className="flex items-center space-x-3">
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryStyles(category.color)} mt-1`}>
                {category.name}
              </span>
              <span className="text-sm text-gray-500">
                Modifié le {note.updatedAt.toLocaleDateString('fr-FR')}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={onEdit}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-blue-100 text-blue-700 hover:bg-blue-200"
        >
          <Edit3 className="h-4 w-4" />
          <span>Modifier</span>
        </button>
      </div>


      {/* Contenu markdown compilé */}
      <div className="prose prose-sm max-w-none">
        {note.content ? (
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => <h1 className="text-2xl font-bold text-black mb-4">{children}</h1>,
              h2: ({ children }) => <h2 className="text-xl font-bold text-black mb-3 mt-6">{children}</h2>,
              h3: ({ children }) => <h3 className="text-lg font-semibold text-black mb-2 mt-4">{children}</h3>,
              p: ({ children }) => <p className="text-gray-700 mb-4 leading-relaxed">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-6 mb-4 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-6 mb-4 space-y-1">{children}</ol>,
              li: ({ children }) => <li className="text-gray-700">{children}</li>,
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-50 text-gray-700 italic">
                  {children}
                </blockquote>
              ),
              code: ({ children }) => <code className="bg-slate-100 text-black px-2 py-1 rounded text-sm font-mono border border-slate-300">{children}</code>,
              pre: ({ children }) => <pre className="bg-slate-100 text-black p-4 rounded-lg overflow-x-auto mb-4 border border-slate-300 font-mono text-sm leading-relaxed">{children}</pre>,
              a: ({ children, href }) => (
                <a href={href} className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
              hr: () => <hr className="my-6 border-t-2 border-gray-200" />,
            }}
          >
            {note.content}
          </ReactMarkdown>
        ) : (
          <div className="text-gray-500 italic text-center py-12">
            Cette note est vide. Cliquez sur &quot;Modifier&quot; pour ajouter du contenu.
          </div>
        )}
      </div>
    </div>
  );
}