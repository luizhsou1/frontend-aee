<template>
  <div class="q-pa-md">
    <q-table
      row-key="id"
      :loading="loading"
      class="my-sticky-header-table"
      :data="data"
      :columns="columns"
      :visible-columns="visibleColumns"
      :filter="filter"
      :pagination.sync="pagination"
      @request="onRequest"
      rows-per-page-label="Registros por páginas"
      no-data-label="Ainda não temos escolas cadastradas"
      binary-state-sort
    >
      <template v-slot:loading>
        <q-inner-loading showing color="primary">
          <q-spinner-facebook size="50px" color="primary" />
        </q-inner-loading>
      </template>

      <template v-slot:top>
        <div style="width: 100%">
          <div class="row">
            <div class="col" style="display: block">
              <q-icon class="q-pl-sm" name="fas fa-school" color="primary" size="sm" style="display: block;"/>
              <span style="font: 25px/36px Avenir Next W01,Helvetica,Arial,sans-serif">Escolas</span>
              <p class="subtitle">Lista de todas as Escolas cadastradas.</p>
            </div>
          </div>

          <div
            class="row justify-end"
            :class="{'justify-center': $q.screen.lt.sm}"
            style="width: 100%; margin-top: 1rem"
          >
            <div class="col-md-4 col-sm-4">
              <q-btn
                label="Cadastrar Escola"
                dense
                flat
                rounded
                no-caps
                color="primary"
                icon="add"
                @click="openDialogSchool"
              />
            </div>

            <div class="col-md-8 col-sm-5">
              <q-input
                class="q-ml-lg float-right"
                dense
                filled
                debounce="300"
                v-model="filter"
                placeholder="Busca"
                style="max-width: 40%"
              >
                <q-icon slot="append" name="search" />
              </q-input>
            </div>
          </div>
        </div>
      </template>

      <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols.filter((item) => item.name !== 'id')"
            :key="col.name"
            :props="props"
          >{{ col.label }}</q-th>

          <q-th auto-width />
        </q-tr>
      </template>

      <template v-slot:body="props">
        <!-- {{ props.row}} -->
        <q-tr :props="props" style="cursor: pointer">
          <q-td auto-width :props="props" key="name" @click="openEdit(props.row)">{{props.row.name}}</q-td>
          <q-td auto-width :props="props" key="address">{{formatAddress(props.row.address)}}</q-td>
          <q-td auto-width :props="props" key="phones">{{formatPhone(props.row.phones) | VMask('(##) ####-####')}}</q-td>

          <q-td auto-width>
            <q-btn
              size="sm"
              flat
              class="q-ma-xs bg-white"
              color="red"
              round
              dense
              icon="eva-trash-2-outline"
              @click="openDelete(props.row)"
            />
          </q-td>
        </q-tr>
      </template>

      <div slot="bottom" slot-scope="props" style="margin: 0 auto">
        <div>
          <q-pagination
            v-model="props.pagination.page"
            :max="1"
            :direction-links="true"
            @input="setPagination"
          ></q-pagination>
        </div>
      </div>
    </q-table>

    <q-dialog v-model="showDelete" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-icon size="2em" name="thumb_down" color="red" />
          <span class="q-ml-sm">Deseja mesmo excluir a escola?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat no-caps label="Vou pensar melhor..." color="grey" v-close-popup />
          <q-btn
            flat
            no-caps
            label="Sim, desejo excluí-la!"
            color="red"
            @click="deleteSchool"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { EventBus } from 'src/functions/event-bus.js'
import api from 'src/statics/endpoints/Api.json'

export default {
  name: 'dt-escolas',

  data () {
    return {
      filter: '',
      api: api,
      showDelete: false,
      loading: false,
      schoolFocus: {},
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10
      },
      visibleColumns: ['name', 'address', 'phones'],
      columns: [
        { align: 'left', name: 'id', label: 'id', field: 'id', sortable: true },
        {
          align: 'left',
          name: 'name',
          label: 'Nome da Escola',
          field: 'name',
          sortable: true
        },
        {
          align: 'left',
          name: 'address',
          label: 'Endereço',
          field: 'address',
          sortable: true
        },
        {
          align: 'left',
          name: 'phones',
          label: 'Telefone',
          field: 'phones',
          sortable: true
        }
      ],
      data: []
    }
  },

  created () {
    EventBus.$on('on-refresh-schools', () => {
      this.onRequest({ pagination: this.pagination, filter: this.filter })
    })
  },

  beforeDestroy () {
    EventBus.$off('on-refresh-schools')
  },

  mounted () {
    this.refresh()
  },

  methods: {
    setPagination (value) {
      this.pagination.page = value
      this.onRequest({ pagination: this.pagination, filter: this.filter })
    },

    openDialogSchool () {
      EventBus.$emit('on-new-school')
    },

    async onRequest (props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination

      this.loading = true

      const returnedData = await this.$axios.get(api.schools, { params: { filter: this.filter } })

      console.log(returnedData)
      this.data.splice(0, this.data.length, ...returnedData.data.schools)

      this.pagination.page = page
      this.pagination.rowsPerPage = rowsPerPage
      this.pagination.sortBy = sortBy
      this.pagination.descending = descending

      this.loading = false
    },

    formatAddress (address) {
      return `${address.street}, ${address.addressNumber}, ${address.neighborhood} - ${address.city}`
    },

    formatPhone (phones) {
      return `${phones[0].phoneNumber}`
    },

    openEdit (school) {
      EventBus.$emit('on-edit-school', school)
    },

    openDelete (school) {
      this.showDelete = true
      this.schoolFocus = Object.assign({}, school)
    },

    refresh () {
      this.onRequest({
        pagination: this.pagination,
        filter: undefined
      })
    },

    async deleteSchool () {
      try {
        this.loading = true

        await this.$axios.delete(api.schoolId.replace('{id}', this.schoolFocus.id))

        this.$q.notify({
          color: 'positive',
          type: 'positive',
          message: 'Escola Excluida com Sucesso!'
        })

        this.schoolFocus = undefined
        this.refresh()
        this.loading = false
      } catch (e) {
        this.loading = false
        console.log(e)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.subtitle
  color: #555d61;
  font: 16px/24px Avenir Next W01,Helvetica,Arial,sans-serif;

.my-sticky-header-table
  height: 80vh

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  &.q-table--loading thead tr:last-child th
    top: 48px
</style>
