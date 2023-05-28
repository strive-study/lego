// export interface UploadResp {
//   code: number
//   message: string
//   data: {
//     url: string
//   }
// }

export interface UploadResp {
  error: number
  data: {
    urls: string[]
  }
}
