((typeof globalThis !== 'undefined' ? globalThis : self)["makoChunk_admin"] = (typeof globalThis !== 'undefined' ? globalThis : self)["makoChunk_admin"] || []).push([
        ['p__login__index'],
{ "src/pages/login/index.tsx": function (module, exports, __mako_require__){
/**
 * 登录页面组件
 * 功能：提供用户登录功能
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
var _reactrefresh = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("../../node_modules/@umijs/mako/node_modules/react-refresh/runtime.js"));
var _jsxdevruntime = __mako_require__("../../node_modules/react/jsx-dev-runtime.js");
var _icons = __mako_require__("../../node_modules/@ant-design/icons/es/index.js");
var _max = __mako_require__("src/.umi/exports.ts");
var _antd = __mako_require__("node_modules/antd/es/index.js");
var _react = /*#__PURE__*/ _interop_require_default._(__mako_require__("../../node_modules/react/index.js"));
var _login = __mako_require__("src/services/login.ts");
"";
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
var _s = $RefreshSig$();
const ILoginPage = ()=>{
    _s();
    const [form] = _antd.Form.useForm();
    const [loading, setLoading] = _react.default.useState(false);
    const { setInitialState } = (0, _max.useModel)('@@initialState');
    const handleSubmit = async (values)=>{
        setLoading(true);
        try {
            // 调用实际的登录API
            const response = await (0, _login.loginApi)(values);
            // 设置token到localStorage
            localStorage.setItem('token', response.access_token);
            // 更新全局状态
            await setInitialState((s)=>({
                    ...s,
                    currentUser: response.user
                }));
            _antd.message.success('登录成功');
            _max.history.push('/home');
        } catch (error) {
            _antd.message.error('登录失败，请检查用户名和密码');
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
        className: "login-page",
        children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Card, {
            className: "login-card",
            children: [
                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
                    className: "login-header",
                    children: [
                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("h1", {
                            children: "Admin Template"
                        }, void 0, false, {
                            fileName: "src/pages/login/index.tsx",
                            lineNumber: 46,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("p", {
                            children: "管理系统登录"
                        }, void 0, false, {
                            fileName: "src/pages/login/index.tsx",
                            lineNumber: 47,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "src/pages/login/index.tsx",
                    lineNumber: 45,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Form, {
                    form: form,
                    name: "login",
                    onFinish: handleSubmit,
                    autoComplete: "off",
                    size: "large",
                    children: [
                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Form.Item, {
                            name: "username",
                            rules: [
                                {
                                    required: true,
                                    message: '请输入用户名!'
                                }
                            ],
                            children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Input, {
                                prefix: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_icons.UserOutlined, {}, void 0, false, {
                                    fileName: "src/pages/login/index.tsx",
                                    lineNumber: 52,
                                    columnNumber: 28
                                }, void 0),
                                placeholder: "用户名"
                            }, void 0, false, {
                                fileName: "src/pages/login/index.tsx",
                                lineNumber: 52,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "src/pages/login/index.tsx",
                            lineNumber: 51,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Form.Item, {
                            name: "password",
                            rules: [
                                {
                                    required: true,
                                    message: '请输入密码!'
                                }
                            ],
                            children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Input.Password, {
                                prefix: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_icons.LockOutlined, {}, void 0, false, {
                                    fileName: "src/pages/login/index.tsx",
                                    lineNumber: 56,
                                    columnNumber: 37
                                }, void 0),
                                placeholder: "密码"
                            }, void 0, false, {
                                fileName: "src/pages/login/index.tsx",
                                lineNumber: 56,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "src/pages/login/index.tsx",
                            lineNumber: 55,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Form.Item, {
                            children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("div", {
                                className: "login-form-footer",
                                children: [
                                    /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Form.Item, {
                                        name: "remember",
                                        valuePropName: "checked",
                                        noStyle: true,
                                        children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Checkbox, {
                                            children: "记住我"
                                        }, void 0, false, {
                                            fileName: "src/pages/login/index.tsx",
                                            lineNumber: 62,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "src/pages/login/index.tsx",
                                        lineNumber: 61,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)("a", {
                                        href: "#",
                                        className: "forgot-password-link",
                                        children: "忘记密码?"
                                    }, void 0, false, {
                                        fileName: "src/pages/login/index.tsx",
                                        lineNumber: 64,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "src/pages/login/index.tsx",
                                lineNumber: 60,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "src/pages/login/index.tsx",
                            lineNumber: 59,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Form.Item, {
                            children: /*#__PURE__*/ (0, _jsxdevruntime.jsxDEV)(_antd.Button, {
                                type: "primary",
                                htmlType: "submit",
                                loading: loading,
                                className: "login-submit-button",
                                children: "登录"
                            }, void 0, false, {
                                fileName: "src/pages/login/index.tsx",
                                lineNumber: 71,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "src/pages/login/index.tsx",
                            lineNumber: 70,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "src/pages/login/index.tsx",
                    lineNumber: 50,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "src/pages/login/index.tsx",
            lineNumber: 44,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "src/pages/login/index.tsx",
        lineNumber: 43,
        columnNumber: 5
    }, this);
};
_s(ILoginPage, "jW2JFjWREIeJjrfOCF4c8PEEzDY=", false, function() {
    return [
        _antd.Form.useForm,
        _max.useModel
    ];
});
_c = ILoginPage;
var _default = ILoginPage;
var _c;
$RefreshReg$(_c, "ILoginPage");
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
"src/services/login.ts": function (module, exports, __mako_require__){
"use strict";
__mako_require__.d(exports, "__esModule", {
    value: true
});
__mako_require__.d(exports, "loginApi", {
    enumerable: true,
    get: function() {
        return loginApi;
    }
});
var _interop_require_wildcard = __mako_require__("@swc/helpers/_/_interop_require_wildcard");
var _reactrefresh = /*#__PURE__*/ _interop_require_wildcard._(__mako_require__("../../node_modules/@umijs/mako/node_modules/react-refresh/runtime.js"));
var _max = __mako_require__("src/.umi/exports.ts");
var prevRefreshReg;
var prevRefreshSig;
prevRefreshReg = self.$RefreshReg$;
prevRefreshSig = self.$RefreshSig$;
self.$RefreshReg$ = (type, id)=>{
    _reactrefresh.register(type, module.id + id);
};
self.$RefreshSig$ = _reactrefresh.createSignatureFunctionForTransform;
async function loginApi(data) {
    return (0, _max.request)('/api/auth/login', {
        method: 'POST',
        data
    });
}
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
//# sourceMappingURL=p__login__index-async.js.map