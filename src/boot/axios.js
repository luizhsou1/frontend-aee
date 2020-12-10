import axios from 'axios'
import { EventBus } from 'src/functions/event-bus.js'
import { REQUEST } from 'src/enumerator/request.js'

export default async ({ Vue }) => {
  const axiosInstance = axios.create({
    baseURL: process.env.API,
    withCredentials: true,
    headers: {}
  })

  // INTERCEPTORS REQUEST
  axiosInstance.interceptors.request.use(
    config => {
      const token = localStorage.getItem('access_token')
      const schoolId = localStorage.getItem('school_id')

      config.headers['Content-Type'] = 'application/json'

      if (token) {
        config.headers.Authorization = `Bearer ${token.split('|')[1]}`
      }

      if (schoolId) {
        config.headers.schoolId = schoolId.split('|')[1]
      }
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )

  // INTERCEPTORS RESPONSE
  axiosInstance.interceptors.response.use(
    response => {
      if (response.data.message) {
        var notification = {
          color: 'green',
          icon: 'eva-checkmark-outline',
          message: Array.isArray(response.data.message) ? response.data.message[0] : response.data.message
        }

        EventBus.$emit('show-notify', notification)
      }
      return response
    },
    error => {
      var notification = {
        color: 'red',
        textColor: 'white',
        icon: 'error_outline',
        message: 'unknowError'
      }

      if (error.response) {
        const status = error.response.status
        const message = 'Problema interno no servidor'

        if (status === REQUEST.LOGIN_FAILED) {
          EventBus.$emit('invalid-token')
        } else if (status === REQUEST.UNAUTHORIZED) {
          EventBus.$emit('invalid-token')
        }

        notification.message = (Array.isArray(error.response.data.message) ? error.response.data.message[0] : error.response.data.message) ||
          message

        EventBus.$emit('show-notify', notification)

        return Promise.reject(error)
      }
    }
  )

  Vue.prototype.$axios = axiosInstance
}
