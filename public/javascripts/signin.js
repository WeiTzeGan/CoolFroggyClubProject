function formatDate(dateString) {
    var parts = dateString.split('-');
    var day = parts[0];
    var month = parts[1];
    var year = parts[2];

    // Create a new Date object using the parsed values
    var dateObject = new Date(year, month - 1, day);

    // Get the year, month, and day from the date object
    var formattedYear = dateObject.getFullYear();
    var formattedMonth = ('0' + (dateObject.getMonth() + 1)).slice(-2);
    var formattedDay = ('0' + dateObject.getDate()).slice(-2);

    // Combine the formatted values into a new date string
    var formattedDate = formattedYear + '-' + formattedMonth + '-' + formattedDay;

    return formattedDate;
}

const vueinst = Vue.createApp({
    data() {
        return {
            signedIn: false,
            buttonHover: false,

            // details for login
            userEmail: '',
            userPassword: '',
            userType: '',

            // details for sign up
            first_name: '',
            last_name: '',
            dob: null,
            password: '',
            confirm_password: '',
            mobile: '',
            email: ''
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
                email: vueinst.userEmail,
                password: vueinst.userPassword,
                type: vueinst.userType
            };

            req.onreadystatechange = function () {
                if (req.readyState === 4 && req.status === 200) {
                    vueinst.userEmail = '';
                    vueinst.userPassword = '';
                    vueinst.userType = '';

                    window.location.href = "home-page-new.html";
                }
            };
            req.open('POST', '/login', true);
            req.setRequestHeader("Content-type", "application/json");
            req.send(JSON.stringify(login_data));
        },

        signup() {
            // this sign up tries to sign you in immediately after signup
            // outer req checks if can sign up
            // inner req does the sign up if outer req return 200

            let req = new XMLHttpRequest();

            let date_of_birth;
            if (vueinst.dob !== '') {
                date_of_birth = formatDate(vueinst.dob);

            }
            let signup_data = {
                first_name: vueinst.first_name,
                last_name: vueinst.last_name,
                dob: date_of_birth,
                password: vueinst.password,
                mobile: vueinst.mobile,
                email: vueinst.email
            };

            req.onreadystatechange = function () {
                if (req.readyState === 4 && req.status === 200) {
                    window.location.href = "home-page-new.html";
                }
            };

            req.open('POST', '/signup', true);
            req.setRequestHeader('Content-type', 'application/json');
            req.send(JSON.stringify(signup_data));
        },

        logout() {
            let req = new XMLHttpRequest();

            req.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    alert('Logged out');
                    vueinst.signedIn = false;
                } else if (this.readyState == 4 && this.status == 403) {
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

window.onload = function () {
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
