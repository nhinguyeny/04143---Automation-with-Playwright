const { chromium, firefox, webkit } = require('@playwright/test');

class BrowserManagement {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
  }

  async launchBrowser(browserType = 'chromium', options = {}) {
    const defaultOptions = {
      headless: false,
      slowMo: 0,
      ...options
    };

    switch (browserType.toLowerCase()) {
      case 'chromium':
        this.browser = await chromium.launch(defaultOptions);
        break;
      case 'firefox':
        this.browser = await firefox.launch(defaultOptions);
        break;
      case 'webkit':
        this.browser = await webkit.launch(defaultOptions);
        break;
      default:
        throw new Error(`Unsupported browser type: ${browserType}`);
    }

    return this.browser;
  }

  async createContext(options = {}) {
    if (!this.browser) {
      throw new Error('Browser not launched. Call launchBrowser() first.');
    }

    const defaultOptions = {
      viewport: { width: 1920, height: 1080 },
      ...options
    };

    this.context = await this.browser.newContext(defaultOptions);
    return this.context;
  }

  async createPage() {
    if (!this.context) {
      throw new Error('Context not created. Call createContext() first.');
    }

    this.page = await this.context.newPage();
    return this.page;
  }

  async closeBrowser() {
    if (this.context) {
      await this.context.close();
    }
    if (this.browser) {
      await this.browser.close();
    }
  }

  async clearCookies() {
    if (this.context) {
      await this.context.clearCookies();
    }
  }

  async clearStorage() {
    if (this.context) {
      await this.context.clearPermissions();
      await this.context.storageState();
    }
  }
}

module.exports = BrowserManagement;
