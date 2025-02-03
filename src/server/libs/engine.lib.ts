import { Engine } from '@thirdweb-dev/engine'

const engine = new Engine({
  url: process.env.ENGINE_BASE_URL ?? '',
  accessToken: process.env.ENGINE_AUTHORIZATION_TOKEN ?? '',
})

export default engine
