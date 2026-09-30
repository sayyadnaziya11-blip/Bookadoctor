import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { BookingModal } from '../components/BookingModal';
import api from '../services/api';
import toast from 'react-hot-toast';
import { User, Phone, MapPin, Briefcase, Award, Clock, DollarSign } from 'lucide-react';

export const Home = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchApprovedDoctors = async () => {
    try {
      setLoading(true);
      const res = await api.get('/user/getAllDoctors');
      if (res.data.success) {
        setDoctors(res.data.data || []);
      }
    } catch (error) {
      console.error('Fetch doctors error:', error);
      toast.error('Failed to load doctors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovedDoctors();
  }, []);

  const handleBookClick = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  return (
    <Layout>
      <div className="page-header-row">
        <h2>Available Doctors</h2>
        <span className="badge-total">{doctors.length} Doctors</span>
      </div>

      {loading ? (
        <div className="card-loader">
          <div className="spinner"></div>
          <p>Loading available doctors...</p>
        </div>
      ) : doctors.length === 0 ? (
        <div className="empty-state">
          <p>No approved doctors available at the moment. Please check back soon!</p>
        </div>
      ) : (
        <div className="doctors-grid">
          {doctors.map((doctor) => {
            const formattedName = doctor.name.startsWith('Dr.')
              ? doctor.name
              : `Dr. ${doctor.name}`;

            const timingText = Array.isArray(doctor.timings)
              ? `${doctor.timings[0]} : ${doctor.timings[1]}`
              : '09:00 : 18:00';

            return (
              <div key={doctor._id} className="doctor-card">
                <div className="doctor-card-header">
                  <h3>{formattedName}</h3>
                </div>
                <div className="doctor-card-body">
                  <div className="doc-info-row">
                    <span className="doc-info-label">Phone:</span>
                    <span className="doc-info-value">{doctor.phone}</span>
                  </div>
                  <div className="doc-info-row">
                    <span className="doc-info-label">Address:</span>
                    <span className="doc-info-value">{doctor.address}</span>
                  </div>
                  <div className="doc-info-row">
                    <span className="doc-info-label">Specialization:</span>
                    <span className="doc-info-value">{doctor.specialization}</span>
                  </div>
                  <div className="doc-info-row">
                    <span className="doc-info-label">Experience:</span>
                    <span className="doc-info-value">{doctor.experience}</span>
                  </div>
                  <div className="doc-info-row">
                    <span className="doc-info-label">Fees:</span>
                    <span className="doc-info-value">{doctor.fees}</span>
                  </div>
                  <div className="doc-info-row">
                    <span className="doc-info-label">Timing:</span>
                    <span className="doc-info-value">{timingText}</span>
                  </div>
                </div>
                <div className="doctor-card-footer">
                  <button
                    onClick={() => handleBookClick(doctor)}
                    className="btn btn-primary btn-book-now"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        doctor={selectedDoctor}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchApprovedDoctors();
        }}
      />
    </Layout>
  );
};

export default Home;
