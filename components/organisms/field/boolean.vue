<template>
  <fs-select :items="selectItems" :value.sync="boolValue" :label="label" />
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync, Watch } from 'vue-property-decorator'

@Component({
  components: {
    FsSelect: () => import('../../molecules/fsSelect.vue')
  }
})
export default class BooleanField extends Vue {
  @Prop({ type: String, default: '' }) readonly label!: string
  @PropSync('value', { type: Boolean }) syncedValue!: boolean

  boolValue = 0

  mounted() {
    this.boolValue = this.syncedValue ? 1 : 0
  }

  get selectItems() {
    return [
      { value: 1, text: 'true' },
      { value: 0, text: 'false' }
    ]
  }

  @Watch('boolValue')
  onUpdate() {
    this.syncedValue = this.boolValue === this.selectItems[0].value
  }
}
</script>
