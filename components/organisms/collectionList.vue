<template>
  <div>
    <flat-button
      text="START COLLECTION"
      icon="mdi-plus"
      class="collection-list-top-button"
      @click="onClickAdd"
    />
    <div class="collection-list-main">
      <div class="collection-list-padding">
        <div
          class="collection-list-buffer"
          :style="collectionListBufferStyle"
        ></div>
        <div class="collection-list-item-list">
          <template v-for="(id, index) in collectionIds">
            <collection
              :key="id"
              :collection-id="id"
              :class="selectedList[index] ? 'document-list-item-selected' : ''"
              @on-click-collection="onClickCollection"
              @on-click-delete-collection="onClickDelete"
            />
          </template>
        </div>
      </div>
    </div>

    <edit-dialog :is-displaying.sync="isDisplaying" title="Start a collection">
      <template v-slot:content>
        <div class="collection-list-dialog-text">Give the collection an ID</div>
        <v-row no-gutters dense>
          <v-col cols="6">
            <text-field :value.sync="collectionId" label="Collection ID" />
          </v-col>
        </v-row>
        <div class="collection-list-dialog-text">Add its first document</div>
        <v-row no-gutters dense>
          <v-col cols="6">
            <text-field :value.sync="documentId" label="Document ID" />
          </v-col>
        </v-row>
        <map-field :value.sync="targetFields" :nullable="false" />
      </template>
      <template v-slot:action>
        <v-btn color="blue darken-1" text @click="isDisplaying = false"
          >CANCEL</v-btn
        >
        <v-btn color="blue darken-1" text @click="addCollection">SAVE</v-btn>
      </template>
    </edit-dialog>

    <edit-dialog
      :is-displaying.sync="isDisplayingDelete"
      title="Delete this collection?"
    >
      <template v-slot:content>
        <div class="collection-list-dialog-delete-text">Document path</div>
        <div>{{ deletePath }}</div>
      </template>
      <template v-slot:action>
        <v-btn color="blue darken-1" text @click="isDisplayingDelete = false"
          >CANCEL</v-btn
        >
        <v-btn color="blue darken-1" text @click="deleteCollection"
          >DELETE</v-btn
        >
      </template>
    </edit-dialog>
  </div>
</template>

<script lang="ts">
import axios from 'axios'
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator'
import { FieldValue } from '../molecules/field.vue'
import { Documents } from './documentList.vue'

export interface Collections {
  [key: string]: Documents
}

@Component({
  components: {
    Collection: () => import('./collection.vue'),
    EditDialog: () => import('../molecules/editDialog.vue'),
    TextField: () => import('../molecules/textField.vue'),
    FlatButton: () => import('../molecules/flatButton.vue'),
    MapField: () => import('./field/map.vue')
  }
})
export default class CollectionList extends Vue {
  @Prop({ type: Array, default: () => [] }) readonly collectionIds!: string[]
  @Prop({ type: Number, default: 0 }) readonly depth!: number
  @Prop({ type: Array, default: () => [] }) readonly paths!: string[]

  get initTargetField(): FieldValue {
    return { name: '', type: 4, value: '' }
  }

  get currentPaths(): string[] {
    return this.paths.slice(0, this.depth * 2)
  }

  get deletePath(): string {
    let path = 'root'
    for (const p of this.currentPaths) {
      path += ` / ${p}`
    }
    path += ` / ${this.deleteCollectionId}`
    return path
  }

  get selectedList(): boolean[] {
    const selectedList: boolean[] = []
    const currentId = this.paths[this.depth * 2]
    this.collectionIds.forEach((id, i) => {
      selectedList[i] = false
      if (id === currentId) {
        selectedList[i] = true
      }
    })
    return selectedList
  }

  get collectionListBufferStyle(): { height: string } {
    if (!this.collectionIds) {
      return { height: '0px' }
    }
    return { height: this.collectionIds.length * 48 + 'px' }
  }

  isDisplaying = false
  isDisplayingDelete = false
  targetFields: FieldValue[] = [{ ...this.initTargetField }]
  documentId = ''
  collectionId = ''
  deleteCollectionId = ''

  @Watch('isDisplaying')
  updateIsDisplaying(value: boolean) {
    if (!value) {
      this.targetFields = [{ ...this.initTargetField }]
      this.documentId = ''
      this.collectionId = ''
    }
  }

  @Emit()
  onClickCollection(id: string) {
    return { id, depth: this.depth }
  }

  onClickAdd() {
    this.isDisplaying = true
  }

  onClickDelete(id: string) {
    this.deleteCollectionId = id
    this.isDisplayingDelete = true
  }

  async addCollection() {
    let paths: string[] = []
    if (this.depth > 0) {
      paths = this.paths.slice(0, this.depth * 2)
    }
    paths.push(this.collectionId)
    try {
      await axios.put('/api/document', {
        paths,
        documentId: this.documentId,
        data: this.targetFields
      })
      this.isDisplaying = false
      this.onUpdateCollections()
    } catch (err) {
      console.log(err)
      alert('internal server error')
    }
  }

  async deleteCollection() {
    const paths = [
      ...this.paths.slice(0, this.depth * 2),
      this.deleteCollectionId
    ]
    try {
      await axios.delete('/api/collection', {
        data: {
          paths
        }
      })
      this.isDisplayingDelete = false
      this.onUpdateCollections()
    } catch (err) {
      console.log(err)
      alert('internal server error')
    }
  }

  @Emit()
  onUpdateCollections() {
    return { paths: this.paths.slice(0, this.depth * 2), depth: this.depth }
  }
}
</script>

<style lang="scss">
.collection-list-top-button {
  min-height: 40px;
}

.collection-list-main {
  height: calc(100% - 40px);
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 8px 0;

  .collection-list-padding {
    position: relative;
    height: 100%;

    .collection-list-buffer {
      position: relative;
    }

    .collection-list-item-list {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
}
.collection-list-dialog-text {
  color: black;
  font-size: 18px;
  margin: 0 0 24px;
}
.collection-list-dialog-delete-text {
  color: black;
  font-size: 18px;
  margin: 12px 0 0;
}
</style>
