import { defineStore } from "pinia";

export const useUiStore = defineStore("ui", {
  state: ()=>({
    isDisplaySorting : true
  }),
  actions: {
    toggleSorting(){
      this.isDisplaySorting =!this.isDisplaySorting;
    }
  }
})