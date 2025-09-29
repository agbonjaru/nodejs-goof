#!/bin/bash

echo "🔒 Setting up DevSecOps Pipeline for nodejs-goof"
echo "================================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Install pre-commit if not already installed
echo -e "${YELLOW}Installing pre-commit...${NC}"
if ! command -v pre-commit &> /dev/null; then
    pip install pre-commit || pip3 install pre-commit
fi

# Install security dependencies
echo -e "${YELLOW}Installing security dependencies...${NC}"
npm install --save-dev \
    eslint \
    eslint-plugin-security \
    eslint-plugin-node \
    @microsoft/eslint-formatter-sarif \
    snyk \
    license-checker \
    nsp \
    helmet \
    express-rate-limit \
    express-session \
    csurf

# Install pre-commit hooks
echo -e "${YELLOW}Installing pre-commit hooks...${NC}"
pre-commit install
pre-commit install --hook-type commit-msg

# Create secrets baseline
echo -e "${YELLOW}Creating secrets baseline...${NC}"
detect-secrets scan > .secrets.baseline 2>/dev/null || echo "{}" > .secrets.baseline

# Initialize git hooks directory if not exists
mkdir -p .git/hooks

# Create custom pre-push hook for additional security checks
echo -e "${YELLOW}Creating pre-push security hook...${NC}"
cat > .git/hooks/pre-push << 'EOF'
#!/bin/bash

echo "🔒 Running pre-push security checks..."

# Run npm audit
echo "📦 Checking npm dependencies..."
npm audit --production

# Run security tests
echo "🧪 Running security tests..."
npm test

# Check for sensitive data
echo "🔍 Checking for sensitive data..."
git diff --cached --name-only | xargs -I {} grep -l -E "(password|secret|key|token|api_key|apikey).*=.*[\"'][^\"']{8,}[\"']" {} || true

echo "✅ Pre-push security checks completed!"
EOF

chmod +x .git/hooks/pre-push

# Create .gitignore entries for security files
echo -e "${YELLOW}Updating .gitignore...${NC}"
cat >> .gitignore << 'EOF'

# Security Files
.secrets.baseline
*.sarif
security-report.md
npm-audit.json
dependency-check-report/
.contrast/
.snyk
EOF

# Create security configuration directory
mkdir -p .security

# Create security policy file
cat > .security/security-policy.json << 'EOF'
{
  "version": "1.0.0",
  "policies": {
    "vulnerabilities": {
      "high": "block",
      "critical": "block",
      "medium": "warn",
      "low": "note"
    },
    "licenses": {
      "allowed": ["MIT", "Apache-2.0", "BSD", "ISC"],
      "forbidden": ["GPL", "AGPL", "LGPL"]
    },
    "secrets": {
      "action": "block"
    }
  }
}
EOF

echo -e "${GREEN}✅ DevSecOps setup completed!${NC}"
echo ""
echo "📋 Next steps:"
echo "1. Set up the following GitHub secrets:"
echo "   - SNYK_TOKEN"
echo "   - CONTRAST_API_KEY"
echo "   - CONTRAST_SERVICE_KEY"
echo "   - CONTRAST_HOST"
echo ""
echo "2. Run the following to test pre-commit hooks:"
echo "   pre-commit run --all-files"
echo ""
echo "3. The DevSecOps pipeline will automatically run on:"
echo "   - Every push to master/main/develop"
echo "   - Every pull request"
echo "   - Weekly schedule (Sundays at midnight)"