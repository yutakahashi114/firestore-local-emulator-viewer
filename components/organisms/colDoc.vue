<template>
  <div class="document-list-item" @click="onClickDocument">
    <div class="document-list-item-detail-icon-area">
      <div class="document-list-item-hover">
        <slot name="edit-icon"></slot>
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
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'

@Component
export default class ColDoc extends Vue {
  @Prop({ type: String, default: '' }) readonly documentId!: string

  @Emit()
  onClickDocument() {}
}
</script>

<style lang="scss">
.document-list-item {
  color: black;
  font-size: 13px;
  height: 48px;

  align-items: center;
  display: flex;
  flex: 1 1 100%;
  letter-spacing: normal;
  min-height: 48px;
  outline: none;
  padding: 0 16px;
  position: relative;
  text-decoration: none;
  cursor: pointer;

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
  background-color: rgba(0, 0, 0, 0.06);
  .document-list-item-hover {
    opacity: 1;
  }
}

.document-list-item-selected {
  background-color: rgba(161, 194, 250, 0.16);
  .document-list-item-hover {
    opacity: 1;
  }
}
</style>
