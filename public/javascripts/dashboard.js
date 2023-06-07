const vueinst = Vue.createApp({
    data() {
        return {
            signedIn: false,
            buttonHover: false,

            // details needed for editing user details
            first_name: '',
            last_name: '',
            dob: null,
            password: '',
            confirm_password: '',
            mobile: '',
            email: '',

            // details for original user details (details needed for editing user details)
            originFirstName: '',
            originLastName: '',
            originDOB: '',
            originMobile: '',
            originEmail: '',

            // personalized news/announcement (coming from clubs user has joined)
            all_news: [],
            show_news: [],

            // to toggle menu bar
            menu: 'hamburger',
            dropdown: 'dropdown-menu',

            // change password
            change_password: false,
            pw_required: false,

            // reveal passwords
            is_visible: false,
            reveal: 'password',
            icon: 'no-see',

            // check passwords
            message: 'message-hide',
            match_validity: 'invalid',
            letter_validity: 'invalid',
            capital_validity: 'invalid',
            number_validity: 'invalid',
            length_validity: 'invalid',
            special_validity: 'invalid',
            space_validity: 'invalid'
        };
    },

    computed: {
        URL: function () {
            // If user is signed in, change log in button to account button
            if (this.signedIn === false) {
                return "login-new.html";
            } else {
                return 'member-profile.html';
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
        formatDate: function(date) {
            const options = {
                year: "numeric",
                month: "long",
                day: "numeric"
            };

            return new Date(date).toLocaleDateString(undefined, options);
        },

        // functions to edit user details
        view_old_info: function(){
            let req = new XMLHttpRequest();

            req.onreadystatechange = function() {
                if ( req.readyState === 4  && req.status === 200) {
                    let result = JSON.parse(req.response)[0];

                    if (window.location.href === "http://localhost:8080/account.html"){
                        vueinst.originFirstName = result.first_name;
                        vueinst.originLastName = result.last_name;
                        vueinst.originDOB = result.date_of_birth;
                        vueinst.originEmail = result.email;
                        vueinst.originMobile = result.mobile;

                        vueinst.first_name = result.first_name;
                        vueinst.last_name = result.last_name;
                        vueinst.dob = result.date_of_birth;
                        vueinst.mobile = result.mobile;
                        vueinst.email = result.email;
                    } else if (window.location.href === "http://localhost:8080/member-profile.html"){
                        vueinst.first_name = result.first_name;
                        vueinst.last_name = result.last_name;
                        vueinst.dob = result.date_of_birth;
                        vueinst.mobile = result.mobile;
                        vueinst.email = result.email;
                    }
                }
            };

            req.open('GET', "/users/info", true);
            req.send();
        },

        update_info: function(){
            let new_info;
            const cnfm_pw = document.getElementById("confirm-password");

            // if user chooses to change password -> then include in JSON object
            if (this.change_password) {
                new_info = {
                    new_email: vueinst.email,
                    new_mobile: vueinst.mobile,
                    new_password: vueinst.password
                };

                // validate password
                if (this.password !== this.confirm_password) {
                    cnfm_pw.setCustomValidity('Passwords do not match');
                    // https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation
                    // alert('Passwords do not match');
                    return;
                }

                if (this.letter_validity !== 'valid' || this.capital_validity !== 'valid'
                || this.number_validity !== 'valid' || this.length_validity !== 'valid'
                || this.special_validity !== 'valid' || this.space_validity !== 'valid') {
                    cnfm_pw.setCustomValidity('Ensure password fulfills criteria');
                    // alert('Ensure password fulfills criteria');
                    return;
                }

            } else {

                // HAVE TO UPDATE ROUTER TO HANDLE CHANGING INFO WITHOUT CHANGING PASSWORDS ! --------------------------------
                new_info = {
                    new_email: vueinst.email,
                    new_mobile: vueinst.mobile
                };
            }

            let req = new XMLHttpRequest();

            req.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    vueinst.first_name = '';
                    vueinst.last_name = '';
                    // vueinst.dob = null;
                    vueinst.dob = '';
                    vueinst.password = '';
                    vueinst.confirm_password = '';
                    vueinst.mobile = '';
                    vueinst.email = '';
                    alert('Account details changed sucessfully');
                    window.location.href = "member-profile.html";
                } else if (this.readyState == 4 && this.status == 401) {
                    alert('Cannot change account details');
                }
            };

            req.open('POST', '/users/update-info', true);
            req.setRequestHeader("Content-type", "application/json");
            req.send(JSON.stringify(new_info));
        },

        // functions to help get personalized news from joined clubs
        view_member_news: function(){
            let req = new XMLHttpRequest();

            req.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    vueinst.all_news = JSON.parse(req.response);
                    vueinst.show_news = Array(vueinst.all_news.length).fill(false);
                }
            };

            req.open('GET', "/users/view-member-news", true);
            req.send();
        },


        show_full_message: function(index){
            if (vueinst.show_news[index] === false){
                vueinst.show_news[index] = true;
            }
        },

        hide_full_message: function(index){
            if (vueinst.show_news[index] === true){
                vueinst.show_news[index] = false;
            }
        },

        logout: function() {
            let req = new XMLHttpRequest();

            req.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    alert('Logged out sucessfully');
                    vueinst.signedIn = false;
                    window.location.href = "index.html";
                } else if (this.readyState == 4 && this.status == 403) {
                    alert('Logout FAILED');
                }
            };

            req.open('POST', '/logout', true);
            req.send();
        },

        // to toggle menu in nav bar
        toggleMenu: function() {
            if (this.menu === 'hamburger') {
                this.menu = 'hamburger is-active';
                this.dropdown = 'dropdown-menu open';
            } else {
                this.menu = 'hamburger';
                this.dropdown = 'dropdown-menu';
            }
        },

        // reveal / unreveal passwords
        see: function() {
            if (this.is_visible) {
                this.reveal = 'password';
                this.is_visible = false;
                this.icon = 'no-see';
            } else {
                this.reveal = 'text';
                this.is_visible = true;
                this.icon = 'see';
            }
        },

        // When the user clicks on the password field, show the message box
        reveal_message: function() {
            this.message = 'message-show';
        },

        // check password match
        validatePassword: function() {
            // Validate lowercase letters
            let lowerCaseLetters = /[a-z]/g;
            if (this.password.match(lowerCaseLetters)) {
                this.letter_validity = 'valid';
            } else {
                this.letter_validity = 'invalid';
            }

            // Validate capital letters
            let upperCaseLetters = /[A-Z]/g;
            if (this.password.match(upperCaseLetters)) {
                this.capital_validity = 'valid';
            } else {
                this.capital_validity = 'invalid';
            }

            // Validate numbers
            let numbers = /[0-9]/g;
            if (this.password.match(numbers)) {
                this.number_validity = 'valid';
            } else {
                this.number_validity = 'invalid';
            }

            // Validate length
            if (this.password.trim().length >= 8) {
                this.length_validity = 'valid';
            } else {
                this.length_validity = 'invalid';
            }

            // Validate special characters
            let specialChars = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/;
            if (this.password.match(specialChars)) {
                this.special_validity = 'valid';
            } else {
                this.special_validity = 'invalid';
            }

            // Validate no space
            if (this.password.match(' ')) {
                this.space_validity = 'invalid';
            } else {
                this.space_validity = 'valid';
            }

            // validate both passwords match
            if (this.password === this.confirm_password) {
                this.match_validity = 'valid';
            } else {
                this.match_validity = 'invalid';
            }
        }
    }

}).mount('#coolfroggyclub');


window.onload = function () {
    /*
        This checks if user has logged in to
        display the "sign out" and "account" OR "log in/ signup"
    */

    vueinst.view_old_info();

    if (window.location.href === "http://localhost:8080/member-profile.html"){
        vueinst.view_member_news();
    }

    let req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200 ) {
            vueinst.signedIn = true;
        } else if (req.readyState === 4 && req.status === 401) {
            vueinst.signedIn = false;
        }
    };

    req.open('GET', '/checkLogin', true);
    req.send();
};