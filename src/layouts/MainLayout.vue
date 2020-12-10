<template>
  <q-layout view="lHh Lpr fff" class="bg-grey-1">
    <q-header elevated class="bg-white text-grey-8" height-hint="64">
      <q-toolbar class="GPL__toolbar" style="height: 64px">

        <q-btn
          flat
          v-if="!$q.screen.gt.sm"
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="menu"
          class="q-mx-md"
        />

        <q-toolbar-title v-if="$q.screen.gt.sm" shrink class="row items-center no-wrap">
          <img src="~assets/logo.png" style="width: 30px"/>
          <span class="q-ml-sm">Gestor de Alunos</span>
        </q-toolbar-title>

        <q-space />

        <q-space />

        <div class="q-gutter-sm row items-center no-wrap">
          <q-btn flat no-caps round>
            <div class="column items-center">
              <q-icon name="person" size="lg" />
              <span></span>
            </div>
            <q-menu transition-show="scale" transition-hide="scale">
              <div class="row no-wrap q-pa-md">
                <div class="column">
                  <div class="text-h6 q-mb-md">Configurações</div>
                  <q-btn
                    flat
                    dense
                    rounded
                    no-caps
                    color="green"
                    label="Segurança"
                    @click="openDialogProfile"
                  />
                </div>
                <q-separator vertical inset class="q-mx-lg" />

                <div class="column items-center">
                  <!-- <q-avatar size="55px">
                    <img src="../../public/images/user.png" />
                  </q-avatar>-->

                  <!-- <div class="text-subtitle1 q-mt-md q-mb-xs">{{ nameUser }}</div> -->

                  <q-btn
                    color="primary"
                    label="Sair"
                    no-caps
                    push
                    size="sm"
                    @click="logout"
                    v-close-popup
                  />
                </div>
              </div>
            </q-menu>
          </q-btn>

        </div>
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      behavior="mobile"
      @click="leftDrawerOpen = false"
    >
      <q-scroll-area class="fit">
        <q-toolbar class="GPL__toolbar">
          <q-toolbar-title class="row items-center text-grey-8">
            <img src="~assets/logo.png" style="width: 30px"/>
            <span class="q-ml-sm">Gestor de Alunos</span>
          </q-toolbar-title>
        </q-toolbar>

        <q-list padding>
          <q-item v-for="link in links1" :key="link.text" clickable class="GPL__drawer-item">
            <q-item-section avatar>
              <q-icon :name="link.icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ link.text }}</q-item-label>
            </q-item-section>
          </q-item>

        </q-list>
      </q-scroll-area>
    </q-drawer>

    <q-page-container class="GPL__page-container">
      <router-view />

      <q-page-sticky v-if="$q.screen.gt.sm" expand position="left">
        <div class="fit q-pt-xl q-px-sm column">
          <q-btn round flat color="grey-8" stack no-caps size="26px" class="GPL__side-btn" @click="getPage('escolas')" :class="{'menu-active': $route.name === 'escolas'}">
            <q-icon size="22px" name="fas fa-school" />
            <div class="GPL__side-btn__label">Escolas</div>
          </q-btn>

          <q-btn round flat color="grey-8" stack no-caps size="26px" class="GPL__side-btn" @click="getPage('usuarios')" :class="{'menu-active': $route.name === 'usuarios'}">
            <q-icon size="22px" name="group" />
            <div class="GPL__side-btn__label">Usuários</div>
          </q-btn>
          <q-btn round flat color="grey-8" stack no-caps size="26px" class="GPL__side-btn" @click="getPage('documentos')" :class="{'menu-active': $route.name === 'documentos'}">
            <q-icon size="22px" name="import_contacts" />
            <div class="GPL__side-btn__label">Documentos</div>
          </q-btn>
        </div>
      </q-page-sticky>
    </q-page-container>
    <di-alter-password />
  </q-layout>
</template>

<script>
import DiAlterPassword from 'components/profile/DiAlterPassword'
import api from 'src/statics/endpoints/Api.json'
import { ROLEUSERS } from 'src/enumerator/rolesAccessUsers'
import { EventBus } from '../functions/event-bus.js'

export default {
  name: 'GooglePhotosLayout',
  data () {
    return {
      nameUser: '',
      leftDrawerOpen: false,
      search: '',
      storage: 0.26,
      api: api,
      links1: [
        { icon: 'people', text: 'Alunos' }
      ]
    }
  },

  components: { 'di-alter-password': DiAlterPassword },

  beforeCreate () {
    EventBus.$on('show-notify', (notification) => {
      this.showNotify(notification)
    })

    EventBus.$on('invalid-token', () => {
      this.logout()
    })
  },

  beforeDestroy () {
    EventBus.$off('show-notify')
    EventBus.$off('invalid-token')
  },

  mounted () {
    if (this.checkingAccess()) {
      this.$q.localStorage.set('school_id', null)
    } else {
      this.$store.commit('user/updateSchoolId', this.$q.localStorage.getItem('school_id'))
    }

    if (!this.$q.localStorage.getItem('access_token')) {
      this.$router.push('/')
    }
  },

  methods: {
    logout () {
      this.$q.localStorage.remove('access_token')
      this.$q.localStorage.remove('school_id')
      this.$q.localStorage.remove('user')
      this.$store.commit('user/updateSchoolId', null)
      this.$router.push('/')
    },

    getPage (page) {
      console.log('olha')
      if (this.$router.currentRoute.name !== page) {
        this.$router.push(page)
      }
    },

    showNotify (notification) {
      this.$q.notify({
        color: notification.color,
        textColor: 'white',
        icon: notification.icon,
        message: notification.message
      })
    },

    openDialogProfile () {
      EventBus.$emit('on-show-profile')
    },

    checkingAccess () {
      const user = this.$q.localStorage.getItem('user')

      if (user.role === ROLEUSERS.ADMIN) {
        return true
      }

      return false
    },

    getUserName (nameUser) {
      const stopWords = ['de', 'da', 'dos', 'do']
      const arrayNameUser = nameUser.split(' ')

      if (arrayNameUser.length < 2) {
        return nameUser
      }

      if (stopWords.filter(el => el.indexOf(arrayNameUser[1])).length < stopWords.length) {
        return arrayNameUser[0] + ' ' + arrayNameUser[1] + ' ' + arrayNameUser[2]
      }
      return arrayNameUser[0] + ' ' + arrayNameUser[1]
    }
  }
}
</script>

<style lang="sass">
.GPL
  &__toolbar
    height: 64px
  &__toolbar-input
    width: 35%
  &__drawer-item
    line-height: 24px
    border-radius: 0 24px 24px 0
    margin-right: 12px
    .q-item__section--avatar
      padding-left: 12px
      .q-icon
        color: #5f6368
    .q-item__label:not(.q-item__label--caption)
      color: #3c4043
      letter-spacing: .01785714em
      font-size: .875rem
      font-weight: 500
      line-height: 1.25rem
    &--storage
      border-radius: 0
      margin-right: 0
      padding-top: 24px
      padding-bottom: 24px
  &__side-btn
    &__label
      font-size: 12px
      line-height: 24px
      letter-spacing: .01785714em
      font-weight: 500
  @media (min-width: 1024px)
    &__page-container
      padding-left: 94px
</style>

<style lang="stylus">
  .menu-active {
    background-color: #ECECEC;

    .icon-menu, .text-menu {
      color: white;
    }
  }
</style>
