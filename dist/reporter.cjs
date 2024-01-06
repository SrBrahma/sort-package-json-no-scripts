"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Reporter_hasPrinted, _Reporter_options, _Reporter_status, _Reporter_logger;
exports.__esModule = true;
var getFilesCountText = function (count) { return (count === 1 ? '1 file' : "".concat(count, " files")); };
var Reporter = /** @class */ (function () {
    function Reporter(files, options) {
        var _this = this;
        _Reporter_hasPrinted.set(this, false);
        _Reporter_options.set(this, void 0);
        _Reporter_status.set(this, void 0);
        _Reporter_logger.set(this, void 0);
        __classPrivateFieldSet(this, _Reporter_options, options, "f");
        __classPrivateFieldSet(this, _Reporter_status, {
            matchedFilesCount: files.length,
            failedFilesCount: 0,
            wellSortedFilesCount: 0,
            changedFilesCount: 0
        }, "f");
        __classPrivateFieldSet(this, _Reporter_logger, options.shouldBeQuiet
            ? { log: function () { }, error: function () { } }
            : {
                log: function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    __classPrivateFieldSet(_this, _Reporter_hasPrinted, true, "f");
                    console.log.apply(console, args);
                },
                error: function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    __classPrivateFieldSet(_this, _Reporter_hasPrinted, true, "f");
                    console.error.apply(console, args);
                }
            }, "f");
    }
    // The file is well-sorted
    Reporter.prototype.reportNotChanged = function ( /* file */) {
        __classPrivateFieldGet(this, _Reporter_status, "f").wellSortedFilesCount++;
    };
    Reporter.prototype.reportChanged = function (file) {
        __classPrivateFieldGet(this, _Reporter_status, "f").changedFilesCount++;
        __classPrivateFieldGet(this, _Reporter_logger, "f").log(__classPrivateFieldGet(this, _Reporter_options, "f").isCheck ? "".concat(file) : "".concat(file, " is sorted!"));
    };
    Reporter.prototype.reportFailed = function (file, error) {
        __classPrivateFieldGet(this, _Reporter_status, "f").failedFilesCount++;
        console.error('Error on: ' + file);
        __classPrivateFieldGet(this, _Reporter_logger, "f").error(error.message);
    };
    Reporter.prototype.printSummary = function () {
        var _a = __classPrivateFieldGet(this, _Reporter_status, "f"), matchedFilesCount = _a.matchedFilesCount, failedFilesCount = _a.failedFilesCount, changedFilesCount = _a.changedFilesCount, wellSortedFilesCount = _a.wellSortedFilesCount;
        if (matchedFilesCount === 0) {
            console.error('No matching files.');
            process.exitCode = 2;
            return;
        }
        var _b = __classPrivateFieldGet(this, _Reporter_options, "f"), isCheck = _b.isCheck, isQuiet = _b.isQuiet;
        if (isCheck && changedFilesCount) {
            process.exitCode = 1;
        }
        if (failedFilesCount) {
            process.exitCode = 2;
        }
        if (isQuiet) {
            return;
        }
        var log = __classPrivateFieldGet(this, _Reporter_logger, "f").log;
        // Print an empty line.
        if (__classPrivateFieldGet(this, _Reporter_hasPrinted, "f")) {
            log();
        }
        // Matched files
        log('Found %s.', getFilesCountText(matchedFilesCount));
        // Failed files
        if (failedFilesCount) {
            log('%s could not be %s.', getFilesCountText(failedFilesCount), isCheck ? 'checked' : 'sorted');
        }
        // Changed files
        if (changedFilesCount) {
            if (isCheck) {
                log('%s %s not sorted.', getFilesCountText(changedFilesCount), changedFilesCount === 1 ? 'was' : 'were');
            }
            else {
                log('%s successfully sorted.', getFilesCountText(changedFilesCount));
            }
        }
        // Well-sorted files
        if (wellSortedFilesCount) {
            log('%s %s already sorted.', getFilesCountText(wellSortedFilesCount), wellSortedFilesCount === 1 ? 'was' : 'were');
        }
    };
    return Reporter;
}());
_Reporter_hasPrinted = new WeakMap(), _Reporter_options = new WeakMap(), _Reporter_status = new WeakMap(), _Reporter_logger = new WeakMap();
exports["default"] = Reporter;
