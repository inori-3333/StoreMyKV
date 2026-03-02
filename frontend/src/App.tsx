import { useState, useEffect } from 'react';
import Sidebar, { type ViewType } from './components/Sidebar';
import ListView from './components/ListView';
import ItemModal from './components/ItemModal';
import type { AppData, PasswordEntry, ApiKeyEntry } from './types';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('passwords');
  const [data, setData] = useState<AppData>({ passwords: [], apiKeys: [] });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // @ts-ignore
      if (window.electron && window.electron.getData) {
        // @ts-ignore
        const loadedData = await window.electron.getData();
        setData(loadedData);
      }
    } catch (e) {
      console.error('Failed to load data:', e);
    }
  };

  const saveData = async (newData: AppData) => {
    try {
      setData(newData);
      // @ts-ignore
      if (window.electron && window.electron.saveData) {
        // @ts-ignore
        await window.electron.saveData(newData);
      }
    } catch (e) {
      console.error('Failed to save data:', e);
    }
  };

  const handleExport = async () => {
    try {
      // @ts-ignore
      if (window.electron && window.electron.exportData) {
        // @ts-ignore
        const res = await window.electron.exportData();
        if (res.success) {
          alert('Export successful to: ' + res.path);
        } else if (res.error !== 'Cancelled') {
          alert('Export failed: ' + res.error);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleImport = async () => {
    try {
      // @ts-ignore
      if (window.electron && window.electron.importData) {
        // @ts-ignore
        const res = await window.electron.importData();
        if (res.success) {
          alert('Import successful. Reloading data.');
          window.location.reload();
        } else if (res.error !== 'Cancelled') {
          alert('Import failed: ' + res.error);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      const newData = { ...data };
      if (currentView === 'passwords') {
        newData.passwords = newData.passwords.filter(p => p.id !== id);
      } else {
        newData.apiKeys = newData.apiKeys.filter(a => a.id !== id);
      }
      saveData(newData);
    }
  };

  const handleSaveItem = (itemData: any) => {
    const newData = { ...data };

    if (editingItem) {
      // Edit existing
      if (currentView === 'passwords') {
        const index = newData.passwords.findIndex(p => p.id === editingItem.id);
        if (index !== -1) newData.passwords[index] = { ...editingItem, ...itemData };
      } else {
        const index = newData.apiKeys.findIndex(a => a.id === editingItem.id);
        if (index !== -1) newData.apiKeys[index] = { ...editingItem, ...itemData };
      }
    } else {
      // Add new
      const newItem = {
        ...itemData,
        id: Date.now().toString() + Math.random().toString(36).substring(2, 9)
      };

      if (currentView === 'passwords') {
        newData.passwords.push(newItem as PasswordEntry);
      } else {
        newData.apiKeys.push(newItem as ApiKeyEntry);
      }
    }

    saveData(newData);
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[var(--color-apple-bg)] text-[var(--color-apple-text)]">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        onExport={handleExport}
        onImport={handleImport}
      />
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[var(--color-apple-surface)] shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.05)] relative z-10 app-region-no-drag pt-8">
        <div className="p-8 h-full flex flex-col">
          <h1 className="text-3xl font-semibold mb-6 capitalize tracking-tight">
            {currentView === 'apikeys' ? 'API Keys' : currentView}
          </h1>
          <div className="flex-1 overflow-hidden">
            {currentView === 'passwords' && (
              <ListView
                type="passwords"
                items={data.passwords || []}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
            {currentView === 'apikeys' && (
              <ListView
                type="apikeys"
                items={data.apiKeys || []}
                onAdd={handleAdd}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>
      </main>

      <ItemModal
        isOpen={isModalOpen}
        type={currentView}
        initialData={editingItem}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveItem}
      />
    </div>
  );
}

export default App;
