const apiConfig = {
  baseURL: 'https://demoqa.com',
  endpoints: {
    account: {
      generateToken: '/Account/v1/GenerateToken',
      createUser: '/Account/v1/User',
      userLogin: '/Account/v1/Login',
      user: '/Account/v1/User',
    },
    bookStore: {
      books: '/BookStore/v1/Books',
      book: '/BookStore/v1/Book',
    },
  },
  testUser: {
    username: 'testuser',
    password: 'Test@123',
    userId: '',
  },
  bookISBNs: {
    learningJavaScriptDesignPatterns: '9781449331818',
    designingEvolvableWebAPIs: '9781449337711',
    speakingJavaScript: '9781449365035',
    youDontKnowJS: '9781491904244',
    programJavaScriptApplications: '9781491950296',
    eloquentJavaScript: '9781593275846',
    understandingECMAScript6: '9781593277574',
    gitPocketGuide: '9781449325862',
  },
};

module.exports = apiConfig;
