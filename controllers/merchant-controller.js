const { DB } = require('../db');
const { ResponseMaker } = require('../tool');
const Merchant = require('../models/merchant');

class MerchantController {

    constructor() {}

    async getMerchantList(req, res) {
        try {
            const db = new DB();
            const result = await db.getMerchantList();
            res.json(ResponseMaker.getSuccessResponse(result));
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    }

    async getMerchant(req, res) {
        try {
            if (req.query?.id) {
                const db = new DB();
                const result = await db.getMerchant(req.query.id);
                res.json(ResponseMaker.getSuccessResponse(result));   
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    }

    async createMerchant(req, res) {
        try {
            if (req.body?.name) {
                let data = new Merchant(req.body);
                const db = new DB();
                const result = await db.insertMerchant(data);
                res.send(ResponseMaker.getSuccessResponse(null));
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    }

    async updateMerchant(req, res) {
        try {
            if (req.body?.id && req.body?.name) {
                let data = new Merchant(req.body);
                const db = new DB();
                const result = await db.updateMerchant(data);
                res.send(ResponseMaker.getSuccessResponse(null));
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    }

    async deleteMerchant(req, res) {
        try {
            if (req.query?.merchantId) {
                const db = new DB();
                const result = await db.deleteMerchant(req.query.merchantId);
                res.send(ResponseMaker.getSuccessResponse(null));
            } else {
                res.sendStatus(400);
            }
        } catch (e) {
            console.error(e);
            res.sendStatus(500);
        }
    }
}

module.exports = MerchantController;
