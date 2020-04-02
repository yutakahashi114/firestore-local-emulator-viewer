<template>
  <text-field :value.sync="syncedValue" :label="label" />
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync } from 'vue-property-decorator'

@Component({
  components: {
    TextField: () => import('../../molecules/textField.vue')
  }
})
export default class SrtingField extends Vue {
  @Prop({ type: String, default: '' }) readonly label!: string
  @PropSync('value', { type: String }) syncedValue!: string
}
</script>
