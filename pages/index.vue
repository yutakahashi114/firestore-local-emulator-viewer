<template>
  <div class="table">
    <div class="sub-title">Data</div>
    <div class="document-path">
      <v-text-field
        v-show="isEditing"
        ref="editDocumentPathForm"
        v-model="searchDocumentPath"
        solo
        dense
        :hide-details="true"
        @blur="searchDocument"
      ></v-text-field>
      <template v-if="!isEditing">
        <v-breadcrumbs :items="currentPaths">
          <template v-slot:item="{ item }">
            <v-breadcrumbs-item
              class="document-path-item"
              @click="onClickItem(item)"
            >
              {{ item.text }}
            </v-breadcrumbs-item>
          </template>
          <template v-slot:divider>
            <v-icon>mdi-chevron-right</v-icon>
          </template>
        </v-breadcrumbs>
        <div class="document-path-edit">
          <v-icon dense @click="editDocumentPath">mdi-pencil</v-icon>
        </div>
      </template>
    </div>
    <div class="table-main">
      <div class="table-slider" :style="tableSliderStyle">
        <div class="table-column column-0">
          <div class="table-header">Root</div>
          <collection-list
            class="collection-list"
            :collection-ids="selectCollectionsPerDepth[0]"
            :paths="paths"
            :depth="0"
            @on-click-collection="selectCollection"
            @on-update-collections="onUpdateDocument"
          />
        </div>

        <template v-for="(list, index) in selectDocumentsList">
          <template v-if="isDocumentIndex(index)">
            <div
              :key="index"
              class="table-column"
              :class="toColumnClassName(index)"
            >
              <div class="table-header">
                <div>{{ paths[index] }}</div>

                <div
                  class="table-header-icon"
                  @click="onClickFilterDocument(index)"
                >
                  <v-tooltip bottom transition="none">
                    <template v-slot:activator="{ on }">
                      <template
                        v-if="filterMap[paths.slice(0, index + 1).join('/')]"
                      >
                        <v-icon dense v-on="on">mdi-filter-variant-plus</v-icon>
                      </template>

                      <template v-else>
                        <v-icon dense v-on="on">mdi-filter-variant</v-icon>
                      </template>
                    </template>
                    <span>Filter documents</span>
                  </v-tooltip>
                </div>
              </div>
              <document-list
                ref="documentList"
                class="document-list"
                :documents="list"
                :paths="paths"
                :depth="toListDepth(index)"
                @on-click-document="selectDocument"
                @on-update-documents="onUpdateDocuments"
              />
            </div>
          </template>
          <template v-else>
            <div
              :key="index"
              class="table-column"
              :class="toColumnClassName(index)"
            >
              <div class="table-header">
                <div>{{ paths[index] }}</div>
                <div
                  class="table-header-icon"
                  @click="onClickAddSimilarDocument(index)"
                >
                  <v-tooltip bottom transition="none">
                    <template v-slot:activator="{ on }">
                      <v-icon dense v-on="on">mdi-content-copy</v-icon>
                    </template>
                    <span>Add similar document</span>
                  </v-tooltip>
                </div>
              </div>
              <div class="collection-field-list">
                <template v-if="list">
                  <collection-list
                    class="sub-collection-list"
                    :collection-ids="list.collections"
                    :paths="paths"
                    :depth="toListDepth(index)"
                    @on-click-collection="selectCollection"
                    @on-update-collections="onUpdateDocument"
                  />
                  <div class="field-list-outer">
                    <field-list
                      class="field-list"
                      :fields="list.data"
                      :paths="paths"
                      :depth="toListDepth(index)"
                      @on-update-fields="onUpdateDocument"
                    />
                  </div>
                </template>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>

    <filter-dialog
      :is-filtering.sync="isFiltering"
      :collection-path="filterCollectionPath"
      :init-filter-condition="targetFilterCondition"
      @filter-document="filterDocument"
      @clear-filter="clearFilter"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import axios from 'axios'
import CollectionList from '../components/organisms/collectionList.vue'
import DocumentList, {
  Documents,
  Document
} from '../components/organisms/documentList.vue'
import FilterDialog, {
  FilterCondition,
  initialFilterCondition
} from '../components/organisms/filterDialog.vue'

@Component({
  components: {
    EditDialog: () => import('../components/molecules/editDialog.vue'),
    TextField: () => import('../components/molecules/textField.vue'),
    FieldList: () => import('../components/organisms/fieldList.vue'),
    FilterDialog,
    DocumentList,
    CollectionList
  }
})
export default class Index extends Vue {
  async mounted() {
    try {
      const collection = await this.getCollections([])
      this.selectCollectionsPerDepth[0] = collection
      if (collection.length > 0) {
        this.selectDocumentsPerDepth[0] = await this.getDocuments([
          collection[0]
        ])
        this.paths.push(collection[0])
      }
    } catch (err) {
      console.log(err)
      alert('internal server error')
    }
  }

  async onUpdateDocument({ paths, depth }: { paths: string[]; depth: number }) {
    try {
      if (paths.length > 0) {
        const id = paths[paths.length - 1]
        const doc = await this.getDocument(paths)
        this.$set(this.selectDocumentsPerDepth[depth - 1], id, doc)
        this.$set(this.selectCollectionsPerDepth, depth, doc.collections)
        return
      }
      const cols = await this.getCollections(paths)
      this.$set(this.selectCollectionsPerDepth, 0, cols)
    } catch (err) {
      console.log(err)
      alert('internal server error')
    }
  }

  onUpdateDocuments({ paths, depth }: { paths: string[]; depth: number }) {
    this.selectCollection({ id: paths[paths.length - 1], depth })
  }

  get currentPaths(): { text: string }[] {
    return ['/', ...this.paths].map((path) => {
      return {
        text: path,
        onClick: () => {
          if (path === '/') {
            this.paths = []
            return
          }
          for (const index in this.paths) {
            if (path === this.paths[index]) {
              this.paths = this.paths.slice(0, Number(index) + 1)
              break
            }
          }
        }
      }
    })
  }

  onClickItem(item: { text: string; onClick: Function }) {
    if (item.onClick) {
      item.onClick()
    }
  }

  get selectDocumentsList() {
    const result: (Document | Documents)[] = []
    this.paths.forEach((path, index) => {
      const depth = Math.floor(index / 2 + 0.1)
      if (index % 2 === 0) {
        result.push(this.selectDocumentsPerDepth[depth])
        return
      }
      result.push(this.selectDocumentsPerDepth[depth][path])
    })
    return result
  }

  get tableSliderStyle(): { transform: string } {
    if (this.paths.length < 2) {
      return { transform: 'translateX(0)' }
    }
    return { transform: 'translateX(' + (this.paths.length - 2) * -30 + '%)' }
  }

  isDocumentIndex(index: number): boolean {
    return index % 2 === 0
  }

  toListDepth(index: number): number {
    return Math.floor((index + 1) / 2 + 0.1)
  }

  toColumnClassName(index: number): string {
    return 'column-' + (index + 1)
  }

  paths: string[] = []
  selectCollectionsPerDepth: string[][] = []
  selectDocumentsPerDepth: Documents[] = []
  searchDocumentPath = ''
  filterMap: { [key: string]: FilterCondition } = {}
  filterCollectionPath = ''
  targetFilterCondition: FilterCondition = { ...initialFilterCondition }
  isEditing = false
  isFiltering = false

  async getCollections(paths: string[]): Promise<string[]> {
    const { data } = await axios.get('/api/collection', {
      params: { paths }
    })
    return data
  }

  async getDocuments(
    paths: string[],
    filter: FilterCondition | null = null
  ): Promise<Documents> {
    const { data } = await axios.get('/api/documents', {
      params: { paths, filter }
    })
    return data
  }

  async getDocument(paths: string[]): Promise<Document> {
    const { data } = await axios.get('/api/document', {
      params: { paths }
    })
    return data
  }

  async selectCollection({
    id,
    depth
  }: {
    id: string
    depth: number
  }): Promise<boolean> {
    const targetPath = depth * 2
    this.paths = this.paths.slice(0, targetPath)
    this.$set(this.paths, targetPath, id)

    const filter = this.filterMap[this.paths.join('/')] || null
    try {
      const documents = await this.getDocuments(this.paths, filter)
      this.$set(this.selectDocumentsPerDepth, depth, documents)
      return Object.keys(documents).length > 0
    } catch (err) {
      console.log(err)
      alert('internal server error')
    }
    return false
  }

  selectDocument({ id, depth }: { id: string; depth: number }): boolean {
    const targetPath = depth * 2 + 1
    this.paths = this.paths.slice(0, targetPath)
    this.$set(this.paths, targetPath, id)

    if (!this.selectDocumentsPerDepth[depth]) {
      return false
    }
    if (!this.selectDocumentsPerDepth[depth][id]) {
      return false
    }
    const cols = this.selectDocumentsPerDepth[depth][id].collections
    if (!cols) {
      return false
    }
    this.$set(this.selectCollectionsPerDepth, depth + 1, cols)
    return true
  }

  editDocumentPath() {
    this.isEditing = true
    this.searchDocumentPath = '/' + this.paths.join('/')
    const ref: any = this.$refs.editDocumentPathForm
    this.$nextTick(ref.focus)
  }

  async searchDocument() {
    const paths = this.searchDocumentPath.split('/')
    paths.shift()
    for (const i in paths) {
      const index = Number(i)
      const id = paths[index]
      const depth = Math.floor(index / 2 + 0.1)
      let exist: boolean
      if (index % 2 === 0) {
        exist = await this.selectCollection({ id, depth })
      } else {
        exist = this.selectDocument({ id, depth })
      }
      if (!exist) {
        this.paths.pop()
        alert('Not found')
        break
      }
    }
    this.isEditing = false
  }

  onClickFilterDocument(index: number) {
    const currentPath = this.paths.slice(0, index + 1)
    this.filterCollectionPath = currentPath.join('/')
    this.targetFilterCondition =
      this.filterMap[this.filterCollectionPath] ||
      JSON.parse(JSON.stringify(initialFilterCondition))
    this.isFiltering = true

    this.filterDocument = (cond: FilterCondition) => {
      this.filterMap[cond.collectionPath] = cond
      const id = currentPath[currentPath.length - 1]
      this.selectCollection({ id, depth: this.toListDepth(index) })
      this.isFiltering = false
    }
  }

  filterDocument: Function = () => {}

  clearFilter(collectionPath: string) {
    delete this.filterMap[collectionPath]
    const currentPath = collectionPath.split('/')
    const id = currentPath[currentPath.length - 1]
    this.selectCollection({
      id,
      depth: this.toListDepth(currentPath.length - 2)
    })
    this.isFiltering = false
  }

  onClickAddSimilarDocument(index: number) {
    const ref: any = this.$refs.documentList
    ref[this.toListDepth(index) - 1].onClickAddSimilarDocument(
      this.paths[index]
    )
  }
}
</script>

<style lang="scss">
.table {
  border-left: 1px solid rgba(0, 0, 0, 0.12);
  height: 100%;

  .sub-title {
    color: black;
    font-size: 18px;
    height: 48px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    display: flex;
    align-items: center;
    padding-left: 10px;
  }
  .document-path {
    color: black;
    font-size: 13px;
    height: 36px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);

    .document-path-item {
      cursor: pointer;
      transition: background-color 0.5s;
      padding: 0 4px;
    }

    .document-path-item:hover {
      background-color: rgba(0, 0, 0, 0.12);
    }

    .document-path-edit {
      width: 24px;
      height: 24px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.5s;
    }

    .document-path-edit:hover {
      background-color: rgba(0, 0, 0, 0.12);
    }
  }
  .table-main {
    height: calc(100% - 84px);
    font-size: 0;
    overflow: hidden;

    .table-slider {
      height: 100%;
      display: flex;
      transition: 0.2s transform cubic-bezier(0.4, 0, 0.2, 1);
    }

    .table-column {
      display: inline-block;
      border-left: 1px solid rgba(0, 0, 0, 0.12);
      vertical-align: top;
      height: 100%;
      font-size: 13px;
      transition: 0.2s min-width cubic-bezier(0.4, 0, 0.2, 1);

      @for $i from 0 through 20 {
        &.column-#{$i} {
          min-width: 30%;
          max-width: 30%;
        }
      }

      .table-header {
        color: black;
        font-size: 13px;
        font-weight: 500;
        padding: 0 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 40px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.12);

        .table-header-icon {
          width: 40px;
          height: 40px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.5s;
          color: rgba(0, 0, 0, 1);
          cursor: pointer;
        }

        .table-header-icon:hover {
          background-color: rgba(0, 0, 0, 0.12);
        }
      }

      .document-list {
        height: calc(100% - 40px);
      }

      .collection-list {
        height: calc(100% - 40px);
      }

      .collection-field-list {
        height: calc(100% - 40px);
        display: flex;
        flex-direction: column;

        .sub-collection-list {
          border-bottom: 1px solid rgba(0, 0, 0, 0.12);
          max-height: 50%;
          display: flex;
          flex-direction: column;
          flex: 0 0 auto;
        }

        .field-list-outer {
          position: relative;
          height: 100%;

          .field-list {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
          }
        }
      }
    }
    .table-column:last-of-type {
      border-right: 1px solid rgba(0, 0, 0, 0.12);
      min-width: 40%;
    }
  }
}
</style>
