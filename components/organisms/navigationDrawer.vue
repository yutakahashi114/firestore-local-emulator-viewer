<template>
  <div>
    <v-navigation-drawer permanent left>
      <template v-slot:prepend>
        <v-list-item two-line>
          <!-- <v-list-item-avatar>
            <img src="https://randomuser.me/api/portraits/women/81.jpg" />
          </v-list-item-avatar> -->

          <v-list-item-content>
            <v-list-item-title>Firestore</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item v-for="item in items" :key="item.title">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class navigationDrawer extends Vue {
  items: { title: string; icon: string }[] = [
    { title: 'Data', icon: 'mdi-magnify' }
  ]
}
</script>
