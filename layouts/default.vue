<template>
  <v-app>
    <v-content class="content">
      <gui-header>
        <v-container fluid class="base">
          <div class="navigater">
            <div class="sub-title">
              <v-icon>mdi-firebase</v-icon>
              <span class="sub-title-text">Firestore</span>
            </div>
          </div>
          <div class="nuxt-content">
            <nuxt />
          </div>
        </v-container>
      </gui-header>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
    GuiHeader: () => import('../components/organisms/header.vue'),
    GuiNavigationDrawer: () =>
      import('../components/organisms/navigationDrawer.vue')
  }
})
export default class Default extends Vue {}
</script>

<style lang="scss">
html,
body {
  height: 100%;
  overflow: hidden;

  #__nuxt,
  #__layout,
  #app {
    height: 100%;
  }
}
.content {
  height: 100%;

  .base {
    padding: 0;
    margin: 0;
    font-family: Roboto;
    width: 100%;
    height: calc(100% - 48px);
    font-size: 0px;

    .navigater {
      width: 255px;
      display: inline-block;
      font-size: 13px;
      vertical-align: top;

      .sub-title {
        color: black;
        font-size: 18px;
        height: 48px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);
        display: flex;
        align-items: center;
        padding-left: 10px;

        .sub-title-text {
          padding-left: 10px;
        }
      }
    }

    .nuxt-content {
      width: calc(100% - 255px);
      display: inline-block;
      font-size: 13px;
      vertical-align: top;
      height: 100%;
    }
  }
}
</style>
