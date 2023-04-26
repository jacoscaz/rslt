
const _toString = (item: any) => {
  return item instanceof Error 
   ? item.stack
   : Object.prototype.toString.call(item);
};

const isNode = typeof process !== 'undefined'
  && process.release.name === 'node';

const isBrowser = new Function('try { return this === window; } catch (e) { return false; }')();

if (isNode) {

  process.on('uncaughtException', (err) => {
    console.error('[RSLT] - [https://npm.im/rslt] - Unhandled exception:', err);
    process.exit(1);
  });

  process.on('unhandledRejection', (err) => {
    console.error('[RSLT] - [https://npm.im/rslt] - Unhandled rejection:', err);
    process.exit(1);
  });

} else if (isBrowser) {

  window.addEventListener('error', (err) => {
    alert('[RSLT] - [https://npm.im/rslt] - Unhandled exception:\n' + _toString(err));      
  });

  window.addEventListener('unhandledrejection', (err) => {
    alert('[RSLT] - [https://npm.im/rslt] - Unhandled rejection:\n' + _toString(err));      
  });

}
