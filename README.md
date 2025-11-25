# Playwright Book Store Tests

This project contains automated tests for the Book Store application using Playwright with JavaScript

## Test Scenarios

### Scenario 1: Search book with multiple results
- Verifies that searching for "Design" displays all matching books
- Tests case-insensitive search functionality

### Scenario 2: Delete book successfully
- **Uses API to add book before deletion**
- Tests the complete flow of deleting a book from the profile
- Includes API setup, login, search, delete, and verification steps
- Book is added via API: `POST https://demoqa.com/BookStore/v1/Books`

## API Helpers

### AccountHelper
Manages user account operations:
- `login(username, password)` - Login and get userId and token (uses `/Account/v1/Login`)
- `generateToken(username, password)` - Generate authentication token
- `createUser(username, password)` - Create new user account
- `authorizeUser(username, password)` - Authorize user credentials
- `getUserDetails(userId, token)` - Get user information
- `deleteUser(userId, token)` - Delete user account

### BookHelper
Manages book store operations:
- `getAllBooks()` - Get all available books
- `getBookByISBN(isbn)` - Get specific book by ISBN
- `getBookByTitle(title)` - Get specific book by title
- `addBook(userId, isbn, token)` - Add single book to user's collection
- `addMultipleBooks(userId, isbnArray, token)` - Add multiple books
- `deleteBook(userId, isbn, token)` - Delete specific book
- `deleteAllBooks(userId, token)` - Delete all books from user's collection
- `replaceBook(userId, oldIsbn, newIsbn, token)` - Replace a book

### API Configuration
Located in `api/config/api-config.js`:
- Base URL and endpoints
- Test user credentials
- Pre-configured book ISBNs

## Usage Example

```javascript
const AccountHelper = require('./api/helpers/account-helper');
const BookHelper = require('./api/helpers/book-helper');
const apiConfig = require('./api/config/api-config');

// Initialize helpers
const accountHelper = new AccountHelper();
const bookHelper = new BookHelper();
await accountHelper.initialize();
await bookHelper.initialize();

// Login to get userId and token
const loginResponse = await accountHelper.login(username, password);
const userId = loginResponse.userId;
const token = loginResponse.token;

// Add book
await bookHelper.addBook(userId, isbn, token);

// Cleanup
await accountHelper.dispose();
await bookHelper.dispose();
```
## Notes

- Update test user credentials in api/config/api-config.js
- The framework supports multiple browsers: Chromium, Firefox, and WebKit
- API helpers use Playwright's request context for API calls
- Run api-examples.spec.js to see all API helper methods in action

