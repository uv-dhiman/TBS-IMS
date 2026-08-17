import React, { useState, useEffect } from 'react';
import { getStudents, createStudent, updateStudentFee } from '../api';

const AdminDashboard = ({ currentUser, onLogout }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  // Fee modal state
  const [feeModalStudent, setFeeModalStudent] = useState(null);
  const [collectAmount, setCollectAmount] = useState('');
  const [feeLoading, setFeeLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: 'Diploma in Pastry & Baking',
    totalFee: 15000,
    initialPaidAmount: 5000
  });

  // Fetch all students data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await getStudents();
      const list = Array.isArray(res.data) ? res.data : (res.data?.students || []);
      setStudents(list);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handle Form Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit Admission
  const handleAdmissionSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    setModalLoading(true);

    try {
      await createStudent(formData);
      setShowAdmissionModal(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        course: 'Diploma in Pastry & Baking',
        totalFee: 15000,
        initialPaidAmount: 5000
      });
      await fetchDashboardData();
    } catch (err) {
      console.error('Admission submit error:', err);
      setModalError(err.response?.data?.message || 'Error submitting admission');
    } finally {
      setModalLoading(false);
    }
  };

  // Submit Fee Collection
  const handleFeeSubmit = async (e) => {
    e.preventDefault();
    if (!feeModalStudent || !collectAmount) return;
    setFeeLoading(true);

    try {
      await updateStudentFee(feeModalStudent._id, Number(collectAmount));
      setFeeModalStudent(null);
      setCollectAmount('');
      await fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error collecting fee');
    } finally {
      setFeeLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '24px', fontFamily: 'sans-serif' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1e293b', color: '#fff', padding: '16px 24px', borderRadius: '12px', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px' }}>The Baking School IMS</h2>
          <small style={{ color: '#94a3b8' }}>Logged in as: {currentUser?.email || 'Admin'}</small>
        </div>
        <button 
          onClick={onLogout} 
          style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Logout
        </button>
      </div>

      {/* Action Buttons & Summary Stats */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button 
          onClick={() => setShowAdmissionModal(true)} 
          style={{ background: '#d97706', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          + New Admission
        </button>

        <div style={{ background: '#fff', padding: '12px 24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', flex: 1, minWidth: '180px' }}>
          <span style={{ color: '#64748b', fontSize: '13px' }}>Total Enrolled Students</span>
          <h3 style={{ margin: '4px 0 0', fontSize: '24px', color: '#0f172a' }}>{students.length}</h3>
        </div>
      </div>

      {/* Students Table */}
      <div style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#1e293b' }}>Recent Admissions</h3>
        
        {loading ? (
          <p>Loading students data...</p>
        ) : students.length === 0 ? (
          <p style={{ color: '#64748b' }}>No students enrolled yet. Click "+ New Admission" to add.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f1f5f9', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '12px' }}>Name</th>
                  <th style={{ padding: '12px' }}>Email</th>
                  <th style={{ padding: '12px' }}>Phone</th>
                  <th style={{ padding: '12px' }}>Course</th>
                  <th style={{ padding: '12px' }}>Total Fee</th>
                  <th style={{ padding: '12px' }}>Paid Fee</th>
                  <th style={{ padding: '12px' }}>Due Fee</th>
                  <th style={{ padding: '12px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((st) => (
                  <tr key={st._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{st.name}</td>
                    <td style={{ padding: '12px', color: '#64748b' }}>{st.email}</td>
                    <td style={{ padding: '12px' }}>{st.phone}</td>
                    <td style={{ padding: '12px' }}>{st.course}</td>
                    <td style={{ padding: '12px' }}>₹{st.totalFee}</td>
                    <td style={{ padding: '12px', color: '#16a34a' }}>₹{st.paidFee}</td>
                    <td style={{ padding: '12px', color: st.dueFee > 0 ? '#dc2626' : '#16a34a' }}>₹{st.dueFee}</td>
                    <td style={{ padding: '12px' }}>
                      {st.dueFee > 0 ? (
                        <button 
                          onClick={() => setFeeModalStudent(st)} 
                          style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                        >
                          Collect Fee
                        </button>
                      ) : (
                        <span style={{ color: '#16a34a', fontWeight: 'bold' }}>Paid In Full</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Admission Modal */}
      {showAdmissionModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '480px', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>New Student Admission</h3>
              <button onClick={() => setShowAdmissionModal(false)} style={{ background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer' }}>×</button>
            </div>

            {modalError && (
              <div style={{ background: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '6px', marginBottom: '16px', fontSize: '14px' }}>
                {modalError}
              </div>
            )}

            <form onSubmit={handleAdmissionSubmit}>
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', fontWeight: 'bold' }}>Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  required 
                  style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }} 
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', fontWeight: 'bold' }}>Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  required 
                  style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }} 
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', fontWeight: 'bold' }}>Phone Number</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  required 
                  style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }} 
                />
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', fontWeight: 'bold' }}>Select Baking Course</label>
                <select 
                  name="course" 
                  value={formData.course} 
                  onChange={handleChange} 
                  style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }}
                >
                  <option value="Diploma in Pastry & Baking">Diploma in Pastry & Baking</option>
                  <option value="Certificate in Bread Crafting">Certificate in Bread Crafting</option>
                  <option value="Cake Decoration Masterclass">Cake Decoration Masterclass</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', fontWeight: 'bold' }}>Total Course Fee (₹)</label>
                  <input 
                    type="number" 
                    name="totalFee" 
                    value={formData.totalFee} 
                    onChange={handleChange} 
                    required 
                    style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }} 
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', fontWeight: 'bold' }}>Initial Paid (₹)</label>
                  <input 
                    type="number" 
                    name="initialPaidAmount" 
                    value={formData.initialPaidAmount} 
                    onChange={handleChange} 
                    required 
                    style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowAdmissionModal(false)} 
                  style={{ background: '#f1f5f9', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={modalLoading} 
                  style={{ background: '#d97706', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  {modalLoading ? 'Submitting...' : 'Submit Admission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Collect Fee Modal */}
      {feeModalStudent && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '400px', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ margin: '0 0 12px' }}>Collect Fee</h3>
            <p style={{ margin: '0 0 16px', color: '#64748b' }}>Student: <b>{feeModalStudent.name}</b> | Due: <b>₹{feeModalStudent.dueFee}</b></p>
            
            <form onSubmit={handleFeeSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', marginBottom: '4px', fontWeight: 'bold' }}>Amount to Collect (₹)</label>
                <input 
                  type="number" 
                  max={feeModalStudent.dueFee} 
                  value={collectAmount} 
                  onChange={(e) => setCollectAmount(e.target.value)} 
                  required 
                  style={{ width: '100%', padding: '8px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' }} 
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button 
                  type="button" 
                  onClick={() => setFeeModalStudent(null)} 
                  style={{ background: '#f1f5f9', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={feeLoading} 
                  style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  {feeLoading ? 'Updating...' : 'Confirm Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;