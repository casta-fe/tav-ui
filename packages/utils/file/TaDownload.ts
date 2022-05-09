/*
 * @Author: huyb
 * @Descripttion: 临时方案，框架的好了后即刻废除
 * @Date: 2021-12-09 11:32:01
 */
import { isArray } from '../is'
// import { downloadFile, multiDownLoad } from "/@/api/file";
// 不允许在utils中直接调用组件，用callback抛出去在组件使用的地方调用
// import { useMessage } from "@casta-fe-playground/hooks/src/web/useMessage";
// const { createMessage } = useMessage();
export interface FileItemType {
  // 文件真实id
  actualId: string
  address: string
  appId: number
  businessId: null
  businessKey: null
  createTime: string
  createBy: string | number
  createByName: string
  deleted: number
  fullName: string
  hyperlink: number
  id: number
  moduleId: number
  name: string
  runtime: null
  size: number
  suffix: string
  type: number
  version: number
  moduleCode: String
  typeCode: string
  fileId: any
}
const typeDic = {
  docx: 'application/msword',
  doc: 'application/msword',
  bin: 'application/octet-stream',
  exe: 'application/octet-stream',
  so: 'application/octet-stream',
  dll: 'application/octet-stream',
  pdf: 'application/pdf',
  ai: 'application/postscript',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.ms-powerpoint',
  dir: 'application/x-director',
  js: 'application/x-javascript',
  swf: 'application/x-shockwave-flash',
  xhtml: 'application/xhtml+xml',
  xht: 'application/xhtml+xml',
  zip: 'application/zip',
  mid: 'audio/midi',
  midi: 'audio/midi',
  mp3: 'audio/mpeg',
  rm: 'audio/x-pn-realaudio',
  rpm: 'audio/x-pn-realaudio-plugin',
  wav: 'audio/x-wav',
  bmp: 'image/bmp',
  gif: 'image/gif',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  css: 'text/css',
  html: 'text/html',
  htm: 'text/html',
  txt: 'text/plain',
  xsl: 'text/xml',
  xml: 'text/xml',
  mpeg: 'video/mpeg',
  mpg: 'video/mpeg',
  avi: 'video/x-msvideo',
  movie: 'video/x-sgi-movie',
}

export function downLoadCallBack(res, name, suffix) {
  if (!res)
    return

  const fileReader = new FileReader()
  fileReader.readAsText(res, 'utf-8')
  fileReader.onload = () => {
    try {
      // const { result } = fileReader;
      // const errorData = JSON.parse(result as string);
      // const { code, msg } = errorData;
      // if (code === "5001") {
      //   // createMessage.warning(msg);
      // } else {
      //   // createMessage.warning("请求出错，请稍候重试");
      // }
    }
    catch (err) {
      if ((window.navigator as any).msSaveBlob) {
        // IE以及IE内核的浏览器
        try {
          (window.navigator as any).msSaveBlob(res, name) // res为接口返回数据，这里请求的时候已经处理了，如果没处理需要在此之前自行处理var data = new Blob([res.data]) 注意这里需要是数组形式的,fileName就是下载之后的文件名
          // window.navigator.msSaveOrOpenBlob(res, fileName); //此方法类似上面的方法，区别可自行百度
        }
        catch (e) {
          // console.log(e);
        }
      }
      else {
        const url = window.URL.createObjectURL(new Blob([res], { type: typeDic[suffix] }))
        const link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', name) // 文件名
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link) // 下载完成移除元素
        window.URL.revokeObjectURL(url) // 释放掉blob对象
      }
    }
  }
}
const download = (data) => {
  if (isArray(data)) {
    if (data.length == 0) {
      // createMessage.warning("请选择要下载的文件");
      return
    }
    const ids: number[] = []
    data.forEach((v: FileItemType) => {
      ids.push(v.id)
    })
    // multiDownLoad(ids).then((res) => {
    //   downLoadCallBack(res, fileName || "批量下载", "zip");
    // });
  }
  else {
    if (!data || !data.id) {
      // createMessage.warning("请选择要下载的文件");

    }
    // const file: FileItemType = { ...data };
    // console.log(fileName,file);

    // downloadFile(file.id).then(async (res) => {
    //   const El: HTMLAnchorElement = window.document.createElement("A");
    //   El.setAttribute("download", fileName || file.name);
    //   El.setAttribute("href", res.data);
    //   El.setAttribute("target", "_blank");
    //   El.click();
    // });
  }
}

export default download
