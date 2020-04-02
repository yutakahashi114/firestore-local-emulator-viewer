<template>
  <v-text-field
    v-model="syncedValue"
    :label="label"
    :type="type"
    :readonly="readonly"
    :menu-props="{ top: true, offsetY: true }"
    outlined
    dense
  />
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync } from 'vue-property-decorator'

@Component
export default class TextField extends Vue {
  @Prop({ type: String, default: '' }) readonly type!: string
  @Prop({ type: String, default: '' }) readonly label!: string
  @Prop({ type: String, default: '' }) readonly placeholder!: string
  @Prop({ type: Boolean, default: false }) readonly readonly!: boolean
  @PropSync('value', { type: String }) syncedValue!: string
}
</script>
