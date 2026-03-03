import { KeyRound, Key, Download, Upload } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ViewType = 'passwords' | 'apikeys' | 'settings';

interface SidebarProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
  onExport: () => void;
  onImport: () => void;
}

export default function Sidebar({ currentView, onViewChange, onExport, onImport }: SidebarProps) {
  const navItems = [
    { id: 'passwords', label: 'Passwords', icon: KeyRound },
    { id: 'apikeys', label: 'API Keys', icon: Key },
  ] as const;

  return (
    <div className="w-64 h-full bg-[var(--color-apple-sidebar)] border-r border-[var(--color-apple-border)] flex flex-col app-region-drag pt-8 select-none">
      <div className="px-4 pb-2 text-xs font-semibold text-[var(--color-apple-text-muted)] uppercase tracking-wider">
        Manager
      </div>

      <div className="flex-1 px-2 space-y-1 overflow-y-auto app-region-no-drag">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
              currentView === item.id
                ? "bg-[var(--color-apple-blue)] text-white font-medium shadow-sm"
                : "text-[var(--color-apple-text)] hover:bg-[var(--color-apple-border)]/50"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </div>

      <div className="p-4 border-t border-[var(--color-apple-border)] app-region-no-drag space-y-2">
        <button
          onClick={onImport}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-[var(--color-apple-text)] hover:bg-[var(--color-apple-border)]/50 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Import
        </button>
        <button
          onClick={onExport}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-[var(--color-apple-text)] hover:bg-[var(--color-apple-border)]/50 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>
    </div>
  );
}
