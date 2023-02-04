const isFBLoggedIn = (req, res, next) => {
    // if (req.isAuthenticated()) {
    //     console.log('T');
    // } else {
    //     console.log('F');
    // }
    
    if (req.user) {
        next();
    } else {
        res.status(401).send(`
            <p>Not FB Logged In</p>
            <a href="/">首頁</a>
        `);
    }
}
module.exports = isFBLoggedIn;