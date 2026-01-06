# Testing Guide - Health Examination System

## Giới thiệu

Dự án sử dụng **Vitest** làm testing framework, kết hợp với **@testing-library/react** để test React components.

## Thiết lập

Các dependencies đã được cài đặt:
- `vitest` - Testing framework
- `@vitest/ui` - UI cho test results
- `@testing-library/react` - React testing utilities
- `@testing-library/jest-dom` - DOM matchers
- `jsdom` - DOM simulation

## Scripts

```bash
# Chạy tất cả tests một lần
npm test

# Chạy tests ở chế độ watch (tự động chạy lại khi có thay đổi)
npm test -- --watch

# Xem test results trong UI browser
npm test:ui

# Sinh coverage report
npm test:coverage
```

## Cấu trúc Test

### File Test

Test files được đặt cùng thư mục với component/utility tương ứng và có tên:
- `ComponentName.test.tsx` - để test React components
- `utilityName.test.ts` - để test utility functions

### Ví dụ

```
src/
├── components/
│   ├── Header.tsx
│   └── Header.test.tsx        ← Test file
├── utils/
│   ├── patientStorage.ts
│   └── patientStorage.test.ts ← Test file
```

## Các Test hiện có

### 1. Header Component (`src/components/Header.test.tsx`)
- ✓ Render the header component
- ✓ Contain header structure

### 2. ExaminationMenu Component (`src/components/ExaminationMenu.test.tsx`)
- ✓ Render the examination menu
- ✓ Contain examination buttons

### 3. Patient Storage Utils (`src/utils/patientStorage.test.ts`)
- ✓ Save patient data
- ✓ Handle getting all patient data

## Viết Test Mới

### Cơ bản cho Component React

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Cơ bản cho Utils

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from './myUtils';

describe('myFunction', () => {
  it('should return expected result', () => {
    const result = myFunction(input);
    expect(result).toBe(expectedValue);
  });
});
```

## Các Matchers thường dùng

```typescript
// Element matchers
expect(element).toBeInTheDocument();
expect(element).toBeVisible();
expect(element).toHaveTextContent('text');
expect(element).toHaveClass('className');
expect(element).toHaveAttribute('attr', 'value');

// Value matchers
expect(value).toBe(expected);
expect(value).toEqual(expected);
expect(value).toBeDefined();
expect(value).toBeNull();
expect(value).toBeTruthy();
expect(value).toBeFalsy();
expect(array).toContain(item);
expect(array.length).toBeGreaterThan(0);
```

## Query Functions

```typescript
// getBy - throws if not found
screen.getByText('text');
screen.getByRole('button');
screen.getByPlaceholderText('placeholder');

// queryBy - returns null if not found
screen.queryByText('text');

// findBy - async, waits for element
await screen.findByText('text');

// getAllBy / queryAllBy / findAllBy
screen.getAllByRole('button');
```

## User Interaction

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

it('should handle click', async () => {
  const user = userEvent.setup();
  render(<MyComponent />);
  
  const button = screen.getByRole('button');
  await user.click(button);
  
  expect(screen.getByText('Clicked!')).toBeInTheDocument();
});
```

## Setup & Teardown

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('MyComponent', () => {
  beforeEach(() => {
    // Chạy trước mỗi test
  });

  afterEach(() => {
    // Chạy sau mỗi test
  });

  it('test case', () => {
    // ...
  });
});
```

## Mocking

### Mock localStorage

```typescript
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});
```

### Mock Functions

```typescript
import { vi } from 'vitest';

const mockFunction = vi.fn();
mockFunction.mockReturnValue('result');
mockFunction.mockResolvedValue(Promise.resolve('result'));
```

## Chạy Test trong Development

```bash
# Watch mode - tự động chạy lại test khi có thay đổi
npm test -- --watch

# Chỉ chạy test file cụ thể
npm test -- Header.test.tsx

# Chạy test với pattern
npm test -- --grep "should render"
```

## CI/CD Integration

Để chạy test trong CI/CD pipeline:

```bash
npm test -- --run  # Chạy một lần và thoát
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest DOM Matchers](https://github.com/testing-library/jest-dom)
