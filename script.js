// Portfolio Website JavaScript - Enhanced with Modals
document.addEventListener('DOMContentLoaded', function() {
    const html = document.documentElement;
    const body = document.body;
    const themeToggle = document.getElementById('themeToggle');
    
    if (!themeToggle) {
        console.error('Theme toggle button not found');
        return;
    }
    
    // Load saved theme from localStorage or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    
    // Theme toggle click handler
    themeToggle.addEventListener('click', function() {
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
    
   // Close on X button
    document.querySelector('.close').onclick = closeModal;
    
    // Close on outside click
    window.onclick = function(event) {
        const modal = document.getElementById('detailModal');
        if (event.target == modal) {
            closeModal();
        }
    };
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
    
    // Function to set theme
    function setTheme(theme) {
        html.setAttribute('data-theme', theme);
        body.setAttribute('data-theme', theme);
        themeToggle.setAttribute('data-theme', theme);
        
        // Update icon visibility with animation
        const sun = themeToggle.querySelector('.sun');
        const moon = themeToggle.querySelector('.moon');
        
        if (sun && moon) {
            if (theme === 'dark') {
                sun.style.display = 'flex';
                moon.style.display = 'none';
            } else {
                sun.style.display = 'none';
                moon.style.display = 'flex';
            }
        }
        
        // Save to localStorage
        localStorage.setItem('theme', theme);
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }
        });
    });
    
    // Add scroll reveal animation
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, observerOptions);
    
    // Observe all cards and timeline items
    const animatedElements = document.querySelectorAll('.card, .timeline-item, .project-card, .exp-card, .cert-card, .stat-card, .skill-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('detailModal');
        if (event.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
        }
    });
});

// Modal Functions
function openCertModal(certId) {
    const modal = document.getElementById('detailModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    const certFiles = {
        'google-analytics': { name: 'Google Analytics Certification', file: 'certificates/google-analytics.png', issuer: 'Google', type: 'image' },
        'aws-cloud': { name: 'AWS Cloud Support Associate', file: 'certificates/aws-cloud.pdf', issuer: 'Amazon Web Services', type: 'pdf' },
        'infosys-bundle': {
            name: 'Infosys Certifications (17 Total)',
            issuer: 'Infosys Limited',
            type: 'bundle',
            files: [
                'infosys/Agile-Scrum-in-Practice.pdf',
                'infosys/Basics-of-Python.pdf',
                'infosys/CSS3-Infosys.pdf',
                'infosys/Database-Management-System-Part-1.pdf',
                'infosys/Database-Management-System-Part-2.pdf',
                'infosys/Email-Writing-Skills.pdf',
                'infosys/Front-End-Web-Developer-Certification.pdf',
                'infosys/High-Impact-Presentations.pdf',
                'infosys/HTML5-Infosys.pdf',
                'infosys/Introduction-to-NoSQL-databases.pdf',
                'infosys/JavaScript-Infosys.pdf',
                'infosys/Object-Oriented-Programming-using-Python.pdf',
                'infosys/Programming-Fundamentals-using-Python-Part-2.pdf',
                'infosys/Python-Foundation-Certification.pdf',
                'infosys/Software-Engineering-and-Agile-software-development.pdf',
                'infosys/Time-Management-certificate.pdf',
                'infosys/AWS-Cloud-Management-certificate.pdf'
            ]
        },
        'ibm-edunet': { name: 'IBM SkillsBuild Certifications', file: 'certificates/ibm-edunet.pdf', issuer: 'IBM via Edunet', type: 'pdf' },
        'fullstack': { name: 'Diploma in Full Stack Development', file: 'certificates/cass-fullstack.jpg', issuer: 'CASS Academy', grade: 'A (83%)', type: 'image' },
        'oracle-cloud': { name: 'Oracle Cloud Infrastructure', file: 'certificates/oracle-cloud.jpg', issuer: 'Oracle', type: 'image' },
        'fusion-ai': { name: 'Fusion AI Foundations', file: 'certificates/oracle-fusion-ai.jpg', issuer: 'Oracle', type: 'image' },
        'machine-learning': { name: 'Introduction to Machine Learning', file: 'certificates/nptel-ml.jpg', issuer: 'NPTEL, IIT Kharagpur', type: 'image' },
        'servicenow-cad': { name: 'ServiceNow CAD Certification', file: 'certificates/servicenow-cad.jpg', issuer: 'ServiceNow', type: 'image' },
        'servicenow-csa': { name: 'ServiceNow CSA Certification', file: 'certificates/servicenow-csa.jpg', issuer: 'ServiceNow', type: 'image' }
    };
    
    const cert = certFiles[certId];
    if (cert) {
        modalTitle.textContent = cert.name;
        
        if (cert.type === 'bundle') {
            // 🎯 STEP 1: "View All Certificates" Screen
            modalBody.innerHTML = `
                <div style="text-align:center;padding:2rem 1rem;">
                    <div style="display:flex;flex-direction:column;gap:1rem;margin-bottom:3rem;align-items:center;">
                        <p style="font-size:1.6rem;margin:0;"><strong>🏢 ${cert.issuer}</strong></p>
                        <p style="color:var(--accent);font-size:1.4rem;font-weight:bold;margin:0;">📚 ${cert.files.length} Certifications</p>
                    </div>
                    
                    <div style="background:linear-gradient(135deg,var(--accent),var(--accent-dark));color:white;padding:20px;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,0.3);">
                        <button onclick="showInfosysCertificates()" 
                                style="background:white;color:var(--accent);padding:16px 40px;border-radius:16px;font-size:1.2rem;font-weight:700;border:none;cursor:pointer;transition:all 0.3s ease;width:100%;max-width:300px;height:60px;">
                            👁️ VIEW ALL CERTIFICATES
                        </button>
                    </div>
                    
                    <p style="margin-top:2rem;color:var(--muted);font-size:0.95rem;">
                        Click above to see all ${cert.files.length} Infosys certificates
                    </p>
                </div>
            `;
        } else {
            // Single certificate display
            modalBody.innerHTML = `
                <div style="text-align:center;padding:2rem 1rem;">
                    <div style="display:flex;flex-direction:column;gap:1rem;margin-bottom:2rem;align-items:center;">
                        <p style="font-size:1.3rem;margin:0;"><strong>🏢 ${cert.issuer}</strong></p>
                        ${cert.grade ? `<p style="color:var(--accent);font-size:1.1rem;font-weight:bold;margin:0;">📊 ${cert.grade}</p>` : ''}
                    </div>
                    
                    ${cert.type === 'pdf' ? 
                        `<iframe src="${cert.file}#toolbar=0&navpanes=0&scrollbar=0" style="width:100%;height:500px;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,0.3);border:3px solid var(--border);" frameborder="0"></iframe>` :
                        `<div style="position:relative;display:inline-block;">
                            <img src="${cert.file}" alt="${cert.name}" 
                                 style="max-width:100%;max-height:500px;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,0.3);cursor:pointer;transition:transform 0.3s ease;"
                                 onclick="this.style.transform=(this.style.transform==='scale(1.05)')?'scale(1)':'scale(1.05)'; event.stopPropagation();">
                        </div>`
                    }
                    
                    <div style="margin-top:2.5rem;display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
                        <a href="${cert.file}" target="_blank" onclick="event.stopPropagation(); window.open('${cert.file}', '_blank');" 
                           style="background:linear-gradient(135deg,#4285F4,#34A853);color:white!important;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:600;font-size:1rem;box-shadow:0 8px 25px rgba(66,133,244,0.4);transition:all 0.3s ease;display:inline-flex;align-items:center;gap:0.5rem;">
                            <i class="fas fa-external-link-alt"></i> Open Full Certificate
                        </a>
                    </div>
                    
                    <p style="margin-top:2rem;color:var(--muted);font-size:0.95rem;text-align:center;">
                        ✅ Official Certificate • Click to view/download • Mobile optimized
                    </p>
                </div>
            `;
        }
        
        showModal();
    }
}

// 🔥 ADD THESE NEW FUNCTIONS (at end of script.js)
// GLOBAL VARIABLE
// GLOBAL VARIABLES
let infosysFiles = [];
let ibmFiles = [];

// 🔥 MAIN MODAL FUNCTION - UPDATED
function openCertModal(certId) {
    const modal = document.getElementById('detailModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    const certFiles = {
        'google-analytics': { name: 'Google Analytics Certification', file: 'certificates/google-analytics.png', issuer: 'Google', type: 'image' },
        'aws-cloud': { name: 'AWS Cloud Support Associate', file: 'certificates/aws-cloud.pdf', issuer: 'Amazon Web Services', type: 'pdf' },
        'infosys-bundle': {
            name: 'Infosys Certifications (17 Total)',
            issuer: 'Infosys Limited',
            type: 'bundle',
            files: [
                'infosys/Agile-Scrum-in-Practice.pdf','infosys/Basics-of-Python.pdf','infosys/CSS3-Infosys.pdf',
                'infosys/Database-Management-System-Part-1.pdf','infosys/Database-Management-System-Part-2.pdf',
                'infosys/Email-Writing-Skills.pdf','infosys/Front-End-Web-Developer-Certification.pdf',
                'infosys/High-Impact-Presentations.pdf','infosys/HTML5-Infosys.pdf','infosys/Introduction-to-NoSQL-databases.pdf',
                'infosys/JavaScript-Infosys.pdf','infosys/Object-Oriented-Programming-using-Python.pdf',
                'infosys/Programming-Fundamentals-using-Python-Part-2.pdf','infosys/Python-Foundation-Certification.pdf',
                'infosys/Software-Engineering-and-Agile-software-development.pdf','infosys/Time-Management-certificate.pdf',
                'infosys/AWS-Cloud-Management-certificate.pdf'
            ]
        },
        'ibm-edunet': {
            name: 'IBM SkillsBuild Certifications (15 Total)',
            issuer: 'IBM via Edunet Foundation',
            type: 'bundle',
            files: [
                'ibm/Communicating-with-impact.pdf',
                'ibm/Create-a-Credly-account.pdf',
                'ibm/Critical-Soft-Skills-for-Project-Managers-Project-Management-Training.pdf',
                'ibm/Cybersecurity-Fundamentals-Earn-a-credential.pdf',
                'ibm/Cybersecurity-Fundamentals.pdf',
                'ibm/Cybersecurity-On-the-Defense.pdf',
                'ibm/Earn-it-Accept-it-Share-it.pdf',
                'ibm/How-is-cybersecurity-used.pdf',
                'ibm/IBM-to-Write-20250620-28ncl.pdf',
                'ibm/Indesign-Career-Guide.pdf',
                'ibm/Introduction-to-Cybersecurity.pdf',
                'ibm/Make-Your-Resume-Stand-Out-from-the-Pile.pdf',
                'ibm/Top-10-Reasons-for-Credly.pdf',
                'ibm/What-is-Cybersecurity-Learning.pdf',
                'ibm/Your-Future-in-Cybersecurity-The-Job-Landscape.pdf'
            ]
        },
        'fullstack': { name: 'Diploma in Full Stack Development', file: 'certificates/cass-fullstack.jpg', issuer: 'CASS Academy', grade: 'A (83%)', type: 'image' },
        'oracle-cloud': { name: 'Oracle Cloud Infrastructure', file: 'certificates/oracle-cloud2025.pdf', issuer: 'Oracle', type: 'pdf' },
        'fusion-ai': { name: 'Fusion AI Foundations', file: 'certificates/oracle-fusion-ai2025.pdf', issuer: 'Oracle', type: 'pdf' },
        'machine-learning': { name: 'Introduction to Machine Learning', file: 'certificates/nptel-ml.png', issuer: 'NPTEL, IIT Kharagpur', type: 'image' },
        'servicenow-csa': { name: 'ServiceNow CSA Certification', file: 'certificates/servicenow-csa.jpg', issuer: 'ServiceNow', type: 'image' }
    };
    
    const cert = certFiles[certId];
    if (cert) {
        modalTitle.textContent = cert.name;
        
        if (cert.type === 'bundle') {
            // DYNAMIC BUNDLE HANDLING
            if (certId === 'infosys-bundle') {
                modalBody.innerHTML = getBundleOverviewHtml(cert, 'showInfosysCertificates()');
            } else if (certId === 'ibm-edunet') {
                modalBody.innerHTML = getBundleOverviewHtml(cert, 'showIbmCertificates()');
            }
        } else {
            // Single certificate display
            modalBody.innerHTML = getSingleCertHtml(cert);
        }
        
        showModal();
    }
}

// 🔥 DYNAMIC HTML GENERATORS
function getBundleOverviewHtml(cert, viewAllFunction) {
    return `
        <div style="text-align:center;padding:2.5rem 1.5rem;background:linear-gradient(135deg,#f5f7fa 0%,#c3cfe2 100%);border-radius:24px;">
            <div style="display:flex;flex-direction:column;gap:1.5rem;margin-bottom:3.5rem;align-items:center;">
                <div style="width:90px;height:90px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 20px 40px rgba(102,126,234,0.4);">
                    <i class="fas fa-certificate" style="font-size:2.5rem;color:white;"></i>
                </div>
                <p style="font-size:1.8rem;margin:0;font-weight:800;color:#2d3748;">${cert.issuer}</p>
                <p style="color:#667eea;font-size:1.6rem;font-weight:800;margin:0;">📚 ${cert.files.length} Certifications</p>
                <div style="font-size:1rem;color:#718096;margin:0;padding:0 2rem;line-height:1.6;">Professional certifications showcasing expertise across modern technologies</div>
            </div>
            
            <div style="perspective:1000px;">
                <div style="position:relative;display:inline-block;">
                    <button onclick="${viewAllFunction}" 
                            style="background:linear-gradient(135deg,#667eea 0%,#764ba2 50%,#f093fb 100%);color:white;padding:22px 50px;border-radius:50px;font-size:1.3rem;font-weight:800;border:none;cursor:pointer;width:320px;height:76px;box-shadow:0 25px 50px rgba(102,126,234,0.4), 0 0 0 1px rgba(255,255,255,0.3) inset;position:relative;overflow:hidden;transition:all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);text-transform:uppercase;letter-spacing:1px;"
                            onmouseover="this.style.transform='translateY(-8px) scale(1.02)';this.style.boxShadow='0 35px 60px rgba(102,126,234,0.5), 0 0 0 1px rgba(255,255,255,0.4) inset';"
                            onmouseout="this.style.transform='translateY(0) scale(1)';this.style.boxShadow='0 25px 50px rgba(102,126,234,0.4), 0 0 0 1px rgba(255,255,255,0.3) inset';">
                        <span style="position:relative;z-index:2;display:flex;align-items:center;justify-content:center;gap:12px;font-size:1.1rem;">👁️ VIEW ALL CERTIFICATES</span>
                    </button>
                </div>
            </div>
            
            <div style="margin-top:3rem;padding:1rem 2rem;background:rgba(255,255,255,0.6);border-radius:16px;box-shadow:0 10px 30px rgba(0,0,0,0.1);">
                <p style="margin:0;color:#4a5568;font-size:1rem;font-weight:500;">Click above to explore all ${cert.files.length} certificates</p>
            </div>
        </div>
    `;
}

function getSingleCertHtml(cert) {
    return `
        <div style="text-align:center;padding:2rem 1rem;">
            <div style="display:flex;flex-direction:column;gap:1rem;margin-bottom:2rem;align-items:center;">
                <p style="font-size:1.3rem;margin:0;"><strong>🏢 ${cert.issuer}</strong></p>
                ${cert.grade ? `<p style="color:var(--accent);font-size:1.1rem;font-weight:bold;margin:0;">📊 ${cert.grade}</p>` : ''}
            </div>
            
            ${cert.type === 'pdf' ? 
                `<iframe src="${cert.file}#toolbar=0&navpanes=0&scrollbar=0" style="width:100%;height:500px;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,0.3);border:3px solid var(--border);" frameborder="0"></iframe>` :
                `<div style="position:relative;display:inline-block;">
                    <img src="${cert.file}" alt="${cert.name}" 
                         style="max-width:100%;max-height:500px;border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,0.3);cursor:pointer;transition:transform 0.3s ease;"
                         onclick="this.style.transform=(this.style.transform==='scale(1.05)')?'scale(1)':'scale(1.05)'; event.stopPropagation();">
                </div>`
            }
            
            <div style="margin-top:2.5rem;display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;">
                <a href="${cert.file}" target="_blank" onclick="event.stopPropagation(); window.open('${cert.file}', '_blank');" 
                   style="background:linear-gradient(135deg,#4285F4,#34A853);color:white!important;padding:14px 28px;border-radius:12px;text-decoration:none;font-weight:600;font-size:1rem;box-shadow:0 8px 25px rgba(66,133,244,0.4);transition:all 0.3s ease;display:inline-flex;align-items:center;gap:0.5rem;">
                    <i class="fas fa-external-link-alt"></i> Open Full Certificate
                </a>
            </div>
            
            <p style="margin-top:2rem;color:var(--muted);font-size:0.95rem;text-align:center;">
                ✅ Official Certificate • Click to view/download • Mobile optimized
            </p>
        </div>
    `;
}

// 🔥 INFOSYS FUNCTIONS (KEEP EXISTING)
function showInfosysCertificates() {
    infosysFiles = ['infosys/Agile-Scrum-in-Practice.pdf','infosys/Basics-of-Python.pdf','infosys/CSS3-Infosys.pdf','infosys/Database-Management-System-Part-1.pdf','infosys/Database-Management-System-Part-2.pdf','infosys/Email-Writing-Skills.pdf','infosys/Front-End-Web-Developer-Certification.pdf','infosys/High-Impact-Presentations.pdf','infosys/HTML5-Infosys.pdf','infosys/Introduction-to-NoSQL-databases.pdf','infosys/JavaScript-Infosys.pdf','infosys/Object-Oriented-Programming-using-Python.pdf','infosys/Programming-Fundamentals-using-Python-Part-2.pdf','infosys/Python-Foundation-Certification.pdf','infosys/Software-Engineering-and-Agile-software-development.pdf','infosys/Time-Management-certificate.pdf','infosys/AWS-Cloud-Management-certificate.pdf'];
    
    const modalTitle = document.getElementById('modalTitle');
    modalTitle.textContent = 'Infosys Certifications - View All';
    
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = getBundleListHtml(infosysFiles, 'Infosys Limited', 'showInfosysOverview()');
}

function showInfosysOverview() {
    const modalTitle = document.getElementById('modalTitle');
    modalTitle.textContent = 'Infosys Certifications (17 Total)';
    document.getElementById('modalBody').innerHTML = getBundleOverviewHtml({issuer: 'Infosys Limited', files: []}, 'showInfosysCertificates()');
}

// 🔥 NEW IBM FUNCTIONS
function showIbmCertificates() {
    ibmFiles = [
        'ibm/Communicating-with-impact.pdf','ibm/Create-a-Credly-account.pdf',
        'ibm/Critical-Soft-Skills-for-Project-Managers-Project-Management-Training.pdf',
        'ibm/Cybersecurity-Fundamentals-Earn-a-credential.pdf','ibm/Cybersecurity-Fundamentals.pdf',
        'ibm/Cybersecurity-On-the-Defense.pdf','ibm/Earn-it-Accept-it-Share-it.pdf',
        'ibm/How-is-cybersecurity-used.pdf','ibm/IBM-to-Write-20250620-28ncl.pdf',
        'ibm/Indesign-Career-Guide.pdf','ibm/Introduction-to-Cybersecurity.pdf',
        'ibm/Make-Your-Resume-Stand-Out-from-the-Pile.pdf','ibm/Top-10-Reasons-for-Credly.pdf',
        'ibm/What-is-Cybersecurity-Learning.pdf','ibm/Your-Future-in-Cybersecurity-The-Job-Landscape.pdf'
    ];
    
    const modalTitle = document.getElementById('modalTitle');
    modalTitle.textContent = 'IBM SkillsBuild Certifications - View All';
    
    const modalBody = document.getElementById('modalBody');
    modalBody.innerHTML = getBundleListHtml(ibmFiles, 'IBM via Edunet Foundation', 'showIbmOverview()');
}

function showIbmOverview() {
    const modalTitle = document.getElementById('modalTitle');
    modalTitle.textContent = 'IBM SkillsBuild Certifications (15 Total)';
    document.getElementById('modalBody').innerHTML = getBundleOverviewHtml({issuer: 'IBM via Edunet Foundation', files: []}, 'showIbmCertificates()');
}

// 🔥 HTML GENERATOR FOR LISTS
function getBundleListHtml(files, issuer, backFunction) {
    let filesHtml = `
        <div style="text-align:center;padding:2rem 1rem;">
            <div style="display:flex;flex-direction:column;gap:1rem;margin-bottom:2rem;align-items:center;">
                <p style="font-size:1.4rem;margin:0;"><strong>🏢 ${issuer}</strong></p>
                <p style="color:#667eea;font-size:1.2rem;font-weight:800;margin:0;">📚 ${files.length} Certifications</p>
                <button onclick="${backFunction}" style="background:linear-gradient(135deg,#667eea,#764ba2);color:white;padding:12px 24px;border-radius:12px;font-size:1rem;font-weight:600;border:none;cursor:pointer;transition:all 0.3s ease;box-shadow:0 8px 25px rgba(102,126,234,0.3);">
                    ← Back to Overview
                </button>
            </div>
            
            <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem;max-height:450px;overflow-y:auto;padding:1.5rem;background:linear-gradient(135deg,#667eea44,#764ba244);border-radius:20px;border:2px solid rgba(255,255,255,0.2);backdrop-filter:blur(10px);">
    `;
    
    files.forEach((file) => {
        const certName = file.replace('ibm/', '').replace('infosys/', '').replace('.pdf', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        filesHtml += `
            <div style="background:linear-gradient(135deg,#4facfe 0%,#00f2fe 100%);border-radius:20px;padding:1.5rem;cursor:pointer;transition:all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);position:relative;overflow:hidden;box-shadow:0 10px 30px rgba(79,172,254,0.3);border:2px solid transparent;"
                 onclick="openCertFile('${file}'); event.stopPropagation();" 
                 onmouseover="this.style.transform='translateY(-10px) scale(1.02)';this.style.boxShadow='0 25px 50px rgba(79,172,254,0.4)';this.style.borderColor='rgba(255,255,255,0.5)';"
                 onmouseout="this.style.transform='translateY(0) scale(1)';this.style.boxShadow='0 10px 30px rgba(79,172,254,0.3)';this.style.borderColor='transparent';">
                <div style="position:absolute;top:15px;right:15px;opacity:0.8;"><i class="fas fa-file-pdf" style="font-size:2rem;color:#ff6b6b;"></i></div>
                <div style="font-weight:800;color:white;font-size:1.1rem;margin-bottom:0.5rem;text-shadow:0 2px 4px rgba(0,0,0,0.3);">${certName}</div>
                <div style="color:rgba(255,255,255,0.9);font-size:0.9rem;">Official Certificate</div>
                <div style="position:absolute;bottom:15px;right:15px;background:rgba(255,255,255,0.2);padding:8px 12px;border-radius:50%;backdrop-filter:blur(10px);">
                    <i class="fas fa-external-link-alt" style="color:white;font-size:1rem;"></i>
                </div>
            </div>
        `;
    });
    
    filesHtml += `</div><p style="margin-top:2rem;color:var(--muted);font-size:0.9rem;text-align:center;">✅ Click any certificate to open • ${files.length} total files</p></div>`;
    return filesHtml;
}

function openCertFile(filePath) {
    window.open('certificates/' + filePath, '_blank');
}

function showModal() {
    const modal = document.getElementById('detailModal');
    window.scrollPosition = window.pageYOffset;
    modal.style.display = 'block';
    document.body.classList.add('modal-open');
}


function openProjectModal(projectId) {
    const modal = document.getElementById('detailModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    const projectData = {
        // 1. INFO SYS FAKE JOB DETECTION
        'infosys-job-detection': {
            title: 'HireShield - Fake Job Detection System',
            description: 'Developed during <strong>Infosys Internship</strong>. ML system to detect fraudulent job postings using advanced NLP techniques with <strong>92% accuracy</strong>.',
            tech: ['Python', 'Scikit-learn', 'NLP', 'Pandas', 'Streamlit'],
            github: 'https://github.com/Ashwin-2006-t/fake-job-detection-individual.git',
            internshipCert: 'certificates/internship/infosys-internship-certificate.pdf',
            achievements: [
                '✅ 92% model accuracy',
                '✅ Processed 10K+ job postings', 
                '✅ Live Streamlit dashboard',
                '✅ Full NLP pipeline implemented'
            ]
        },

        // 2. EV FORECASTING
        'ev-forecasting': {
            title: 'EV Forecasting Project',
            description: 'Academic project with internship-level implementation. Python-based electric vehicle adoption forecasting system using machine learning and data visualization.',
            tech: ['Python', 'Scikit-learn', 'Matplotlib', 'Pandas', 'Jupyter'],
            github: 'https://github.com/Ashwin-2006-t/EV_Forecasting.git',
            internshipCert: 'certificates/internship/ev-project-internship-cert.jpg',
            achievements: [
                '✅ Time-series forecasting model',
                '✅ Interactive visualization dashboard',
                '✅ 85% prediction accuracy'
            ]
        },

        // 3. STEGANOGRAPHY
        'steganography': {
            title: 'Steganography Tool',
            description: 'Internship-grade implementation. Command-line tool for hiding and extracting secret messages in images using LSB steganography technique.',
            tech: ['Python', 'Pillow', 'NumPy'],
            github: 'https://github.com/Ashwin-2006-t/-steganography.git',
            internshipCert: 'certificates/internship/steganography-internship-cert.jpg',
            achievements: [
                '✅ LSB steganography implementation',
                '✅ Encoder/Decoder CLI tools',
                '✅ Supports multiple image formats'
            ]
        }
    };
    
    const project = projectData[projectId];
    if (project) {
        modalTitle.textContent = project.title;
        
        let content = `<p style="font-size: 1.1rem; line-height: 1.8;">${project.description}</p>`;
        
        // Tech stack badges
        if (project.tech) {
            content += '<h3 style="margin-top: 2.5rem; margin-bottom: 1.25rem; color: var(--accent);">🛠️ Technologies Used</h3>';
            content += '<div class="tech-tags" style="display: flex; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 2rem;">';
            project.tech.forEach(tech => {
                content += `<span class="badge primary" style="font-size: 0.9rem; padding: 0.5rem 1rem;">${tech}</span>`;
            });
            content += '</div>';
        }
        
        // Achievements
        if (project.achievements) {
            content += '<h3 style="margin-top: 2rem; margin-bottom: 1.25rem; color: var(--accent);">🏆 Key Achievements</h3><ul style="font-size: 1.05rem;">';
            project.achievements.forEach(achievement => {
                content += `<li style="margin-bottom: 0.75rem;">${achievement}</li>`;
            });
            content += '</ul>';
        }
        
        // 🔥 CERTIFICATE + GITHUB BUTTONS - CHANGED TEXT
        content += `
            <div style="margin-top: 3rem; display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">
                <a href="${project.github}" target="_blank" rel="noopener noreferrer" class="view-btn" style="background: linear-gradient(135deg, #24292e, #161b22); padding: 1rem 2rem;">
                    <i class="fab fa-github"></i> View on GitHub
                </a>
                <a href="${project.internshipCert}" target="_blank" class="view-btn" style="background: linear-gradient(135deg, var(--accent), var(--accent-soft)); padding: 1rem 2rem;">
                    <i class="fas fa-certificate"></i> Certificate
                </a>
            </div>
            <p style="margin-top: 2rem; color: var(--muted); font-style: italic; text-align: center;">
                📄 Official project certificate + complete source code available
            </p>
        `;
        
        modalBody.innerHTML = content;
        showModal();
    }
}

function openExperienceModal(expId) {
    const modal = document.getElementById('detailModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    const expData = {
        // 1. INFOSYS
        'infosys': {
            title: 'Infosys - Machine Learning Intern',
            company: 'Infosys Limited',
            duration: '8 Weeks',
            project: 'HireShield - Fake Job Detection System',
            description: 'Developed ML system achieving <strong>92% accuracy</strong> for detecting fraudulent job postings. Processed 10K+ job listings using advanced NLP techniques.',
            achievements: [
                '✅ Built 92% accurate ML classification model',
                '✅ Deployed production-ready Streamlit dashboard', 
                '✅ Full NLP pipeline implementation',
                '✅ Processed 10K+ real job postings'
            ],
            certificates: [
                'certificates/internship/infosys-internship-certificate.pdf'
            ]
        },

        // 2. CODEBIND - 4 CERTIFICATES ONLY (REMOVED MAIN CERT)
        'codebind': {
            title: 'CodeBind - Web Development & Business Management',
            company: 'CodeBind Technologies',
            duration: '2 Weeks',
            description: 'Intensive training in full-stack web development, agile methodologies, and business management practices. Built client-facing web applications.',
            achievements: [
                '✅ Full-stack web app development',
                '✅ Agile project management training', 
                '✅ Client project deployment experience',
                '✅ Modern frontend/backend frameworks'
            ],
            certificates: [
                'certificates/internship/codeBind/codebind-web-development.jpg',
                'certificates/internship/codeBind/codebind-business-management.jpg',
                'certificates/internship/codeBind/codebind-ai-workshop.jpg',
                'certificates/internship/codeBind/codebind-corporate-training.jpg'
            ]
        },

        // 3. EDUNET
        'edunet': {
            title: 'Edunet Foundation & AICTE - Cybersecurity Intern',
            company: 'Edunet Foundation (AICTE Approved)',
            duration: '6 Weeks',
            description: 'Specialized cybersecurity internship focusing on threat detection, vulnerability assessment, and secure AI applications for green skills initiatives.',
            achievements: [
                '✅ Cybersecurity threat detection systems',
                '✅ AICTE-approved certification', 
                '✅ Vulnerability assessment projects',
                '✅ Secure AI application development'
            ],
            certificates: [
                'certificates/internship/steganography-internship-cert.jpg'
            ]
        }
    };
    
    const exp = expData[expId];
    if (exp) {
        modalTitle.textContent = exp.title;
        
        // Company info + description + achievements
        let content = `
            <div style="display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem;">
                <p><strong>Company:</strong> ${exp.company}</p>
                <p><strong>Duration:</strong> ${exp.duration}</p>
                ${exp.project ? `<p><strong>Project:</strong> ${exp.project}</p>` : ''}
            </div>
            <p style="line-height: 1.7; margin-bottom: 2rem;">${exp.description}</p>
        `;
        
        // Achievements
        if (exp.achievements) {
            content += `
                <h3 style="margin-top: 2rem; margin-bottom: 1rem; color: var(--accent);">🏆 Key Achievements</h3>
                <ul style="margin-bottom: 2rem;">
            `;
            exp.achievements.forEach(achievement => {
                content += `<li style="margin-bottom: 0.75rem; font-weight: 500;">${achievement}</li>`;
            });
            content += '</ul>';
        }
        
        // 🔥 CERTIFICATES GRID - 4 CERTS FOR CODEBIND
        content += `
            <h3 style="margin-top: 2rem; margin-bottom: 1.5rem; color: var(--accent);">📚 Certificates Earned (${exp.certificates.length})</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem;">
        `;
        
        exp.certificates.forEach((certFile, index) => {
            const certNames = {
                // CodeBind specific names (4 certs only)
                'codebind-web-development.pdf': 'Web Development',
                'codebind-business-management.pdf': 'Business Management',
                'codebind-ai-workshop.pdf': 'AI Workshop',
                'codebind-corporate-training.pdf': 'Corporate Training',
                // Default names
                'default': `Certificate ${index + 1}`
            };
            
            const certName = certNames[certFile.split('/').pop()] || certNames['default'];
            const icons = ['🌐', '📊', '🧠', '🎓'];
            const icon = icons[index % icons.length];
            
            content += `
                <a href="${certFile}" target="_blank" style="
                    display: flex; flex-direction: column; align-items: center; gap: 0.75rem; 
                    padding: 1.75rem 1.25rem; background: var(--card); border: 2px solid var(--border); 
                    border-radius: var(--radius); text-decoration: none; color: var(--text); 
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); text-align: center;
                    backdrop-filter: blur(10px);
                " 
                onmouseover="this.style.transform='translateY(-10px) scale(1.02)'; this.style.borderColor='var(--accent)'; this.style.boxShadow='0 20px 40px var(--shadow-lg)';"
                onmouseout="this.style.transform='translateY(0) scale(1)'; this.style.borderColor='var(--border)'; this.style.boxShadow='0 10px 25px var(--shadow)';">
                    <div style="width: 60px; height: 60px; background: linear-gradient(135deg, var(--accent), var(--accent-soft)); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; color: white;">
                        ${icon}
                    </div>
                    <div style="font-weight: 700; font-size: 0.95rem; line-height: 1.3;">${certName}</div>
                </a>
            `;
        });
        
        content += `
            </div>
            <p style="margin-top: 2.5rem; color: var(--muted); font-style: italic; text-align: center; padding: 1rem; background: rgba(34,197,94,0.1); border-radius: var(--radius-sm);">
                👆 Click any certificate above to view/download the official PDF
            </p>
        `;
        
        modalBody.innerHTML = content;
        showModal();
    }
}



function closeModal() {
    const modal = document.getElementById('detailModal');
    
    // **CRITICAL SCROLL FIX**
    document.body.style.overflow = '';           // Unlock scroll
    document.body.style.position = '';           // Reset position
    document.body.style.width = '';              // Reset width
    document.body.style.top = '';                // Reset top
    
    // Restore scroll position
    if (window.scrollPosition) {
        window.scrollTo(0, window.scrollPosition);
    }
    
    modal.style.display = 'none';
}


// Add hover effects to badges
document.querySelectorAll('.badge').forEach(badge => {
    badge.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-4px) scale(1.05)';
    });
    
    badge.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add parallax effect to hero section
const hero = document.getElementById('hero');
if (hero) {
    let ticking = false;
    
    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(function() {
                const scrolled = window.pageYOffset;
                const parallaxSpeed = 0.3;
                if (scrolled < window.innerHeight) {
                    hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
                    hero.style.opacity = 1 - (scrolled / 600);
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Add click ripple effect
function createRipple(event) {
    const button = event.currentTarget;
    const ripple = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    
    ripple.style.width = ripple.style.height = `${diameter}px`;
    ripple.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    ripple.style.top = `${event.clientY - button.offsetTop - radius}px`;
    ripple.classList.add('ripple');
    
    const rippleElement = button.getElementsByClassName('ripple')[0];
    if (rippleElement) {
        rippleElement.remove();
    }
    
    button.appendChild(ripple);
}

document.querySelectorAll('.contact-btn, .view-btn, .badge').forEach(btn => {
    btn.addEventListener('click', createRipple);
});

// Performance monitoring
window.addEventListener('load', function() {
    const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
    console.log(`Portfolio loaded in ${loadTime}ms`);
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ... your existing code (theme toggle, modals, animations, etc.) ...

// ADD THIS AT THE VERY END (after EVERYTHING else)
document.addEventListener('click', function(e) {
    // Open certificate button
    if (e.target.classList.contains('cert-btn-open') || e.target.closest('.cert-btn-open')) {
        e.stopPropagation(); // Prevent modal close
        const file = e.target.dataset.file || e.target.closest('.cert-btn-open').dataset.file;
        window.open(file, '_blank');
        return;
    }
    
    // Download certificate button  
    if (e.target.classList.contains('cert-btn-download') || e.target.closest('.cert-btn-download')) {
        e.stopPropagation(); // Prevent modal close
        const file = e.target.dataset.file || e.target.closest('.cert-btn-download').dataset.file;
        const a = document.createElement('a');
        a.href = file;
        a.download = '';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        return;
    }
    
    // Zoom certificate image
    if (e.target.id === 'zoomCertImg') {
        e.stopPropagation();
        const img = e.target;
        img.style.transform = img.style.transform === 'scale(1.1)' ? 'scale(1)' : 'scale(1.1)';
        return;
    }
});
// 🔥 PERFECT SMOOTH NAVIGATION
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.nav-menu a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href');
            
            // Remove active from all sections
            document.querySelectorAll('#objective, #skills, #projects, #experience, #certifications')
                .forEach(section => section.classList.remove('active'));
            
            // Smooth scroll + activate
            document.querySelector(sectionId)?.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
            
            setTimeout(() => {
                document.querySelector(sectionId)?.classList.add('active');
            }, 300);
        });
    });
});
