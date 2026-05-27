import React, { createContext, useState, useCallback } from 'react';

export const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = ++idCounter;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const colors = {
    success: 'background:#15803d;',
    error:   'background:#b91c1c;',
    info:    'background:#1d4ed8;',
  };

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '11px 16px', borderRadius: 10, color: '#fff',
              boxShadow: '0 4px 20px rgba(0,0,0,.4)', minWidth: 240, maxWidth: 360,
              fontSize: 14, fontWeight: 500, animation: 'slideIn .2s ease',
              ...(t.type === 'success' ? { background: '#15803d' } : t.type === 'error' ? { background: '#b91c1c' } : { background: '#1d4ed8' }),
            }}
          >
            <span style={{ fontSize: 16 }}>{icons[t.type] || icons.info}</span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
