const f = require('./lib/index.js').default
const chalk = require('chalk')

console.log(chalk.yellow('before defining:'), f)

f.define('lets try')
 .define('this thing')
 .define('if 0 === 0 {}')
 .startAll()

console.log(chalk.green('after defining:'), f)

setTimeout(() => f.stop('lets try'), 2000)
setTimeout(() => f.stop('this thing'), 4000)
setTimeout(() => f.stop('if 0 === 0 {}'), 7000)
