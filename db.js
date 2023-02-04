const sqlite3 = require('sqlite3').verbose();

let openDB = null;

class StartDB {
    static init() {
        openDB = new sqlite3.Database('./testDB.db', (err) => {
            if (err !== null) console.error(err);
        });
        
        // 初始化DB
        openDB.run(`CREATE TABLE IF NOT EXISTS merchant (
            id      INTEGER PRIMARY KEY AUTOINCREMENT,
            name    TEXT    NOT NULL,
            facebook_page_access_token     TEXT,
            instagram_page_access_token    TEXT
        );`);
        openDB.run(`CREATE TABLE IF NOT EXISTS message (
            id      INTEGER PRIMARY KEY AUTOINCREMENT,
            title   TEXT        NOT NULL
        );`);
        openDB.run(`CREATE TABLE IF NOT EXISTS message_content (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            type        TEXT        NOT NULL,
            detail      TEXT,
            message_id  INTEGER     NOT NULL
        );`);
    }

    static close() {
        return new Promise((resolve, reject) => {
            openDB.close(() => {
                resolve();
            });
        });
    }
}

class DB {
    constructor() {
        if (openDB === null || openDB === undefined) {
            throw new Error('DB沒有開啟');
        }
    }

    insertMerchant(data) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO merchant (name, facebook_page_access_token, instagram_page_access_token) VALUES (?,?,?)`;
            openDB.run(sql, [data.name, data.facebookPageAccessToken, data.instagramPageAccessToken], function (err) {
                if (err === null) {
                    resolve(this.lastID);
                } else {
                    reject(err);
                }
            }); 
        });
    }

    getMerchant(id) {
        return new Promise((resolve, reject) => {
            if (id === null || id === '' || id === undefined) reject('ID不合法');  
            let sql = `
            SELECT id,name, 
            CASE 
                WHEN facebook_page_access_token IS NULL THEN 'False' 
                WHEN facebook_page_access_token='' THEN 'False' 
                ELSE 'True' 
            END AS bindingFacebook,
            CASE 
                WHEN instagram_page_access_token IS NULL  THEN 'False' 
                WHEN instagram_page_access_token='' THEN 'False' 
                ELSE 'True' 
            END AS bindingInstagram
            FROM merchant WHERE id=?`;
            openDB.get(sql, [id], function (err, row) {
                if (err === null) {
                    resolve(row);
                } else {
                    reject(err);
                }
            });
        });
    }

    getMerchantList() {
        return new Promise((resolve, reject) => {
            let sql = `
            SELECT id,name, 
            CASE 
                WHEN facebook_page_access_token IS NULL THEN 'False' 
                WHEN facebook_page_access_token='' THEN 'False' 
                ELSE 'True' 
            END AS bindingFacebook,
            CASE 
                WHEN instagram_page_access_token IS NULL  THEN 'False' 
                WHEN instagram_page_access_token='' THEN 'False' 
                ELSE 'True' 
            END AS bindingInstagram
            FROM merchant`;
            openDB.all(sql, (err, rows) => {
                if (err === null) {
                    resolve(rows);
                } else {
                    reject(err);
                }
            });
        });
    }

    updateMerchant(data) {
        return new Promise((resolve, reject) => {
            openDB.run(`UPDATE merchant SET name=?,facebook_page_access_token=?,instagram_page_access_token=? WHERE id=?`,
                [data.name, data.facebookPageAccessToken, data.instagramPageAccessToken, data.id], function (err) {
                    if (err === null) {
                        resolve(this.lastID);
                    } else {
                        reject(err);
                    }
                });
        });
    }

    updateMerchantFBPageToken(merchantId, pageToken) {
        return new Promise((resolve, reject) => {
            openDB.run(`UPDATE merchant SET facebook_page_access_token=? WHERE id=?`,
                [pageToken, merchantId], function (err) {
                    if (err === null) {
                        resolve(this.lastID);
                    } else {
                        reject(err);
                    }
                });
        });
    }

    deleteMerchant(merchantId) {
        return new Promise((resolve, reject) => {
            openDB.run(`DELETE FROM merchant WHERE id=?`, [merchantId], function (err) {
                if (err === null) {
                    resolve(this.lastID);
                } else {
                    reject(err);
                }
            }); 
        });
    }
}

module.exports.StartDB = StartDB;
module.exports.DB = DB;