type ResponseService<T> = Promise<T>

const service = async <T>(path: string): ResponseService<T> => {
  const data = await fetch("https://www.gonraul.tech"+ path)
  const response: T = await data.json()
  return response
}
export default service