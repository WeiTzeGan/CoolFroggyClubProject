const eventsVue = Vue.createApp({
    data() {
        return {
            all_events: []
        };
    },

    methods: {
        showEvents: function() {
            let xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    eventsVue.all_events = JSON.parse(this.response);
                }
            };

            xhttp.open("GET", "/getEvents", true);
            xhttp.send();
        }
    }
}).mount('#events');

eventsVue.showEvents();