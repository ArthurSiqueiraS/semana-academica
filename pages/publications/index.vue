<template>
  <div container class="text--center" style="height: 100%">
    <div v-if="$auth.loggedIn" class="py-10 d-flex justify-center">
      <v-col class="justify-center" cols="12" md="10" lg="9" xl="8">
        <!-- <v-row no-gutters justify="center">
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
        </v-row> -->
        <v-row no-gutters justify="center">
          <v-btn
            href="https://bbbadm-balancer.ufpel.edu.br/playback/presentation/2.0/playback.html?meetingId=756f146f8a2ae999c55f678ab6b306d945759731-1596130127546"
            target="_blank"
            color="accent"
            outlined
            text
            class="mb-4"
          >
            Link para apresentações orais
          </v-btn>
        </v-row>
        <v-row no-gutters>
          <div class="title primary--text mb-4">PÔSTERES</div>
          <v-list outlined class="py-0" width="100%">
            <div
              v-for="(publication, index) in publications"
              :key="publication.id"
            >
              <v-list-item :to="publication.link">
                <v-list-item-content>
                  <v-list-item-title class="primary--text">
                    {{ publication.title }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider v-if="index < publications.length - 1" />
            </div>
          </v-list>
        </v-row>
        <!-- <v-pagination
          v-model="page"
          :length="totalPages"
          total-visible="7"
          circle
          color="accent"
          class="my-2"
        ></v-pagination> -->
      </v-col>
    </div>
    <div
      v-else
      class="d-flex flex-column align-center justify-center"
      style="height: 100%"
    >
      <v-icon x-large color="primary" class="mb-4">lock</v-icon>
      <v-btn depressed rounded color="primary" to="/login"
        >Inicie sessão para acessar</v-btn
      >
    </div>
  </div>
</template>
<script>
export default {
  middleware({ app, redirect }) {
    if (app.$wip) redirect('/')
  },
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
      return null
      //   if (this.$vuetify.breakpoint.lg) {
      //     return 9
      //   }
      //   if (this.$vuetify.breakpoint.xl) {
      //     return 12
      //   }

      //   return 6
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
<style lang="scss" scoped>
img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  object-position: 0% 0%;
}
</style>
