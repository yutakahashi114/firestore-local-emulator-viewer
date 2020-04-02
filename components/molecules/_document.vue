<template>
  <v-list-item class="document-list-item" @click="onClickDocument">
    <div class="document-list-item-detail-icon-area">
      <div class="document-list-item-hover">
        <fs-list-button :items="items"> </fs-list-button>
      </div>
    </div>
    <v-list-item-title>
      <span class="document-text">{{ documentId }}</span>
    </v-list-item-title>
    <div class="document-list-item-arrow-icon-area">
      <v-list-item-icon class="document-list-item-hover">
        <v-icon>mdi-chevron-right</v-icon>
      </v-list-item-icon>
    </div>
  </v-list-item>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'
import FsListButton, { Item } from './fsListButton.vue'

@Component({
  components: {
    FsListButton
  }
})
export default class Document extends Vue {
  @Prop({ type: String, default: '' }) readonly documentId!: string

  get items(): Item[] {
    return [
      { icon: '', text: 'Add similar document', onClick: () => {} },
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
  onClickDeleteDocument() {
    console.log(this.documentId)
    return this.documentId
  }

  @Emit()
  onClickDeleteDocumentField() {
    console.log(this.documentId)
    return this.documentId
  }

  @Emit()
  onClickDocument() {
    console.log(this.documentId)
    return this.documentId
  }
}
</script>

<style lang="scss">
.document-list-item {
  color: black;
  font-size: 13px;
  height: 48px;

  .document-list-item-hover {
    opacity: 0;
    will-change: opacity;
  }

  .document-list-item-detail-icon-area {
    padding-right: 10px;
    width: 44px;
  }

  .document-list-item-arrow-icon-area {
    padding: 0 10px;
    width: 44px;
  }

  .document-text {
    display: flex;
    align-items: center;
    font-size: 13px;
  }
}

.document-list-item:hover {
  .document-list-item-hover {
    opacity: 1;
  }
}
</style>
