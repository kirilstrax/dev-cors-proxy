#!/usr/bin/env node
import commandLineArgs from 'command-line-args'
import { start } from '../lib/index.js';
import { log } from '../lib/logger.js';

const optionDefinitions = [
    { name: 'target', alias: 'a', type: String, description: 'Target API base URL.' },
    { name: 'port', alias: 'n', type: Number, defaultValue: 3001, description: 'Proxy port to listen on.' },
    { name: 'path', alias: 'p', type: String, defaultValue: 'proxy', description: 'Proxy path.' },
    { name: 'origin', alias: 'o', type: String, defaultValue: '*', description: 'Value for Access-Control-Allow-Origin.' },
    { name: 'methods', alias: 'm', type: String, defaultValue: 'GET, POST, PUT, DELETE, OPTIONS', description: 'Value for Access-Control-Allow-Methods.' },
    { name: 'headers', alias: 'h', type: String, defaultValue: 'Content-Type, Authorization', description: 'Value for Access-Control-Allow-Headers.' }
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

    if (!target || !port || !path) {
        return;
    }

    // No sanitization or validation for header values
    let { origin, methods, headers } = cmdArgs; 
    if (!origin || !methods || !headers) {
        log.error(`Value for header is missing or has no default:\n\torigin: ${origin}\n\tmethods: ${methods}\n\theaders: ${headers}`);
        return;
    }

    return {
        target,
        port,
        path,
        origin,
        methods,
        headers
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
    log.info('    npm start -- --target URL [--port number] [--path string] [--origin string] [--methods string] [--headers string');
    log.info('    npm start -- -a URL [-n number] [-p string] [-o string] [-m string] [-h string');
    log.important('Parameters:');
    for (const param of optionDefinitions) {
        let paramHelp = '    --' + param.name + '\tor -' + param.alias + ':\t' + param.description;
        if (param.defaultValue) {
            paramHelp += ' Default: ' + param.defaultValue;
        } else {
            paramHelp += ' Required.';
        }
        log.info(paramHelp)
    }
    log.important('Example:');
    log.info('    npm start -- --target https://example.com/api')
    log.info('    npm start -- -a https://example.com/api -n 1234 -p proxyme')
}

let cmdArgs = parseCmdArgs();
let options = optionsFromCmdArgs(cmdArgs);

if(options) {
    start(options.port, options.path, options.target, options.origin, options.methods, options.headers);
} else {
    showHelp();
}