<template>
  <div class="application-header">
    <v-app-bar color="primary" dark height="48px">
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>

      <v-toolbar-title>Firestore Local Emulator</v-toolbar-title>
    </v-app-bar>

    <slot></slot>

    <v-navigation-drawer v-model="drawer" absolute temporary>
      <!-- <v-list nav dense>
        <v-list-item-group>
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Account</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list> -->
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Header extends Vue {
  drawer = false
}
</script>

<style lang="scss">
.application-header {
  height: 100%;
}
</style>
