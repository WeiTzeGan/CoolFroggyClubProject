const vueinst = Vue.createApp ({
    data(){
      return{
        signedIn: false
      };
    },
    computed: {
        URL: function(){
            // If user is signed in, change log in button to account button
            if (this.signedIn === true) {
                return "account.html";
            } else {
                return "login-new.html";
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
    }
  }).mount('#header');