import chalk from 'chalk';

const log = {

    info: (msg) => {
        console.log(msg)
    },

    debug: (msg) => {
        console.log(chalk.dim(`${new Date()}`) + msg)
    },

    important: (msg) => {
        console.log(chalk.bold(msg));
    },

    dictionary: (dict) => {
        for (const key in dict) {
            console.log(chalk.blue.bold(key) + ': ' + chalk.blue(dict[key]));
        }
    },

    error: (msg) => {
        console.log(chalk.red(msg));
    }
}

export { log };