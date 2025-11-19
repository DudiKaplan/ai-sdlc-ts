# Technical Spike Template

## Spike Overview

**Title:** [Spike title]

**Goal:** [What are we trying to learn or prove]

**Time Box:** [How long to spend on this]

**Status:** [Planning/In Progress/Complete]

## Context

**Background:**
[Why are we doing this spike? What problem are we trying to solve?]

**Current Situation:**
[What's the current state? What are the pain points?]

**Desired Outcome:**
[What do we hope to achieve?]

## Questions to Answer

1. [Question 1]
2. [Question 2]
3. [Question 3]

## Approach

### Research Areas

1. **Area 1:**
   - Documentation to review
   - Tutorials to follow
   - Code examples to study

2. **Area 2:**
   - Technologies to evaluate
   - Benchmarks to run
   - Proof of concepts to build

### Success Criteria

- [ ] Can answer all key questions
- [ ] Have working proof of concept
- [ ] Documented findings
- [ ] Clear recommendation

## Options to Evaluate

### Option 1: [Name]

**Pros:**
- Pro 1
- Pro 2

**Cons:**
- Con 1
- Con 2

**TypeScript Support:**
- [Level of TypeScript support]

**Learning Curve:**
- [Assessment]

**Community/Ecosystem:**
- [Assessment]

**Cost:**
- [Free/Paid, licensing]

**Example Code:**
```typescript
// Example implementation
```

### Option 2: [Name]

[Same structure as Option 1]

### Option 3: [Name]

[Same structure as Option 1]

## Experiments

### Experiment 1: [Title]

**Hypothesis:**
[What we think will happen]

**Setup:**
```typescript
// Setup code
```

**Results:**
[What actually happened]

**Conclusions:**
[What we learned]

### Experiment 2: [Title]

[Same structure as Experiment 1]

## Proof of Concept

### Implementation Details

**Files Created:**
- `src/spike/file1.ts` - Purpose
- `src/spike/file2.tsx` - Purpose

**Key Code:**
```typescript
// Important code snippets showing how it works

import { Feature } from 'library'

interface Config {
  option1: string
  option2: number
}

class Implementation {
  constructor(config: Config) {
    // implementation
  }

  async doSomething(): Promise<Result> {
    // example usage
  }
}
```

### Testing Results

**Performance:**
- Metric 1: [Result]
- Metric 2: [Result]

**Integration:**
- Works with TypeScript: [Yes/No/Partially]
- Works with Remult: [Yes/No/Partially]
- Works with React: [Yes/No/Partially]

**Developer Experience:**
- Type safety: [Good/Medium/Poor]
- Documentation: [Good/Medium/Poor]
- Error messages: [Good/Medium/Poor]

## Findings

### Key Learnings

1. [Learning 1]
2. [Learning 2]
3. [Learning 3]

### Surprises

- [Something unexpected we discovered]
- [Something unexpected we discovered]

### Concerns

- [Potential issue or concern]
- [Potential issue or concern]

## Recommendations

### Primary Recommendation

**Recommended Approach:** [Which option to choose]

**Reasoning:**
[Why this is the best choice for our use case]

**Implementation Estimate:**
- Setup time: [Time estimate]
- Development time: [Time estimate]
- Testing time: [Time estimate]

**Migration Path:**
[How to migrate from current state to this solution]

### Alternative Recommendations

**If primary doesn't work:**
[Backup plan]

## Comparison Matrix

| Criteria | Option 1 | Option 2 | Option 3 |
|----------|----------|----------|----------|
| TypeScript Support | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Performance | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| Developer Experience | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Documentation | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| Community Size | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Cost | Free | Paid | Free |
| **Total** | [Score] | [Score] | [Score] |

## Implementation Plan

### Phase 1: Preparation
- [ ] Task 1
- [ ] Task 2

### Phase 2: Integration
- [ ] Task 1
- [ ] Task 2

### Phase 3: Migration
- [ ] Task 1
- [ ] Task 2

### Phase 4: Cleanup
- [ ] Task 1
- [ ] Task 2

## Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Risk 1 | High/Med/Low | High/Med/Low | How to mitigate |
| Risk 2 | High/Med/Low | High/Med/Low | How to mitigate |

## Resources

### Documentation
- [Link to documentation]
- [Link to documentation]

### Tutorials
- [Link to tutorial]
- [Link to tutorial]

### Example Projects
- [Link to example]
- [Link to example]

### Community
- [Link to community forum/Discord]
- [Link to Stack Overflow tag]

## Code Samples

### Example 1: Basic Usage
```typescript
import { Feature } from 'library'

// Example showing basic usage
const feature = new Feature({
  config: 'value',
})

await feature.execute()
```

### Example 2: Integration with Our Stack
```typescript
import { Entity, Fields } from 'remult'
import { Feature } from 'library'

@Entity('example')
export class Example {
  @Fields.cuid()
  id = ''

  // Showing how it integrates
}
```

### Example 3: Error Handling
```typescript
// Example showing proper error handling
try {
  await feature.execute()
} catch (error) {
  if (error instanceof SpecificError) {
    // handle specifically
  }
  throw error
}
```

## Questions Raised

**New Questions:**
- [Question that came up during spike]
- [Question that needs further investigation]

**Blockers:**
- [Any blockers identified]

## Next Steps

- [ ] Share findings with team
- [ ] Get feedback on recommendation
- [ ] Create implementation tickets
- [ ] Update architecture documentation
- [ ] Schedule team discussion if needed

## Timeline

- **Start Date:** [Date]
- **End Date:** [Date]
- **Actual Duration:** [Duration]

## Participants

- **Lead:** [Name]
- **Contributors:** [Names]
- **Reviewers:** [Names]

## Sign-off

**Recommendation Approved By:** [Name]
**Date:** [Date]
**Ready to Implement:** [Yes/No]

## Appendix

### Detailed Benchmarks
[Link to or include detailed performance data]

### Complete Code
[Link to spike branch or proof of concept repository]

### Meeting Notes
[Any relevant meeting notes or discussions]
