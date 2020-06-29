<template>
  <div container class="text--center">
    <div class="py-10 d-flex justify-center">
      <v-col class="justify-center" cols="12" md="10" lg="9" xl="8">
        <v-row no-gutters justify="center">
          <v-col id="patient-list" cols="10" lg="8" xl="6">
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
            <v-col cols="12" sm="6" lg="4" xl="3" class="pa-4 publication">
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
          v-model="page"
          :length="totalPages"
          total-visible="7"
          circle
          color="accent"
          class="my-2"
        ></v-pagination>
      </v-col>
    </div>
  </div>
</template>
<script>
export default {
  auth: false,
  data() {
    return {
      publications: [],
      filters: {
        search: ''
      },
      page: 1,
      totalPages: 0
    }
  },
  computed: {
    perPage() {
      if (this.$vuetify.breakpoint.lg) {
        return 9
      }
      if (this.$vuetify.breakpoint.xl) {
        return 12
      }

      return 6
    }
  },
  watch: {
    page() {
      this.getPublications()
    },
    perPage() {
      this.getPublications()
    },
    filters: {
      immediate: true,
      deep: true,
      handler() {
        if (this.page === 1) {
          this.getPublications()
        } else {
          this.page = 1
        }
      }
    }
  },
  methods: {
    getPublications() {
      this.$axios
        .get('/publications', {
          params: {
            page: this.page,
            perPage: this.perPage,
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
