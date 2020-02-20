const server = () => {
    var mHost = window.location.hostname
    return {
        "static-qa2.lifesense.com": 'https://sports-qa.lifesense.com',
        "static-qa.lifesense.com": 'https://sports-qa.lifesense.com',
        "localhost": 'https://sports-qa.lifesense.com',
        "cdn.lifesense.com": "https://sports.lifesense.com"
    }[mHost]
}

export {
    server
}