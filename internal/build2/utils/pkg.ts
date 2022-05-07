import type { Module } from '../config/bundle';
import { bundleConfig } from '../config/bundle';
import { PKG_PREFIX } from '../config/constants';

// 重写打包后的包 处理路径 @tav-ui/es => tav-ui/es
export const pathRewriter = (module: Module) => {
  const {
    bundle: { path },
  } = bundleConfig[module];
  return (id: string) => {
    id = id.replaceAll(`${PKG_PREFIX}/`, `${path}/`);
    return id;
  };
};
