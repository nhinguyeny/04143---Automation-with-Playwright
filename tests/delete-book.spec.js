const { test, expect } = require('../fixtures/test-fixtures');
const AccountHelper = require('../api/helpers/account-helper');
const BookHelper = require('../api/helpers/book-helper');
const apiConfig = require('../api/config/api-config');

test.describe('Scenario 2: Delete book successfully', () => {
  test('should delete book from profile successfully', async ({ page, loginPage, profilePage }) => {
    const bookToDelete = 'Learning JavaScript Design Patterns';
    const username = apiConfig.testUser.username;
    const password = apiConfig.testUser.password;
    const bookISBN = apiConfig.bookISBNs.learningJavaScriptDesignPatterns;
    
    let accountHelper;
    let bookHelper;
    let token;
    let userId;

    await test.step('Given there is book named "Learning JavaScript Design Patterns"', async () => {
      accountHelper = new AccountHelper();
      bookHelper = new BookHelper();
      
      await accountHelper.initialize();
      await bookHelper.initialize();
      
      const loginResponse = await accountHelper.login(username, password);
      userId = loginResponse.userId;
      token = loginResponse.token;
      
      console.log('Attempting to delete all books...');
      const deleteResult = await bookHelper.deleteAllBooks(userId, token);
      console.log(`Delete all books result: ${deleteResult}`);
      
      console.log('Adding book via API...');
      await bookHelper.addBook(userId, bookISBN, token);
      
      console.log(`Book "${bookToDelete}" added successfully via API for userId: ${userId}`);
    });

    await test.step('And the user logs into application', async () => {
      await loginPage.navigate();
      await loginPage.login(username, password);
    });

    await test.step('And the user is on Profile page', async () => {
      await profilePage.navigate();
      await expect(page).toHaveURL(/.*profile/);
    });

    await test.step(`When the user search book "${bookToDelete}"`, async () => {
      await profilePage.searchBook(bookToDelete);
    });

    await test.step('And the user clicks on Delete icon', async () => {
      await profilePage.clickFirstDeleteIcon();
    });

    await test.step('And the user clicks on OK button', async () => {
      await profilePage.clickModalOkButton();
    });

    await test.step('And the user clicks on OK button of alert "Book deleted."', async () => {
      page.on('dialog', async dialog => {
        expect(dialog.message()).toContain('Book deleted');
        await dialog.accept();
      });
      
      await profilePage.clickAlertOkButton();
    });

    await test.step('And the book is not shown', async () => {
      const isBookNotShown = await profilePage.isBookNotShown(bookToDelete);
      expect(isBookNotShown).toBeTruthy();
    });

    await accountHelper.dispose();
    await bookHelper.dispose();
  });
});
