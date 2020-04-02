<template>
  <col-doc :document-id="documentId" @on-click-document="onClickDocument">
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
export default class Document extends Vue {
  @Prop({ type: String, default: '' }) readonly documentId!: string

  get items(): Item[] {
    return [
      {
        icon: '',
        text: 'Add similar document',
        onClick: this.onClickAddSimilarDocument
      },
      {
        icon: '',
        text: 'Delete document',
        onClick: this.onClickDeleteDocument
      },
      {
        icon: '',
        text: 'Delete all fields in document',
        onClick: this.onClickDeleteDocumentField
      }
    ]
  }

  @Emit()
  onClickAddSimilarDocument() {
    return this.documentId
  }

  @Emit()
  onClickDeleteDocument() {
    return this.documentId
  }

  @Emit()
  onClickDeleteDocumentField() {
    return this.documentId
  }

  @Emit()
  onClickDocument() {
    return this.documentId
  }
}
</script>
