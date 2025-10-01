# Kali Linux Enhanced Penetration Testing Framework

**File**: `kali-pentest-enhanced.sh`
**Version**: 2.0 Enhanced
**Target**: Any vulnerable web application (default: nodejs-goof)

---

## 🚀 Quick Start

```bash
# Basic usage (default target: http://localhost:3001)
./kali-pentest-enhanced.sh

# Custom target URL
./kali-pentest-enhanced.sh -u http://example.com

# Custom host and port
./kali-pentest-enhanced.sh -h 192.168.1.100 -p 8080

# Custom output directory
./kali-pentest-enhanced.sh -u http://target.com -o ./custom-results

# View help
./kali-pentest-enhanced.sh --help
```

---

## ✨ What's New in Enhanced Version

### 🎯 URL Parameter Support
- **Command-line arguments** for target specification
- `-u, --url` - Specify full target URL
- `-h, --host` - Specify hostname/IP
- `-p, --port` - Specify port number
- `-o, --output` - Custom output directory
- Automatic URL parsing and validation

### 🛠️ Additional Kali Tools (20+ Total)
**New Tools Added:**
- **Gobuster** - Fast directory/file brute forcing
- **SSLScan** - SSL/TLS configuration analysis
- **WPScan** - WordPress security scanner
- **XSSer** - Automated XSS detection and exploitation
- **Commix** - Command injection exploiter
- **Hydra** - Brute force authentication testing

**Original Tools:**
- Nmap, Whatweb, Nikto, DIRB
- OWASP ZAP, Wfuzz, NPM Audit
- SQLMap, cURL, Netcat

### 🔧 Enhanced Features
- ✅ Fixed menu execution flow
- ✅ Better error handling and tool checking
- ✅ Improved banner with dynamic target display
- ✅ Enhanced report generation
- ✅ More comprehensive exploitation tests
- ✅ Better timeout handling for target checks

---

## 📋 Complete Tool List (20+ Tools)

### Reconnaissance (6 tools)
1. **Nmap** - Network/service discovery
2. **Whatweb** - Technology fingerprinting
3. **Nikto** - Web vulnerability scanner
4. **DIRB** - Directory enumeration
5. **Gobuster** - Fast directory brute force
6. **SSLScan** - SSL/TLS analysis

### Vulnerability Scanning (4 tools)
7. **OWASP ZAP** - Automated DAST scanning
8. **Wfuzz** - Web application fuzzing
9. **NPM Audit** - Dependency scanning
10. **WPScan** - WordPress scanner

### Exploitation (6 tools)
11. **cURL** - Manual HTTP requests
12. **SQLMap** - SQL/NoSQL injection
13. **XSSer** - XSS detection/exploitation
14. **Commix** - Command injection
15. **Hydra** - Brute force testing
16. **Custom exploits** - NoSQL, Traversal, XSS, RCE

### Post-Exploitation (2 capabilities)
17. **Netcat** - Reverse shell listener
18. **Data Exfiltration** - Sensitive data retrieval

---

## 🎯 Menu Structure

```
MAIN MENU
├── [1] Reconnaissance
│   ├── Nmap - Network & Service Discovery
│   ├── Whatweb - Technology Fingerprinting
│   ├── Nikto - Web Server Scanner
│   ├── DIRB - Directory Enumeration
│   ├── Gobuster - Fast Directory Brute Force
│   ├── SSLScan - SSL/TLS Analysis
│   └── Run All Reconnaissance
│
├── [2] Vulnerability Scanning
│   ├── OWASP ZAP - Baseline Scan
│   ├── Wfuzz - Web Application Fuzzer
│   ├── NPM Audit - Dependency Vulnerabilities
│   ├── WPScan - WordPress Scanner
│   └── Run All Scans
│
├── [3] Exploitation
│   ├── NoSQL Injection - Authentication Bypass
│   ├── Directory Traversal - Path Injection
│   ├── Cross-Site Scripting (XSS)
│   ├── Command Injection - RCE
│   ├── Information Disclosure - ST Traversal
│   ├── SQLMap - Automated SQL/NoSQL Injection
│   ├── XSSer - Automated XSS Detection
│   ├── Commix - Command Injection Exploiter
│   ├── Hydra - Brute Force Authentication
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

## 📖 Usage Examples

### Example 1: Test Local nodejs-goof
```bash
# Ensure nodejs-goof is running
npm start

# Run enhanced script (uses localhost:3001 by default)
./kali-pentest-enhanced.sh

# Select: [T] to check target
# Select: [3] → [10] to run all exploits
```

### Example 2: Test Remote Target
```bash
# Test specific remote host
./kali-pentest-enhanced.sh -h 192.168.1.100 -p 8080

# Or use full URL
./kali-pentest-enhanced.sh -u http://testsite.com:8080
```

### Example 3: HTTPS Target
```bash
# Test HTTPS target (includes SSL scan)
./kali-pentest-enhanced.sh -u https://secure-target.com

# Menu will automatically run SSLScan for HTTPS targets
```

### Example 4: Custom Output Location
```bash
# Save results to custom directory
./kali-pentest-enhanced.sh -u http://target.com -o ./my-pentest-results

# All output files will be saved to ./my-pentest-results/
```

### Example 5: Full Automated Pentest
```bash
# Complete automated assessment
./kali-pentest-enhanced.sh -u http://target.com

# Select: [A] Run Full Automated Pentest
# Wait 30-45 minutes
# Review report at ./kali-pentest-results/pentest-report.txt
```

---

## 🔍 Tool Details

### Gobuster - Fast Directory Brute Force
**Advantages over DIRB:**
- Faster performance (Go-based)
- Multi-threaded scanning
- Better for large wordlists

**Usage in script:**
```bash
gobuster dir -u $TARGET_URL -w wordlist.txt -o results.txt
```

### SSLScan - SSL/TLS Analysis
**Detects:**
- SSL/TLS versions supported
- Cipher suites enabled
- Certificate information
- Security misconfigurations

**Auto-triggers:** Only runs for HTTPS targets

### XSSer - Automated XSS Detection
**Features:**
- Multiple XSS techniques
- Automatic payload generation
- DOM-based XSS detection
- Stored XSS testing

**Advantages over manual testing:**
- Tests 100+ XSS payloads automatically
- Identifies encoding bypasses
- Validates exploitability

### Commix - Command Injection Exploiter
**Capabilities:**
- Automatic command injection detection
- Multiple injection techniques
- Pseudo-terminal generation
- File system access

**Injection types tested:**
- Classic command injection
- Shell command execution
- Code execution
- Time-based blind injection

### Hydra - Brute Force Testing
**Protocols supported:**
- HTTP POST/GET forms
- Basic authentication
- SSH, FTP, Telnet
- Database services

**In this script:**
- Tests login forms
- Limited attempts (demo mode)
- Configurable wordlists

### WPScan - WordPress Scanner
**Detects:**
- WordPress version vulnerabilities
- Plugin vulnerabilities
- Theme vulnerabilities
- User enumeration
- Weak passwords

**Note:** Only useful for WordPress targets

---

## 📊 Output Files

All results saved to: `./kali-pentest-results/` (or custom directory)

| File | Tool | Description |
|------|------|-------------|
| `nmap-scan.*` | Nmap | XML, nmap, gnmap outputs |
| `nmap-output.txt` | Nmap | Console output |
| `whatweb-output.txt` | Whatweb | Technology fingerprinting |
| `nikto-report.html` | Nikto | HTML vulnerability report |
| `nikto-output.txt` | Nikto | Console output |
| `dirb-output.txt` | DIRB | Directory enumeration |
| `gobuster-output.txt` | Gobuster | Fast directory scan |
| `sslscan-output.txt` | SSLScan | SSL/TLS analysis |
| `wfuzz-output.txt` | Wfuzz | Fuzzing results |
| `npm-audit.json` | NPM | Dependency scan (JSON) |
| `npm-audit.txt` | NPM | Dependency scan (text) |
| `wpscan-output.txt` | WPScan | WordPress vulnerabilities |
| `sqlmap/` | SQLMap | Injection test results |
| `xsser-report.xml` | XSSer | XSS detection report |
| `commix/` | Commix | Command injection results |
| `hydra-output.txt` | Hydra | Brute force results |
| `zap-baseline-report.html` | ZAP | OWASP ZAP report |
| `cookies.txt` | cURL | Session cookies |
| `exfiltrated-*.txt` | Custom | Exfiltrated data |
| `pentest-report.txt` | Report | Professional report |

---

## ⚡ Demo Scenarios

### Scenario A: Quick 5-Minute Impact Demo
```bash
# Terminal 1: Start target
npm start

# Terminal 2: Run pentest
./kali-pentest-enhanced.sh

# Demo flow:
[T] Check Target Status          # 10 seconds
[3] Exploitation Menu
  [1] NoSQL Injection            # 30 seconds
  [4] Command Injection          # 30 seconds
  [5] Information Disclosure     # 30 seconds
[5] Generate Report              # 20 seconds

Total: ~2 minutes of actual exploitation
```

### Scenario B: Professional 20-Minute Demo
```bash
./kali-pentest-enhanced.sh -u http://target.com

# Demo flow:
[T] Check Target Status          # 30 seconds
[1] Reconnaissance
  [1] Nmap                       # 2 minutes
  [5] Gobuster                   # 3 minutes
[3] Exploitation
  [10] Run All Exploits          # 10 minutes
[4] Post-Exploitation
  [2] Data Exfiltration          # 1 minute
[5] Generate Report              # 30 seconds

Total: ~17 minutes
```

### Scenario C: Full Automated Assessment (30-45 min)
```bash
./kali-pentest-enhanced.sh -u http://target.com -o ./assessment-results

# Single command:
Select: [A] Run Full Automated Pentest

# Includes:
- Complete reconnaissance (6 tools)
- Vulnerability scanning (4 tools)
- Exploitation testing (9 techniques)
- Post-exploitation
- Professional report generation

# Go get coffee, come back to complete report!
```

---

## 🎓 Career Fair Talking Points

### Opening Statement
*"I've developed an enhanced Kali Linux penetration testing framework with 20+ industry-standard tools, supporting custom target URLs and comprehensive automation."*

### Key Features to Highlight

1. **Professional Tool Integration**
   - "This framework integrates 20+ Kali tools including Nmap, SQLMap, Burp Suite integration, and automated scanners."

2. **Flexible Target Support**
   - "I've implemented command-line argument parsing allowing testing of any target URL, not just localhost."

3. **Comprehensive Coverage**
   - "The framework covers all OWASP Top 10 vulnerabilities with both automated and manual testing approaches."

4. **Automation Excellence**
   - "With a single command, it can run a complete 30-minute penetration test and generate a professional report."

5. **Tool Diversity**
   - "I've integrated Gobuster for fast directory brute forcing, XSSer for automated XSS detection, Commix for command injection, and Hydra for authentication testing."

### Demo Script
```
1. Show help: ./kali-pentest-enhanced.sh --help
   Talk: "Notice the flexible URL parameter support"

2. Start script: ./kali-pentest-enhanced.sh -u http://localhost:3001
   Talk: "I can target any URL dynamically"

3. Check target: [T]
   Talk: "First, verify target availability"

4. Recon: [1] → [5] Gobuster
   Talk: "Gobuster is faster than DIRB for large wordlists"

5. Exploit: [3] → [1] NoSQL Injection
   Talk: "This demonstrates OWASP A1 - Injection"

6. Exploit: [3] → [7] XSSer
   Talk: "XSSer automates 100+ XSS payloads"

7. Post-Ex: [4] → [2] Data Exfiltration
   Talk: "Now extracting sensitive data"

8. Report: [5]
   Talk: "Professional report with CVSS scores and remediation"
```

---

## 🛡️ Comparison: Original vs Enhanced

| Feature | kali-pentest.sh | kali-pentest-enhanced.sh |
|---------|----------------|--------------------------|
| **URL Support** | Environment vars only | CLI arguments ✓ |
| **Tools** | 15 tools | 20+ tools ✓ |
| **Gobuster** | ❌ | ✅ |
| **SSLScan** | ❌ | ✅ |
| **XSSer** | ❌ | ✅ |
| **Commix** | ❌ | ✅ |
| **Hydra** | ❌ | ✅ |
| **WPScan** | ❌ | ✅ |
| **Help Menu** | ❌ | ✅ |
| **URL Parsing** | Manual | Automatic ✅ |
| **Custom Output** | Fixed path | CLI argument ✅ |
| **HTTPS Detection** | ❌ | Auto SSLScan ✓ |
| **Menu Fix** | Some issues | All fixed ✓ |
| **Error Handling** | Basic | Enhanced ✓ |

---

## 🚨 Prerequisites

### Install All Tools
```bash
# Update system
sudo apt update

# Install all required tools
sudo apt install -y \
  nmap \
  whatweb \
  nikto \
  dirb \
  gobuster \
  sslscan \
  wfuzz \
  zaproxy \
  sqlmap \
  xsser \
  commix \
  hydra \
  wpscan \
  curl \
  netcat-traditional

# Install wordlists
sudo apt install -y wordlists

# Verify installations
nmap --version
gobuster version
sqlmap --version
```

### Target Application
```bash
# Ensure target is running
cd /path/to/nodejs-goof
npm start

# Or specify any target URL
./kali-pentest-enhanced.sh -u http://your-target.com
```

---

## 💡 Pro Tips

### Speed Optimization
```bash
# Pre-run time-consuming scans
./kali-pentest-enhanced.sh -u http://target.com

# In menu:
[1] → [7] Run All Reconnaissance  # Let it run in background
# Then focus on quick exploits for demo
```

### Multiple Targets
```bash
# Test multiple targets sequentially
for target in target1.com target2.com target3.com; do
  ./kali-pentest-enhanced.sh -u "http://$target" -o "./results-$target"
done
```

### Wordlist Customization
```bash
# Edit script to use custom wordlists (line ~27):
WORDLIST_DIR="/path/to/custom/wordlists"
```

### Output Organization
```bash
# Use timestamped output directories
./kali-pentest-enhanced.sh -u http://target.com -o "./results-$(date +%Y%m%d-%H%M%S)"
```

---

## 🔧 Troubleshooting

### Issue 1: Tool Not Found
```bash
# Error: "Tool not found: gobuster"
# Solution:
sudo apt update
sudo apt install gobuster

# Verify:
which gobuster
```

### Issue 2: Target Not Responding
```bash
# Error: "Target is not responding"
# Solutions:
1. Check target is running: curl -I http://target.com
2. Check firewall: sudo ufw status
3. Verify URL format: http:// or https://
4. Test network: ping target.com
```

### Issue 3: Permission Denied
```bash
# Error: "Permission denied"
# Solution:
chmod +x kali-pentest-enhanced.sh
```

### Issue 4: Wordlist Not Found
```bash
# Error: "wordlist not found"
# Solution:
sudo apt install wordlists
ls /usr/share/wordlists/
```

### Issue 5: ZAP Scan Hangs
```bash
# ZAP scan takes too long or hangs
# Solution:
# Press Ctrl+C to skip ZAP
# Or edit script to reduce ZAP timeout (line ~380)
```

### Issue 6: SSL Scan on HTTP Target
```bash
# SSLScan runs on non-HTTPS target
# Note: Script auto-detects HTTPS and skips SSLScan for HTTP
# If issue persists, check TARGET_URL variable
```

---

## 📋 Checklist Before Demo

- [ ] Kali Linux VM running
- [ ] All tools installed (`sudo apt install <tools>`)
- [ ] Wordlists installed (`sudo apt install wordlists`)
- [ ] Script executable (`chmod +x kali-pentest-enhanced.sh`)
- [ ] Target application running (if local)
- [ ] Network connectivity verified (`ping`, `curl`)
- [ ] Output directory writable
- [ ] Script tested with `--help`
- [ ] Quick test run completed
- [ ] Backup demo plan ready

---

## 🎬 Live Demo Script (10 Minutes)

```
MINUTE 0-1: Introduction
"I've built an enhanced Kali Linux penetration testing framework with 20+ tools"

MINUTE 1-2: Show Help & Start
./kali-pentest-enhanced.sh --help
"Notice command-line argument support for any target URL"
./kali-pentest-enhanced.sh -u http://localhost:3001

MINUTE 2-3: Target Check
Select: [T] Check Target Status
"Always verify target availability first"

MINUTE 3-5: Reconnaissance
Select: [1] Reconnaissance → [5] Gobuster
"Gobuster is faster than DIRB - built in Go, multi-threaded"
Show results scrolling

MINUTE 5-7: Exploitation Demo 1
Select: [3] Exploitation → [1] NoSQL Injection
"This demonstrates OWASP A1 - Injection vulnerability"
"Using MongoDB $gt operator to bypass authentication"
Show successful bypass

MINUTE 7-8: Exploitation Demo 2
Select: [3] Exploitation → [4] Command Injection
"Now demonstrating critical RCE via image processing"
Show command execution

MINUTE 8-9: Post-Exploitation
Select: [4] Post-Exploitation → [2] Data Exfiltration
"Extracting sensitive data: /etc/passwd, package.json"
Show exfiltrated files

MINUTE 9-10: Report & Close
Select: [5] Generate Report
"Professional report with CVSS scores, remediation steps"
Show report preview

CLOSE:
"This demonstrates my proficiency with:
- 20+ Kali Linux tools
- OWASP Top 10 vulnerabilities
- Bash scripting & automation
- Professional penetration testing methodology"
```

---

## 🎯 Interview Q&A Preparation

### Q: "Why did you choose these specific tools?"
**A:** "I selected tools covering all penetration testing phases:
- Nmap for reconnaissance (industry standard)
- Gobuster over DIRB for performance (Go vs Ruby)
- SQLMap for automated injection (most comprehensive)
- XSSer for XSS automation (100+ payloads)
- Commix for command injection (blind injection support)
- Hydra for authentication testing (multi-protocol support)

Each tool serves a specific purpose and complements others."

### Q: "How did you implement URL parameter support?"
**A:** "I used Bash argument parsing with case statements:
- Implemented getopts alternative for long options
- Regex parsing to extract host/port from URLs
- Default fallback values for all parameters
- Automatic URL reconstruction from components
- Help menu for user guidance"

### Q: "What would you add next?"
**A:** "Future enhancements:
1. JSON output for CI/CD integration
2. Metasploit Framework integration
3. API endpoints for remote execution
4. Web-based dashboard for results
5. Multi-threaded scanning
6. Database backend for result storage
7. AI-powered vulnerability prioritization"

### Q: "How do you handle false positives?"
**A:** "Multiple verification techniques:
1. Manual confirmation of automated findings
2. Cross-validation with multiple tools
3. HTTP response code analysis
4. Response content pattern matching
5. Time-based verification for blind vulnerabilities
6. Professional report includes confidence levels"

### Q: "Explain the exploitation workflow"
**A:** "Five-phase methodology:
1. **Reconnaissance** - Information gathering, no exploitation
2. **Scanning** - Vulnerability identification
3. **Exploitation** - Proof of concept, controlled impact
4. **Post-Exploitation** - Access demonstration
5. **Reporting** - Documentation with remediation"

---

## ⚠️ Legal & Ethical Use

**WARNING:** This tool is for authorized security testing only.

### ✅ Authorized Use
- Testing systems you own
- Authorized penetration testing engagements
- Educational environments (like nodejs-goof)
- Bug bounty programs with scope approval
- Security research with permission

### ❌ Unauthorized Use (ILLEGAL)
- Testing systems without permission
- Production systems without authorization
- Third-party websites
- Government systems without clearance
- Any system without written permission

### 📜 Best Practices
1. **Always get written authorization** before testing
2. **Define scope clearly** with client
3. **Maintain communication** during testing
4. **Document everything** for legal protection
5. **Follow responsible disclosure** for vulnerabilities
6. **Respect data privacy** - don't exfiltrate real data
7. **Clean up** - remove backdoors, test accounts

**By using this tool, you agree to use it ethically and legally.**

---

## 📚 Additional Resources

### Kali Linux
- Official Docs: https://www.kali.org/docs/
- Tool Documentation: https://www.kali.org/tools/
- Training: https://www.offensive-security.com/

### OWASP
- Top 10: https://owasp.org/www-project-top-ten/
- Testing Guide: https://owasp.org/www-project-web-security-testing-guide/
- Cheat Sheets: https://cheatsheetseries.owasp.org/

### Vulnerabilities
- CVE Database: https://cve.mitre.org/
- CWE List: https://cwe.mitre.org/
- Exploit DB: https://www.exploit-db.com/

### Red Hat Security
- RHEL Security: https://www.redhat.com/en/technologies/linux-platforms/enterprise-linux/security
- Security Hardening: https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/9/html/security_hardening/
- SELinux Guide: https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/9/html/using_selinux/

### Penetration Testing
- PTES: http://www.pentest-standard.org/
- NIST SP 800-115: https://csrc.nist.gov/publications/detail/sp/800-115/final
- OWASP Testing Guide: https://owasp.org/www-project-web-security-testing-guide/

---

## 🔄 Version History

### v2.0 Enhanced (2025-10-01)
- ✅ Added command-line argument support
- ✅ Implemented URL parameter parsing
- ✅ Added 6 new Kali tools (Gobuster, SSLScan, XSSer, Commix, Hydra, WPScan)
- ✅ Fixed menu execution issues
- ✅ Enhanced error handling
- ✅ Improved banner with dynamic target
- ✅ Better timeout handling
- ✅ Custom output directory support
- ✅ Help menu implementation
- ✅ HTTPS auto-detection

### v1.0 Original (2025-10-01)
- Initial release
- 15 Kali tools integrated
- Multi-level interactive menus
- Full automated pentest mode
- Professional report generation

---

## ✨ Credits

**Created by**: Red Hat Cybersecurity Engineering Candidate
**Purpose**: Reverse Career Fair Security Demonstration
**Platform**: Kali Linux
**Target**: nodejs-goof & any vulnerable web application
**Tools**: 20+ industry-standard Kali Linux tools

---

## 📞 Support & Feedback

For issues, questions, or improvements:

1. Review this README thoroughly
2. Check troubleshooting section
3. Verify all prerequisites installed
4. Test with --help flag
5. Review original documentation: `KALI_AUTOMATION_README.md`

---

**🔒 Ready to demonstrate professional penetration testing with enterprise-grade tools!**

**Quick Start**: `./kali-pentest-enhanced.sh --help`
**Full Guide**: This file (KALI_ENHANCED_README.md)
**Original Docs**: KALI_AUTOMATION_README.md, KALI_EXPLOITATION_GUIDE.md