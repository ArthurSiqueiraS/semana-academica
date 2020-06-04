<template>
  <div style="height: 100%" class="lectures-table">
    <v-data-table
      v-model="selected"
      :headers="headers"
      :items="lectures"
      no-data-text="Nenhum dado encontrado."
      :disable-sort="$vuetify.breakpoint.smAndDown"
      show-select
      :items-per-page="5"
      :footer-props="footerProps"
      height="100%"
      style="height: 100%"
      class="primary--text d-flex flex-column"
      @click:row="(lecture) => editLecture(lecture)"
    >
      <template v-slot:top>
        <v-toolbar dense flat class="accent">
          <div class="title white--text">Palestras</div>
          <v-spacer />
          <v-btn small depressed color="primary" to="/admin/lectures/new">
            Adicionar palestra
          </v-btn>
        </v-toolbar>
      </template>
      <template v-slot:item.thumbnail="{ item }">
        <v-card
          height="125"
          width="150"
          tile
          flat
          class="my-3"
          style="padding: 3px"
          color="primary"
        >
          <v-img :src="item.thumbnail" max-height="100%" max-width="100%" />
        </v-card>
      </template>
      <template v-slot:footer.page-text="{ pageStart, pageStop, itemsLength }">
        {{ pageStart }} - {{ pageStop }} de {{ itemsLength }}
      </template>
    </v-data-table>
  </div>
</template>
<script>
export default {
  middleware({ redirect, $auth }) {
    if (!$auth.hasScope()) {
      redirect('/')
    }
  },
  data() {
    return {
      selected: [],
      headers: [
        { text: 'Data', value: 'day' },
        { text: 'Horário', value: 'time' },
        { text: 'Título', value: 'title' },
        {
          text: 'Palestrante',
          value: 'speaker'
        },
        { text: 'Resumo', value: 'description' },
        { text: 'Capa', value: 'thumbnail', sortable: false }
      ],
      footerProps: {
        itemsPerPageText: 'Itens por página',
        itemsPerPageAllText: 'Todos',
        showFirstLastPage: true,
        class: 'red'
      },
      lectures: []
    }
  },

  created() {
    this.fetchLectures()
  },
  methods: {
    async fetchLectures() {
      const response = await this.$axios.get('/lectures')

      this.lectures = response.data.data.map(this.$representers.lecture)
    },
    editLecture(lecture) {
      this.$router.push(`/admin/lectures/${lecture.id}`)
    }
  }
}
</script>
<style lang="scss">
.lectures-table {
  td {
    cursor: pointer !important;
  }
}
</style>
