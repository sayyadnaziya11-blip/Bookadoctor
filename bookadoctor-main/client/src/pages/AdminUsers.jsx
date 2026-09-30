import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import api from '../services/api';
import toast from 'react-hot-toast';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/getAllUsers');
      if (res.data.success) {
        setUsers(res.data.data || []);
      }
    } catch (error) {
      console.error('Fetch users error:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Layout>
      <div className="admin-page-container">
        <h2 className="table-title">All Users</h2>

        {loading ? (
          <div className="card-loader">
            <div className="spinner"></div>
            <p>Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="empty-state">
            <p>No registered users found.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Registered On</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  const roleBadge = u.isAdmin
                    ? 'Admin'
                    : u.isDoctor
                    ? 'Doctor'
                    : 'User / Patient';

                  return (
                    <tr key={u._id}>
                      <td className="key-cell">{u._id}</td>
                      <td className="name-cell">{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`role-badge role-${roleBadge.toLowerCase().replace(/[^a-z]/g, '')}`}>
                          {roleBadge}
                        </span>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString()}</td>
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

export default AdminUsers;
