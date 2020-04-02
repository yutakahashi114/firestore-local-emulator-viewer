<template>
  <v-row no-gutters dense>
    <v-row v-if="syncedValues.length > 0" no-gutters dense>
      <template v-for="syncedValue in syncedValues">
        <v-row
          :key="syncedValue.name"
          no-gutters
          dense
          @mouseover.stop="onMouseenter"
          @mouseout.stop="onMouseleave"
        >
          <v-col cols="1">
            <div class="array-field-left-line-v" :style="lineStyle">
              <div class="array-field-left-line-h" :style="lineStyle"></div>
            </div>
          </v-col>
          <v-col cols="10">
            <field-form
              :target-field.sync="syncedValue"
              :edit="true"
              :is-in-array="true"
            />
          </v-col>
          <v-col cols="1" class="array-field-icon-delete">
            <div class="array-field-icon-delete-inner">
              <v-icon @click="onClickDelete(syncedValue.name)"
                >mdi-delete</v-icon
              >
            </div>
          </v-col>
        </v-row>
      </template>
    </v-row>
    <v-row
      no-gutters
      dense
      class="array-field-add"
      @mouseover.stop="onMouseenter"
      @mouseout.stop="onMouseleave"
    >
      <v-col cols="1">
        <div class="array-field-add-left-line-v" :style="lineStyle">
          <div class="array-field-add-left-line-h" :style="lineStyle"></div>
        </div>
      </v-col>
      <v-col class="array-field-icon-add">
        <v-icon @click="onClickAdd">mdi-plus-box</v-icon>
      </v-col>
    </v-row>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, PropSync } from 'vue-property-decorator'
import { FieldValue } from '../../molecules/field.vue'

@Component({
  components: {
    TextField: () => import('../../molecules/textField.vue'),
    FieldForm: () => import('../fieldForm.vue')
  }
})
export default class ArrayField extends Vue {
  @PropSync('value', { type: Array }) syncedValues!: FieldValue[]

  onClickAdd() {
    this.syncedValues.push({
      name: String(this.syncedValues.length),
      type: 4,
      value: ''
    })
  }

  onClickDelete(name: string) {
    this.syncedValues = this.syncedValues
      .filter((val) => val.name !== name)
      .map((val, index) => {
        val.name = String(index)
        return val
      })
  }

  lineStyle = {}

  onMouseenter() {
    this.lineStyle = { borderColor: 'rgb(0, 0, 0)' }
  }

  onMouseleave() {
    this.lineStyle = {}
  }
}
</script>

<style lang="scss">
.array-field-left-line-v {
  margin-left: 20px;
  height: 100%;
  border-left: 1px solid rgba(0, 0, 0, 0.12);
}
.array-field-left-line-h {
  height: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
.array-field-add {
  height: 40px;
}
.array-field-add-left-line-v {
  margin-left: 20px;
  height: 100%;
}
.array-field-add-left-line-h {
  height: 20px;
  border-left: 1px solid rgba(0, 0, 0, 0.12);
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
.array-field-icon-delete {
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;

  .array-field-icon-delete-inner {
    width: 60px;
    text-align: center;
  }
}
.array-field-icon-add {
  display: flex;
  align-items: center;
}
</style>
