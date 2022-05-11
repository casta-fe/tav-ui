import { resolve } from 'path'
import { run } from './process'
import type { TaskFunction } from 'gulp'

const projRoot = resolve(__dirname, '..', '..', '..')
const buildRoot = resolve(projRoot, 'internal', 'build')

export const withTaskName = <T extends TaskFunction>(name: string, fn: T) =>
  Object.assign(fn, { displayName: name })

export const runTask = (name: string) =>
  withTaskName(`shellTask:${name}`, () => run(`pnpm run build ${name}`, buildRoot))
