<template>
  <div>
    <flat-button
      text="ADD DOCUMENT"
      icon="mdi-plus"
      class="document-list-top-button"
      @click="onClickAdd"
    />
    <div class="document-list-main">
      <div class="document-list-padding">
        <div
          class="document-list-buffer"
          :style="documentListBufferStyle"
        ></div>
        <div class="document-list-item-list">
          <template v-for="(document, id) in documents">
            <document
              :key="id"
              :document-id="id"
              :class="selectedList[id] ? 'document-list-item-selected' : ''"
              @on-click-document="onClickDocument"
              @on-click-add-similar-document="onClickAddSimilarDocument"
              @on-click-delete-document="onClickDelete"
              @on-click-delete-document-field="onClickDeleteField"
            />
          </template>
        </div>
      </div>
    </div>

    <edit-dialog :is-displaying.sync="isDisplayingAdd" title="Add a document">
      <template v-slot:content>
        <v-row no-gutters dense>
          <v-col cols="6">
            <text-field
              :value.sync="documentId"
              label="Document ID"
              placeholder="Document ID"
            />
          </v-col>
        </v-row>
        <map-field :value.sync="targetFields" :nullable="false" />
      </template>
      <template v-slot:action>
        <v-btn color="blue darken-1" text @click="isDisplayingAdd = false"
          >CANCEL</v-btn
        >
        <v-btn color="blue darken-1" text @click="addDocument">SAVE</v-btn>
      </template>
    </edit-dialog>

    <edit-dialog
      :is-displaying.sync="isDisplayingDelete"
      title="Delete document?"
    >
      <template v-slot:content>
        <div class="document-list-dialog-text">Document path</div>
        <div>{{ deletePath }}</div>
      </template>
      <template v-slot:action>
        <v-btn color="blue darken-1" text @click="isDisplayingDelete = false"
          >CANCEL</v-btn
        >
        <v-btn color="blue darken-1" text @click="deleteDocument">DELETE</v-btn>
      </template>
    </edit-dialog>

    <edit-dialog
      :is-displaying.sync="isDisplayingDeleteField"
      title="Delete all fields in this document?"
    >
      <template v-slot:content>
        <div class="document-list-dialog-text">Document path</div>
        <div>{{ deletePath }}</div>
      </template>
      <template v-slot:action>
        <v-btn
          color="blue darken-1"
          text
          @click="isDisplayingDeleteField = false"
          >CANCEL</v-btn
        >
        <v-btn color="blue darken-1" text @click="deleteDocumentField"
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

export interface Document {
  data: FieldValue[]
  collections: string[]
}

export interface Documents {
  [key: string]: Document
}

@Component({
  components: {
    Document: () => import('./document.vue'),
    EditDialog: () => import('../molecules/editDialog.vue'),
    TextField: () => import('../molecules/textField.vue'),
    FlatButton: () => import('../molecules/flatButton.vue'),
    MapField: () => import('./field/map.vue')
  }
})
export default class DocumentList extends Vue {
  @Prop({ type: Object, default: () => {} }) readonly documents!: Documents
  @Prop({ type: Number, default: 0 }) readonly depth!: number
  @Prop({ type: Array, default: () => [] }) readonly paths!: string[]

  get initTargetField(): FieldValue {
    return { name: '', type: 4, value: '' }
  }

  get currentPaths(): string[] {
    return this.paths.slice(0, this.depth * 2 + 1)
  }

  get deletePath(): string {
    let path = 'root'
    for (const p of this.currentPaths) {
      path += ` / ${p}`
    }
    path += ` / ${this.deleteDocumentId}`
    return path
  }

  get selectedList(): object {
    const selectedList: { [key: string]: boolean } = {}
    const currentId = this.paths[this.depth * 2 + 1]
    for (const id in this.documents) {
      selectedList[id] = false
      if (id === currentId) {
        selectedList[id] = true
      }
    }
    return selectedList
  }

  get documentListBufferStyle(): { height: string } {
    if (!this.documents) {
      return { height: '0px' }
    }
    return { height: Number(this.documents.length) * 48 + 'px' }
  }

  isDisplayingAdd = false
  isDisplayingDelete = false
  isDisplayingDeleteField = false
  targetFields: FieldValue[] = [{ ...this.initTargetField }]
  documentId = ''
  deleteDocumentId = ''

  @Watch('isDisplayingAdd')
  updateIsDisplayingAdd(value: boolean) {
    if (!value) {
      this.targetFields = [{ ...this.initTargetField }]
      this.documentId = ''
    }
  }

  @Emit()
  onClickDocument(id: string) {
    return { id, depth: this.depth }
  }

  onClickAdd() {
    this.isDisplayingAdd = true
  }

  onClickAddSimilarDocument(id: string) {
    this.targetFields = JSON.parse(JSON.stringify(this.documents[id].data))
    this.isDisplayingAdd = true
  }

  onClickDelete(id: string) {
    this.deleteDocumentId = id
    this.isDisplayingDelete = true
  }

  onClickDeleteField(id: string) {
    this.deleteDocumentId = id
    this.isDisplayingDeleteField = true
  }

  async addDocument() {
    const paths = this.paths.slice(0, this.depth * 2 + 1)
    try {
      await axios.put('/api/document', {
        paths,
        documentId: this.documentId,
        data: this.targetFields
      })
      this.isDisplayingAdd = false
      this.onUpdateDocuments()
    } catch (err) {
      console.log(err)
      alert('internal server error')
    }
  }

  async deleteDocument() {
    const paths = [
      ...this.paths.slice(0, this.depth * 2 + 1),
      this.deleteDocumentId
    ]
    try {
      await axios.delete('/api/document', {
        data: {
          paths
        }
      })
      this.isDisplayingDelete = false
      this.onUpdateDocuments()
    } catch (err) {
      console.log(err)
      alert('internal server error')
    }
  }

  async deleteDocumentField() {
    const paths = [
      ...this.paths.slice(0, this.depth * 2 + 1),
      this.deleteDocumentId
    ]
    try {
      await axios.delete('/api/field/all', {
        data: {
          paths
        }
      })
      this.isDisplayingDeleteField = false
      this.onUpdateDocuments()
    } catch (err) {
      console.log(err)
      alert('internal server error')
    }
  }

  @Emit()
  onUpdateDocuments() {
    return { paths: this.paths.slice(0, this.depth * 2 + 1), depth: this.depth }
  }
}
</script>

<style lang="scss">
.document-list-top-button {
  min-height: 40px;
}

.document-list-main {
  height: calc(100% - 40px);
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 8px 0;

  .document-list-padding {
    position: relative;
    height: 100%;

    .document-list-buffer {
      position: relative;
    }
    .document-list-item-list {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
}
.document-list-dialog-text {
  color: black;
  font-size: 18px;
  margin: 12px 0 0;
}
</style>
