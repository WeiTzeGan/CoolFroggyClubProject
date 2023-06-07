// function get_cookie(cname) {
//     let name = cname + "=";
//     let decodedCookie = decodeURIComponent(document.cookie);
//     let ca = decodedCookie.split(';');
//     for(let i = 0; i <ca.length; i++) {
//       let c = ca[i];
//       while (c.charAt(0) == ' ') {
//         c = c.substring(1);
//       }
//       if (c.indexOf(name) == 0) {
//         return c.substring(name.length, c.length);
//       }
//     }
//     return "";
// }

const vueinst = Vue.createApp({
    data() {
        return {
            signedIn: false,
            buttonHover: false,
            access_type: '',

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
            email: '',

            // details for original user details
            originFirstName: '',
            originLastName: '',
            originDOB: '',
            originMobile: '',
            originEmail: '',

            // to toggle menu bar
            menu: 'hamburger',
            dropdown: 'dropdown-menu'
        };
    },

    computed: {
        URL: function () {
            // If user is signed in, change log in button to account button
            if (this.signedIn === false) {
                return "login-new.html";
            } else {
                if (vueinst.access_type === "Club Member" || vueinst.access_type === "Club Manager"){
                    return 'member-profile.html';
                }else if (vueinst.access_type === "Admin"){
                    return 'admin-profile.html';
                }
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
                    vueinst.access_type = vueinst.userType;
                    vueinst.userType = '';

                    if (window.location.href === "http://localhost:8080/login-new.html"){
                        if (vueinst.access_type === 'Club Member' || vueinst.access_type === 'Club Manager'){
                            window.location.href = "member-profile.html";
                        } else if (vueinst.access_type === 'Admin'){
                            window.location.href = "admin-profile.html";
                        }else{
                            window.location.href = "index.html";
                        }
                    }
                }
            };
            req.open('POST', '/login', true);
            req.setRequestHeader("Content-type", "application/json");
            req.send(JSON.stringify(login_data));
        },

        signup() {
            let req = new XMLHttpRequest();

            let signup_data = {
                first_name: vueinst.first_name,
                last_name: vueinst.last_name,
                dob: vueinst.dob,
                password: vueinst.password,
                mobile: vueinst.mobile,
                email: vueinst.email
            };

            req.onreadystatechange = function () {
                if (req.readyState === 4 && req.status === 200) {
                    window.location.href = "login-new.html";
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
        },

        // to toggle menu in nav bar
        toggleMenu() {
            if (this.menu === 'hamburger') {
                this.menu = 'hamburger is-active';
                this.dropdown = 'dropdown-menu open';
            } else {
                this.menu = 'hamburger';
                this.dropdown = 'dropdown-menu';
            }
        }
    }
}).mount('#signin');



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
            vueinst.access_type = vueinst.userType;
            alert('Logged in with Google Sucessfully');

            if (vueinst.access_type === 'Club Member' || vueinst.access_type === 'Club Manager'){
                window.location.href = "member-profile.html";
            } else if (vueinst.access_type === 'Admin'){
                window.location.href = "admin-profile.html";
            }else{
                window.location.href = "index.html";
            }

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
            vueinst.access_type = req.responseText;
            console.log("signed already");
            vueinst.signedIn = true;
        } else {
            vueinst.signedIn = false;
        }
    };

    req.open('GET', '/checkLogin', true);
    req.send();
};
