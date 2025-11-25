class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#userName');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('#login');
  }

  async navigate() {
    await this.page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await this.page.waitForSelector('#userName', { timeout: 30000 });
  }

  async login(username, password) {
    await this.usernameInput.waitFor({ state: 'visible', timeout: 10000 });
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForSelector('#userName-label')
    //await this.page.waitForURL(/.*profile/, { timeout: 30000 });
  }
}

module.exports = LoginPage;
