# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about the recommended Project Setup and IDE Support in the [Vue Docs TypeScript Guide](https://vuejs.org/guide/typescript/overview.html#project-setup).

一、规范：
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
        缺点：提交两次才能格式化

    commitlint: 提交备注规范
        scripts{
            "commitlint": "commitlint --config commitlint.config.cjs -e -V"
        }
        配置结束，现在当我们填写`commit`信息的时候，前面就需要带着下面的`subject`

        ```
        'feat',//新特性、新功能
        'fix',//修改bug
        'docs',//文档修改
        'style',//代码格式修改, 注意不是 css 修改
        'refactor',//代码重构
        'perf',//优化相关，比如提升性能、体验
        'test',//测试用例修改
        'chore',//其他修改, 比如改变构建流程、或者增加依赖库、工具等
        'revert',//回滚到上一个版本
        'build',//编译相关的修改，例如发布版本、对项目构建或者依赖的改动
        ```

        配置husky
        ```
        npx husky add .husky/commit-msg
        ```

        在生成的commit-msg文件中添加下面的命令

        ```
        #!/usr/bin/env sh
        . "$(dirname -- "$0")/_/husky.sh"
        pnpm commitlint
        ```

二、强制使用pnpm包管理器工具

    团队开发项目的时候，需要统一包管理器工具,因为不同包管理器工具下载同一个依赖,可能版本不一样,

    导致项目出现bug问题,因此包管理器工具需要统一管理！！！

    在根目录创建`scritps/preinstall.js`文件，添加下面的内容

    ```
    if (!/npm/.test(process.env.npm_execpath || '')) {
    console.warn(
        `\u001b[33mThis repository must using pnpm as the package manager ` +
        ` for scripts to work properly.\u001b[39m\n`,
    )
    process.exit(1)
    }
    ```

    配置命令

    ```
    "scripts": {
        "preinstall": "node ./scripts/preinstall.js"
    }
    ```
