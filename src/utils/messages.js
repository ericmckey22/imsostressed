const generateMessage = (username, text) => {
    return {
        username,
        text, 
        createdAt: new Date().getTime()
    }
}

const generateLocationMessage = (username, url) => {
    return {
        username,
        url,
        createdAt: new Date().getTime()
    }
}

const generateEmoticonMessage = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

const generatePrivateMessage = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

const generateUserTyping = (username, text) => {
    return {
        username,
        text
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage,
    generateEmoticonMessage,
    generateUserTyping,
    generatePrivateMessage
}