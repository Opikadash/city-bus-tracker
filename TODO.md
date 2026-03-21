# Fix Backend Port Conflict

## Steps:
- [x] 1. Update backend/src/server.ts: Change PORT fallback to 3001
- [x] 2. Create root .env with PORT=3001 and FRONTEND_URL=http://localhost:5173
- [x] 3. Kill any process on port 3000
- [x] 4. Run `npm run dev` and verify both servers start
- [x] 5. Test frontend connects to backend (e.g., health check)

✅ **FIX COMPLETE** - Backend now runs on port 3001 without conflicts.
