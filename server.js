const express = require ('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const { StartDB } = require('./db');
const webhookRoutes = require('./routes/webhook-route');
const appRoutes = require('./routes/app-route');
const fbAuthRoutes = require('./routes/fb-auth-route');
const merchantRoutes = require('./routes/merchant-route');

StartDB.init();

app.use(cors({
    origin: '*'
}));

app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));
app.use(cookieParser());

app.use(session({
    secret: 'fb-auth-profile',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
    // https的話要加入 cookie: { secure: true }
}));

app.use(passport.initialize());
app.use(passport.session());
require('./passport');

app.get('/', (req, res) => {
    res.send(`<ul>
        <li><a href="/app/getAppWebhookFields">取得應用程式webhook訂閱欄位設定</a></li> 
        <li><a href="/app/setAppWebhookFields">設定應用程式webhook訂閱欄位</a></li> 
        <li><a href="/fbAuth/facebook">FB Login</a></li>
        <li><a href="/fbAuth/status">Status</a></li>
        <li><a href="/fbAuth/showSession">ShowSession</a></li> 
        <li><a href="/fbAuth/setPageWebhook">設定粉專webhook</a></li> 
        <li><a href="/fbAuth/getPageWebhookFields">取得粉專webhook訂閱欄位設定</a></li> 
        <li><a href="/fbAuth/getMessengerProfile">GetMessengerProfile(粉絲專頁Messenger設定)</a></li>
        <li><a href="/fbAuth/setGreeting">SetGreeting(設定問候語)</a></li>
        <li><a href="/fbAuth/setIceBreakers">setIceBreakers(設定破冰問題)</a></li>
        
        <li><a href="/fbAuth/logoutRedirect">登出</a></li>
    </ul>`);
})

app.use('/webhook', webhookRoutes);
app.use('/app', appRoutes);
app.use('/fbAuth', fbAuthRoutes);
app.use('/api', merchantRoutes);

app.listen(3101, () => {
    console.log('Your app is listening on port 3101')
});

process.on('SIGINT', async () => {
    console.log('退出');
    await StartDB.close();
    process.exit(0);
});