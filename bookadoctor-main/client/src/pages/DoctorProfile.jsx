import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import api from '../services/api';
import toast from 'react-hot-toast';

export const DoctorProfile = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    specialization: '',
    experience: '',
    fees: '',
    startTime: '09:00',
    endTime: '18:00',
  });

  const fetchDoctorProfile = async () => {
    try {
      setLoading(true);
      const res = await api.post('/doctor/getDoctorInfo');
      if (res.data.success && res.data.data) {
        const doc = res.data.data;
        setFormData({
          name: doc.name || '',
          phone: doc.phone || '',
          email: doc.email || '',
          address: doc.address || '',
          specialization: doc.specialization || '',
          experience: doc.experience || '',
          fees: doc.fees || '',
          startTime: doc.timings?.[0] || '09:00',
          endTime: doc.timings?.[1] || '18:00',
        });
      }
    } catch (error) {
      console.error('Fetch doctor error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const payload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        specialization: formData.specialization,
        experience: formData.experience,
        fees: Number(formData.fees),
        timings: [formData.startTime, formData.endTime],
      };

      const res = await api.post('/doctor/updateProfile', payload);
      if (res.data.success) {
        toast.success(res.data.message || 'Profile updated successfully!');
      } else {
        toast.error(res.data.message || 'Update failed');
      }
    } catch (error) {
      console.error('Update profile error:', error);
      toast.error(error.response?.data?.message || 'Error updating profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="apply-doctor-container">
        <h2 className="apply-title">Manage Doctor Profile</h2>

        {loading ? (
          <div className="card-loader">
            <div className="spinner"></div>
            <p>Loading profile...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="apply-form">
            <div className="form-section">
              <h3 className="section-title">Personal Details:</h3>
              <div className="form-grid-3">
                <div className="form-field">
                  <label><span className="required-star">*</span> Full Name:</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-field">
                  <label><span className="required-star">*</span> Phone:</label>
                  <input
                    type="text"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-field">
                  <label><span className="required-star">*</span> Email:</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-grid-1">
                <div className="form-field">
                  <label><span className="required-star">*</span> Address:</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">Professional Details:</h3>
              <div className="form-grid-3">
                <div className="form-field">
                  <label><span className="required-star">*</span> Specialization:</label>
                  <input
                    type="text"
                    name="specialization"
                    required
                    value={formData.specialization}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-field">
                  <label><span className="required-star">*</span> Experience:</label>
                  <input
                    type="text"
                    name="experience"
                    required
                    value={formData.experience}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-field">
                  <label><span className="required-star">*</span> Fees:</label>
                  <input
                    type="number"
                    name="fees"
                    required
                    value={formData.fees}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-grid-1">
                <div className="form-field timings-field">
                  <label><span className="required-star">*</span> Timings:</label>
                  <div className="timings-input-group">
                    <input
                      type="time"
                      name="startTime"
                      required
                      value={formData.startTime}
                      onChange={handleChange}
                      className="time-input"
                    />
                    <span className="timing-separator">→</span>
                    <input
                      type="time"
                      name="endTime"
                      required
                      value={formData.endTime}
                      onChange={handleChange}
                      className="time-input"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-actions-right">
              <button
                type="submit"
                className="btn btn-primary btn-submit-apply"
                disabled={submitting}
              >
                {submitting ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
        )}
      </div>
    </Layout>
  );
};

export default DoctorProfile;
