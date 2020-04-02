<template>
  <text-field :value.sync="text" :label="label" />
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync, Watch } from 'vue-property-decorator'

@Component({
  components: {
    TextField: () => import('../../molecules/textField.vue')
  }
})
export default class NumberField extends Vue {
  @Prop({ type: String, default: '' }) readonly label!: string
  @PropSync('value', { type: Number }) syncedValue!: number

  text = ''

  mounted() {
    this.text = String(this.syncedValue)
  }

  @Watch('text')
  onUpdate() {
    this.syncedValue = Number(this.text)
  }
}
</script>
