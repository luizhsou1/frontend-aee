<template >
  <q-dialog v-model="onShow" transition-show="scale" transition-hide="scale" persistent style="height: auto !important">
    <q-card style="min-width: 70vw;">
      <q-toolbar class="bg-primary text-white shadow-1">
        <q-toolbar-title class="flex flex-center">Escola</q-toolbar-title>
        <q-btn class="float-right" flat round dense icon="close" @click="canceled" />
      </q-toolbar>

      <q-card-section class="flex flex-center">
        <div style="width: 80%">
        <div class="row justify-start">
          <q-input
            class="col-md-8 q-ma-sm"
            filled
            v-model="school.name"
            label="Nome da Escola"
            dense
            error-message="Campo Precisa ser preenchido"
            :error="$v.school.name.$error"
          >
            <template v-slot:prepend>
              <q-icon name="eva-file-remove-outline" />
            </template>
          </q-input>

          <q-toggle
            class="col-md-3 q-ma-sm"
            filled
            v-model="school.hasAee"
            label="Possui AEE?"
            dense
          />
        </div>

        <q-separator />

        <div class="row justify-start">
          <q-input
            class="col-md-3 q-ma-sm"
            filled
            v-model="address.cep"
            label="Cep"
            dense
          >
            <template v-slot:prepend>
              <q-icon name="eva-map-outline" />
            </template>
          </q-input>
        </div>

        <div class="row justify-start">
          <q-input
            class="col-md-8 q-ma-sm"
            filled
            v-model="address.street"
            label="Rua"
            dense
            error-message="Campo Precisa ser preenchido"
            :error="$v.address.street.$error"
          >
            <template v-slot:prepend>
              <q-icon name="eva-file-remove-outline" />
            </template>
          </q-input>

          <q-input
            class="col-md-3 q-ma-sm"
            filled
            v-model="address.addressNumber"
            label="Numero"
            dense
            error-message="Campo Precisa ser preenchido"
            :error="$v.address.addressNumber.$error"
          >
            <template v-slot:prepend>
              <q-icon name="eva-file-remove-outline" />
            </template>
          </q-input>
        </div>

        <div class="row justify-start">

          <q-input
            class="col-md-6 q-ma-sm"
            filled
            v-model="address.neighborhood"
            label="Bairro"
            dense
            error-message="Campo Precisa ser preenchido"
            :error="$v.address.neighborhood.$error"
          >
            <template v-slot:prepend>
              <q-icon name="eva-file-remove-outline" />
            </template>
          </q-input>

          <q-input
            class="col-md-5 q-ma-sm"
            filled
            v-model="address.complement"
            label="Complemento"
            :error="false"
            dense
          >
            <template v-slot:prepend>
              <q-icon name="eva-file-remove-outline" />
            </template>
          </q-input>
        </div>

        <div class="row justify-start">
          <q-input
            class="col-md-6 q-ma-sm"
            filled
            v-model="address.city"
            label="Cidade"
            dense
            error-message="Campo Precisa ser preenchido"
            :error="$v.address.city.$error"
          >
            <template v-slot:prepend>
              <q-icon name="eva-map-outline" />
            </template>
          </q-input>

          <q-select class="col-md-5 q-ma-sm" filled bottom-slots v-model="address.uf" :options="ufs" label="Estado" dense options-dense>
            <template v-slot:prepend>
              <q-icon name="eva-file-remove-outline" @click.stop />
            </template>
            <template v-slot:append>
              <q-icon name="close" @click.stop="address.uf = ''" class="cursor-pointer" />
            </template>
          </q-select>
        </div>

        <!-- Phones -->
        <div class="row justify-start">
          <q-input
            class="col-md-5 q-ma-sm"
            filled
            reverse-fill-mask
            mask="(##) ####-####"
            v-model="phone1.phoneNumber"
            label="Telefone 1"
            dense
            error-message="Campo Precisa ser preenchido"
            :error="$v.phone1.phoneNumber.$error"
          >
            <template v-slot:prepend>
              <q-icon name="eva-phone-outline" />
            </template>
          </q-input>

          <q-input
            class="col-md-5 q-ma-sm"
            filled
            mask="(##) #####-####"
            reverse-fill-mask
            v-model="phone2.phoneNumber"
            :error="false"
            label="Telefone 2"
            dense
          >
            <template v-slot:prepend>
              <q-icon name="eva-phone-outline" />
            </template>
          </q-input>
        </div>
        </div>
      </q-card-section>

      <q-card-section></q-card-section>
      <q-card-actions style="margin: 10px;" class="text-teal container-card absolute-bottom-right">
        <q-btn color="primary" dense rounded no-caps label="salvar" @click="confirm" />
      </q-card-actions>

      <q-inner-loading :showing="loading">
        <q-spinner-facebook color="light-blue" />
      </q-inner-loading>
    </q-card>
  </q-dialog>
</template>

<script>
import { EventBus } from 'src/functions/event-bus.js'
import { required } from 'vuelidate/lib/validators'
import api from 'src/statics/endpoints/Api.json'

export default {
  name: 'di-escolas',

  created () {
    EventBus.$on('on-edit-school', (school) => {
      this.onShow = true

      const { name, hasAee, address, phones } = school
      this.school = { name, hasAee }

      this.address = address

      this.phone1 = phones[0]

      this.phone2 = phones[1] || { description: 'Telefone 2', phoneNumber: '' }
    })

    EventBus.$on('on-new-school', () => {
      this.school = {}
      this.$nextTick(() => { this.$v.$reset() })
      this.onShow = true
    })
  },

  beforeDestroy () {
    EventBus.$off('on-edit-school')

    EventBus.$off('on-new-school')
  },

  data () {
    return {
      onShow: false,
      loading: false,
      api: api,
      school: {
        name: '',
        hasAee: false
      },
      address: {
        cep: '',
        city: '',
        uf: '',
        neighborhood: '',
        street: '',
        addressNumber: '',
        complement: ''
      },
      phones: [],
      phone1: {
        description: 'Telefone 1',
        phoneNumber: ''
      },
      phone2: {
        description: 'Telefone 2',
        phoneNumber: ''
      },
      ufs: [
        'AC',
        'AL',
        'AP',
        'AM',
        'BA',
        'CE',
        'DF',
        'ES',
        'GO',
        'MA',
        'MT',
        'MS',
        'MG',
        'PA',
        'PB',
        'PR',
        'PE',
        'PI',
        'RJ',
        'RN',
        'RS',
        'RO',
        'RR',
        'SC',
        'SP',
        'SE',
        'TO'
      ]
    }
  },

  validations: {
    school: {
      name: { required }
    },
    address: {
      city: { required },
      uf: { required },
      neighborhood: { required },
      street: { required },
      addressNumber: { required }
    },
    phone1: {
      phoneNumber: { required }
    }
  },

  methods: {
    onHideModal () {
      this.onShow = false
    },

    async confirm () {
      try {
        if (!this.validationsFields()) {
          return
        }

        let axiosFunction = this.$axios.post
        let url = api.schools

        const schoolPayload = { ...this.school, address: this.address, phones: [this.phone1, this.phone2] }

        if (schoolPayload.id) {
          url += `/${schoolPayload.id}/`
          axiosFunction = this.$axios.path
        }

        this.loading = true
        await axiosFunction(url, schoolPayload)
        this.loading = false

        this.cleanFieldsClose()
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    },

    validationsFields () {
      this.$v.school.$touch()

      return !this.$v.school.$error
    },

    cleanFieldsClose () {
      this.school = {}
      this.$nextTick(() => { this.$v.$reset() })
      EventBus.$emit('on-refresh-school')
      this.onHideModal()
    },

    canceled () {
      this.onHideModal()
    }
  }
}
</script>

<style lang="stylus">
.list-guest {
  list-style: none;

  .q-field--focused .q-field__control {
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2), 0 2px 2px rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12);
    background: #F2F2F2 !important;
  }
}

</style>
