<template>
  <q-card style="width: 1000px; max-width: 80vw; max-height: 80vh; height: auto">
    <q-toolbar class="bg-primary text-white shadow-1">
      <q-toolbar-title class="flex flex-center">Recuperar Senha</q-toolbar-title>
    </q-toolbar>

    <q-card-section class="q-mb-lg">
      <div class="row justify-center">
        <q-input
          v-model="userAuthentication.password"
          class="col-md-8 q-ma-sm"
          :type="isPwd ? 'password' : 'text'"
          label="Senha"
          filled
          error-message="Campo Precisa ser preenchido"
          :error="$v.userAuthentication.password.$error"
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
      </div>

      <div class="row justify-center">
        <q-input
          v-model="userAuthentication.passwordConfirmation"
          class="col-md-8 q-ma-sm"
          :type="isPwdConfirm ? 'password' : 'text'"
          label="Confirmar senha"
          filled
          error-message="Campo Precisa ser preenchido"
          :error="$v.userAuthentication.passwordConfirmation.$error"
          v-on:keyup.enter="onLogin"
        >
          <template v-slot:prepend>
            <q-icon name="lock" />
          </template>

          <template v-slot:append>
            <q-icon
              :name="isPwdConfirm ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwdConfirm = !isPwdConfirm"
            />
          </template>
        </q-input>
      </div>
    </q-card-section>

    <q-card-actions class="text-teal absolute-bottom-right">
      <q-btn color="green" rounded :loading="loading" no-caps label="Resetar" @click="confirm">
        <template v-slot:loading>
          <q-spinner-facebook />
        </template>
      </q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
import { required } from 'vuelidate/lib/validators'

import api from 'src/statics/endpoints/Api.json'

export default {
  name: 'reset-password',

  data () {
    return {
      onShow: false,
      isPwd: true,
      isPwdConfirm: true,
      loading: false,
      api: api,
      userAuthentication: {
        password: '',
        passwordConfirmation: ''
      }
    }
  },

  validations: {
    userAuthentication: {
      password: { required },
      passwordConfirmation: { required }
    }
  },

  methods: {
    async alterPassword () {
      try {
        this.loading = true
        const response = await this.$axios.patch(api.resetPassword.replace('{token}', this.$route.query.token), this.userAuthentication)
        this.showNotify({ color: 'green', icon: 'eva-checkmark-outline', message: response.data.message })

        this.loading = false
        this.$router.push('/')
      } catch (e) {
        this.loading = false
        this.showNotify({ color: 'red', icon: 'error_outline', message: (Array.isArray(e.response.data.message) ? e.response.data.message[0] : e.response.data.message) || 'Algo de ruim aconteceu' })
      }
    },

    confirm () {
      if (this.validationsFields()) {
        return
      }

      this.alterPassword()
    },

    showNotify (notification) {
      this.$q.notify({
        color: notification.color,
        textColor: 'white',
        icon: notification.icon,
        message: notification.message
      })
    },

    validationsFields () {
      this.$v.userAuthentication.$touch()

      return this.$v.userAuthentication.$error
    }
  }
}
</script>

<style lang="stylus"></style>
