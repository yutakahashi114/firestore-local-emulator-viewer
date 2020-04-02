<template>
  <v-select
    v-model="syncedValue"
    :items="items"
    :menu-props="{ top: true, offsetY: true }"
    :label="label"
    outlined
    dense
    @change="change"
  ></v-select>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync, Emit } from 'vue-property-decorator'

type SelectItem = { text: string; value: number | string }
@Component
export default class FsSelect extends Vue {
  @Prop({ type: Array }) readonly items!: SelectItem[]
  @Prop({ type: String }) readonly label!: string
  @PropSync('value', { type: [String, Number] }) syncedValue!: number | string

  @Emit()
  change(value: number | string): number | string {
    return value
  }
}
</script>
