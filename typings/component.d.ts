// GlobalComponents for Volar
declare module 'vue' {
  export interface GlobalComponents {
    TaBasicArrow: typeof import('../packages/tav-ui')['TaBasicArrow']
    TaBasicHelp: typeof import('../packages/tav-ui')['TaBasicHelp']
    TaBasicTitle: typeof import('../packages/tav-ui')['TaBasicTitle']
    TaButton: typeof import('../packages/tav-ui')['TaButton']
    TaButtonGroup: typeof import('../packages/tav-ui')['TaButtonGroup']
    TaButtonModal: typeof import('../packages/tav-ui')['TaButtonModal']
    TaButtonPopConfirm: typeof import('../packages/tav-ui')['TaButtonPopConfirm']
    TaContainerCollapse: typeof import('../packages/tav-ui')['TaContainerCollapse']
    TaContainerScroll: typeof import('../packages/tav-ui')['TaContainerScroll']
    TaContextMenu: typeof import('../packages/tav-ui')['TaContextMenu']
    TaDropDown: typeof import('../packages/tav-ui')['TaDropDown']
    TaFileView: typeof import('../packages/tav-ui')['TaFileView']
    TaForm: typeof import('../packages/tav-ui')['TaForm']
    TaIcon: typeof import('../packages/tav-ui')['TaIcon']
    TaIconPicker: typeof import('../packages/tav-ui')['TaIconPicker']
    TaIconSvg: typeof import('../packages/tav-ui')['TaIconSvg']
    TaInputNumberRange: typeof import('../packages/tav-ui')['TaInputNumberRange']
    TaLoading: typeof import('../packages/tav-ui')['TaLoading']
    TaModal: typeof import('../packages/tav-ui')['TaModal']
    TaTable: typeof import('../packages/tav-ui')['TaTable']
    TaTime: typeof import('../packages/tav-ui')['TaTime']
    TaTimeline: typeof import('../packages/tav-ui')['TaTimeline']
    TaTree: typeof import('../packages/tav-ui')['TaTree']
  }
}

// declare module '@vue/runtime-core' {
//   interface ComponentCustomProperties {
//     $message: typeof import('../packages/tav-ui')['TaMessage'];
//     $notify: typeof import('../packages/tav-ui')['TaNotification'];
//     $msgbox: typeof import('../packages/tav-ui')['TaMessageBox'];
//     $messageBox: typeof import('../packages/tav-ui')['TaMessageBox'];
//     $alert: typeof import('../packages/tav-ui')['TaMessageBox']['alert'];
//     $confirm: typeof import('../packages/tav-ui')['TaMessageBox']['confirm'];
//     $prompt: typeof import('../packages/tav-ui')['TaMessageBox']['prompt'];
//     $loading: typeof import('../packages/tav-ui')['TaLoadingService'];
//   }
// }

export {}
