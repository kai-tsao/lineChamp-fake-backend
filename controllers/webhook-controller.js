class WebhookController {
    
    constructor() {
    }
    
    getTest(req, res) {
        const config = {
            verifyToken: 'kai_webhook_test'
        };

        console.log(req.query);
        console.log(req.body);

        let mode = req.query["hub.mode"];
        let token = req.query["hub.verify_token"];
        let challenge = req.query["hub.challenge"];
        
        if (mode && token) {
            if (mode === "subscribe" && token === config.verifyToken) {
                console.log("WEBHOOK_VERIFIED");
                res.status(200).send(challenge);
            } else {
                res.sendStatus(403);
            }
        } else {
            res.sendStatus(403);
        }
    }

    postTest(req, res) {
        let challenge = req.query["hub.challenge"];
        res.type('application/json');
        console.log(req.query);
        console.log(req.body);
        res.status(200).send(challenge);
    }

}

module.exports = WebhookController;
