---
description: Safe database migration workflow - NEVER use migrate reset in production
---

# Safe Database Migration Workflow

## ⚠️ CRITICAL RULES

1. **NEVER run `prisma migrate reset` on a database with data**
2. **ALWAYS create new migrations with `prisma migrate dev`**
3. **ALWAYS backup data before migrations**

---

## Standard Migration Workflow

### 1. Make Schema Changes
Edit `prisma/schema.prisma` with your changes

### 2. Create Migration
```bash
npx prisma migrate dev --name descriptive_migration_name
```

### 3. Review Migration
Check the generated SQL in `prisma/migrations/[timestamp]_[name]/migration.sql`

### 4. Apply to Production
```bash
npx prisma migrate deploy
```

---

## If Schema is Out of Sync

### Option 1: Create Migration from Drift
```bash
npx prisma migrate dev --create-only --name sync_schema
# Review the generated SQL
npx prisma migrate dev
```

### Option 2: Generate Client Only (no DB changes)
```bash
npx prisma generate
```

---

## Emergency: Need to Reset (Development Only)

### Before Reset - Backup Data
```bash
# Export all data
npx prisma db pull
# Or use pg_dump for PostgreSQL
pg_dump -U username -d database_name > backup.sql
```

### After Reset - Restore Data
```bash
# Restore from SQL dump
psql -U username -d database_name < backup.sql
```

---

## Best Practices

1. ✅ Use `migrate dev` for development
2. ✅ Use `migrate deploy` for production
3. ✅ Always review generated SQL
4. ✅ Test migrations on staging first
5. ✅ Keep migrations small and focused
6. ❌ NEVER use `migrate reset` with real data
7. ❌ NEVER edit migration files manually
8. ❌ NEVER delete migration files

---

## Troubleshooting

### "Migration failed" error
1. Check the error message
2. Review the generated SQL
3. Fix schema issues
4. Delete failed migration folder
5. Run `migrate dev` again

### "Database is out of sync"
1. Run `npx prisma migrate dev` to create sync migration
2. Review and apply

### Need to rollback
1. Restore from backup
2. Remove problematic migration file
3. Run `npx prisma migrate dev`
