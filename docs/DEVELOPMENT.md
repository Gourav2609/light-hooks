# Development Workflow

## 🌳 Branch Strategy

- **`main`** - Production branch, always stable and deployable
- **`dev`** - Development branch, active development and integration
- **`feature/*`** - Feature branches, merged into dev for testing

## 🔄 Development Process

### 1. **Working on New Features/Hooks:**

```bash
# Switch to dev branch and get latest changes
git checkout dev
git pull origin dev

# Create feature branch for new hook
git checkout -b feature/use-new-hook-name

# Work on your feature...
# Make commits with descriptive messages
git commit -m "feat: add useNewHook for [functionality]"

# Push feature branch
git push origin feature/use-new-hook-name

# Create PR to dev branch on GitHub
```

### 2. **Testing in Development Environment:**

```bash
# Build and test in development mode (with sourcemaps)
npm run release:dev

# Run tests with watch mode for active development
npm run test:watch

# Check TypeScript types
npm run lint

# Start development server with hot reload
npm run dev
```

### 3. **Preparing for Production Release:**

```bash
# Switch to main branch
git checkout main
git pull origin main

# Merge dev into main (usually done via PR)
git merge dev

# Version bump based on change type
npm run version:minor   # For new features
npm run version:patch   # For bug fixes  
npm run version:major   # For breaking changes

# Push to trigger production build and NPM release
git push origin main --tags
```

## 🛠️ Available Commands

### Development Commands
- `npm run dev` - Start development build with watch mode
- `npm run build:dev` - Build for development (with sourcemaps)
- `npm run release:dev` - Full dev build + test pipeline
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - TypeScript type checking

### Production Commands  
- `npm run build:prod` - Build for production (minified, no sourcemaps)
- `npm run release:prod` - Full production build + test pipeline
- `npm run test:coverage` - Run tests with coverage report
- `npm run publish:npm` - Publish to NPM registry

### Versioning Commands
- `npm run publish:dev` - Create development prerelease version
- `npm run version:patch` - Bump patch version (1.0.0 → 1.0.1)
- `npm run version:minor` - Bump minor version (1.0.0 → 1.1.0)  
- `npm run version:major` - Bump major version (1.0.0 → 2.0.0)

## 🧪 Testing Strategy

### Required Tests for Each Hook:
- [ ] **Unit Tests** - Core functionality
- [ ] **SSR Safety Tests** - Server-side rendering compatibility
- [ ] **TypeScript Tests** - Type safety and inference
- [ ] **Edge Case Tests** - Error handling and boundary conditions
- [ ] **Integration Tests** - Hook interactions

### Test Commands:
```bash
# Run all tests
npm test

# Run tests for specific hook
npm test -- --testNamePattern="useNewHook"

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode (development)
npm run test:watch
```

## 📋 Hook Development Checklist

When creating a new hook, ensure:

- [ ] ✅ **SSR Safe** - Works during server-side rendering
- [ ] ✅ **TypeScript** - Full type definitions and interfaces
- [ ] ✅ **Tested** - Comprehensive test coverage
- [ ] ✅ **Documented** - JSDoc comments and README updates
- [ ] ✅ **Examples** - Working examples in demo app
- [ ] ✅ **Exported** - Added to main index.ts exports
- [ ] ✅ **Performance** - Proper cleanup and optimization
- [ ] ✅ **Conventional** - Follows React hooks best practices

## 🚀 Automated Workflows

### Development Branch (`dev`)
- ✅ Runs tests on multiple Node.js versions
- ✅ Type checking with TypeScript
- ✅ Development build validation
- ✅ Code coverage reports
- ✅ Artifact uploads for testing

### Production Branch (`main`)  
- ✅ Full test suite with coverage
- ✅ Production build optimization
- ✅ Automatic NPM publishing on version tags
- ✅ GitHub release creation
- ✅ Build artifact archiving

## 🔧 Environment Variables

The build system uses these environment variables:

- `NODE_ENV=development` - Development builds with sourcemaps
- `NODE_ENV=production` - Production builds optimized and minified
- `NODE_ENV=test` - Test environment configuration

## 📦 Build Outputs

### Development Build:
- ✅ Source maps included
- ✅ Verbose logging
- ✅ Unminified code for debugging
- ✅ Fast build times

### Production Build:
- ✅ Minified and optimized
- ✅ No source maps (smaller bundle)
- ✅ Tree-shaking friendly
- ✅ Browser compatibility

## 🎯 Quality Gates

All code must pass these quality gates before merging:

1. **TypeScript Compilation** - No type errors
2. **Test Coverage** - Minimum 80% coverage
3. **Build Success** - Both dev and prod builds pass
4. **Lint Checks** - Code follows style guidelines
5. **Documentation** - All public APIs documented

This workflow ensures high-quality, reliable hooks that work across all environments! 🚀
