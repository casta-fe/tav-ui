// System default cache time, in seconds
export const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 7
// export const DEFAULT_CACHE_TIME = 60 * 60 * 24 * 30; // 坑！ setimeout 最大支持的时间是 2^31 - 1（24天左右） 即js中的最大整数，超过的话会立即执行。一般用户也不会打开网站这么久，就先设置7天好了

// aes encryption key
export const cacheCipher = {
  key: '_11111000001111@',
  iv: '@11111000001111_',
}

// Whether the system cache is encrypted using aes
export const enableStorageEncryption = false
