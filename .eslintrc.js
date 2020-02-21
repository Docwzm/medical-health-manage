module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module',// 代码是 ECMAScript 模块
    // parser: 'barbel-eslint'
  },
  env: {
    browser: true,
  },
  rules: {
    'experimentalDecorators':'off',
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // 最后一个允许跟  “,”
    'comma-dangle': 0,
    // ``里面至少有一个${}
    'quotes': 0,
    // () 前要加空格
    'space-before-function-paren': 0,
    // 只能用 attr={xxx}
    'jsx-quotes': 0,
    // 声明变量必须使用
    'no-unused-vars': 0,
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'eol-last':0,
    //强制要求分号前空格
    'semi-spacing':'off',
    //强制要求分号
    'semi':'off',
    // 'indent':'off',
    //允许行最后有空格
    'no-trailing-spaces':'off',
    //对象的属性强制要求析构的写法
    'prefer-destructuring': 'off',
    //要求引用文件查找的到
    'import/no-unresolved':'off',
    //v-for后必须要跟一个key
    'vue/require-v-for-key':'off',
    //props后要有默认值
    'vue/require-valid-default-prop':'off',
    // function declaration must be wrapped
    'wrap-life':'off',
    //Report use of exported name as property of default export
    'import/no-named-as-default-member': 0,
    //偏好常量
    'prefer-const':'off',
    'no-plusplus':'off',
    // 单行最大长度
    'max-len':'off',
    //对参数再次赋值
    'no-param-reassign': 'off',
    'arrow-body-style': 'off',
    'no-else-return': 'off',
    'no-restricted-syntax': 'off',
    'vue/no-side-effects-in-computed-properties': 'off',
    "vue/no-parsing-error": [0, { "x-invalid-end-tag": false }]
  },
  //识别.vue文件中的代码
  plugins:['vue'],
  //先使用airbnb的代码规范
  extends: ['plugin:vue/essential','airbnb-base'],
}
