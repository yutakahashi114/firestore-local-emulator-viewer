<template>
  <v-list-item class="field-list-item" dense @click="onClickField">
    <v-list-item-content>
      <v-list-item-title>
        <span class="field-list-item-text">{{ fieldNameValue }}</span>
      </v-list-item-title>
    </v-list-item-content>
    <span>
      <div class="field-list-item-icon-delete" @click.stop="onClickDelete">
        <v-icon dense>mdi-delete</v-icon>
      </div>
    </span>
  </v-list-item>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'

export interface FieldValue {
  name: string
  type: number
  value: any
}

@Component
export default class Field extends Vue {
  @Prop({ type: Object }) readonly fieldValue!: FieldValue

  get fieldNameValue() {
    if (this.fieldValue.type === 4) {
      return `${this.fieldValue.name} : "${this.fieldValue.value}"`
    }
    if (this.fieldValue.type === 9) {
      return `${this.fieldValue.name}: (map)`
    }
    if (this.fieldValue.type === 8) {
      return `${this.fieldValue.name}: (array)`
    }
    if (this.fieldValue.type === 0) {
      return `${this.fieldValue.name} : null`
    }
    if (this.fieldValue.type === 3) {
      const date = new Date(this.fieldValue.value.seconds * 1000).toUTCString()
      return `${this.fieldValue.name} : ${date}`
    }
    if (this.fieldValue.type === 7) {
      return `${this.fieldValue.name} : [${this.fieldValue.value.latitude}° N, ${this.fieldValue.value.longitude}° E]`
    }
    if (this.fieldValue.type === 6) {
      return `${this.fieldValue.name} : /${this.fieldValue.value}`
    }
    if (this.fieldValue.type === 5) {
      return `${this.fieldValue.name} : (byte string)`
    }
    return `${this.fieldValue.name} : ${this.fieldValue.value}`
  }

  @Emit()
  onClickField(): FieldValue {
    return this.fieldValue
  }

  @Emit()
  onClickDelete() {
    return this.fieldValue.name
  }
}
</script>

<style lang="scss">
.field-list-item {
  padding-left: 60px;

  .field-list-item-text {
    color: rgba(0, 0, 0, 0.66);
    font-size: 12px;
    font-family: Roboto, sans-serif;
  }

  .field-list-item-icon-delete {
    border-radius: 4px;
    color: rgba(0, 0, 0, 0.54);
    transition: background-color 0.5s;
    opacity: 0;
  }

  .field-list-item-icon-delete:hover {
    background-color: rgba(0, 0, 0, 0.12);
  }
}
.field-list-item:hover {
  background-color: rgba(0, 0, 0, 0.06);
  .field-list-item-icon-delete {
    opacity: 1;
  }
}
</style>
