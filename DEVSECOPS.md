# DevSecOps Pipeline for nodejs-goof

This project implements a comprehensive DevSecOps pipeline for the intentionally vulnerable nodejs-goof application, demonstrating security best practices throughout the SDLC.

## 🔒 Security Pipeline Overview

The pipeline integrates multiple security testing methodologies:

### 1. SAST (Static Application Security Testing)
- **Snyk**: Dependency vulnerability scanning
- **Semgrep**: Pattern-based code analysis
- **ESLint Security Plugin**: JavaScript-specific security rules
- **NodeJsScan**: Node.js security scanner

### 2. DAST (Dynamic Application Security Testing)
- **OWASP ZAP**: Full application security scan
- **Nuclei**: Fast vulnerability scanner with templates

### 3. IAST (Interactive Application Security Testing)
- **Contrast Security**: Runtime vulnerability detection
- Integration tests with security monitoring

### 4. Additional Security Checks
- **Secret Scanning**: TruffleHog and Gitleaks
- **Container Scanning**: Trivy and Grype
- **Dependency Checking**: npm audit and OWASP Dependency Check
- **License Compliance**: Automated license validation

## 🚀 Quick Setup

1. **Install Pre-commit Hooks**
   ```bash
   ./setup-security.sh
   ```

2. **Configure GitHub Secrets**
   Add the following secrets to your GitHub repository:
   - `SNYK_TOKEN`: Your Snyk authentication token
   - `CONTRAST_API_KEY`: Contrast Security API key
   - `CONTRAST_SERVICE_KEY`: Contrast Security service key
   - `CONTRAST_HOST`: Contrast Security host URL

## 📋 Pre-commit Hooks

The following checks run automatically before each commit:
- Secret detection
- Security linting
- Dependency vulnerability scanning
- License compliance
- Code quality checks

To run manually:
```bash
pre-commit run --all-files
```

## 🔄 CI/CD Pipeline

The GitHub Actions workflow runs on:
- Every push to main/master/develop branches
- Every pull request
- Weekly schedule (Sunday midnight)

### Pipeline Stages

1. **Build & Test**
   - Install dependencies
   - Run unit tests

2. **Security Scanning**
   - SAST analysis
   - Dependency checks
   - Secret detection
   - Container scanning

3. **Dynamic Testing**
   - Deploy test environment
   - DAST scanning
   - IAST monitoring

4. **Reporting**
   - Generate consolidated security report
   - Upload SARIF results to GitHub Security tab

## 🐳 Local Testing

Run security scans locally using Docker Compose:
```bash
docker-compose -f docker-compose.security.yml up
```

This starts:
- Application with MongoDB
- OWASP ZAP proxy
- Security monitoring dashboard
- Prometheus metrics collection

## 📊 Security Metrics

Access security dashboards:
- Grafana: http://localhost:3000 (admin/admin)
- Prometheus: http://localhost:9090
- ZAP Proxy: http://localhost:8090

## 🛡️ Security Policies

### Vulnerability Thresholds
- **Critical**: Pipeline fails
- **High**: Pipeline fails
- **Medium**: Warning
- **Low**: Informational

### Allowed Licenses
- MIT
- Apache-2.0
- BSD
- ISC

## 📝 Manual Security Testing

### Run SAST Locally
```bash
npm run security:check
npm run lint
```

### Run Container Scan
```bash
docker build -t nodejs-goof .
trivy image nodejs-goof
```

### Run DAST Locally
```bash
npm start
zap-cli quick-scan --self-contained http://localhost:3001
```

## 🔍 Vulnerability Remediation

When vulnerabilities are found:

1. **Review** the security report in GitHub Actions
2. **Prioritize** based on severity and exploitability
3. **Fix** by updating dependencies or code
4. **Verify** by re-running security scans

## 📚 Resources

- [OWASP DevSecOps Guideline](https://owasp.org/www-project-devsecops-guideline/)
- [Snyk Documentation](https://docs.snyk.io/)
- [GitHub Security Features](https://docs.github.com/en/code-security)

## ⚠️ Important Note

This is an intentionally vulnerable application for educational purposes. The security pipeline demonstrates how to detect and report these vulnerabilities in a real-world scenario.