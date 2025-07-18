#!/usr/bin/env node
import commandLineArgs from 'command-line-args'
import { start } from '../lib/index.js';
import { log } from '../lib/logger.js';

const optionDefinitions = [
    // Target API base URL
    { name: 'target', alias: 'a', type: String },
    // Proxy port to listen on
    { name: 'port', alias: 'n', type: Number, defaultValue: 3001 },
    // Proxy path
    { name: 'path', alias: 'p', type: String, defaultValue: 'proxy' },
    // Value for Access-Control-Allow-Origin 
    { name: 'origin', alias: 'o', type: String, defaultValue: '*'}
]

const parseCmdArgs = () => {
    try {
        return commandLineArgs(optionDefinitions);
    } catch(err) {
        if (err.name === 'INVALID_DEFINITIONS') {
            log.error('Oops... this version has a bug and is unusable ☹️')
            return;
        }
        log.error('Invalid command line arguments');
    }
}

const optionsFromCmdArgs = (cmdArgs) => {
    // No arguments
    if (!cmdArgs) {
        log.error('Command line arguments are missing');
        return;
    }

    let target = targetOption(cmdArgs.target);
    let port = portOption(cmdArgs.port);
    let path = pathOption(cmdArgs.path);
    let origin = cmdArgs.origin; // No sanitization or validation

    if (!target || !port || !path || !origin) {
        return;
    }

    return {
        target,
        port,
        path,
        origin
    }
}

const targetOption = (targetArg) => {
    // Required
    if (!targetArg) {
        log.error('Required command line argument \'target\' is missing');
        return;
    }
    // Remove trailing slash
    let target = targetArg.replace(/\/$/, '');

    // Validate URL
    try {
        let url = new URL(target);
        return url.href;
    } catch {
        log.error('Command line argument \'target\' must be a valid URL');
        return;
    }
}

const portOption = (portArg) => {
    // Validate range
    if (portArg < 0 || portArg > 65535) {
        log.error('Command line argument \'port\' must be in range [0, 65535]');
        return;
    }
    return portArg;
}

const pathOption = (pathArg) => {
    // Remove leading and trailing slashes
    let path = pathArg.replace(/\/$/, '').replace(/^\//, '');

    // Validate not empty
    if(path === '') {
        return;
    }

    return path;
}

const showHelp = () => {
    log.important('Usage:');
    log.info('    npm start -- --target URL [--port number] [--path string] [--origin string]');
    log.info('    npm start -- -a URL [-n number] [-p string] [-o string]');
    log.important('Example:');
    log.info('    npm start -- --target https://example.com/api')
    log.info('    npm start -- -a https://example.com/api -n 1234 -p proxyme')
}

let cmdArgs = parseCmdArgs();
let options = optionsFromCmdArgs(cmdArgs);

if(options) {
    start(options.port, options.path, options.target, options.origin);
} else {
    showHelp();
}