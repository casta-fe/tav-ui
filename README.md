# tav-ui

`tav-ui` 是基于 Vue 3 + Typescript + Vite 技术开发的前端 Vue 组件库。该项目采用`pnpm+monorepo`进行包管理,使用`gulp`控制打包流程,`rollup`进行打包。

> 环境依赖 node16 pnpm7

# tips

- 文件中用到的自定义类型必须手动复制粘贴过去

- 组件 prop 提出来放在同层的 types 中导入使用

- 通过 pnpm plop:cmp 创建组件

- 每个组件必须只有一个导出，可以把之前的复合组件拆开，参考 basic-\*

- 每次迁移组件结束后打一次包查看 dist 下是否生成 type 文件夹

- utils/hooks/components 中如果用到 utils/hooks/components 的情况，不能直接通过入口导入，要找到确定的文件再导入，避免循环依赖

- 组件必须有 name，格式：TaXx 驼峰命名

- script setup 添加 name 的方式:

```javascript
defineOptions({
  name: 'TaDropDown',
})
```

- 禁止在 vue sfc 中出现 script lang="tsx" 的写法，rollup 解析不完整可能会报错。建议：只有用到了 template 或 style 才写 Vue SFC，否则直接写 ts、tsx 文件即可

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

tav-ui v8.0.0+ 改动：
全局注入属性，需要添加 appId、userInfo。每个项目都需要加，appId、userInfo 与 components 属性同层级。

表格列配置使用方法：

1. 项目入口 app.vue 中注入 columnsGetApi, columnsSetApi
2. 具体页面使用时，引入 useRouter getTableProId，如下：

```javascript
import { useRouter } from 'vue-router'
import { getTableProId } from 'tav-ui'
```

手动生成唯一 id，传递给 tablepro，如下：

```javascript
const router = useRouter()
const tableProId = ref < string > ''
tableProId.value = getTableProId(router, 'all')
```

然后在 tablepro 的 customactionconfig 中设置 column 为 true 即可。

需要注意的是：

1. 持久化过程中需要给每个 table 生成唯一 id，目前 getTableProId 逻辑的实现是取当前页面的 router name，与传入的字符串组合，所以必须要保证每个 router 都有唯一的英文 name。
2. 表格 column 要使用右侧的列设置,field 中不能含有下划线\_,会影响到 key 的取值

```javascript
//错误示例
columns: [
  {
    field: 'group_1',
    title: '分组1',

    children: [
      {
        field: 'group_1_1',
        title: '分组1-1',
        customRender: () => {
          return 'sssss'
        },
      },
      {
        field: 'group_1_2',
        title: '分组1-2',
      },
    ],
  },
]
//正确示例
columns: [
  {
    field: 'group1',
    title: '分组1',

    children: [
      {
        field: 'group11',
        title: '分组1-1',
        customRender: () => {
          return 'sssss'
        },
      },
      {
        field: 'group12',
        title: '分组1-2',
      },
    ],
  },
]
```
1. 持久化过程中需要给每个table生成唯一id，目前getTableProId逻辑的实现是取当前页面的router name，与传入的字符串组合，所以必须要保证每个router都有唯一的英文name
2. 如果表头有层级则每一层必须加field,field也要保持唯一
