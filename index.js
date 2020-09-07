const _ = require('lodash');
const path = require('path');

const PATTERNS = [
  {  // patch baseAssignValue
    source: 'object[key] = value;',
    replacement: 'Vue.set(object, key, value);',
    check: count => count === 1
  },
  {  // patch baseUnset
    source: 'delete object[toKey(last(path))];',
    replacement: 'Vue.delete(object, toKey(last(path)));',
    check: count => count === 1
  },
  {  // patch reverse
    source: 'nativeReverse.call(array);',
    replacement: '(array.reverse || nativeReverse).call(array);',
    check: count => count === 1
  },
  {  // patch the array methods added for chaining
    source: 'return func.apply(isArray(value) ? value : [], args);',
    replacement:
      'value = isArray(value) ? value : []; ' +
      'return value[methodName].apply(value, args);',
    check: count => count >= 1
  },
  {  // patch the many calls to an interned copy of splice (may not need all of these, oh well)
    source: /\bsplice\.call\((\w+)/g,
    replacement: (match, name) => `(${name}.splice || splice).call(${name}`,
    check: count => count >= 1
  }
];

const ID_SUFFIX = `${path.sep}lodash${path.sep}lodash.js`;

module.exports = function() {
  return {
    name: 'vueify-lodash4',
    transform(code, id) {
      if (!id.endsWith(ID_SUFFIX)) return null;

      code = 'import Vue from "vue";\n' + code;
      for (const pattern of PATTERNS) {
        const regex = _.isString(pattern.source) ?
          new RegExp(_.escapeRegExp(pattern.source), 'g') : pattern.source;
        if (!pattern.check(code.match(regex).length)) {
          throw new Error(`Unable to patch Lodash library: "${pattern.source}"`);
        }
        code = code.replace(regex, pattern.replacement);
      }

      return code;
    }
  }
}
