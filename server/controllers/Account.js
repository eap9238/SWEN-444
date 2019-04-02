const models = require('../models');

const Account = models.Account;

const makerPage = (req, res) => {
  Account.AccountModel.findAllAccounts(req.session.account._type, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), account: docs });
  });
};

const homePage = (req,res) => {
  res.render('homePage', {csrfToken: req.csrfToken() })
};

const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};

const fourofourPage = (req, res) => {
  res.render('fourofour', { csrfToken: req.csrfToken() });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const homePage = (request,response) => {
  const req = request;
  const res = response;

  return res.json({ redirect: '/'})
}

const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.inputPassword}`;
  req.body.pass2 = `${req.body.inputPassword2}`;
  req.body.lang = `${req.body.language}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2 || !req.body.lang) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
      language: req.body.lang
    };

    const newAccount = new Account.AccountModel(accountData);

    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      res.json({ redirect: '/maker' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occured' });
    });
  });
};

const changeup = (request, response) => {
  const req = request;
  const res = response;

  req.body.oldPass = `${req.body.oldPass}`;
  req.body.inputPassword = `${req.body.inputPassword}`;
  req.body.inputPassword2 = `${req.body.inputPassword2}`;

  const opas = req.body.oldPass;
  const npas = req.body.inputPassword;
  const usr = req.session.account.username;

  if (!req.body.oldPass || !req.body.inputPassword || !req.body.inputPassword2) {
    return res.status(400).json({ error: 'Please fill all fields' });
  }

  if (req.body.inputPassword !== req.body.inputPassword2) {
    return res.status(400).json({ error: 'New passwords do not match!' });
  }

  Account.AccountModel.authenticate(usr, opas, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    Account.AccountModel.changePassword(usr, npas, (err2, account2) => {
      if (err2 || !account2) {
        return res.status(401).json({ error: 'Password Change Failed' });
      }

      // console.dir('Password changed');
      res.status(200).json({
        message: 'Password changed',
      });

      return res;
    });

    // console.dir('Password changed');

    res.json({ redirect: '/maker' });

    res.statusMessage = 'Password changed';
    return res;

        // res.statusMessage = "Password changed";
        // return res.status(200).json({ error: 'An error occured' });
  });

  return res;
};

/*
// setFList()
const changeFList = (request, response) => {
  const req = request;
  const res = response;
  req.body._id = `${req.body._id}`;
  req.body._oppid = `${req.body._oppid}`;
    
  // Actually getting the account
  return Account.AccountModel.findById(req.body.oppid, req.body._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    res.json({ redirect: '/maker' });

    res.statusMessage = 'Friend Added';
    return res;
  });

  return res;
};
*/

const getAccount = (request, response) => {
  const req = request;
  const res = response;
    
  const account = req.session.account;
    
  const accountData = {
    accountData: account,
  };

  res.json(accountData);
};

// get all accounts()
const getAccounts = (request, response) => {
  const req = request;
  const res = response;
    
    // Actually getting the Accounts
  return Account.AccountModel.findAllAccounts(req.session.account.type, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ accounts: docs });
  });
};

// getDomos()
const getAccountData = (request, response) => {
  const req = request;
  const res = response;
    
    // Actually getting the account
  return Account.AccountModel.findById(_id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ account: docs });
  });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};
module.exports.homePage = homePage;
module.exports.makerPage = makerPage;
module.exports.loginPage = loginPage;
module.exports.fourofour = fourofourPage;
module.exports.login = login;
module.exports.logout = logout;
//module.exports.changeFList = changeFList;
module.exports.changePassword = changeup;
module.exports.getAccount = getAccount;
module.exports.getAccounts = getAccounts;
module.exports.getAccountData = getAccountData;
module.exports.signup = signup;
module.exports.getToken = getToken;
