<template>
  <v-list-item class="collection-list-item" @click="onClickCollection">
    <span>
      <fs-list-button :items="items"> </fs-list-button>
    </span>
    <v-list-item-title>
      <span class="collection-text">{{ collectionId }}</span>
    </v-list-item-title>
    <span>
      <v-list-item-icon>
        <v-icon>mdi-chevron-right</v-icon>
      </v-list-item-icon>
    </span>
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
    console.log(this.collectionId)
    return this.collectionId
  }

  @Emit()
  onClickCollection() {
    console.log(this.collectionId)
    return this.collectionId
  }
}
</script>

<style lang="scss">
.collection-list-item {
  color: black;
  font-size: 13px;
  height: 48px;
}

.collection-icon {
  width: 34px;
  text-align: center;
  margin-right: 10px;
  border-radius: 4px;
  transition: background-color 0.5s;
}

.collection-icon:hover {
  background-color: rgba(0, 0, 0, 0.12);
}

.collection-text {
  display: flex;
  align-items: center;
  font-size: 13px;
}
</style>
