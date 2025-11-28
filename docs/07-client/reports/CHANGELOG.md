# Client Reports API - Changelog

## Version 2.0 - November 18, 2025

### 🎉 Major Changes

#### New Endpoint: `/draft`
- Added `GET /api/client/reports/draft` endpoint
- Returns reports saved as drafts (`response_status = 'draft'`)

#### Restructured `/pending` Endpoint
- Now returns only reports that **don't have a response yet** (no `report_response` created)
- Previously returned draft reports, now those are in `/draft`

### 📊 API Structure

| Endpoint | Purpose | responseId | responses | Status Values |
|----------|---------|------------|-----------|---------------|
| `/pending` | No response created yet | `null` | N/A | `"pending"` |
| `/draft` | Saved as draft | exists | array | `"pending"` (empty) or `"draft"` (has data) |
| `/completed` | Submitted | exists | array | `"completed"` |

### 🔄 Report Lifecycle

```
1. PENDING (/pending)
   - Trainer creates report
   - No report_response exists yet
   - responseId: null
   
2. DRAFT - Empty (/draft)
   - Client starts filling, saves with no data
   - response_status: 'draft'
   - responses: []
   - Status returned: "pending"
   
3. DRAFT - Partial (/draft)
   - Client saves partial answers
   - response_status: 'draft'
   - responses: [partial data]
   - Status returned: "draft"
   
4. COMPLETED (/completed)
   - Client submits report
   - response_status: 'submitted'
   - responses: [complete data]
   - Status: "completed"
```

### 🔧 Technical Changes

#### Service Layer (`reportsService.js`)

**New Function: `getDraftReports()`**
- Fetches reports with `response_status = 'draft'`
- Returns consistent structure with `reports` and `count`
- Marks empty drafts as status `"pending"`, non-empty as `"draft"`

**Updated Function: `getPendingReports()`**
- Now fetches `client_report` posts without corresponding `report_response`
- Returns reports that haven't been started yet
- Returns consistent structure with `reports` and `count`

#### Controller Layer (`reportsController.js`)

**New Function: `getDraftReports()`**
- Handles `GET /api/client/reports/draft`
- Returns standardized response structure

**Updated Function: `getPendingReports()`**
- Now handles reports without responses only

#### Routes (`reportsRoutes.js`)
- Added route: `GET /draft`
- Updated documentation for all routes

### 📝 Response Structure Consistency

All list endpoints now return the same structure:

```json
{
  "success": true,
  "data": [...],
  "count": 0
}
```

### 🎯 Status Logic

The `status` field in responses is determined by:

1. **Pending**: No `report_response` exists OR `responses` array is empty
2. **Draft**: `response_status = 'draft'` AND `responses` has data
3. **Completed**: `response_status = 'submitted'`

### 🔐 Breaking Changes

⚠️ **Frontend Changes Required:**

1. **Old `/pending` endpoint behavior changed:**
   - Previously: Returned both new reports and drafts
   - Now: Returns only reports without responses
   
2. **Must use `/draft` for saved drafts:**
   - Draft reports now require calling the new `/draft` endpoint
   
3. **Combined totals:**
   - To get "reports needing attention", sum `/pending` + `/draft` counts

### 📚 Migration Guide

**Before (v1.x):**
```javascript
// Get all reports needing action
const pending = await api.get('/client/reports/pending');
const totalNeedingAction = pending.count;
```

**After (v2.0):**
```javascript
// Get all reports needing action
const pending = await api.get('/client/reports/pending');
const drafts = await api.get('/client/reports/draft');
const totalNeedingAction = pending.count + drafts.count;
```

### ✅ Benefits

1. **Clearer Separation**: Distinct endpoints for different report states
2. **Better UX**: Can show "New Reports" vs "Continue Drafts" separately
3. **Consistent Structure**: All endpoints return same format
4. **Flexible Status**: Empty drafts marked as pending for better UI indication

---

## Version 1.2 - November 18, 2025

- Added detail statistics fields (28 body measurements)
- Added upload image support
- Added draft saving functionality
- Updated documentation

## Version 1.0 - Initial Release

- Basic CRUD operations for client reports
- Report submission functionality
- Statistics endpoint
