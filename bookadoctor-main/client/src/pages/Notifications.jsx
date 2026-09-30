import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { Bell, CheckCheck, Trash2, ArrowRight } from 'lucide-react';

export const Notifications = () => {
  const { user, fetchUserData } = useAuth();
  const [activeTab, setActiveTab] = useState(0); // 0 = Unseen, 1 = Seen
  const navigate = useNavigate();

  const handleMarkAllAsSeen = async () => {
    try {
      const res = await api.post('/user/get-all-notification');
      if (res.data.success) {
        toast.success('All notifications marked as read');
        fetchUserData();
      }
    } catch (error) {
      console.error('Error marking seen:', error);
      toast.error('Failed to mark notifications');
    }
  };

  const handleDeleteAllSeen = async () => {
    try {
      const res = await api.post('/user/delete-all-notification');
      if (res.data.success) {
        toast.success('All notifications deleted');
        fetchUserData();
      }
    } catch (error) {
      console.error('Error deleting notifications:', error);
      toast.error('Failed to delete notifications');
    }
  };

  const unseenList = user?.unseenNotifications || [];
  const seenList = user?.seenNotifications || [];

  return (
    <Layout>
      <div className="notifications-container">
        <h2 className="table-title">Notifications</h2>

        {/* Tab Controls */}
        <div className="notifications-tab-bar">
          <div className="tab-buttons">
            <button
              className={`tab-btn ${activeTab === 0 ? 'active' : ''}`}
              onClick={() => setActiveTab(0)}
            >
              Unseen ({unseenList.length})
            </button>
            <button
              className={`tab-btn ${activeTab === 1 ? 'active' : ''}`}
              onClick={() => setActiveTab(1)}
            >
              Seen ({seenList.length})
            </button>
          </div>

          <div className="tab-actions">
            {activeTab === 0 && unseenList.length > 0 && (
              <button
                className="btn btn-outline"
                onClick={handleMarkAllAsSeen}
              >
                <CheckCheck size={16} />
                <span>Mark all as read</span>
              </button>
            )}
            {activeTab === 1 && seenList.length > 0 && (
              <button
                className="btn btn-outline text-danger"
                onClick={handleDeleteAllSeen}
              >
                <Trash2 size={16} />
                <span>Delete all seen</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Content */}
        <div className="notification-list-wrapper">
          {activeTab === 0 && (
            unseenList.length === 0 ? (
              <div className="empty-state">
                <Bell size={40} className="empty-icon" />
                <p>No new notifications.</p>
              </div>
            ) : (
              <div className="notification-list">
                {unseenList.map((notif, idx) => (
                  <div
                    key={idx}
                    className="notification-card unread"
                    onClick={() => {
                      if (notif.data?.onClickPath) {
                        navigate(notif.data.onClickPath);
                      }
                    }}
                  >
                    <div className="notif-content">
                      <p className="notif-message">{notif.message}</p>
                      {notif.createdAt && (
                        <span className="notif-time">
                          {new Date(notif.createdAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                    {notif.data?.onClickPath && (
                      <ArrowRight size={18} className="notif-arrow" />
                    )}
                  </div>
                ))}
              </div>
            )
          )}

          {activeTab === 1 && (
            seenList.length === 0 ? (
              <div className="empty-state">
                <p>No read notifications yet.</p>
              </div>
            ) : (
              <div className="notification-list">
                {seenList.map((notif, idx) => (
                  <div
                    key={idx}
                    className="notification-card"
                    onClick={() => {
                      if (notif.data?.onClickPath) {
                        navigate(notif.data.onClickPath);
                      }
                    }}
                  >
                    <div className="notif-content">
                      <p className="notif-message">{notif.message}</p>
                      {notif.createdAt && (
                        <span className="notif-time">
                          {new Date(notif.createdAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                    {notif.data?.onClickPath && (
                      <ArrowRight size={18} className="notif-arrow" />
                    )}
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Notifications;
