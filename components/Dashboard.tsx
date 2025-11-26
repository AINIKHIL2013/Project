import React from 'react';
import { SavedDocument, User } from '../types';

interface DashboardProps {
  user: User;
  documents: SavedDocument[];
  onNew: () => void;
  onOpen: (doc: SavedDocument) => void;
  onDelete: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, documents, onNew, onOpen, onDelete }) => {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Dashboard</h2>
          <p className="text-slate-400 mt-1">Welcome back, {user.name}.</p>
        </div>
        <button 
          onClick={onNew}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-500/20 transition-all transform hover:scale-105"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Create New NDA</span>
        </button>
      </div>

      {/* Content */}
      {documents.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center">
          <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-white mb-2">No documents yet</h3>
          <p className="text-slate-400 mb-6 max-w-sm mx-auto">Create your first professional Non-Disclosure Agreement using our AI-powered drafter.</p>
          <button 
            onClick={onNew}
            className="text-blue-400 hover:text-blue-300 font-medium text-sm"
          >
            Start Drafting &rarr;
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div 
              key={doc.id}
              className="group bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-xl p-5 transition-all hover:shadow-xl hover:shadow-blue-900/10 flex flex-col h-[200px]"
            >
              <div className="flex-1 cursor-pointer" onClick={() => onOpen(doc)}>
                <div className="flex items-start justify-between mb-3">
                   <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                     <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                     </svg>
                   </div>
                   <span className="text-xs font-mono text-slate-500 bg-slate-800 px-2 py-1 rounded">
                     {new Date(doc.createdAt).toLocaleDateString()}
                   </span>
                </div>
                <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-2 mb-1">
                  {doc.title}
                </h3>
                <p className="text-sm text-slate-500">
                  {doc.formData.type} • {doc.formData.jurisdiction}
                </p>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center">
                 <button 
                   onClick={() => onOpen(doc)}
                   className="text-sm text-slate-400 hover:text-white font-medium"
                 >
                   Open
                 </button>
                 <button 
                   onClick={(e) => { e.stopPropagation(); onDelete(doc.id); }}
                   className="text-sm text-red-500/70 hover:text-red-400 transition-colors p-1"
                   title="Delete"
                 >
                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                   </svg>
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
