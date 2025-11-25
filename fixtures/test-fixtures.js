import { test as base }  from '@playwright/test';
const BookStorePage = require('../pages/BookStorePage');
const ProfilePage = require('../pages/ProfilePage');
const LoginPage = require('../pages/LoginPage');

exports.test = base.extend({
  bookStorePage: async ({ page }, use) => {
    const bookStorePage = new BookStorePage(page);
    await use(bookStorePage);
  },

  profilePage: async ({ page }, use) => {
    const profilePage = new ProfilePage(page);
    await use(profilePage);
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login('testuser', 'Test@1234');
    await use(page);
  },
});

exports.expect = base.expect;
