const { request } = require('@playwright/test');

class AccountHelper {
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

  async generateToken(username, password) {
    const response = await this.apiContext.post('/Account/v1/GenerateToken', {
      data: {
        userName: username,
        password: password,
      },
    });

    const responseBody = await response.json();
    
    if (response.ok() && responseBody.status === 'Success') {
      return responseBody.token;
    }
    
    throw new Error(`Failed to generate token: ${responseBody.message || 'Unknown error'}`);
  }

  async createUser(username, password) {
    const response = await this.apiContext.post('/Account/v1/User', {
      data: {
        userName: username,
        password: password,
      },
    });

    const responseBody = await response.json();
    
    if (response.ok()) {
      return responseBody;
    }
    
    throw new Error(`Failed to create user: ${responseBody.message || 'Unknown error'}`);
  }

  async login(username, password) {
    const response = await this.apiContext.post('/Account/v1/Login', {
      data: {
        userName: username,
        password: password,
      },
    });

    const responseBody = await response.json();
    
    if (response.ok()) {
      return responseBody;
    }
    
    throw new Error(`Failed to login: ${responseBody.message || 'Unknown error'}`);
  }

  async authorizeUser(username, password) {
    const response = await this.apiContext.post('/Account/v1/Authorized', {
      data: {
        userName: username,
        password: password,
      },
    });

    return response.ok();
  }

  async getUserDetails(userId, token) {
    const response = await this.apiContext.get(`/Account/v1/User/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok()) {
      return await response.json();
    }
    
    throw new Error('Failed to get user details');
  }

  async deleteUser(userId, token) {
    const response = await this.apiContext.delete(`/Account/v1/User/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.ok();
  }

  async dispose() {
    if (this.apiContext) {
      await this.apiContext.dispose();
    }
  }
}

module.exports = AccountHelper;
