# Code Review Template

## PR Information

**PR Title:** [Title of the pull request]

**PR Author:** [Author name]

**Reviewer:** [Your name]

**Date:** [Review date]

**PR Link:** [Link to PR]

## Summary

**What does this PR do?**
[Brief summary of changes]

**Related Issues:**
- Fixes #[issue number]
- Related to #[issue number]

## Code Review Checklist

### TypeScript & Code Quality

- [ ] TypeScript strict mode enabled
- [ ] No `any` types without justification
- [ ] Types are properly defined
- [ ] No TypeScript errors
- [ ] Functions have return types
- [ ] Interfaces/types are well-named
- [ ] Code follows style guide
- [ ] ESLint passes with no warnings
- [ ] Code is formatted with Prettier
- [ ] No commented-out code
- [ ] No debug console.logs left in
- [ ] Variables have meaningful names
- [ ] Functions are focused and single-purpose
- [ ] DRY principle followed

### React Components

- [ ] Functional components used
- [ ] Props properly typed
- [ ] Hooks used correctly
- [ ] No unnecessary re-renders
- [ ] Memoization used appropriately
- [ ] Effects have proper dependencies
- [ ] Components are focused
- [ ] Loading states handled
- [ ] Error states handled
- [ ] Accessibility attributes present

### Backend & Data

- [ ] Entity definitions are correct
- [ ] Validation rules implemented
- [ ] Authorization checks in place
- [ ] Backend methods properly secured
- [ ] Database queries optimized
- [ ] No N+1 query problems
- [ ] Transactions used when needed
- [ ] Error handling implemented

### Security

- [ ] Input validation on server
- [ ] No hardcoded secrets
- [ ] Authorization checks present
- [ ] SQL injection prevented
- [ ] XSS vulnerabilities addressed
- [ ] Sensitive data not logged
- [ ] CORS configured properly
- [ ] Rate limiting considered

### Testing

- [ ] Unit tests added/updated
- [ ] Tests cover new functionality
- [ ] Tests cover edge cases
- [ ] Tests cover error cases
- [ ] All tests pass
- [ ] Test descriptions are clear
- [ ] Mocks are appropriate
- [ ] Test coverage acceptable

### Performance

- [ ] No obvious performance issues
- [ ] Database queries efficient
- [ ] Large lists paginated/virtualized
- [ ] Components optimized
- [ ] Images/assets optimized
- [ ] No memory leaks

### Documentation

- [ ] README updated if needed
- [ ] JSDoc comments for complex code
- [ ] Environment variables documented
- [ ] API changes documented
- [ ] Breaking changes noted
- [ ] Migration guide provided (if needed)

### UI/UX

- [ ] UI matches design specs
- [ ] Responsive on mobile
- [ ] Works on different browsers
- [ ] Loading indicators present
- [ ] Error messages user-friendly
- [ ] Forms validate properly
- [ ] Keyboard navigation works
- [ ] Screen reader compatible

## Detailed Feedback

### Strengths

- [What was done well]
- [Positive aspects of the PR]

### Issues Found

#### Critical Issues (Must fix before merge)

1. **File:** `src/path/to/file.ts:123`
   **Issue:** [Description]
   **Suggestion:** [How to fix]

#### Major Issues (Should fix before merge)

1. **File:** `src/path/to/file.ts:456`
   **Issue:** [Description]
   **Suggestion:** [How to fix]

#### Minor Issues (Nice to have)

1. **File:** `src/path/to/file.ts:789`
   **Issue:** [Description]
   **Suggestion:** [How to fix]

### Questions

1. [Question about implementation choice]
2. [Question about requirements]

### Suggestions for Improvement

1. [Suggestion for better approach]
2. [Suggestion for optimization]

## Code Samples

### Example of Issue

```typescript
// Current code (problematic)
function problematicCode(data: any) {
  return data.value
}

// Suggested improvement
interface DataType {
  value: string
}

function improvedCode(data: DataType): string {
  return data.value
}
```

## Testing Notes

**Manual Testing Performed:**
- [ ] Tested happy path
- [ ] Tested error cases
- [ ] Tested on desktop
- [ ] Tested on mobile
- [ ] Tested different browsers

**Automated Tests:**
- [ ] All existing tests pass
- [ ] New tests added
- [ ] Coverage acceptable

## Security Review

**Potential Security Issues:**
- None identified / [List issues]

**Recommendations:**
- [Security recommendations if any]

## Performance Review

**Performance Concerns:**
- None identified / [List concerns]

**Recommendations:**
- [Performance recommendations if any]

## Accessibility Review

**Accessibility Issues:**
- None identified / [List issues]

**Recommendations:**
- [Accessibility recommendations if any]

## Overall Assessment

**Complexity:** [Low/Medium/High]

**Risk Level:** [Low/Medium/High]

**Recommendation:** [Approve/Request Changes/Needs Discussion]

## Decision

- [ ] ✅ **Approved** - Ready to merge
- [ ] 🔄 **Approved with minor changes** - Can merge after addressing minor issues
- [ ] ❌ **Request changes** - Must address issues before merge
- [ ] 💬 **Needs discussion** - Let's discuss the approach

## Additional Comments

[Any other feedback, suggestions, or notes]

## Action Items for Author

Before merging:
- [ ] Address critical issues
- [ ] Address major issues
- [ ] Consider minor suggestions
- [ ] Update tests
- [ ] Update documentation
- [ ] Respond to questions
- [ ] Re-request review after changes

## Follow-up Tasks

- [ ] [Task 1 to be done in future PR]
- [ ] [Task 2 to be done in future PR]

## Sign-off

**Reviewer:** [Name]
**Date:** [Date]
**Status:** [Approved/Changes Requested]
