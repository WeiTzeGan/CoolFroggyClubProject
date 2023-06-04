const vueinst = Vue.createApp({
    data() {
        return {
            signedIn: false,
            buttonHover: false,
            all_events: [],
            all_clubs: [],
            all_news: [],
            show_news: [], // only show 1 news at a time (this refers to the index of the news in all_news)
            search_target: '',
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
        // upcoming-events.html functions
        view_event: function(event_type) {
            let xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    vueinst.all_events = JSON.parse(this.response);
                }
            };

            xhttp.open("GET", "/view-events?type=" + encodeURIComponent(event_type), true);
            xhttp.send();
        },

        join_event: function(id){

            let join_info = {event_id: id};

            let req = new XMLHttpRequest();

            req.onreadystatechange = function(){
                if (req.readyState === 4 && req.status === 200){
                    alert("Join Event sucessfully");
                }else if(req.readyState === 4 && req.status === 403){
                    alert("Event already joined, cannot do it again");
                }else if(req.readyState === 4 && req.status === 401){
                    alert("Please log in to join the event");
                }
            };

            req.open('POST', '/users/join-event', true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.send(JSON.stringify(join_info));
        },

        formatDate: function(date) {
            const options = {
                year: "numeric",
                month: "long",
                day: "numeric"
            };

            return new Date(date).toLocaleDateString(undefined, options);
        },


        // join-a-club.html functions
        view_club: function(){
            let req = new XMLHttpRequest();

            req.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    vueinst.all_clubs = JSON.parse(req.response);
                }
            };

            req.open("GET", "/view-clubs", true);
            req.send();
        },

        join_club: function(id){

            let join_info = { club_id : id };

            let req = new XMLHttpRequest();

            req.onreadystatechange = function(){
                if (req.readyState === 4 && req.status === 200){
                    alert("Join club sucessfully");
                }else if(req.readyState === 4 && req.status === 403){
                    alert("Club already joined, cannot do it again");
                }else if(req.readyState === 4 && req.status === 401){
                    alert("Please log in to join the club");
                }
            };

            req.open('POST', '/users/join-club', true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.send(JSON.stringify(join_info));
        },

        // latest-news.html functions
        view_news: function(freshness){

            let news_freshness = {type: freshness};

            let req = new XMLHttpRequest();

            req.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    vueinst.all_news = JSON.parse(req.response);
                }
            };

            req.open("POST", "/view-news", true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.send(JSON.stringify(news_freshness));
        },

        count_news: function(freshness){
            let news_freshness = {type: freshness};

            let req = new XMLHttpRequest();

            req.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    // get the number of news that is public
                    let length = JSON.parse(req.response)[0].length;
                    vueinst.show_news = Array(length).fill(false);
                }
            };

            req.open("POST", "/count-news", true);
            req.setRequestHeader('Content-Type', 'application/json');
            req.send(JSON.stringify(news_freshness));
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

        search_news: function(){
            let req = new XMLHttpRequest();

            req.onreadystatechange = function() {
                if ( req.readyState === 4  && req.status === 200) {
                    vueinst.all_news = JSON.parse(req.response);
                }
            };

            req.open('GET', "/search-news?target=" + encodeURIComponent(vueinst.search_target), true);
            req.send();
        },

        count_search_news: function(){
            let req = new XMLHttpRequest();

            req.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    // get the number of news that is public
                    let length = JSON.parse(req.response)[0].length;
                    vueinst.show_news = Array(length).fill(false);
                }
            };

            req.open('GET', "/count-search-news?target=" + encodeURIComponent(vueinst.search_target), true);
            req.send();
        },


        logout: function() {
            let req = new XMLHttpRequest();

            req.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    alert('Logged out Sucessfully');
                    vueinst.signedIn = false;
                } else if (this.readyState == 4 && this.status == 403) {
                    alert('You have not logged in yet');
                }
            };

            req.open('POST', '/logout', true);
            req.send();
        }

    }
}).mount('#coolfroggyclub');


window.onload = function () {
    // show events even when user has not logged in
    if (window.location.href === "http://localhost:8080/upcoming-events.html"){
        vueinst.view_event('all');
    }
    // show clubs even when user has not logged in
    if (window.location.href === "http://localhost:8080/join-a-club.html"){
        vueinst.view_club();
    }
    // show public clubs' news even when user has not logged in
    if (window.location.href === "http://localhost:8080/latest-news.html"){
        vueinst.count_news('all');
        vueinst.view_news('all');
    }

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

