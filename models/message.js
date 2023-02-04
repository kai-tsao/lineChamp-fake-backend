class Message {
    id;
    title;
    messageContentList;
    constructor(input) {
        this.id = (input?.id) ? input.id : null;
        this.title = input.title;
        this.messageContentList = (input?.messageContentList) ? input.messageContentList : [];
    }
}

class MessageContent {
    id;
    type;
    detail;
    message_id;
    constructor(input) {
        this.id = (input?.id) ? input.id : null;
        this.type = input.type;
        this.detail = input.detail;
        this.message_id = input.message_id;
    }
    
    sendMessage() {
        
    }
}

class AutoResponse {
    targetUserId = null;
    
    constructor(userId) {
        this.targetUserId = userId;
    }
    
    reply() {
        
    }
}

module.exports.Message = Message;
module.exports.MessageContent = MessageContent;