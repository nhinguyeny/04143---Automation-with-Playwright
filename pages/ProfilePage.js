class ProfilePage {
  constructor(page) {
    this.page = page;
    this.searchBox = page.locator('#searchBox');
    this.bookRows = page.locator('.rt-tr-group');
    this.deleteIcons = page.locator('#delete-record-undefined');
    this.modalOkButton = page.locator('#closeSmallModal-ok');
    this.noDataMessage = page.locator('.rt-noData');
  }

  async navigate() {
    await this.page.goto('/profile', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await this.page.waitForSelector('#searchBox', { timeout: 30000 });
  }

  async searchBook(bookName) {
    await this.searchBox.waitFor({ state: 'visible', timeout: 10000 });
    await this.searchBox.fill(bookName);
    await this.page.waitForTimeout(1000);
  }

  async clickDeleteIconByBookTitle(bookTitle) {
    await this.page.waitForTimeout(1000);
    
    const deleteButton = this.page.locator(
      `xpath=//a[contains(text(),'${bookTitle}')]` +
      `/ancestor::div[@class='rt-tr-group']` +
      `//span[contains(@id,'delete-record')]`
    );
    
    await deleteButton.waitFor({ state: 'visible', timeout: 15000 });
    await deleteButton.click();
  }

  async clickDeleteIconByBookId(bookId) {
    await this.page.waitForTimeout(1000);
    
    const deleteButton = this.page.locator(
      `xpath=//span[@id='see-book-${bookId}']` +
      `/ancestor::div[@class='rt-tr-group']` +
      `//span[contains(@id,'delete-record')]`
    );
    
    await deleteButton.waitFor({ state: 'visible', timeout: 15000 });
    await deleteButton.click();
  }

  async clickDeleteIconByIndex(index = 0) {
    await this.page.waitForTimeout(1000);
    const deleteButton = this.page.locator('span[id^="delete-record-"]').nth(index);
    await deleteButton.waitFor({ state: 'visible', timeout: 15000 });
    await deleteButton.click();
  }

  async clickFirstDeleteIcon() {
    await this.page.waitForTimeout(2000);
    const deleteButtons = this.page.locator('span[id^="delete-record-"]');
    const count = await deleteButtons.count();
    
    if (count > 0) {
      await deleteButtons.first().waitFor({ state: 'visible', timeout: 15000 });
      await deleteButtons.first().click();
    } else {
      throw new Error('No delete buttons found on the page');
    }
  }

  async clickModalOkButton() {
    await this.modalOkButton.waitFor({ state: 'visible', timeout: 10000 });
    await this.modalOkButton.click();
  }

  async handleAlert() {
    this.page.on('dialog', async dialog => {
      await dialog.accept();
    });
  }

  async clickAlertOkButton() {
    await this.page.waitForTimeout(500);
  }

  async isBookNotShown(bookName) {
    await this.page.waitForTimeout(1000);
    
    const bookElements = await this.page.locator('.rt-tr-group .action-buttons a').all();
    
    for (const book of bookElements) {
      const title = await book.textContent();
      if (title && title.trim().includes(bookName)) {
        return false;
      }
    }
    
    return true;
  }

  async getDisplayedBooks() {
    const books = [];
    const bookElements = await this.page.locator('.rt-tr-group .action-buttons a').all();
    
    for (const book of bookElements) {
      const title = await book.textContent();
      if (title && title.trim() !== '') {
        books.push(title.trim());
      }
    }
    
    return books;
  }
}

module.exports = ProfilePage;
