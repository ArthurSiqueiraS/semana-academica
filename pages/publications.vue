<template>
  <div container class="text--center">
    <div class="py-10">
      <v-row no-gutters justify="center">
        <v-col id="patient-list" cols="10" xl="6" lg="8">
          <v-text-field
            v-model="filters.search"
            prepend-inner-icon="search"
            clearable
            outlined
            rounded
            dense
            single-line
            hide-details
            label="Buscar por título ou autor"
          />
        </v-col>
      </v-row>
      <v-row no-gutters class="pa-4">
        <v-hover
          v-for="publication in publications"
          v-slot:default="{ hover }"
          :key="publication.id"
        >
          <v-col cols="12" sm="6" md="4" lg="3" xl="2" class="pa-4 publication">
            <v-card class="primary" flat shaped :elevation="hover ? 16 : 0">
              <v-img :src="publication.thumbnail" height="200px" />
              <v-card-title class="secondary--text">
                {{ publication.title }}
              </v-card-title>
              <v-card-subtitle>{{ publication.author }}</v-card-subtitle>
            </v-card>
          </v-col>
        </v-hover>
      </v-row>
      <v-pagination
        v-model="pagination.page"
        :length="totalPages"
        total-visible="7"
        circle
        color="accent"
        class="my-2"
      ></v-pagination>
    </div>
  </div>
</template>
<script>
export default {
  auth: false,
  data() {
    let perPage = 6
    if (this.$vuetify.breakpoint.md) {
      perPage = 9
    }
    if (this.$vuetify.breakpoint.lg) {
      perPage = 12
    }
    if (this.$vuetify.breakpoint.xl) {
      perPage = 18
    }
    return {
      publications: [],
      filters: {
        search: ''
      },
      pagination: {
        page: 1,
        perPage
      },
      totalPages: 0
    }
  },
  watch: {
    pagination: {
      immediate: true,
      deep: true,
      handler() {
        this.getPublications()
      }
    },
    filters: {
      immediate: true,
      deep: true,
      handler() {
        if (this.pagination.page === 1) {
          this.getPublications()
        } else {
          this.pagination.page = 1
        }
      }
    }
  },
  methods: {
    getPublications() {
      this.$axios
        .get('/publications', {
          params: {
            page: this.pagination.page,
            perPage: this.pagination.perPage,
            search: this.filters.search
          }
        })
        .then((response) => {
          this.publications = response.data.data.map(
            this.$representers.publication
          )
          this.totalPages = response.data.lastPage
        })
    }
  }
}
</script>
