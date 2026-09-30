import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import api from '../services/api';
import toast from 'react-hot-toast';

export const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState('');

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/getAllDoctors');
      if (res.data.success) {
        setDoctors(res.data.data || []);
      }
    } catch (error) {
      console.error('Fetch doctors error:', error);
      toast.error('Failed to load doctors list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleStatusChange = async (doctorId, status) => {
    try {
      const res = await api.post('/admin/changeDoctorStatus', {
        doctorId,
        status,
      });
      if (res.data.success) {
        setAlertMessage(res.data.message || 'Successfully updated approve status of the doctor!');
        toast.success(res.data.message || 'Doctor status updated!');
        fetchDoctors();
      } else {
        toast.error(res.data.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Status change error:', error);
      toast.error(error.response?.data?.message || 'Error updating status');
    }
  };

  return (
    <Layout alertMessage={alertMessage}>
      <div className="admin-page-container">
        <h2 className="table-title">All Doctors</h2>

        {loading ? (
          <div className="card-loader">
            <div className="spinner"></div>
            <p>Loading doctors...</p>
          </div>
        ) : doctors.length === 0 ? (
          <div className="empty-state">
            <p>No doctor applications registered yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor) => {
                  return (
                    <tr key={doctor._id}>
                      <td className="key-cell">{doctor._id}</td>
                      <td className="name-cell">{doctor.name.replace(/^Dr\.\s*/i, '')}</td>
                      <td>{doctor.email}</td>
                      <td>{doctor.phone}</td>
                      <td className="action-cell">
                        {doctor.status === 'pending' ? (
                          <div className="action-button-group">
                            <button
                              onClick={() => handleStatusChange(doctor._id, 'approved')}
                              className="btn-table btn-approve"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleStatusChange(doctor._id, 'rejected')}
                              className="btn-table btn-reject"
                            >
                              Reject
                            </button>
                          </div>
                        ) : doctor.status === 'approved' ? (
                          <button
                            onClick={() => handleStatusChange(doctor._id, 'rejected')}
                            className="btn-table btn-reject"
                          >
                            Reject
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(doctor._id, 'approved')}
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

export default AdminDoctors;
