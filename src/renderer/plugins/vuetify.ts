import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";
import { ThemeDefinition, createVuetify } from "vuetify";
import { mdi } from "vuetify/iconsets/mdi";

const myCustomLightTheme: ThemeDefinition = {
  dark: true,
  colors: {
    surface: "#2C2C2E",
  },
};

export default createVuetify({
  theme: {
    defaultTheme: "myCustomLightTheme",
    themes: {
      myCustomLightTheme,
    },
  },
  icons: {
    defaultSet: "mdi",
    sets: {
      mdi,
    },
  },
});
