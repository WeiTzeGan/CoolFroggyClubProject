const vueinst = Vue.createApp({
    data() {
        return {
            signedIn: false,
            buttonHover: false,
            userID: '',
            userPassword: '',
            userType: '',
        };
    },

    computed: {
        URL: function () {
            // If user is signed in, change log in button to account button
            if (this.signedIn === false) {
                return "login-new.html";
            } else {
                return 'account.html';
            }
        },
        buttonName: function () {
            // If user is signed in
            if (this.signedIn === true) {
                return "Account";
            } else {
                return "Log in/Sign up";
            }
        }
    },

    methods: {
        login() {
            let req = new XMLHttpRequest();

            let login_data = {
                username: vueinst.userID,
                password: vueinst.userPassword,
                type: vueinst.userType
            };

            req.onreadystatechange = function () {
                if (req.readyState === 4 && req.status === 200 ) {
                    vueinst.userID = '';
                    vueinst.userPassword = '';
                    vueinst.userType = '';

                    window.location.href = "home-page-new.html";
                }
            };
            req.open('POST', '/login', true);
            req.setRequestHeader("Content-type", "application/json");
            req.send(JSON.stringify(login_data));
        },

        logout(){
            let req = new XMLHttpRequest();

            req.onreadystatechange = function(){
                if (this.readyState == 4 && this.status == 200){
                    alert('Logged out');
                    vueinst.signedIn = false;
                }else if (this.readyState == 4 && this.status == 403){
                    alert('Not logged out');
                }
            };

            req.open('POST', '/logout', true);
            req.send();
        }
    }
}).mount('#coolfroggyclub');

// THIS HAS TO BE PUT OUTSIDE OF VUEINST TO WORK
function google_login(response) {
    let req = new XMLHttpRequest();

    let google_login_data = {
        google_login_info: response,
        type: vueinst.userType
    };

    //console.log(response);

    req.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            alert('Logged in with Google Sucessfully');
            window.location.href = "home-page-new.html";
        } else if (this.readyState === 4 && this.status === 401) {
            alert('Login FAILED');
        }
    };

    req.open('POST', '/google-login');
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(google_login_data));
}

window.onload = function(){
    /*
        This checks if user has logged in to
        display the "sign out" and "account" OR "log in/ signup"
    */
    let req = new XMLHttpRequest();

    req.onreadystatechange = function() {
        if (req.readyState === 4 && req.status === 200) {
            vueinst.signedIn = true;
        } else {
            vueinst.signedIn = false;
        }
    };

    req.open('GET', '/checkLogin', true);
    req.send();
};
