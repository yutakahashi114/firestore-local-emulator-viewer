<template>
  <v-text-field
    v-model="syncedValue"
    :label="label"
    :type="type"
    :readonly="readonly"
    :placeholder="placeholder"
    :menu-props="{ top: true, offsetY: true }"
    @change="change"
    outlined
    dense
  />
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync, Emit } from 'vue-property-decorator'

@Component
export default class TextField extends Vue {
  @Prop({ type: String, default: '' }) readonly type!: string
  @Prop({ type: String, default: '' }) readonly label!: string
  @Prop({ type: String, default: '' }) readonly placeholder!: string
  @Prop({ type: Boolean, default: false }) readonly readonly!: boolean
  @PropSync('value', { type: String }) syncedValue!: string

  @Emit()
  change() {}
}
</script>
