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

            // details for club manager profile
            club_id: '',
            club_members: [],
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
                    }else if (window.location.href === "http://localhost:8080/member-profile.html"){
                        vueinst.first_name = result.first_name;
                        vueinst.last_name = result.last_name;
                    }

                }
            };

            req.open('GET', "/users/info", true);
            req.send();
        },

        update_info: function(){
            let new_info = {
                new_email: vueinst.email,
                new_mobile: vueinst.mobile,
                new_password: vueinst.password
            };

            let req = new XMLHttpRequest();

            req.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    vueinst.first_name = '';
                    vueinst.last_name = '';
                    vueinst.dob = null;
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
                }
            };

            req.open('GET', "/users/view-member-news", true);
            req.send();
        },

        count_member_news: function(){
            let req = new XMLHttpRequest();

            req.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    // get the number of news that is public
                    let length = JSON.parse(req.response)[0].length;
                    vueinst.show_news = Array(length).fill(false);
                }
            };

            req.open('GET', 'users/count-member-news', true);
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

        get_club_event(){
            let req = new XMLHttpRequest();

            req.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    vueinst.all_events = JSON.parse(this.response);
                }
            };

            req.open('POST', '/club_managers/viewEvents', true);
            req.setRequestHeader('Content-Type', 'application/json');

            req.send(JSON.stringify({
                club_id: vueinst.club_id
            }));
        },

        logout: function() {
            let req = new XMLHttpRequest();

            req.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    alert('Logged out');
                    vueinst.signedIn = false;
                    window.location.href = "home-page-new.html";
                } else if (this.readyState == 4 && this.status == 403) {
                    alert('Not logged out');
                }
            };

            req.open('POST', '/logout', true);
            req.send();
        },

        getClubID() {
            let req = new XMLHttpRequest();

            req.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    vueinst.club_id = this.response;

                    // Once club_id is received, call viewMembers and get_club_event
                    vueinst.viewMembers();
                    vueinst.get_club_event();
                }
            };

            req.open('GET', '/club_managers/getClubID', true);
            req.send();
        },

        viewMembers() {
            let req = new XMLHttpRequest();

            req.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    vueinst.club_members = JSON.parse(this.response);
                }
            };

            req.open('POST', '/club_managers/viewMembers', true);
            req.setRequestHeader('Content-Type', 'application/json');

            req.send(JSON.stringify({
                club_id: vueinst.club_id
            }));
        },

        deleteMember: function(userID) {
            let req = new XMLHttpRequest();

            req.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    vueinst.viewMembers();
                }
            };

            req.open('DELETE', '/club_managers/deleteMembers', true);
            req.setRequestHeader('Content-Type', 'application/json');

            req.send(JSON.stringify({
                user_id: userID
            }));
        }
    }
}).mount('#coolfroggyclub');

window.onload = function () {
    // Show club members
    if (window.location.href === "http://localhost:8080/club-manager-profile.html") {
        vueinst.getClubID();
    }
    /*
        This checks if user has logged in to
        display the "sign out" and "account" OR "log in/ signup"
    */

    vueinst.view_old_info();

    if (window.location.href === "http://localhost:8080/member-profile.html"){
        vueinst.view_member_news();
        vueinst.count_member_news();
    }

    let req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        if (req.readyState === 4 && req.status === 200) {
            vueinst.signedIn = true;
        } else if (req.readyState === 4 && req.status === 401) {
            vueinst.signedIn = false;
        }
    };

    req.open('GET', '/checkLogin', true);
    req.send();
};
