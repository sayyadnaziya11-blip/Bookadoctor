import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FileText, Download, Clock, DollarSign } from 'lucide-react';

export const UserAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/user/user-appointments');
      if (res.data.success) {
        setAppointments(res.data.data || []);
      }
    } catch (error) {
      console.error('Fetch appointments error:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <Layout>
      <div className="admin-page-container">
        <h2 className="table-title">Appointments History</h2>

        {loading ? (
          <div className="card-loader">
            <div className="spinner"></div>
            <p>Loading your appointments...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="empty-state">
            <p>You haven't booked any appointments yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Doctor Name</th>
                  <th>Specialization</th>
                  <th>Date & Time</th>
                  <th>Consultation Fee</th>
                  <th>Attached Document</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => {
                  const statusClass = `status-pill status-${appt.status.toLowerCase()}`;
                  return (
                    <tr key={appt._id}>
                      <td className="name-cell">
                        {appt.doctorInfo?.name?.startsWith('Dr.')
                          ? appt.doctorInfo.name
                          : `Dr. ${appt.doctorInfo?.name || 'Doctor'}`}
                      </td>
                      <td>{appt.doctorInfo?.specialization || '-'}</td>
                      <td>
                        {appt.date} at {appt.time}
                      </td>
                      <td>₹ {appt.doctorInfo?.fees || 0}</td>
                      <td>
                        {appt.documentUrl ? (
                          <a
                            href={appt.documentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="doc-link"
                          >
                            <FileText size={16} />
                            <span>{appt.documentName || 'View Document'}</span>
                          </a>
                        ) : (
                          <span className="text-muted">None</span>
                        )}
                      </td>
                      <td>
                        <span className={statusClass}>
                          {appt.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserAppointments;
