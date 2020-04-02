<template>
  <div>
    <flat-button
      text="ADD FIELD"
      icon="mdi-plus"
      class="field-list-top-button"
      @click="onClickAdd"
    />
    <div class="field-list-main">
      <div class="field-list-padding">
        <div class="field-list-buffer" :style="fieldListBufferStyle"></div>
        <div class="field-list-item-list">
          <template v-for="typeValue in fields">
            <field
              :key="typeValue.name"
              :field-value="typeValue"
              @on-click-field="onClickField"
              @on-click-delete="onClickDelete"
            />
          </template>
        </div>
      </div>
    </div>
    <edit-dialog :is-displaying.sync="isDisplayingAdd" title="Add a field">
      <template v-slot:content>
        <field-form :target-field.sync="targetField" />
      </template>
      <template v-slot:action>
        <v-btn color="blue darken-1" text @click="isDisplayingAdd = false"
          >CANCEL</v-btn
        >
        <v-btn color="blue darken-1" text @click="addField">SAVE FIELD</v-btn>
      </template>
    </edit-dialog>

    <edit-dialog :is-displaying.sync="isDisplayingUpdate" title="Edit field">
      <template v-slot:content>
        <field-form :target-field.sync="targetField" :edit="true" />
      </template>
      <template v-slot:action>
        <v-btn color="blue darken-1" text @click="isDisplayingUpdate = false"
          >CANCEL</v-btn
        >
        <v-btn color="blue darken-1" text @click="updateDocument">UPDATE</v-btn>
      </template>
    </edit-dialog>

    <edit-dialog :is-displaying.sync="isDisplayingDelete" title="Delete field?">
      <template v-slot:content>
        <div class="field-list-dialog-text">Document path</div>
        <div>{{ currentPathString }}</div>
        <div class="field-list-dialog-text">Field name</div>
        <div>{{ deleteFieldName }}</div>
      </template>
      <template v-slot:action>
        <v-btn color="blue darken-1" text @click="isDisplayingDelete = false"
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
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator'
import Field, { FieldValue } from '../molecules/field.vue'

type DocumentData = FieldValue[]

@Component({
  components: {
    TextField: () => import('../molecules/textField.vue'),
    EditDialog: () => import('../molecules/editDialog.vue'),
    FieldForm: () => import('./fieldForm.vue'),
    FlatButton: () => import('../molecules/flatButton.vue'),
    Field
  }
})
export default class FieldList extends Vue {
  @Prop({
    type: Array,
    default: () => {
      return []
    }
  })
  readonly fields!: DocumentData

  @Prop({ type: Number, default: 0 }) readonly depth!: number
  @Prop({ type: Array, default: [] }) readonly paths!: string[]

  get initTargetField(): FieldValue {
    return { name: '', type: 4, value: '' }
  }

  get currentPaths(): string[] {
    let paths: string[] = []
    if (this.depth > 0) {
      paths = this.paths.slice(0, this.depth * 2)
    }
    return paths
  }

  get fieldListBufferStyle(): { height: string } {
    if (!this.fields) {
      return { height: '0px' }
    }
    return { height: this.fields.length * 40 + 'px' }
  }

  targetField: FieldValue = { ...this.initTargetField }
  isDisplayingAdd = false
  isDisplayingUpdate = false
  deleteFieldName = ''
  isDisplayingDelete = false

  @Watch('isDisplayingAdd')
  updateIsDisplayingAdd(value: boolean) {
    if (!value) {
      this.targetField = { ...this.initTargetField }
    }
  }

  @Watch('isDisplayingUpdate')
  updateIsDisplayingUpdate(value: boolean) {
    if (!value) {
      this.targetField = { ...this.initTargetField }
    }
  }

  get currentPathString(): string {
    let path = 'root'
    for (const p of this.currentPaths) {
      path += ` / ${p}`
    }
    return path
  }

  onClickAdd() {
    this.isDisplayingAdd = true
  }

  async addField() {
    try {
      await axios.post('/api/document', {
        paths: this.currentPaths,
        data: this.targetField
      })
      this.isDisplayingAdd = false
      this.onUpdateFields()
    } catch (err) {
      console.log(err)
      alert('internal server error')
    }
  }

  onClickField(fieldValue: FieldValue) {
    this.targetField.name = fieldValue.name
    this.targetField.type = fieldValue.type
    this.targetField.value = JSON.parse(JSON.stringify(fieldValue.value))
    this.isDisplayingUpdate = true
  }

  async updateDocument() {
    try {
      await axios.post('/api/document', {
        paths: this.currentPaths,
        data: this.targetField
      })
      this.isDisplayingUpdate = false
      this.onUpdateFields()
    } catch (err) {
      console.log(err)
      alert('internal server error')
    }
  }

  onClickDelete(name: string) {
    this.deleteFieldName = name
    this.isDisplayingDelete = true
  }

  async deleteDocumentField() {
    try {
      await axios.delete('/api/field', {
        data: { paths: this.currentPaths, name: this.deleteFieldName }
      })
      this.isDisplayingDelete = false
      this.deleteFieldName = ''
      this.onUpdateFields()
    } catch (err) {
      console.log(err)
      alert('internal server error')
    }
  }

  @Emit()
  onUpdateFields() {
    return { paths: this.paths.slice(0, this.depth * 2), depth: this.depth }
  }
}
</script>

<style lang="scss">
.field-list-top-button {
  min-height: 40px;
}

.field-list-main {
  height: calc(100% - 40px);
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 8px 0;

  .field-list-padding {
    position: relative;
    height: 100%;

    .field-list-buffer {
      position: relative;
    }

    .field-list-item-list {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
}
.field-list-dialog-text {
  color: black;
  font-size: 18px;
  margin: 12px 0 0;
}
</style>
