import { useState } from 'react';
import { Search, Plus, Copy, Check, Edit2, Trash2 } from 'lucide-react';
import type { ViewType } from './Sidebar';
import type { PasswordEntry, ApiKeyEntry } from '../types';

interface ListViewProps {
  type: ViewType;
  items: (PasswordEntry | ApiKeyEntry)[];
  onAdd: () => void;
  onEdit: (item: any) => void;
  onDelete: (id: string) => void;
}

export default function ListView({ type, items, onAdd, onEdit, onDelete }: ListViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredItems = items.filter(item => {
    const q = searchQuery.toLowerCase();
    if (type === 'passwords') {
      const p = item as PasswordEntry;
      return (
        p.url.toLowerCase().includes(q) ||
        p.username.toLowerCase().includes(q) ||
        (p.notes || '').toLowerCase().includes(q)
      );
    } else {
      const a = item as ApiKeyEntry;
      return (
        a.platform.toLowerCase().includes(q) ||
        a.keyName.toLowerCase().includes(q) ||
        (a.notes || '').toLowerCase().includes(q)
      );
    }
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-apple-text-muted)]" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[var(--color-apple-surface)] border border-[var(--color-apple-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-apple-blue)] transition-all"
          />
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-apple-blue)] hover:bg-[var(--color-apple-blue-hover)] text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New
        </button>
      </div>

      <div className="flex-1 overflow-auto rounded-lg border border-[var(--color-apple-border)] bg-[var(--color-apple-surface)] shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-[var(--color-apple-surface)] border-b border-[var(--color-apple-border)] z-10">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--color-apple-text-muted)] uppercase tracking-wider">
                {type === 'passwords' ? 'URL / Platform' : 'Platform'}
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--color-apple-text-muted)] uppercase tracking-wider">
                {type === 'passwords' ? 'Username / Account' : 'API Key Name'}
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--color-apple-text-muted)] uppercase tracking-wider">
                {type === 'passwords' ? 'Password' : 'API Key Value'}
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--color-apple-text-muted)] uppercase tracking-wider">
                Notes
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-[var(--color-apple-text-muted)] uppercase tracking-wider w-24">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-apple-border)]">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-[var(--color-apple-text-muted)]">
                  No items found.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const isPwd = type === 'passwords';
                const col1 = isPwd ? (item as PasswordEntry).url : (item as ApiKeyEntry).platform;
                const col2 = isPwd ? (item as PasswordEntry).username : (item as ApiKeyEntry).keyName;
                const col3 = isPwd ? (item as PasswordEntry).password : (item as ApiKeyEntry).keyValue;

                return (
                  <tr key={item.id} className="hover:bg-[var(--color-apple-bg)]/50 transition-colors group">
                    <td className="px-4 py-3 text-sm font-medium truncate max-w-[150px]" title={col1}>{col1}</td>
                    <td className="px-4 py-3 text-sm text-[var(--color-apple-text-muted)] truncate max-w-[150px]" title={col2}>{col2}</td>
                    <td className="px-4 py-3 text-sm text-[var(--color-apple-text-muted)]">
                      <div className="flex items-center gap-2">
                        <span className="font-mono bg-[var(--color-apple-bg)] px-2 py-1 rounded text-xs truncate max-w-[120px]">
                          {col3}
                        </span>
                        <button
                          onClick={() => handleCopy(col3, item.id)}
                          className="p-1.5 text-[var(--color-apple-text-muted)] hover:text-[var(--color-apple-blue)] hover:bg-[var(--color-apple-blue)]/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                          title="Copy to clipboard"
                        >
                          {copiedId === item.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-[var(--color-apple-text-muted)] truncate max-w-[150px]" title={item.notes}>
                      {item.notes}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEdit(item)}
                          className="p-1.5 text-[var(--color-apple-text-muted)] hover:text-[var(--color-apple-blue)] hover:bg-[var(--color-apple-blue)]/10 rounded transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(item.id)}
                          className="p-1.5 text-[var(--color-apple-text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
