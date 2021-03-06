// data: [
//   {
//     id: 10001,
//     name: 'Test1',
//     nickname: 'T1',
//     role: 'Develop',
//     sex: 'Man',
//     age: 28,
//     address: 'ShenzhenShenzhenShenzhenShenzhenShenzhenShenzhenShenzhenShenzhenShenzhenShenzhenShenzhenShenzhenShenzhenShenzhenShenzhenShenzhenShenzhenShenzhenShenzhenShenzhenShenzhenShenzhenShenzhenShenzhen',
//   },
//   {
//     id: 10002,
//     name: 'Test2',
//     nickname: 'T2',
//     role: 'Test',
//     sex: 'Women',
//     age: 22,
//     address: 'GuangzhouGuangzhouGuangzhouGuangzhouGuangzhouGuangzhouGuangzhouGuangzhouGuangzhouGuangzhouGuangzhouGuangzhouGuangzhouGuangzhouGuangzhouGuangzhouGuangzhouGuangzhouGuangzhouGuangzhouGuangzhouGuangzhouGuangzhouGuangzhouGuangzhou',
//   },
//   {
//     id: 10003,
//     name: 'Test3',
//     nickname: 'T3',
//     role: 'PM',
//     sex: 'Man',
//     age: 32,
//     address: 'ShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghai',
//   },
//   {
//     id: 10004,
//     name: 'Test4',
//     nickname: 'T4',
//     role: 'Designer',
//     sex: 'Women',
//     age: 23,
//     address: 'ShenzhenShenzhenShenzhenShenzhenShenzhenShenzhenShenzhenShenzhenShenzhenShenzhenShenzhenShenzhenShenzhenShenzhenShenzhen',
//   },
//   {
//     id: 10005,
//     name: 'Test5',
//     nickname: 'T5',
//     role: 'Develop',
//     sex: 'Women',
//     age: 30,
//     address: 'ShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghaiShanghai',
//   },
//   {
//     id: 10006,
//     name: 'Test6',
//     nickname: 'T6',
//     role: 'Designer',
//     sex: 'Women',
//     age: 21,
//     address: 'ShenzhenShenzhenShenzhenShenzhenShenzhenShenzhenShenzhenShenzhenShenzhenShenzhenShenzhen',
//   },
//   {
//     id: 10007,
//     name: 'Test7',
//     nickname: 'T7',
//     role: 'Test',
//     sex: 'Man',
//     age: 29,
//     address: 'ShenzhenShenzhenShenzhenShenzhenShenzhenShenzhen',
//   },
//   {
//     id: 10008,
//     name: 'Test8',
//     nickname: 'T8',
//     role: 'Develop',
//     sex: 'Man',
//     age: 35,
//     address: 'ShenzhenShenzhenShenzhenShenzhen',
//   },
// ]

const address = [
  'Shenzhen',
  'Shanghai',
  'Guangdong',
  'Beijing',
  'Shandong',
  'Anhui',
  'Zhengzhou',
  'Wuhan',
  'Chengdu',
  'Chongqing',
]
const roles = ['Develop', 'Test', 'Designer', 'PM', 'FE', 'BF', 'Manger', 'Boss', 'Saler', 'Hr']
const ages = [24, 21, 22, 23, 26, 28, 30, 32, 27, 29]
const recordNum = 1000
const Avators = [
  'http://m.imeitou.com/uploads/allimg/2019080515/he0mvtgkbu3.jpg',
  'http://m.imeitou.com/uploads/allimg/2019080515/ilnzrrqglxp.jpg',
  'http://m.imeitou.com/uploads/allimg/2019080515/jhzvqecaiva.jpg',
  'http://m.imeitou.com/uploads/allimg/2019080515/3i1vb11cz51.jpg',
  'http://m.imeitou.com/uploads/allimg/2019080515/ikyq0erbl2o.jpg',
  'http://m.imeitou.com/uploads/allimg/2019080515/nhp2lycyysg.jpg',
  'http://m.imeitou.com/uploads/allimg/2019080515/otllv1al21i.jpg',
  'http://m.imeitou.com/uploads/allimg/2019080515/h23grtl50ah.jpg',
  'http://m.imeitou.com/uploads/allimg/2019080515/2w34ercytby.jpg',
  'http://m.imeitou.com/uploads/allimg/2019080515/bi5qvugt0tf.jpg',
]

export function MockData() {
  const data: Record<string, any>[] = []

  for (let i = 1; i <= recordNum; i++) {
    const record = {
      id: i,
      name: `test${i}`,
      nickname: `t${i}`,
      role: roles[Math.floor(Math.random() * 10)],
      sex: i % 2 === 1 ? 'Man' : 'Woman',
      age: ages[Math.floor(Math.random() * 10)],
      address: address[Math.floor(Math.random() * 10)].repeat(Math.floor(Math.random() * 10) * 5),
      avator: Avators[Math.floor(Math.random() * 10)],
    }

    data.push(record)
  }

  return data
}

export async function __post(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'include', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
      ai: '10002',
      at: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxIiwiZXhwIjoxNjYwOTczOTcwLCJpYXQiOjE2NTgzODE5NzB9.1uEZyERvYJquVubJ4zpHlNLXu5Ir0nrsiP0LjHUMm4k',
      rd: '52856940235c45ce29b0c43c3a8b2b84e2d9db4f3',
    },
    // redirect: 'follow', // manual, *follow, error
    // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  })
  return response.json() // parses JSON response into native JavaScript objects
}

export async function __get(url = '') {
  const response = await fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-store', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'include', // include, *same-origin, omit
  })
  return response.ok
}

export async function API__POE_INVEST_ALL(
  data,
  url = '/api/STARLIGHT-POE-WEB/invesinstitution/listPager'
) {
  // ?????? ai at rd cookie???guid
  await __get('/api/TIANTA-SYSTEM/test.html')
  // eslint-disable-next-line no-return-await
  return await __post(url, data)
}

export async function API__POE_CUSTOM_ALL(data, url = '/api/STARLIGHT-POE-WEB/customer/listPager') {
  // ?????? ai at rd cookie???guid
  await __get('/api/TIANTA-SYSTEM/test.html')
  // eslint-disable-next-line no-return-await
  return await __post(url, data)
}
