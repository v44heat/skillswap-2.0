import React, { useState, useEffect, useCallback } from 'react';
import requestService from '../../services/requestService';
import { useToast } from '../../hooks/useToast';
import { Badge, Modal, ConfirmModal, EmptyState, Spinner, ErrorBox } from '../common/UI';
import { formatDate, formatTime, statusBadgeColor } from '../../utils/helpers';

function RequestCard({ request, isSent, onCancel, onAccept, onReject }) {
  const [confirmCancel, setConfirmCancel] = useState(false);

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{request.skillName}</h3>
          <p style={{ fontSize: 13, color: 'var(--text2)' }}>
            {isSent ? `Teacher: ${request.teacherName}` : `From: ${request.requesterName} (${request.requesterStudentId})`}
          </p>
        </div>
        <Badge text={request.status} color={statusBadgeColor(request.status)} />
      </div>

      <div style={{ display: 'flex', gap: 20, fontSize: 13, color: 'var(--text2)' }}>
        <span>📅 {formatDate(request.preferredDate)}</span>
        <span>🕐 {formatTime(request.preferredTime)}</span>
      </div>

      {request.message && (
        <div style={{ background: 'var(--card2)', padding: '8px 12px', borderRadius: 8, fontSize: 13, color: 'var(--text2)' }}>
          "{request.message}"
        </div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        {isSent && request.status === 'PENDING' && (
          <>
            <button className="btn btn-danger btn-sm" onClick={() => setConfirmCancel(true)}>Cancel request</button>
            {confirmCancel && (
              <ConfirmModal
                title="Cancel Request"
                message="Are you sure you want to cancel this session request?"
                onConfirm={() => onCancel(request.id)}
                onClose={() => setConfirmCancel(false)}
                danger
                confirmLabel="Yes, cancel"
              />
            )}
          </>
        )}
        {!isSent && request.status === 'PENDING' && (
          <>
            <button className="btn btn-success btn-sm" onClick={() => onAccept(request)}>✓ Accept</button>
            <button className="btn btn-danger btn-sm" onClick={() => onReject(request)}>✕ Reject</button>
          </>
        )}
      </div>
    </div>
  );
}

export default function MyRequests() {
  const [tab, setTab] = useState('sent');
  const [sent, setSent] = useState([]);
  const [received, setReceived] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectLoading, setRejectLoading] = useState(false);
  const toast = useToast();

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [sentRes, recRes] = await Promise.all([requestService.getSent(), requestService.getReceived()]);
      setSent(sentRes.data);
      setReceived(recRes.data);
    } catch { toast('Failed to load requests.', 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleCancel = async (id) => {
    await requestService.cancel(id);
    toast('Request cancelled.');
    fetchAll();
  };

  const handleAccept = async (request) => {
    try {
      await requestService.accept(request.id);
      toast('Request accepted! Session created.');
      fetchAll();
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to accept request.', 'error');
    }
  };

  const handleReject = async () => {
    setRejectLoading(true);
    try {
      await requestService.reject(rejectModal.id, rejectReason);
      toast('Request rejected.');
      setRejectModal(null);
      setRejectReason('');
      fetchAll();
    } catch {
      toast('Failed to reject request.', 'error');
    } finally { setRejectLoading(false); }
  };

  const list = tab === 'sent' ? sent : received;

  return (
    <div style={{ padding: 28 }}>
      <h1 className="page-title">My Requests</h1>
      <p className="page-sub">Manage your sent and received session requests</p>

      <div className="tab-bar">
        <button className={`tab${tab === 'sent' ? ' active' : ''}`} onClick={() => setTab('sent')}>
          Sent ({sent.length})
        </button>
        <button className={`tab${tab === 'received' ? ' active' : ''}`} onClick={() => setTab('received')}>
          Received ({received.filter((r) => r.status === 'PENDING').length} pending)
        </button>
      </div>

      {loading
        ? <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner size={32} /></div>
        : list.length === 0
        ? <EmptyState
            icon="📭"
            title={tab === 'sent' ? "No sent requests" : "No received requests"}
            subtitle={tab === 'sent' ? "Browse skills and request a session to get started." : "When students request your skills, they'll appear here."}
          />
        : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {list.map((r) => (
              <RequestCard
                key={r.id}
                request={r}
                isSent={tab === 'sent'}
                onCancel={handleCancel}
                onAccept={handleAccept}
                onReject={(req) => setRejectModal(req)}
              />
            ))}
          </div>
        )
      }

      {rejectModal && (
        <Modal title="Reject Request" onClose={() => { setRejectModal(null); setRejectReason(''); }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ color: 'var(--text2)', fontSize: 14 }}>
              Rejecting <strong>{rejectModal.requesterName}</strong>'s request to learn <strong>{rejectModal.skillName}</strong>.
            </p>
            <div>
              <label className="label">Reason (optional)</label>
              <textarea className="textarea" placeholder="Let them know why you can't accept..." value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => { setRejectModal(null); setRejectReason(''); }}>Cancel</button>
              <button className="btn btn-danger" onClick={handleReject} disabled={rejectLoading}>{rejectLoading ? <Spinner /> : 'Reject request'}</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
