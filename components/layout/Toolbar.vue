<template>
  <div>
    <v-toolbar>
      <!-- removes logo in small screens -->
      <v-toolbar-title> </v-toolbar-title>
      <!-- removes spaces in small screens -->
      <v-spacer></v-spacer>
      <div class="d-flex align-center justify-end">
        <v-menu bottom left>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on">
              <v-icon>home</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item to="/teleorientation">
              <v-list-item-title>Teleorientação</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </v-toolbar>
  </div>
</template>

<script>
export default {}
</script>
