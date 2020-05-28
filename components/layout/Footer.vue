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
        alt="UFPEL"
      />
      <!-- <img
        src="@/assets/images/UFPEL-ESCUDO-2013.png"
        width="150"
        alt="UFPEL"
      /> -->
    </v-row>

    <!-- Legal Footer -->
    <div class="pb-2 secondary--text">
      2020

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
