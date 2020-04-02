<template>
  <v-row justify="center">
    <v-dialog v-model="syncedDisplaying" max-width="800px">
      <v-card>
        <template v-if="title != ''">
          <v-card-title>
            <span class="dialog-title">{{ title }}</span>
          </v-card-title>
        </template>
        <v-card-text>
          <slot name="content"></slot>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <slot name="action"></slot>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync } from 'vue-property-decorator'

@Component
export default class EditDoalog extends Vue {
  @PropSync('isDisplaying', { type: Boolean })
  readonly syncedDisplaying!: boolean

  @Prop({ type: String, default: '' }) readonly title!: string
}
</script>

<style scoped>
.dialog-title {
  font-size: 20px;
  font-weight: 500;
  margin: 0 0 24px;
}
</style>
