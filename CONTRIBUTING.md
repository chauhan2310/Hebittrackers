# 🤝 Contributing to Habit Tracker

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## How to Contribute

### Reporting Bugs

Found a bug? Please report it by:

1. **Check existing issues** - Search to see if the bug is already reported
2. **Create a detailed report** including:
   - Clear title and description
   - Steps to reproduce the issue
   - Expected vs actual behavior
   - Browser/OS information
   - Screenshots if applicable

### Suggesting Features

Have an idea? Share it by:

1. **Discuss first** - Open an issue to discuss the feature
2. **Provide details**:
   - What problem does it solve?
   - How should it work?
   - Use cases and examples
   - Potential implementation approach

### Submitting Code

Ready to code? Follow these steps:

#### 1. Fork the Repository
```bash
# Click "Fork" on GitHub
git clone https://github.com/YOUR_USERNAME/Hebittrackers.git
cd Hebittrackers
```

#### 2. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
# or for bug fixes:
git checkout -b fix/bug-name
```

#### 3. Make Changes
- Keep changes focused and atomic
- Follow the existing code style
- Add comments for complex logic
- Test your changes thoroughly

#### 4. Commit with Clear Messages
```bash
git commit -m "feat: add feature description"
git commit -m "fix: resolve bug description"
```

Use conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `style:` - Formatting changes
- `test:` - Adding tests

#### 5. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```

Then open a Pull Request on GitHub with:
- Clear title describing the change
- Description of what and why
- Link to related issues
- Screenshots for UI changes

## Code Style Guidelines

### JavaScript/JSX

- Use **2-space indentation**
- Use **const** by default, **let** when needed
- Use **arrow functions** for callbacks
- Use **destructuring** for props and object access
- Add **JSDoc comments** for functions:

```javascript
/**
 * Toggles a habit record for a given date
 * @param {string} dateKey - The date in YYYY-MM-DD format
 * @param {string} habitId - The habit ID to toggle
 */
const toggleRecord = (dateKey, habitId) => {
  // implementation
};
```

### React Components

- Use **functional components** with hooks
- Use **useState** for local state
- Use **useEffect** for side effects
- Keep components focused and reusable
- Extract complex logic into custom hooks

### CSS/Tailwind

- Use **Tailwind utility classes** consistently
- Group related classes together
- Use responsive prefixes: `sm:`, `md:`, `lg:`, `xl:`
- Keep custom CSS minimal

## Testing

Before submitting a PR:

1. **Test locally** - Run `npm run dev` and manually test changes
2. **Test across browsers** - Chrome, Firefox, Safari, Edge
3. **Test responsive design** - Desktop, tablet, mobile
4. **Test data persistence** - localStorage works correctly
5. **Test edge cases** - Empty states, long names, many habits

## Documentation

For significant changes:

- Update **README.md** if user-facing
- Update **SETUP_GUIDE.md** if setup steps change
- Add code comments for complex logic
- Update API docs if functions change

## Commit Message Examples

```
feat: add dark mode toggle to settings
fix: resolve habit deletion not clearing records
docs: improve setup instructions
refactor: extract chart rendering to separate component
perf: optimize habit filtering with memoization
test: add unit tests for date utilities
```

## Pull Request Checklist

Before submitting, ensure:

- [ ] Changes are focused and atomic
- [ ] Code follows style guidelines
- [ ] No console errors or warnings
- [ ] Responsive design is maintained
- [ ] Documentation is updated
- [ ] Commits have clear messages
- [ ] No unnecessary dependencies added
- [ ] Tested on multiple browsers

## Review Process

1. **Automated checks** - Code is linted and tested
2. **Manual review** - Maintainers review code and changes
3. **Feedback** - May request changes or clarifications
4. **Approval** - Once approved, your PR will be merged

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/Hebittrackers.git
cd Hebittrackers

# Install dependencies
npm install

# Create feature branch
git checkout -b feature/your-feature

# Start dev server
npm run dev

# Make changes, test, commit
git add .
git commit -m "feat: your feature"

# Push and create PR
git push origin feature/your-feature
```

## Code Review Tips

When reviewing others' code:

- Be respectful and constructive
- Suggest improvements, don't demand
- Acknowledge good work
- Ask questions rather than assert
- Focus on the code, not the person

## Project Structure

```
├── src/App.jsx        # Main component
├── README.md          # User documentation
├── SETUP_GUIDE.md     # Developer setup
├── CONTRIBUTING.md    # This file
├── package.json       # Dependencies
└── tailwind.config.js # Tailwind config
```

## Areas for Contribution

### Easy (Good for First-Time Contributors)
- Documentation improvements
- Fix typos and grammar
- Add comments to complex code
- Update styling with Tailwind

### Medium
- Bug fixes with clear reproduction steps
- UI/UX improvements
- New small features (add icons, improve colors)
- Refactoring for clarity

### Advanced
- Performance optimizations
- State management improvements
- Backend integration setup
- Cross-browser compatibility fixes

## Questions?

- Open an issue to discuss
- Check existing documentation
- Look at similar projects for patterns
- Don't hesitate to ask!

## License

By contributing, you agree that your contributions will be licensed under the same terms as the project.

---

Thank you for making Habit Tracker better! 🎉
