# Publishing Guide

This guide will help you publish the `isMobile` hook to NPM.

## Prerequisites

1. **NPM Account**: Make sure you have an NPM account at [npmjs.com](https://npmjs.com)
2. **NPM CLI**: Install npm CLI and login:
   ```bash
   npm install -g npm
   npm login
   ```

## Before Publishing

1. **Test the build**:
   ```bash
   npm run build
   ```

2. **Test the package locally**:
   ```bash
   npm run publish:dry
   ```

3. **Update version** (choose one):
   ```bash
   npm run version:patch  # For bug fixes (1.0.0 -> 1.0.1)
   npm run version:minor  # For new features (1.0.0 -> 1.1.0)
   npm run version:major  # For breaking changes (1.0.0 -> 2.0.0)
   ```

## Publishing Steps

### Option 1: Automatic Publishing
```bash
npm run publish:npm
```

### Option 2: Manual Publishing
```bash
npm publish --access public
```

## Post-Publishing

1. **Verify the package**: Visit [npmjs.com/package/hooks](https://npmjs.com/package/hooks)

2. **Test installation**:
   ```bash
   npx create-react-app test-app
   cd test-app
   npm install hooks
   ```

3. **Update README badges** (optional):
   Add NPM version and download badges to README.md

## Usage in Projects

After publishing, users can install your hook:

```bash
npm install hooks
```

And use it in their React projects:

```jsx
import { isMobile } from 'hooks';

function MyComponent() {
  const mobile = isMobile();
  return <div>{mobile ? 'Mobile' : 'Desktop'}</div>;
}
```

## Troubleshooting

### Common Issues

1. **403 Forbidden**: Make sure you're logged in (`npm login`) and have publish rights
2. **Package name taken**: Choose a different package name or use scoped package (`@username/package-name`)
3. **Version already exists**: Update the version number before publishing

### Useful Commands

```bash
# Check current NPM user
npm whoami

# Check package info
npm info hooks

# Unpublish a version (use carefully!)
npm unpublish hooks@1.0.0
```

## Best Practices

1. Always test your package before publishing
2. Use semantic versioning (semver)
3. Keep good documentation
4. Include examples and demos
5. Respond to issues and maintain the package
