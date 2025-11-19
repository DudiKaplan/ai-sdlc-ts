# Feature Development Template

## Feature Overview

**Feature Name:** [Name of the feature]

**Description:** [Brief description of what this feature does and why it's needed]

**Priority:** [High/Medium/Low]

**Estimated Effort:** [Small/Medium/Large]

## Requirements

### User Stories
- As a [type of user], I want [goal] so that [benefit]
- As a [type of user], I want [goal] so that [benefit]

### Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Technical Design

### Data Model Changes

**New Entities:**
```typescript
@Entity('entity_name', {
  allowApiCrud: Allow.authenticated,
})
export class EntityName {
  @Fields.cuid()
  id = ''

  @Fields.string()
  @Validators.required()
  field1 = ''

  // Additional fields...
}
```

**Modified Entities:**
- Entity: [Entity name]
  - Added fields: [field names]
  - Modified fields: [field names]
  - Validation changes: [description]

### API Changes

**New Endpoints:**
- `GET /api/resource` - Description
- `POST /api/resource` - Description

**Modified Endpoints:**
- `PUT /api/resource/:id` - Changes description

**Backend Methods:**
```typescript
@BackendMethod({ allowed: Allow.authenticated })
static async methodName(param: string, remult?: Remult): Promise<Type> {
  // Implementation
}
```

### Frontend Components

**New Components:**
- `ComponentName` - Purpose and location
- `ComponentName` - Purpose and location

**Modified Components:**
- `ComponentName` - Changes description

**New Routes:**
- `/path` - Description

### State Management

**New State:**
- State structure
- Where it lives (local, context, etc.)

**Modified State:**
- Changes description

## Implementation Plan

### Phase 1: Backend
- [ ] Create/modify entities in `src/shared/entities/`
- [ ] Add validation rules
- [ ] Implement backend methods
- [ ] Register entities in `src/server/api/remult.ts`
- [ ] Write entity tests
- [ ] Test API endpoints manually

### Phase 2: Frontend
- [ ] Create new components in `src/client/components/`
- [ ] Create/update routes in `src/client/routes/`
- [ ] Implement state management
- [ ] Add error handling
- [ ] Add loading states
- [ ] Implement form validation

### Phase 3: Integration
- [ ] Connect frontend to backend API
- [ ] Add error boundaries
- [ ] Test full user flow
- [ ] Add accessibility features
- [ ] Test responsive design

### Phase 4: Testing
- [ ] Write component tests
- [ ] Write integration tests
- [ ] Write E2E tests (if applicable)
- [ ] Test edge cases
- [ ] Test error scenarios

### Phase 5: Documentation
- [ ] Update README if needed
- [ ] Add JSDoc comments
- [ ] Document new environment variables
- [ ] Update API documentation

## Testing Strategy

### Unit Tests
- Test entity validation
- Test backend methods
- Test component logic
- Test utility functions

### Integration Tests
- Test API endpoints
- Test component interactions
- Test data flow

### Manual Testing Checklist
- [ ] Happy path works
- [ ] Error cases handled
- [ ] Loading states shown
- [ ] Form validation works
- [ ] Accessibility tested
- [ ] Mobile responsive
- [ ] Cross-browser tested

## Security Considerations

- [ ] Input validation on server
- [ ] Authorization checks implemented
- [ ] No sensitive data exposed
- [ ] SQL injection prevented (Remult handles this)
- [ ] XSS prevented (React handles this)
- [ ] Secrets not hardcoded

## Performance Considerations

- [ ] Database queries optimized
- [ ] No N+1 queries
- [ ] Pagination implemented (if needed)
- [ ] Components memoized appropriately
- [ ] Large lists virtualized (if needed)
- [ ] Images optimized

## Accessibility Checklist

- [ ] Keyboard navigation works
- [ ] Screen reader friendly
- [ ] ARIA labels added
- [ ] Color contrast sufficient
- [ ] Focus indicators visible
- [ ] Error messages announced

## Migration/Deployment Notes

### Database Migrations
```typescript
// Migration script if needed
// src/server/db/migrations/001_add_new_table.ts
```

### Environment Variables
```
# Add to .env.example
NEW_FEATURE_ENABLED=true
```

### Breaking Changes
- None / [Description of breaking changes]

### Rollback Plan
- [How to rollback if needed]

## Open Questions

- [ ] Question 1?
- [ ] Question 2?

## Dependencies

**New npm packages:**
- `package-name` - Purpose

**External services:**
- Service name - Purpose

## Timeline

- **Start Date:** [Date]
- **Target Completion:** [Date]
- **Actual Completion:** [Date]

## Review Checklist

Before submitting PR:
- [ ] Code follows TypeScript style guide
- [ ] All tests pass
- [ ] No TypeScript errors
- [ ] ESLint warnings addressed
- [ ] Code formatted with Prettier
- [ ] Documentation updated
- [ ] Security considerations addressed
- [ ] Performance acceptable
- [ ] Accessibility verified
- [ ] Mobile tested
- [ ] PR description complete

## Notes

[Any additional notes, decisions, or context]
