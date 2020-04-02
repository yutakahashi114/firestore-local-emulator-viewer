<template>
  <div class="flat-button-main" @click="click">
    <template v-if="icon !== ''">
      <span>
        <div class="flat-button-icon">
          <v-icon color="primary">{{ icon }}</v-icon>
        </div>
      </span>
    </template>
    <span>{{ text }}</span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator'

@Component
export default class FlatButton extends Vue {
  @Prop({ type: String, default: '' }) readonly text!: string
  @Prop({ type: String, default: '' }) readonly icon!: string

  @Emit()
  click() {}
}
</script>

<style lang="scss">
.flat-button-main {
  width: 100%;
  padding: 0 22px;
  cursor: pointer;
  transition: background-color 0.5s;
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 13px;
  color: #3367d6;

  .flat-button-icon {
    margin-right: 10px;
  }
}
.flat-button-main:hover {
  background-color: rgba(0, 0, 0, 0.12);
}
</style>
