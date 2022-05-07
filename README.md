# tav-ui

`tav-ui` 是基于 Vue 3 + Typescript + Vite 技术开发的前端 Vue 组件库。该项目采用`pnpm+monorepo`进行包管理,使用`gulp`控制打包流程,`rollup`进行打包。

# tips

- 文件中用到的自定义类型必须手动复制粘贴过去

- 组件prop提出来放在同层的types中导入使用

- 通过 pnpm plop:cmp 创建组件

- 每个组件必须只有一个导出，可以把之前的复合组件拆开，参考 basic-*

- 每次迁移组件结束后打一次包查看dist下是否生成type文件夹

- utils/hooks/components中如果用到utils/hooks/components的情况，不能直接通过入口导入，要找到确定的文件再导入，避免循环依赖
