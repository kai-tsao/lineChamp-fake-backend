class Merchant {
    id;
    name;
    facebookPageAccessToken;
    instagramPageAccessToken;
    constructor(input) {
        this.id = (input?.id) ? input.id : null;
        this.name = input.name;
        this.facebookPageAccessToken = (input?.facebookPageAccessToken) ? input.facebookPageAccessToken : '';
        this.instagramPageAccessToken = (input?.instagramPageAccessToken) ? input.instagramPageAccessToken : '';
    }
}

module.exports = Merchant;