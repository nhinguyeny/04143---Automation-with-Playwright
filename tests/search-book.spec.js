const { test, expect } = require('../fixtures/test-fixtures');

test.describe('Scenario 1: Search book with multiple results', () => {
  test('should display all books matching search criteria', async ({ bookStorePage }) => {
    await test.step('Given there are books named "Learning JavaScript Design Patterns" and "Designing Evolvable Web APIs with ASP.NET"', async () => {
      await bookStorePage.navigate();
    });

    await test.step('And the user is on Book Store page', async () => {
      await expect(bookStorePage.page).toHaveURL(/.*books/);
    });

    await test.step('When the user input book name "Design" or "design"', async () => {
      await bookStorePage.searchBook('Design');
    });

    await test.step('Then all books match with input criteria will be displayed', async () => {
      const books = await bookStorePage.getDisplayedBooks();
      
      expect(books.length).toBeGreaterThan(0);
      
      const allBooksMatchCriteria = await bookStorePage.verifyBooksMatchCriteria('Design');
      expect(allBooksMatchCriteria).toBeTruthy();
      
      const expectedBooks = [
        'Learning JavaScript Design Patterns',
        'Designing Evolvable Web APIs with ASP.NET'
      ];
      
      for (const expectedBook of expectedBooks) {
        const isDisplayed = books.some(book => book.includes(expectedBook));
        expect(isDisplayed).toBeTruthy();
      }
    });
  });

  test('should display all books matching search criteria with lowercase "design"', async ({ bookStorePage }) => {
    await test.step('Given the user is on Book Store page', async () => {
      await bookStorePage.navigate();
      await expect(bookStorePage.page).toHaveURL(/.*books/);
    });

    await test.step('When the user input book name "design"', async () => {
      await bookStorePage.searchBook('design');
    });

    await test.step('Then all books match with input criteria will be displayed', async () => {
      const books = await bookStorePage.getDisplayedBooks();
      
      expect(books.length).toBeGreaterThan(0);
      
      const allBooksMatchCriteria = await bookStorePage.verifyBooksMatchCriteria('design');
      expect(allBooksMatchCriteria).toBeTruthy();
    });
  });
});
