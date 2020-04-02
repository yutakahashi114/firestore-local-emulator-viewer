<template>
  <v-row no-gutters dense>
    <v-col cols="6">
      <v-menu
        ref="menu1"
        v-model="isDisplaying"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
      >
        <template v-slot:activator="{ on }">
          <span v-on="on">
            <text-field
              :value.sync="date"
              label="Date"
              @change="onUpdateDate"
            />
          </span>
        </template>
        <v-date-picker
          v-model="datePick"
          no-title
          @change="onUpdateDatePick"
          @input="isDisplaying = false"
        ></v-date-picker>
      </v-menu>
    </v-col>
    <v-col cols="6">
      <text-field :value.sync="time" label="Time" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync, Watch } from 'vue-property-decorator'

type Timestamp = {
  seconds: number
  nanoseconds: number
}

@Component({
  components: {
    TextField: () => import('../../molecules/textField.vue'),
    EditDialog: () => import('../../molecules/editDialog.vue'),
    FsSelect: () => import('../../molecules/fsSelect.vue')
  }
})
export default class DateField extends Vue {
  @Prop({ type: String, default: '' }) readonly label!: string
  @PropSync('value', { type: Object })
  syncedValue!: Timestamp

  date = ''
  datePick = ''
  time = ''
  isDisplaying = false
  mounted() {
    const date = new Date(this.syncedValue.seconds * 1000)
    const year = date.getUTCFullYear()
    const month = date.getUTCMonth() + 1
    const day = date.getUTCDate()
    const hour = date.getUTCHours()
    const minute = date.getUTCMinutes()
    const second = date.getUTCSeconds()
    this.date = `${year}-${('0' + month).slice(-2)}-${('0' + day).slice(-2)}`
    this.time = `${('0' + hour).slice(-2)}:${('0' + minute).slice(-2)}:${(
      '0' + second
    ).slice(-2)}`
    if (this.syncedValue.nanoseconds !== 0) {
      this.time += '.' + this.syncedValue.nanoseconds
    }
    this.datePick = this.date
  }

  onUpdateDate() {
    const splitedDate = this.date.split('-')
    if (splitedDate.length !== 3) {
      return
    }
    const year = Number(splitedDate[0])
    const month = Number(splitedDate[1])
    const day = Number(splitedDate[2])
    const date = new Date(year, month - 1, day)
    let year2 = year
    if (year < 100) {
      year2 += 1900
    }
    if (
      date.getFullYear() !== year2 ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return
    }

    this.datePick = `${year}-${('0' + month).slice(-2)}-${('0' + day).slice(
      -2
    )}`
    this.onUpdate()
  }

  @Watch('time')
  onUpdateTime() {
    this.onUpdate()
  }

  onUpdateDatePick() {
    this.date = this.datePick
    this.onUpdate()
  }

  onUpdate() {
    this.syncedValue.seconds = Number(
      new Date(('000' + this.datePick).slice(-10)).getTime() / 1000
    )
    const times = this.time.split(':')
    this.syncedValue.seconds +=
      (Number(times[0]) * 60 + Number(times[1])) * 60 + Number(times[2])
    const nss = this.time.split('.')
    if (nss.length === 1) {
      this.syncedValue.nanoseconds = 0
      return
    }
    this.syncedValue.nanoseconds = Number((nss[1] + '000000000').slice(0, 9))
  }
}
</script>
