const controllers = require('./controllers');
const mid = require('./middleware');
// const bund = require('./../hosted/bundle.js');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getDomos', mid.requiresLogin, controllers.Domo.getDomos);
  app.get('/getDomosByOwner', mid.requiresLogin, controllers.Domo.getDomosByOwner);
  app.get('/getAccounts', mid.requiresLogin, controllers.Account.getAccounts);
  app.get('/getFriends', mid.requiresLogin, controllers.Account.getFriends);
  app.get('/getAccount', mid.requiresLogin, controllers.Account.getAccount);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.post('/changePassword', mid.requiresLogin, controllers.Account.changePassword);
  //app.post('/changeFList', mid.requiresLogin, controllers.Account.changeFList);
  app.get('/changePassword', mid.requiresLogin, controllers.Domo.makerPage);
  app.get('/addFriends', mid.requiresLogin, controllers.Domo.makerPage);
  app.get('/myAccount', mid.requiresLogin, controllers.Domo.makerPage);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Domo.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Domo.make);
  app.delete('/deleteDomo', mid.requiresLogin, controllers.Domo.deleteDomo);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/*', function(req, res) {
    res.sendFile(__dirname + "/404.html");
  });
};

module.exports = router;
