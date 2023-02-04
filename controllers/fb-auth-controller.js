const passport = require('passport');
const axios = require('axios');

class FBAuthController {

    constructor() {
    }

    status(req, res) {
        res.send(`<p>Hello ${req.user.profile.displayName}</p>
            <a href="/">返回</a>
        `);
    }
    
    popupEnd(req, res) {
        res.send(`
           <!--<button onclick="window.close();">關閉</button>-->
           <h3>驗證完成，請關閉本視窗</h3>
        `);
    }

    logout(req, res, next) {
        req.logout(function(err) {
            if (err) { return next(err); }
            res.sendStatus(200);
        });
    }

    logoutRedirect(req, res, next) {
        req.logout(function(err) {
            if (err) { return next(err); }
            res.redirect('/');
        });
    }

    login(req, res, next) {
        if (req.query?.state) {
            const state = JSON.parse(req.query.state);
            const id = state?.id;
            const mId = state?.mId;
            if (!id || !mId) res.sendStatus(400); 
            const stateData = {
                id: id,
                mId: mId
            };
            req.session.fbState = stateData; // 存進session，callback回來時要檢查
            passport.authenticate('facebook', {
                scope: ['public_profile','pages_messaging', 'pages_show_list', 'pages_read_user_content', 'pages_manage_metadata', 'pages_read_engagement'],
                display: 'popup',
                state: JSON.stringify(stateData)
            })(req, res, next);   
        } else {
            res.sendStatus(400);
        }
    }
    
    callback(req, res, next) {
            // successReturnToOrRedirect: '/fbAuth/status',
        passport.authenticate('facebook', {
            successReturnToOrRedirect: '/fbAuth/popupEnd',
            failureRedirect: '/fbAuth/error',
        })(req, res, next);
    }
    
    setPageWebhook(req, res, next) {
        const fields = 'messages,messaging_optins,messaging_referrals';
        // const fields = 'messages';
        const url = `https://graph.facebook.com/v15.0/me/subscribed_apps?subscribed_fields=${fields}&access_token=${req.user.pageAccessToken}`;
        axios.post(url, {}).then(r => {
            console.log(r.data);
            res.status(200).json(r.data);
        }).catch(err => {
            console.error(err);
            next(err);
        });
    }

    getPageWebhookFields(req, res, next) {
        const url = `https://graph.facebook.com/v15.0/me/subscribed_apps?access_token=${req.user.pageAccessToken}`;
        axios.get(url).then(r => {
            console.log(r.data);
            res.status(200).json(r.data);
        }).catch(err => {
            console.error(err);
            next(err);
        });
    }

    postMsg(req, res, next) {
        const postMsg = {
            recipient: {
                // 測試中 暫時先寫死 訊息發送對象
                id: '5635068829917522'
            },
            message: {
                text: '測試訊息'
            }
        };

        console.log(req.session);
        const url = `https://graph.facebook.com/v15.0/me/messages?access_token=${req.user.pageAccessToken}`;
        axios.post(url, postMsg).then(r => {
            res.status(200).json(r.data);
        }).catch(err => {
            console.error(err);
            next(err);
        });
    }
    
    setGreeting(req, res, next) {
        // 招呼語，可以依據locale對來自不同地區的人顯示不同的招呼語
        const postData = {
            greeting: [
                {
                    locale: 'default',
                    text: 'default hello'
                },
                {
                    locale: 'zh_TW',
                    text: '歡迎語 {{user_full_name}}'
                }
            ]
        };
        const url = `https://graph.facebook.com/v15.0/me/messenger_profile?access_token=${req.user.pageAccessToken}`;
        axios.post(url, postData).then(r => {
            res.status(200).json(r.data);
        }).catch(err => {
            console.error(err);
            next(err);
        });
    }
    
    setWelcome(req, res, next) {
        const postData = {

        };
        res.status(500).json({});
    }

    setIceBreakers(req, res, next) {
        // 破冰問題，可以依據locale對來自不同地區的人顯示對應選項
        const postData = {
            ice_breakers: [
                {
                    call_to_actions: [
                        {
                            question: 'test IceBreakers 1',
                            payload: 'call test IceBreakers 1'
                        },
                    ],
                    locale: 'default'
                },
                {
                    call_to_actions: [
                        {
                            question: '破冰問題 1',
                            payload: '按下 破冰問題 1'
                        },
                        {
                            question: '破冰問題 2',
                            payload: '按下 破冰問題 2'
                        },
                    ],
                    locale: 'zh_TW'
                },
            ]
        };
        const url = `https://graph.facebook.com/v15.0/me/messenger_profile?access_token=${req.user.pageAccessToken}`;
        axios.post(url, postData).then(r => {
            res.status(200).json(r.data);
        }).catch(err => {
            console.error(err);
            next(err);
        });
    }
    
    getMessengerProfile(req, res, next) {
        const showFields = 'get_started,greeting,ice_breakers,persistent_menu';
        const url = `https://graph.facebook.com/v15.0/me/messenger_profile?fields=${showFields}&access_token=${req.user.pageAccessToken}`;
        axios.get(url).then(r => {
            console.log(url);
            res.status(200).json(r.data);
        }).catch(err => {
            console.error(err);
            next(err);
        });
    }
}

module.exports = FBAuthController;
