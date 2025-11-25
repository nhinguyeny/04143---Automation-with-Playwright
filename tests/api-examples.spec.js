const { test, expect } = require('@playwright/test');
const AccountHelper = require('../api/helpers/account-helper');
const BookHelper = require('../api/helpers/book-helper');
const apiConfig = require('../api/config/api-config');

test.describe('API Helper Examples', () => {
  let accountHelper;
  let bookHelper;
  let token;
  let userId;

  const username = apiConfig.testUser.username;
  const password = apiConfig.testUser.password;

  test.beforeAll(async () => {
    accountHelper = new AccountHelper();
    bookHelper = new BookHelper();
    
    await accountHelper.initialize();
    await bookHelper.initialize();
  });

  test.afterAll(async () => {
    await accountHelper.dispose();
    await bookHelper.dispose();
  });

  test('should login and get userId and token', async () => {
    const loginResponse = await accountHelper.login(username, password);
    userId = loginResponse.userId;
    token = loginResponse.token;
    
    expect(userId).toBeTruthy();
    expect(token).toBeTruthy();
    console.log('User ID:', userId);
    console.log('Token generated:', token);
  });

  test('should get all books from store', async () => {
    const books = await bookHelper.getAllBooks();
    expect(books.length).toBeGreaterThan(0);
    console.log(`Found ${books.length} books in store`);
    //console.log('First book:', books[0].title);
  });

  test('should get book by title', async () => {
    const book = await bookHelper.getBookByTitle('Learning JavaScript Design Patterns');
    expect(book).toBeTruthy();
    expect(book.isbn).toBe(apiConfig.bookISBNs.learningJavaScriptDesignPatterns);
    console.log('Book found:', book.title, 'ISBN:', book.isbn);
  });

  //test('should add and delete book', async () => {
    //if (!token || !userId) {
      //const loginResponse = await accountHelper.login(username, password);
      //userId = loginResponse.userId;
      //token = loginResponse.token;
    //}

    //await bookHelper.deleteAllBooks(userId, token);
    //console.log('All books deleted');

    //const addResult = await bookHelper.addBook(
    //  userId,
    //  apiConfig.bookISBNs.learningJavaScriptDesignPatterns,
    //  token
    //);
    //expect(addResult.books.length).toBeGreaterThan(0);
    //console.log('Book added successfully');

    //const deleteResult = await bookHelper.deleteBook(
    //  userId,
    //  apiConfig.bookISBNs.learningJavaScriptDesignPatterns,
    //  token
    //);
    //expect(deleteResult).toBeTruthy();
    //console.log('Book deleted successfully');
  //});

  test('should add multiple books', async () => {
    if (!token || !userId) {
      const loginResponse = await accountHelper.login(username, password);
      userId = loginResponse.userId;
      token = loginResponse.token;
    }

    await bookHelper.deleteAllBooks(userId, token);

    const isbns = [
      apiConfig.bookISBNs.learningJavaScriptDesignPatterns,
      apiConfig.bookISBNs.designingEvolvableWebAPIs,
      apiConfig.bookISBNs.eloquentJavaScript,
    ];

    const result = await bookHelper.addMultipleBooks(userId, isbns, token);
    expect(result.books.length).toBe(3);
    console.log(`Added ${result.books.length} books successfully`);
  });
});
