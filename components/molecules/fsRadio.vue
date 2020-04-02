<template>
  <v-radio-group v-model="syncedValue" @change="change" :disabled="disabled">
    <template v-for="item in items">
      <v-radio :key="item.value" :label="item.text" :value="item.value" />
    </template>
  </v-radio-group>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync, Emit } from 'vue-property-decorator'

type SelectItem = { text: string; value: number | string }
@Component
export default class FsSelect extends Vue {
  @Prop({ type: Array, default: () => [] }) readonly items!: SelectItem[]
  @Prop({ type: Boolean, default: false }) readonly disabled!: boolean
  @PropSync('value', { type: [String, Number] }) syncedValue!: number | string

  @Emit()
  change(value: number | string): number | string {
    return value
  }
}
</script>

<style lang="scss">
.fs-radio-item {
  font-size: 13px;
  color: rgb(0, 0, 0);
}
</style>
