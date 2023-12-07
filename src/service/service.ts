type ResponseService = Promise<{
  data: number;
}>

const service = async (): ResponseService => {
  const data = await fetch("https://www.gonraul.tech/freeze")
  const response: {data: number} = await data.json()
  return response
}
export default service