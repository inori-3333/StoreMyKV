import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { ViewType } from './Sidebar';

interface ItemModalProps {
  isOpen: boolean;
  type: ViewType;
  initialData?: any;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function ItemModal({ isOpen, type, initialData, onClose, onSave }: ItemModalProps) {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      if (type === 'passwords') {
        setFormData({ url: '', username: '', password: '', notes: '' });
      } else {
        setFormData({ platform: '', keyName: '', keyValue: '', notes: '' });
      }
    }
  }, [initialData, type, isOpen]);

  if (!isOpen) return null;

  const isPwd = type === 'passwords';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-apple-surface)] rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-[var(--color-apple-border)]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-apple-border)] bg-[var(--color-apple-bg)]/50">
          <h2 className="text-lg font-semibold">
            {initialData ? 'Edit' : 'Add'} {isPwd ? 'Password' : 'API Key'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-[var(--color-apple-text-muted)] hover:text-[var(--color-apple-text)] hover:bg-[var(--color-apple-border)]/50 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {isPwd ? (
            <>
              <div>
                <label className="block text-sm font-medium text-[var(--color-apple-text-muted)] mb-1">URL / Platform</label>
                <input
                  type="text"
                  name="url"
                  required
                  value={formData.url || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[var(--color-apple-bg)] border border-[var(--color-apple-border)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-apple-blue)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-apple-text-muted)] mb-1">Username / Account</label>
                <input
                  type="text"
                  name="username"
                  required
                  value={formData.username || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[var(--color-apple-bg)] border border-[var(--color-apple-border)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-apple-blue)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-apple-text-muted)] mb-1">Password</label>
                <input
                  type="text"
                  name="password"
                  required
                  value={formData.password || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[var(--color-apple-bg)] border border-[var(--color-apple-border)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-apple-blue)]"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-[var(--color-apple-text-muted)] mb-1">Platform</label>
                <input
                  type="text"
                  name="platform"
                  required
                  value={formData.platform || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[var(--color-apple-bg)] border border-[var(--color-apple-border)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-apple-blue)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-apple-text-muted)] mb-1">API Key Name</label>
                <input
                  type="text"
                  name="keyName"
                  required
                  value={formData.keyName || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[var(--color-apple-bg)] border border-[var(--color-apple-border)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-apple-blue)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-apple-text-muted)] mb-1">API Key Value</label>
                <input
                  type="text"
                  name="keyValue"
                  required
                  value={formData.keyValue || ''}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-[var(--color-apple-bg)] border border-[var(--color-apple-border)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-apple-blue)]"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-[var(--color-apple-text-muted)] mb-1">Notes (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 bg-[var(--color-apple-bg)] border border-[var(--color-apple-border)] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-apple-blue)] resize-none"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[var(--color-apple-text)] hover:bg-[var(--color-apple-bg)] rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-apple-blue)] hover:bg-[var(--color-apple-blue-hover)] rounded-md transition-colors shadow-sm"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
