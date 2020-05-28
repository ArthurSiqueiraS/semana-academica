<template>
  <v-dialog width="500" max-width="100%">
    <template v-slot:activator="{ on }">
      <div style="height: 100%" v-on="on">
        <slot name="activator">
          <v-btn text class="accent" color="secondary">
            <v-icon size="20" class="mr-1">person</v-icon>RAIN
          </v-btn>
        </slot>
      </div>
    </template>
    <v-card shaped class="pa-4">
      <slot name="content" />
    </v-card>
  </v-dialog>
</template>
