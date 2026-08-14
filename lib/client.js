// Client bundle of dsh-ui-font. Closure-factory artifact; platform modules
// resolve through the injected `require`.
//
// Apple-style typography presets for the Web GUI: UI font (system / LXGW
// WenKai / Inter) and code font (SF Mono / JetBrains Mono / Fira Code),
// applied through theme-token overrides (--dsw-font-family /
// --ds-font-family-code). CDN fonts load lazily with graceful system
// fallback. Preferences live in localStorage. See README.
window.__ModuleLoader__.load({
  id: 'dsh-ui-font',
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports

    var jsx = require('react/jsx-runtime')
    var runtimeClient = require('@deepseek-ai/dsh-client-runtime/client')
    var defineStore = runtimeClient.defineStore

    var SETTINGS_NS = 'settings.font'
    var PACKAGE_ID = 'dsh-ui-font'
    var STORAGE_KEY = 'dsh-ui-font:v1'

    var zh = {
      'font.title': '字体美化',
      'font.uiLabel': '界面字体',
      'font.codeLabel': '代码字体',
      'font.ui.system': '系统默认',
      'font.ui.wenkai': '霞鹜文楷',
      'font.ui.inter': 'Inter',
      'font.code.sfmono': 'SF Mono（默认）',
      'font.code.jetbrains': 'JetBrains Mono',
      'font.code.fira': 'Fira Code',
    }
    var en = {
      'font.title': 'Typography',
      'font.uiLabel': 'UI font',
      'font.codeLabel': 'Code font',
      'font.ui.system': 'System default',
      'font.ui.wenkai': 'LXGW WenKai',
      'font.ui.inter': 'Inter',
      'font.code.sfmono': 'SF Mono (default)',
      'font.code.jetbrains': 'JetBrains Mono',
      'font.code.fira': 'Fira Code',
    }

    // ── font definitions ────────────────────────────────────────────────────────
    var SYSTEM_UI_FALLBACK = "-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif"
    var UI_STACKS = {
      system: null, // null = keep the shell default (dispose the override)
      wenkai: "'LXGW WenKai', " + SYSTEM_UI_FALLBACK,
      inter: "'Inter', " + SYSTEM_UI_FALLBACK,
    }
    var CODE_STACKS = {
      sfmono: null, // null = keep the shell default
      jetbrains: "'JetBrains Mono', 'SF Mono', 'Fira Code', Consolas, Menlo, monospace",
      fira: "'Fira Code', 'SF Mono', 'JetBrains Mono', Consolas, Menlo, monospace",
    }
    // CDN stylesheets defining the @font-face rules (lazy, swap-display fallback).
    var CDN_STYLES = {
      wenkai: 'https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/style.css',
      inter: 'https://cdn.jsdelivr.net/npm/@fontsource/inter@5.2.5/index.css',
      jetbrains: 'https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5.2.5/index.css',
      fira: 'https://cdn.jsdelivr.net/npm/@fontsource/fira-code@5.2.5/index.css',
    }

    var STYLE_TEXT = [
      '.dshfont-row {',
      '  padding: 16px 0;',
      '  border-bottom: 1px solid var(--dsw-alias-border-l2);',
      '  display: flex;',
      '  flex-direction: column;',
      '  gap: 10px;',
      '}',
      '.dshfont-title {',
      '  color: var(--dsw-alias-label-primary);',
      '  font-size: 14px;',
      '  font-weight: 600;',
      '  line-height: 22px;',
      '}',
      '.dshfont-field {',
      '  display: flex;',
      '  flex-direction: column;',
      '  gap: 6px;',
      '}',
      '.dshfont-label {',
      '  color: var(--dsw-alias-label-primary);',
      '  font-size: 13px;',
      '  line-height: 20px;',
      '}',
      '.dshfont-select {',
      '  box-sizing: border-box;',
      '  width: 100%;',
      '  color: var(--dsw-alias-label-primary);',
      '  background: var(--dsw-alias-bg-layer-1);',
      '  border: 1px solid var(--dsw-alias-border-l2);',
      '  border-radius: 8px;',
      '  padding: 8px 10px;',
      '  font-size: 13px;',
      '  line-height: 20px;',
      '  font-family: inherit;',
      '}',
    ].join('\n')

    if (typeof document !== 'undefined' && document.querySelector('style[data-plugin-css="' + PACKAGE_ID + '/styles"]') === null) {
      var styleTag = document.createElement('style')
      styleTag.dataset.plugin = PACKAGE_ID
      styleTag.dataset.pluginCss = PACKAGE_ID + '/styles'
      styleTag.textContent = STYLE_TEXT
      document.head.appendChild(styleTag)
    }

    // ── settings ────────────────────────────────────────────────────────────────
    function loadSettings() {
      try {
        var raw = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
        if (raw) {
          var parsed = JSON.parse(raw)
          return {
            uiFont: UI_STACKS[parsed.uiFont] !== undefined ? parsed.uiFont : 'system',
            codeFont: CODE_STACKS[parsed.codeFont] !== undefined ? parsed.codeFont : 'sfmono',
          }
        }
      } catch (e) { /* defaults */ }
      return { uiFont: 'system', codeFont: 'sfmono' }
    }

    function saveSettings(settings) {
      try {
        if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
      } catch (e) { /* non-fatal */ }
    }

    function createFontRowStore(initial) {
      return defineStore({
        init: () => ({ uiFont: initial.uiFont, codeFont: initial.codeFont }),
        actions: {
          sync: (d, s) => {
            d.uiFont = s.uiFont
            d.codeFont = s.codeFont
          },
        },
      })
    }

    // ── settings row ────────────────────────────────────────────────────────────
    function FontRow(props) {
      var t = props.t
      var useStore = props.useStore
      var setUiFont = props.setUiFont
      var setCodeFont = props.setCodeFont

      var uiFont = useStore(function (s) { return s.uiFont })
      var codeFont = useStore(function (s) { return s.codeFont })

      return jsx.jsxs('div', { className: 'dshfont-row', children: [
        jsx.jsx('div', { className: 'dshfont-title', children: t('font.title') }),
        jsx.jsxs('div', { className: 'dshfont-field', children: [
          jsx.jsx('label', { className: 'dshfont-label', children: t('font.uiLabel') }),
          jsx.jsxs('select', {
            className: 'dshfont-select',
            value: uiFont,
            onChange: function (e) { setUiFont(e.target.value) },
            children: [
              jsx.jsx('option', { value: 'system', children: t('font.ui.system') }),
              jsx.jsx('option', { value: 'wenkai', children: t('font.ui.wenkai') }),
              jsx.jsx('option', { value: 'inter', children: t('font.ui.inter') }),
            ],
          }),
        ]}),
        jsx.jsxs('div', { className: 'dshfont-field', children: [
          jsx.jsx('label', { className: 'dshfont-label', children: t('font.codeLabel') }),
          jsx.jsxs('select', {
            className: 'dshfont-select',
            value: codeFont,
            onChange: function (e) { setCodeFont(e.target.value) },
            children: [
              jsx.jsx('option', { value: 'sfmono', children: t('font.code.sfmono') }),
              jsx.jsx('option', { value: 'jetbrains', children: t('font.code.jetbrains') }),
              jsx.jsx('option', { value: 'fira', children: t('font.code.fira') }),
            ],
          }),
        ]}),
      ]})
    }

    // ── client plugin body ──────────────────────────────────────────────────────
    var inject = ['theme', 'slots', 'locale']

    function apply(ctx) {
      var settings = loadSettings()

      var loadedLinks = {}
      var overrideDisposer = null

      function ensureFontLink(preset) {
        var href = CDN_STYLES[preset]
        if (!href || loadedLinks[preset]) return
        if (typeof document === 'undefined') return
        if (document.querySelector('link[data-font-preset="' + preset + '"]') !== null) {
          loadedLinks[preset] = true
          return
        }
        var link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = href
        link.dataset.fontPreset = preset
        document.head.appendChild(link)
        loadedLinks[preset] = true
      }

      function applyFonts(section) {
        var uiFont = (section && UI_STACKS[section.uiFont] !== undefined) ? section.uiFont : 'system'
        var codeFont = (section && CODE_STACKS[section.codeFont] !== undefined) ? section.codeFont : 'sfmono'

        if (uiFont !== 'system') ensureFontLink(uiFont)
        if (codeFont !== 'sfmono') ensureFontLink(codeFont)

        var tokens = {}
        var uiStack = UI_STACKS[uiFont]
        var codeStack = CODE_STACKS[codeFont]
        if (uiStack !== null) {
          tokens['--dsw-font-family'] = { light: uiStack, dark: uiStack }
        }
        if (codeStack !== null) {
          tokens['--ds-font-family-code'] = { light: codeStack, dark: codeStack }
        }
        if (overrideDisposer !== null) {
          overrideDisposer()
          overrideDisposer = null
        }
        if (Object.keys(tokens).length > 0) {
          overrideDisposer = ctx.theme.overrideTokens(PACKAGE_ID, tokens)
        }
      }

      applyFonts(settings)

      ctx.effect(function () {
        return ctx.locale.register(SETTINGS_NS, { zh: zh, en: en })
      }, 'ui-font: settings row dictionaries')

      var store = createFontRowStore(settings)
      var bound = null

      function commit(patch) {
        settings = Object.assign({}, settings, patch)
        saveSettings(settings)
        applyFonts(settings)
        if (bound !== null) bound.sync(settings)
      }

      var injected = function (actions) {
        bound = actions
        bound.sync(settings)
        return {
          setUiFont: function (v) { commit({ uiFont: v }) },
          setCodeFont: function (v) { commit({ codeFont: v }) },
        }
      }

      ctx.slots.inject('settings.general.item', function () {
        return ctx.slots.register({
          name: 'settings.general.item',
          id: 'font',
          order: 30,
          store: store,
          locale: SETTINGS_NS,
          inject: injected,
        }, FontRow)
      })
    }

    exports.apply = apply
    exports.inject = inject
    return module.exports
  },
})
