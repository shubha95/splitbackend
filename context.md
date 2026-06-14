# Split-Nest — Application Context

## Overview

**Split-Nest** is a NestJS + MongoDB REST API for an expense-splitting application. It supports user authentication (email/password + social OAuth), group management, group membership with role-based permissions, and expense tracking linked to users or groups.

- **Base URL**: `http://localhost:5002/api/v1`
- **Port**: read from `process.env.PORT` (default 5001, currently running on 5002)
- **Versioning**: URI-based (`/v1/`)
- **Database**: MongoDB via Mongoose

---

## Tech Stack

| Layer | Package |
|---|---|
| Framework | NestJS 10 |
| Database | MongoDB + Mongoose 8 |
| Auth | `@nestjs/jwt` (24h JWT), bcryptjs |
| Validation | class-validator + class-transformer |
| Social Auth | Axios (Google, Facebook, Twitter, Outlook) |
| Rate Limiting | `@nestjs/throttler` — 1000 req/min dev, 100 req/min prod |
| Config | `@nestjs/config` (.env) |

---

## Environment Variables

```env
PORT=5002
MONGO_URI=mongodb://...
JWT_SECRET=your_secret
TWITTER_BEARER_TOKEN=your_twitter_bearer_token
```

---

## Global Response Format

Every response (success and error) is wrapped by `ResponseInterceptor` and `HttpExceptionFilter`.

**Success:**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "...",
  "errors": [],
  "data": { ... }
}
```

**Error:**
```json
{
  "success": false,
  "statusCode": 422,
  "message": "Validation failed",
  "errors": [{ "field": "email", "message": "must be a valid email" }],
  "data": null
}
```

Status code 422 = validation errors, 409 = conflict, others pass through as-is.

---

## Authentication

JWT tokens are stored in a `sessions` array on the User document (not a single field), enabling simultaneous logins from multiple devices (e.g., Android + iOS at the same time).

**Token flow:**
1. Login/register generates a JWT and pushes `{ token, tokenExpiry }` to `user.sessions`
2. Every request passes `Authorization: Bearer <token>` (or `x-auth-token` header)
3. `JwtAuthGuard` verifies the JWT, finds the matching session in the array, checks expiry
4. Logout removes only the caller's token from the sessions array (other devices stay logged in)
5. Change password clears all sessions

**`request.user` shape (set by guard):**
```typescript
{ id: string; userName: string; emailId: string; token: string }
```

---

## Schemas

### User
| Field | Type | Notes |
|---|---|---|
| name | String | required |
| email | String | required, unique |
| password | String | null for social-only users |
| date | Date | default: Date.now |
| address | String | default: '' |
| sessions | `[{ token, tokenExpiry }]` | multi-device session storage |
| providers | `[{ name, providerId }]` | OAuth provider links |
| avatar | String | default: '' |

### Group
| Field | Type | Notes |
|---|---|---|
| groupName | String | required, 2–100 chars |
| createdBy | String | User ID of creator |
| description | String | optional, max 500 chars |
| createDate | Date | auto timestamp |
| updateDate | Date | auto timestamp |

### GroupMember
| Field | Type | Notes |
|---|---|---|
| memberID | String | User ID |
| groupAddedBy | String | User ID who added them |
| groupID | String | Group ID |
| role | enum | `owner` / `admin` / `member` |
| permissions | String[] | subset of PERMISSIONS enum |
| createDate | Date | auto timestamp |

**Unique index:** `(memberID, groupID)` — prevents duplicate membership.

**PERMISSIONS enum:** `addMember`, `removeMember`, `editGroup`, `deleteGroup`, `promoteAdmin`, `manageExpenses`

### Expense
| Field | Type | Notes |
|---|---|---|
| userId | ObjectId | ref: User, required |
| price | Number | required, min 0 |
| description | String | required, max 500 chars |
| groupID | String | optional, links expense to a group |
| createdAt | Date | auto timestamp |
| updatedAt | Date | auto timestamp |

---

## API Endpoints

### Auth — `/api/v1/auth`

| Method | Path | Guard | Description |
|---|---|---|---|
| POST | `/register` | — | Create account |
| POST | `/login` | — | Email/password login |
| POST | `/social` | — | OAuth login (Google/Facebook/Twitter/Outlook) |
| PUT | `/change-password` | — | Change password, invalidates all sessions |
| GET | `/me` | JWT | Get current user profile |
| POST | `/logout` | JWT | Logout current device only |
| POST | `/users` | JWT | Paginated user list with optional group filter |

**Register body:**
```json
{ "userName": "John", "emailId": "john@email.com", "password": "Pass@123", "address": "Mumbai" }
```
Password rules: 8+ chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char (`@$!%*?&#^()_-+=`)

**Login body:**
```json
{ "emailId": "john@email.com", "password": "Pass@123" }
```

**Login/Register response data:**
```json
{ "user": { "id", "userName", "emailId", "address" }, "token": "...", "tokenExpiry": "..." }
```

**Social login body:**
```json
{ "provider": "google", "token": "<provider_access_token>" }
```
Supported providers: `google`, `facebook`, `twitter`, `outlook`

**Get Users body:**
```json
{ "pageNumber": 1, "itemNumber": 10, "search": "", "groupID": "" }
```
When `groupID` is provided, users already in that group are **excluded** from results (useful for "add member" search).

---

### Group — `/api/v1/group`

All endpoints require JWT.

| Method | Path | Description |
|---|---|---|
| POST | `/` | Create a new group |
| POST | `/my-groups` | Paginated list of groups the user belongs to |
| PUT | `/` | Update group name/description |
| DELETE | `/` | Delete group (only if no other members) |

**Create Group body:**
```json
{ "groupName": "Trip to Goa", "description": "Expenses for Goa trip" }
```
Creator is automatically added as `owner` in GroupMember.

**Update Group body:**
```json
{ "groupID": "...", "groupName": "New Name", "description": "New desc" }
```
Permission: owner OR admin with `editGroup` permission.

**Delete Group body:**
```json
{ "groupID": "..." }
```
Permission: owner OR admin with `deleteGroup`. Fails if any other members exist.

**Get My Groups body:**
```json
{ "pageNumber": 1, "itemNumber": 10 }
```

**Group response shape:**
```json
{ "groupID": "...", "groupName": "...", "createdBy": "...", "description": "...", "createDate": "...", "updateDate": "..." }
```

---

### Group Member — `/api/v1/group-member`

All endpoints require JWT.

| Method | Path | Description |
|---|---|---|
| POST | `/` | Add one or more members |
| PUT | `/` | Update a member record |
| DELETE | `/` | Remove a member |
| PUT | `/promote` | Promote member → admin (owner only) |
| PUT | `/demote` | Demote admin → member (owner only) |
| PUT | `/permissions` | Set admin permissions (owner only) |
| POST | `/members` | Get all members of a group with user details |

**Add Members body:**
```json
{ "memberID": ["userId1", "userId2"], "groupID": "..." }
```
Permission: owner OR admin with `addMember`. Duplicate memberships are silently skipped.
Response: `{ totalRequested, added, skipped, members[] }`

**Update Member body:**
```json
{ "memberRecordID": "...", "groupID": "..." }
```
Only the user who added the member can update.

**Delete Member body:**
```json
{ "memberRecordID": "..." }
```
Owner cannot be removed. Permission: owner OR admin with `removeMember`.

**Promote/Demote body:**
```json
{ "targetMemberID": "...", "groupID": "..." }
```
Owner only. Promoting clears existing permissions.

**Update Permissions body:**
```json
{ "targetMemberID": "...", "groupID": "...", "permissions": ["addMember", "removeMember"] }
```
Owner only. Target must be an admin.

**Get Group Members body:**
```json
{ "groupID": "..." }
```
Requester must be a member of the group. Response includes user details:
```json
{
  "memberRecordID": "...", "memberID": "...", "groupID": "...", "groupAddedBy": "...",
  "role": "owner|admin|member", "permissions": [], "createDate": "...",
  "userName": "...", "emailId": "...", "avatar": "..."
}
```

**Role & Permission Matrix:**

| Action | Owner | Admin (with permission) | Member |
|---|---|---|---|
| Add member | ✅ | ✅ `addMember` | ❌ |
| Remove member | ✅ | ✅ `removeMember` | ❌ |
| Edit group | ✅ | ✅ `editGroup` | ❌ |
| Delete group | ✅ | ✅ `deleteGroup` | ❌ |
| Promote/demote | ✅ | ❌ | ❌ |
| Manage permissions | ✅ | ❌ | ❌ |

---

### Expense — `/api/v1/expense`

All endpoints require JWT. Each user can only access their own expenses.

| Method | Path | Description |
|---|---|---|
| POST | `/` | Add expense |
| POST | `/list` | Paginated expense list |
| PUT | `/` | Update expense |
| DELETE | `/` | Delete expense |

**Add Expense body:**
```json
{ "price": 500, "description": "Dinner", "groupID": "" }
```
`groupID` is optional — omit for personal expenses, include to link to a group.

**Update Expense body:**
```json
{ "productID": "...", "price": 600, "description": "Updated desc" }
```
At least one of `price` or `description` required.

**Delete Expense body:**
```json
{ "productID": "..." }
```

**Get Expenses body:**
```json
{ "pageNumber": 1, "itemNumber": 10 }
```
Sorted by `createdAt` descending.

**Expense response shape:**
```json
{ "id": "...", "userId": "...", "groupID": "...", "price": 500, "description": "...", "createdAt": "...", "updatedAt": "..." }
```

---

## Module Dependency Tree

```
AppModule
└── V1Module
    ├── AuthModule         (User, GroupMember schemas; JwtModule; exports JwtAuthGuard)
    ├── GroupModule        (Group, GroupMember schemas; imports AuthModule)
    ├── GroupMemberModule  (GroupMember, User schemas; imports AuthModule)
    └── ExpenseModule      (Expense schema; imports AuthModule)
```

---

## Project Structure

```
src/
├── main.ts                          # Bootstrap, global prefix, versioning, pipes, interceptors
├── app.module.ts                    # Root module, Mongoose, Throttler, Config
├── v1/
│   ├── v1.module.ts
│   ├── auth/
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── social-auth.service.ts
│   │   ├── jwt-auth.guard.ts
│   │   └── dto/
│   │       ├── register.dto.ts
│   │       ├── login.dto.ts
│   │       ├── social-login.dto.ts
│   │       ├── change-password.dto.ts
│   │       └── get-users.dto.ts
│   ├── group/
│   │   ├── group.module.ts
│   │   ├── group.controller.ts
│   │   ├── group.service.ts
│   │   └── dto/
│   │       ├── create-group.dto.ts
│   │       ├── update-group.dto.ts
│   │       └── get-my-groups.dto.ts
│   ├── group-member/
│   │   ├── group-member.module.ts
│   │   ├── group-member.controller.ts
│   │   ├── group-member.service.ts
│   │   └── dto/
│   │       ├── add-members.dto.ts
│   │       ├── update-member.dto.ts
│   │       ├── delete-member.dto.ts
│   │       ├── promote-demote.dto.ts
│   │       ├── update-permissions.dto.ts
│   │       └── get-group-members.dto.ts
│   └── expense/
│       ├── expense.module.ts
│       ├── expense.controller.ts
│       ├── expense.service.ts
│       └── dto/
│           ├── add-expense.dto.ts
│           ├── update-expense.dto.ts
│           └── get-expenses.dto.ts
├── schemas/
│   ├── user.schema.ts
│   ├── group.schema.ts
│   ├── group-member.schema.ts
│   └── expense.schema.ts
└── common/
    ├── decorators/
    │   └── current-user.decorator.ts
    ├── filters/
    │   └── http-exception.filter.ts
    └── interceptors/
        └── response.interceptor.ts
```

---

## Key Notes

- **IDs as strings**: `memberID`, `groupID`, `groupAddedBy` in GroupMember are stored as plain strings (ObjectId hex strings), not ObjectId refs. Use `new Types.ObjectId(id)` when querying User by these fields.
- **createDate from timestamps**: GroupMember uses `timestamps: { createdAt: 'createDate', updatedAt: false }` — TypeScript lean type doesn't include it, cast as `(doc as any).createDate`.
- **Session pruning**: Expired sessions are cleaned up on every login (not on every request) to keep the sessions array lean.
- **Social user creation**: If a social login email matches an existing account, the provider is linked to that account rather than creating a duplicate.
- **Expense ownership**: All expense queries are scoped to `userId` — users can only read/modify their own expenses.
