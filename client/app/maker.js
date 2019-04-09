const handleDomo = (e) => {
  e.preventDefault();

  $("#domoMessage").animate({width:'hide'},350);

  if($("#domoTitle").val() == '' || $("#domoBody").val() == '') {
    handleError("Please select options for all fields");
    return false;
  }

  document.getElementById("domoForm").style.display = "none";
    
  sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
    loadDomosFromServer($("#token").val());
  });

  return false;
};

const hideModal = (e) => {
  e.preventDefault();
    
  document.getElementById("domoForm").style.display = "none";
};

const hideReport = (e) => {
  e.preventDefault();
    
  document.getElementById("reportForm").style.display = "none";
};

const handleDelete = (e) => {
  e.preventDefault();
    
  $("#domoMessage").animate({width:'hide'}, 350);
    
  sendAjax('DELETE', $("#" + e.target.id).attr("action"), $("#" + e.target.id).serialize(), function(){
    loadDomosFromServer($("token").val());
  });
};

const handleReport = (e) => {
  e.preventDefault();
    
  $("#domoMessage").animate({width:'hide'}, 350);  
	
  document.getElementById("domoForm").style.display = "none";
  document.getElementById("makeDomo").style.display = "none";
  document.getElementById("reportDomo").style.display = "block";
  document.getElementById("reportForm").style.display = "block";
   
  ReactDOM.render(
    <ReportForm csrf={$("token").val()} />, document.querySelector("#reportDomo")
  );
	
  console.log("Post Reported");
};

const handleFriend = (e) => {
  e.preventDefault();
	
  document.getElementById("mAccount").style.display = "block";
  document.getElementById("cPassButton").style.display = "none";
  document.getElementById("friends").style.display = "block";
  document.getElementById("content").style.display = "none";
  document.getElementById("domos").style.display = "block";
  document.getElementById("modal").style.display = "none";
    
  $("#domoMessage").animate({width:'hide'}, 350);
    
  //console.log(e.target.id);
	
  sendAjax('GET', $("#" + e.target.id).attr("action"), e.target.id, (data) => {	  
	ReactDOM.render(
		<ServerDomoList domos={data.domos} csrf={$("token").val()}/>, document.querySelector("#domoList")
	);
  });
};

const handleId = (e) => {
  e.preventDefault();
    
  $("#domoMessage").animate({width:'hide'}, 350);
    
  sendAjax('LOAD', $("#" + e.target.id).attr("action"), $("#" + e.target.id).serialize(), function(){
    loadDomosFromServer($("token").val());
  });
};

const DomoForm = (props) => {    
  document.getElementById("modal").onclick = function() {
      document.getElementById("domoForm").style.display = "block";
      document.getElementById("makeDomo").style.display = "block";
      document.getElementById("reportDomo").style.display = "none";
  	  document.getElementById("reportForm").style.display = "none";
	  
	  ReactDOM.render(
		<DomoForm csrf={$("token").val()} />, document.querySelector("#makeDomo")
	  );
  };
    
  return (
    <form id="domoForm" onSubmit={handleDomo} name="domoForm" action="/maker" method="POST" className="domoForm">
        <div className="DomoFormObject"> 
            <label htmlFor="title">Title: </label>
            <br/>
            <input id="domoTitle" type="text" name="title" placeholder="Note Title"/>
      
            <br/>
            <br/>
      
            <label htmlFor="body">Contents: </label>
            <br/>
            <textarea id="domoBody" name="body" cols="27" wrap="hard" placeholder="Note Contents"/>

            <input type="hidden" id="token" name="_csrf" value={props.csrf}/>
      
            <br/>
            <br/>
      
            <input className="makeDomoSubmit" type="submit" value="Post"/>
            <input className="makeDomoSubmit" onClick={hideModal} type="button" value="Exit"/>
        </div>
    </form>
  );
};

const ReportForm = (props) => {    
  document.getElementById("modal").onclick = function() {
      document.getElementById("domoForm").style.display = "block";
      document.getElementById("makeDomo").style.display = "block";
      document.getElementById("reportDomo").style.display = "none";
	  
	  ReactDOM.render(
		<DomoForm csrf={$("token").val()} />, document.querySelector("#makeDomo")
	  );
  };

  return (
    <form id="reportForm" name="reportForm" className="reportForm">
        <div className="ReportFormObject"> 
            <textarea id="domoBody" name="body" cols="27" wrap="hard" placeholder="Reason for report:"/>

            <input type="hidden" id="token" name="_csrf" value={props.csrf}/>
      
            <br/>
            <br/>
      
            <input className="makeDomoSubmit" onClick={hideReport} value="Submit"/>
            <input className="makeDomoSubmit" onClick={hideReport} type="button" value="Exit"/>
        </div>
    </form>
  );
};

const ServerDomoList = function(props) { 
  document.getElementById("cPassButton").style.display = "none";
    
  if(props.domos.length === 0) {
    return (
      <div className="domoList">
        <h3 className="emptyDomo">
        <br/>
        <br/>
        <br/>
        </h3>
      </div>
    );
  }

  const serverDomoNodes = props.domos.map(function(domo) {
        return (
          <div key={domo._id} className="blue">
            <h3 className="domoTitle">{domo.title}</h3>
            <h4 className="domoDate">Created: <br/> {domo.date}  </h4>
            <div className="domoBody">{domo.body}</div>
            <form id={domo._id}
                  onSubmit={handleReport}
                  name="reportDomo"
                  action="/reportDomo"
                  method="POST"
            >
                <input type="hidden" name="_id" value={domo._id}/>
                <input type="hidden" id="token" name="_csrf" value={props.csrf}/>
                <input className="makeDomoReport" type="submit" value="Report"/>
            </form>
          </div>
        );
  });

    //console.log(props.domos);
    //console.log(props.domo);
    //console.log(props.domoNodes);
    
  return (
    <div className="domoList">
      {serverDomoNodes}
    </div>
  );
};

const DomoList = function(props) { 
  document.getElementById("cPassButton").style.display = "none";
    
  if(props.domos.length === 0) {
    return (
      <div className="domoList">
        <h3 className="emptyDomo">
        <br/>
        <br/>
        <br/>
        </h3>
      </div>
    );
  }

  const domoNodes = props.domos.map(function(domo) {
        return (
          <div key={domo._id} className="blue">
            <h3 className="domoTitle">{domo.title}</h3>
            <h4 className="domoDate">Created: <br/> {domo.date}  </h4>
            <div className="domoBody">{domo.body}</div>
            <form id={domo._id}
                  onSubmit={handleDelete}
                  name="deleteDomo"
                  action="/deleteDomo"
                  method="DELETE"
            >
                <input type="hidden" name="_id" value={domo._id}/>
                <input type="hidden" id="token" name="_csrf" value={props.csrf}/>
                <input className="makeDomoDelete" type="submit" value="X"/>
            </form>
          </div>
        );
  });

    //console.log(props.domos);
    //console.log(props.domo);
    //console.log(props.domoNodes);
    
  return (
    <div className="domoList">
      {domoNodes}
    </div>
  );
};

const AccountList = function(props) { 
    
  if(props.accounts.length === 0) {
    return (
      <div className="accountList">
        <h3 className="emptyAccount">
        <br/>
        <br/>
        <br/>
        </h3>
      </div>
    );
  }

  const accountNodes = props.accounts.map(function(account) {
        return (
          <div key={account._id} className="blue">
            <h3 className="accountTitle">{account.username}</h3>
                <input type='hidden' name='_id' id="_id" value={account._id} />
            <input type="hidden" id="token" name="_csrf" value={props.csrf}/>
          </div>
        );
  });
    
  return (
    <div className="accountList">
      {accountNodes}
    </div>
  );
};

const FriendList = function(props) { 
    
  if(props.friends.length === 0) {
    return (
      <div className="friendList">
        <h3 className="emptyFriend">
        <br/>
        <br/>
        <br/>
        </h3>
      </div>
    );
  }
	
  const friendNodes = props.friends.map(function(friend) {
		const loadFriend = (e) => {
			const {id} = e.target;
			//console.log(id);
			
			sendAjax('GET', '/getDomosByOwner', id, (data) => {
				ReactDOM.render(
				  <DomoList domos={data.domos} csrf={props.csrf}/>, document.querySelector("#domoList")
				);
			});
		}
		
        return (
            <form key={friend._id} id={friend._id}
                  onSubmit={handleFriend}
                  name="getDomosByOwner"
                  action="/getDomosByOwner"
                  method="GET"
            >
                <input type="hidden" name="_id" value={friend._id}/>
                <input type="hidden" id="token" name="_csrf" value={props.csrf}/>
                <input className="blue" type="submit" value={friend.username}/>
            </form>
        );
  });
    
  return (
    <div className="friendList">
      {friendNodes}
    </div>
  );
};

// CPassWindow()
const ChangePasswordWindow = (props) => {
  document.getElementById("mAccount").style.display = "block";
  document.getElementById("cPassButton").style.display = "none";
  document.getElementById("friends").style.display = "none";
  document.getElementById("content").style.display = "block";
  document.getElementById("domos").style.display = "none";
  document.getElementById("modal").style.display = "none";
    
  return (
      <div className="text-center" id="bodyContainer">
        <form   className="form-cPass mainForm"
                id='cPassForm'
                name='cPassForm'
                onSubmit={handleCPass}
                action='/changePassword'
                method='POST'
         >

            <img className="mb-4" src="/assets/img/face.png" alt="" width="146" height="146"/>
      
            <br/>
      
            <h1 className="h3 mb-3 font-weight-normal">Fill in old and new passwords</h1>
      
            <br/>

            <label htmlFor="oldPass" className="sr-only">Old Password</label>
            <input id="oldPass" type="password" name='oldPass' className="form-control" required autofocus placeholder="Old Password"/>
            <label htmlFor="inputPassword" className="sr-only">Password</label>
            <input id="inputPassword" name='inputPassword' type="password" className="form-control" required placeholder="Password"/>
            <label htmlFor='inputPassword2' className="sr-only">Password</label>
            <input id='inputPassword2' name='inputPassword2' type='password'  className="form-control" required placeholder='retype password'/>

            <input type='hidden' name='_csrf' value={props.csrf} />
      
            <br/>

            <button className='formSubmit btn btn-lg btn-primary btn-block' type='submit' type="submit">Change Password</button>
        </form>
    </div>
  );
};

// My Account Window()
const MyAccountWindow = (props) => {
  document.getElementById("cPassButton").style.display = "block";
  document.getElementById("mAccount").style.display = "none";
  document.getElementById("content").style.display = "block";
  document.getElementById("friends").style.display = "none";
  document.getElementById("domos").style.display = "none";
  document.getElementById("modal").style.display = "none";
    
  return (
      <div id="tContainer">
    </div>
  );
};

// handleSignup()
const handleCPass = (e) => {
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
const changeFList = (e) => {
  // Preventing default redirect behavior + hiding the Domo error
  e.preventDefault();
  $('#domoMessage').animate({ width: 'hide' }, 350);
  
  sendAjax('POST', $('#fListForm').attr('action'), $('#fListForm').serialize(), redirect);
  
  return false;
};

// createChangePasswordWindow()
const createCPassWindow = (csrf) => {
  ReactDOM.render(
    <ChangePasswordWindow csrf={csrf} />,
    document.querySelector('#content')
  );
};

// createMyAccountWindow()
const createMyAccount = (csrf) => {
  ReactDOM.render(
    <MyAccountWindow csrf={csrf} />,
    document.querySelector('#content')
  );
};

// createFriendsPage()
const createFriendsPage = (csrf) => {
  document.getElementById("cPassButton").style.display = "none";
  document.getElementById("mAccount").style.display = "block";
  document.getElementById("content").style.display = "none";
  document.getElementById("friends").style.display = "block";    
  document.getElementById("domos").style.display = "block";
  document.getElementById("modal").style.display = "none";
    
  ReactDOM.render(
    <AccountList accounts={[]} csrf={csrf}/>, 
    document.querySelector("#domoList")
  );
    
  //loadAccountsFromServer(csrf);
};

const DomoCount = function(props) {
    return (
        <a href="/maker">Posts: {props.domos.length}</a>
    );
};

const NoteCount = function(props) {
    /*
	console.log(props.account.getAll);
	console.log(props.account.getAccounts);
	console.log(props.account.getAccount);
	console.log(props.account.accounts);
    
    console.log(props.account.accountData);
    console.log(props.account);
    console.log(props.account.Account);
	*/
    
    return (
        <div className="fullsize">
            <table>
                <tr>
                    <td className="tLeft">Account Name</td>
                    <td className="tRight">{props.account.accountData.username}</td> 
                </tr>
                <tr>
                    <td className="tLeft">Account Status</td>
                    <td className="tRight">{props.account.accountData.type}</td> 
                </tr>
                <tr>
                    <td className="tLeft">Account Created</td>
                    <td className="tRight">{props.account.accountData.createdDate.substring(0, 10)}</td> 
                </tr>
                <tr>
                    <td className="tLeft">Post Count</td>
                    <td className="tRight">{props.domos.domos.length}</td> 
                </tr>
                <tr>
                    <td className="tLeft">Language</td>
                    <td className="tRight">{props.account.accountData.language}</td> 
                </tr>
                <tr>
                    <td className="tLeft">Friends Count</td>
                    <td className="tRight">{props.account.accountData.friends.length}</td> 
                </tr>
            </table>
            <button className="tBtn" disabled>Upgrade Account</button>
        </div>
    );
};

const loadDomosFromServer = (csrf) => {
	sendAjax('GET', '/getAccount', null, (acc) => {
		sendAjax('GET', '/getDomos', acc._id, (data) => {
			ReactDOM.render(
				<DomoList domos={data.domos} csrf={csrf}/>, document.querySelector("#domoList")
			);
		});
    });
};

const loadAccountsFromServer = (csrf) => {
  sendAjax('GET', '/getAccounts', null, (data) => {
    ReactDOM.render(
      <AccountList accounts={data.accounts} csrf={csrf}/>, document.querySelector("#domoList")
    );
  });
};

const loadFriendsFromServer = (csrf) => {
  sendAjax('GET', '/getFriends', null, (data) => {
    ReactDOM.render(
      <FriendList friends={data.friends} csrf={csrf}/>, document.querySelector("#friendList")
    );
  });
};

const setup = function(csrf) {
  const cPassWindow = document.querySelector('#cPassButton');
  const mAccountWindow = document.querySelector('#mAccount');
  const aFriendsWindow = document.querySelector('#addFriends');
  
  cPassWindow.addEventListener('click', (e) => {
    e.preventDefault();
    createCPassWindow(csrf);
    return false;
  });
  
  mAccountWindow.addEventListener('click', (e) => {
    e.preventDefault();
    createMyAccount(csrf);
    
    sendAjax('GET', '/getAccount', null, (acc) => {
        //console.log(acc);
        
        sendAjax('GET', '/getDomos', null, (data) => {
            ReactDOM.render(
                <NoteCount domos={data} account={acc} csrf={csrf}/>, document.querySelector("#tContainer")
            );
        });
    });
    
    sendAjax('GET', '/getAccounts', null, (accs) => {
        //console.log(accs);
    });
      
    return false;
  });
  
  aFriendsWindow.addEventListener('click', (e) => {
    e.preventDefault();
    createFriendsPage(csrf);
    
  sendAjax('GET', '/getAccounts', null, (data) => {
    ReactDOM.render(
      <AccountList accounts={data.accounts} csrf={csrf}/>, document.querySelector("#domoList")
    );
  });
      
    return false;
  });
    
  ReactDOM.render(
    <DomoForm csrf={csrf} />, document.querySelector("#makeDomo")
  );
    
  ReactDOM.render(
    <ReportForm csrf={csrf} />, document.querySelector("#reportDomo")
  );

  ReactDOM.render(
    <DomoList domos={[]} csrf={csrf}/>, document.querySelector("#domoList")
  );
            
  ReactDOM.render(
    <FriendList friends={[]} csrf={csrf}/>, document.querySelector("#friendList")
  );

  loadDomosFromServer(csrf);
  loadFriendsFromServer(csrf);
};

const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
});