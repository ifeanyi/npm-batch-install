'use strict';
/**
 * [help description]
 * @param  {[type]} name        [description]
 * @param  {[type]} description [description]
 * @return {[type]}             [description]
 */
export function help({ name, description }) {
  return (
`
Usage: ${name} [options] [packages]

${description}

Where [options] include the options below as well \'npm install\' options

Options

  -h --help               output usage information
  --version               output version number
  -B --batch-size=<num>   the number of packages per batch
`);
}


export const config = {
  alias: {
    'version': 'v',
    'help': 'h',
    'batchSize': ['B', 'batch-size']
  },
  default: {
    batchSize: 4
  },
};
