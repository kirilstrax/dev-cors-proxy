import axios from 'axios';
import express from 'express';
import { log } from './logger.js';

const app = express();
app.use(express.json());

var start = (port, path, targetUrl, allowOrigin, allowMethods, allowHeaders) => {

    const proxyUrl = `http://localhost:${port}/${path}/`;

    // Add cors headers
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', allowOrigin);
        res.setHeader('Access-Control-Allow-Methods', allowMethods);
        res.setHeader('Access-Control-Allow-Headers', allowHeaders);
        if (req.method === 'OPTIONS') return res.sendStatus(200);
        next();
    });

    app.all(`/${path}/*apiPath`, async (req, res) => {
        const endpoint = req.url.replace(`/${path}/`, ''); // gets the path after /proxy/
        const url = `${targetUrl}/${endpoint}`;
        log.debug(`Proxied ${req.method} ${endpoint} -> ${url}`);
        
        try {
            const response = await axios({
                method: req.method,
                url: url,
                headers: {
                    ...req.headers,
                    host: undefined // avoid passing the wrong Host header
                },
                data: req.body
            });

            res.status(response.status).json(response.data);
        } catch (error) {
            const status = error.response?.status || 500;
            const message = error.response?.data || error.message;
            res.status(status).json({ error: message });
        }
    });

    // Start the proxy server
    app.listen(port, () => {
        log.important(`🚀 Proxy started at ${proxyUrl}`);
        log.dictionary({
            "Port": port,
            "Path": path,
            "Target URL": targetUrl,
            "Allow Origin": allowOrigin,
            "Allow Methods": allowMethods,
            "Allow Headers": allowHeaders
        });
    });

    
}

export { start };