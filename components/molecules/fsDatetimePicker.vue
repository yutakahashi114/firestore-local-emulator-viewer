<template>
  <v-col cols="12">
    <v-menu
      ref="menu1"
      v-model="menu1"
      :close-on-content-click="false"
      transition="scale-transition"
      offset-y
      max-width="290px"
      min-width="290px"
    >
      <template v-slot:activator="{ on }">
        <v-text-field
          v-model="dateFormatted"
          label="Date"
          hint="MM/DD/YYYY format"
          persistent-hint
          prepend-icon="event"
          @blur="date = parseDate(dateFormatted)"
          v-on="on"
        ></v-text-field>
      </template>
      <v-date-picker
        v-model="date"
        no-title
        @input="menu1 = false"
      ></v-date-picker>
    </v-menu>
    <p>
      Date in ISO format: <strong>{{ date }}</strong>
    </p>
  </v-col>
  <!-- <v-text-field
    v-model="syncedValue"
    :label="label"
    :type="type"
    :readonly="readonly"
    :menu-props="{ top: true, offsetY: true }"
    outlined
    dense
  />
  <v-date-picker v-model="date" no-title @input="menu1 = false"></v-date-picker> -->
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync } from 'vue-property-decorator'

@Component
export default class FsDatetimePicker extends Vue {
  @Prop({ type: String, default: '' }) readonly type!: string
  @Prop({ type: String, default: '' }) readonly label!: string
  @Prop({ type: String, default: '' }) readonly placeholder!: string
  @Prop({ type: Boolean, default: false }) readonly readonly!: boolean
  @PropSync('value', { type: String }) syncedValue!: string
}
</script>
