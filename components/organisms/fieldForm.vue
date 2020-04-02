<template>
  <v-row no-gutters dense>
    <v-col cols="3">
      <text-field
        :value.sync="syncedTargetField.name"
        label="Field name"
        :readonly="edit"
      />
    </v-col>
    <v-col cols="3">
      <fs-select
        :items="fieldTypes"
        :value.sync="syncedTargetField.type"
        label="Field type"
        @change="onChangeType"
      />
    </v-col>
    <v-col cols="6">
      <template v-if="isString">
        <string-field
          :value.sync="syncedTargetField.value"
          label="Field value"
        />
      </template>
      <template v-if="isNumber">
        <number-field
          :value.sync="syncedTargetField.value"
          label="Field value"
        />
      </template>
      <template v-if="isBool">
        <boolean-field
          :value.sync="syncedTargetField.value"
          label="Field value"
        />
      </template>
      <template v-if="isDate">
        <date-field :value.sync="syncedTargetField.value" />
      </template>
      <template v-if="isGeopoint">
        <geopoint-field :value.sync="syncedTargetField.value" />
      </template>
      <template v-if="isReference">
        <reference-field
          :value.sync="syncedTargetField.value"
          label="Document path"
        />
      </template>
    </v-col>
    <template v-if="isArray">
      <array-field :value.sync="syncedTargetField.value" />
    </template>
    <template v-if="isMap">
      <map-field :value.sync="syncedTargetField.value" />
    </template>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, PropSync, Prop } from 'vue-property-decorator'
import { FieldValue } from '../molecules/field.vue'

@Component({
  components: {
    TextField: () => import('../molecules/textField.vue'),
    FsSelect: () => import('../molecules/fsSelect.vue'),
    StringField: () => import('./field/string.vue'),
    NumberField: () => import('./field/number.vue'),
    BooleanField: () => import('./field/boolean.vue'),
    ReferenceField: () => import('./field/reference.vue'),
    GeopointField: () => import('./field/geopoint.vue'),
    DateField: () => import('./field/date.vue'),
    MapField: () => import('./field/map.vue'),
    ArrayField: () => import('./field/array.vue')
  }
})
export default class FieldForm extends Vue {
  @Prop({ type: Boolean, default: false }) readonly edit!: boolean
  @Prop({ type: Boolean, default: false }) readonly isInArray!: boolean
  @PropSync('targetField', {
    type: Object,
    default: () => {
      return {}
    }
  })
  syncedTargetField!: FieldValue

  get initTargetField(): FieldValue {
    return { name: '', type: 4, value: '' }
  }

  onChangeType(type: number) {
    if (type === 0) {
      this.syncedTargetField.value = ''
      return
    }
    if (type === 1) {
      this.syncedTargetField.value = true
      return
    }
    if (type === 2) {
      this.syncedTargetField.value = 0
      return
    }
    if (type === 3) {
      this.syncedTargetField.value = {
        seconds: 0,
        nanoseconds: 0
      }
      return
    }
    if (type === 4) {
      this.syncedTargetField.value = ''
      return
    }
    if (type === 5) {
      this.syncedTargetField.value = ''
      return
    }
    if (type === 6) {
      this.syncedTargetField.value = ''
      return
    }
    if (type === 7) {
      this.syncedTargetField.value = {
        latitude: 0,
        longitude: 0
      }
      return
    }
    if (type === 8) {
      const value = { ...this.initTargetField }
      value.name = '0'
      this.syncedTargetField.value = []
      this.syncedTargetField.value.push(value)
      return
    }
    if (type === 9) {
      this.syncedTargetField.value = []
      this.syncedTargetField.value.push({ ...this.initTargetField })
    }
  }

  get fieldTypes() {
    return [
      { value: 4, text: 'string' },
      { value: 2, text: 'number' },
      { value: 1, text: 'boolean' },
      { value: 9, text: 'map' },
      { value: 8, text: 'array', disabled: this.isInArray },
      { value: 0, text: 'null' },
      { value: 3, text: 'timestamp' },
      { value: 7, text: 'geopoint' },
      { value: 6, text: 'reference' }
    ]
  }

  get isString() {
    return this.syncedTargetField.type === 4
  }

  get isNumber() {
    return this.syncedTargetField.type === 2
  }

  get isBool() {
    return this.syncedTargetField.type === 1
  }

  get isMap() {
    return this.syncedTargetField.type === 9
  }

  get isArray() {
    return this.syncedTargetField.type === 8
  }

  get isNull() {
    return this.syncedTargetField.type === 0
  }

  get isDate() {
    return this.syncedTargetField.type === 3
  }

  get isGeopoint() {
    return this.syncedTargetField.type === 7
  }

  get isReference() {
    return this.syncedTargetField.type === 6
  }
}
</script>
