<template>
  <v-row no-gutters dense>
    <v-col cols="6">
      <text-field :value.sync="latitude" label="Latitude" />
    </v-col>
    <v-col cols="6">
      <text-field :value.sync="longitude" label="Longitude" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, PropSync, Watch } from 'vue-property-decorator'

type GeoPoint = {
  latitude: Number
  longitude: Number
}

@Component({
  components: {
    TextField: () => import('../../molecules/textField.vue'),
    EditDialog: () => import('../../molecules/editDialog.vue'),
    FsSelect: () => import('../../molecules/fsSelect.vue')
  }
})
export default class GeopointField extends Vue {
  @PropSync('value', { type: Object })
  syncedValue!: GeoPoint

  latitude = ''
  longitude = ''
  mounted() {
    this.latitude = String(this.syncedValue.latitude)
    this.longitude = String(this.syncedValue.longitude)
  }

  @Watch('latitude')
  onUpdateLatitude() {
    this.syncedValue.latitude = Number(this.latitude)
  }

  @Watch('longitude')
  onUpdateLongitude() {
    this.syncedValue.longitude = Number(this.longitude)
  }
}
</script>
