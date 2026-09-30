import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import api from '../services/api';
import toast from 'react-hot-toast';
import { FileText, Download, Check, X } from 'lucide-react';

export const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDoctorAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get('/doctor/doctor-appointments');
      if (res.data.success) {
        setAppointments(res.data.data || []);
      }
    } catch (error) {
      console.error('Fetch doctor appointments error:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorAppointments();
  }, []);

  const handleStatusChange = async (appointmentId, status) => {
    try {
      const res = await api.post('/doctor/change-appointment-status', {
        appointmentId,
        status,
      });
      if (res.data.success) {
        toast.success(`Appointment ${status} successfully!`);
        fetchDoctorAppointments();
      } else {
        toast.error(res.data.message || 'Action failed');
      }
    } catch (error) {
      console.error('Update status error:', error);
      toast.error(error.response?.data?.message || 'Error updating status');
    }
  };

  return (
    <Layout>
      <div className="admin-page-container">
        <h2 className="table-title">Doctor Appointments</h2>

        {loading ? (
          <div className="card-loader">
            <div className="spinner"></div>
            <p>Loading appointments...</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="empty-state">
            <p>No appointments booked yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Patient Name</th>
                  <th>Patient Email</th>
                  <th>Date & Time</th>
                  <th>Document</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => {
                  const statusClass = `status-pill status-${appt.status.toLowerCase()}`;
                  return (
                    <tr key={appt._id}>
                      <td className="name-cell">{appt.userInfo?.name || 'Patient'}</td>
                      <td>{appt.userInfo?.email || '-'}</td>
                      <td>
                        {appt.date} at {appt.time}
                      </td>
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
                      <td className="action-cell">
                        {appt.status === 'pending' ? (
                          <div className="action-button-group">
                            <button
                              onClick={() => handleStatusChange(appt._id, 'approved')}
                              className="btn-table btn-approve"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusChange(appt._id, 'rejected')}
                              className="btn-table btn-reject"
                            >
                              Reject
                            </button>
                          </div>
                        ) : appt.status === 'approved' ? (
                          <button
                            onClick={() => handleStatusChange(appt._id, 'rejected')}
                            className="btn-table btn-reject"
                          >
                            Reject
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(appt._id, 'approved')}
                            className="btn-table btn-approve"
                          >
                            Approve
                          </button>
                        )}
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

export default DoctorAppointments;
