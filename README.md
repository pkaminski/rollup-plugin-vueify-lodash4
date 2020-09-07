# rollup-plugin-vueify-lodash4

This is a plugin for Rollup that will mangle the Lodash v4 module to respect Vue's mutation interceptors.  It will transform property assignments to `Vue.set`, deletions to `Vue.delete`, and make sure that Lodash uses Vue's patched `splice` method (and others).

This is done via a set of regexes and thus is inherently brittle.  It only works on Lodash v4, and only on the unminifed all-inclusive module.  It adds a Vue `import` at the top of the module, so make sure it gets run through `rollup-plugin-commonjs` first!

