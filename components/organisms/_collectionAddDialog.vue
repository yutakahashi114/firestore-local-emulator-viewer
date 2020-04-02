<template>
  <edit-dialog :is-displaying.sync="isDisplaying" title="Start a collection">
    <template v-slot:content>
      <div>Give the collection an ID</div>
      <v-row no-gutters dense>
        <v-col cols="6">
          <text-field
            :value.sync="collectionId"
            label="Collection ID"
            placeholder="Collection ID"
          />
        </v-col>
      </v-row>
      <div>Add its first document</div>
      <field-form :target-field.sync="targetField" />
    </template>
    <template v-slot:action>
      <v-btn color="blue darken-1" text @click="isDisplaying = false"
        >CANCEL</v-btn
      >
      <v-btn color="blue darken-1" text @click="addCollection">SAVE</v-btn>
    </template>
  </edit-dialog>
</template>

<script lang="ts">
// import axios from 'axios'
// import { Component, Vue, Watch, Emit } from 'vue-property-decorator'
// import { FieldValue } from '../molecules/field.vue'

// @Component({
//   components: {
//     TextField: () => import('../molecules/textField.vue'),
//     EditDialog: () => import('../molecules/editDialog.vue'),
//     FieldForm: () => import('./fieldForm.vue')
//   }
// })
// export default class CollectionAddDialog extends Vue {
//   @Watch('isDisplaying')
//   onChangeDisplay() {
//     if (this.isDisplaying === false) {
//       this.targetField = this.initTargetField
//     }
//   }

//   get initTargetField(): FieldValue {
//     return { name: '', value: '' }
//   }

//   targetField: FieldValue = this.initTargetField
//   isDisplaying = false
//   collectionId = ''

//   @Emit()
//   addCollection() {
//     return { collection: this.collectionId, fieldValue: this.targetField }
//   }
// }
</script>
