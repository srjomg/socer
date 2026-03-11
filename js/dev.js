const IS_DEV = true;

export function _debug(...data) {
    if (!IS_DEV) return;
    console.debug(...data);
}