 import React, { useState, useEffect } from 'react';
import { getStudents, createStudent, updateStudentFee } from '../api';

const AdminDashboard = ({ currentUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true); // TOGGLE STATE
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [globalSearch, setGlobalSearch] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalFeesCollected: 0,
    pendingDues: 0,
    activeCourses: 6,
    lowStockAlerts: 3
  });
  const [loading, setLoading] = useState(true);
  
  // Admission Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  // Collect Fee Modal State
  const [feeModalStudent, setFeeModalStudent] = useState(null);
  const [collectAmount, setCollectAmount] = useState('');
  const [feeLoading, setFeeLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: 'Diploma in Pastry & Baking',
    totalFee: '',
    paidFee: ''
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await getStudents();
      if (res.data.success) {
        setStudents(res.data.students);
        setStats((prev) => ({
          ...prev,
          totalStudents: res.data.stats.totalStudents,
          totalFeesCollected: res.data.stats.totalFeesCollected,
          pendingDues: res.data.stats.pendingDues
        }));
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAdmissionSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    setModalLoading(true);

    try {
      const res = await createStudent(formData);
      if (res.data.success) {
        setShowModal(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          course: 'Diploma in Pastry & Baking',
          totalFee: '',
          paidFee: ''
        });
        fetchDashboardData();
      }
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
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error collecting fee');
    } finally {
      setFeeLoading(false);
    }
  };

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes((searchTerm || globalSearch).toLowerCase()) ||
    s.phone.includes(searchTerm || globalSearch) ||
    s.email.toLowerCase().includes((searchTerm || globalSearch).toLowerCase())
  );

  return (
    <div style={styles.layoutContainer}>
      {/* ================= LEFT SIDEBAR ================= */}
      <aside style={{
        ...styles.sidebar,
        width: sidebarOpen ? '260px' : '72px',
        padding: sidebarOpen ? '20px 16px' : '20px 10px'
      }}>
        <div style={{ ...styles.sidebarBrand, justifyContent: sidebarOpen ? 'flex-start' : 'center' }}>
          <img 
            src="/images/TBS-logo.jpeg" 
            alt="TBS Logo" 
            style={styles.brandLogo} 
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          {sidebarOpen && (
            <div>
              <h3 style={styles.brandName}>The Baking School</h3>
              <span style={styles.brandBadge}>Management System</span>
            </div>
          )}
        </div>

        <nav style={styles.navMenu}>
          <button 
            onClick={() => setActiveTab('overview')} 
            title="Dashboard Overview"
            style={{ 
              ...styles.navItem, 
              ...(activeTab === 'overview' ? styles.navItemActive : {}),
              textAlign: sidebarOpen ? 'left' : 'center',
              padding: sidebarOpen ? '12px 14px' : '12px 0'
            }}
          >
            📊 {sidebarOpen && <span style={{ marginLeft: '8px' }}>Dashboard Overview</span>}
          </button>

          <button 
            onClick={() => setActiveTab('students')} 
            title="Students & Admissions"
            style={{ 
              ...styles.navItem, 
              ...(activeTab === 'students' ? styles.navItemActive : {}),
              textAlign: sidebarOpen ? 'left' : 'center',
              padding: sidebarOpen ? '12px 14px' : '12px 0'
            }}
          >
            🎓 {sidebarOpen && <span style={{ marginLeft: '8px' }}>Students & Admissions</span>}
          </button>

          <button 
            onClick={() => setActiveTab('courses')} 
            title="Courses & Batches"
            style={{ 
              ...styles.navItem, 
              ...(activeTab === 'courses' ? styles.navItemActive : {}),
              textAlign: sidebarOpen ? 'left' : 'center',
              padding: sidebarOpen ? '12px 14px' : '12px 0'
            }}
          >
            📚 {sidebarOpen && <span style={{ marginLeft: '8px' }}>Courses & Batches</span>}
          </button>

          <button 
            onClick={() => setActiveTab('fees')} 
            title="Fee Management"
            style={{ 
              ...styles.navItem, 
              ...(activeTab === 'fees' ? styles.navItemActive : {}) ,
              textAlign: sidebarOpen ? 'left' : 'center',
              padding: sidebarOpen ? '12px 14px' : '12px 0'
            }}
          >
            💳 {sidebarOpen && <span style={{ marginLeft: '8px' }}>Fee Management</span>}
          </button>

          <button 
            onClick={() => setActiveTab('inventory')} 
            title="Kitchen Inventory"
            style={{ 
              ...styles.navItem, 
              ...(activeTab === 'inventory' ? styles.navItemActive : {}),
              textAlign: sidebarOpen ? 'left' : 'center',
              padding: sidebarOpen ? '12px 14px' : '12px 0'
            }}
          >
            📦 {sidebarOpen && <span style={{ marginLeft: '8px' }}>Kitchen Inventory</span>}
          </button>

          <button 
            onClick={() => setActiveTab('staff')} 
            title="Staff Management"
            style={{ 
              ...styles.navItem, 
              ...(activeTab === 'staff' ? styles.navItemActive : {}),
              textAlign: sidebarOpen ? 'left' : 'center',
              padding: sidebarOpen ? '12px 14px' : '12px 0'
            }}
          >
            👥 {sidebarOpen && <span style={{ marginLeft: '8px' }}>Staff Management</span>}
          </button>
        </nav>

        {sidebarOpen && (
          <div style={styles.sidebarFooter}>
            <p style={styles.branchText}>📍 Main Campus Branch</p>
          </div>
        )}
      </aside>

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <div style={styles.mainWrapper}>
        {/* ================= TOP HEADER WITH HAMBURGER BUTTON ================= */}
        <header style={styles.topHeader}>
          {/* Header Left: Hamburger Toggle + Search Bar */}
          <div style={styles.headerLeftGroup}>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              style={styles.hamburgerBtn}
              title="Toggle Sidebar Navigation"
            >
              ☰
            </button>

            <div style={styles.headerSearchWrapper}>
              <span style={styles.searchIcon}>🔍</span>
              <input 
                type="text"
                placeholder="Search student, course or menu..."
                value={globalSearch}
                onChange={(e) => {
                  setGlobalSearch(e.target.value);
                  if (activeTab !== 'students' && e.target.value.trim() !== '') {
                    setActiveTab('students');
                  }
                }}
                style={styles.headerSearchInput}
              />
            </div>
          </div>

          {/* Header Right: Weather + Notification + User Pill */}
          <div style={styles.headerRightGroup}>
            {/* Weather Widget */}
            <div style={styles.weatherBadge}>
              <span style={styles.weatherIcon}>⛅</span>
              <div style={styles.weatherTextGroup}>
                <span style={styles.weatherTemp}>28°C</span>
                <span style={styles.weatherCity}>Main Campus</span>
              </div>
            </div>

            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)} 
                style={styles.iconBtn}
                title="Notifications"
              >
                🔔
                <span style={styles.notifDot}>3</span>
              </button>

              {showNotifications && (
                <div style={styles.dropdownPopover}>
                  <div style={styles.popoverHeader}>
                    <strong>Notifications</strong>
                    <span style={{ fontSize: '11px', color: '#d97706', cursor: 'pointer' }}>Mark all read</span>
                  </div>
                  <div style={styles.notifItem}>
                    <p style={styles.notifTitle}>⚠️ Low Stock Alert</p>
                    <span style={styles.notifDesc}>Cocoa Powder is running below 2kg</span>
                  </div>
                  <div style={styles.notifItem}>
                    <p style={styles.notifTitle}>💳 Fee Received</p>
                    <span style={styles.notifDesc}>₹15,000 recorded for Diploma batch</span>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Pill */}
            <div style={{ position: 'relative' }}>
              <div 
                onClick={() => setShowProfileMenu(!showProfileMenu)} 
                style={styles.userProfilePill}
              >
                <div style={styles.avatarCircle}>
                  {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div style={styles.userMeta}>
                  <span style={styles.userNameText}>{currentUser?.name || 'Administrator'}</span>
                  <span style={styles.userRoleTag}>{currentUser?.role?.toUpperCase() || 'OWNER'}</span>
                </div>
                <span style={{ fontSize: '11px', color: '#64748b' }}>▼</span>
              </div>

              {showProfileMenu && (
                <div style={{ ...styles.dropdownPopover, width: '220px', right: 0 }}>
                  <div style={{ padding: '12px 14px', borderBottom: '1px solid #f1f5f9' }}>
                    <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#0f172a' }}>
                      {currentUser?.name || 'User Account'}
                    </p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                      {currentUser?.email}
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('staff')}
                    style={styles.menuItemBtn}
                  >
                    ⚙️ Account Settings
                  </button>
                  <button 
                    onClick={onLogout}
                    style={{ ...styles.menuItemBtn, color: '#dc2626', borderTop: '1px solid #f1f5f9' }}
                  >
                    🚪 Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ================= CONTENT BODY ================= */}
        <main style={styles.contentBody}>
          {activeTab === 'overview' && (
            <div>
              <div style={styles.quickActionsRow}>
                <button onClick={() => setShowModal(true)} style={styles.actionBtnPrimary}>
                  + New Admission
                </button>
                <button onClick={() => setActiveTab('courses')} style={styles.actionBtnSecondary}>
                  + Add Course
                </button>
                <button onClick={() => setActiveTab('inventory')} style={styles.actionBtnSecondary}>
                  + Update Stock
                </button>
              </div>

              <div style={styles.statsGrid}>
                <div style={styles.statCard}>
                  <div style={styles.statIcon}>👥</div>
                  <div>
                    <p style={styles.statLabel}>Total Enrolled Students</p>
                    <h3 style={styles.statValue}>{stats.totalStudents}</h3>
                  </div>
                </div>

                <div style={styles.statCard}>
                  <div style={styles.statIcon}>💰</div>
                  <div>
                    <p style={styles.statLabel}>Fees Collected</p>
                    <h3 style={{ ...styles.statValue, color: '#16a34a' }}>₹{stats.totalFeesCollected.toLocaleString()}</h3>
                  </div>
                </div>

                <div style={styles.statCard}>
                  <div style={styles.statIcon}>⏳</div>
                  <div>
                    <p style={styles.statLabel}>Pending Dues</p>
                    <h3 style={{ ...styles.statValue, color: '#dc2626' }}>₹{stats.pendingDues.toLocaleString()}</h3>
                  </div>
                </div>

                <div style={styles.statCard}>
                  <div style={styles.statIcon}>📖</div>
                  <div>
                    <p style={styles.statLabel}>Active Courses</p>
                    <h3 style={styles.statValue}>{stats.activeCourses}</h3>
                  </div>
                </div>

                <div style={{ ...styles.statCard, borderLeft: '4px solid #f59e0b' }}>
                  <div style={styles.statIcon}>⚠️</div>
                  <div>
                    <p style={styles.statLabel}>Low Stock Items</p>
                    <h3 style={{ ...styles.statValue, color: '#d97706' }}>{stats.lowStockAlerts}</h3>
                  </div>
                </div>
              </div>

              <div style={styles.tableCard}>
                <div style={styles.tableHeaderRow}>
                  <h3 style={styles.tableTitle}>Recent Admissions</h3>
                  <button onClick={() => setActiveTab('students')} style={styles.viewAllBtn}>
                    View All Students →
                  </button>
                </div>

                {loading ? (
                  <p style={{ color: '#64748b', textAlign: 'center', padding: '20px' }}>Loading records...</p>
                ) : (
                  <table style={styles.table}>
                    <thead>
                      <tr style={styles.thRow}>
                        <th style={styles.th}>Student Name</th>
                        <th style={styles.th}>Course</th>
                        <th style={styles.th}>Phone</th>
                        <th style={styles.th}>Admission Date</th>
                        <th style={styles.th}>Total Fee</th>
                        <th style={styles.th}>Fee Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.slice(0, 5).map((student) => {
                        const isFullyPaid = student.paidFee >= student.totalFee;
                        const isPartial = student.paidFee > 0 && !isFullyPaid;
                        return (
                          <tr key={student._id} style={styles.tr}>
                            <td style={styles.tdBold}>{student.name}</td>
                            <td style={styles.td}>{student.course}</td>
                            <td style={styles.td}>{student.phone}</td>
                            <td style={styles.td}>{new Date(student.admissionDate).toLocaleDateString('en-IN')}</td>
                            <td style={styles.td}>₹{student.totalFee.toLocaleString()}</td>
                            <td style={styles.td}>
                              <span style={{
                                ...styles.statusBadge,
                                backgroundColor: isFullyPaid ? '#dcfce7' : isPartial ? '#fef9c3' : '#fee2e2',
                                color: isFullyPaid ? '#15803d' : isPartial ? '#a16207' : '#b91c1c'
                              }}>
                                {isFullyPaid ? 'Paid' : isPartial ? 'Partial' : 'Pending'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div>
              <div style={styles.filterBar}>
                <input 
                  type="text" 
                  placeholder="🔍 Search student by name, phone or email..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={styles.searchInput}
                />
                <button onClick={() => setShowModal(true)} style={styles.actionBtnPrimary}>
                  + New Admission
                </button>
              </div>

              <div style={styles.tableCard}>
                <table style={styles.table}>
                  <thead>
                    <tr style={styles.thRow}>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Course</th>
                      <th style={styles.th}>Phone / Email</th>
                      <th style={styles.th}>Total Fee</th>
                      <th style={styles.th}>Paid Fee</th>
                      <th style={styles.th}>Pending</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                          No matching student records found.
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((student) => {
                        const pendingAmount = student.totalFee - student.paidFee;
                        const isFullyPaid = pendingAmount <= 0;
                        const isPartial = student.paidFee > 0 && !isFullyPaid;

                        return (
                          <tr key={student._id} style={styles.tr}>
                            <td style={styles.tdBold}>{student.name}</td>
                            <td style={styles.td}>{student.course}</td>
                            <td style={styles.td}>
                              <div>{student.phone}</div>
                              <div style={{ fontSize: '12px', color: '#64748b' }}>{student.email}</div>
                            </td>
                            <td style={styles.td}>₹{student.totalFee.toLocaleString()}</td>
                            <td style={{ ...styles.td, color: '#16a34a', fontWeight: '600' }}>
                              ₹{student.paidFee.toLocaleString()}
                            </td>
                            <td style={{ ...styles.td, color: pendingAmount > 0 ? '#dc2626' : '#64748b', fontWeight: '600' }}>
                              ₹{Math.max(0, pendingAmount).toLocaleString()}
                            </td>
                            <td style={styles.td}>
                              <span style={{
                                ...styles.statusBadge,
                                backgroundColor: isFullyPaid ? '#dcfce7' : isPartial ? '#fef9c3' : '#fee2e2',
                                color: isFullyPaid ? '#15803d' : isPartial ? '#a16207' : '#b91c1c'
                              }}>
                                {isFullyPaid ? 'Paid' : isPartial ? 'Partial' : 'Pending'}
                              </span>
                            </td>
                            <td style={styles.td}>
                              {!isFullyPaid ? (
                                <button 
                                  onClick={() => setFeeModalStudent(student)} 
                                  style={styles.collectBtn}
                                >
                                  + Collect Fee
                                </button>
                              ) : (
                                <span style={{ fontSize: '13px', color: '#16a34a', fontWeight: '600' }}>✓ Cleared</span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab !== 'overview' && activeTab !== 'students' && (
            <div style={styles.placeholderCard}>
              <h3>Module: {activeTab.toUpperCase()}</h3>
              <p>Module screen placeholder.</p>
            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: NEW ADMISSION */}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>New Student Admission</h3>
              <button onClick={() => setShowModal(false)} style={styles.closeBtn}>✕</button>
            </div>

            {modalError && <div style={styles.errorBox}>{modalError}</div>}

            <form onSubmit={handleAdmissionSubmit} style={{ marginTop: '16px' }}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  placeholder="e.g. Ananya Sharma" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  style={styles.formInput} 
                />
              </div>

              <div style={styles.formGrid2}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Email Address</label>
                  <input 
                    type="email" 
                    name="email" 
                    required 
                    placeholder="student@example.com" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    style={styles.formInput} 
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Phone Number</label>
                  <input 
                    type="text" 
                    name="phone" 
                    required 
                    placeholder="9876543210" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    style={styles.formInput} 
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Select Baking Course</label>
                <select 
                  name="course" 
                  value={formData.course} 
                  onChange={handleInputChange} 
                  style={styles.formInput}
                >
                  <option value="Diploma in Pastry & Baking">Diploma in Pastry & Baking</option>
                  <option value="Artisan Bread Making">Artisan Bread Making</option>
                  <option value="Cake Decoration & Fondant Art">Cake Decoration & Fondant Art</option>
                  <option value="Advanced Chocolatier Certificate">Advanced Chocolatier Certificate</option>
                  <option value="Eggless Baking Specialist">Eggless Baking Specialist</option>
                </select>
              </div>

              <div style={styles.formGrid2}>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Total Course Fee (₹)</label>
                  <input 
                    type="number" 
                    name="totalFee" 
                    required 
                    placeholder="45000" 
                    value={formData.totalFee} 
                    onChange={handleInputChange} 
                    style={styles.formInput} 
                  />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel}>Initial Paid Amount (₹)</label>
                  <input 
                    type="number" 
                    name="paidFee" 
                    placeholder="15000" 
                    value={formData.paidFee} 
                    onChange={handleInputChange} 
                    style={styles.formInput} 
                  />
                </div>
              </div>

              <div style={styles.modalActions}>
                <button type="button" onClick={() => setShowModal(false)} style={styles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" disabled={modalLoading} style={styles.actionBtnPrimary}>
                  {modalLoading ? 'Saving...' : 'Submit Admission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: COLLECT FEE */}
      {feeModalStudent && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <div style={styles.modalHeader}>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>Collect Pending Fee</h3>
              <button onClick={() => setFeeModalStudent(null)} style={styles.closeBtn}>✕</button>
            </div>

            <div style={{ margin: '16px 0', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '14px' }}><strong>Student:</strong> {feeModalStudent.name}</p>
              <p style={{ margin: '0 0 4px 0', fontSize: '14px' }}><strong>Total Fee:</strong> ₹{feeModalStudent.totalFee.toLocaleString()}</p>
              <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#16a34a' }}><strong>Already Paid:</strong> ₹{feeModalStudent.paidFee.toLocaleString()}</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#dc2626' }}>
                <strong>Pending Due:</strong> ₹{(feeModalStudent.totalFee - feeModalStudent.paidFee).toLocaleString()}
              </p>
            </div>

            <form onSubmit={handleFeeSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Amount to Collect (₹)</label>
                <input 
                  type="number" 
                  required 
                  max={feeModalStudent.totalFee - feeModalStudent.paidFee}
                  placeholder="e.g. 5000" 
                  value={collectAmount} 
                  onChange={(e) => setCollectAmount(e.target.value)} 
                  style={styles.formInput} 
                />
              </div>

              <div style={styles.modalActions}>
                <button type="button" onClick={() => setFeeModalStudent(null)} style={styles.cancelBtn}>
                  Cancel
                </button>
                <button type="submit" disabled={feeLoading} style={styles.actionBtnPrimary}>
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

// ================= STYLES =================
const styles = {
  layoutContainer: {
    display: 'flex',
    minHeight: '100vh',
    width: '100vw',
    backgroundColor: '#f8fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  sidebar: {
    backgroundColor: '#0f172a',
    color: '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'width 0.25s ease-in-out, padding 0.25s ease-in-out',
    boxSizing: 'border-box',
    overflow: 'hidden',
    whiteSpace: 'nowrap'
  },
  sidebarBrand: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    paddingBottom: '20px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    height: '46px'
  },
  brandLogo: {
    width: '38px',
    height: '38px',
    borderRadius: '8px',
    objectFit: 'cover'
  },
  brandName: {
    fontSize: '15px',
    margin: 0,
    fontWeight: '700',
    color: '#ffffff'
  },
  brandBadge: {
    fontSize: '10px',
    color: '#fde047',
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  navMenu: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '16px',
    flex: 1
  },
  navItem: {
    display: 'block',
    width: '100%',
    backgroundColor: 'transparent',
    color: '#94a3b8',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, color 0.2s ease'
  },
  navItemActive: {
    backgroundColor: '#1e293b',
    color: '#fde047',
    fontWeight: '600'
  },
  sidebarFooter: {
    paddingTop: '14px',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
  },
  branchText: {
    fontSize: '12px',
    color: '#64748b',
    margin: 0
  },
  mainWrapper: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto'
  },
  topHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 24px',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e2e8f0',
    position: 'sticky',
    top: 0,
    zIndex: 50
  },
  headerLeftGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px'
  },
  hamburgerBtn: {
    backgroundColor: '#f1f5f9',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    width: '38px',
    height: '38px',
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#1e293b',
    transition: '0.2s background-color'
  },
  headerSearchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    width: '320px'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    fontSize: '14px',
    opacity: 0.5
  },
  headerSearchInput: {
    width: '100%',
    padding: '8px 14px 8px 34px',
    backgroundColor: '#f1f5f9',
    border: '1px solid transparent',
    borderRadius: '20px',
    fontSize: '13px',
    outline: 'none'
  },
  headerRightGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  weatherBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '6px 12px',
    backgroundColor: '#eff6ff',
    borderRadius: '18px',
    border: '1px solid #bfdbfe'
  },
  weatherIcon: {
    fontSize: '18px'
  },
  weatherTextGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  weatherTemp: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#1e40af',
    lineHeight: '1'
  },
  weatherCity: {
    fontSize: '10px',
    color: '#60a5fa',
    fontWeight: '500'
  },
  iconBtn: {
    position: 'relative',
    background: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '50%',
    width: '38px',
    height: '38px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px'
  },
  notifDot: {
    position: 'absolute',
    top: '-3px',
    right: '-3px',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    borderRadius: '50%',
    fontSize: '10px',
    fontWeight: '700',
    width: '18px',
    height: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  userProfilePill: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '4px 12px 4px 6px',
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '24px',
    cursor: 'pointer',
    userSelect: 'none'
  },
  avatarCircle: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#0f172a',
    color: '#fde047',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '14px'
  },
  userMeta: {
    display: 'flex',
    flexDirection: 'column'
  },
  userNameText: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#0f172a',
    lineHeight: '1.2'
  },
  userRoleTag: {
    fontSize: '10px',
    color: '#d97706',
    fontWeight: '600'
  },
  dropdownPopover: {
    position: 'absolute',
    top: '48px',
    right: 0,
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0',
    width: '260px',
    zIndex: 100,
    overflow: 'hidden'
  },
  popoverHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 14px',
    borderBottom: '1px solid #f1f5f9',
    fontSize: '13px'
  },
  notifItem: {
    padding: '10px 14px',
    borderBottom: '1px solid #f8fafc'
  },
  notifTitle: {
    margin: '0 0 2px 0',
    fontSize: '12px',
    fontWeight: '700',
    color: '#0f172a'
  },
  notifDesc: {
    fontSize: '11px',
    color: '#64748b'
  },
  menuItemBtn: {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    padding: '10px 14px',
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    color: '#334155'
  },
  contentBody: {
    padding: '24px'
  },
  quickActionsRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px'
  },
  actionBtnPrimary: {
    padding: '10px 18px',
    backgroundColor: '#d97706',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer'
  },
  actionBtnSecondary: {
    padding: '10px 18px',
    backgroundColor: '#ffffff',
    color: '#334155',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    fontWeight: '600',
    fontSize: '14px',
    cursor: 'pointer'
  },
  filterBar: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '16px',
    marginBottom: '20px'
  },
  searchInput: {
    flex: 1,
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: '#ffffff'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '28px'
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: '18px',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    gap: '14px'
  },
  statIcon: {
    fontSize: '24px'
  },
  statLabel: {
    fontSize: '12px',
    color: '#64748b',
    margin: '0 0 4px 0',
    fontWeight: '500'
  },
  statValue: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#0f172a',
    margin: 0
  },
  tableCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    padding: '20px'
  },
  tableHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  tableTitle: {
    fontSize: '16px',
    fontWeight: '700',
    margin: 0,
    color: '#0f172a'
  },
  viewAllBtn: {
    backgroundColor: 'transparent',
    border: 'none',
    color: '#d97706',
    fontWeight: '600',
    fontSize: '13px',
    cursor: 'pointer'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  thRow: {
    borderBottom: '1px solid #e2e8f0'
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    fontSize: '12px',
    color: '#64748b',
    fontWeight: '600',
    textTransform: 'uppercase'
  },
  tr: {
    borderBottom: '1px solid #f1f5f9'
  },
  td: {
    padding: '14px 16px',
    fontSize: '14px',
    color: '#334155'
  },
  tdBold: {
    padding: '14px 16px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#0f172a'
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600'
  },
  collectBtn: {
    padding: '6px 12px',
    backgroundColor: '#ecfdf5',
    color: '#047857',
    border: '1px solid #a7f3d0',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  placeholderCard: {
    backgroundColor: '#ffffff',
    padding: '40px',
    borderRadius: '12px',
    border: '1px dashed #cbd5e1',
    textAlign: 'center',
    color: '#64748b'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100
  },
  modalCard: {
    backgroundColor: '#ffffff',
    width: '100%',
    maxWidth: '480px',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '12px'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    color: '#64748b'
  },
  formGroup: {
    marginBottom: '14px'
  },
  formGrid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px'
  },
  formLabel: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#334155',
    marginBottom: '4px'
  },
  formInput: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box'
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px',
    borderTop: '1px solid #e2e8f0',
    paddingTop: '16px'
  },
  cancelBtn: {
    padding: '10px 16px',
    backgroundColor: '#f1f5f9',
    color: '#475569',
    border: 'none',
    borderRadius: '8px',
    fontWeight: '600',
    cursor: 'pointer'
  },
  errorBox: {
    padding: '8px 12px',
    backgroundColor: '#fef2f2',
    color: '#b91c1c',
    borderRadius: '6px',
    fontSize: '13px',
    marginTop: '10px'
  }
};

export default AdminDashboard;