<script lang="ts">
import { defineComponent, onMounted, reactive } from 'vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { ConfigProvider } from 'ant-design-vue'
import dayjs from 'dayjs'
import TaConfigProvider from '@tav-ui/components/config-provider'
// import {
//   API__SYSTEM_USER_TABLE_INFO_GET as columnsGetApi,
//   API__SYSTEM_USER_TABLE_INFO_SET as columnsSetApi,
// } from '@tav-ui/components/table-pro/src/data'
import allUsers from './allUserList'
import orgTree from './orgTree'
import { taUploadProvideData } from './components/TaUpload'
import 'dayjs/locale/zh-cn'
import { useI18n } from './hooks/useI18n'
import { i18n } from './locales/setupI18n'
import {
  UserListApi,
  apiPermission,
  apiPermissionData,
  previewEditorWPSFile,
  previewFile,
  previewWPSFile,
  queryFileByFileActualIds,
  queryFileLog,
  queryFilterFormFileType,
} from './components/TaUpload/provideData'
dayjs.locale('zh-cn')
export default defineComponent({
  components: {
    TaConfigProvider,
    ConfigProvider,
  },
  setup() {
    const { t } = useI18n()
    const orgApi = () =>
      new Promise((resolve) => {
        resolve(orgTree)
      })
    const state = reactive({
      appId: '10001',
      userInfo: {
        userId: 1,
        isAdmin: true,
        username: 'admin',
        realName: '系统管理员',
        phone: '13999999999',
        // userId: 108,
        // isAdmin: false,
        // username: '靳熙',
        // realName: '靳熙',
        // phone: '15029309050',
      },
      i18nFun: {
        t,
        i18n,
      },
      uploadVarsJson: '{}',
      permissions: {},
      components: {
        TaUpload: taUploadProvideData,
        // tafile
        TaFileTypeSelect: {
          apiQueryFileType: taUploadProvideData.queryFileType,
        },
        TaFileActionUpload: {
          apiUploadFile: taUploadProvideData.uploadFile,
          apiUpdateFile: taUploadProvideData.updateFile,
        },
        TaFileActionUploadLink: {
          apiUploadFileLink: taUploadProvideData.uploadFileLink,
        },
        TaFileTable: {
          apiQueryFile: taUploadProvideData.queryFile,
          apiQueryFileList: taUploadProvideData.queryFileList,
          apiQueryFileByActualIds: queryFileByFileActualIds,
          apiQueryFilterFormFileType: queryFilterFormFileType,
          apiQueryFileHistory: taUploadProvideData.queryFileHistory,
          apiUpdateFileNameAndLink: taUploadProvideData.updateFileNameAndAddress,
          apiDeleteFile: taUploadProvideData.removeFile,
          apiPreviewFile: previewWPSFile,
          apiDownloadFile: taUploadProvideData.download,
          apiDownloadWaterMarkerFile: taUploadProvideData.downloadWaterMarker,
        },
        TaFileVersion: {
          apiQueryFileHistory: taUploadProvideData.queryFileHistory,
          apiPreviewFile: previewWPSFile,
          apiDownloadFile: taUploadProvideData.download,
          apiDownloadWaterMarkerFile: taUploadProvideData.downloadWaterMarker,
        },
        TaFilePreview: {
          apiPreviewFile: previewWPSFile,
        },
        TaFileLog: {
          apiQueryFileLog: queryFileLog,
        },
        TaFileCards: {
          apiQueryFileType: taUploadProvideData.queryFileType,
          apiQueryFileList: taUploadProvideData.queryFileList,
        },
        TaFileCard: {
          apiQueryFile: taUploadProvideData.queryFile,
          apiQueryFileList: taUploadProvideData.queryFileList,
          apiQueryFileByActualIds: queryFileByFileActualIds,
          apiQueryFileHistory: taUploadProvideData.queryFileHistory,
          apiUpdateFileNameAndLink: taUploadProvideData.updateFileNameAndAddress,
          apiDeleteFile: taUploadProvideData.removeFile,
          apiPreviewFile: previewWPSFile,
          apiDownloadFile: taUploadProvideData.download,
          apiDownloadWaterMarkerFile: taUploadProvideData.downloadWaterMarker,
        },
        TaEditor: {
          apiUploadVars: taUploadProvideData.uploadEditorImageVars,
          apiUploadImage: taUploadProvideData.uploadEditorImage,
          apiUploadFile: taUploadProvideData.uploadEditorFile,
          apiPreviewFile: previewEditorWPSFile,
        },

        TaMemberSelect: {
          orgApi,
          allUserList: allUsers.data.map((v) => {
            return { label: v.name, value: v.id, ...v }
          }),
          userListApi: UserListApi,
        },
        TaTablePro: {
          // actionLabelLimit: 4,
          // columnsGetApi,
          // columnsSetApi,
          apiPermission,
          apiPermissionData,
        },
        TaFileView: {
          previewFile,
          previewWPSFile,
        },
        TaPermissionQuery: {
          apiPermission,
          // apiPermissionData,
        },
        TaPermissionDataQuery: {
          // apiPermission,
          apiPermissionData,
        },
        TaTablePermissionDataQuery: {
          // apiPermission,
          apiPermissionData,
        },
      },
    })
    setTimeout(() => {
      state.permissions = {
        fund_preparations_list: {
          ifShow: true,
          apiUrl: null,
        },
        invest_kpi_all: {
          ifShow: true,
          apiUrl: null,
        },
        invest_app_post_contact: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_org_update: {
          ifShow: true,
          apiUrl: null,
        },
        invest_exit_Grant: {
          ifShow: true,
          apiUrl: null,
        },
        invest_investorsLib_cooperated: {
          ifShow: true,
          apiUrl: null,
        },
        invest_post_runReports_delete: {
          ifShow: true,
          apiUrl: null,
        },
        institute_manage_my: {
          ifShow: true,
          apiUrl: null,
        },
        transfer_add: {
          ifShow: true,
          apiUrl: null,
        },
        invest_fund_file: {
          ifShow: true,
          apiUrl: null,
        },
        invest_TerminationExit_list: {
          ifShow: true,
          apiUrl: null,
        },
        invest_company_invest_data: {
          ifShow: true,
          apiUrl: null,
        },
        invest_exit_fund_update: {
          ifShow: true,
          apiUrl: null,
        },
        invest_raise_management_list: {
          ifShow: true,
          apiUrl: null,
        },
        invest_query_list: {
          ifShow: true,
          apiUrl: null,
        },
        invest_CompleteExit_list: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_role_add: {
          ifShow: true,
          apiUrl: null,
        },
        invest_fund_operations_managefree_list: {
          ifShow: true,
          apiUrl: null,
        },
        allocation_add: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_log_clear: {
          ifShow: true,
          apiUrl: null,
        },
        invest_principal_batch_tz: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_dict_t_update: {
          ifShow: true,
          apiUrl: null,
        },
        FUND_LPEQUITY_CHANGE: {
          ifShow: true,
          apiUrl: null,
        },
        company_my_list: {
          ifShow: true,
          apiUrl: null,
        },
        invest_kpi_group: {
          ifShow: true,
          apiUrl: null,
        },
        bpmn_category_update: {
          ifShow: true,
          apiUrl: null,
        },
        invest_post_financing_new: {
          ifShow: true,
          apiUrl: null,
        },
        invest_raise_manage_update_zero: {
          ifShow: true,
          apiUrl: null,
        },
        invest_project_ratio_change: {
          ifShow: true,
          apiUrl: null,
        },
        post_invest_financial_add: {
          ifShow: true,
          apiUrl: null,
        },
        invest_post_financing_update: {
          ifShow: true,
          apiUrl: null,
        },
        invest_exit_account_delete: {
          ifShow: true,
          apiUrl: null,
        },
        invest_exit_search: {
          ifShow: true,
          apiUrl: null,
        },
        invest_raise_investors_list: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_user_checkRole: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_user_update_state: {
          ifShow: true,
          apiUrl: null,
        },
        liquidation_delete: {
          ifShow: true,
          apiUrl: null,
        },
        invest_post_accredit_add: {
          ifShow: true,
          apiUrl: null,
        },
        invest_project_mining_add: {
          ifShow: true,
          apiUrl: null,
        },
        invest_NoCooperation_list: {
          ifShow: true,
          apiUrl: null,
        },
        document_logger_download: {
          ifShow: true,
          apiUrl: null,
        },
        invest_fund_update: {
          ifShow: true,
          apiUrl: null,
        },
        invest_fund_operations_liquidation_list: {
          ifShow: true,
          apiUrl: null,
        },
        allocation_detail: {
          ifShow: true,
          apiUrl: null,
        },
        document_turn_button: {
          ifShow: true,
          apiUrl: null,
        },
        invest_post_accredit_delete: {
          ifShow: true,
          apiUrl: null,
        },
        document_column_download_src: {
          ifShow: true,
          apiUrl: null,
        },
        document_batch_download_button: {
          ifShow: true,
          apiUrl: null,
        },
        managefree_add: {
          ifShow: true,
          apiUrl: null,
        },
        document_column_logger: {
          ifShow: true,
          apiUrl: null,
        },
        invest_SignAgreement: {
          ifShow: true,
          apiUrl: null,
        },
        invest_app_investor_contact_all: {
          ifShow: true,
          apiUrl: null,
        },
        invest_raise_funder_button: {
          ifShow: true,
          apiUrl: null,
        },
        invest_raise_investors_delete: {
          ifShow: true,
          apiUrl: null,
        },
        document_batch_d_check_warter: {
          ifShow: true,
          apiUrl: null,
        },
        otherex_detail: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_role_user_delete: {
          ifShow: true,
          apiUrl: null,
        },
        invest_post_visit_delete: {
          ifShow: true,
          apiUrl: null,
        },
        partner_account: {
          ifShow: true,
          apiUrl: null,
        },
        EXIT_PROJECT_AGREEMENT_SIGNING: {
          ifShow: true,
          apiUrl: null,
        },
        invest_fund_jurisdiction_view: {
          ifShow: true,
          apiUrl: null,
        },
        invest_file_log: {
          ifShow: true,
          apiUrl: null,
        },
        follow_allocation_add: {
          ifShow: true,
          apiUrl: null,
        },
        invest_company_file: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_user_repwd: {
          ifShow: true,
          apiUrl: null,
        },
        invest_process: {
          ifShow: true,
          apiUrl: null,
        },
        invest_company_business_button: {
          ifShow: true,
          apiUrl: null,
        },
        invest_raise_investors_view: {
          ifShow: true,
          apiUrl: null,
        },
        otherin_edelete: {
          ifShow: true,
          apiUrl: null,
        },
        fund_put_on_records: {
          ifShow: true,
          apiUrl: null,
        },
        invest_fund_operations_otherex_list: {
          ifShow: true,
          apiUrl: null,
        },
        managefree_delete: {
          ifShow: true,
          apiUrl: null,
        },
        invest_post_financ_fund_update: {
          ifShow: true,
          apiUrl: null,
        },
        allocation_detail_update: {
          ifShow: true,
          apiUrl: null,
        },
        invest_raise_manage_add_zero: {
          ifShow: true,
          apiUrl: null,
        },
        invest_post_company_funds_list: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_dict_delete: {
          ifShow: true,
          apiUrl: null,
        },
        invest_HasBeenPaid_list: {
          ifShow: true,
          apiUrl: null,
        },
        document_turn_result: {
          ifShow: true,
          apiUrl: null,
        },
        invest_fund_manager_view: {
          ifShow: true,
          apiUrl: null,
        },
        invest_fund_manager_list: {
          ifShow: true,
          apiUrl: null,
        },
        POST_ENTERPRISETHREE_MEETINGS: {
          ifShow: true,
          apiUrl: null,
        },
        POST_REFINANCING_DECIDE_APPROVAL: {
          ifShow: true,
          apiUrl: null,
        },
        bpmn_list_deploy: {
          ifShow: true,
          apiUrl: null,
        },
        post_invest_financial_update: {
          ifShow: true,
          apiUrl: null,
        },
        follow_invest_statistics_export: {
          ifShow: true,
          apiUrl: null,
        },
        invest_post_conference_delete: {
          ifShow: true,
          apiUrl: null,
        },
        invest_investors_library_update: {
          ifShow: true,
          apiUrl: null,
        },
        invest_account_add: {
          ifShow: true,
          apiUrl: null,
        },
        FUND_OTHER_EXPENSES: {
          ifShow: true,
          apiUrl: null,
        },
        liquidation_update: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_acl_update: {
          ifShow: true,
          apiUrl: null,
        },
        invest_AdvancedReview: {
          ifShow: true,
          apiUrl: null,
        },
        invest_fund_view_fundraising: {
          ifShow: true,
          apiUrl: null,
        },
        invest_exit_account_update: {
          ifShow: true,
          apiUrl: null,
        },
        invest_exit_fund_add: {
          ifShow: true,
          apiUrl: null,
        },
        document_batch_d_result_src: {
          ifShow: true,
          apiUrl: null,
        },
        allocate_Statistic_send: {
          ifShow: true,
          apiUrl: null,
        },
        institute_manage_add: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_org_delete: {
          ifShow: true,
          apiUrl: null,
        },
        invest_post_visit_add: {
          ifShow: true,
          apiUrl: null,
        },
        invest_account_update: {
          ifShow: true,
          apiUrl: null,
        },
        balance_add: {
          ifShow: true,
          apiUrl: null,
        },
        invest_project_mining_statistics: {
          ifShow: true,
          apiUrl: null,
        },
        invest_stop_project: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_org_view: {
          ifShow: true,
          apiUrl: null,
        },
        invest_fund_operations_partner: {
          ifShow: true,
          apiUrl: null,
        },
        invest_fund_manager_add: {
          ifShow: true,
          apiUrl: null,
        },
        invest_company_claim: {
          ifShow: true,
          apiUrl: null,
        },
        invest_exit_account_list: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_dict_t_delete: {
          ifShow: true,
          apiUrl: null,
        },
        transfer_search: {
          ifShow: true,
          apiUrl: null,
        },
        managefree_update: {
          ifShow: true,
          apiUrl: null,
        },
        bpmn_list_list: {
          ifShow: true,
          apiUrl: null,
        },
        invest_fund_manager_delete: {
          ifShow: true,
          apiUrl: null,
        },
        data_archiving_arch_update: {
          ifShow: true,
          apiUrl: null,
        },
        invest_document: {
          ifShow: true,
          apiUrl: null,
        },
        invest_complete_project: {
          ifShow: true,
          apiUrl: null,
        },
        invest_exit_fund_delete: {
          ifShow: true,
          apiUrl: null,
        },
        invest_company_invest_detail_project_query: {
          ifShow: true,
          apiUrl: null,
        },
        invest_investors_library_delete: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_dataacl_list: {
          ifShow: true,
          apiUrl: null,
        },
        invest_fund_add: {
          ifShow: true,
          apiUrl: null,
        },
        post_invest_financial_delete: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_role_file_acl: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_role_delete: {
          ifShow: true,
          apiUrl: null,
        },
        invest_exit_next: {
          ifShow: true,
          apiUrl: null,
        },
        invest_raise_funder_sub_button: {
          ifShow: true,
          apiUrl: null,
        },
        invest_raise_manage_list_all: {
          ifShow: true,
          apiUrl: null,
        },
        FUND_MANAGEMENT_FEE: {
          ifShow: true,
          apiUrl: null,
        },
        invest_post_special_add: {
          ifShow: true,
          apiUrl: null,
        },
        invest_post_special_delete: {
          ifShow: true,
          apiUrl: null,
        },
        invest_post_runReports_list: {
          ifShow: true,
          apiUrl: null,
        },
        investors_details_provide: {
          ifShow: true,
          apiUrl: null,
        },
        invest_enter_project: {
          ifShow: true,
          apiUrl: null,
        },
        invest_post_runReports_update: {
          ifShow: true,
          apiUrl: null,
        },
        fund_establish_list: {
          ifShow: true,
          apiUrl: null,
        },
        institute_manage_export: {
          ifShow: true,
          apiUrl: null,
        },
        invest_raise_investors_select: {
          ifShow: true,
          apiUrl: null,
        },
        invest_exit_AdvancedReview: {
          ifShow: true,
          apiUrl: null,
        },
        invest_exitIndex_list: {
          ifShow: true,
          apiUrl: null,
        },
        invest_post_accredit_update: {
          ifShow: true,
          apiUrl: null,
        },
        invest_fund_operations: {
          ifShow: true,
          apiUrl: null,
        },
        managefree_detail: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_log_delete: {
          ifShow: true,
          apiUrl: null,
        },
        invest_project_query_exit: {
          ifShow: true,
          apiUrl: null,
        },
        invest_post_submit: {
          ifShow: true,
          apiUrl: null,
        },
        post_invest_financial_list: {
          ifShow: true,
          apiUrl: null,
        },
        invest_raise_investors_update: {
          ifShow: true,
          apiUrl: null,
        },
        invest_company_delete: {
          ifShow: true,
          apiUrl: null,
        },
        invest_fund_manager_fileInformation: {
          ifShow: true,
          apiUrl: null,
        },
        invest_company_add: {
          ifShow: true,
          apiUrl: null,
        },
        INVEST_FOUND_PROJECT: {
          ifShow: true,
          apiUrl: null,
        },
        exit_project_log: {
          ifShow: true,
          apiUrl: null,
        },
        invest_kpi_myboard: {
          ifShow: true,
          apiUrl: null,
        },
        invest_Committee: {
          ifShow: true,
          apiUrl: null,
        },
        invest_investors_library_cooperation_list: {
          ifShow: true,
          apiUrl: null,
        },
        POST_SPECIAL_APPROVAL: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_role_view: {
          ifShow: true,
          apiUrl: null,
        },
        invest_post_financing_delete: {
          ifShow: true,
          apiUrl: null,
        },
        investors_provide_add: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_role_list: {
          ifShow: true,
          apiUrl: null,
        },
        invest_investors_library_person: {
          ifShow: true,
          apiUrl: null,
        },
        invest_fund_list: {
          ifShow: true,
          apiUrl: null,
        },
        invest_app_institute_manage: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_org_list: {
          ifShow: true,
          apiUrl: null,
        },
        invest_fund_operations_allocation_list: {
          ifShow: true,
          apiUrl: null,
        },
        invest_fund_operations_otherin_list: {
          ifShow: true,
          apiUrl: null,
        },
        invest_add_project: {
          ifShow: true,
          apiUrl: null,
        },
        invest_principal_batch_zg: {
          ifShow: true,
          apiUrl: null,
        },
        FUND_MAJOR_EVENTS: {
          ifShow: true,
          apiUrl: null,
        },
        invest_quick_project: {
          ifShow: true,
          apiUrl: null,
        },
        bpmn_list_update: {
          ifShow: true,
          apiUrl: null,
        },
        FASTP_ROJECT: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_user_list: {
          ifShow: true,
          apiUrl: null,
        },
        fund_investBreak_list: {
          ifShow: true,
          apiUrl: null,
        },
        invest_fund_deleteBatch: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_cache_refresh: {
          ifShow: true,
          apiUrl: null,
        },
        invest_fund_view: {
          ifShow: true,
          apiUrl: null,
        },
        balance_update: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_role_acl: {
          ifShow: true,
          apiUrl: null,
        },
        EXIT_STOP_PROJECT1: {
          ifShow: true,
          apiUrl: null,
        },
        FUND_FILING_APPROVAL: {
          ifShow: true,
          apiUrl: null,
        },
        invest_post_view: {
          ifShow: true,
          apiUrl: null,
        },
        invest_exit_log: {
          ifShow: true,
          apiUrl: null,
        },
        invest_post_list: {
          ifShow: true,
          apiUrl: null,
        },
        invest_fund_manager_managedFund: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_dataacl_level: {
          ifShow: true,
          apiUrl: null,
        },
        balance_search: {
          ifShow: true,
          apiUrl: null,
        },
        INVEST_GRANTS: {
          ifShow: true,
          apiUrl: null,
        },
        institute_visit: {
          ifShow: true,
          apiUrl: null,
        },
        invest_wait_implement: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_acl_view: {
          ifShow: true,
          apiUrl: null,
        },
        invest_app_investor_contact: {
          ifShow: true,
          apiUrl: null,
        },
        invest_post_special_list: {
          ifShow: true,
          apiUrl: null,
        },
        INVEST_STOP_PROJECTS: {
          ifShow: true,
          apiUrl: null,
        },
        invest_raise_investors_add: {
          ifShow: true,
          apiUrl: null,
        },
        invest_fund_view_overview: {
          ifShow: true,
          apiUrl: null,
        },
        TerminationInvestment_list: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_org_adduser: {
          ifShow: true,
          apiUrl: null,
        },
        invest_company_visit_button: {
          ifShow: true,
          apiUrl: null,
        },
        invest_delete_project: {
          ifShow: true,
          apiUrl: null,
        },
        invest_post_hold_manifestation_list: {
          ifShow: true,
          apiUrl: null,
        },
        bpmn_list_design: {
          ifShow: true,
          apiUrl: null,
        },
        invest_post_financing_add: {
          ifShow: true,
          apiUrl: null,
        },
        statistic_visit_link_list: {
          ifShow: true,
          apiUrl: null,
        },
        invest_raise_investors_addPropel: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_acl_list: {
          ifShow: true,
          apiUrl: null,
        },
        invest_company_batch_claim: {
          ifShow: true,
          apiUrl: null,
        },
        major_update: {
          ifShow: true,
          apiUrl: null,
        },
        invest_post_conference_add: {
          ifShow: true,
          apiUrl: null,
        },
        invest_account_delete: {
          ifShow: true,
          apiUrl: null,
        },
        invest_project_query_invest: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_acl_add: {
          ifShow: true,
          apiUrl: null,
        },
        document_turn_check: {
          ifShow: true,
          apiUrl: null,
        },
        follow_allocation_update: {
          ifShow: true,
          apiUrl: null,
        },
        document_query: {
          ifShow: true,
          apiUrl: null,
        },
        invest_company_invest_detail_list: {
          ifShow: true,
          apiUrl: null,
        },
        bpmn_category_add: {
          ifShow: true,
          apiUrl: null,
        },
        invest_raise_manage_delete_zero: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_dict_update: {
          ifShow: true,
          apiUrl: null,
        },
        document_batch_d_check_src: {
          ifShow: true,
          apiUrl: null,
        },
        invest_post_financing_list: {
          ifShow: true,
          apiUrl: null,
        },
        invest_project_mining_all: {
          ifShow: true,
          apiUrl: null,
        },
        statistic_visit_lp_list: {
          ifShow: true,
          apiUrl: null,
        },
        FUND_STRANSFER: {
          ifShow: true,
          apiUrl: null,
        },
        institute_manage: {
          ifShow: true,
          apiUrl: null,
        },
        invest_exit_phase_update: {
          ifShow: true,
          apiUrl: null,
        },
        lp_update: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_user_delete: {
          ifShow: true,
          apiUrl: null,
        },
        invest_fund_manager_file: {
          ifShow: true,
          apiUrl: null,
        },
        transfer_delete: {
          ifShow: true,
          apiUrl: null,
        },
        invest_company_invest_detail_exit_query: {
          ifShow: true,
          apiUrl: null,
        },
        invest_investorsLib_business: {
          ifShow: true,
          apiUrl: null,
        },
        investors_visit_add: {
          ifShow: true,
          apiUrl: null,
        },
        invest_raise_investor_button: {
          ifShow: true,
          apiUrl: null,
        },
        post_financial_reports_import: {
          ifShow: true,
          apiUrl: null,
        },
        invest_exit_file: {
          ifShow: true,
          apiUrl: null,
        },
        FUND_INVESTMENT_ALLOCATION: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_user_load: {
          ifShow: true,
          apiUrl: null,
        },
        bpmn_list_add: {
          ifShow: true,
          apiUrl: null,
        },
        transfer_update: {
          ifShow: true,
          apiUrl: null,
        },
        invest_company_turned: {
          ifShow: true,
          apiUrl: null,
        },
        invest_post_conference_list: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sub_company_export: {
          ifShow: true,
          apiUrl: null,
        },
        COMPANY_PREINVEST: {
          ifShow: true,
          apiUrl: null,
        },
        invest_company_batch_turn: {
          ifShow: true,
          apiUrl: null,
        },
        invest_investors_library_add: {
          ifShow: true,
          apiUrl: null,
        },
        invest_fund_jurisdiction: {
          ifShow: true,
          apiUrl: null,
        },
        invest_project_log: {
          ifShow: true,
          apiUrl: null,
        },
        invest_company_unturn: {
          ifShow: true,
          apiUrl: null,
        },
        institute_visit_add: {
          ifShow: true,
          apiUrl: null,
        },
        invest_investorsLib_overview: {
          ifShow: true,
          apiUrl: null,
        },
        invest_raise_funder_painIn_button: {
          ifShow: true,
          apiUrl: null,
        },
        otherex_update: {
          ifShow: true,
          apiUrl: null,
        },
        invest_company_view: {
          ifShow: true,
          apiUrl: null,
        },
        invest_app_investor: {
          ifShow: true,
          apiUrl: null,
        },
        invest_post_agreement_date: {
          ifShow: true,
          apiUrl: null,
        },
        invest_fund_delete: {
          ifShow: true,
          apiUrl: null,
        },
        invest_exit_Committee: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_role_user_add: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_user_update: {
          ifShow: true,
          apiUrl: null,
        },
        invest_post_special_update: {
          ifShow: true,
          apiUrl: null,
        },
        invest_exit_SignAgreement: {
          ifShow: true,
          apiUrl: null,
        },
        invest_exit_Evaluation: {
          ifShow: true,
          apiUrl: null,
        },
        document_batch_d_result_warter: {
          ifShow: true,
          apiUrl: null,
        },
        follow_allocation: {
          ifShow: true,
          apiUrl: null,
        },
        invest_company_preinvest: {
          ifShow: true,
          apiUrl: null,
        },
        invest_app_post_contact_all: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_dict_t_view: {
          ifShow: true,
          apiUrl: null,
        },
        post_financing_decide_button: {
          ifShow: true,
          apiUrl: null,
        },
        FUND_FOLLOWALLOCATION: {
          ifShow: true,
          apiUrl: null,
        },
        allocate_Statistic_export: {
          ifShow: true,
          apiUrl: null,
        },
        invest_company_invest_data_list: {
          ifShow: true,
          apiUrl: null,
        },
        invest_exit_delete: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_dict_t_add: {
          ifShow: true,
          apiUrl: null,
        },
        INVEST_PREMEETINGE3: {
          ifShow: true,
          apiUrl: null,
        },
        invest_company_principal_change: {
          ifShow: true,
          apiUrl: null,
        },
        institute_manage_all: {
          ifShow: true,
          apiUrl: null,
        },
        invest_next_step: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_org_add: {
          ifShow: true,
          apiUrl: null,
        },
        invest_exit_query: {
          ifShow: true,
          apiUrl: null,
        },
        invest_company_invest_detail_postfinanc_query: {
          ifShow: true,
          apiUrl: null,
        },
        major_delete: {
          ifShow: true,
          apiUrl: null,
        },
        invest_post_visit_list: {
          ifShow: true,
          apiUrl: null,
        },
        invest_project_mining_recommend: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_dict_t_list: {
          ifShow: true,
          apiUrl: null,
        },
        liquidation_add: {
          ifShow: true,
          apiUrl: null,
        },
        invest_exit_computed: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_log_list: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_dict_add: {
          ifShow: true,
          apiUrl: null,
        },
        bpmn_category_delete: {
          ifShow: true,
          apiUrl: null,
        },
        invest_fund_view_portfolio: {
          ifShow: true,
          apiUrl: null,
        },
        project_panoramic_technology: {
          ifShow: true,
          apiUrl: null,
        },
        invest_company_post_button: {
          ifShow: true,
          apiUrl: null,
        },
        otherin_add: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_log_view: {
          ifShow: true,
          apiUrl: null,
        },
        invest_create_approval: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_role_data_acl: {
          ifShow: true,
          apiUrl: null,
        },
        otherex_add: {
          ifShow: true,
          apiUrl: null,
        },
        arch_Statistic_export: {
          ifShow: true,
          apiUrl: null,
        },
        allocation_detail_delete: {
          ifShow: true,
          apiUrl: null,
        },
        investment_list: {
          ifShow: true,
          apiUrl: null,
        },
        exit_file_log: {
          ifShow: true,
          apiUrl: null,
        },
        invest_Grant: {
          ifShow: true,
          apiUrl: null,
        },
        document_logger_button: {
          ifShow: true,
          apiUrl: null,
        },
        invest_investors_library_list: {
          ifShow: true,
          apiUrl: null,
        },
        invest_investors_library_view: {
          ifShow: true,
          apiUrl: null,
        },
        otherex_delete: {
          ifShow: true,
          apiUrl: null,
        },
        completeInvestment_list: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_dict_list: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_org_deluser: {
          ifShow: true,
          apiUrl: null,
        },
        INVEST_PREMEETING1: {
          ifShow: true,
          apiUrl: null,
        },
        invest_exit_add: {
          ifShow: true,
          apiUrl: null,
        },
        invest_app_company_query: {
          ifShow: true,
          apiUrl: null,
        },
        invest_company_overview_button: {
          ifShow: true,
          apiUrl: null,
        },
        invest_exit_stop: {
          ifShow: true,
          apiUrl: null,
        },
        invest_invest_log: {
          ifShow: true,
          apiUrl: null,
        },
        INVEST_AGREEMENT_SIGNED: {
          ifShow: true,
          apiUrl: null,
        },
        partner_detail: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_acl_delete: {
          ifShow: true,
          apiUrl: null,
        },
        invest_Change: {
          ifShow: true,
          apiUrl: null,
        },
        balance_delete: {
          ifShow: true,
          apiUrl: null,
        },
        invest_post_accredit_list: {
          ifShow: true,
          apiUrl: null,
        },
        invest_fund_manager_deleteBatch: {
          ifShow: true,
          apiUrl: null,
        },
        institute_manage_update_log: {
          ifShow: true,
          apiUrl: null,
        },
        lp_deleted: {
          ifShow: true,
          apiUrl: null,
        },
        INVEST_PREMEETING3: {
          ifShow: true,
          apiUrl: null,
        },
        INVEST_PREMEETING2: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_dict_view: {
          ifShow: true,
          apiUrl: null,
        },
        allocation_capitalAccountLine: {
          ifShow: true,
          apiUrl: null,
        },
        major_add: {
          ifShow: true,
          apiUrl: null,
        },
        invest_post_conference_update: {
          ifShow: true,
          apiUrl: null,
        },
        invest_post_visit_update: {
          ifShow: true,
          apiUrl: null,
        },
        invest_raise_history_button: {
          ifShow: true,
          apiUrl: null,
        },
        invest_fund_operations_lp_update: {
          ifShow: true,
          apiUrl: null,
        },
        invest_kpi_manage: {
          ifShow: true,
          apiUrl: null,
        },
        lp_add: {
          ifShow: true,
          apiUrl: null,
        },
        invest_company_update: {
          ifShow: true,
          apiUrl: null,
        },
        INVEST_IGATION1: {
          ifShow: true,
          apiUrl: null,
        },
        INVEST_IGATION2: {
          ifShow: true,
          apiUrl: null,
        },
        project_panoramic_view_details: {
          ifShow: true,
          apiUrl: null,
        },
        otherin_detail: {
          ifShow: true,
          apiUrl: null,
        },
        invest_post_runReports_add: {
          ifShow: true,
          apiUrl: null,
        },
        invest_raise_investors_deleteBatch: {
          ifShow: true,
          apiUrl: null,
        },
        invest_project_mining_person: {
          ifShow: true,
          apiUrl: null,
        },
        statistic_visit_post_list: {
          ifShow: true,
          apiUrl: null,
        },
        invest_raise_investors_propelList: {
          ifShow: true,
          apiUrl: null,
        },
        invest_Evaluation: {
          ifShow: true,
          apiUrl: null,
        },
        invest_fund_view_business: {
          ifShow: true,
          apiUrl: null,
        },
        company_all_list: {
          ifShow: true,
          apiUrl: null,
        },
        invest_company_portfolio_button: {
          ifShow: true,
          apiUrl: null,
        },
        invest_company_preinvest_add: {
          ifShow: true,
          apiUrl: null,
        },
        EXIT_INTERNAL_COMMITTE: {
          ifShow: true,
          apiUrl: null,
        },
        invest_project_mining_my: {
          ifShow: true,
          apiUrl: null,
        },
        invest_exit_account_add: {
          ifShow: true,
          apiUrl: null,
        },
        invest_raise_manage_add_first: {
          ifShow: true,
          apiUrl: null,
        },
        investors_details_visit: {
          ifShow: true,
          apiUrl: null,
        },
        invest_raise_manage_list: {
          ifShow: true,
          apiUrl: null,
        },
        invest_post_file: {
          ifShow: true,
          apiUrl: null,
        },
        invest_company_turnning: {
          ifShow: true,
          apiUrl: null,
        },
        invest_raise_investors_updatePropel: {
          ifShow: true,
          apiUrl: null,
        },
        invest_investors_library_cooperation_data: {
          ifShow: true,
          apiUrl: null,
        },
        invest_raise_manage_delete_first: {
          ifShow: true,
          apiUrl: null,
        },
        invest_bind_user_feishu: {
          ifShow: true,
          apiUrl: null,
        },
        follow_allocation_delete: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_user_add: {
          ifShow: true,
          apiUrl: null,
        },
        invest_investors_batch_delete: {
          ifShow: true,
          apiUrl: null,
        },
        invest_fund_operations_major_list: {
          ifShow: true,
          apiUrl: null,
        },
        invest_fund_manager_update: {
          ifShow: true,
          apiUrl: null,
        },
        invest_Survey: {
          ifShow: true,
          apiUrl: null,
        },
        invest_fund_view_file: {
          ifShow: true,
          apiUrl: null,
        },
        POST_REFINANCING_APPROVAL: {
          ifShow: true,
          apiUrl: null,
        },
        invest_raise_manage_update_first: {
          ifShow: true,
          apiUrl: null,
        },
        otherin_update: {
          ifShow: true,
          apiUrl: null,
        },
        invest_fund_view_operation: {
          ifShow: true,
          apiUrl: null,
        },
        invest_app_project_discover: {
          ifShow: true,
          apiUrl: null,
        },
        invest_post_approve: {
          ifShow: true,
          apiUrl: null,
        },
        invest_raise_manage_investors_list: {
          ifShow: true,
          apiUrl: null,
        },
        invest_sys_role_update: {
          ifShow: true,
          apiUrl: null,
        },
      }
      // state.components.TaFile.fileActionUpload = {
      //   ...state.components.TaFile.fileActionUpload,
      //   accpet: '*',
      // }
      // console.log(state)
    }, 3000)

    async function fetchUploadVars() {
      const { data, success } = await taUploadProvideData.uploadEditorImageVars()
      if (data && success) {
        state.uploadVarsJson = JSON.stringify(data)
      } else {
        state.uploadVarsJson = '{}'
      }
    }

    fetchUploadVars()
    onMounted(async () => {
      // const { setWatermark } = useWatermark({ color: 'red', size: { width: 320, height: 150 } })
      // setWatermark('系统管理员9999')
      setInterval(
        () => {
          fetchUploadVars()
        },
        1000 * 60 * 5
        // 1000 * 30
      )
    })

    return {
      zhCN,
      state,
    }
  },
})
</script>

<template>
  <TaConfigProvider
    :app-id="state.appId"
    :user-info="state.userInfo"
    :permissions="state.permissions"
    :components="state.components"
    :i18n-fun="state.i18nFun"
    :upload-vars-json="state.uploadVarsJson"
  >
    <ConfigProvider :locale="zhCN">
      <router-view v-slot="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </router-view>
    </ConfigProvider>
  </TaConfigProvider>
</template>
