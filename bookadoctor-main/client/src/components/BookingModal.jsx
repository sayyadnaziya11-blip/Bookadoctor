import React, { useState } from 'react';
import { X, Calendar, Upload } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const BookingModal = ({ doctor, isOpen, onClose, onSuccess }) => {
  const [dateTime, setDateTime] = useState('');
  const [documentFile, setDocumentFile] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !doctor) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!dateTime) {
      toast.error('Please select an appointment date and time');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('doctorId', doctor._id);
      
      // Parse datetime
      const dateObj = new Date(dateTime);
      const dateStr = dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });
      const timeStr = dateObj.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });

      formData.append('date', dateStr);
      formData.append('time', timeStr);
      formData.append('doctorInfo', JSON.stringify({
        name: doctor.name,
        specialization: doctor.specialization,
        fees: doctor.fees,
        phone: doctor.phone,
        address: doctor.address,
      }));

      if (documentFile) {
        formData.append('document', documentFile);
      }

      const res = await api.post('/user/book-appointment', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        toast.success(res.data.message || 'Appointment booked successfully!');
        if (onSuccess) onSuccess();
        onClose();
      } else {
        toast.error(res.data.message || 'Failed to book appointment');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.message || 'Error booking appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {/* Modal Header */}
        <div className="modal-header">
          <h3>Booking appointment</h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="doctor-details-section">
              <h4>Doctor Details:</h4>
              <p className="doc-detail-line">
                <span className="label">Name:</span> {doctor.name.replace(/^Dr\.\s*/i, '')}
              </p>
              <p className="doc-detail-line">
                <span className="label">Specialization:</span> <strong>{doctor.specialization}</strong>
              </p>
            </div>

            <hr className="modal-divider" />

            <div className="modal-form-group">
              <label>Appointment Date and Time:</label>
              <div className="input-with-icon">
                <input
                  type="datetime-local"
                  required
                  value={dateTime}
                  onChange={(e) => setDateTime(e.target.value)}
                  className="modal-input"
                />
              </div>
            </div>

            <div className="modal-form-group">
              <label>Documents</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  id="document-upload"
                  onChange={(e) => setDocumentFile(e.target.files[0])}
                  className="file-input-hidden"
                />
                <label htmlFor="document-upload" className="file-input-label">
                  <span className="choose-btn">Choose File</span>
                  <span className="file-name">
                    {documentFile ? documentFile.name : 'No file chosen'}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Close
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Booking...' : 'Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
