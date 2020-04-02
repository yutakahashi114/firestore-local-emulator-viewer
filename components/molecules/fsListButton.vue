<template>
  <v-menu v-model="isDisplaying" :close-on-content-click="false" offset-y>
    <template v-slot:activator="{ on }">
      <div class="list-button-icon" v-on="on">
        <v-icon>mdi-dots-vertical</v-icon>
      </div>
    </template>
    <v-card>
      <div class="list-button-list">
        <template v-for="item in items">
          <div
            :key="item.text"
            class="list-button-item"
            @click.stop="onClickItem(item)"
          >
            <template v-if="item.icon">
              <v-list-item-icon>
                <v-icon v-text="item.icon"></v-icon>
              </v-list-item-icon>
            </template>
            <v-list-item-title>
              <span class="list-button-item-text">{{ item.text }}</span>
            </v-list-item-title>
          </div>
        </template>
      </div>
    </v-card>
  </v-menu>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

export type Item = {
  text: string
  icon: string
  onClick: Function
}

@Component
export default class FsListButton extends Vue {
  @Prop({ type: Array, default: [] }) readonly items!: Item[]

  isDisplaying = false

  onClickItem(item: Item) {
    this.isDisplaying = false
    if (item.onClick) {
      item.onClick()
    }
  }
}
</script>

<style lang="scss">
.list-button-icon {
  width: 34px;
  text-align: center;
  margin-right: 10px;
  border-radius: 4px;
  transition: background-color 0.5s;
}

.list-button-list {
  display: flex;
  flex-direction: column;
  padding: 4px 0;

  .list-button-item {
    height: 32px;
    padding: 0 16px;
    display: flex;
    cursor: pointer;

    .list-button-item-text {
      font-size: 15px;
    }
  }

  .list-button-item:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }
}
.list-button-icon:hover {
  background-color: rgba(0, 0, 0, 0.12);
}
</style>
