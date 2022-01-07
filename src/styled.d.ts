import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    borderRadius: string;

    colors: {
      white: {
        white: string;
        dark: string;
        light: string;
      };
      black: {
        black: string;
        dark: string;
      };
      active: string;
      red: string;
    };
  }
}
