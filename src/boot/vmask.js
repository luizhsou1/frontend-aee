// import something here
import { VueMaskFilter } from 'v-mask'

export default async ({ Vue }) => {
  Vue.filter('VMask', VueMaskFilter)
}
