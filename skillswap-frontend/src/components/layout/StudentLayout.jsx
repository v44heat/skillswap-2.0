import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../common/Sidebar';

export default function StudentLayout() {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', background: 'var(--bg)' }}>
      <Sidebar />
      <main style={{ flex: 1, overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
