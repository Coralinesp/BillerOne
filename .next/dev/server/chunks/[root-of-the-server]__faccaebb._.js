module.exports = [
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:path [external] (node:path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:path", () => require("node:path"));

module.exports = mod;
}),
"[externals]/node:fs [external] (node:fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:fs", () => require("node:fs"));

module.exports = mod;
}),
"[project]/node_modules/is-docker/index.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>isDocker
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs [external] (node:fs, cjs)");
;
let isDockerCached;
function hasDockerEnv() {
    try {
        __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].statSync('/.dockerenv');
        return true;
    } catch  {
        return false;
    }
}
function hasDockerCGroup() {
    try {
        return __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].readFileSync('/proc/self/cgroup', 'utf8').includes('docker');
    } catch  {
        return false;
    }
}
function isDocker() {
    // TODO: Use `??=` when targeting Node.js 16.
    if (isDockerCached === undefined) {
        isDockerCached = hasDockerEnv() || hasDockerCGroup();
    }
    return isDockerCached;
}
}),
"[project]/node_modules/is-inside-container/index.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>isInsideContainer
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs [external] (node:fs, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$is$2d$docker$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/is-docker/index.js [app-route] (ecmascript)");
;
;
let cachedResult;
// Podman detection
const hasContainerEnv = ()=>{
    try {
        __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].statSync('/run/.containerenv');
        return true;
    } catch  {
        return false;
    }
};
function isInsideContainer() {
    // TODO: Use `??=` when targeting Node.js 16.
    if (cachedResult === undefined) {
        cachedResult = hasContainerEnv() || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$is$2d$docker$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
    }
    return cachedResult;
}
}),
"[project]/node_modules/is-wsl/index.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$process__$5b$external$5d$__$28$node$3a$process$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:process [external] (node:process, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$os__$5b$external$5d$__$28$node$3a$os$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:os [external] (node:os, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs [external] (node:fs, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$is$2d$inside$2d$container$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/is-inside-container/index.js [app-route] (ecmascript)");
;
;
;
;
const isWsl = ()=>{
    if (__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$process__$5b$external$5d$__$28$node$3a$process$2c$__cjs$29$__["default"].platform !== 'linux') {
        return false;
    }
    if (__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$os__$5b$external$5d$__$28$node$3a$os$2c$__cjs$29$__["default"].release().toLowerCase().includes('microsoft')) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$is$2d$inside$2d$container$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])()) {
            return false;
        }
        return true;
    }
    try {
        return __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["default"].readFileSync('/proc/version', 'utf8').toLowerCase().includes('microsoft') ? !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$is$2d$inside$2d$container$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])() : false;
    } catch  {
        return false;
    }
};
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$process__$5b$external$5d$__$28$node$3a$process$2c$__cjs$29$__["default"].env.__IS_WSL_TEST__ ? isWsl : isWsl();
}),
"[project]/node_modules/is-wsl/index.js [app-route] (ecmascript) <export default as isWsl>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "isWsl",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$is$2d$wsl$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$is$2d$wsl$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/is-wsl/index.js [app-route] (ecmascript)");
}),
"[project]/node_modules/wsl-utils/index.js [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "powerShellPath",
    ()=>powerShellPath,
    "powerShellPathFromWsl",
    ()=>powerShellPathFromWsl,
    "wslDrivesMountPoint",
    ()=>wslDrivesMountPoint
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$process__$5b$external$5d$__$28$node$3a$process$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:process [external] (node:process, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs/promises [external] (node:fs/promises, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$is$2d$wsl$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/is-wsl/index.js [app-route] (ecmascript)");
;
;
;
const wslDrivesMountPoint = (()=>{
    // Default value for "root" param
    // according to https://docs.microsoft.com/en-us/windows/wsl/wsl-config
    const defaultMountPoint = '/mnt/';
    let mountPoint;
    return async function() {
        if (mountPoint) {
            // Return memoized mount point value
            return mountPoint;
        }
        const configFilePath = '/etc/wsl.conf';
        let isConfigFileExists = false;
        try {
            await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["default"].access(configFilePath, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["constants"].F_OK);
            isConfigFileExists = true;
        } catch  {}
        if (!isConfigFileExists) {
            return defaultMountPoint;
        }
        const configContent = await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["default"].readFile(configFilePath, {
            encoding: 'utf8'
        });
        const configMountPoint = /(?<!#.*)root\s*=\s*(?<mountPoint>.*)/g.exec(configContent);
        if (!configMountPoint) {
            return defaultMountPoint;
        }
        mountPoint = configMountPoint.groups.mountPoint.trim();
        mountPoint = mountPoint.endsWith('/') ? mountPoint : `${mountPoint}/`;
        return mountPoint;
    };
})();
const powerShellPathFromWsl = async ()=>{
    const mountPoint = await wslDrivesMountPoint();
    return `${mountPoint}c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe`;
};
const powerShellPath = async ()=>{
    if (__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$is$2d$wsl$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]) {
        return powerShellPathFromWsl();
    }
    return `${__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$process__$5b$external$5d$__$28$node$3a$process$2c$__cjs$29$__["default"].env.SYSTEMROOT || __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$process__$5b$external$5d$__$28$node$3a$process$2c$__cjs$29$__["default"].env.windir || String.raw`C:\Windows`}\\System32\\WindowsPowerShell\\v1.0\\powershell.exe`;
};
;
}),
"[project]/node_modules/define-lazy-prop/index.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>defineLazyProperty
]);
function defineLazyProperty(object, propertyName, valueGetter) {
    const define = (value)=>Object.defineProperty(object, propertyName, {
            value,
            enumerable: true,
            writable: true
        });
    Object.defineProperty(object, propertyName, {
        configurable: true,
        enumerable: true,
        get () {
            const result = valueGetter();
            define(result);
            return result;
        },
        set (value) {
            define(value);
        }
    });
    return object;
}
}),
"[project]/node_modules/default-browser-id/index.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>defaultBrowserId
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$util__$5b$external$5d$__$28$node$3a$util$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:util [external] (node:util, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$process__$5b$external$5d$__$28$node$3a$process$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:process [external] (node:process, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$child_process__$5b$external$5d$__$28$node$3a$child_process$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:child_process [external] (node:child_process, cjs)");
;
;
;
const execFileAsync = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$util__$5b$external$5d$__$28$node$3a$util$2c$__cjs$29$__["promisify"])(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$child_process__$5b$external$5d$__$28$node$3a$child_process$2c$__cjs$29$__["execFile"]);
async function defaultBrowserId() {
    if (__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$process__$5b$external$5d$__$28$node$3a$process$2c$__cjs$29$__["default"].platform !== 'darwin') {
        throw new Error('macOS only');
    }
    const { stdout } = await execFileAsync('defaults', [
        'read',
        'com.apple.LaunchServices/com.apple.launchservices.secure',
        'LSHandlers'
    ]);
    // `(?!-)` is to prevent matching `LSHandlerRoleAll = "-";`.
    const match = /LSHandlerRoleAll = "(?!-)(?<id>[^"]+?)";\s+?LSHandlerURLScheme = (?:http|https);/.exec(stdout);
    return match?.groups.id ?? 'com.apple.Safari';
}
}),
"[project]/node_modules/run-applescript/index.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "runAppleScript",
    ()=>runAppleScript,
    "runAppleScriptSync",
    ()=>runAppleScriptSync
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$process__$5b$external$5d$__$28$node$3a$process$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:process [external] (node:process, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$util__$5b$external$5d$__$28$node$3a$util$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:util [external] (node:util, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$child_process__$5b$external$5d$__$28$node$3a$child_process$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:child_process [external] (node:child_process, cjs)");
;
;
;
const execFileAsync = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$util__$5b$external$5d$__$28$node$3a$util$2c$__cjs$29$__["promisify"])(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$child_process__$5b$external$5d$__$28$node$3a$child_process$2c$__cjs$29$__["execFile"]);
async function runAppleScript(script, { humanReadableOutput = true, signal } = {}) {
    if (__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$process__$5b$external$5d$__$28$node$3a$process$2c$__cjs$29$__["default"].platform !== 'darwin') {
        throw new Error('macOS only');
    }
    const outputArguments = humanReadableOutput ? [] : [
        '-ss'
    ];
    const execOptions = {};
    if (signal) {
        execOptions.signal = signal;
    }
    const { stdout } = await execFileAsync('osascript', [
        '-e',
        script,
        outputArguments
    ], execOptions);
    return stdout.trim();
}
function runAppleScriptSync(script, { humanReadableOutput = true } = {}) {
    if (__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$process__$5b$external$5d$__$28$node$3a$process$2c$__cjs$29$__["default"].platform !== 'darwin') {
        throw new Error('macOS only');
    }
    const outputArguments = humanReadableOutput ? [] : [
        '-ss'
    ];
    const stdout = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$child_process__$5b$external$5d$__$28$node$3a$child_process$2c$__cjs$29$__["execFileSync"])('osascript', [
        '-e',
        script,
        ...outputArguments
    ], {
        encoding: 'utf8',
        stdio: [
            'ignore',
            'pipe',
            'ignore'
        ],
        timeout: 500
    });
    return stdout.trim();
}
}),
"[project]/node_modules/bundle-name/index.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>bundleName
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$run$2d$applescript$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/run-applescript/index.js [app-route] (ecmascript)");
;
async function bundleName(bundleId) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$run$2d$applescript$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runAppleScript"])(`tell application "Finder" to set app_path to application file id "${bundleId}" as string\ntell application "System Events" to get value of property list item "CFBundleName" of property list file (app_path & ":Contents:Info.plist")`);
}
}),
"[project]/node_modules/default-browser/windows.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UnknownBrowserError",
    ()=>UnknownBrowserError,
    "default",
    ()=>defaultBrowser
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$util__$5b$external$5d$__$28$node$3a$util$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:util [external] (node:util, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$child_process__$5b$external$5d$__$28$node$3a$child_process$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:child_process [external] (node:child_process, cjs)");
;
;
const execFileAsync = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$util__$5b$external$5d$__$28$node$3a$util$2c$__cjs$29$__["promisify"])(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$child_process__$5b$external$5d$__$28$node$3a$child_process$2c$__cjs$29$__["execFile"]);
// Windows doesn't have browser IDs in the same way macOS/Linux does so we give fake
// ones that look real and match the macOS/Linux versions for cross-platform apps.
const windowsBrowserProgIds = {
    AppXq0fevzme2pys62n3e0fbqa7peapykr8v: {
        name: 'Edge',
        id: 'com.microsoft.edge.old'
    },
    MSEdgeDHTML: {
        name: 'Edge',
        id: 'com.microsoft.edge'
    },
    MSEdgeHTM: {
        name: 'Edge',
        id: 'com.microsoft.edge'
    },
    'IE.HTTP': {
        name: 'Internet Explorer',
        id: 'com.microsoft.ie'
    },
    FirefoxURL: {
        name: 'Firefox',
        id: 'org.mozilla.firefox'
    },
    ChromeHTML: {
        name: 'Chrome',
        id: 'com.google.chrome'
    },
    BraveHTML: {
        name: 'Brave',
        id: 'com.brave.Browser'
    },
    BraveBHTML: {
        name: 'Brave Beta',
        id: 'com.brave.Browser.beta'
    },
    BraveSSHTM: {
        name: 'Brave Nightly',
        id: 'com.brave.Browser.nightly'
    }
};
class UnknownBrowserError extends Error {
}
async function defaultBrowser(_execFileAsync = execFileAsync) {
    const { stdout } = await _execFileAsync('reg', [
        'QUERY',
        ' HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\Shell\\Associations\\UrlAssociations\\http\\UserChoice',
        '/v',
        'ProgId'
    ]);
    const match = /ProgId\s*REG_SZ\s*(?<id>\S+)/.exec(stdout);
    if (!match) {
        throw new UnknownBrowserError(`Cannot find Windows browser in stdout: ${JSON.stringify(stdout)}`);
    }
    const { id } = match.groups;
    const browser = windowsBrowserProgIds[id];
    if (!browser) {
        throw new UnknownBrowserError(`Unknown browser ID: ${id}`);
    }
    return browser;
}
}),
"[project]/node_modules/default-browser/index.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>defaultBrowser
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$util__$5b$external$5d$__$28$node$3a$util$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:util [external] (node:util, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$process__$5b$external$5d$__$28$node$3a$process$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:process [external] (node:process, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$child_process__$5b$external$5d$__$28$node$3a$child_process$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:child_process [external] (node:child_process, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$default$2d$browser$2d$id$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/default-browser-id/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bundle$2d$name$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bundle-name/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$default$2d$browser$2f$windows$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/default-browser/windows.js [app-route] (ecmascript)");
;
;
;
;
;
;
const execFileAsync = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$util__$5b$external$5d$__$28$node$3a$util$2c$__cjs$29$__["promisify"])(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$child_process__$5b$external$5d$__$28$node$3a$child_process$2c$__cjs$29$__["execFile"]);
// Inlined: https://github.com/sindresorhus/titleize/blob/main/index.js
const titleize = (string)=>string.toLowerCase().replaceAll(/(?:^|\s|-)\S/g, (x)=>x.toUpperCase());
async function defaultBrowser() {
    if (__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$process__$5b$external$5d$__$28$node$3a$process$2c$__cjs$29$__["default"].platform === 'darwin') {
        const id = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$default$2d$browser$2d$id$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        const name = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bundle$2d$name$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(id);
        return {
            name,
            id
        };
    }
    if (__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$process__$5b$external$5d$__$28$node$3a$process$2c$__cjs$29$__["default"].platform === 'linux') {
        const { stdout } = await execFileAsync('xdg-mime', [
            'query',
            'default',
            'x-scheme-handler/http'
        ]);
        const id = stdout.trim();
        const name = titleize(id.replace(/.desktop$/, '').replace('-', ' '));
        return {
            name,
            id
        };
    }
    if (__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$process__$5b$external$5d$__$28$node$3a$process$2c$__cjs$29$__["default"].platform === 'win32') {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$default$2d$browser$2f$windows$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
    }
    throw new Error('Only macOS, Linux, and Windows are supported');
}
}),
"[project]/node_modules/open/index.js [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "apps",
    ()=>apps,
    "default",
    ()=>__TURBOPACK__default__export__,
    "openApp",
    ()=>openApp
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$process__$5b$external$5d$__$28$node$3a$process$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:process [external] (node:process, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:buffer [external] (node:buffer, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:path [external] (node:path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$url__$5b$external$5d$__$28$node$3a$url$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:url [external] (node:url, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$util__$5b$external$5d$__$28$node$3a$util$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:util [external] (node:util, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$child_process__$5b$external$5d$__$28$node$3a$child_process$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:child_process [external] (node:child_process, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs/promises [external] (node:fs/promises, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$is$2d$wsl$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__isWsl$3e$__ = __turbopack_context__.i("[project]/node_modules/is-wsl/index.js [app-route] (ecmascript) <export default as isWsl>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wsl$2d$utils$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/wsl-utils/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$define$2d$lazy$2d$prop$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/define-lazy-prop/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$default$2d$browser$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/default-browser/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$is$2d$inside$2d$container$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/is-inside-container/index.js [app-route] (ecmascript)");
const __TURBOPACK__import$2e$meta__ = {
    get url () {
        return `file://${__turbopack_context__.P("node_modules/open/index.js")}`;
    }
};
;
;
;
;
;
;
;
;
;
;
;
const execFile = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$util__$5b$external$5d$__$28$node$3a$util$2c$__cjs$29$__["promisify"])(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$child_process__$5b$external$5d$__$28$node$3a$child_process$2c$__cjs$29$__["default"].execFile);
// Path to included `xdg-open`.
const __dirname = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].dirname((0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$url__$5b$external$5d$__$28$node$3a$url$2c$__cjs$29$__["fileURLToPath"])(__TURBOPACK__import$2e$meta__.url));
const localXdgOpenPath = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$path__$5b$external$5d$__$28$node$3a$path$2c$__cjs$29$__["default"].join(__dirname, 'xdg-open');
const { platform, arch } = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$process__$5b$external$5d$__$28$node$3a$process$2c$__cjs$29$__["default"];
/**
Get the default browser name in Windows from WSL.

@returns {Promise<string>} Browser name.
*/ async function getWindowsDefaultBrowserFromWsl() {
    const powershellPath = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wsl$2d$utils$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["powerShellPath"])();
    const rawCommand = String.raw`(Get-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\Shell\Associations\UrlAssociations\http\UserChoice").ProgId`;
    const encodedCommand = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__["Buffer"].from(rawCommand, 'utf16le').toString('base64');
    const { stdout } = await execFile(powershellPath, [
        '-NoProfile',
        '-NonInteractive',
        '-ExecutionPolicy',
        'Bypass',
        '-EncodedCommand',
        encodedCommand
    ], {
        encoding: 'utf8'
    });
    const progId = stdout.trim();
    // Map ProgId to browser IDs
    const browserMap = {
        ChromeHTML: 'com.google.chrome',
        BraveHTML: 'com.brave.Browser',
        MSEdgeHTM: 'com.microsoft.edge',
        FirefoxURL: 'org.mozilla.firefox'
    };
    return browserMap[progId] ? {
        id: browserMap[progId]
    } : {};
}
const pTryEach = async (array, mapper)=>{
    let latestError;
    for (const item of array){
        try {
            return await mapper(item); // eslint-disable-line no-await-in-loop
        } catch (error) {
            latestError = error;
        }
    }
    throw latestError;
};
// eslint-disable-next-line complexity
const baseOpen = async (options)=>{
    options = {
        wait: false,
        background: false,
        newInstance: false,
        allowNonzeroExitCode: false,
        ...options
    };
    if (Array.isArray(options.app)) {
        return pTryEach(options.app, (singleApp)=>baseOpen({
                ...options,
                app: singleApp
            }));
    }
    let { name: app, arguments: appArguments = [] } = options.app ?? {};
    appArguments = [
        ...appArguments
    ];
    if (Array.isArray(app)) {
        return pTryEach(app, (appName)=>baseOpen({
                ...options,
                app: {
                    name: appName,
                    arguments: appArguments
                }
            }));
    }
    if (app === 'browser' || app === 'browserPrivate') {
        // IDs from default-browser for macOS and windows are the same
        const ids = {
            'com.google.chrome': 'chrome',
            'google-chrome.desktop': 'chrome',
            'com.brave.Browser': 'brave',
            'org.mozilla.firefox': 'firefox',
            'firefox.desktop': 'firefox',
            'com.microsoft.msedge': 'edge',
            'com.microsoft.edge': 'edge',
            'com.microsoft.edgemac': 'edge',
            'microsoft-edge.desktop': 'edge'
        };
        // Incognito flags for each browser in `apps`.
        const flags = {
            chrome: '--incognito',
            brave: '--incognito',
            firefox: '--private-window',
            edge: '--inPrivate'
        };
        const browser = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$is$2d$wsl$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__isWsl$3e$__["isWsl"] ? await getWindowsDefaultBrowserFromWsl() : await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$default$2d$browser$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])();
        if (browser.id in ids) {
            const browserName = ids[browser.id];
            if (app === 'browserPrivate') {
                appArguments.push(flags[browserName]);
            }
            return baseOpen({
                ...options,
                app: {
                    name: apps[browserName],
                    arguments: appArguments
                }
            });
        }
        throw new Error(`${browser.name} is not supported as a default browser`);
    }
    let command;
    const cliArguments = [];
    const childProcessOptions = {};
    if (platform === 'darwin') {
        command = 'open';
        if (options.wait) {
            cliArguments.push('--wait-apps');
        }
        if (options.background) {
            cliArguments.push('--background');
        }
        if (options.newInstance) {
            cliArguments.push('--new');
        }
        if (app) {
            cliArguments.push('-a', app);
        }
    } else if (platform === 'win32' || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$is$2d$wsl$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__isWsl$3e$__["isWsl"] && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$is$2d$inside$2d$container$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])() && !app) {
        command = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$wsl$2d$utils$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["powerShellPath"])();
        cliArguments.push('-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-EncodedCommand');
        if (!__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$is$2d$wsl$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__isWsl$3e$__["isWsl"]) {
            childProcessOptions.windowsVerbatimArguments = true;
        }
        const encodedArguments = [
            'Start'
        ];
        if (options.wait) {
            encodedArguments.push('-Wait');
        }
        if (app) {
            // Double quote with double quotes to ensure the inner quotes are passed through.
            // Inner quotes are delimited for PowerShell interpretation with backticks.
            encodedArguments.push(`"\`"${app}\`""`);
            if (options.target) {
                appArguments.push(options.target);
            }
        } else if (options.target) {
            encodedArguments.push(`"${options.target}"`);
        }
        if (appArguments.length > 0) {
            appArguments = appArguments.map((argument)=>`"\`"${argument}\`""`);
            encodedArguments.push('-ArgumentList', appArguments.join(','));
        }
        // Using Base64-encoded command, accepted by PowerShell, to allow special characters.
        options.target = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__["Buffer"].from(encodedArguments.join(' '), 'utf16le').toString('base64');
    } else {
        if (app) {
            command = app;
        } else {
            // When bundled by Webpack, there's no actual package file path and no local `xdg-open`.
            const isBundled = !__dirname || __dirname === '/';
            // Check if local `xdg-open` exists and is executable.
            let exeLocalXdgOpen = false;
            try {
                await __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["default"].access(localXdgOpenPath, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs$2f$promises__$5b$external$5d$__$28$node$3a$fs$2f$promises$2c$__cjs$29$__["constants"].X_OK);
                exeLocalXdgOpen = true;
            } catch  {}
            const useSystemXdgOpen = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$process__$5b$external$5d$__$28$node$3a$process$2c$__cjs$29$__["default"].versions.electron ?? (platform === 'android' || isBundled || !exeLocalXdgOpen);
            command = useSystemXdgOpen ? 'xdg-open' : localXdgOpenPath;
        }
        if (appArguments.length > 0) {
            cliArguments.push(...appArguments);
        }
        if (!options.wait) {
            // `xdg-open` will block the process unless stdio is ignored
            // and it's detached from the parent even if it's unref'd.
            childProcessOptions.stdio = 'ignore';
            childProcessOptions.detached = true;
        }
    }
    if (platform === 'darwin' && appArguments.length > 0) {
        cliArguments.push('--args', ...appArguments);
    }
    // This has to come after `--args`.
    if (options.target) {
        cliArguments.push(options.target);
    }
    const subprocess = __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$child_process__$5b$external$5d$__$28$node$3a$child_process$2c$__cjs$29$__["default"].spawn(command, cliArguments, childProcessOptions);
    if (options.wait) {
        return new Promise((resolve, reject)=>{
            subprocess.once('error', reject);
            subprocess.once('close', (exitCode)=>{
                if (!options.allowNonzeroExitCode && exitCode > 0) {
                    reject(new Error(`Exited with code ${exitCode}`));
                    return;
                }
                resolve(subprocess);
            });
        });
    }
    subprocess.unref();
    return subprocess;
};
const open = (target, options)=>{
    if (typeof target !== 'string') {
        throw new TypeError('Expected a `target`');
    }
    return baseOpen({
        ...options,
        target
    });
};
const openApp = (name, options)=>{
    if (typeof name !== 'string' && !Array.isArray(name)) {
        throw new TypeError('Expected a valid `name`');
    }
    const { arguments: appArguments = [] } = options ?? {};
    if (appArguments !== undefined && appArguments !== null && !Array.isArray(appArguments)) {
        throw new TypeError('Expected `appArguments` as Array type');
    }
    return baseOpen({
        ...options,
        app: {
            name,
            arguments: appArguments
        }
    });
};
function detectArchBinary(binary) {
    if (typeof binary === 'string' || Array.isArray(binary)) {
        return binary;
    }
    const { [arch]: archBinary } = binary;
    if (!archBinary) {
        throw new Error(`${arch} is not supported`);
    }
    return archBinary;
}
function detectPlatformBinary({ [platform]: platformBinary }, { wsl }) {
    if (wsl && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$is$2d$wsl$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__default__as__isWsl$3e$__["isWsl"]) {
        return detectArchBinary(wsl);
    }
    if (!platformBinary) {
        throw new Error(`${platform} is not supported`);
    }
    return detectArchBinary(platformBinary);
}
const apps = {};
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$define$2d$lazy$2d$prop$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(apps, 'chrome', ()=>detectPlatformBinary({
        darwin: 'google chrome',
        win32: 'chrome',
        linux: [
            'google-chrome',
            'google-chrome-stable',
            'chromium'
        ]
    }, {
        wsl: {
            ia32: '/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe',
            x64: [
                '/mnt/c/Program Files/Google/Chrome/Application/chrome.exe',
                '/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe'
            ]
        }
    }));
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$define$2d$lazy$2d$prop$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(apps, 'brave', ()=>detectPlatformBinary({
        darwin: 'brave browser',
        win32: 'brave',
        linux: [
            'brave-browser',
            'brave'
        ]
    }, {
        wsl: {
            ia32: '/mnt/c/Program Files (x86)/BraveSoftware/Brave-Browser/Application/brave.exe',
            x64: [
                '/mnt/c/Program Files/BraveSoftware/Brave-Browser/Application/brave.exe',
                '/mnt/c/Program Files (x86)/BraveSoftware/Brave-Browser/Application/brave.exe'
            ]
        }
    }));
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$define$2d$lazy$2d$prop$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(apps, 'firefox', ()=>detectPlatformBinary({
        darwin: 'firefox',
        win32: String.raw`C:\Program Files\Mozilla Firefox\firefox.exe`,
        linux: 'firefox'
    }, {
        wsl: '/mnt/c/Program Files/Mozilla Firefox/firefox.exe'
    }));
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$define$2d$lazy$2d$prop$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(apps, 'edge', ()=>detectPlatformBinary({
        darwin: 'microsoft edge',
        win32: 'msedge',
        linux: [
            'microsoft-edge',
            'microsoft-edge-dev'
        ]
    }, {
        wsl: '/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
    }));
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$define$2d$lazy$2d$prop$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(apps, 'browser', ()=>'browser');
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$define$2d$lazy$2d$prop$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])(apps, 'browserPrivate', ()=>'browserPrivate');
const __TURBOPACK__default__export__ = open;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__faccaebb._.js.map