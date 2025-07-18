import chalk from 'chalk';

const log = {

    info: (msg) => {
        console.log(`${new Date()} ${msg}`)
    },

    important: (msg) => {
        console.log(chalk.bold(msg));
    },

    dictionary: (dict) => {
        for (const key in dict) {
            console.log(chalk.blue(`   ${key}: ${dict[key]}`));
        }
    }
}

export { log };