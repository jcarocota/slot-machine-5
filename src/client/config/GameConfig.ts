/*interface GameConfig {
  aspectRatioWidth: number;
  aspectRatioHeight: number;
  backgroundAppColor: number;
  backgroundSlotMachineColor: number;
  backgroundReelColor: number;
  backgroundButtonDefaultColor: number;
  backgroundInfoBarColor: number;
  backgroundPlayButtonIdleColor: number;
  backgroundPlayButtonDisabledColor: number;
  backgroundPlayButtonHoverColor: number;
  textPlayButtonIdle: string;
  textPlayButtonDisabled: string;
  textPlayButtonHover: string;
  debugMode: number;
  questionMarkAsset: string;
  slotMachineSheet: string;
  slotMachineBlurredSheet: string;
  slotMachineSemiBlurredSheet: string;
  slotMachineDebugModeSheet: string;
  wsUrl: string;
  wsPort: number;
}*/

export const gameConfig = {
  aspectRatioWidth: 4,
  aspectRatioHeight: 3,
  backgroundAppColor: 0xffffff,
  backgroundSlotMachineColor: 0xd5d8dc,
  backgroundReelColor: 0x0d2331,
  backgroundDefaultColor: 0x000000,
  textDefaultColor: "#FFFFFF",
  debugMode: 1,
  questionMarkAsset: "./src/client/assets/question_mark.png",
  slotMachineSheet: "./src/client/assets/fruits-normal.json", //Path of slot machine sprites' atlas
  slotMachineBlurredSheet: "./src/client/assets/fruits-full-blur.json", //Path of slot machine sprites' atlas
  slotMachineSemiBlurredSheet: "./src/client/assets/fruits-medium-blur.json", //Path of slot machine sprites' atlas
  slotMachineDebugModeSheet:
    "./src/client/assets/fruits-normal-debug-mode.json", //Path of slot machine sprites' atlas
  infoBarUI: {
    backgroundColor: 0x8b8b8b,
    textColor: "#FFFFFF",
  },
  playButtonUI: {
    backgroundIdleColor: 0x2ecc71,
    backgroundDisabledColor: 0x566573,
    backgroundHoverColor: 0xf4d03f,
    textIdle: "Ready to play!",
    textDisabled: "Spinning...",
    textHover: "Click now!",
  },
  stakeSelectBoxUI: {
    backgroundDisabledColor: 0x566573,
    backgroundIdleColor: 0x00b3ff,
    backgroundOptionsIdleColor: 0x71c8ed,
    backgroundHoverColor: 0xfffc74,
  },
  cheatPanelSelectBoxUI: {
    backgroundDisabledColor: 0x566573,
    backgroundIdleColor: 0xff5d00,
    backgroundOptionsIdleColor: 0xff8a47,
    backgroundHoverColor: 0xfffc74,
  },
  wsUrl: "192.168.1.106",
  wsPort: 3000,
};
