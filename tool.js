class AppInfo {
    static getClientID() {
        return '987897987898';
    }

    static getClientSecret() {
        return '23ed3de3de23rde34r';
    }
}

class ResponseMaker {
    static getSuccessResponse(data) {
        return { status: "success", message: "success", data: data };
    }

    static getErrorResponse(message) {
        return { status: "error", message: message };
    }
}

module.exports.AppInfo = AppInfo;
module.exports.ResponseMaker = ResponseMaker;
