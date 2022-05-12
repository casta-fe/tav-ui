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
3. github action 自动发布