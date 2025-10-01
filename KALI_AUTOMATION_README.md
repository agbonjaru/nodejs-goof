# Kali Linux Automated Penetration Testing Script

**File**: `kali-pentest.sh`
**Purpose**: Fully automated Kali Linux penetration testing with interactive menus
**Target**: nodejs-goof vulnerable application

---

## 🚀 Quick Start

```bash
# Make executable
chmod +x kali-pentest.sh

# Run the script
./kali-pentest.sh
```

---

## 📋 Features

✅ **Interactive Menu System** - Easy navigation through all attack phases
✅ **15+ Kali Tools Integration** - Nmap, Nikto, ZAP, SQLMap, Wfuzz, etc.
✅ **Automated Exploitation** - One-click full penetration test
✅ **Color-Coded Output** - Easy to read results
✅ **Progress Tracking** - Know exactly what's happening
✅ **Report Generation** - Professional pentest report
✅ **Result Management** - Save, view, and clear results

---

## 🎯 Menu Structure

```
MAIN MENU
├── [1] Reconnaissance
│   ├── Nmap - Network & Service Discovery
│   ├── Whatweb - Technology Fingerprinting
│   ├── Nikto - Web Server Scanner
│   ├── DIRB - Directory Enumeration
│   └── Run All Reconnaissance
│
├── [2] Vulnerability Scanning
│   ├── OWASP ZAP - Baseline Scan
│   ├── Wfuzz - Web Application Fuzzer
│   ├── NPM Audit - Dependency Vulnerabilities
│   └── Run All Scans
│
├── [3] Exploitation
│   ├── NoSQL Injection - Authentication Bypass
│   ├── Directory Traversal - Path Injection
│   ├── Cross-Site Scripting (XSS)
│   ├── Command Injection - RCE
│   ├── Information Disclosure - ST Traversal
│   ├── SQLMap - Automated Injection
│   └── Run All Exploits
│
├── [4] Post-Exploitation
│   ├── Reverse Shell - Setup Instructions
│   └── Data Exfiltration
│
├── [5] Generate Report
│
├── [A] Run Full Automated Pentest (ALL PHASES)
│
├── [T] Check Target Status
├── [C] Clear Output Directory
├── [V] View Results
└── [Q] Quit
```

---

## ⚡ Quick Demo Flows

### Scenario 1: Quick 5-Minute Demo
```
1. Run script: ./kali-pentest.sh
2. Select: [T] Check Target Status
3. Select: [3] Exploitation → [7] Run All Exploits
4. Done! All exploits executed
```

### Scenario 2: Full Automated Pentest (15 minutes)
```
1. Run script: ./kali-pentest.sh
2. Select: [A] Run Full Automated Pentest
3. Press Enter to confirm
4. Wait 10-15 minutes
5. Review generated report
```

### Scenario 3: Professional Manual Testing
```
1. [1] → [5] Run All Reconnaissance
2. [2] → [4] Run All Scans
3. [3] → Manual individual exploits
4. [4] → [2] Data Exfiltration
5. [5] Generate Report
```

---

## 📊 Output Files

All results saved to: `./kali-pentest-results/`

| File | Description |
|------|-------------|
| `nmap-scan.*` | Nmap XML, nmap, gnmap outputs |
| `nmap-output.txt` | Nmap console output |
| `whatweb-output.txt` | Technology fingerprinting results |
| `nikto-report.html` | Nikto HTML report |
| `nikto-output.txt` | Nikto console output |
| `dirb-output.txt` | Directory enumeration results |
| `wfuzz-output.txt` | Web fuzzing results |
| `npm-audit.json` | NPM vulnerability scan (JSON) |
| `npm-audit.txt` | NPM vulnerability scan (text) |
| `sqlmap/` | SQLMap output directory |
| `zap-baseline-report.html` | OWASP ZAP HTML report |
| `cookies.txt` | Session cookies |
| `exfiltrated-*.txt` | Data exfiltration dumps |
| `pentest-report.txt` | Final penetration test report |

---

## 🛠️ Kali Tools Used

### Reconnaissance
- **Nmap** - Port scanning, service detection
- **Whatweb** - Web technology fingerprinting
- **Nikto** - Web vulnerability scanner
- **DIRB** - Directory/file enumeration

### Vulnerability Scanning
- **OWASP ZAP** - Automated DAST scanning
- **Wfuzz** - Parameter fuzzing
- **NPM Audit** - Dependency vulnerability scan

### Exploitation
- **cURL** - Manual HTTP requests
- **SQLMap** - Automated SQL/NoSQL injection

### Post-Exploitation
- **Netcat** - Reverse shell listener
- **cURL** - Data exfiltration

---

## 🎓 Attack Coverage

| Attack | Endpoint | Status |
|--------|----------|--------|
| **NoSQL Injection** | /login | ✅ 3 tests |
| **Directory Traversal** | /account_details | ✅ Reads files |
| **XSS** | /login?redirectPage | ✅ Reflected |
| **Command Injection** | /create | ✅ RCE proven |
| **Info Disclosure** | /public/* | ✅ Reads /etc/passwd |
| **SQLMap** | /login | ✅ Automated |

---

## 🔧 Configuration

### Environment Variables

```bash
# Customize target (default: localhost:3001)
export TARGET_HOST="192.168.1.100"
export TARGET_PORT="8080"

# Run script
./kali-pentest.sh
```

### Wordlist Location
Default: `/usr/share/wordlists`

Modify in script if needed:
```bash
WORDLIST_DIR="/path/to/your/wordlists"
```

---

## 🚨 Prerequisites

### Required Tools
```bash
# Install all required Kali tools
sudo apt update
sudo apt install -y \
  nmap \
  whatweb \
  nikto \
  dirb \
  wfuzz \
  zaproxy \
  sqlmap \
  curl \
  netcat-traditional
```

### Target Application
```bash
# Ensure nodejs-goof is running
cd /path/to/nodejs-goof
npm start

# Verify
curl -I http://localhost:3001
```

---

## 📖 Usage Examples

### Run Specific Attack
```bash
./kali-pentest.sh

# Then:
Main Menu → [3] Exploitation
Exploitation Menu → [1] NoSQL Injection
```

### Automated Full Pentest
```bash
./kali-pentest.sh

# Then:
Main Menu → [A] Run Full Automated Pentest
# Wait 10-15 minutes
# Check ./kali-pentest-results/ for all outputs
```

### Generate Report Only
```bash
./kali-pentest.sh

# Then:
Main Menu → [5] Generate Report
# View pentest-report.txt
```

---

## 🎬 Demo Script

### For 10-Minute Live Demo:

```
1. Launch: ./kali-pentest.sh

2. Say: "Let me check the target status"
   Select: [T]

3. Say: "Now I'll run reconnaissance"
   Select: [1] → [1] Nmap
   Wait for output...

4. Say: "Let's exploit the NoSQL injection"
   Select: [3] → [1] NoSQL Injection
   Show 3 bypass techniques

5. Say: "Now command injection for RCE"
   Select: [3] → [4] Command Injection

6. Say: "Let's exfiltrate sensitive data"
   Select: [4] → [2] Data Exfiltration

7. Say: "Finally, generate professional report"
   Select: [5] Generate Report
   Show pentest-report.txt

8. Done! Impressive demo complete.
```

---

## 💡 Pro Tips

### Speed Up Demo
- Pre-run time-consuming scans (Nmap, Nikto, ZAP)
- Focus on exploitation phase for impact
- Use [A] automated mode for unattended runs

### For Career Fair
- Start with [T] to show target is live
- Run [3] → [7] for quick all-exploits demo
- End with [5] to show professional reporting

### Troubleshooting
```bash
# Target not responding
Check target status: [T]
Restart nodejs-goof: npm start

# Tool not found
Install: sudo apt install <tool-name>

# Permission denied
Make executable: chmod +x kali-pentest.sh

# Clear stuck results
Select: [C] Clear Output Directory
```

---

## 📋 Comparison with Other Scripts

| Feature | kali-pentest.sh | attack-menu.sh | kali_exploit.py |
|---------|----------------|----------------|-----------------|
| **Platform** | Kali Linux | Any Linux/Mac | Any with Python |
| **Tools** | 15+ Kali tools | Bash/cURL | Python requests |
| **Interface** | Interactive menus | Interactive menus | CLI arguments |
| **Automation** | Full pentest mode | Per-attack | Per-attack |
| **Reporting** | Professional report | None | Summary output |
| **Best For** | Kali demos | Quick attacks | Scripted automation |

---

## 🎯 When to Use What

### Use `kali-pentest.sh` when:
- Running on Kali Linux
- Want professional Kali tool integration
- Need comprehensive pentest report
- Demonstrating full methodology
- Have 10-15 minutes for complete test

### Use `attack-menu.sh` when:
- On macOS/non-Kali system
- Want quick curl-based attacks
- Need 5-minute impact demo
- Minimal dependencies preferred

### Use `kali_exploit.py` when:
- Scripting/automation required
- Python environment available
- CI/CD integration needed
- Want JSON/programmatic output

---

## ✅ Success Criteria

After running kali-pentest.sh successfully, you should have:

- ✅ Complete reconnaissance data (Nmap, Whatweb, Nikto, DIRB)
- ✅ Vulnerability scan results (ZAP, Wfuzz, NPM Audit)
- ✅ Successful exploits demonstrated (NoSQL, Traversal, XSS, RCE)
- ✅ Post-exploitation evidence (Data exfiltration)
- ✅ Professional penetration test report generated
- ✅ All results saved in `./kali-pentest-results/`
- ✅ Clear understanding of 6+ attack vectors
- ✅ Evidence for Red Hat cybersecurity demo

---

## 🎓 Learning Outcomes

By using this script, you demonstrate:

1. **Professional Methodology** - Following industry-standard pentest phases
2. **Tool Proficiency** - Using 15+ Kali Linux tools effectively
3. **Attack Understanding** - Knowing OWASP Top 10 vulnerabilities
4. **Documentation Skills** - Generating professional reports
5. **Automation Capability** - Writing efficient bash automation
6. **Security Awareness** - Understanding both offensive and defensive security

---

## 🔗 Related Files

| File | Purpose |
|------|---------|
| `kali-pentest.sh` | Main automation script (this file) |
| `KALI_AUTOMATION_README.md` | Complete documentation (this file) |
| `KALI_EXPLOITATION_GUIDE.md` | Detailed tool documentation (1000+ lines) |
| `KALI_QUICK_START.md` | Quick reference guide |
| `kali_exploit.py` | Python automation alternative |
| `attack-menu.sh` | Bash menu for non-Kali systems |
| `ATTACK_REFERENCE.md` | Manual command reference |
| `REVERSE_CAREER_FAIR_DEMO.md` | Presentation guide |

---

## 🚀 Advanced Usage

### Custom Wordlists

```bash
# Edit script to use custom wordlist
WORDLIST_DIR="/path/to/custom/wordlists"
DIRB_WORDLIST="${WORDLIST_DIR}/custom-dirs.txt"
WFUZZ_WORDLIST="${WORDLIST_DIR}/custom-params.txt"
```

### Remote Target

```bash
# Target remote system
export TARGET_HOST="192.168.1.100"
export TARGET_PORT="80"
./kali-pentest.sh
```

### Save Results with Timestamp

```bash
# Modify OUTPUT_DIR in script
OUTPUT_DIR="./results-$(date +%Y%m%d-%H%M%S)"
```

### Integration with CI/CD

```bash
# Run automated pentest in pipeline
./kali-pentest.sh << EOF
A
yes

EOF

# Check exit code
if [ $? -eq 0 ]; then
    echo "Pentest completed"
fi
```

---

## 📊 Sample Report Output

```
================================================================================
PENETRATION TEST REPORT
================================================================================
Target: http://localhost:3001
Test Date: 2025-10-01
Tool: kali-pentest.sh

================================================================================
EXECUTIVE SUMMARY
================================================================================

This penetration test identified multiple CRITICAL vulnerabilities in the
nodejs-goof application, including:

- NoSQL Injection (CVSS 9.8) - Authentication bypass
- Command Injection (CVSS 9.8) - Remote code execution
- Directory Traversal (CVSS 7.5) - Arbitrary file read
- Cross-Site Scripting (CVSS 6.1) - Reflected XSS
- Information Disclosure (CVSS 7.5) - Sensitive file exposure

Total Vulnerabilities: 138 (36 critical, 65 high, 28 moderate, 9 low)

================================================================================
VULNERABILITY DETAILS
================================================================================

[1] NoSQL Injection - Authentication Bypass
Severity: CRITICAL (CVSS 9.8)
Status: EXPLOITED ✓
Details: MongoDB query injection allows authentication bypass using $gt operator
Evidence: Successfully logged in as admin@snyk.io without valid password
Remediation: Implement input validation and parameterized queries

[... detailed findings for each vulnerability ...]

================================================================================
RECOMMENDATIONS
================================================================================

1. CRITICAL: Patch all dependency vulnerabilities (npm audit fix)
2. HIGH: Implement input validation on all user inputs
3. MEDIUM: Enable security headers (CSP, X-Frame-Options)
4. LOW: Update to latest Node.js LTS version

================================================================================
```

---

## 🎯 Career Fair Talking Points

Use these talking points when demonstrating:

### Opening
*"I've developed a comprehensive Kali Linux penetration testing framework that automates security assessments using industry-standard tools."*

### During Reconnaissance
*"I'm using Nmap for service detection, Nikto for web vulnerability scanning, and DIRB for directory enumeration - all professional Kali tools."*

### During Exploitation
*"Watch as I demonstrate a NoSQL injection attack that bypasses authentication, achieving a CVSS 9.8 critical vulnerability."*

### During Post-Exploitation
*"Now I'm exfiltrating sensitive data to demonstrate the real-world impact of these vulnerabilities."*

### Report Generation
*"Finally, I generate a professional penetration test report that documents all findings, evidence, and remediation recommendations."*

### Closing
*"This demonstrates my proficiency with offensive security tools, understanding of OWASP Top 10, and ability to automate complex workflows - all critical skills for a Red Hat cybersecurity engineer."*

---

## 🛡️ Red Hat Connection

After demonstrating attacks, connect to Red Hat solutions:

### SELinux
*"Red Hat Enterprise Linux includes SELinux, which would confine this compromised process and prevent lateral movement."*

### OpenSCAP
*"Red Hat's SCAP Security Guide can automatically scan for these misconfigurations during compliance audits."*

### Podman
*"Containerizing this app with Podman provides additional isolation, limiting the blast radius of RCE."*

### Firewalld
*"Network segmentation via firewalld prevents attackers from pivoting to internal systems."*

---

## ⚠️ Legal Disclaimer

**IMPORTANT**: This script is for educational purposes and authorized security assessments only.

- ✅ Use ONLY on systems you own or have written permission to test
- ✅ nodejs-goof is intentionally vulnerable for learning
- ❌ NEVER use on production systems without authorization
- ❌ NEVER use on systems you don't own
- ❌ Unauthorized penetration testing is illegal

**By using this script, you agree to use it responsibly and ethically.**

---

## 🐛 Known Issues

### Issue 1: ZAP Baseline Scan Timeout
**Symptom**: ZAP scan hangs or times out
**Solution**: Reduce scan scope or increase timeout in script

### Issue 2: SQLMap Verbose Output
**Symptom**: SQLMap output floods terminal
**Solution**: Redirect to file with `tee` or use `--batch --quiet`

### Issue 3: DIRB Wordlist Missing
**Symptom**: DIRB fails with "wordlist not found"
**Solution**: Install wordlists with `sudo apt install wordlists`

### Issue 4: Netcat Port Already in Use
**Symptom**: Cannot bind to port 4444 for reverse shell
**Solution**: Kill existing process with `sudo fuser -k 4444/tcp`

---

## 📞 Support

For issues or questions:

1. Check the troubleshooting section above
2. Review `KALI_EXPLOITATION_GUIDE.md` for detailed tool usage
3. Verify all prerequisites are installed
4. Ensure nodejs-goof is running on http://localhost:3001

---

## 🔄 Version History

**v1.0** (2025-10-01)
- Initial release
- 15+ Kali tools integrated
- Multi-level interactive menus
- Full automated pentest mode
- Professional report generation
- 6 exploitation techniques
- Post-exploitation capabilities

---

## 📚 Additional Resources

### Kali Linux Documentation
- https://www.kali.org/docs/
- https://www.kali.org/tools/

### OWASP Top 10
- https://owasp.org/www-project-top-ten/

### CVE Database
- https://cve.mitre.org/

### Red Hat Security
- https://www.redhat.com/en/technologies/linux-platforms/enterprise-linux/security
- https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/9/html/security_hardening/

---

## ✨ Credits

**Created by**: Red Hat Cybersecurity Engineering Candidate
**Purpose**: Reverse Career Fair Security Demonstration
**Target App**: nodejs-goof (Snyk)
**Platform**: Kali Linux

---

**Ready to demonstrate professional penetration testing skills!** 🔒

**For quick start, see**: `KALI_QUICK_START.md`
**For tool details, see**: `KALI_EXPLOITATION_GUIDE.md`
**For demo guide, see**: `REVERSE_CAREER_FAIR_DEMO.md`