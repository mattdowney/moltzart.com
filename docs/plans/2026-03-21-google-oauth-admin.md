# Google OAuth Admin Login

Replace password-based admin auth with Google OAuth gated to `matt@mattdowney.com`.

## Approach

Auth.js v5 (NextAuth) with Google provider. JWT session strategy — no database changes needed.

## Auth Flow

1. User hits `/admin` → `getAdminAuth()` checks Auth.js session
2. No session → render "Sign in with Google" button
3. Google OAuth redirect → user authenticates with Google
4. `signIn` callback rejects any email !== `matt@mattdowney.com`
5. Valid email → Auth.js sets encrypted session cookie → admin loads

## File Changes

| File | Action |
|---|---|
| `src/lib/auth.ts` | New — Auth.js config, Google provider, email allowlist |
| `src/app/api/auth/[...nextauth]/route.ts` | New — Auth.js route handler |
| `src/lib/admin-auth.ts` | Rewrite — use `auth()` from Auth.js |
| `src/components/admin-login.tsx` | Rewrite — Google sign-in button |
| `src/app/api/admin/verify/route.ts` | Delete |
| `src/app/api/admin/logout/route.ts` | Rewrite or delete — Auth.js handles signOut |
| `src/app/api/tasks/route.ts` | Update — use `getAdminAuth()` instead of direct cookie check |
| `src/app/admin/layout.tsx` | Minor update if return type changes |

## Env Vars

**Add:**
- `AUTH_GOOGLE_CLIENT_ID`
- `AUTH_GOOGLE_CLIENT_SECRET`
- `AUTH_SECRET`

**Remove (after migration):**
- `TASKS_PASSWORD`

## Email Allowlist

Hardcoded in `signIn` callback. Single-user app — no need for a database table or env var list.

## Verification

- `npm run build` passes
- Sign in with `matt@mattdowney.com` → access granted
- Sign in with any other Google account → rejected
- API routes (`/api/admin/*`) return 401 without session
- Logout clears session
