import React, { useState, useEffect } from 'react';
import { getStudents, createStudent, updateStudentFee } from '../api';

const AdminDashboard = ({ currentUser, onLogout }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAdmissionModal, setShowAdmissionModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  // Fee modal
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
      setModalError(err.response?.data?.message || 'Error submitting admission');
    } finally {
      setModalLoading(false);
    }
  };

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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f1f5f9', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Sidebar */}
      <aside style={{ width: '260px', background: '#0f172a', color: '#94a3b8', display: 'flex', flexDirection: 'column', padding: '24px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px', paddingLeft: '8px' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>TBS</div>
          <div>
            <h4 style={{ margin: 0, color: '#fff', fontSize: '15px' }}>The Baking School</h4>
            <span style={{ fontSize: '11px', color: '#64748b' }}>MANAGEMENT SYSTEM</span>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '8px', background: '#1e293b', color: '#f59e0b', fontWeight: '600', cursor: 'pointer' }}>
            <span>📊</span> Dashboard Overview
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '8px', color: '#94a3b8', cursor: 'pointer' }}>
            <span>👥</span> Students & Admissions
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '8px', color: '#94a3b8', cursor: 'pointer' }}>
            <span>📚</span> Courses & Batches
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '8px', color: '#94a3b8', cursor: 'pointer' }}>
            <span>💳</span> Fee Management
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '8px', color: '#94a3b8', cursor: 'pointer' }}>
            <span>📦</span> Kitchen Inventory
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '8px', color: '#94a3b8', cursor: 'pointer' }}>
            <span>👤</span> Staff Management
          </div>
        </nav>

        <div style={{ borderTop: '1px solid #1e293b', paddingTop: '16px', fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span>📍</span> Main Campus Branch
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Top Navbar */}
        <header style={{ height: '64px', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px' }}>
          <div style={{ width: '380px' }}>
            <input 
              type="text" 
              placeholder="Search student, course or menu..." 
              style={{ width: '100%', padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#f8fafc', outline: 'none', fontSize: '14px' }} 
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f8fafc', padding: '6px 12px', borderRadius: '20px', border: '1px solid #e2e8f0', fontSize: '13px', color: '#475569' }}>
              <span>⛅ 28°C</span>
              <span style={{ color: '#94a3b8' }}></span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#0f172a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>S</div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#0f172a' }}>Super Admin</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>STAFF</div>
              </div>
              <button onClick={onLogout} style={{ marginLeft: '12px', background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}>
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Body */}
        <div style={{ padding: '32px', flex: 1, overflowY: 'auto' }}>
          
          {/* Action Row */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <button 
              onClick={() => setShowAdmissionModal(true)} 
              style={{ background: '#d97706', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}
            >
              + New Admission
            </button>
            <button style={{ background: '#fff', color: '#475569', border: '1px solid #cbd5e1', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
              + Add Course
            </button>
            <button style={{ background: '#fff', color: '#475569', border: '1px solid #cbd5e1', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', fontSize: '14px', cursor: 'pointer' }}>
              + Update Stock
            </button>
          </div>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '13px' }}>Total Enrolled Students</span>
                <h2 style={{ margin: '6px 0 0', fontSize: '28px', color: '#0f172a' }}>{students.length}</h2>
              </div>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>👥</div>
            </div>

            <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '13px' }}>Active Courses</span>
                <h2 style={{ margin: '6px 0 0', fontSize: '28px', color: '#0f172a' }}>6</h2>
              </div>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>📖</div>
            </div>

            <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '13px' }}>Low Stock Items</span>
                <h2 style={{ margin: '6px 0 0', fontSize: '28px', color: '#0f172a' }}>3</h2>
              </div>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>⚠️</div>
            </div>
          </div>

          {/* Table Container */}
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '16px', color: '#0f172a' }}>Recent Admissions</h3>
              <span style={{ color: '#d97706', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>View All Students →</span>
            </div>

            {loading ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>Loading records...</div>
            ) : students.length === 0 ? (
              <div style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>No students enrolled yet.</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '14px 24px' }}>Student Name</th>
                    <th style={{ padding: '14px 20px' }}>Email</th>
                    <th style={{ padding: '14px 20px' }}>Phone</th>
                    <th style={{ padding: '14px 20px' }}>Course</th>
                    <th style={{ padding: '14px 20px' }}>Total Fee</th>
                    <th style={{ padding: '14px 20px' }}>Paid Fee</th>
                    <th style={{ padding: '14px 20px' }}>Due Fee</th>
                    <th style={{ padding: '14px 24px' }}>Fee Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((st) => {
                    const total = Number(st.totalFee || 0);
                    const paid = Number(st.paidFee || 0);
                    const due = total - paid;

                    return (
                      <tr key={st._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '16px 24px', fontWeight: '600', color: '#0f172a' }}>{st.name}</td>
                        <td style={{ padding: '16px 20px', color: '#64748b' }}>{st.email}</td>
                        <td style={{ padding: '16px 20px', color: '#64748b' }}>{st.phone}</td>
                        <td style={{ padding: '16px 20px', color: '#334155' }}>{st.course}</td>
                        <td style={{ padding: '16px 20px', color: '#0f172a', fontWeight: '500' }}>₹{total}</td>
                        <td style={{ padding: '16px 20px', color: '#16a34a', fontWeight: '600' }}>₹{paid}</td>
                        <td style={{ padding: '16px 20px', color: due > 0 ? '#dc2626' : '#16a34a', fontWeight: '600' }}>₹{due}</td>
                        <td style={{ padding: '16px 24px' }}>
                          {due > 0 ? (
                            <button 
                              onClick={() => setFeeModalStudent({ ...st, dueFee: due })} 
                              style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
                            >
                              Collect Fee
                            </button>
                          ) : (
                            <span style={{ color: '#16a34a', fontWeight: '600', fontSize: '13px' }}>Paid In Full</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* Admission Modal */}
      {showAdmissionModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(2px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '500px', borderRadius: '16px', padding: '28px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>New Student Admission</h3>
              <button onClick={() => setShowAdmissionModal(false)} style={{ background: 'transparent', border: 'none', fontSize: '22px', color: '#94a3b8', cursor: 'pointer' }}>×</button>
            </div>

            {modalError && (
              <div style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '10px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' }}>
                {modalError}
              </div>
            )}

            <form onSubmit={handleAdmissionSubmit}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter student name" style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', outline: 'none' }} />
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="student@email.com" style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', outline: 'none' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="Phone number" style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', outline: 'none' }} />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Select Baking Course</label>
                <select name="course" value={formData.course} onChange={handleChange} style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', outline: 'none', background: '#fff' }}>
                  <option value="Diploma in Pastry & Baking">Diploma in Pastry & Baking</option>
                  <option value="Certificate in Bread Crafting">Certificate in Bread Crafting</option>
                  <option value="Cake Decoration Masterclass">Cake Decoration Masterclass</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Total Course Fee (₹)</label>
                  <input type="number" name="totalFee" value={formData.totalFee} onChange={handleChange} required style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', outline: 'none' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Initial Paid Amount (₹)</label>
                  <input type="number" name="initialPaidAmount" value={formData.initialPaidAmount} onChange={handleChange} required style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', outline: 'none' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setShowAdmissionModal(false)} style={{ background: '#f1f5f9', border: 'none', padding: '10px 18px', borderRadius: '8px', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={modalLoading} style={{ background: '#d97706', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                  {modalLoading ? 'Submitting...' : 'Submit Admission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Collect Fee Modal */}
      {feeModalStudent && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(2px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', width: '100%', maxWidth: '420px', borderRadius: '16px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '18px', color: '#0f172a' }}>Collect Remaining Fee</h3>
            <p style={{ margin: '0 0 16px', color: '#64748b', fontSize: '14px' }}>
              Student: <b style={{ color: '#0f172a' }}>{feeModalStudent.name}</b><br />
              Remaining Due: <b style={{ color: '#dc2626' }}>₹{feeModalStudent.dueFee}</b>
            </p>
            
            <form onSubmit={handleFeeSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#334155', marginBottom: '6px' }}>Amount to Collect (₹)</label>
                <input 
                  type="number" 
                  max={feeModalStudent.dueFee} 
                  value={collectAmount} 
                  onChange={(e) => setCollectAmount(e.target.value)} 
                  required 
                  placeholder="Enter amount"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box', outline: 'none' }} 
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setFeeModalStudent(null)} style={{ background: '#f1f5f9', border: 'none', padding: '10px 18px', borderRadius: '8px', color: '#475569', fontWeight: '600', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" disabled={feeLoading} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
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