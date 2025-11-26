const { request } = require('@playwright/test');

class BookHelper {
  constructor() {
    this.baseURL = 'https://demoqa.com';
    this.apiContext = null;
  }

  async initialize() {
    this.apiContext = await request.newContext({
      baseURL: this.baseURL,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  async getAllBooks() {
    const response = await this.apiContext.get('/BookStore/v1/Books');
    
    if (response.ok()) {
      const responseBody = await response.json();
      return responseBody.books;
    }
    
    throw new Error('Failed to get books list');
  }

  async getBookByISBN(isbn) {
    const response = await this.apiContext.get(`/BookStore/v1/Book`, {
      params: {
        ISBN: isbn,
      },
    });
    
    if (response.ok()) {
      return await response.json();
    }
    
    throw new Error(`Failed to get book with ISBN: ${isbn}`);
  }

  async getBookByTitle(title) {
    const books = await this.getAllBooks();
    return books.find(book => book.title === title);
  }

  async addBook(userId, isbn, token) {
    const response = await this.apiContext.post('/BookStore/v1/Books', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        userId: userId,
        collectionOfIsbns: [
          {
            isbn: isbn,
          },
        ],
      },
    });

    const responseBody = await response.json();
    
    if (response.ok()) {
      return responseBody;
    }
    
    throw new Error(`Failed to add book: ${responseBody.message || 'Unknown error'}`);
  }

  async addMultipleBooks(userId, isbnArray, token) {
    const collectionOfIsbns = isbnArray.map(isbn => ({ isbn }));
    
    const response = await this.apiContext.post('/BookStore/v1/Books', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        userId: userId,
        collectionOfIsbns: collectionOfIsbns,
      },
    });

    const responseBody = await response.json();
    
    if (response.ok()) {
      return responseBody;
    }
    
    throw new Error(`Failed to add books: ${responseBody.message || 'Unknown error'}`);
  }

  //async deleteBook(userId, isbn, token) {
  //  const response = await this.apiContext.delete('/BookStore/v1/Book', {
  //    headers: {
  //      Authorization: `Bearer ${token}`,
  //    },
  //    data: {
  //      isbn: isbn,
  //      userId: userId,
  //    },
  //    timeout: 30000,
  //  });

  //  return response.status() === 204 || response.status() === 200;
  //}

  async deleteAllBooks(userId, token) {
    try {
      const response = await this.apiContext.delete(`/BookStore/v1/Books?UserId=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      if (response.status() === 204 || response.status() === 200) {
        return true;
      }

      const responseBody = await response.text();
      console.log(`Delete all books response: ${response.status()} - ${responseBody}`);
      return response.status() === 204 || response.status() === 200;
    } catch (error) {
      console.log(`Delete all books failed: ${error.message}`);
      return false;
    }
  }

  async dispose() {
    if (this.apiContext) {
      await this.apiContext.dispose();
    }
  }
}

module.exports = BookHelper;
