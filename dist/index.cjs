"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.sortOrder = exports.sortPackageJson = void 0;
var sort_object_keys_1 = require("sort-object-keys");
var detect_indent_1 = require("detect-indent");
var detect_newline_1 = require("detect-newline");
var git_hooks_list_1 = require("git-hooks-list");
var is_plain_obj_1 = require("is-plain-obj");
var hasOwn = Object.hasOwn ||
    // TODO: Remove this when we drop supported for Node.js v14
    (function (object, property) { return Object.prototype.hasOwnProperty.call(object, property); });
var pipe = function (fns) {
    return function (x) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return fns.reduce(function (result, fn) { return fn.apply(void 0, __spreadArray([result], args, false)); }, x);
    };
};
var onArray = function (fn) { return function (x) { return Array.isArray(x) ? fn(x) : x; }; };
var onStringArray = function (fn) { return function (x) {
    return Array.isArray(x) && x.every(function (item) { return typeof item === 'string'; }) ? fn(x) : x;
}; };
var uniq = onStringArray(function (xs) { return __spreadArray([], new Set(xs), true); });
var sortArray = onStringArray(function (array) { return __spreadArray([], array, true).sort(); });
var uniqAndSortArray = pipe([uniq, sortArray]);
var onObject = function (fn) {
    return function (x) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return (0, is_plain_obj_1["default"])(x) ? fn.apply(void 0, __spreadArray([x], args, false)) : x;
    };
};
var sortObjectBy = function (comparator, deep) {
    var over = onObject(function (object) {
        if (deep) {
            object = Object.fromEntries(Object.entries(object).map(function (_a) {
                var key = _a[0], value = _a[1];
                return [key, over(value)];
            }));
        }
        return (0, sort_object_keys_1["default"])(object, comparator);
    });
    return over;
};
var sortObject = sortObjectBy();
var sortURLObject = sortObjectBy(['type', 'url']);
var sortPeopleObject = sortObjectBy(['name', 'email', 'url']);
var sortDirectories = sortObjectBy([
    'lib',
    'bin',
    'man',
    'doc',
    'example',
    'test',
]);
var overProperty = function (property, over) {
    return function (object) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return hasOwn(object, property)
            ? __assign(__assign({}, object), (_a = {}, _a[property] = over.apply(void 0, __spreadArray([object[property]], args, false)), _a)) : object;
    };
};
var sortGitHooks = sortObjectBy(git_hooks_list_1["default"]);
// https://github.com/eslint/eslint/blob/acc0e47572a9390292b4e313b4a4bf360d236358/conf/config-schema.js
var eslintBaseConfigProperties = [
    // `files` and `excludedFiles` are only on `overrides[]`
    // for easier sort `overrides[]`,
    // add them to here, so we don't need sort `overrides[]` twice
    'files',
    'excludedFiles',
    // baseConfig
    'env',
    'parser',
    'parserOptions',
    'settings',
    'plugins',
    'extends',
    'rules',
    'overrides',
    'globals',
    'processor',
    'noInlineConfig',
    'reportUnusedDisableDirectives',
];
var sortEslintConfig = onObject(pipe([
    sortObjectBy(eslintBaseConfigProperties),
    overProperty('env', sortObject),
    overProperty('globals', sortObject),
    overProperty('overrides', onArray(function (overrides) { return overrides.map(sortEslintConfig); })),
    overProperty('parserOptions', sortObject),
    overProperty('rules', sortObjectBy(function (rule1, rule2) {
        return rule1.split('/').length - rule2.split('/').length ||
            rule1.localeCompare(rule2);
    })),
    overProperty('settings', sortObject),
]));
var sortVSCodeBadgeObject = sortObjectBy(['description', 'url', 'href']);
var sortPrettierConfig = onObject(pipe([
    // sort keys alphabetically, but put `overrides` at bottom
    function (config) {
        return (0, sort_object_keys_1["default"])(config, __spreadArray(__spreadArray([], Object.keys(config)
            .filter(function (key) { return key !== 'overrides'; })
            .sort(), true), [
            'overrides',
        ], false));
    },
    // if `config.overrides` exists
    overProperty('overrides', 
    // and `config.overrides` is an array
    onArray(function (overrides) {
        return overrides.map(pipe([
            // sort `config.overrides[]` alphabetically
            sortObject,
            // sort `config.overrides[].options` alphabetically
            overProperty('options', sortObject),
        ]));
    })),
]));
var sortVolta = sortObjectBy(['node', 'npm', 'yarn']);
// fields marked `vscode` are for `Visual Studio Code extension manifest` only
// https://code.visualstudio.com/api/references/extension-manifest
// Supported fields:
// publisher, displayName, categories, galleryBanner, preview, contributes,
// activationEvents, badges, markdown, qna, extensionPack,
// extensionDependencies, icon
// field.key{string}: field name
// field.over{function}: sort field subKey
var fields = [
    { key: '$schema' },
    { key: 'name' },
    /* vscode */ { key: 'displayName' },
    { key: 'version' },
    { key: 'private' },
    { key: 'description' },
    /* vscode */ { key: 'categories', over: uniq },
    { key: 'keywords', over: uniq },
    { key: 'homepage' },
    { key: 'bugs', over: sortObjectBy(['url', 'email']) },
    { key: 'repository', over: sortURLObject },
    { key: 'funding', over: sortURLObject },
    { key: 'license', over: sortURLObject },
    /* vscode */ { key: 'qna' },
    { key: 'author', over: sortPeopleObject },
    {
        key: 'maintainers',
        over: onArray(function (maintainers) { return maintainers.map(sortPeopleObject); })
    },
    {
        key: 'contributors',
        over: onArray(function (contributors) { return contributors.map(sortPeopleObject); })
    },
    /* vscode */ { key: 'publisher' },
    { key: 'sideEffects' },
    { key: 'type' },
    { key: 'imports' },
    { key: 'exports' },
    { key: 'main' },
    { key: 'svelte' },
    { key: 'umd:main' },
    { key: 'jsdelivr' },
    { key: 'unpkg' },
    { key: 'module' },
    { key: 'source' },
    { key: 'jsnext:main' },
    { key: 'browser' },
    { key: 'react-native' },
    { key: 'types' },
    { key: 'typesVersions' },
    { key: 'typings' },
    { key: 'style' },
    { key: 'example' },
    { key: 'examplestyle' },
    { key: 'assets' },
    { key: 'bin', over: sortObject },
    { key: 'man' },
    { key: 'directories', over: sortDirectories },
    { key: 'files', over: uniq },
    { key: 'workspaces' },
    // node-pre-gyp https://www.npmjs.com/package/node-pre-gyp#1-add-new-entries-to-your-packagejson
    {
        key: 'binary',
        over: sortObjectBy([
            'module_name',
            'module_path',
            'remote_path',
            'package_name',
            'host',
        ])
    },
    { key: 'scripts' },
    { key: 'betterScripts' },
    /* vscode */ { key: 'contributes', over: sortObject },
    /* vscode */ { key: 'activationEvents', over: uniq },
    { key: 'husky', over: overProperty('hooks', sortGitHooks) },
    { key: 'simple-git-hooks', over: sortGitHooks },
    { key: 'pre-commit' },
    { key: 'commitlint', over: sortObject },
    { key: 'lint-staged' },
    { key: 'nano-staged' },
    { key: 'config', over: sortObject },
    { key: 'nodemonConfig', over: sortObject },
    { key: 'browserify', over: sortObject },
    { key: 'babel', over: sortObject },
    { key: 'browserslist' },
    { key: 'xo', over: sortObject },
    { key: 'prettier', over: sortPrettierConfig },
    { key: 'eslintConfig', over: sortEslintConfig },
    { key: 'eslintIgnore' },
    { key: 'npmpkgjsonlint', over: sortObject },
    { key: 'npmPackageJsonLintConfig', over: sortObject },
    { key: 'npmpackagejsonlint', over: sortObject },
    { key: 'release', over: sortObject },
    { key: 'remarkConfig', over: sortObject },
    { key: 'stylelint' },
    { key: 'ava', over: sortObject },
    { key: 'jest', over: sortObject },
    { key: 'jest-junit', over: sortObject },
    { key: 'jest-stare', over: sortObject },
    { key: 'mocha', over: sortObject },
    { key: 'nyc', over: sortObject },
    { key: 'c8', over: sortObject },
    { key: 'tap', over: sortObject },
    { key: 'resolutions', over: sortObject },
    { key: 'dependencies', over: sortObject },
    { key: 'devDependencies', over: sortObject },
    { key: 'dependenciesMeta', over: sortObjectBy(undefined, true) },
    { key: 'peerDependencies', over: sortObject },
    // TODO: only sort depth = 2
    { key: 'peerDependenciesMeta', over: sortObjectBy(undefined, true) },
    { key: 'optionalDependencies', over: sortObject },
    { key: 'bundledDependencies', over: uniqAndSortArray },
    { key: 'bundleDependencies', over: uniqAndSortArray },
    /* vscode */ { key: 'extensionPack', over: uniqAndSortArray },
    /* vscode */ { key: 'extensionDependencies', over: uniqAndSortArray },
    { key: 'flat' },
    { key: 'packageManager' },
    { key: 'engines', over: sortObject },
    { key: 'engineStrict', over: sortObject },
    { key: 'volta', over: sortVolta },
    { key: 'languageName' },
    { key: 'os' },
    { key: 'cpu' },
    { key: 'preferGlobal', over: sortObject },
    { key: 'publishConfig', over: sortObject },
    /* vscode */ { key: 'icon' },
    /* vscode */ {
        key: 'badges',
        over: onArray(function (badge) { return badge.map(sortVSCodeBadgeObject); })
    },
    /* vscode */ { key: 'galleryBanner', over: sortObject },
    /* vscode */ { key: 'preview' },
    /* vscode */ { key: 'markdown' },
];
var defaultSortOrder = fields.map(function (_a) {
    var key = _a.key;
    return key;
});
exports.sortOrder = defaultSortOrder;
var overFields = pipe(fields
    .map(function (_a) {
    var key = _a.key, over = _a.over;
    return (over ? overProperty(key, over) : undefined);
})
    .filter(Boolean));
function editStringJSON(json, over) {
    if (typeof json === 'string') {
        var indent = (0, detect_indent_1["default"])(json).indent;
        var endCharacters = json.slice(-1) === '\n' ? '\n' : '';
        var newline = (0, detect_newline_1.detectNewlineGraceful)(json);
        json = JSON.parse(json);
        var result = JSON.stringify(over(json), null, indent) + endCharacters;
        if (newline === '\r\n') {
            result = result.replace(/\n/g, newline);
        }
        return result;
    }
    return over(json);
}
var isPrivateKey = function (key) { return key[0] === '_'; };
var partition = function (array, predicate) {
    return array.reduce(function (result, value) {
        result[predicate(value) ? 0 : 1].push(value);
        return result;
    }, [[], []]);
};
function sortPackageJson(jsonIsh, options) {
    if (options === void 0) { options = {}; }
    return editStringJSON(jsonIsh, onObject(function (json) {
        var sortOrder = options.sortOrder || defaultSortOrder;
        if (Array.isArray(sortOrder)) {
            var keys = Object.keys(json);
            var _a = partition(keys, isPrivateKey), privateKeys = _a[0], publicKeys = _a[1];
            sortOrder = __spreadArray(__spreadArray(__spreadArray(__spreadArray([], sortOrder, true), defaultSortOrder, true), publicKeys.sort(), true), privateKeys.sort(), true);
        }
        return overFields((0, sort_object_keys_1["default"])(json, sortOrder), json);
    }));
}
exports.sortPackageJson = sortPackageJson;
exports["default"] = sortPackageJson;
