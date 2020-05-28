export default function({ $axios, redirect }) {
  $axios.onRequest((config) => {
    if (config.url[0] === '/') {
      config.url = process.env.baseUrl + config.url
    }
  })
}
