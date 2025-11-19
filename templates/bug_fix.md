# Bug Fix Template

## Bug Description

**Title:** [Concise description of the bug]

**Severity:** [Critical/High/Medium/Low]

**Status:** [Open/In Progress/Fixed/Verified]

**Reported By:** [Name/Email]

**Date Reported:** [Date]

## Reproduction Steps

1. Step 1
2. Step 2
3. Step 3

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

## Environment

- **Browser:** [Chrome/Firefox/Safari/Edge + version]
- **OS:** [Windows/Mac/Linux + version]
- **Node Version:** [Version]
- **App Version/Commit:** [Version/commit hash]

## Error Messages

```
[Copy any error messages from console/logs]
```

## Screenshots/Videos

[Attach or link to screenshots/videos showing the bug]

## Root Cause Analysis

### Investigation Steps

1. [Step taken to investigate]
2. [Step taken to investigate]
3. [Step taken to investigate]

### Root Cause

[Detailed explanation of what's causing the bug]

**Location in code:**
- File: `src/path/to/file.ts`
- Line: `123`
- Function: `functionName`

**Why it happens:**
[Technical explanation]

## Impact Assessment

**Users Affected:**
- [Description of who is affected]
- [Estimated number or percentage]

**Business Impact:**
- [How this affects the business]

**Workaround:**
- [Temporary workaround if available]
- None available

## Fix Implementation

### Code Changes

**Files Modified:**
1. `src/path/to/file1.ts` - [Description of changes]
2. `src/path/to/file2.tsx` - [Description of changes]

**Key Changes:**
```typescript
// Before
function buggyCode() {
  // problematic code
}

// After
function fixedCode() {
  // fixed code with proper handling
}
```

### Testing the Fix

**Manual Testing:**
- [ ] Verified original bug is fixed
- [ ] Tested with different inputs
- [ ] Tested edge cases
- [ ] Verified no new bugs introduced
- [ ] Tested on multiple browsers
- [ ] Tested on mobile

**Automated Tests Added:**
```typescript
describe('Bug fix for [issue]', () => {
  it('should handle [scenario] correctly', () => {
    // Test implementation
  })
})
```

## Regression Prevention

**Why this bug occurred:**
- [ ] Missing validation
- [ ] Race condition
- [ ] Incorrect assumption
- [ ] Edge case not considered
- [ ] Type error not caught
- [ ] Other: [Description]

**Prevention measures:**
- [ ] Added validation
- [ ] Added test coverage
- [ ] Updated type definitions
- [ ] Added error handling
- [ ] Updated documentation
- [ ] Added monitoring/logging

## Related Issues

- Related to #[issue number]
- Similar to #[issue number]
- Blocks #[issue number]

## Deployment Notes

**Deployment Risk:** [Low/Medium/High]

**Rollback Plan:**
[How to rollback if the fix causes issues]

**Monitoring:**
[What to monitor after deployment]

## Verification

**QA Testing:**
- [ ] Verified in development
- [ ] Verified in staging
- [ ] Verified in production

**Sign-off:**
- [ ] Developer verified
- [ ] QA verified
- [ ] Product owner verified (if needed)

## Lessons Learned

**What we learned:**
[Key takeaways from this bug]

**Process improvements:**
[How to prevent similar bugs in the future]

## Checklist

Before submitting fix:
- [ ] Root cause identified
- [ ] Fix implemented
- [ ] Tests added/updated
- [ ] Manual testing completed
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] No TypeScript errors
- [ ] ESLint passes
- [ ] Regression tests pass
- [ ] Related issues linked
