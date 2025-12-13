((typeof globalThis !== 'undefined' ? globalThis : self)["makoChunk_admin"] = (typeof globalThis !== 'undefined' ? globalThis : self)["makoChunk_admin"] || []).push([
        ['p__home__index'],
{ "src/pages/home/index.tsx": function (module, exports, __mako_require__){
/**
 * 首页组件
 * 功能：系统首页
 */ "use strict";
__mako_require__.d(exports, "__esModule", {
    value: true
});
__mako_require__.d(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
var _interop_require_default = __mako_require__("@swc/helpers/_/_interop_require_default");
var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
var _reactrefresh = _interop_require_wildcard._(__mako_require__("../../node_modules/@umijs/mako/node_modules/react-refresh/runtime.js"));
var _jsxdevruntime = __mako_require__("../../node_modules/react/jsx-dev-runtime.js");
var _antd = __mako_require__("node_modules/antd/es/index.js");
var _react = _interop_require_default._(__mako_require__("../../node_modules/react/index.js"));
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
const HomePage = ()=>{
    return (0, _jsxdevruntime.jsxDEV)(_antd.Card, {
        children: [
            (0, _jsxdevruntime.jsxDEV)("h1", {
                children: "欢迎使用 Admin Template"
            }, void 0, false, {
                fileName: "src/pages/home/index.tsx",
                lineNumber: 11,
                columnNumber: 7
            }, this),
            (0, _jsxdevruntime.jsxDEV)("p", {
                children: "这是一个基础的管理系统模板，您可以在此基础上开发您的业务功能。"
            }, void 0, false, {
                fileName: "src/pages/home/index.tsx",
                lineNumber: 12,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "src/pages/home/index.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, this);
};
_c = HomePage;
var _default = HomePage;
var _c;
$RefreshReg$(_c, "HomePage");
if (prevRefreshReg) self.$RefreshReg$ = prevRefreshReg;
if (prevRefreshSig) self.$RefreshSig$ = prevRefreshSig;
function registerClassComponent(filename, moduleExports) {
    for(const key in moduleExports)try {
        if (key === "__esModule") continue;
        const exportValue = moduleExports[key];
        if (_reactrefresh.isLikelyComponentType(exportValue) && exportValue.prototype && exportValue.prototype.isReactComponent) _reactrefresh.register(exportValue, filename + " " + key);
    } catch (e) {}
}
function $RefreshIsReactComponentLike$(moduleExports) {
    if (_reactrefresh.isLikelyComponentType(moduleExports || moduleExports.default)) return true;
    for(var key in moduleExports)try {
        if (_reactrefresh.isLikelyComponentType(moduleExports[key])) return true;
    } catch (e) {}
    return false;
}
registerClassComponent(module.id, module.exports);
if ($RefreshIsReactComponentLike$(module.exports)) {
    module.meta.hot.accept();
    _reactrefresh.performReactRefresh();
}

},
 }]);
//# sourceMappingURL=p__home__index-async.js.map