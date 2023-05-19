const vueinst = Vue.createApp ({
    data(){
      return{
        signedIn: false,
        buttonHover: false
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
    }
  }).mount('#header');