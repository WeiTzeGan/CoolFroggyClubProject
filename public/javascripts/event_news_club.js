const vueinst = Vue.createApp({
    data() {
        return {
            signedIn: false,
            buttonHover: false,
            all_events: []
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
        showEvents: function() {
            let xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    vueinst.all_events = JSON.parse(this.response);
                }
            };

            xhttp.open("GET", "/getEvents", true);
            xhttp.send();
        },

        formatDate(date) {
            const options = {
                year: "numeric",
                month: "long",
                day: "numeric"
            };

            return new Date(date).toLocaleDateString(undefined, options);
        },

        join_club(){
            
        }

    }
}).mount('#coolfroggyclub');


window.onload = function () {
    // show events even when user has not logged in
    vueinst.showEvents();

    /*
        This checks if user has logged in to
        display the "sign out" and "account" OR "log in/ signup"
    */
    let req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            vueinst.signedIn = true;
        } else {
            vueinst.signedIn = false;
        }
    };

    req.open('GET', '/checkLogin', true);
    req.send();
};

