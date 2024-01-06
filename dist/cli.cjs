#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var globby_1 = require("globby");
var node_fs_1 = require("node:fs");
var get_stdin_1 = require("get-stdin");
var index_js_1 = require("./index.js");
var reporter_js_1 = require("./reporter.js");
function showVersion() {
    var _a = JSON.parse(node_fs_1["default"].readFileSync(new URL('package.json', import.meta.url))), name = _a.name, version = _a.version;
    console.log("".concat(name, " ").concat(version));
}
function showHelpInformation() {
    console.log("Usage: sort-package-json [options] [file/glob ...]\n\nSort package.json files.\nIf file/glob is omitted, './package.json' file will be processed.\n\n  -c, --check   Check if files are sorted\n  -q, --quiet   Don't output success messages\n  -h, --help    Display this help\n  -v, --version Display the package version\n  --stdin       Read package.json from stdin\n  ");
}
function sortPackageJsonFile(file, reporter, isCheck) {
    var original = node_fs_1["default"].readFileSync(file, 'utf8');
    var sorted = (0, index_js_1["default"])(original);
    if (sorted === original) {
        return reporter.reportNotChanged(file);
    }
    if (!isCheck) {
        node_fs_1["default"].writeFileSync(file, sorted);
    }
    reporter.reportChanged(file);
}
function sortPackageJsonFiles(patterns, options) {
    var files = (0, globby_1.globbySync)(patterns);
    var reporter = new reporter_js_1["default"](files, options);
    var isCheck = options.isCheck;
    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
        var file = files_1[_i];
        try {
            sortPackageJsonFile(file, reporter, isCheck);
        }
        catch (error) {
            reporter.reportFailed(file, error);
        }
    }
    reporter.printSummary();
}
function sortPackageJsonFromStdin() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    _b = (_a = process.stdout).write;
                    _c = index_js_1["default"];
                    return [4 /*yield*/, (0, get_stdin_1["default"])()];
                case 1:
                    _b.apply(_a, [_c.apply(void 0, [_d.sent()])]);
                    return [2 /*return*/];
            }
        });
    });
}
function run() {
    var cliArguments = process.argv.slice(2);
    if (cliArguments.some(function (argument) { return argument === '--help' || argument === '-h'; })) {
        return showHelpInformation();
    }
    if (cliArguments.some(function (argument) { return argument === '--version' || argument === '-v'; })) {
        return showVersion();
    }
    if (cliArguments.some(function (argument) { return argument === '--stdin'; })) {
        return sortPackageJsonFromStdin();
    }
    var patterns = [];
    var isCheck = false;
    var shouldBeQuiet = false;
    for (var _i = 0, cliArguments_1 = cliArguments; _i < cliArguments_1.length; _i++) {
        var argument = cliArguments_1[_i];
        if (argument === '--check' || argument === '-c') {
            isCheck = true;
        }
        else if (argument === '--quiet' || argument === '-q') {
            shouldBeQuiet = true;
        }
        else {
            patterns.push(argument);
        }
    }
    if (!patterns.length) {
        patterns[0] = 'package.json';
    }
    sortPackageJsonFiles(patterns, { isCheck: isCheck, shouldBeQuiet: shouldBeQuiet });
}
run();
