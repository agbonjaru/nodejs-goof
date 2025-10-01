# 🔐 Vulnerability Assessment Demo - Complete Setup

**Red Hat Cybersecurity Engineering - Reverse Career Fair**

---

## 🎯 Demo Overview

This is a **complete vulnerability assessment demonstration** featuring:
- ✅ **10 different attack categories** with live exploitation
- ✅ **Interactive attack menu** with step-by-step guidance
- ✅ **138 known vulnerabilities** across multiple severity levels
- ✅ **Real-world exploit techniques** used by attackers
- ✅ **Red Hat defensive strategies** (SELinux, SCAP, containers)

---

## 🚀 Quick Start (2 Commands!)

```bash
# 1. Start the vulnerable application
cd /Users/bigmac/Documents/workspace/agbonjaru/personal/projects/nodejs-goof
./attack-menu.sh

# 2. Select attacks from the interactive menu!
```

---

## 📋 Prerequisites

### Application Status
- ✅ **nodejs-goof app**: Running on http://localhost:3001
- ✅ **MongoDB**: Running in Docker container (port 27017)
- ✅ **Dependencies**: Installed (1373 packages, 138 vulnerabilities)

### Verify Everything Works
```bash
# Check app status
curl -I http://localhost:3001

# Should return: HTTP/1.1 200 OK
```

---

## 🎭 Interactive Attack Menu Features

### Available Attacks

| # | Attack Type | Severity | CWE | Impact |
|---|------------|----------|-----|--------|
| **1** | **NoSQL Injection** | 🔴 Critical | CWE-89 | Auth bypass |
| **2** | **Directory Traversal** | 🟠 High | CWE-22 | File read |
| **3** | **XSS & Open Redirect** | 🟡 Medium | CWE-79, CWE-601 | Session hijack |
| **4** | **Command Injection** | 🔴 Critical | CWE-78 | RCE |
| **5** | **Prototype Pollution** | 🟠 High | CWE-1321 | Privilege escalation |
| **6** | **ReDoS** | 🟠 High | CWE-1333 | DoS |
| **7** | **Zip Slip** | 🟠 High | CWE-22 | Arbitrary file write |
| **8** | **XSS via Marked** | 🟡 Medium | CVE-2017-17461 | Cookie theft |
| **9** | **Info Disclosure** | 🟠 High | CVE-2015-8858 | /etc/passwd read |
| **10** | **Vuln Scan** | ℹ️ Info | - | NPM audit |

### Utility Options
- **[C]** - Check application health status
- **[R]** - Reset session cookies
- **[Q]** - Quit

---

## 📚 Documentation Files

### 1. **attack-menu.sh** (Main Demo Script)
- Interactive color-coded menu
- Step-by-step attack execution
- Automated exploitation with explanations
- **Usage**: `./attack-menu.sh`

### 2. **ATTACK_REFERENCE.md** (Technical Deep-Dive)
- All attack commands with explanations
- CVE references and CVSS scores
- Manual exploitation steps
- Red Hat defensive measures
- Recovery commands

### 3. **REVERSE_CAREER_FAIR_DEMO.md** (Presentation Guide)
- Executive summary
- Talking points for demo
- Q&A preparation
- Demonstration flow
- Time estimates (15-20 min)

### 4. **README_DEMO.md** (This File!)
- Quick start guide
- Architecture overview
- Troubleshooting

---

## 🎬 Recommended Demo Flow

### Option A: **Quick Impact Demo** (5 minutes)
```
1. Launch menu: ./attack-menu.sh
2. [1] NoSQL Injection - Bypass authentication
3. [2] Directory Traversal - Read package.json
4. [10] Vulnerability Scan - Show 138 vulnerabilities
```

### Option B: **Comprehensive Demo** (15 minutes)
```
1. [C] Check Status - Show app is online
2. [1] NoSQL Injection - All 3 tests
3. [2] Directory Traversal - Read sensitive files
4. [5] Prototype Pollution - Privilege escalation
5. [4] Command Injection - RCE demonstration
6. [10] Vulnerability Scan - Full npm audit
7. Discuss Red Hat defensive strategies
```

### Option C: **Advanced Red Team Demo** (20 minutes)
```
1. [1] NoSQL Injection
2. [2] Directory Traversal
3. [4] Command Injection (RCE)
4. [5] Prototype Pollution
5. [6] ReDoS (DoS attack)
6. [9] Information Disclosure (/etc/passwd)
7. Show exploitation chain combining vulnerabilities
8. Demonstrate Red Hat hardening (SELinux, firewalld, SCAP)
```

---

## 🛠️ Manual Command Examples

### NoSQL Injection (Fastest Impact)
```bash
curl -X POST http://localhost:3001/login \
  -H 'Content-Type: application/json' \
  -d '{"username": "admin@snyk.io", "password": {"$gt": ""}}'

# Expected: 302 Redirect to /admin
```

### Directory Traversal (Read package.json)
```bash
# Step 1: Authenticate
curl -X POST http://localhost:3001/login -c /tmp/cookies.txt \
  -H 'Content-Type: application/json' \
  -d '{"username": "admin@snyk.io", "password": {"$gt": ""}}'

# Step 2: Exploit
curl -X POST http://localhost:3001/account_details -b /tmp/cookies.txt \
  -H 'Content-Type: application/json' \
  -d '{"email": "admin@snyk.io", "firstname": "admin", "lastname": "admin",
       "country": "IL", "phone": "+972551234123", "layout": "./../package.json"}'
```

### Information Disclosure (Read /etc/passwd)
```bash
curl -s 'http://localhost:3001/public/%2e%2e/%2e%2e/%2e%2e/etc/passwd' | head -10
```

---

## 🔧 Troubleshooting

### Application Not Responding
```bash
# Check if app is running
lsof -ti:3001

# Restart if needed
pkill -f "node app.js"
cd /Users/bigmac/Documents/workspace/agbonjaru/personal/projects/nodejs-goof
npm start &
```

### MongoDB Connection Issues
```bash
# Check MongoDB container
docker ps | grep mongo

# Restart if needed
docker stop goof-mongo
docker run -d -p 27017:27017 --name goof-mongo mongo:3
```

### Attack Script Not Executable
```bash
chmod +x /Users/bigmac/Documents/workspace/agbonjaru/personal/projects/nodejs-goof/attack-menu.sh
```

### ReDoS Attack Hangs Application
```bash
# This is expected! ReDoS causes CPU exhaustion
# Kill and restart:
pkill -f "node app.js"
npm start &
```

---

## 🎓 Learning Objectives

After this demo, audience will understand:

1. **Offensive Security**
   - How attackers exploit web applications
   - OWASP Top 10 vulnerabilities in practice
   - Chaining exploits for maximum impact

2. **Defensive Strategies**
   - Input validation and sanitization
   - Output encoding
   - Dependency management
   - Security automation (SAST/DAST/SCA)

3. **Red Hat Approach**
   - SELinux mandatory access control
   - SCAP compliance automation
   - Container security (Podman/OpenShift)
   - Defense in depth

---

## 💡 Talking Points for Demo

### Opening
> "Today I'll demonstrate 10 real-world vulnerabilities in this intentionally vulnerable Node.js application. These aren't theoretical - they're actively exploited attacks that cost organizations millions annually."

### During NoSQL Injection
> "Notice how we bypassed authentication without knowing ANY credentials. This is why input validation is critical - never trust user input, especially when building database queries."

### During Directory Traversal
> "We just read the package.json file. In a real attack, this could be .env files with API keys, database credentials, or AWS secrets. Game over."

### During Command Injection
> "This is Remote Code Execution - the holy grail of hacking. We now have the same privileges as the application. On a misconfigured system, that's often root."

### Closing
> "Red Hat's approach combines multiple defense layers: SELinux confines processes even if exploited, SCAP ensures compliance, and container security isolates workloads. Defense in depth is key."

---

## 📊 Vulnerability Statistics

```
Total Vulnerabilities: 138
├── Critical:  36 (🔴 Immediate action required)
├── High:      65 (🟠 Priority remediation)
├── Moderate:  28 (🟡 Scheduled fixes)
└── Low:        9 (🔵 Technical debt)

Notable CVEs:
- CVE-2019-2391: Mongoose buffer exposure
- CVE-2017-16119: Express security misconfiguration
- CVE-2017-17461: Marked XSS
- CVE-2015-8858: ST directory traversal
- CVE-2019-10744: Lodash prototype pollution
```

---

## 🔗 Resources

### Documentation
- 📖 **ATTACK_REFERENCE.md** - Comprehensive attack guide
- 📊 **REVERSE_CAREER_FAIR_DEMO.md** - Presentation materials
- 🎯 **attack-menu.sh** - Interactive attack tool

### External References
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE Database](https://cwe.mitre.org/)
- [Red Hat Security](https://access.redhat.com/security/)
- [Snyk Vulnerability DB](https://snyk.io/vuln/)

---

## 🎉 Demo Checklist

### Before Starting
- [ ] Application running (http://localhost:3001)
- [ ] MongoDB container active
- [ ] attack-menu.sh executable
- [ ] Browser open for visual confirmation
- [ ] Terminal sized appropriately for audience

### During Demo
- [ ] Explain WHAT you're doing
- [ ] Explain WHY it works
- [ ] Show the IMPACT
- [ ] Discuss the FIX
- [ ] Tie to Red Hat solutions

### After Demo
- [ ] Answer questions
- [ ] Share documentation links
- [ ] Collect feedback
- [ ] Clean up test data

---

## 🏆 Success Criteria

✅ **Demonstrated technical expertise** in vulnerability assessment
✅ **Showed practical exploitation skills** across multiple attack vectors
✅ **Explained defensive strategies** from a Red Hat perspective
✅ **Engaged audience** with interactive, visual demonstrations
✅ **Answered questions** confidently and accurately

---

## 📞 Support

If you encounter issues during the demo:

1. **Check application status**: `curl -I http://localhost:3001`
2. **Review logs**: Check terminal running `npm start`
3. **Restart services**: MongoDB and Node.js app
4. **Consult ATTACK_REFERENCE.md**: Manual commands as backup

---

## 🎯 Final Tips

1. **Practice beforehand** - Run through each attack 2-3 times
2. **Have backup slides** - In case of technical issues
3. **Know your audience** - Adjust technical depth accordingly
4. **Time yourself** - 15-20 minutes is optimal
5. **Be confident** - You're demonstrating real security expertise!

---

**Good luck with your reverse career fair demo!**

**🔒 Stay secure, stay vigilant! 🛡️**
