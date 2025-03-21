"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var handleDomo = function handleDomo(e) {
  e.preventDefault();

  $("#domoMessage").animate({ width: 'hide' }, 350);

  if ($("#domoTitle").val() == '' || $("#domoBody").val() == '') {
    handleError("Please select options for all fields");
    return false;
  }

  document.getElementById("domoForm").style.display = "none";

  sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function () {
    loadDomosFromServer($("#token").val());
  });

  return false;
};

var showModal = function showModal(e) {
  //e.preventDefault();
  console.log("Yo");
  //document.getElementById("domoForm").style.display = "block";
};

var hideModal = function hideModal(e) {
  e.preventDefault();

  document.getElementById("domoForm").style.display = "none";
};

var handleDelete = function handleDelete(e) {
  e.preventDefault();

  $("#domoMessage").animate({ width: 'hide' }, 350);

  sendAjax('DELETE', $("#" + e.target.id).attr("action"), $("#" + e.target.id).serialize(), function () {
    loadDomosFromServer($("token").val());
  });
};

var handleReport = function handleReport(e) {
  e.preventDefault();

  $("#domoMessage").animate({ width: 'hide' }, 350);

  //MARK PUT CODE TO ACTIVATE ON REPORT HERE
  //DATA CAN BE FETCHED FROM SOURCE USING {e.target}

  console.log("Post Reported");
};

var handleFriend = function handleFriend(e) {
  e.preventDefault();

  $("#domoMessage").animate({ width: 'hide' }, 350);

  console.log(e.target.id);

  sendAjax('GET', $("#" + e.target.id).attr("action"), e.target.id, function (data) {
    ReactDOM.render(React.createElement(ServerDomoList, { domos: data.domos, csrf: $("token").val() }), document.querySelector("#domoList"));
  });
};

var handleId = function handleId(e) {
  e.preventDefault();

  $("#domoMessage").animate({ width: 'hide' }, 350);

  sendAjax('LOAD', $("#" + e.target.id).attr("action"), $("#" + e.target.id).serialize(), function () {
    loadDomosFromServer($("token").val());
  });
};

var DomoForm = function DomoForm(props) {
  document.getElementById("modal").onclick = function () {
    document.getElementById("domoForm").style.display = "block";
  };

  return React.createElement(
    "form",
    { id: "domoForm", onSubmit: handleDomo, name: "domoForm", action: "/maker", method: "POST", className: "domoForm" },
    React.createElement(
      "div",
      { className: "DomoFormObject" },
      React.createElement(
        "label",
        { htmlFor: "title" },
        "Title: "
      ),
      React.createElement("br", null),
      React.createElement("input", { id: "domoTitle", type: "text", name: "title", placeholder: "Note Title" }),
      React.createElement("br", null),
      React.createElement("br", null),
      React.createElement(
        "label",
        { htmlFor: "body" },
        "Contents: "
      ),
      React.createElement("br", null),
      React.createElement("textarea", { id: "domoBody", name: "body", cols: "27", wrap: "hard", placeholder: "Note Contents" }),
      React.createElement("input", { type: "hidden", id: "token", name: "_csrf", value: props.csrf }),
      React.createElement("br", null),
      React.createElement("br", null),
      React.createElement("input", { className: "makeDomoSubmit", type: "submit", value: "Post" }),
      React.createElement("input", { className: "makeDomoSubmit", onClick: hideModal, type: "button", value: "Exit" })
    )
  );
};

var ServerDomoList = function ServerDomoList(props) {
  document.getElementById("cPassButton").style.display = "none";

  if (props.domos.length === 0) {
    return React.createElement(
      "div",
      { className: "domoList" },
      React.createElement(
        "h3",
        { className: "emptyDomo" },
        React.createElement("br", null),
        React.createElement("br", null),
        React.createElement("br", null)
      )
    );
  }

  var serverDomoNodes = props.domos.map(function (domo) {
    return React.createElement(
      "div",
      { key: domo._id, className: "blue" },
      React.createElement(
        "h3",
        { className: "domoTitle" },
        domo.title
      ),
      React.createElement(
        "h4",
        { className: "domoDate" },
        "Created: ",
        React.createElement("br", null),
        " ",
        domo.date,
        "  "
      ),
      React.createElement(
        "div",
        { className: "domoBody" },
        domo.body
      ),
      React.createElement(
        "form",
        { id: domo._id,
          onSubmit: handleReport,
          name: "reportDomo",
          action: "/reportDomo",
          method: "POST"
        },
        React.createElement("input", { type: "hidden", name: "_id", value: domo._id }),
        React.createElement("input", { type: "hidden", id: "token", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeDomoReport", type: "submit", value: "Report" })
      )
    );
  });

  //console.log(props.domos);
  //console.log(props.domo);
  //console.log(props.domoNodes);

  return React.createElement(
    "div",
    { className: "domoList" },
    serverDomoNodes
  );
};

var DomoList = function DomoList(props) {
  document.getElementById("cPassButton").style.display = "none";

  if (props.domos.length === 0) {
    return React.createElement(
      "div",
      { className: "domoList" },
      React.createElement(
        "h3",
        { className: "emptyDomo" },
        React.createElement("br", null),
        React.createElement("br", null),
        React.createElement("br", null)
      )
    );
  }

  var domoNodes = props.domos.map(function (domo) {
    return React.createElement(
      "div",
      { key: domo._id, className: "blue" },
      React.createElement(
        "h3",
        { className: "domoTitle" },
        domo.title
      ),
      React.createElement(
        "h4",
        { className: "domoDate" },
        "Created: ",
        React.createElement("br", null),
        " ",
        domo.date,
        "  "
      ),
      React.createElement(
        "div",
        { className: "domoBody" },
        domo.body
      ),
      React.createElement(
        "form",
        { id: domo._id,
          onSubmit: handleDelete,
          name: "deleteDomo",
          action: "/deleteDomo",
          method: "DELETE"
        },
        React.createElement("input", { type: "hidden", name: "_id", value: domo._id }),
        React.createElement("input", { type: "hidden", id: "token", name: "_csrf", value: props.csrf }),
        React.createElement("input", { className: "makeDomoDelete", type: "submit", value: "X" })
      )
    );
  });

  //console.log(props.domos);
  //console.log(props.domo);
  //console.log(props.domoNodes);

  return React.createElement(
    "div",
    { className: "domoList" },
    domoNodes
  );
};

var AccountList = function AccountList(props) {

  if (props.accounts.length === 0) {
    return React.createElement(
      "div",
      { className: "accountList" },
      React.createElement(
        "h3",
        { className: "emptyAccount" },
        React.createElement("br", null),
        React.createElement("br", null),
        React.createElement("br", null)
      )
    );
  }

  var accountNodes = props.accounts.map(function (account) {
    return React.createElement(
      "div",
      { key: account._id, className: "blue" },
      React.createElement(
        "h3",
        { className: "accountTitle" },
        account.username
      ),
      React.createElement("input", { type: "hidden", name: "_id", id: "_id", value: account._id }),
      React.createElement("input", { type: "hidden", id: "token", name: "_csrf", value: props.csrf })
    );
  });

  return React.createElement(
    "div",
    { className: "accountList" },
    accountNodes
  );
};

var FriendList = function FriendList(props) {

  if (props.friends.length === 0) {
    return React.createElement(
      "div",
      { className: "friendList" },
      React.createElement(
        "h3",
        { className: "emptyFriend" },
        React.createElement("br", null),
        React.createElement("br", null),
        React.createElement("br", null)
      )
    );
  }

  var friendNodes = props.friends.map(function (friend) {
    var loadFriend = function loadFriend(e) {
      var id = e.target.id;

      console.log(id);

      sendAjax('GET', '/getDomosByOwner', id, function (data) {
        ReactDOM.render(React.createElement(DomoList, { domos: data.domos, csrf: props.csrf }), document.querySelector("#domoList"));
      });
    };

    return React.createElement(
      "form",
      { key: friend._id, id: friend._id,
        onSubmit: handleFriend,
        name: "getDomosByOwner",
        action: "/getDomosByOwner",
        method: "GET"
      },
      React.createElement("input", { type: "hidden", name: "_id", value: friend._id }),
      React.createElement("input", { type: "hidden", id: "token", name: "_csrf", value: props.csrf }),
      React.createElement("input", { className: "blue", type: "submit", value: friend.username })
    );
  });

  return React.createElement(
    "div",
    { className: "friendList" },
    friendNodes
  );
};

// CPassWindow()
var ChangePasswordWindow = function ChangePasswordWindow(props) {
  document.getElementById("mAccount").style.display = "block";
  document.getElementById("cPassButton").style.display = "none";
  document.getElementById("friends").style.display = "none";
  document.getElementById("content").style.display = "block";
  document.getElementById("domos").style.display = "none";
  document.getElementById("modal").style.display = "none";

  return React.createElement(
    "div",
    { className: "text-center", id: "bodyContainer" },
    React.createElement(
      "form",
      { className: "form-cPass mainForm",
        id: "cPassForm",
        name: "cPassForm",
        onSubmit: handleCPass,
        action: "/changePassword",
        method: "POST"
      },
      React.createElement("img", { className: "mb-4", src: "/assets/img/face.png", alt: "", width: "146", height: "146" }),
      React.createElement("br", null),
      React.createElement(
        "h1",
        { className: "h3 mb-3 font-weight-normal" },
        "Fill in old and new passwords"
      ),
      React.createElement("br", null),
      React.createElement(
        "label",
        { htmlFor: "oldPass", className: "sr-only" },
        "Old Password"
      ),
      React.createElement("input", { id: "oldPass", type: "password", name: "oldPass", className: "form-control", required: true, autofocus: true, placeholder: "Old Password" }),
      React.createElement(
        "label",
        { htmlFor: "inputPassword", className: "sr-only" },
        "Password"
      ),
      React.createElement("input", { id: "inputPassword", name: "inputPassword", type: "password", className: "form-control", required: true, placeholder: "Password" }),
      React.createElement(
        "label",
        { htmlFor: "inputPassword2", className: "sr-only" },
        "Password"
      ),
      React.createElement("input", { id: "inputPassword2", name: "inputPassword2", type: "password", className: "form-control", required: true, placeholder: "retype password" }),
      React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
      React.createElement("br", null),
      React.createElement(
        "button",
        _defineProperty({ className: "formSubmit btn btn-lg btn-primary btn-block", type: "submit" }, "type", "submit"),
        "Change Password"
      )
    )
  );
};

// My Account Window()
var MyAccountWindow = function MyAccountWindow(props) {
  document.getElementById("cPassButton").style.display = "block";
  document.getElementById("mAccount").style.display = "none";
  document.getElementById("content").style.display = "block";
  document.getElementById("friends").style.display = "none";
  document.getElementById("domos").style.display = "none";
  document.getElementById("modal").style.display = "none";

  return React.createElement("div", { id: "tContainer" });
};

// handleSignup()
var handleCPass = function handleCPass(e) {
  // Preventing default redirect behavior + hiding the Domo error
  e.preventDefault();
  $('#domoMessage').animate({ width: 'hide' }, 350);

  // IF not all of the fields are filled in...
  if ($('#oldPass').val() == '' || $('#inputPassword').val() == '' || $('#inputPassword2').val() == '') {
    handleError("Please select options for all fields");
    return false;
  }

  // IF both password fields are not the same...
  if ($('#inputPassword').val() !== $('#inputPassword2').val()) {
    handleError("New passwords do not match");
    return false;
  }

  // 
  sendAjax('POST', $('#cPassForm').attr('action'), $('#cPassForm').serialize(), redirect);

  return false;
};

//add a name to friends list
var changeFList = function changeFList(e) {
  // Preventing default redirect behavior + hiding the Domo error
  e.preventDefault();
  $('#domoMessage').animate({ width: 'hide' }, 350);

  sendAjax('POST', $('#fListForm').attr('action'), $('#fListForm').serialize(), redirect);

  return false;
};

// createChangePasswordWindow()
var createCPassWindow = function createCPassWindow(csrf) {
  ReactDOM.render(React.createElement(ChangePasswordWindow, { csrf: csrf }), document.querySelector('#content'));
};

// createMyAccountWindow()
var createMyAccount = function createMyAccount(csrf) {
  ReactDOM.render(React.createElement(MyAccountWindow, { csrf: csrf }), document.querySelector('#content'));
};

// createFriendsPage()
var createFriendsPage = function createFriendsPage(csrf) {
  document.getElementById("cPassButton").style.display = "none";
  document.getElementById("mAccount").style.display = "block";
  document.getElementById("content").style.display = "none";
  document.getElementById("friends").style.display = "block";
  document.getElementById("domos").style.display = "block";
  document.getElementById("modal").style.display = "none";

  ReactDOM.render(React.createElement(AccountList, { accounts: [], csrf: csrf }), document.querySelector("#domoList"));

  //loadAccountsFromServer(csrf);
};

var DomoCount = function DomoCount(props) {
  return React.createElement(
    "a",
    { href: "/maker" },
    "Posts: ",
    props.domos.length
  );
};

var CopyRight = function CopyRight(props) {
  return React.createElement(
    "div",
    null,
    "Post \xA9 ",
    new Date().getFullYear()
  );
};

var NoteCount = function NoteCount(props) {
  /*
  console.log(props.account.getAll);
  console.log(props.account.getAccounts);
  console.log(props.account.getAccount);
  console.log(props.account.accounts);
  
  console.log(props.account.accountData);
  console.log(props.account);
  console.log(props.account.Account);
  */

  return React.createElement(
    "div",
    { className: "fullsize" },
    React.createElement(
      "table",
      null,
      React.createElement(
        "tr",
        null,
        React.createElement(
          "td",
          { className: "tLeft" },
          "Account Name"
        ),
        React.createElement(
          "td",
          { className: "tRight" },
          props.account.accountData.username
        )
      ),
      React.createElement(
        "tr",
        null,
        React.createElement(
          "td",
          { className: "tLeft" },
          "Account Status"
        ),
        React.createElement(
          "td",
          { className: "tRight" },
          props.account.accountData.type
        )
      ),
      React.createElement(
        "tr",
        null,
        React.createElement(
          "td",
          { className: "tLeft" },
          "Account Created"
        ),
        React.createElement(
          "td",
          { className: "tRight" },
          props.account.accountData.createdDate.substring(0, 10)
        )
      ),
      React.createElement(
        "tr",
        null,
        React.createElement(
          "td",
          { className: "tLeft" },
          "Post Count"
        ),
        React.createElement(
          "td",
          { className: "tRight" },
          props.domos.domos.length
        )
      ),
      React.createElement(
        "tr",
        null,
        React.createElement(
          "td",
          { className: "tLeft" },
          "Language"
        ),
        React.createElement(
          "td",
          { className: "tRight" },
          props.account.accountData.language
        )
      ),
      React.createElement(
        "tr",
        null,
        React.createElement(
          "td",
          { className: "tLeft" },
          "Friends Count"
        ),
        React.createElement(
          "td",
          { className: "tRight" },
          props.account.accountData.friends.length
        )
      )
    ),
    React.createElement(
      "button",
      { className: "tBtn", disabled: true },
      "Upgrade Account"
    )
  );
};

var loadDomosFromServer = function loadDomosFromServer(csrf) {
  sendAjax('GET', '/getAccount', null, function (acc) {
    sendAjax('GET', '/getDomos', acc._id, function (data) {
      ReactDOM.render(React.createElement(DomoList, { domos: data.domos, csrf: csrf }), document.querySelector("#domoList"));
    });
  });
};

var loadAccountsFromServer = function loadAccountsFromServer(csrf) {
  sendAjax('GET', '/getAccounts', null, function (data) {
    ReactDOM.render(React.createElement(AccountList, { accounts: data.accounts, csrf: csrf }), document.querySelector("#domoList"));
  });
};

var loadFriendsFromServer = function loadFriendsFromServer(csrf) {
  sendAjax('GET', '/getFriends', null, function (data) {
    ReactDOM.render(React.createElement(FriendList, { friends: data.friends, csrf: csrf }), document.querySelector("#friendList"));
  });
};

var setup = function setup(csrf) {
  var cPassWindow = document.querySelector('#cPassButton');
  var mAccountWindow = document.querySelector('#mAccount');
  var aFriendsWindow = document.querySelector('#addFriends');

  cPassWindow.addEventListener('click', function (e) {
    e.preventDefault();
    createCPassWindow(csrf);
    return false;
  });

  mAccountWindow.addEventListener('click', function (e) {
    e.preventDefault();
    createMyAccount(csrf);

    sendAjax('GET', '/getAccount', null, function (acc) {
      console.log(acc);

      sendAjax('GET', '/getDomos', null, function (data) {
        ReactDOM.render(React.createElement(NoteCount, { domos: data, account: acc, csrf: csrf }), document.querySelector("#tContainer"));
      });
    });

    sendAjax('GET', '/getAccounts', null, function (accs) {
      console.log(accs);
    });

    return false;
  });

  aFriendsWindow.addEventListener('click', function (e) {
    e.preventDefault();
    createFriendsPage(csrf);

    sendAjax('GET', '/getAccounts', null, function (data) {
      ReactDOM.render(React.createElement(AccountList, { accounts: data.accounts, csrf: csrf }), document.querySelector("#domoList"));
    });

    return false;
  });

  ReactDOM.render(React.createElement(DomoForm, { csrf: csrf }), document.querySelector("#makeDomo"));

  ReactDOM.render(React.createElement(DomoList, { domos: [], csrf: csrf }), document.querySelector("#domoList"));

  ReactDOM.render(React.createElement(FriendList, { friends: [], csrf: csrf }), document.querySelector("#friendList"));

  ReactDOM.render(React.createElement(CopyRight, { csrf: csrf }), document.querySelector("#copyright"));

  loadDomosFromServer(csrf);
  loadFriendsFromServer(csrf);
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
'use strict';

// handleError()
var handleError = function handleError(msg) {
  /*
  $('#errorMessage').text(msg);
  $('#domoMessage').animate({ width: 'toggle' }, 350);
  */

  window.alert(msg);
};

// redirect()
var redirect = function redirect(response) {
  $('#domoMessage').animate({ width: 'hide' }, 350);
  window.location = response.redirect;
};

// sendAjax()
var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: 'json',
    success: success,
    error: function error(xhr, status, _error) {
      console.log(xhr.responseText);
      var msgObj = JSON.parse(xhr.responseText);
      handleError(msgObj.error);
    }
  });
};
