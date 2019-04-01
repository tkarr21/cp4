Vue.config.devtools = true

let app = new Vue({
    el: '#app',
    data: {
        nouns: [],
        adjectives: [],
        current: {
            noun: '',
            adjective: '',
        },
        addedNoun: '',
        addedAdjective: '',
        showNouns: false,
        showAdjectives: false,

        names: [],

        addName: '',
        creator: '',
        key: '',
        del_req_key: '',
    },

    created() {
        this.getNames();
    },

    methods: {
        addedNounComponent() {
            this.nouns.push(this.addedNoun);
            this.addedNoun = '';
        },

        addedAdjectiveComponent() {
            this.adjectives.push(this.addedAdjective)
            this.addedAdjective = '';
        },

        showNoun() {
            this.showNouns = !this.showNouns;
        },

        showAdjective() {
            this.showAdjectives = !this.showAdjectives;
        },

        

        getRandom(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum and minimum are inclusive
        },

        generateName() {
            if (this.nouns.length == 0 || this.adjectives == 0) return;
            nIndex = this.getRandom(1, this.nouns.length);
            aIndex = this.getRandom(1, this.adjectives.length);
            console.log(nIndex + " " + aIndex);

            this.current.noun = this.nouns[nIndex - 1];
            this.current.adjective = this.adjectives[aIndex - 1];
        },

        async getNames() {
            try {
                let response = await axios.get("/api/bandnames");
                this.names = response.data;
                return true;
            } catch (error) {
                console.log(error);
            }
        },

        async submitName() {
            if (this.addName == '' || this.creator == '' || this.key == '') {
                return;
            }

            try {
                let response = await axios.post('/api/bandnames', {
                    creator: this.creator,
                    deletekey: this.key,
                    name: this.addName,
                    count: 0,
                });

                this.addName = '';
                this.key = '';

                this.getNames();
            } catch (error) {
                console.log(error);
            }
        },

        async upvote(n) {
            try {
                await axios.put('/api/bandnames/' + n._id, {
                    vote: 'plus'
                });

                n.count += 1;
                this.getNames();
            } catch (error) {
                console.log(error);
            }
        },

        async downvote(n) {
            try {
                await axios.put('/api/bandnames/' + n._id, {
                    vote: 'minus'
                });
                
                n.count -= 1;
                this.getNames();
            } catch (error) {
                console.log(error);
            }
        },

        async deleteName(n) {
            try {
                await axios.delete('/api/bandnames/' + n._id, {
                    data: { key: this.del_req_key }
                });
                this.del_req_key = '';
                this.getNames();
                return true;
            } catch (error) {
                console.log(error);
            }
        }
    }
});