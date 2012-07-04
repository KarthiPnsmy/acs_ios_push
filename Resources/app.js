var Cloud = require('ti.cloud');
var deviceToken;
 
var win = Titanium.UI.createWindow({
    title:'ACS iOS App',
    backgroundColor:'#fff'
});


var registerPush = Ti.UI.createButton({
    width:260,
    height:30,
    top:30,
    title:"REGISTER PUSH NOTIFICATION"
});
win.add(registerPush);
 
registerPush.addEventListener('click',registerUser);

 
//user registeration on cloud
function registerUser(){
    Cloud.Users.create({
        username: "push123x",
        password: "push123x",
        password_confirmation: "push123x",
        first_name: "Firstname",
        last_name: "Lastname"
    }, function (e) {
    if (e.success) {
        	alert("User Created");
        	loginUser();
        } else {
        	alert("Error :"+e.message);
        }
    });
}
 
//user login on cloud using default credential
function loginUser(){
    Cloud.Users.login({
        login: 'push123x',
        password: 'push123x'
    }, function (e) {
    if (e.success) {
    var user = e.users[0];
			alert("Loggin successfully");
            getDeviceToken();
        } else {
            alert("Error :"+e.message);
        }
    });
}
 
 
// getting device token
function getDeviceToken(){
    Titanium.Network.registerForPushNotifications({
        types: [
            Titanium.Network.NOTIFICATION_TYPE_BADGE,
            Titanium.Network.NOTIFICATION_TYPE_ALERT,
            Titanium.Network.NOTIFICATION_TYPE_SOUND
        ],
    success:function(e)
    {
        deviceToken = e.deviceToken;
        alert("deviceToken = "+deviceToken);
        registerForPush();
    },
    error:function(e)
    {
        alert("Error: "+e.message);
    },
    callback:function(e)
    {
        alert("push notification received"+JSON.stringify(e.data));
    }
    });
}

// register for push notification on cloud server
function registerForPush(){
    Cloud.PushNotifications.subscribe({
        channel: 'demo_alert',
        type:'ios',
        device_token: deviceToken
    }, function (e) {
        if (e.success) {
            alert('Success :'+((e.error && e.message) || JSON.stringify(e)));
        } else {
            alert('Error:' + ((e.error && e.message) || JSON.stringify(e)));
        }
    });
}

win.open();