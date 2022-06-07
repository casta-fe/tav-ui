# tav-ui

`tav-ui` 是基于 Vue 3 + Typescript + Vite 技术开发的前端 Vue 组件库。该项目采用`pnpm+monorepo`进行包管理,使用`gulp`控制打包流程,`rollup`进行打包。

# tips

- 文件中用到的自定义类型必须手动复制粘贴过去

- 组件prop提出来放在同层的types中导入使用

- 通过 pnpm plop:cmp 创建组件

- 每个组件必须只有一个导出，可以把之前的复合组件拆开，参考 basic-*

- 每次迁移组件结束后打一次包查看dist下是否生成type文件夹

- utils/hooks/components中如果用到utils/hooks/components的情况，不能直接通过入口导入，要找到确定的文件再导入，避免循环依赖

- 组件必须有name，格式：TaXx 驼峰命名

- script setup 添加name的方式: 
```javascript
defineOptions({
  name: 'TaDropDown',
})
```

- 禁止在 vue sfc 中出现 script lang="tsx" 的写法，rollup 解析不完整可能会报错。建议：只有用到了template或style才写Vue SFC，否则直接写ts、tsx文件即可

- refactor(build): element-plus kevin fixed up
=> 
1. theme-chalk/gulpfile.ts error, downgrade chalk5.0 to chalk4.1.2; 2. not file or dir [.vue?xxxx&lang.tsx], change lang=tsx to .tsx or .ts

# 打包发布

需要先

1. git tag v0.0.1 
2. git push --tag

等待 github action 自动发布即可，发布进度在 github 仓库中的 actions 下查看

# 本地调试

1. pnpm build 打出 dist
2. 修改自己项目中的 package.json tav-ui 路径为 `"tav-ui": "file:/Users/i7eo/Documents/Company/XA-Castianta/tav-ui/dist/tav-ui"`
3. 重新 yarn install 即可查看

# TalePro

1. 所有对象配置均改为 xxxconfig 和 vxetable 风格一致，例如: `filter => filterFormConfig`，使用前请先查看 vxegrid api 和 tablepro 下的 types
2. ifShow 均改为 enable 和 vxetable 保持一致
3. 按钮权限打散到每个按钮中