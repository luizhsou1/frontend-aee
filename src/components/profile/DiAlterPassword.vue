<template>
  <q-dialog v-model="onShow" transition-show="scale" transition-hide="scale">
    <q-card style="width: 1000px; max-width: 80vw; max-height: 80vh; height: auto">
      <q-toolbar class="bg-primary text-white shadow-1">
        <q-toolbar-title class="flex flex-center">Alterar Senha</q-toolbar-title>
        <q-btn class="float-right" flat round dense icon="close" @click="canceled" />
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
        <q-btn color="red" dense flat no-caps label="Cancelar" @click="canceled" />
        <q-btn color="light-blue" :loading="loading" dense no-caps label="Salvar" @click="confirm">
          <template v-slot:loading>
            <q-spinner-facebook />
          </template>
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { EventBus } from 'src/functions/event-bus.js'
import { required } from 'vuelidate/lib/validators'
import api from 'src/statics/endpoints/Api.json'

export default {
  name: 'di-userAuthentication',

  events: ['on-close'],

  created () {
    EventBus.$on('on-edit-userAuthentication', userAuthentication => {
      this.onShow = true
      this.userAuthentication = userAuthentication
    })

    EventBus.$on('on-show-profile', () => {
      this.onShow = true
    })
  },

  beforeDestroy () {
    EventBus.$off('on-edit-userAuthentication', this.userAuthentication)
    EventBus.$off('on-create-userAuthentication')
  },

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
    onShowDialog () {
      this.onShow = true
    },

    onHideDialog () {
      this.$emit('on-close')
      this.onShow = false
    },

    async alterPassword () {
      try {
        this.loading = true

        await this.$axios.patch(api.changePassword.replace('{id}', this.$q.localStorage.getItem('user').userId), this.userAuthentication)
        this.loading = false
      } catch (e) {
        this.loading = false
      }
    },

    confirm () {
      if (this.validationsFields()) {
        return
      }

      console.log('passei')
      this.alterPassword()

      this.onHideDialog()
    },

    canceled () {
      this.userAuthentication = {}
      this.onHideDialog()
    },

    validationsFields () {
      this.$v.userAuthentication.$touch()

      return this.$v.userAuthentication.$error
    }
  }
}
</script>

<style lang="stylus"></style>
