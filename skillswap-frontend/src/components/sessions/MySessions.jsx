import React, { useState, useEffect, useCallback } from 'react';
import sessionService from '../../services/sessionService';
import feedbackService from '../../services/feedbackService';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { Badge, Modal, ConfirmModal, EmptyState, Spinner, StarRating } from '../common/UI';
import { formatDate, formatTime, statusBadgeColor } from '../../utils/helpers';

export default function MySessions() {
  const [tab, setTab] = useState('upcoming');
  const [upcoming, setUpcoming] = useState([]);
  const [past, setPast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelId, setCancelId] = useState(null);
  const [rateSession, setRateSession] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [rateLoading, setRateLoading] = useState(false);
  const { user } = useAuth();
  const toast = useToast();

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [upRes, pastRes] = await Promise.all([sessionService.getUpcoming(), sessionService.getPast()]);
      setUpcoming(upRes.data);
      setPast(pastRes.data);
    } catch { toast('Failed to load sessions.', 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleCancel = async () => {
    try {
      await sessionService.cancel(cancelId);
      toast('Session cancelled.');
      setCancelId(null);
      fetchAll();
    } catch (err) {
      toast(err.response?.data?.message || 'Failed to cancel session.', 'error');
    }
  };

  const handleComplete = async (id) => {
    try {
      await sessionService.complete(id);
      toast('Session marked as completed!');
      fetchAll();
    } catch { toast('Failed to update session.', 'error'); }
  };

  const handleRate = async () => {
    if (rating === 0) { toast('Please select a rating.', 'error'); return; }
    setRateLoading(true);
    try {
      await feedbackService.submit({ sessionId: rateSession.id, rating, comment });
      toast('Feedback submitted! Thank you.');
      setRateSession(null); setRating(0); setComment('');
      fetchAll();
    } catch { toast('Failed to submit feedback.', 'error'); }
    finally { setRateLoading(false); }
  };

  const SessionCard = ({ session }) => {
    const isTeacher = session.teacherId === user.id;
    return (
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{session.skillName}</h3>
            <p style={{ fontSize: 13, color: 'var(--text2)' }}>
              {isTeacher ? `Teaching ${session.learnerName}` : `Learning from ${session.teacherName}`}
            </p>
          </div>
          <Badge text={session.status} color={statusBadgeColor(session.status)} />
        </div>

        <div style={{ display: 'flex', gap: 20, fontSize: 13, color: 'var(--text2)', flexWrap: 'wrap' }}>
          <span>📅 {formatDate(session.sessionDate)}</span>
          <span>🕐 {formatTime(session.startTime)}</span>
          {session.location && session.location !== 'TBD' && <span>📍 {session.location}</span>}
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {session.status === 'CONFIRMED' && (
            <button className="btn btn-danger btn-sm" onClick={() => setCancelId(session.id)}>Cancel</button>
          )}
          {session.status === 'CONFIRMED' && isTeacher && (
            <button className="btn btn-success btn-sm" onClick={() => handleComplete(session.id)}>✓ Mark complete</button>
          )}
          {session.status === 'COMPLETED' && !isTeacher && !session.hasRated && (
            <button className="btn btn-primary btn-sm" onClick={() => setRateSession(session)}>⭐ Rate & Feedback</button>
          )}
          {session.status === 'COMPLETED' && !isTeacher && session.hasRated && (
            <Badge text="Rated" color="green" />
          )}
        </div>
      </div>
    );
  };

  const list = tab === 'upcoming' ? upcoming : past;

  return (
    <div style={{ padding: 28 }}>
      <h1 className="page-title">My Sessions</h1>
      <p className="page-sub">Track your upcoming and past learning sessions</p>

      <div className="tab-bar">
        <button className={`tab${tab === 'upcoming' ? ' active' : ''}`} onClick={() => setTab('upcoming')}>
          Upcoming ({upcoming.length})
        </button>
        <button className={`tab${tab === 'past' ? ' active' : ''}`} onClick={() => setTab('past')}>
          Past ({past.length})
        </button>
      </div>

      {loading
        ? <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><Spinner size={32} /></div>
        : list.length === 0
        ? <EmptyState
            icon={tab === 'upcoming' ? '📅' : '🕰️'}
            title={tab === 'upcoming' ? 'No upcoming sessions' : 'No past sessions'}
            subtitle={tab === 'upcoming' ? 'Accept a request or request a skill to schedule a session.' : 'Completed sessions will appear here.'}
          />
        : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {list.map((s) => <SessionCard key={s.id} session={s} />)}
          </div>
        )
      }

      {cancelId && (
        <ConfirmModal
          title="Cancel Session"
          message="Are you sure you want to cancel this session? Both parties will be notified."
          onConfirm={handleCancel}
          onClose={() => setCancelId(null)}
          danger
          confirmLabel="Cancel session"
        />
      )}

      {rateSession && (
        <Modal title="Rate & Feedback" onClose={() => { setRateSession(null); setRating(0); setComment(''); }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ color: 'var(--text2)', fontSize: 14 }}>
              How was your session learning <strong>{rateSession.skillName}</strong> from <strong>{rateSession.teacherName}</strong>?
            </p>
            <div style={{ padding: '8px 0' }}>
              <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text3)', marginBottom: 8 }}>Tap a star to rate</p>
              <StarRating value={rating} onChange={setRating} />
            </div>
            <div>
              <label className="label">Comment (optional)</label>
              <textarea className="textarea" placeholder="Share your experience to help others..." value={comment} onChange={(e) => setComment(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-outline" onClick={() => { setRateSession(null); setRating(0); setComment(''); }}>Cancel</button>
              <button className="btn btn-primary" onClick={handleRate} disabled={rateLoading}>{rateLoading ? <Spinner /> : 'Submit feedback'}</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
