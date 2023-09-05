
const toString = (item: any) => {
  return item instanceof Error 
   ? item.stack
   : Object.prototype.toString.call(item);
};

const isNode = typeof process !== 'undefined'
  && process.release.name === 'node';

const isBrowser = new Function('try { return this === window; } catch (e) { return false; }')();

type UncaughtHandler = (err: any) => void;

export let uncaught: UncaughtHandler = (err: any) => {
  console.error('[RSLT] - [https://npm.im/rslt] - Unhandled error:', err);
};

if (isNode) {
  uncaught = (err) => {
    console.error('[RSLT] - [https://npm.im/rslt] - Unhandled error:', err);
    process.exit(1);
  };
  process.on('uncaughtException', uncaught);
  process.on('unhandledRejection', uncaught);
} 

else if (isBrowser) {
  uncaught = (err) => {
    document.body.innerHTML = `
      <h1>[RSLT] - [https://npm.im/rslt] - Unhandled error</h1>
      <pre>${toString(err)}</pre>
    `;
  };
  window.addEventListener('error', uncaught);
  window.addEventListener('unhandledrejection', uncaught);
}
