/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/is-buffer@1.1.6";
exports.ids = ["vendor-chunks/is-buffer@1.1.6"];
exports.modules = {

/***/ "(rsc)/./node_modules/.pnpm/is-buffer@1.1.6/node_modules/is-buffer/index.js":
/*!****************************************************************************!*\
  !*** ./node_modules/.pnpm/is-buffer@1.1.6/node_modules/is-buffer/index.js ***!
  \****************************************************************************/
/***/ ((module) => {

eval("/*!\n * Determine if an object is a Buffer\n *\n * @author   Feross Aboukhadijeh <https://feross.org>\n * @license  MIT\n */ // The _isBuffer check is for Safari 5-7 support, because it's missing\n// Object.prototype.constructor. Remove this eventually\nmodule.exports = function(obj) {\n    return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer);\n};\nfunction isBuffer(obj) {\n    return !!obj.constructor && typeof obj.constructor.isBuffer === \"function\" && obj.constructor.isBuffer(obj);\n}\n// For Node v0.10 support. Remove this eventually.\nfunction isSlowBuffer(obj) {\n    return typeof obj.readFloatLE === \"function\" && typeof obj.slice === \"function\" && isBuffer(obj.slice(0, 0));\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9yZWFjdC1lbWFpbC1jbGllbnQvLi9ub2RlX21vZHVsZXMvLnBucG0vaXMtYnVmZmVyQDEuMS42L25vZGVfbW9kdWxlcy9pcy1idWZmZXIvaW5kZXguanM/ODQ5YSJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiFcbiAqIERldGVybWluZSBpZiBhbiBvYmplY3QgaXMgYSBCdWZmZXJcbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8aHR0cHM6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG5cbi8vIFRoZSBfaXNCdWZmZXIgY2hlY2sgaXMgZm9yIFNhZmFyaSA1LTcgc3VwcG9ydCwgYmVjYXVzZSBpdCdzIG1pc3Npbmdcbi8vIE9iamVjdC5wcm90b3R5cGUuY29uc3RydWN0b3IuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHlcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gb2JqICE9IG51bGwgJiYgKGlzQnVmZmVyKG9iaikgfHwgaXNTbG93QnVmZmVyKG9iaikgfHwgISFvYmouX2lzQnVmZmVyKVxufVxuXG5mdW5jdGlvbiBpc0J1ZmZlciAob2JqKSB7XG4gIHJldHVybiAhIW9iai5jb25zdHJ1Y3RvciAmJiB0eXBlb2Ygb2JqLmNvbnN0cnVjdG9yLmlzQnVmZmVyID09PSAnZnVuY3Rpb24nICYmIG9iai5jb25zdHJ1Y3Rvci5pc0J1ZmZlcihvYmopXG59XG5cbi8vIEZvciBOb2RlIHYwLjEwIHN1cHBvcnQuIFJlbW92ZSB0aGlzIGV2ZW50dWFsbHkuXG5mdW5jdGlvbiBpc1Nsb3dCdWZmZXIgKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iai5yZWFkRmxvYXRMRSA9PT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2Ygb2JqLnNsaWNlID09PSAnZnVuY3Rpb24nICYmIGlzQnVmZmVyKG9iai5zbGljZSgwLCAwKSlcbn1cbiJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwib2JqIiwiaXNCdWZmZXIiLCJpc1Nsb3dCdWZmZXIiLCJfaXNCdWZmZXIiLCJjb25zdHJ1Y3RvciIsInJlYWRGbG9hdExFIiwic2xpY2UiXSwibWFwcGluZ3MiOiJBQUFBOzs7OztDQUtDLEdBRUQsc0VBQXNFO0FBQ3RFLHVEQUF1RDtBQUN2REEsT0FBT0MsT0FBTyxHQUFHLFNBQVVDLEdBQUc7SUFDNUIsT0FBT0EsT0FBTyxRQUFTQyxDQUFBQSxTQUFTRCxRQUFRRSxhQUFhRixRQUFRLENBQUMsQ0FBQ0EsSUFBSUcsU0FBUyxBQUFEO0FBQzdFO0FBRUEsU0FBU0YsU0FBVUQsR0FBRztJQUNwQixPQUFPLENBQUMsQ0FBQ0EsSUFBSUksV0FBVyxJQUFJLE9BQU9KLElBQUlJLFdBQVcsQ0FBQ0gsUUFBUSxLQUFLLGNBQWNELElBQUlJLFdBQVcsQ0FBQ0gsUUFBUSxDQUFDRDtBQUN6RztBQUVBLGtEQUFrRDtBQUNsRCxTQUFTRSxhQUFjRixHQUFHO0lBQ3hCLE9BQU8sT0FBT0EsSUFBSUssV0FBVyxLQUFLLGNBQWMsT0FBT0wsSUFBSU0sS0FBSyxLQUFLLGNBQWNMLFNBQVNELElBQUlNLEtBQUssQ0FBQyxHQUFHO0FBQzNHIiwiZmlsZSI6Iihyc2MpLy4vbm9kZV9tb2R1bGVzLy5wbnBtL2lzLWJ1ZmZlckAxLjEuNi9ub2RlX21vZHVsZXMvaXMtYnVmZmVyL2luZGV4LmpzIiwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/.pnpm/is-buffer@1.1.6/node_modules/is-buffer/index.js\n");

/***/ })

};
;