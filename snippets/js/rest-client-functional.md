
rest-client-functional
js
value:baseUrl
---
const createRestClient = (baseUrl = '@:value:baseUrl:@', contentType = 'application/json', accepts = 'application/json') => {
    const headers = {
        'Content-Type': contentType,
        'Accept': accepts
    };

    const request = async (endpoint, method = 'GET', body = null, isFile = false) => {
        const url = `${baseUrl}${endpoint}`;
        const options = { 
            method,
            headers: Object.assign({}, headers)
        };

        if (body) {
            if (isFile) {
                // If it's a file upload, don't set Content-Type header; let browser set it automatically
                delete options.headers['Content-Type'];
                options.body = body;
            } else {
                options.body = JSON.stringify(body);
            }
        }

        const response = await fetch(url, options);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'An error occurred');
        }

        return await response.json();
    };

    return {
        get: (endpoint) => request(endpoint, 'GET'),
        post: (endpoint, body, isFile = false) => request(endpoint, 'POST', body, isFile),
        put: (endpoint, body, isFile = false) => request(endpoint, 'PUT', body, isFile),
        delete: (endpoint) => request(endpoint, 'DELETE')
    };
};
