const vueinst = Vue.createApp ({
    data(){
      return{
        signedIn: false,
        buttonHover: false,
        userID: '',
        userPassword: '',
        userType: ''
      };
    },

    computed: {
        URL: function(){
            // If user is signed in, change log in button to account button
            if (this.signedIn === false) {
                return "login-new.html";
            } else {
                return 'account.html';
            }
        },
        buttonName: function() {
            // If user is signed in
            if (this.signedIn === true) {
                return "Account";
            } else {
                return "Log in/Sign up";
            }
        }
    },

    methods: {
        signIn() {
            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    this.userID = '';
                    this.userPassword = '';
                    this.userType = '';

                    const successfulSignIn = this.response.data.signedIn;
                    if (successfulSignIn) {
                        this.signedIn = true;
                    }
                }
            };

            if (this.userType === "Club Manager") {
                xhttp.open("GET", "/club_managers/signin", true);
                xhttp.setRequestHeader("Content-type", "application/json");
                xhttp.send(JSON.stringify({
                    username: this.userID,
                    password: this.userPassword
                }));
            } else {
                return;
            }
        }
    }
}).mount('#coolfroggyclub');


function google_login(response){
    let req = new XMLHttpRequest();

    req.onreadystatechange = function(){
        if (this.readyState === 4 && this.status === 200){
            alert('Logged in with Google Sucessfully');
        }else if (this.readyState === 4 && this.status === 401){
            alert('Login FAILED');
        }
    };

    req.open('POST','/google-login');
    req.setRequestHeader('Content-Type','application/json');
    req.send(JSON.stringify(response));
}


