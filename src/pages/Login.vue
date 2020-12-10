<template>
  <div class="login-page">
    <div class="login-page-2">
      <!-- Body form -->
      <div class="login-page-3">
        <div class="login-page-4">
          <!-- Title  -->
          <div class="bg-text">
            <div class="login-logo">
              <q-img  src="~assets/logo-grande.png" style="width: 250px"/>
            </div>
          </div>

          <q-tab-panels
            style="padding: 0px !important; border-radius: 6px;"
            v-model="tab"
            animated
            transition-prev="scale"
            transition-next="scale"
            class="text-center q-pa-xs"
          >
            <!-- Form in Login -->
            <q-tab-panel name="signin-tab" class="q-pa-xs">
              <q-form @submit="onLogin" class="login-form">
                <q-input
                  color="primary"
                  label="Login"
                  v-model="user.email"
                  lazy-rules
                  filled
                  :rules="[
                    val => (val && val.length > 0) || 'Preencha o campo por favor'
                  ]"
                  v-on:keyup.enter="onLogin"
                >
                  <template v-slot:prepend>
                    <q-icon name="person" />
                  </template>
                </q-input>

                <q-input
                  v-model="user.password"
                  :type="isPwd ? 'password' : 'text'"
                  label="Senha"
                  lazy-rules
                  filled
                  :rules="[
                    val => (val && val.length > 0) || 'Preencha o campo por favor'
                  ]"
                  v-on:keyup.enter="onLogin"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock" />
                  </template>

                  <template v-slot:append>
                    <q-icon
                      :name="isPwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="isPwd = !isPwd"
                    />
                  </template>
                </q-input>

                <div>
                  <q-btn
                    unelevated
                    rounded
                    class="login-btn q-mt-sm action-button float-left"
                    :loading="loading"
                    label="Entrar"
                    type="submit"
                    color="primary"
                  >
                    <template v-slot:loading>
                      <q-spinner-facebook />
                    </template>
                  </q-btn>

                  <q-btn
                    class="login-btn q-mt-sm q-mb-md q-ml-md action-button float-right"
                    label="Esqueci minha senha!"
                    :disable="loading"
                    unelevated
                    no-caps
                    rounded
                    @click="tab = 'recover-password-tab'"
                    color="primary"
                    flat
                  />
                </div>
              </q-form>
            </q-tab-panel>

            <!-- Form in Recover Password -->
            <q-tab-panel name="recover-password-tab" class="q-pa-xs">
              <q-form @submit="onSendEmail" class="login-form">
                <q-input
                  color="primary"
                  label="Email"
                  type="email"
                  v-model="emailRecover.email"
                  lazy-rules
                  filled
                  :rules="[
                    val => (val && val.length > 0) || 'Preencha o campo'
                  ]"
                  v-on:keyup.enter="onSendEmail"
                >
                  <template v-slot:prepend>
                    <q-icon name="email" />
                  </template>
                </q-input>

                <div class>
                  <q-btn
                    unelevated
                    rounded
                    class="login-btn q-mt-sm q-mb-md action-button float-left"
                    :loading="loading"
                    label="Enviar"
                    type="submit"
                    icon="send"
                    color="primary"
                  >
                    <template v-slot:loading>
                      <q-spinner-facebook />
                    </template>
                  </q-btn>

                  <q-btn
                    class="login-btn q-mt-sm q-ml-md action-button float-right"
                    label="voltar"
                    :disable="loading"
                    unelevated
                    no-caps
                    rounded
                    @click="tab = 'signin-tab'"
                    color="primary"
                    flat
                  />
                </div>
              </q-form>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { EventBus } from 'src/functions/event-bus.js'
import { ROLEUSERS } from 'src/enumerator/rolesAccessUsers'
import api from 'src/statics/endpoints/Api.json'

export default {
  name: 'Login',
  data () {
    return {
      user: {
        email: null,
        password: null
      },
      emailRecover: { email: '' },
      isPwd: true,
      logging: false,
      tab: 'signin-tab',
      loading: false,
      relatedCompanies: [],
      selectedCompany: null,
      loginResponse: null,
      connected: this.$store.getters['user/getConnected']
    }
  },

  beforeCreate () {
    EventBus.$on('showNotify', notification => {
      this.showNotify(notification)
    })
  },

  beforeDestroy () {
    EventBus.$off('showNotify')
  },

  methods: {
    async onLogin () {
      try {
        this.loading = true
        this.user.email = this.user.email.trim().toLowerCase()
        const response = await this.$axios.post('auth/signin', this.user)
        this.registerLocalStorage(response.data.token, response.data.user)
        this.readyRolesUser(response.data.user)
      } catch (e) {
        console.log(e)
        this.showNotify({ color: 'red', icon: 'error_outline', message: e.response.data.message })
        this.loading = false
      }
    },

    async onSendEmail () {
      this.loading = true
      try {
        await this.$axios.post(api.sendRecoverEmail, this.emailRecover)
        this.showNotify({ color: 'green', icon: 'email', message: 'Verifique sua caixa de email' })
        this.loading = false
      } catch (e) {
        // this.showNotify({ color: 'red', icon: 'error_outline', message: e.response.data.message })
        console.log(e)
        this.loading = false
      }
    },

    registerLocalStorage (token, user) {
      this.$q.localStorage.set('access_token', token)

      this.$q.localStorage.set('user', user)
    },

    readyRolesUser (user) {
      console.log(user)
      if (user.role !== ROLEUSERS.ADMIN) {
        const schoolId = user.sourceSchool.id
        this.$q.localStorage.set('school_id', schoolId)
        this.$store.commit('user/updateSchoolId', schoolId)
      }

      this.showNotify({ color: 'green', icon: 'email', message: 'Seja Bemvindo ao AEE - Gestor de Alunos' })
      this.$router.push('index')
    },

    showNotify (notification) {
      this.$q.notify({
        color: notification.color,
        textColor: 'white',
        icon: notification.icon,
        message: notification.message
      })
    }
  }
}
</script>

<style lang="stylus">
.login-page {
  zoom: 100%;
  background-color: #eee;
  letter-spacing: unset;
  color: #3c4858;
}

.login-page-2 {
  height: auto;
  min-height: 100vh;
}

.login-page-3 {
  background-image: url('~assets/fundo.jpg');
  width: 100%;
  height: 100%;
  min-height: 100vh;
  background-position: top;
  background-size: cover;
  margin: 0;
  padding: 0;
  border: 0;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

.login-page-3::before {
  position: absolute;
  width: 100%;
  height: 100%;
  display: block;
  left: 0;
  top: 0;
  content: '';
  background: rgba(0, 0, 0, 0.6);
}

.login-page-4 {
  max-width: 500px;
  border-radius: 6px;
  min-width: 250px;
  width: 350px;
  margin: 0 auto;
  -webkit-transform: translateZ(0);
  transform: translateZ(0);
  background-color: var(--md-theme-default-background, #fff);
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
  -ms-flex-direction: column;
  flex-direction: column;
  position: relative;
  overflow: unset;
  font-size: 0.875rem;
  -webkit-box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.14);
  color: #333;
}

.login-form {
  padding: 15px 20px;
  line-height: 1.75em;
  position: relative;
  font-size: 14px;
}

.bg-text {
  padding: 15px;
  z-index: 2;
  z-starter: 2;
  width: 100%;
}

.login-logo {
  text-align: center;
  font-size: 1.5rem;
}
</style>
