# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

eslint: 语法检查

    package.json:
        - "lint": "eslint src", 校验
        - "fix" : "eslint src --fix" 修补

prettier ：格式化
.prettierrc.json:
{
"singleQuote": true, 字符串单引号
"semi": false, 不要分号
"bracketSpacing": true, 括号空格
"htmlWhitespaceSensitivity": "ignore",
"endOfLine": "auto",
"trailingComma": "all",
"tabWidth": 2 缩进2个空格
}

stylelint: 检查css语法错误与不合理写法
script{
"format": "prettier --write \"./**/\*.{html,vue,ts,js,json,md}\"", 格式化这些文件
"lint:eslint": "eslint src/**/_.{ts,vue} --cache --fix",
"lint:style": "stylelint src/\*\*/_.{css,scss,vue} --cache --fix"
}

husky : git钩子 防止提交没有格式化的代码
在.husky文件中pre-commit执行
`         npm run format
        `
意思是向远程仓库提交代码之前执行的指令
