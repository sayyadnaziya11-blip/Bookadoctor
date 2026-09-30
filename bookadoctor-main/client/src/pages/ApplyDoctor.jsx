import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ApplyDoctor = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [alertMessage, setAlertMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    email: user?.email || '',
    address: '',
    specialization: '',
    experience: '',
    fees: '',
    startTime: '06:00',
    endTime: '12:00',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
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

      const res = await api.post('/user/apply-doctor', payload);
      if (res.data.success) {
        setAlertMessage(res.data.message || 'Doctor Registration request sent successfully');
        toast.success(res.data.message || 'Doctor Registration request sent successfully');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        toast.error(res.data.message || 'Application failed');
      }
    } catch (error) {
      console.error('Apply doctor error:', error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout alertMessage={alertMessage}>
      <div className="apply-doctor-container">
        <h2 className="apply-title">Apply for Doctor</h2>

        <form onSubmit={handleSubmit} className="apply-form">
          {/* Personal Details */}
          <div className="form-section">
            <h3 className="section-title">Personal Details:</h3>
            
            <div className="form-grid-3">
              <div className="form-field">
                <label><span className="required-star">*</span> Full Name:</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. SHIVA"
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
                  placeholder="e.g. 91755584121"
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
                  placeholder="e.g. user@gmail.com"
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
                  placeholder="e.g. chennai"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div className="form-section">
            <h3 className="section-title">Professional Details:</h3>

            <div className="form-grid-3">
              <div className="form-field">
                <label><span className="required-star">*</span> Specialization:</label>
                <input
                  type="text"
                  name="specialization"
                  required
                  placeholder="e.g. Blood / ENT / Cardiology"
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
                  placeholder="e.g. 2"
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
                  placeholder="e.g. 5001"
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
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ApplyDoctor;
