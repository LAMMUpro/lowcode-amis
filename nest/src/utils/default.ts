export function getDefaultResponse(): ApiResponse {
  return {
    code: 1,
    status: 0,
    data: {},
    msg: 'ok',
    msgTimeout: 2000,
  }
}