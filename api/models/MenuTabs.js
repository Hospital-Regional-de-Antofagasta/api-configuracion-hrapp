const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MenuTabs = mongoose.model(
  "menu_tabs",
  new Schema(
    {
      icono: String,
      title: String,
      tab: String,
      habilitado: Boolean,
      implementado: Boolean,
      posicion: Number,
      version: Number,
    },
    { timestamps: true }
  ),
  "menu_tabs"
);

module.exports = MenuTabs;
