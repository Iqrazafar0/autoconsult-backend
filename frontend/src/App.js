import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [requests, setRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [formData, setFormData] = useState({ client_name: '', email: '', service_interested: '', message: '' });
  const [newService, setNewService] = useState({ name: '', description: '', base_price: '' });

  // Authentication & View State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });

  useEffect(() => {
    axios.get('https://autoconsult-backend-3.onrender.com/api/services/').then(res => setServices(res.data));
    axios.get('https://autoconsult-backend-3.onrender.com/api/projects/').then(res => setProjects(res.data));
    axios.get('https://autoconsult-backend-3.onrender.com/api/requests/').then(res => setRequests(res.data));
  }, []);

  //  Delete Function (Admin ke liye)
  const deleteRequest = (id) => {
    if(window.confirm("Are you sure you want to delete this inquiry?")) {
      axios.delete(`https://autoconsult-backend-3.onrender.com/api/requests/${id}/`)
        .then(() => {
          // List se foran remove karne ke liye
          setRequests(requests.filter(req => req.id !== id));
        })
        .catch(err => alert("Error deleting request"));
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (loginData.username === "admin" && loginData.password === "admin123") {
      setIsLoggedIn(true);
      setShowLoginModal(false);
    } else {
      alert("Invalid Staff Credentials!");
    }
  };

  const processedProjects = projects
    .filter(p => 
      p.client_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") return a.client_name.localeCompare(b.client_name);
      return b.client_name.localeCompare(a.client_name);
    });

  // --- Services Filtering Logic ---
  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToExcel = () => {
    const headers = ["Client,Project,Status\n"];
    const rows = processedProjects.map(p => `${p.client_name},${p.title},${p.status}\n`);
    const blob = new Blob([headers, ...rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'Project_Report.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const getStatusStyle = (status) => {
    const s = status.toLowerCase();
    if (s.includes('complete')) return { backgroundColor: '#dcfce7', color: '#15803d' };
    if (s.includes('progress')) return { backgroundColor: '#fef9c3', color: '#854d0e' };
    if (s.includes('pending')) return { backgroundColor: '#fee2e2', color: '#b91c1c' };
    return { backgroundColor: '#f1f5f9', color: '#475569' };
  };

  // --- SUBMIT FORM UPDATED ---
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Loading start
    
    axios.post('https://autoconsult-backend-3.onrender.com/api/requests/', formData)
      .then(res => {
        alert("Application Submitted Successfully! Our team will contact you soon.");
        setFormData({ client_name: '', email: '', service_interested: '', message: '' });
      })
      .catch(err => {
        console.error("Submission Error:", err);
        alert("Server responded with an error. Check if Email/App Password is correct on Render.");
      })
      .finally(() => {
        setIsSubmitting(false); // Loading stop
      });
  };

  const addService = (e) => {
    e.preventDefault();
    axios.post('https://autoconsult-backend-3.onrender.com/api/services/', newService)
      .then(res => {
        setServices([...services, res.data]);
        setNewService({ name: '', description: '', base_price: '' });
        alert("Nayi Service add ho gayi!");
      })
      .catch(err => alert("Issue occure to add the service"));
  };

  const styles = {
    wrapper: { backgroundColor: '#fdfcfb', minHeight: '100vh', fontFamily: '"Segoe UI", sans-serif', display: 'flex', flexDirection: 'column', position: 'relative', overflowX: 'hidden' },
    carShadowLeft: { position: 'fixed', left: '-80px', top: '15%', width: '550px', opacity: 0.04, filter: 'grayscale(1) brightness(0) blur(2px)', zIndex: 1, pointerEvents: 'none', transform: 'rotate(-12deg)' },
    carShadowRight: { position: 'fixed', right: '-100px', bottom: '5%', width: '650px', opacity: 0.03, filter: 'grayscale(1) brightness(0) blur(4px)', zIndex: 1, pointerEvents: 'none', transform: 'scaleX(-1) rotate(-8deg)' },
    blob1: { position: 'fixed', width: '800px', height: '800px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(96,165,250,0.12) 0%, rgba(255,255,255,0) 70%)', top: '-200px', right: '-200px', zIndex: 0, filter: 'blur(80px)' },
    blob2: { position: 'fixed', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(244,114,182,0.08) 0%, rgba(255,255,255,0) 70%)', bottom: '-100px', left: '-150px', zIndex: 0, filter: 'blur(60px)' },
    blob3: { position: 'fixed', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, rgba(255,255,255,0) 70%)', top: '20%', left: '10%', zIndex: 0, filter: 'blur(100px)' },
    nav: { backgroundColor: '#0f172a', color: 'white', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 10 },
    container: { maxWidth: '1100px', margin: '0 auto', padding: '40px 20px', flex: 1, position: 'relative', zIndex: 5 },
    sectionTitle: { fontSize: '28px', color: '#1e293b', marginBottom: '30px', fontWeight: '300', letterSpacing: '1px', textAlign: 'center' },
    card: { backgroundColor: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', padding: '30px', borderRadius: '20px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.03), 0 10px 10px -5px rgba(0,0,0,0.02)', border: '1px solid rgba(255,255,255,0.8)', marginBottom: '30px' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '25px', marginBottom: '40px' },
    statCard: { backgroundColor: 'white', padding: '25px', borderRadius: '15px', borderBottom: '4px solid #3b82f6', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' },
    estimator: { background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', color: 'white', padding: '50px', borderRadius: '30px', textAlign: 'center', marginBottom: '40px', boxShadow: '0 30px 60px -12px rgba(59, 130, 246, 0.3)' },
    selectBox: { width: '100%', maxWidth: '400px', padding: '15px', borderRadius: '12px', fontWeight: 'bold', backgroundColor: 'white', color: '#1e3a8a', border: 'none', outline: 'none', cursor: 'pointer' },
    searchInput: { flex: 1, padding: '12px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: 'white' },
    exportBtn: { padding: '12px 20px', borderRadius: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 'bold' },
    input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '10px', border: '1px solid #e2e8f0' },
    btn: { backgroundColor: '#3b82f6', color: 'white', padding: '12px 25px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer', width: '100%', transition: 'all 0.3s ease' },
    footer: { backgroundColor: '#0f172a', color: '#94a3b8', padding: '30px', textAlign: 'center', position: 'relative', zIndex: 10 },
    modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' },
    modalCard: { backgroundColor: 'white', padding: '40px', borderRadius: '24px', width: '380px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' },
    graphBar: { height: '12px', backgroundColor: '#3b82f6', borderRadius: '10px', transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)' },
    deleteBtn: { backgroundColor: '#fee2e2', color: '#b91c1c', border: 'none', padding: '6px 12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }
  };

  // --- PRIVATE DASHBOARD VIEW (FULLY RESPONSIVE) ---
  if (isLoggedIn) {
    return (
      <div style={styles.wrapper}>
        <div style={styles.blob1}></div>
        <div style={styles.blob2}></div>
        <div style={styles.blob3}></div>

        <nav style={{...styles.nav, flexWrap: 'wrap', gap: '10px'}}>
          <h1 style={{ fontSize: '24px' }}>ADMIN<span style={{ color: '#60a5fa' }}>PORTAL</span></h1>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
             <button style={{ ...styles.btn, width: 'auto', padding: '8px 15px', backgroundColor: '#475569' }} onClick={() => setIsLoggedIn(false)}>Public Site</button>
             <button style={{ ...styles.btn, width: 'auto', padding: '8px 15px', backgroundColor: '#ef4444' }} onClick={() => setIsLoggedIn(false)}>Logout</button>
          </div>
        </nav>

        <div style={{...styles.container, padding: '20px 15px'}}>
          <h2 style={styles.sectionTitle}>Dashboard Analytics</h2>
          
          {/* Analytics Cards */}
          <div style={styles.card}>
            <h3>Service Utilization</h3>
            <p style={{color: '#64748b', fontSize: '14px', marginBottom: '25px'}}>Visual capacity tracking</p>
            <div>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{fontWeight: '500'}}>Projects Volume</span>
                  <span style={{color: '#3b82f6', fontWeight: 'bold'}}>{projects.length}%</span>
                </div>
                <div style={{ width: '100%', backgroundColor: '#f1f5f9', borderRadius: '10px', height: '12px' }}>
                  <div style={{ ...styles.graphBar, width: `${Math.min(projects.length * 10, 100)}%` }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{fontWeight: '500'}}>Service Range</span>
                  <span style={{color: '#10b981', fontWeight: 'bold'}}>{services.length}%</span>
                </div>
                <div style={{ width: '100%', backgroundColor: '#f1f5f9', borderRadius: '10px', height: '12px' }}>
                  <div style={{ ...styles.graphBar, width: `${Math.min(services.length * 10, 100)}%`, backgroundColor: '#10b981' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* --- CLIENT INQUIRIES SECTION --- */}
          <h2 style={styles.sectionTitle}>Client Inquiries</h2>
          <div style={{...styles.card, padding: '0px', marginBottom: '50px'}}>
            {/* Mobile Scroll Wrapper shuru */}
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '700px' }}>
                <thead style={{backgroundColor: '#f8fafc'}}>
                  <tr style={{ textAlign: 'left' }}>
                    <th style={{ padding: '15px' }}>Client Info</th>
                    <th style={{ padding: '15px' }}>Service</th>
                    <th style={{ padding: '15px' }}>Message</th>
                    <th style={{ padding: '15px' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.length === 0 ? (
                    <tr><td colSpan="4" style={{padding: '20px', textAlign: 'center'}}>No new inquiries.</td></tr>
                  ) : (
                    requests.map(req => (
                      <tr key={req.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '15px' }}>
                          <strong>{req.client_name}</strong><br/>
                          <small style={{color: '#64748b'}}>{req.email}</small>
                        </td>
                        <td style={{ padding: '15px' }}>{req.service_interested}</td>
                        <td style={{ padding: '15px' }}>{req.message}</td>
                        <td style={{ padding: '15px' }}>
                          <button onClick={() => deleteRequest(req.id)} style={styles.deleteBtn}>Delete</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* --- MANAGE SERVICES FORM --- */}
          <h2 style={styles.sectionTitle}>Manage Services</h2>
          <div style={styles.card}>
            <h3>Add New Service</h3>
            <br />
            <form onSubmit={addService} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <input 
                style={{...styles.input, flex: '1 1 250px', marginBottom: '10px'}} 
                placeholder="Service Name" 
                value={newService.name} 
                onChange={e => setNewService({...newService, name: e.target.value})} 
                required 
              />
              <input 
                style={{...styles.input, flex: '1 1 250px', marginBottom: '10px'}} 
                placeholder="Brief Description" 
                value={newService.description} 
                onChange={e => setNewService({...newService, description: e.target.value})} 
                required 
              />
              <input 
                type="number" 
                style={{...styles.input, flex: '1 1 100px', marginBottom: '10px'}} 
                placeholder="Price ($)" 
                value={newService.base_price} 
                onChange={e => setNewService({...newService, base_price: e.target.value})} 
                required 
              />
              <button type="submit" style={{...styles.btn, width: '100%'}}>+ Add Service</button>
            </form>
          </div>

          {/* --- PROJECT TRACKING --- */}
          <h2 style={styles.sectionTitle}>Detailed Project Tracking</h2>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', flexWrap: 'wrap' }}>
            <input style={{...styles.searchInput, flex: '1 1 200px'}} placeholder="Search records..." onChange={(e) => setSearchTerm(e.target.value)} />
            <button onClick={exportToExcel} style={{...styles.exportBtn, width: '100%'}}>📊 Export Excel</button>
          </div>
          
          <div style={{...styles.card, padding: '0px'}}>
            {/* Mobile Scroll Wrapper shuru */}
            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
                <thead style={{backgroundColor: '#f8fafc'}}>
                  <tr style={{ textAlign: 'left' }}>
                    <th style={{ padding: '15px' }}>Client</th>
                    <th style={{ padding: '15px' }}>Project</th>
                    <th style={{ padding: '15px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {processedProjects.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '15px' }}>{p.client_name}</td>
                      <td style={{ padding: '15px', fontWeight: '600' }}>{p.title}</td>
                      <td style={{ padding: '15px' }}>
                        <span style={{ ...getStatusStyle(p.status), padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>{p.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <footer style={styles.footer}><p>© 2026 Admin Management System</p></footer>
      </div>
    );
  }

  // --- PUBLIC LANDING PAGE VIEW ---
  return (
    <div style={styles.wrapper}>
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>
      <div style={styles.blob3}></div>
      
      <img src="https://pngimg.com/uploads/car/car_PNG7544.png" style={styles.carShadowLeft} alt="" />
      <img src="https://pngimg.com/uploads/car/car_PNG7544.png" style={styles.carShadowRight} alt="" />

      <nav style={styles.nav}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>AUTO<span style={{ color: '#60a5fa' }}>CONSULT</span></h1>
        <button style={{ ...styles.btn, width: 'auto' }} onClick={() => setShowLoginModal(true)}>Staff Login</button>
      </nav>

      {/* --- HERO / ABOUT SECTION --- */}
<div style={{
  textAlign: 'center', 
  padding: '80px 20px', 
  background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', 
  color: 'white',
  borderRadius: '0 0 60px 60px',
  marginBottom: '50px'
}}>
  <h1 style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '20px' }}>
    Drive Your Strategy <span style={{ color: '#60a5fa' }}>Forward</span>
  </h1>
  <p style={{ maxWidth: '750px', margin: '0 auto 35px auto', lineHeight: '1.8', fontSize: '19px', opacity: 0.85 }}>
    At <strong>AutoConsult</strong>, we bridge the gap between complex automotive challenges 
    and smart strategic solutions. We empower businesses to make informed decisions 
    through premium consulting and data-driven insights.
  </p>
  
  <button 
    onClick={() => {
      const element = document.getElementById('contact-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }}
    style={{
      backgroundColor: 'transparent',
      color: '#60a5fa',
      border: '2px solid #60a5fa',
      padding: '12px 35px',
      borderRadius: '30px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer'
    }}
  >
    Learn More ↓
  </button>
</div>
      {showLoginModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalCard}>
            <button style={{ position: 'absolute', top: '15px', right: '20px', border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer', color: '#94a3b8' }} onClick={() => setShowLoginModal(false)}>&times;</button>
            <h2 style={{ textAlign: 'center', marginTop: 0, fontWeight: '300' }}>Staff Access</h2>
            <form onSubmit={handleLogin} style={{marginTop: '25px'}}>
              <input style={styles.input} placeholder="Username" required onChange={e => setLoginData({...loginData, username: e.target.value})} />
              <input style={styles.input} type="password" placeholder="Password" required onChange={e => setLoginData({...loginData, password: e.target.value})} />
              <button style={{...styles.btn, marginTop: '10px'}} type="submit">Enter Dashboard</button>
            </form>
          </div>
        </div>
      )}

      <div style={styles.container}>
        <div style={styles.statsGrid}>
          <div style={styles.statCard}><h3 style={{fontSize: '32px', margin: '0'}}>{projects.length}</h3><p style={{color: '#64748b', margin: '5px 0 0 0'}}>Active Projects</p></div>
          <div style={styles.statCard}><h3 style={{fontSize: '32px', margin: '0'}}>{services.length}</h3><p style={{color: '#64748b', margin: '5px 0 0 0'}}>Premium Services</p></div>
        </div>
      
        <h2 style={styles.sectionTitle}>Our Services</h2>

        {/* SEARCH BAR CENTERED */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
          <input 
            style={{ ...styles.searchInput, width: '100%', maxWidth: '500px' }} 
            placeholder="🔍 Search for a service (e.g. Audit, Strategy...)" 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '25px', marginBottom: '50px' }}>
          {filteredServices.map(s => (
            <div key={s.id} style={{ ...styles.card, borderTop: '6px solid #2563eb' }}>
              <h3 style={{marginTop: '0'}}>{s.name}</h3>
              <p style={{color: '#64748b', lineHeight: '1.6'}}>{s.description}</p>
              <p style={{ fontSize: '26px', fontWeight: 'bold', color: '#2563eb', marginBottom: '0' }}>${s.base_price}</p>
            </div>
          ))}
        </div>

        <div style={styles.estimator}>
          <h2 style={{marginBottom: '10px', fontSize: '32px', fontWeight: '300'}}>Estimator Tool</h2>
          <p style={{marginBottom: '30px', opacity: 0.9}}>Get an instant high-level quote for your strategy</p>
          <select onChange={(e) => setSelectedPrice(parseFloat(e.target.value))} style={styles.selectBox}>
            <option value="0">--- Select Service ---</option>
            {services.map(s => <option key={s.id} value={s.base_price}>{s.name}</option>)}
          </select>
          {selectedPrice > 0 && (
            <div style={{marginTop: '30px', fontSize: '28px'}}>
              Total Investment: <span style={{color: '#4ade80', fontWeight: 'bold'}}>${(selectedPrice * 1.15).toFixed(2)}</span>
            </div>
          )}
        </div>
      {/* CONTACT FORM SECTION */}
        <div id="contact-section" style={{ ...styles.card, textAlign: 'center' }}>
          <h2 style={{ fontWeight: '300', fontSize: '28px' }}>Start Your Journey</h2>
          <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: '0 auto' }}>
            <input type="text" placeholder="Full Name" style={styles.input} required value={formData.client_name} onChange={e => setFormData({...formData, client_name: e.target.value})} />
            <input type="email" placeholder="Email Address" style={styles.input} required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            <input type="text" placeholder="Service Interested" style={styles.input} required value={formData.service_interested} onChange={e => setFormData({...formData, service_interested: e.target.value})} />
            <textarea placeholder="Your Message" style={{...styles.input, height: '100px', fontFamily: 'inherit'}} required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
            <button type="submit" style={{...styles.btn, padding: '15px'}}>Submit Request</button>
          </form>
        </div>
      </div>
      <footer style={styles.footer}><p>© 2026 AutoConsult Strategy Portal.</p></footer>
    </div>
  );
}

export default App;