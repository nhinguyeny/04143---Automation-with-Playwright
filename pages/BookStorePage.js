class BookStorePage {
  constructor(page) {
    this.page = page;
    this.searchBox = page.locator('#searchBox');
    this.bookItems = page.locator('.rt-tr-group');
    this.bookTitles = page.locator('.rt-tr-group .action-buttons a');
  }

  async navigate() {
    await this.page.goto('/books', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await this.page.waitForSelector('#searchBox', { timeout: 30000 });
  }

  async searchBook(bookName) {
    await this.searchBox.waitFor({ state: 'visible', timeout: 10000 });
    await this.searchBox.fill(bookName);
    await this.page.waitForTimeout(1000);
  }

  async getDisplayedBooks() {
    const books = [];
    const bookElements = await this.bookTitles.all();
    
    for (const book of bookElements) {
      const title = await book.textContent();
      if (title && title.trim() !== '') {
        books.push(title.trim());
      }
    }
    
    return books;
  }

  async isBookDisplayed(bookName) {
    const books = await this.getDisplayedBooks();
    return books.some(book => book.includes(bookName));
  }

  async getBookCount() {
    const books = await this.getDisplayedBooks();
    return books.length;
  }

  async verifyBooksMatchCriteria(searchTerm) {
    const books = await this.getDisplayedBooks();
    const searchTermLower = searchTerm.toLowerCase();
    
    return books.every(book => 
      book.toLowerCase().includes(searchTermLower)
    );
  }
}

module.exports = BookStorePage;
