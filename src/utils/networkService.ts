import axios, {AxiosHeaders} from 'axios'
import {REQUEST_FAILED_401, requestTimeout} from '../common/constants.ts'
import {getRefreshToken, getToken, setRefreshToken, setToken} from './secureStorage.ts'
import {navigationRef, network, rootStore} from '../RootNavigation.tsx'
import {Routers} from '../navigation/Routes.ts'
import {TokensType} from '../common/types/UserType.ts'

export const activeRequest: Map<string, AbortController> = new Map<string, AbortController>()

export const cancelRequest = (url: string) => {
  if (activeRequest.has(url)) {
    activeRequest.get(url)?.abort()
    activeRequest.delete(url)
  }
}
export const createNetworkService = () => {
  const axiosInstance = axios.create({
    baseURL: process.env.BASE_URL ?? 'http://80.209.243.22:3000/api',
  })

  axiosInstance.defaults.timeout = requestTimeout
  axiosInstance.defaults.headers.post['Content-Type'] = 'application/json'

  axiosInstance.interceptors.request.use(async config => {
    const controller = new AbortController()
    const token = await getToken()
    activeRequest.set(config?.url ?? '', controller)
    return {
      ...config,
      signal: controller.signal,
      headers: new AxiosHeaders({
        ...config.headers,
        Authorization: `Bearer ${token}`,
      }),
    }
  })

  axiosInstance.interceptors.response.use(
    async response => {
      if (activeRequest.has(response.config?.url ?? '')) {
        activeRequest.delete(response.config?.url ?? '')
      }
      return response
    },
    async error => {
      if (error.message === REQUEST_FAILED_401 && !(await getRefreshToken()) && navigationRef.isReady()) {
        console.log(`need unauthorized`)
        rootStore.authStore.setIsUserAuth(false)
        navigationRef.navigate({key: Routers.AUTH})
      } else if (error.message === REQUEST_FAILED_401 && (await getRefreshToken())) {
        console.log(`need refresh token`)
        if (rootStore.authStore.isRefreshTokenInProcess) {
          return
        }
        try {
          rootStore.authStore.setIsRefreshTokenInProcess(true)
          const refreshToken = await getRefreshToken()
          const {data} = await network.post<TokensType>('/auth/refresh-tokens', undefined, {
            headers: {
              'Refresh-token': `Bearer ${refreshToken}`,
            },
          })
          await setToken(data.access_token)
          await setRefreshToken(data.refresh_token)
          rootStore.authStore.setIsRefreshTokenInProcess(false)
          error.response.config.headers['Authorization'] = data.access_token ? `Bearer ${data.access_token}` : ''
          return axiosInstance(error.config)
        } catch (e) {
          console.log(`catch ${e}`)
        }
      }
      console.log(`error`, JSON.stringify(error.response))
      return Promise.reject(error)
    },
  )

  return axiosInstance
}
