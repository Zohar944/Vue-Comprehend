/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

import { def } from '../util/index'

const arrayProto = Array.prototype
export const arrayMethods = Object.create(arrayProto) 
/**
 * arrayMethods被def处理过，def封装了对象原型中的defineProprety
 */

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {  //依赖通知
  // cache original method
  const original = arrayProto[method]
  def(arrayMethods, method, function mutator (...args) {
    const result = original.apply(this, args)
    const ob = this.__ob__
    let inserted
    switch (method) {
      case 'push':
      case 'unshift': // 如果是push或unshift方法，那么传入参数就是新增的元素
        inserted = args
        break
      case 'splice': // 如果是splice方法，那么传入参数列表中下标为2的就是新增的元素
        inserted = args.slice(2)
        break
    }
    // 数组新增元素侦测
    if (inserted) ob.observeArray(inserted)
    // notify change
    ob.dep.notify()
    return result
  })
})
