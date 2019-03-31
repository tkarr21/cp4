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
    },

    //created() {},

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

        /*addComponents() {
            if (this.addedAdjective !== '') {
                this.addedAdjectiveComponent();
            }
            if (this.addedNoun !== '') {
                this.addedAdjectiveComponent();
            }
        },*/

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
    }
});