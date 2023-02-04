const { AppInfo } = require("../tool");
const axios = require("axios");

class AppController {

    // 以下處理和FB應用程式有關的API
    // 警告：這些API不可以在前端環境呼叫，ClientSecret暴露很危險，只適用於後端環境
    
    constructor() {
    }

    getAppWebhookFields(req, res, next) {
        const url = `https://graph.facebook.com/v15.0/${AppInfo.getClientID()}/subscriptions?access_token=${AppInfo.getClientID()}|${AppInfo.getClientSecret()}`;
        axios.get(url).then(r => {
            console.log(r.data);
            res.status(200).json(r.data);
        }).catch(err => {
            console.error(err);
            next(err);
        });
    }

    setAppWebhookFields(req, res, next) {
        // 設定page，欄位為messages,messaging_optins,messaging_referrals
        // callback_url為https://xxxxxxxxx/webhook
        // verify_token為kai_webhook_test
        let url = `https://graph.facebook.com/v15.0/${AppInfo.getClientID()}/subscriptions?`;
        url += `object=page&callback_url=https://a274-106-107-185-218.jp.ngrok.io/webhook&`;
        url += `fields=messages,messaging_optins,messaging_referrals&include_values=true&verify_token=kai_webhook_test&`;
        url += `access_token=${AppInfo.getClientID()}|${AppInfo.getClientSecret()}`;
        axios.post(url, {}).then(r => {
            console.log(r.data);
            res.status(200).json(r.data);
        }).catch(err => {
            console.error(err);
            next(err);
        });
    }
    
    postTest(req, res, next) {
        console.log(req?.body);
        res.status(200).json(req?.body);
    }
}

module.exports = AppController;
