# Environment Variables Setup

## Required Variables

Add these to your `.env` file:

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/salines"

# NextAuth
AUTH_SECRET="your-secret-key-here"  # Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
```

## Generate AUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Then add it to your `.env` file as `AUTH_SECRET`.
