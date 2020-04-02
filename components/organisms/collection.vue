<template>
  <col-doc :document-id="collectionId" @on-click-document="onClickCollection">
    <template v-slot:edit-icon>
      <fs-list-button :items="items"> </fs-list-button>
    </template>
  </col-doc>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import FsListButton, { Item } from '../molecules/fsListButton.vue'

@Component({
  components: {
    ColDoc: () => import('./colDoc.vue'),
    FsListButton
  }
})
export default class Collection extends Vue {
  @Prop({ type: String, default: '' }) readonly collectionId!: string

  get items(): Item[] {
    return [
      {
        icon: '',
        text: 'Delete collection',
        onClick: this.onClickDeleteCollection
      }
    ]
  }

  @Emit()
  onClickDeleteCollection() {
    return this.collectionId
  }

  @Emit()
  onClickCollection() {
    return this.collectionId
  }
}
</script>
