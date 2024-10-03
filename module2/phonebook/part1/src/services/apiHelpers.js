const timeout = (ms, promise) => {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Timeout exceeded :('));
      }, ms);
  
      promise.then((value) => {
        clearTimeout(timer);
        resolve(value);
      }).catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
    });
  };
  
export default timeout;