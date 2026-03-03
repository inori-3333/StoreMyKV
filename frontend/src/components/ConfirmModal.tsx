import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ isOpen, message, onConfirm, onCancel }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--color-apple-surface)] rounded-xl shadow-2xl w-full max-w-sm overflow-hidden border border-[var(--color-apple-border)] text-center p-6">
        <h2 className="text-lg font-semibold mb-2 text-[var(--color-apple-text)]">Confirm Deletion</h2>
        <p className="text-sm text-[var(--color-apple-text-muted)] mb-6">{message}</p>

        <div className="flex justify-center gap-3 w-full">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 text-sm font-medium text-[var(--color-apple-text)] bg-[var(--color-apple-bg)] hover:bg-[var(--color-apple-border)]/50 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors shadow-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
