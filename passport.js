const passport = require('passport');
const { AppInfo } = require('./tool');
const { DB } = require('./db');
const axios = require("axios");
const FacebookStrategy = require('passport-facebook').Strategy;

passport.serializeUser(function (user, done) {
    process.nextTick(function() {
        // console.log('serializeUser', user);
        return done(null, user);
    });
});

passport.deserializeUser(function (user, done) {
    process.nextTick(function () {
        // console.log('deserializeUser', user);
        return done(null, user);
    });
});

passport.use(new FacebookStrategy({
        clientID: AppInfo.getClientID(),
        clientSecret: AppInfo.getClientSecret(),
        callbackURL: "http://localhost:5000/fbAuth/facebook/callback",
        passReqToCallback: true
    },
    function (req, accessToken, refreshToken, profile, done) {
        if (!req.query?.state) throw Error('callback state 不正確');
        const state = JSON.parse(req.query.state);
        console.log(state);
        if (state.id !== req.session.fbState.id) throw Error('驗證失敗');
        
        // 用短期用戶權杖去換長期用戶權杖，時限60天。因為用長期用戶權杖取得的粉絲專頁權杖才會是無限期的
        const url = `https://graph.facebook.com/v15.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${AppInfo.getClientID()}` +
        `&client_secret=${AppInfo.getClientSecret()}&fb_exchange_token=${accessToken}`;
        
        axios.get(url).then(r => {
            const longLivedUserAccessToken = r.data.access_token;
            let userData = {
                profile: profile,
                accessToken: longLivedUserAccessToken,
                pageId: '',
                pageAccessToken: '',
                refreshToken: refreshToken //FB官方沒有提供
            };
            
            // TODO：這裡應該要先檢查DB中該粉專是否有粉專Token了，如果沒有才要去拿
            // 注意：這裡access_token要用長期用戶權杖，否則只會拿到短期的粉絲專頁權杖(一小時)
            axios.get(`https://graph.facebook.com/v15.0/me/accounts?access_token=${longLivedUserAccessToken}`).then(r2 => {
                // 注意：一個用戶可能有複數的粉絲專頁
                userData.pageId = r2.data.data[0]?.id;
                userData.pageAccessToken = r2.data.data[0]?.access_token;
                const db = new DB();
                db.updateMerchantFBPageToken(req.session.fbState.mId, userData.pageAccessToken).then(dbResult => {
                    req.session.fbState = null;
                    console.log(dbResult);
                    return done(null, userData);
                });
            }).catch(err => {
                console.error(err);
            });
        }).catch(err => {
            console.error(err);
            return done(null, {error: err});
        });
    }
));