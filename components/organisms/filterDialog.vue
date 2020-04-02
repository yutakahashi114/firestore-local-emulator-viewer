<template>
  <edit-dialog
    :is-displaying.sync="syncedDisplaying"
    :title="`Filter for documents in '${id}'`"
  >
    <template v-slot:content>
      <div class="filter-dialog-sub-title">Add filters</div>

      <div class="filter-dialog-sub-sub-title">Choose a field to filter by</div>
      <v-row no-gutters dense>
        <v-col cols="8">
          <text-field
            :value.sync="filterFieldName"
            placeholder="Enter or select a field"
          />
        </v-col>
      </v-row>

      <div class="filter-dialog-sub-sub-title">Add a condition (optional)</div>
      <div>Only show documents where the specified field is...</div>
      <v-row no-gutters dense>
        <v-col cols="8">
          <fs-select :items="conditionItems" :value.sync="filterCondition" />
        </v-col>
      </v-row>

      <template v-for="(filterField, index) in filterFieldList">
        <v-row :key="index" dense>
          <v-col cols="5">
            <fs-select :items="fieldTypes" :value.sync="filterField.type" />
          </v-col>
          <v-col cols="5">
            <text-field
              :value.sync="filterField.value"
              placeholder="Enter value"
            />
          </v-col>
          <template v-if="filterFieldList.length > 1">
            <v-col cols="1" class="filter-dialog-delete-button">
              <div class="filter-dialog-delete-button-inner">
                <v-icon @click="onClickDelete(index)">mdi-delete</v-icon>
              </div>
            </v-col>
          </template>
        </v-row>
      </template>
      <template v-if="isArrayCondition">
        <v-row no-gutters dense>
          <v-btn
            small
            class="filter-dialog-add-button"
            color="primary"
            text
            @click="onClickAdd"
          >
            <v-icon left>mdi-plus</v-icon>Add
          </v-btn>
        </v-row>
      </template>

      <div class="filter-dialog-sub-title">Sort results</div>
      <fs-radio
        :value.sync="filterOrder"
        :items="orderTypeItems"
        :disabled="!isSortableCondition"
      />

      <div class="filter-dialog-sub-title">Preview query code</div>
      <v-textarea
        style='font-family: Menlo, Monaco, "Courier New", monospace;font-size:12px;'
        :value="previewQuery"
        filled
        outlined
        readonly
        auto-grow
        height="105px"
        :hide-details="true"
        :rounded="false"
      ></v-textarea>
    </template>
    <template v-slot:action>
      <v-btn color="blue" text @click="filterDocument">Apply</v-btn>
      <v-btn color="blue" text @click="clearFilter">CLEAR FILTER</v-btn>
      <v-btn color="blue" text @click="isFiltering = false">CANCEL</v-btn>
    </template>
  </edit-dialog>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  PropSync,
  Watch,
  Emit
} from 'vue-property-decorator'

export type FilterCondition = {
  collectionPath: string
  fieldName: string
  fieldList: { type: number; value: string }[]
  condition: string
  order: string
}

const initialFilterField = { type: 4, value: '' }

export const initialFilterCondition: FilterCondition = {
  collectionPath: '',
  fieldName: '',
  fieldList: [{ ...initialFilterField }],
  condition: '',
  order: 'asc'
}

@Component({
  components: {
    EditDialog: () => import('../molecules/editDialog.vue'),
    TextField: () => import('../molecules/textField.vue'),
    FsSelect: () => import('../molecules/fsSelect.vue'),
    FsRadio: () => import('../molecules/fsRadio.vue')
  }
})
export default class FilterDialog extends Vue {
  @Prop({ type: String, default: '' }) readonly collectionPath!: string
  @Prop({
    type: Object,
    default: () => {
      return {}
    }
  })
  readonly initFilterCondition!: FilterCondition

  @PropSync('isFiltering', { type: Boolean, default: false })
  syncedDisplaying!: boolean

  filterFieldName = ''
  filterCondition = ''
  filterOrder = ''
  filterFieldList: { type: number; value: string }[] = [
    { ...initialFilterField }
  ]

  get id() {
    return this.collectionPath.split('/').pop()
  }

  get conditionItems() {
    return [
      { value: '', text: 'No condition' },
      { value: '==', text: '(==) equal to' },
      { value: '>', text: '(>) greater than' },
      { value: '>=', text: '(>=) greater than or equal to' },
      { value: '<', text: '(<) less than' },
      { value: '<=', text: '(<=) less than or equal to' },
      { value: 'in', text: '(in) equal to any of the following' },
      { value: 'array-contains', text: '(array-contains) an array containing' },
      {
        value: 'array-contains-any',
        text: '(array-contains-any) an array containing any'
      }
    ]
  }

  get isNoCondition() {
    return this.filterCondition === ''
  }

  get isEqualCondition() {
    return this.filterCondition === '=='
  }

  get isArrayCondition() {
    return this.isContain(['in', 'array-contains-any'])
  }

  get isSortableCondition() {
    return this.isContain(['', '>', '>=', '<', '<='])
  }

  isContain(conditions: string[]): boolean {
    return (
      conditions.find((condition) => condition === this.filterCondition) !==
      undefined
    )
  }

  get fieldTypes() {
    return [
      { value: 4, text: 'string' },
      { value: 2, text: 'number' },
      { value: 1, text: 'boolean' }
    ]
  }

  get orderTypeItems() {
    return [
      { value: 'asc', text: 'Ascending order' },
      { value: 'desc', text: 'Descending order' }
    ]
  }

  get previewQuery() {
    let query = `.collection("${this.id}")\n`

    let value = ''

    if (this.isArrayCondition) {
      value =
        '[' +
        this.filterFieldList
          .map((filterField) => {
            let arrayValue = filterField.value
            if (filterField.type === 4) {
              arrayValue = `"${arrayValue}"`
            }
            return arrayValue
          })
          .join(', ') +
        ']'
    } else {
      const filterField = this.filterFieldList[0]
      value = filterField.value
      if (filterField.type === 4) {
        value = `"${value}"`
      }
    }
    if (!this.isNoCondition) {
      query += `\t.where("${this.filterFieldName}", "${this.filterCondition}", ${value})\n`
    }

    if (this.filterOrder !== '') {
      query += `\t.orderBy("${this.filterFieldName}", "${this.filterOrder}")`
    }

    return query
  }

  onClickAdd() {
    this.filterFieldList.push({ ...initialFilterField })
  }

  onClickDelete(index: number) {
    this.filterFieldList = this.filterFieldList.filter((_, i) => i !== index)
  }

  @Watch('isFiltering')
  updateIsFiltering(value: boolean) {
    if (value) {
      this.filterFieldName = this.initFilterCondition.fieldName
      this.filterCondition = this.initFilterCondition.condition
      this.filterFieldList = [...this.initFilterCondition.fieldList]
      this.filterOrder = this.initFilterCondition.order
    }
  }

  @Watch('filterCondition')
  updateFilterCondition() {
    if (this.isSortableCondition) {
      this.filterOrder = this.filterOrder || this.orderTypeItems[0].value
      return
    }
    this.filterOrder = ''
  }

  @Emit()
  filterDocument(): FilterCondition {
    return {
      collectionPath: this.collectionPath,
      fieldName: this.filterFieldName,
      fieldList: [...this.filterFieldList],
      condition: this.filterCondition,
      order: this.filterOrder
    }
  }

  @Emit()
  clearFilter() {
    return this.collectionPath
  }
}
</script>

<style lang="scss">
.filter-dialog-sub-title {
  font-size: 18px;
  font-weight: 500;
  color: rgb(0, 0, 0);
  margin: 4px 0 16px;
}
.filter-dialog-sub-sub-title {
  font-size: 13px;
  font-weight: 500;
  color: rgb(0, 0, 0);
  margin-bottom: 4px;
}
.filter-dialog-add-button {
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
  margin-bottom: 10px;
}

.filter-dialog-delete-button {
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;

  .filter-dialog-delete-button-inner {
    width: 60px;
    text-align: center;
  }
}
</style>
