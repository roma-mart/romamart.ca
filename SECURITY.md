# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 2.x     | ✅ Yes             |
| < 2.0   | ❌ No              |

## Reporting a Vulnerability

**Please do NOT open public issues for security vulnerabilities.**

### How to Report

Email security concerns to: **security@romamart.ca**

Include the following information:

1. **Description** of the vulnerability
2. **Steps to reproduce** the issue
3. **Potential impact** assessment
4. **Suggested fix** (if you have one)

### Response Timeline

| Action | Timeframe |
|--------|-----------|
| Initial acknowledgment | 48 hours |
| Assessment complete | 1 week |
| Fix deployed (critical) | 72 hours |
| Fix deployed (other) | 2 weeks |

### What to Expect

1. **Acknowledgment** - We'll confirm receipt within 48 hours
2. **Assessment** - We'll evaluate severity and impact
3. **Resolution** - We'll work on a fix
4. **Notification** - We'll let you know when resolved
5. **Credit** - We'll credit you in the release notes (if desired)

## Security Best Practices

### For Contributors

- ❌ **Never** commit secrets, API keys, or credentials
- ✅ Use environment variables for sensitive data
- ✅ Validate and sanitize all user inputs
- ✅ Use HTTPS for all external requests
- ✅ Follow CSP (Content Security Policy) headers

### Environment Variables

Sensitive data should be stored in:
- **Development**: `.env.local` (never committed)
- **CI/CD**: Repository secrets
- **Production**: Environment variables

### Code Review Checklist

- [ ] No hardcoded secrets
- [ ] No `dangerouslySetInnerHTML` without sanitization
- [ ] External links use `rel="noreferrer"`
- [ ] User inputs validated
- [ ] No exposed API keys

## Known Security Measures

### Current Protections

- **CSP Headers** - Configured for external resources
- **Secret Scanning** - Quality checker validates no exposed secrets
- **XSS Prevention** - React's default escaping
- **HTTPS** - Enforced in production
- **Dependency Auditing** - Regular npm audit

### External Services

| Service | Data Shared | Purpose |
|---------|-------------|---------|
| Web3Forms | Contact form data | Form submission |
| Google Tag Manager | Analytics events | Site analytics |
| Google Maps | Location views | Maps embed |

## Security Updates

Security patches are documented in [CHANGELOG.md](./CHANGELOG.md).

Subscribe to repository notifications for security updates.

---

**Last Updated:** December 2025  
**Policy Version:** 1.0
