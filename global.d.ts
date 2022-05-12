// GlobalComponents for Volar
declare module 'vue' {
  export interface GlobalComponents {
    TaBasicArrow: typeof import('tav-ui')['TaBasicArrow']
    TaBasicHelp: typeof import('tav-ui')['TaBasicHelp']
    TaBasicTitle: typeof import('tav-ui')['TaBasicTitle']
    TaButton: typeof import('tav-ui')['TaButton']
    TaButtonGroup: typeof import('tav-ui')['TaButtonGroup']
    TaButtonModal: typeof import('tav-ui')['TaButtonModal']
    TaButtonPopConfirm: typeof import('tav-ui')['TaButtonPopConfirm']
    TaContainerCollapse: typeof import('tav-ui')['TaContainerCollapse']
    TaContainerScroll: typeof import('tav-ui')['TaContainerScroll']
    TaContextMenu: typeof import('tav-ui')['TaContextMenu']
    TaDropDown: typeof import('tav-ui')['TaDropDown']
    TaFileView: typeof import('tav-ui')['TaFileView']
    TaForm: typeof import('tav-ui')['TaForm']
    TaIcon: typeof import('tav-ui')['TaIcon']
    TaIconPicker: typeof import('tav-ui')['TaIconPicker']
    TaIconSvg: typeof import('tav-ui')['TaIconSvg']
    TaInputNumberRange: typeof import('tav-ui')['TaInputNumberRange']
    TaLoading: typeof import('tav-ui')['TaLoading']
    TaModal: typeof import('tav-ui')['TaModal']
    TaTable: typeof import('tav-ui')['TaTable']
    TaTime: typeof import('tav-ui')['TaTime']
    TaTimeline: typeof import('tav-ui')['TaTimeline']
    TaTree: typeof import('tav-ui')['TaTree']
  }
}

// // declare module '@vue/runtime-core' {
// //   interface ComponentCustomProperties {
// //     $message: typeof import('tav-ui')['TaMessage'];
// //     $notify: typeof import('tav-ui')['TaNotification'];
// //     $msgbox: typeof import('tav-ui')['TaMessageBox'];
// //     $messageBox: typeof import('tav-ui')['TaMessageBox'];
// //     $alert: typeof import('tav-ui')['TaMessageBox']['alert'];
// //     $confirm: typeof import('tav-ui')['TaMessageBox']['confirm'];
// //     $prompt: typeof import('tav-ui')['TaMessageBox']['prompt'];
// //     $loading: typeof import('tav-ui')['TaLoadingService'];
// //   }
// // }

// export {}