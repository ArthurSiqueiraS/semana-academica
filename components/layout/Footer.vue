<template>
  <v-footer class="flex-column primary">
    <v-row align="center" class="py-6">
      <!-- UFPEL -->
      <v-img
        :src="
          require($vuetify.theme.isDark
            ? '@/assets/images/SAM_logo_purple.png'
            : '@/assets/images/SAM_logo_white.png')
        "
        width="150"
      />
      <!-- <img
        src="@/assets/images/UFPEL-ESCUDO-2013.png"
        width="150"
        alt="UFPEL"
      /> -->
    </v-row>

    <!-- Legal Footer -->
    <div
      class="pb-2 secondary--text text-center d-flex flex-column flex-sm-row mx-4"
    >
      2020 <br v-if="mobile" /><span v-else class="mx-1"
        >- Desenvolvido por</span
      >
      Arthur Siqueira<br v-if="mobile" /><span v-else class="ml-1">|</span>
      <div class="d-flex justify-center">
        <v-tooltip
          v-for="item in developerLinks"
          :key="item.name"
          class="red--text"
          top
        >
          <template v-slot:activator="{ on }">
            <a
              class="d-flex align-center secondary--text ml-1"
              :href="item.link"
              target="_blank"
              v-on="on"
            >
              <v-icon size="20" color="secondary">
                {{ item.icon }}
              </v-icon>
            </a>
          </template>
          {{ item.name }}
        </v-tooltip>
      </div>

      <!-- <v-spacer /> -->
      <!-- <div>
          <a class="legal-links" href="/">
            Termos de Uso
          </a>
          <a class="legal-links" href="/">
            Política de Privacidade
          </a>
        </div> -->
    </div>
  </v-footer>
</template>
<script>
import { mdiGithub, mdiLinkedin } from '@mdi/js'

export default {
  data: () => ({
    developerLinks: [
      {
        name: 'Github',
        icon: mdiGithub,
        link: 'https://github.com/ArthurSiqueiraS'
      },
      {
        name: 'Linkedin',
        icon: mdiLinkedin,
        link: 'https://www.linkedin.com/in/arthur-siqueira-e-silva-8283bb18a/'
      }
    ]
  }),
  computed: {
    mobile() {
      return this.$vuetify.breakpoint.xsOnly
    }
  }
}
</script>
