export interface AddressOption {
  label: string
  /** 唯一标识 */
  value: string | number
  [key: string]: any
  children?: AddressOption[]
}
// 省/市
export const ProvinceCityOptions: AddressOption[] = [
  {
    value: '110000',
    label: '北京',
    children: [
      {
        value: '110000',
        label: '北京市',
        children: [
          {
            value: '110101',
            label: '东城区',
          },
          {
            value: '110102',
            label: '西城区',
          },
          {
            value: '110105',
            label: '朝阳区',
          },
          {
            value: '110106',
            label: '丰台区',
          },
          {
            value: '110107',
            label: '石景山区',
          },
          {
            value: '110108',
            label: '海淀区',
          },
          {
            value: '110109',
            label: '门头沟区',
          },
          {
            value: '110111',
            label: '房山区',
          },
          {
            value: '110112',
            label: '通州区',
          },
          {
            value: '110113',
            label: '顺义区',
          },
          {
            value: '110114',
            label: '昌平区',
          },
          {
            value: '110115',
            label: '大兴区',
          },
          {
            value: '110116',
            label: '怀柔区',
          },
          {
            value: '110117',
            label: '平谷区',
          },
          {
            value: '110118',
            label: '密云区',
          },
          {
            value: '110119',
            label: '延庆区',
          },
        ],
      },
    ],
  },
  {
    value: '120000',
    label: '天津',
    children: [
      {
        value: '120000',
        label: '天津市',
        children: [
          {
            value: '120101',
            label: '和平区',
          },
          {
            value: '120102',
            label: '河东区',
          },
          {
            value: '120103',
            label: '河西区',
          },
          {
            value: '120104',
            label: '南开区',
          },
          {
            value: '120105',
            label: '河北区',
          },
          {
            value: '120106',
            label: '红桥区',
          },
          {
            value: '120110',
            label: '东丽区',
          },
          {
            value: '120111',
            label: '西青区',
          },
          {
            value: '120112',
            label: '津南区',
          },
          {
            value: '120113',
            label: '北辰区',
          },
          {
            value: '120114',
            label: '武清区',
          },
          {
            value: '120115',
            label: '宝坻区',
          },
          {
            value: '120116',
            label: '滨海新区',
          },
          {
            value: '120117',
            label: '宁河区',
          },
          {
            value: '120118',
            label: '静海区',
          },
          {
            value: '120119',
            label: '蓟州区',
          },
        ],
      },
    ],
  },
  {
    value: '130000',
    label: '河北省',
    children: [
      {
        value: '130100',
        label: '石家庄市',
        children: [
          {
            value: '130102',
            label: '长安区',
          },
          {
            value: '130104',
            label: '桥西区',
          },
          {
            value: '130105',
            label: '新华区',
          },
          {
            value: '130107',
            label: '井陉矿区',
          },
          {
            value: '130108',
            label: '裕华区',
          },
          {
            value: '130109',
            label: '藁城区',
          },
          {
            value: '130110',
            label: '鹿泉区',
          },
          {
            value: '130111',
            label: '栾城区',
          },
          {
            value: '130121',
            label: '井陉县',
          },
          {
            value: '130123',
            label: '正定县',
          },
          {
            value: '130125',
            label: '行唐县',
          },
          {
            value: '130126',
            label: '灵寿县',
          },
          {
            value: '130127',
            label: '高邑县',
          },
          {
            value: '130128',
            label: '深泽县',
          },
          {
            value: '130129',
            label: '赞皇县',
          },
          {
            value: '130130',
            label: '无极县',
          },
          {
            value: '130131',
            label: '平山县',
          },
          {
            value: '130132',
            label: '元氏县',
          },
          {
            value: '130133',
            label: '赵县',
          },
          {
            value: '130181',
            label: '辛集市',
          },
          {
            value: '130183',
            label: '晋州市',
          },
          {
            value: '130184',
            label: '新乐市',
          },
        ],
      },
      {
        value: '130200',
        label: '唐山市',
        children: [
          {
            value: '130202',
            label: '路南区',
          },
          {
            value: '130203',
            label: '路北区',
          },
          {
            value: '130204',
            label: '古冶区',
          },
          {
            value: '130205',
            label: '开平区',
          },
          {
            value: '130207',
            label: '丰南区',
          },
          {
            value: '130208',
            label: '丰润区',
          },
          {
            value: '130209',
            label: '曹妃甸区',
          },
          {
            value: '130223',
            label: '滦县',
          },
          {
            value: '130224',
            label: '滦南县',
          },
          {
            value: '130225',
            label: '乐亭县',
          },
          {
            value: '130227',
            label: '迁西县',
          },
          {
            value: '130229',
            label: '玉田县',
          },
          {
            value: '130281',
            label: '遵化市',
          },
          {
            value: '130283',
            label: '迁安市',
          },
        ],
      },
      {
        value: '130300',
        label: '秦皇岛市',
        children: [
          {
            value: '130302',
            label: '海港区',
          },
          {
            value: '130303',
            label: '山海关区',
          },
          {
            value: '130304',
            label: '北戴河区',
          },
          {
            value: '130306',
            label: '抚宁区',
          },
          {
            value: '130321',
            label: '青龙满族自治县',
          },
          {
            value: '130322',
            label: '昌黎县',
          },
          {
            value: '130324',
            label: '卢龙县',
          },
        ],
      },
      {
        value: '130400',
        label: '邯郸市',
        children: [
          {
            value: '130402',
            label: '邯山区',
          },
          {
            value: '130403',
            label: '丛台区',
          },
          {
            value: '130404',
            label: '复兴区',
          },
          {
            value: '130406',
            label: '峰峰矿区',
          },
          {
            value: '130407',
            label: '肥乡区',
          },
          {
            value: '130408',
            label: '永年区',
          },
          {
            value: '130423',
            label: '临漳县',
          },
          {
            value: '130424',
            label: '成安县',
          },
          {
            value: '130425',
            label: '大名县',
          },
          {
            value: '130426',
            label: '涉县',
          },
          {
            value: '130427',
            label: '磁县',
          },
          {
            value: '130430',
            label: '邱县',
          },
          {
            value: '130431',
            label: '鸡泽县',
          },
          {
            value: '130432',
            label: '广平县',
          },
          {
            value: '130433',
            label: '馆陶县',
          },
          {
            value: '130434',
            label: '魏县',
          },
          {
            value: '130435',
            label: '曲周县',
          },
          {
            value: '130481',
            label: '武安市',
          },
        ],
      },
      {
        value: '130500',
        label: '邢台市',
        children: [
          {
            value: '130502',
            label: '桥东区',
          },
          {
            value: '130503',
            label: '桥西区',
          },
          {
            value: '130521',
            label: '邢台县',
          },
          {
            value: '130522',
            label: '临城县',
          },
          {
            value: '130523',
            label: '内丘县',
          },
          {
            value: '130524',
            label: '柏乡县',
          },
          {
            value: '130525',
            label: '隆尧县',
          },
          {
            value: '130526',
            label: '任县',
          },
          {
            value: '130527',
            label: '南和县',
          },
          {
            value: '130528',
            label: '宁晋县',
          },
          {
            value: '130529',
            label: '巨鹿县',
          },
          {
            value: '130530',
            label: '新河县',
          },
          {
            value: '130531',
            label: '广宗县',
          },
          {
            value: '130532',
            label: '平乡县',
          },
          {
            value: '130533',
            label: '威县',
          },
          {
            value: '130534',
            label: '清河县',
          },
          {
            value: '130535',
            label: '临西县',
          },
          {
            value: '130581',
            label: '南宫市',
          },
          {
            value: '130582',
            label: '沙河市',
          },
        ],
      },
      {
        value: '130600',
        label: '保定市',
        children: [
          {
            value: '130602',
            label: '竞秀区',
          },
          {
            value: '130606',
            label: '莲池区',
          },
          {
            value: '130607',
            label: '满城区',
          },
          {
            value: '130608',
            label: '清苑区',
          },
          {
            value: '130609',
            label: '徐水区',
          },
          {
            value: '130623',
            label: '涞水县',
          },
          {
            value: '130624',
            label: '阜平县',
          },
          {
            value: '130626',
            label: '定兴县',
          },
          {
            value: '130627',
            label: '唐县',
          },
          {
            value: '130628',
            label: '高阳县',
          },
          {
            value: '130629',
            label: '容城县',
          },
          {
            value: '130630',
            label: '涞源县',
          },
          {
            value: '130631',
            label: '望都县',
          },
          {
            value: '130632',
            label: '安新县',
          },
          {
            value: '130633',
            label: '易县',
          },
          {
            value: '130634',
            label: '曲阳县',
          },
          {
            value: '130635',
            label: '蠡县',
          },
          {
            value: '130636',
            label: '顺平县',
          },
          {
            value: '130637',
            label: '博野县',
          },
          {
            value: '130638',
            label: '雄县',
          },
          {
            value: '130681',
            label: '涿州市',
          },
          {
            value: '130682',
            label: '定州市',
          },
          {
            value: '130683',
            label: '安国市',
          },
          {
            value: '130684',
            label: '高碑店市',
          },
        ],
      },
      {
        value: '130700',
        label: '张家口市',
        children: [
          {
            value: '130702',
            label: '桥东区',
          },
          {
            value: '130703',
            label: '桥西区',
          },
          {
            value: '130705',
            label: '宣化区',
          },
          {
            value: '130706',
            label: '下花园区',
          },
          {
            value: '130708',
            label: '万全区',
          },
          {
            value: '130709',
            label: '崇礼区',
          },
          {
            value: '130722',
            label: '张北县',
          },
          {
            value: '130723',
            label: '康保县',
          },
          {
            value: '130724',
            label: '沽源县',
          },
          {
            value: '130725',
            label: '尚义县',
          },
          {
            value: '130726',
            label: '蔚县',
          },
          {
            value: '130727',
            label: '阳原县',
          },
          {
            value: '130728',
            label: '怀安县',
          },
          {
            value: '130730',
            label: '怀来县',
          },
          {
            value: '130731',
            label: '涿鹿县',
          },
          {
            value: '130732',
            label: '赤城县',
          },
        ],
      },
      {
        value: '130800',
        label: '承德市',
        children: [
          {
            value: '130802',
            label: '双桥区',
          },
          {
            value: '130803',
            label: '双滦区',
          },
          {
            value: '130804',
            label: '鹰手营子矿区',
          },
          {
            value: '130821',
            label: '承德县',
          },
          {
            value: '130822',
            label: '兴隆县',
          },
          {
            value: '130824',
            label: '滦平县',
          },
          {
            value: '130825',
            label: '隆化县',
          },
          {
            value: '130826',
            label: '丰宁满族自治县',
          },
          {
            value: '130827',
            label: '宽城满族自治县',
          },
          {
            value: '130828',
            label: '围场满族蒙古族自治县',
          },
          {
            value: '130881',
            label: '平泉市',
          },
        ],
      },
      {
        value: '130900',
        label: '沧州市',
        children: [
          {
            value: '130902',
            label: '新华区',
          },
          {
            value: '130903',
            label: '运河区',
          },
          {
            value: '130921',
            label: '沧县',
          },
          {
            value: '130922',
            label: '青县',
          },
          {
            value: '130923',
            label: '东光县',
          },
          {
            value: '130924',
            label: '海兴县',
          },
          {
            value: '130925',
            label: '盐山县',
          },
          {
            value: '130926',
            label: '肃宁县',
          },
          {
            value: '130927',
            label: '南皮县',
          },
          {
            value: '130928',
            label: '吴桥县',
          },
          {
            value: '130929',
            label: '献县',
          },
          {
            value: '130930',
            label: '孟村回族自治县',
          },
          {
            value: '130981',
            label: '泊头市',
          },
          {
            value: '130982',
            label: '任丘市',
          },
          {
            value: '130983',
            label: '黄骅市',
          },
          {
            value: '130984',
            label: '河间市',
          },
        ],
      },
      {
        value: '131000',
        label: '廊坊市',
        children: [
          {
            value: '131002',
            label: '安次区',
          },
          {
            value: '131003',
            label: '广阳区',
          },
          {
            value: '131022',
            label: '固安县',
          },
          {
            value: '131023',
            label: '永清县',
          },
          {
            value: '131024',
            label: '香河县',
          },
          {
            value: '131025',
            label: '大城县',
          },
          {
            value: '131026',
            label: '文安县',
          },
          {
            value: '131028',
            label: '大厂回族自治县',
          },
          {
            value: '131081',
            label: '霸州市',
          },
          {
            value: '131082',
            label: '三河市',
          },
        ],
      },
      {
        value: '131100',
        label: '衡水市',
        children: [
          {
            value: '131102',
            label: '桃城区',
          },
          {
            value: '131103',
            label: '冀州区',
          },
          {
            value: '131121',
            label: '枣强县',
          },
          {
            value: '131122',
            label: '武邑县',
          },
          {
            value: '131123',
            label: '武强县',
          },
          {
            value: '131124',
            label: '饶阳县',
          },
          {
            value: '131125',
            label: '安平县',
          },
          {
            value: '131126',
            label: '故城县',
          },
          {
            value: '131127',
            label: '景县',
          },
          {
            value: '131128',
            label: '阜城县',
          },
          {
            value: '131182',
            label: '深州市',
          },
        ],
      },
    ],
  },
  {
    value: '140000',
    label: '山西省',
    children: [
      {
        value: '140100',
        label: '太原市',
        children: [
          {
            value: '140105',
            label: '小店区',
          },
          {
            value: '140106',
            label: '迎泽区',
          },
          {
            value: '140107',
            label: '杏花岭区',
          },
          {
            value: '140108',
            label: '尖草坪区',
          },
          {
            value: '140109',
            label: '万柏林区',
          },
          {
            value: '140110',
            label: '晋源区',
          },
          {
            value: '140121',
            label: '清徐县',
          },
          {
            value: '140122',
            label: '阳曲县',
          },
          {
            value: '140123',
            label: '娄烦县',
          },
          {
            value: '140181',
            label: '古交市',
          },
        ],
      },
      {
        value: '140200',
        label: '大同市',
        children: [
          {
            value: '140212',
            label: '新荣区',
          },
          {
            value: '140213',
            label: '平城区',
          },
          {
            value: '140214',
            label: '云冈区',
          },
          {
            value: '140215',
            label: '云州区',
          },
          {
            value: '140221',
            label: '阳高县',
          },
          {
            value: '140222',
            label: '天镇县',
          },
          {
            value: '140223',
            label: '广灵县',
          },
          {
            value: '140224',
            label: '灵丘县',
          },
          {
            value: '140225',
            label: '浑源县',
          },
          {
            value: '140226',
            label: '左云县',
          },
        ],
      },
      {
        value: '140300',
        label: '阳泉市',
        children: [
          {
            value: '140302',
            label: '城区',
          },
          {
            value: '140303',
            label: '矿区',
          },
          {
            value: '140311',
            label: '郊区',
          },
          {
            value: '140321',
            label: '平定县',
          },
          {
            value: '140322',
            label: '盂县',
          },
        ],
      },
      {
        value: '140400',
        label: '长治市',
        children: [
          {
            value: '140402',
            label: '城区',
          },
          {
            value: '140411',
            label: '郊区',
          },
          {
            value: '140421',
            label: '长治县',
          },
          {
            value: '140423',
            label: '襄垣县',
          },
          {
            value: '140424',
            label: '屯留县',
          },
          {
            value: '140425',
            label: '平顺县',
          },
          {
            value: '140426',
            label: '黎城县',
          },
          {
            value: '140427',
            label: '壶关县',
          },
          {
            value: '140428',
            label: '长子县',
          },
          {
            value: '140429',
            label: '武乡县',
          },
          {
            value: '140430',
            label: '沁县',
          },
          {
            value: '140431',
            label: '沁源县',
          },
          {
            value: '140481',
            label: '潞城市',
          },
        ],
      },
      {
        value: '140500',
        label: '晋城市',
        children: [
          {
            value: '140502',
            label: '城区',
          },
          {
            value: '140521',
            label: '沁水县',
          },
          {
            value: '140522',
            label: '阳城县',
          },
          {
            value: '140524',
            label: '陵川县',
          },
          {
            value: '140525',
            label: '泽州县',
          },
          {
            value: '140581',
            label: '高平市',
          },
        ],
      },
      {
        value: '140600',
        label: '朔州市',
        children: [
          {
            value: '140602',
            label: '朔城区',
          },
          {
            value: '140603',
            label: '平鲁区',
          },
          {
            value: '140621',
            label: '山阴县',
          },
          {
            value: '140622',
            label: '应县',
          },
          {
            value: '140623',
            label: '右玉县',
          },
          {
            value: '140681',
            label: '怀仁市',
          },
        ],
      },
      {
        value: '140700',
        label: '晋中市',
        children: [
          {
            value: '140702',
            label: '榆次区',
          },
          {
            value: '140721',
            label: '榆社县',
          },
          {
            value: '140722',
            label: '左权县',
          },
          {
            value: '140723',
            label: '和顺县',
          },
          {
            value: '140724',
            label: '昔阳县',
          },
          {
            value: '140725',
            label: '寿阳县',
          },
          {
            value: '140726',
            label: '太谷县',
          },
          {
            value: '140727',
            label: '祁县',
          },
          {
            value: '140728',
            label: '平遥县',
          },
          {
            value: '140729',
            label: '灵石县',
          },
          {
            value: '140781',
            label: '介休市',
          },
        ],
      },
      {
        value: '140800',
        label: '运城市',
        children: [
          {
            value: '140802',
            label: '盐湖区',
          },
          {
            value: '140821',
            label: '临猗县',
          },
          {
            value: '140822',
            label: '万荣县',
          },
          {
            value: '140823',
            label: '闻喜县',
          },
          {
            value: '140824',
            label: '稷山县',
          },
          {
            value: '140825',
            label: '新绛县',
          },
          {
            value: '140826',
            label: '绛县',
          },
          {
            value: '140827',
            label: '垣曲县',
          },
          {
            value: '140828',
            label: '夏县',
          },
          {
            value: '140829',
            label: '平陆县',
          },
          {
            value: '140830',
            label: '芮城县',
          },
          {
            value: '140881',
            label: '永济市',
          },
          {
            value: '140882',
            label: '河津市',
          },
        ],
      },
      {
        value: '140900',
        label: '忻州市',
        children: [
          {
            value: '140902',
            label: '忻府区',
          },
          {
            value: '140921',
            label: '定襄县',
          },
          {
            value: '140922',
            label: '五台县',
          },
          {
            value: '140923',
            label: '代县',
          },
          {
            value: '140924',
            label: '繁峙县',
          },
          {
            value: '140925',
            label: '宁武县',
          },
          {
            value: '140926',
            label: '静乐县',
          },
          {
            value: '140927',
            label: '神池县',
          },
          {
            value: '140928',
            label: '五寨县',
          },
          {
            value: '140929',
            label: '岢岚县',
          },
          {
            value: '140930',
            label: '河曲县',
          },
          {
            value: '140931',
            label: '保德县',
          },
          {
            value: '140932',
            label: '偏关县',
          },
          {
            value: '140981',
            label: '原平市',
          },
        ],
      },
      {
        value: '141000',
        label: '临汾市',
        children: [
          {
            value: '141002',
            label: '尧都区',
          },
          {
            value: '141021',
            label: '曲沃县',
          },
          {
            value: '141022',
            label: '翼城县',
          },
          {
            value: '141023',
            label: '襄汾县',
          },
          {
            value: '141024',
            label: '洪洞县',
          },
          {
            value: '141025',
            label: '古县',
          },
          {
            value: '141026',
            label: '安泽县',
          },
          {
            value: '141027',
            label: '浮山县',
          },
          {
            value: '141028',
            label: '吉县',
          },
          {
            value: '141029',
            label: '乡宁县',
          },
          {
            value: '141030',
            label: '大宁县',
          },
          {
            value: '141031',
            label: '隰县',
          },
          {
            value: '141032',
            label: '永和县',
          },
          {
            value: '141033',
            label: '蒲县',
          },
          {
            value: '141034',
            label: '汾西县',
          },
          {
            value: '141081',
            label: '侯马市',
          },
          {
            value: '141082',
            label: '霍州市',
          },
        ],
      },
      {
        value: '141100',
        label: '吕梁市',
        children: [
          {
            value: '141102',
            label: '离石区',
          },
          {
            value: '141121',
            label: '文水县',
          },
          {
            value: '141122',
            label: '交城县',
          },
          {
            value: '141123',
            label: '兴县',
          },
          {
            value: '141124',
            label: '临县',
          },
          {
            value: '141125',
            label: '柳林县',
          },
          {
            value: '141126',
            label: '石楼县',
          },
          {
            value: '141127',
            label: '岚县',
          },
          {
            value: '141128',
            label: '方山县',
          },
          {
            value: '141129',
            label: '中阳县',
          },
          {
            value: '141130',
            label: '交口县',
          },
          {
            value: '141181',
            label: '孝义市',
          },
          {
            value: '141182',
            label: '汾阳市',
          },
        ],
      },
    ],
  },
  {
    value: '150000',
    label: '内蒙古自治区',
    children: [
      {
        value: '150100',
        label: '呼和浩特市',
        children: [
          {
            value: '150102',
            label: '新城区',
          },
          {
            value: '150103',
            label: '回民区',
          },
          {
            value: '150104',
            label: '玉泉区',
          },
          {
            value: '150105',
            label: '赛罕区',
          },
          {
            value: '150121',
            label: '土默特左旗',
          },
          {
            value: '150122',
            label: '托克托县',
          },
          {
            value: '150123',
            label: '和林格尔县',
          },
          {
            value: '150124',
            label: '清水河县',
          },
          {
            value: '150125',
            label: '武川县',
          },
        ],
      },
      {
        value: '150200',
        label: '包头市',
        children: [
          {
            value: '150202',
            label: '东河区',
          },
          {
            value: '150203',
            label: '昆都仑区',
          },
          {
            value: '150204',
            label: '青山区',
          },
          {
            value: '150205',
            label: '石拐区',
          },
          {
            value: '150206',
            label: '白云鄂博矿区',
          },
          {
            value: '150207',
            label: '九原区',
          },
          {
            value: '150221',
            label: '土默特右旗',
          },
          {
            value: '150222',
            label: '固阳县',
          },
          {
            value: '150223',
            label: '达尔罕茂明安联合旗',
          },
        ],
      },
      {
        value: '150300',
        label: '乌海市',
        children: [
          {
            value: '150302',
            label: '海勃湾区',
          },
          {
            value: '150303',
            label: '海南区',
          },
          {
            value: '150304',
            label: '乌达区',
          },
        ],
      },
      {
        value: '150400',
        label: '赤峰市',
        children: [
          {
            value: '150402',
            label: '红山区',
          },
          {
            value: '150403',
            label: '元宝山区',
          },
          {
            value: '150404',
            label: '松山区',
          },
          {
            value: '150421',
            label: '阿鲁科尔沁旗',
          },
          {
            value: '150422',
            label: '巴林左旗',
          },
          {
            value: '150423',
            label: '巴林右旗',
          },
          {
            value: '150424',
            label: '林西县',
          },
          {
            value: '150425',
            label: '克什克腾旗',
          },
          {
            value: '150426',
            label: '翁牛特旗',
          },
          {
            value: '150428',
            label: '喀喇沁旗',
          },
          {
            value: '150429',
            label: '宁城县',
          },
          {
            value: '150430',
            label: '敖汉旗',
          },
        ],
      },
      {
        value: '150500',
        label: '通辽市',
        children: [
          {
            value: '150502',
            label: '科尔沁区',
          },
          {
            value: '150521',
            label: '科尔沁左翼中旗',
          },
          {
            value: '150522',
            label: '科尔沁左翼后旗',
          },
          {
            value: '150523',
            label: '开鲁县',
          },
          {
            value: '150524',
            label: '库伦旗',
          },
          {
            value: '150525',
            label: '奈曼旗',
          },
          {
            value: '150526',
            label: '扎鲁特旗',
          },
          {
            value: '150581',
            label: '霍林郭勒市',
          },
        ],
      },
      {
        value: '150600',
        label: '鄂尔多斯市',
        children: [
          {
            value: '150602',
            label: '东胜区',
          },
          {
            value: '150603',
            label: '康巴什区',
          },
          {
            value: '150621',
            label: '达拉特旗',
          },
          {
            value: '150622',
            label: '准格尔旗',
          },
          {
            value: '150623',
            label: '鄂托克前旗',
          },
          {
            value: '150624',
            label: '鄂托克旗',
          },
          {
            value: '150625',
            label: '杭锦旗',
          },
          {
            value: '150626',
            label: '乌审旗',
          },
          {
            value: '150627',
            label: '伊金霍洛旗',
          },
        ],
      },
      {
        value: '150700',
        label: '呼伦贝尔市',
        children: [
          {
            value: '150702',
            label: '海拉尔区',
          },
          {
            value: '150703',
            label: '扎赉诺尔区',
          },
          {
            value: '150721',
            label: '阿荣旗',
          },
          {
            value: '150722',
            label: '莫力达瓦达斡尔族自治旗',
          },
          {
            value: '150723',
            label: '鄂伦春自治旗',
          },
          {
            value: '150724',
            label: '鄂温克族自治旗',
          },
          {
            value: '150725',
            label: '陈巴尔虎旗',
          },
          {
            value: '150726',
            label: '新巴尔虎左旗',
          },
          {
            value: '150727',
            label: '新巴尔虎右旗',
          },
          {
            value: '150781',
            label: '满洲里市',
          },
          {
            value: '150782',
            label: '牙克石市',
          },
          {
            value: '150783',
            label: '扎兰屯市',
          },
          {
            value: '150784',
            label: '额尔古纳市',
          },
          {
            value: '150785',
            label: '根河市',
          },
        ],
      },
      {
        value: '150800',
        label: '巴彦淖尔市',
        children: [
          {
            value: '150802',
            label: '临河区',
          },
          {
            value: '150821',
            label: '五原县',
          },
          {
            value: '150822',
            label: '磴口县',
          },
          {
            value: '150823',
            label: '乌拉特前旗',
          },
          {
            value: '150824',
            label: '乌拉特中旗',
          },
          {
            value: '150825',
            label: '乌拉特后旗',
          },
          {
            value: '150826',
            label: '杭锦后旗',
          },
        ],
      },
      {
        value: '150900',
        label: '乌兰察布市',
        children: [
          {
            value: '150902',
            label: '集宁区',
          },
          {
            value: '150921',
            label: '卓资县',
          },
          {
            value: '150922',
            label: '化德县',
          },
          {
            value: '150923',
            label: '商都县',
          },
          {
            value: '150924',
            label: '兴和县',
          },
          {
            value: '150925',
            label: '凉城县',
          },
          {
            value: '150926',
            label: '察哈尔右翼前旗',
          },
          {
            value: '150927',
            label: '察哈尔右翼中旗',
          },
          {
            value: '150928',
            label: '察哈尔右翼后旗',
          },
          {
            value: '150929',
            label: '四子王旗',
          },
          {
            value: '150981',
            label: '丰镇市',
          },
        ],
      },
      {
        value: '152200',
        label: '兴安盟',
        children: [
          {
            value: '152201',
            label: '乌兰浩特市',
          },
          {
            value: '152202',
            label: '阿尔山市',
          },
          {
            value: '152221',
            label: '科尔沁右翼前旗',
          },
          {
            value: '152222',
            label: '科尔沁右翼中旗',
          },
          {
            value: '152223',
            label: '扎赉特旗',
          },
          {
            value: '152224',
            label: '突泉县',
          },
        ],
      },
      {
        value: '152500',
        label: '锡林郭勒盟',
        children: [
          {
            value: '152501',
            label: '二连浩特市',
          },
          {
            value: '152502',
            label: '锡林浩特市',
          },
          {
            value: '152522',
            label: '阿巴嘎旗',
          },
          {
            value: '152523',
            label: '苏尼特左旗',
          },
          {
            value: '152524',
            label: '苏尼特右旗',
          },
          {
            value: '152525',
            label: '东乌珠穆沁旗',
          },
          {
            value: '152526',
            label: '西乌珠穆沁旗',
          },
          {
            value: '152527',
            label: '太仆寺旗',
          },
          {
            value: '152528',
            label: '镶黄旗',
          },
          {
            value: '152529',
            label: '正镶白旗',
          },
          {
            value: '152530',
            label: '正蓝旗',
          },
          {
            value: '152531',
            label: '多伦县',
          },
        ],
      },
      {
        value: '152900',
        label: '阿拉善盟',
        children: [
          {
            value: '152921',
            label: '阿拉善左旗',
          },
          {
            value: '152922',
            label: '阿拉善右旗',
          },
          {
            value: '152923',
            label: '额济纳旗',
          },
        ],
      },
    ],
  },
  {
    value: '210000',
    label: '辽宁省',
    children: [
      {
        value: '210100',
        label: '沈阳市',
        children: [
          {
            value: '210102',
            label: '和平区',
          },
          {
            value: '210103',
            label: '沈河区',
          },
          {
            value: '210104',
            label: '大东区',
          },
          {
            value: '210105',
            label: '皇姑区',
          },
          {
            value: '210106',
            label: '铁西区',
          },
          {
            value: '210111',
            label: '苏家屯区',
          },
          {
            value: '210112',
            label: '浑南区',
          },
          {
            value: '210113',
            label: '沈北新区',
          },
          {
            value: '210114',
            label: '于洪区',
          },
          {
            value: '210115',
            label: '辽中区',
          },
          {
            value: '210123',
            label: '康平县',
          },
          {
            value: '210124',
            label: '法库县',
          },
          {
            value: '210181',
            label: '新民市',
          },
        ],
      },
      {
        value: '210200',
        label: '大连市',
        children: [
          {
            value: '210202',
            label: '中山区',
          },
          {
            value: '210203',
            label: '西岗区',
          },
          {
            value: '210204',
            label: '沙河口区',
          },
          {
            value: '210211',
            label: '甘井子区',
          },
          {
            value: '210212',
            label: '旅顺口区',
          },
          {
            value: '210213',
            label: '金州区',
          },
          {
            value: '210214',
            label: '普兰店区',
          },
          {
            value: '210224',
            label: '长海县',
          },
          {
            value: '210281',
            label: '瓦房店市',
          },
          {
            value: '210283',
            label: '庄河市',
          },
        ],
      },
      {
        value: '210300',
        label: '鞍山市',
        children: [
          {
            value: '210302',
            label: '铁东区',
          },
          {
            value: '210303',
            label: '铁西区',
          },
          {
            value: '210304',
            label: '立山区',
          },
          {
            value: '210311',
            label: '千山区',
          },
          {
            value: '210321',
            label: '台安县',
          },
          {
            value: '210323',
            label: '岫岩满族自治县',
          },
          {
            value: '210381',
            label: '海城市',
          },
        ],
      },
      {
        value: '210400',
        label: '抚顺市',
        children: [
          {
            value: '210402',
            label: '新抚区',
          },
          {
            value: '210403',
            label: '东洲区',
          },
          {
            value: '210404',
            label: '望花区',
          },
          {
            value: '210411',
            label: '顺城区',
          },
          {
            value: '210421',
            label: '抚顺县',
          },
          {
            value: '210422',
            label: '新宾满族自治县',
          },
          {
            value: '210423',
            label: '清原满族自治县',
          },
        ],
      },
      {
        value: '210500',
        label: '本溪市',
        children: [
          {
            value: '210502',
            label: '平山区',
          },
          {
            value: '210503',
            label: '溪湖区',
          },
          {
            value: '210504',
            label: '明山区',
          },
          {
            value: '210505',
            label: '南芬区',
          },
          {
            value: '210521',
            label: '本溪满族自治县',
          },
          {
            value: '210522',
            label: '桓仁满族自治县',
          },
        ],
      },
      {
        value: '210600',
        label: '丹东市',
        children: [
          {
            value: '210602',
            label: '元宝区',
          },
          {
            value: '210603',
            label: '振兴区',
          },
          {
            value: '210604',
            label: '振安区',
          },
          {
            value: '210624',
            label: '宽甸满族自治县',
          },
          {
            value: '210681',
            label: '东港市',
          },
          {
            value: '210682',
            label: '凤城市',
          },
        ],
      },
      {
        value: '210700',
        label: '锦州市',
        children: [
          {
            value: '210702',
            label: '古塔区',
          },
          {
            value: '210703',
            label: '凌河区',
          },
          {
            value: '210711',
            label: '太和区',
          },
          {
            value: '210726',
            label: '黑山县',
          },
          {
            value: '210727',
            label: '义县',
          },
          {
            value: '210781',
            label: '凌海市',
          },
          {
            value: '210782',
            label: '北镇市',
          },
        ],
      },
      {
        value: '210800',
        label: '营口市',
        children: [
          {
            value: '210802',
            label: '站前区',
          },
          {
            value: '210803',
            label: '西市区',
          },
          {
            value: '210804',
            label: '鲅鱼圈区',
          },
          {
            value: '210811',
            label: '老边区',
          },
          {
            value: '210881',
            label: '盖州市',
          },
          {
            value: '210882',
            label: '大石桥市',
          },
        ],
      },
      {
        value: '210900',
        label: '阜新市',
        children: [
          {
            value: '210902',
            label: '海州区',
          },
          {
            value: '210903',
            label: '新邱区',
          },
          {
            value: '210904',
            label: '太平区',
          },
          {
            value: '210905',
            label: '清河门区',
          },
          {
            value: '210911',
            label: '细河区',
          },
          {
            value: '210921',
            label: '阜新蒙古族自治县',
          },
          {
            value: '210922',
            label: '彰武县',
          },
        ],
      },
      {
        value: '211000',
        label: '辽阳市',
        children: [
          {
            value: '211002',
            label: '白塔区',
          },
          {
            value: '211003',
            label: '文圣区',
          },
          {
            value: '211004',
            label: '宏伟区',
          },
          {
            value: '211005',
            label: '弓长岭区',
          },
          {
            value: '211011',
            label: '太子河区',
          },
          {
            value: '211021',
            label: '辽阳县',
          },
          {
            value: '211081',
            label: '灯塔市',
          },
        ],
      },
      {
        value: '211200',
        label: '铁岭市',
        children: [
          {
            value: '211202',
            label: '银州区',
          },
          {
            value: '211204',
            label: '清河区',
          },
          {
            value: '211221',
            label: '铁岭县',
          },
          {
            value: '211223',
            label: '西丰县',
          },
          {
            value: '211224',
            label: '昌图县',
          },
          {
            value: '211281',
            label: '调兵山市',
          },
          {
            value: '211282',
            label: '开原市',
          },
        ],
      },
      {
        value: '211300',
        label: '朝阳市',
        children: [
          {
            value: '211302',
            label: '双塔区',
          },
          {
            value: '211303',
            label: '龙城区',
          },
          {
            value: '211321',
            label: '朝阳县',
          },
          {
            value: '211322',
            label: '建平县',
          },
          {
            value: '211324',
            label: '喀喇沁左翼蒙古族自治县',
          },
          {
            value: '211381',
            label: '北票市',
          },
          {
            value: '211382',
            label: '凌源市',
          },
        ],
      },
      {
        value: '211400',
        label: '葫芦岛市',
        children: [
          {
            value: '211402',
            label: '连山区',
          },
          {
            value: '211403',
            label: '龙港区',
          },
          {
            value: '211404',
            label: '南票区',
          },
          {
            value: '211421',
            label: '绥中县',
          },
          {
            value: '211422',
            label: '建昌县',
          },
          {
            value: '211481',
            label: '兴城市',
          },
        ],
      },
    ],
  },
  {
    value: '220000',
    label: '吉林省',
    children: [
      {
        value: '220100',
        label: '长春市',
        children: [
          {
            value: '220102',
            label: '南关区',
          },
          {
            value: '220103',
            label: '宽城区',
          },
          {
            value: '220104',
            label: '朝阳区',
          },
          {
            value: '220105',
            label: '二道区',
          },
          {
            value: '220106',
            label: '绿园区',
          },
          {
            value: '220112',
            label: '双阳区',
          },
          {
            value: '220113',
            label: '九台区',
          },
          {
            value: '220122',
            label: '农安县',
          },
          {
            value: '220182',
            label: '榆树市',
          },
          {
            value: '220183',
            label: '德惠市',
          },
        ],
      },
      {
        value: '220200',
        label: '吉林市',
        children: [
          {
            value: '220202',
            label: '昌邑区',
          },
          {
            value: '220203',
            label: '龙潭区',
          },
          {
            value: '220204',
            label: '船营区',
          },
          {
            value: '220211',
            label: '丰满区',
          },
          {
            value: '220221',
            label: '永吉县',
          },
          {
            value: '220281',
            label: '蛟河市',
          },
          {
            value: '220282',
            label: '桦甸市',
          },
          {
            value: '220283',
            label: '舒兰市',
          },
          {
            value: '220284',
            label: '磐石市',
          },
        ],
      },
      {
        value: '220300',
        label: '四平市',
        children: [
          {
            value: '220302',
            label: '铁西区',
          },
          {
            value: '220303',
            label: '铁东区',
          },
          {
            value: '220322',
            label: '梨树县',
          },
          {
            value: '220323',
            label: '伊通满族自治县',
          },
          {
            value: '220381',
            label: '公主岭市',
          },
          {
            value: '220382',
            label: '双辽市',
          },
        ],
      },
      {
        value: '220400',
        label: '辽源市',
        children: [
          {
            value: '220402',
            label: '龙山区',
          },
          {
            value: '220403',
            label: '西安区',
          },
          {
            value: '220421',
            label: '东丰县',
          },
          {
            value: '220422',
            label: '东辽县',
          },
        ],
      },
      {
        value: '220500',
        label: '通化市',
        children: [
          {
            value: '220502',
            label: '东昌区',
          },
          {
            value: '220503',
            label: '二道江区',
          },
          {
            value: '220521',
            label: '通化县',
          },
          {
            value: '220523',
            label: '辉南县',
          },
          {
            value: '220524',
            label: '柳河县',
          },
          {
            value: '220581',
            label: '梅河口市',
          },
          {
            value: '220582',
            label: '集安市',
          },
        ],
      },
      {
        value: '220600',
        label: '白山市',
        children: [
          {
            value: '220602',
            label: '浑江区',
          },
          {
            value: '220605',
            label: '江源区',
          },
          {
            value: '220621',
            label: '抚松县',
          },
          {
            value: '220622',
            label: '靖宇县',
          },
          {
            value: '220623',
            label: '长白朝鲜族自治县',
          },
          {
            value: '220681',
            label: '临江市',
          },
        ],
      },
      {
        value: '220700',
        label: '松原市',
        children: [
          {
            value: '220702',
            label: '宁江区',
          },
          {
            value: '220721',
            label: '前郭尔罗斯蒙古族自治县',
          },
          {
            value: '220722',
            label: '长岭县',
          },
          {
            value: '220723',
            label: '乾安县',
          },
          {
            value: '220781',
            label: '扶余市',
          },
        ],
      },
      {
        value: '220800',
        label: '白城市',
        children: [
          {
            value: '220802',
            label: '洮北区',
          },
          {
            value: '220821',
            label: '镇赉县',
          },
          {
            value: '220822',
            label: '通榆县',
          },
          {
            value: '220881',
            label: '洮南市',
          },
          {
            value: '220882',
            label: '大安市',
          },
        ],
      },
      {
        value: '222400',
        label: '延边朝鲜族自治州',
        children: [
          {
            value: '222401',
            label: '延吉市',
          },
          {
            value: '222402',
            label: '图们市',
          },
          {
            value: '222403',
            label: '敦化市',
          },
          {
            value: '222404',
            label: '珲春市',
          },
          {
            value: '222405',
            label: '龙井市',
          },
          {
            value: '222406',
            label: '和龙市',
          },
          {
            value: '222424',
            label: '汪清县',
          },
          {
            value: '222426',
            label: '安图县',
          },
        ],
      },
    ],
  },
  {
    value: '230000',
    label: '黑龙江省',
    children: [
      {
        value: '230100',
        label: '哈尔滨市',
        children: [
          {
            value: '230102',
            label: '道里区',
          },
          {
            value: '230103',
            label: '南岗区',
          },
          {
            value: '230104',
            label: '道外区',
          },
          {
            value: '230108',
            label: '平房区',
          },
          {
            value: '230109',
            label: '松北区',
          },
          {
            value: '230110',
            label: '香坊区',
          },
          {
            value: '230111',
            label: '呼兰区',
          },
          {
            value: '230112',
            label: '阿城区',
          },
          {
            value: '230113',
            label: '双城区',
          },
          {
            value: '230123',
            label: '依兰县',
          },
          {
            value: '230124',
            label: '方正县',
          },
          {
            value: '230125',
            label: '宾县',
          },
          {
            value: '230126',
            label: '巴彦县',
          },
          {
            value: '230127',
            label: '木兰县',
          },
          {
            value: '230128',
            label: '通河县',
          },
          {
            value: '230129',
            label: '延寿县',
          },
          {
            value: '230183',
            label: '尚志市',
          },
          {
            value: '230184',
            label: '五常市',
          },
        ],
      },
      {
        value: '230200',
        label: '齐齐哈尔市',
        children: [
          {
            value: '230202',
            label: '龙沙区',
          },
          {
            value: '230203',
            label: '建华区',
          },
          {
            value: '230204',
            label: '铁锋区',
          },
          {
            value: '230205',
            label: '昂昂溪区',
          },
          {
            value: '230206',
            label: '富拉尔基区',
          },
          {
            value: '230207',
            label: '碾子山区',
          },
          {
            value: '230208',
            label: '梅里斯达斡尔族区',
          },
          {
            value: '230221',
            label: '龙江县',
          },
          {
            value: '230223',
            label: '依安县',
          },
          {
            value: '230224',
            label: '泰来县',
          },
          {
            value: '230225',
            label: '甘南县',
          },
          {
            value: '230227',
            label: '富裕县',
          },
          {
            value: '230229',
            label: '克山县',
          },
          {
            value: '230230',
            label: '克东县',
          },
          {
            value: '230231',
            label: '拜泉县',
          },
          {
            value: '230281',
            label: '讷河市',
          },
        ],
      },
      {
        value: '230300',
        label: '鸡西市',
        children: [
          {
            value: '230302',
            label: '鸡冠区',
          },
          {
            value: '230303',
            label: '恒山区',
          },
          {
            value: '230304',
            label: '滴道区',
          },
          {
            value: '230305',
            label: '梨树区',
          },
          {
            value: '230306',
            label: '城子河区',
          },
          {
            value: '230307',
            label: '麻山区',
          },
          {
            value: '230321',
            label: '鸡东县',
          },
          {
            value: '230381',
            label: '虎林市',
          },
          {
            value: '230382',
            label: '密山市',
          },
        ],
      },
      {
        value: '230400',
        label: '鹤岗市',
        children: [
          {
            value: '230402',
            label: '向阳区',
          },
          {
            value: '230403',
            label: '工农区',
          },
          {
            value: '230404',
            label: '南山区',
          },
          {
            value: '230405',
            label: '兴安区',
          },
          {
            value: '230406',
            label: '东山区',
          },
          {
            value: '230407',
            label: '兴山区',
          },
          {
            value: '230421',
            label: '萝北县',
          },
          {
            value: '230422',
            label: '绥滨县',
          },
        ],
      },
      {
        value: '230500',
        label: '双鸭山市',
        children: [
          {
            value: '230502',
            label: '尖山区',
          },
          {
            value: '230503',
            label: '岭东区',
          },
          {
            value: '230505',
            label: '四方台区',
          },
          {
            value: '230506',
            label: '宝山区',
          },
          {
            value: '230521',
            label: '集贤县',
          },
          {
            value: '230522',
            label: '友谊县',
          },
          {
            value: '230523',
            label: '宝清县',
          },
          {
            value: '230524',
            label: '饶河县',
          },
        ],
      },
      {
        value: '230600',
        label: '大庆市',
        children: [
          {
            value: '230602',
            label: '萨尔图区',
          },
          {
            value: '230603',
            label: '龙凤区',
          },
          {
            value: '230604',
            label: '让胡路区',
          },
          {
            value: '230605',
            label: '红岗区',
          },
          {
            value: '230606',
            label: '大同区',
          },
          {
            value: '230621',
            label: '肇州县',
          },
          {
            value: '230622',
            label: '肇源县',
          },
          {
            value: '230623',
            label: '林甸县',
          },
          {
            value: '230624',
            label: '杜尔伯特蒙古族自治县',
          },
        ],
      },
      {
        value: '230700',
        label: '伊春市',
        children: [
          {
            value: '230702',
            label: '伊春区',
          },
          {
            value: '230703',
            label: '南岔区',
          },
          {
            value: '230704',
            label: '友好区',
          },
          {
            value: '230705',
            label: '西林区',
          },
          {
            value: '230706',
            label: '翠峦区',
          },
          {
            value: '230707',
            label: '新青区',
          },
          {
            value: '230708',
            label: '美溪区',
          },
          {
            value: '230709',
            label: '金山屯区',
          },
          {
            value: '230710',
            label: '五营区',
          },
          {
            value: '230711',
            label: '乌马河区',
          },
          {
            value: '230712',
            label: '汤旺河区',
          },
          {
            value: '230713',
            label: '带岭区',
          },
          {
            value: '230714',
            label: '乌伊岭区',
          },
          {
            value: '230715',
            label: '红星区',
          },
          {
            value: '230716',
            label: '上甘岭区',
          },
          {
            value: '230722',
            label: '嘉荫县',
          },
          {
            value: '230781',
            label: '铁力市',
          },
        ],
      },
      {
        value: '230800',
        label: '佳木斯市',
        children: [
          {
            value: '230803',
            label: '向阳区',
          },
          {
            value: '230804',
            label: '前进区',
          },
          {
            value: '230805',
            label: '东风区',
          },
          {
            value: '230811',
            label: '郊区',
          },
          {
            value: '230822',
            label: '桦南县',
          },
          {
            value: '230826',
            label: '桦川县',
          },
          {
            value: '230828',
            label: '汤原县',
          },
          {
            value: '230881',
            label: '同江市',
          },
          {
            value: '230882',
            label: '富锦市',
          },
          {
            value: '230883',
            label: '抚远市',
          },
        ],
      },
      {
        value: '230900',
        label: '七台河市',
        children: [
          {
            value: '230902',
            label: '新兴区',
          },
          {
            value: '230903',
            label: '桃山区',
          },
          {
            value: '230904',
            label: '茄子河区',
          },
          {
            value: '230921',
            label: '勃利县',
          },
        ],
      },
      {
        value: '231000',
        label: '牡丹江市',
        children: [
          {
            value: '231002',
            label: '东安区',
          },
          {
            value: '231003',
            label: '阳明区',
          },
          {
            value: '231004',
            label: '爱民区',
          },
          {
            value: '231005',
            label: '西安区',
          },
          {
            value: '231025',
            label: '林口县',
          },
          {
            value: '231081',
            label: '绥芬河市',
          },
          {
            value: '231083',
            label: '海林市',
          },
          {
            value: '231084',
            label: '宁安市',
          },
          {
            value: '231085',
            label: '穆棱市',
          },
          {
            value: '231086',
            label: '东宁市',
          },
        ],
      },
      {
        value: '231100',
        label: '黑河市',
        children: [
          {
            value: '231102',
            label: '爱辉区',
          },
          {
            value: '231121',
            label: '嫩江县',
          },
          {
            value: '231123',
            label: '逊克县',
          },
          {
            value: '231124',
            label: '孙吴县',
          },
          {
            value: '231181',
            label: '北安市',
          },
          {
            value: '231182',
            label: '五大连池市',
          },
        ],
      },
      {
        value: '231200',
        label: '绥化市',
        children: [
          {
            value: '231202',
            label: '北林区',
          },
          {
            value: '231221',
            label: '望奎县',
          },
          {
            value: '231222',
            label: '兰西县',
          },
          {
            value: '231223',
            label: '青冈县',
          },
          {
            value: '231224',
            label: '庆安县',
          },
          {
            value: '231225',
            label: '明水县',
          },
          {
            value: '231226',
            label: '绥棱县',
          },
          {
            value: '231281',
            label: '安达市',
          },
          {
            value: '231282',
            label: '肇东市',
          },
          {
            value: '231283',
            label: '海伦市',
          },
        ],
      },
      {
        value: '232700',
        label: '大兴安岭地区',
        children: [
          {
            value: '232701',
            label: '漠河市',
          },
          {
            value: '232721',
            label: '呼玛县',
          },
          {
            value: '232722',
            label: '塔河县',
          },
        ],
      },
    ],
  },
  {
    value: '310000',
    label: '上海',
    children: [
      {
        value: '310000',
        label: '上海市',
        children: [
          {
            value: '310101',
            label: '黄浦区',
          },
          {
            value: '310104',
            label: '徐汇区',
          },
          {
            value: '310105',
            label: '长宁区',
          },
          {
            value: '310106',
            label: '静安区',
          },
          {
            value: '310107',
            label: '普陀区',
          },
          {
            value: '310109',
            label: '虹口区',
          },
          {
            value: '310110',
            label: '杨浦区',
          },
          {
            value: '310112',
            label: '闵行区',
          },
          {
            value: '310113',
            label: '宝山区',
          },
          {
            value: '310114',
            label: '嘉定区',
          },
          {
            value: '310115',
            label: '浦东新区',
          },
          {
            value: '310116',
            label: '金山区',
          },
          {
            value: '310117',
            label: '松江区',
          },
          {
            value: '310118',
            label: '青浦区',
          },
          {
            value: '310120',
            label: '奉贤区',
          },
          {
            value: '310151',
            label: '崇明区',
          },
        ],
      },
    ],
  },
  {
    value: '320000',
    label: '江苏省',
    children: [
      {
        value: '320100',
        label: '南京市',
        children: [
          {
            value: '320102',
            label: '玄武区',
          },
          {
            value: '320104',
            label: '秦淮区',
          },
          {
            value: '320105',
            label: '建邺区',
          },
          {
            value: '320106',
            label: '鼓楼区',
          },
          {
            value: '320111',
            label: '浦口区',
          },
          {
            value: '320113',
            label: '栖霞区',
          },
          {
            value: '320114',
            label: '雨花台区',
          },
          {
            value: '320115',
            label: '江宁区',
          },
          {
            value: '320116',
            label: '六合区',
          },
          {
            value: '320117',
            label: '溧水区',
          },
          {
            value: '320118',
            label: '高淳区',
          },
        ],
      },
      {
        value: '320200',
        label: '无锡市',
        children: [
          {
            value: '320205',
            label: '锡山区',
          },
          {
            value: '320206',
            label: '惠山区',
          },
          {
            value: '320211',
            label: '滨湖区',
          },
          {
            value: '320213',
            label: '梁溪区',
          },
          {
            value: '320214',
            label: '新吴区',
          },
          {
            value: '320281',
            label: '江阴市',
          },
          {
            value: '320282',
            label: '宜兴市',
          },
        ],
      },
      {
        value: '320300',
        label: '徐州市',
        children: [
          {
            value: '320302',
            label: '鼓楼区',
          },
          {
            value: '320303',
            label: '云龙区',
          },
          {
            value: '320305',
            label: '贾汪区',
          },
          {
            value: '320311',
            label: '泉山区',
          },
          {
            value: '320312',
            label: '铜山区',
          },
          {
            value: '320321',
            label: '丰县',
          },
          {
            value: '320322',
            label: '沛县',
          },
          {
            value: '320324',
            label: '睢宁县',
          },
          {
            value: '320381',
            label: '新沂市',
          },
          {
            value: '320382',
            label: '邳州市',
          },
        ],
      },
      {
        value: '320400',
        label: '常州市',
        children: [
          {
            value: '320402',
            label: '天宁区',
          },
          {
            value: '320404',
            label: '钟楼区',
          },
          {
            value: '320411',
            label: '新北区',
          },
          {
            value: '320412',
            label: '武进区',
          },
          {
            value: '320413',
            label: '金坛区',
          },
          {
            value: '320481',
            label: '溧阳市',
          },
        ],
      },
      {
        value: '320500',
        label: '苏州市',
        children: [
          {
            value: '320505',
            label: '虎丘区',
          },
          {
            value: '320506',
            label: '吴中区',
          },
          {
            value: '320507',
            label: '相城区',
          },
          {
            value: '320508',
            label: '姑苏区',
          },
          {
            value: '320509',
            label: '吴江区',
          },
          {
            value: '320581',
            label: '常熟市',
          },
          {
            value: '320582',
            label: '张家港市',
          },
          {
            value: '320583',
            label: '昆山市',
          },
          {
            value: '320585',
            label: '太仓市',
          },
        ],
      },
      {
        value: '320600',
        label: '南通市',
        children: [
          {
            value: '320602',
            label: '崇川区',
          },
          {
            value: '320611',
            label: '港闸区',
          },
          {
            value: '320612',
            label: '通州区',
          },
          {
            value: '320623',
            label: '如东县',
          },
          {
            value: '320681',
            label: '启东市',
          },
          {
            value: '320682',
            label: '如皋市',
          },
          {
            value: '320684',
            label: '海门市',
          },
          {
            value: '320685',
            label: '海安市',
          },
        ],
      },
      {
        value: '320700',
        label: '连云港市',
        children: [
          {
            value: '320703',
            label: '连云区',
          },
          {
            value: '320706',
            label: '海州区',
          },
          {
            value: '320707',
            label: '赣榆区',
          },
          {
            value: '320722',
            label: '东海县',
          },
          {
            value: '320723',
            label: '灌云县',
          },
          {
            value: '320724',
            label: '灌南县',
          },
        ],
      },
      {
        value: '320800',
        label: '淮安市',
        children: [
          {
            value: '320803',
            label: '淮安区',
          },
          {
            value: '320804',
            label: '淮阴区',
          },
          {
            value: '320812',
            label: '清江浦区',
          },
          {
            value: '320813',
            label: '洪泽区',
          },
          {
            value: '320826',
            label: '涟水县',
          },
          {
            value: '320830',
            label: '盱眙县',
          },
          {
            value: '320831',
            label: '金湖县',
          },
        ],
      },
      {
        value: '320900',
        label: '盐城市',
        children: [
          {
            value: '320902',
            label: '亭湖区',
          },
          {
            value: '320903',
            label: '盐都区',
          },
          {
            value: '320904',
            label: '大丰区',
          },
          {
            value: '320921',
            label: '响水县',
          },
          {
            value: '320922',
            label: '滨海县',
          },
          {
            value: '320923',
            label: '阜宁县',
          },
          {
            value: '320924',
            label: '射阳县',
          },
          {
            value: '320925',
            label: '建湖县',
          },
          {
            value: '320981',
            label: '东台市',
          },
        ],
      },
      {
        value: '321000',
        label: '扬州市',
        children: [
          {
            value: '321002',
            label: '广陵区',
          },
          {
            value: '321003',
            label: '邗江区',
          },
          {
            value: '321012',
            label: '江都区',
          },
          {
            value: '321023',
            label: '宝应县',
          },
          {
            value: '321081',
            label: '仪征市',
          },
          {
            value: '321084',
            label: '高邮市',
          },
        ],
      },
      {
        value: '321100',
        label: '镇江市',
        children: [
          {
            value: '321102',
            label: '京口区',
          },
          {
            value: '321111',
            label: '润州区',
          },
          {
            value: '321112',
            label: '丹徒区',
          },
          {
            value: '321181',
            label: '丹阳市',
          },
          {
            value: '321182',
            label: '扬中市',
          },
          {
            value: '321183',
            label: '句容市',
          },
        ],
      },
      {
        value: '321200',
        label: '泰州市',
        children: [
          {
            value: '321202',
            label: '海陵区',
          },
          {
            value: '321203',
            label: '高港区',
          },
          {
            value: '321204',
            label: '姜堰区',
          },
          {
            value: '321281',
            label: '兴化市',
          },
          {
            value: '321282',
            label: '靖江市',
          },
          {
            value: '321283',
            label: '泰兴市',
          },
        ],
      },
      {
        value: '321300',
        label: '宿迁市',
        children: [
          {
            value: '321302',
            label: '宿城区',
          },
          {
            value: '321311',
            label: '宿豫区',
          },
          {
            value: '321322',
            label: '沭阳县',
          },
          {
            value: '321323',
            label: '泗阳县',
          },
          {
            value: '321324',
            label: '泗洪县',
          },
        ],
      },
    ],
  },
  {
    value: '330000',
    label: '浙江省',
    children: [
      {
        value: '330100',
        label: '杭州市',
        children: [
          {
            value: '330102',
            label: '上城区',
          },
          {
            value: '330103',
            label: '下城区',
          },
          {
            value: '330104',
            label: '江干区',
          },
          {
            value: '330105',
            label: '拱墅区',
          },
          {
            value: '330106',
            label: '西湖区',
          },
          {
            value: '330108',
            label: '滨江区',
          },
          {
            value: '330109',
            label: '萧山区',
          },
          {
            value: '330110',
            label: '余杭区',
          },
          {
            value: '330111',
            label: '富阳区',
          },
          {
            value: '330112',
            label: '临安区',
          },
          {
            value: '330114',
            label: '钱塘区',
          },
          {
            value: '330122',
            label: '桐庐县',
          },
          {
            value: '330127',
            label: '淳安县',
          },
          {
            value: '330182',
            label: '建德市',
          },
        ],
      },
      {
        value: '330200',
        label: '宁波市',
        children: [
          {
            value: '330203',
            label: '海曙区',
          },
          {
            value: '330205',
            label: '江北区',
          },
          {
            value: '330206',
            label: '北仑区',
          },
          {
            value: '330211',
            label: '镇海区',
          },
          {
            value: '330212',
            label: '鄞州区',
          },
          {
            value: '330213',
            label: '奉化区',
          },
          {
            value: '330225',
            label: '象山县',
          },
          {
            value: '330226',
            label: '宁海县',
          },
          {
            value: '330281',
            label: '余姚市',
          },
          {
            value: '330282',
            label: '慈溪市',
          },
        ],
      },
      {
        value: '330300',
        label: '温州市',
        children: [
          {
            value: '330302',
            label: '鹿城区',
          },
          {
            value: '330303',
            label: '龙湾区',
          },
          {
            value: '330304',
            label: '瓯海区',
          },
          {
            value: '330305',
            label: '洞头区',
          },
          {
            value: '330324',
            label: '永嘉县',
          },
          {
            value: '330326',
            label: '平阳县',
          },
          {
            value: '330327',
            label: '苍南县',
          },
          {
            value: '330328',
            label: '文成县',
          },
          {
            value: '330329',
            label: '泰顺县',
          },
          {
            value: '330381',
            label: '瑞安市',
          },
          {
            value: '330382',
            label: '乐清市',
          },
        ],
      },
      {
        value: '330400',
        label: '嘉兴市',
        children: [
          {
            value: '330402',
            label: '南湖区',
          },
          {
            value: '330411',
            label: '秀洲区',
          },
          {
            value: '330421',
            label: '嘉善县',
          },
          {
            value: '330424',
            label: '海盐县',
          },
          {
            value: '330481',
            label: '海宁市',
          },
          {
            value: '330482',
            label: '平湖市',
          },
          {
            value: '330483',
            label: '桐乡市',
          },
        ],
      },
      {
        value: '330500',
        label: '湖州市',
        children: [
          {
            value: '330502',
            label: '吴兴区',
          },
          {
            value: '330503',
            label: '南浔区',
          },
          {
            value: '330521',
            label: '德清县',
          },
          {
            value: '330522',
            label: '长兴县',
          },
          {
            value: '330523',
            label: '安吉县',
          },
        ],
      },
      {
        value: '330600',
        label: '绍兴市',
        children: [
          {
            value: '330602',
            label: '越城区',
          },
          {
            value: '330603',
            label: '柯桥区',
          },
          {
            value: '330604',
            label: '上虞区',
          },
          {
            value: '330624',
            label: '新昌县',
          },
          {
            value: '330681',
            label: '诸暨市',
          },
          {
            value: '330683',
            label: '嵊州市',
          },
        ],
      },
      {
        value: '330700',
        label: '金华市',
        children: [
          {
            value: '330702',
            label: '婺城区',
          },
          {
            value: '330703',
            label: '金东区',
          },
          {
            value: '330723',
            label: '武义县',
          },
          {
            value: '330726',
            label: '浦江县',
          },
          {
            value: '330727',
            label: '磐安县',
          },
          {
            value: '330781',
            label: '兰溪市',
          },
          {
            value: '330782',
            label: '义乌市',
          },
          {
            value: '330783',
            label: '东阳市',
          },
          {
            value: '330784',
            label: '永康市',
          },
        ],
      },
      {
        value: '330800',
        label: '衢州市',
        children: [
          {
            value: '330802',
            label: '柯城区',
          },
          {
            value: '330803',
            label: '衢江区',
          },
          {
            value: '330822',
            label: '常山县',
          },
          {
            value: '330824',
            label: '开化县',
          },
          {
            value: '330825',
            label: '龙游县',
          },
          {
            value: '330881',
            label: '江山市',
          },
        ],
      },
      {
        value: '330900',
        label: '舟山市',
        children: [
          {
            value: '330902',
            label: '定海区',
          },
          {
            value: '330903',
            label: '普陀区',
          },
          {
            value: '330921',
            label: '岱山县',
          },
          {
            value: '330922',
            label: '嵊泗县',
          },
        ],
      },
      {
        value: '331000',
        label: '台州市',
        children: [
          {
            value: '331002',
            label: '椒江区',
          },
          {
            value: '331003',
            label: '黄岩区',
          },
          {
            value: '331004',
            label: '路桥区',
          },
          {
            value: '331022',
            label: '三门县',
          },
          {
            value: '331023',
            label: '天台县',
          },
          {
            value: '331024',
            label: '仙居县',
          },
          {
            value: '331081',
            label: '温岭市',
          },
          {
            value: '331082',
            label: '临海市',
          },
          {
            value: '331083',
            label: '玉环市',
          },
        ],
      },
      {
        value: '331100',
        label: '丽水市',
        children: [
          {
            value: '331102',
            label: '莲都区',
          },
          {
            value: '331121',
            label: '青田县',
          },
          {
            value: '331122',
            label: '缙云县',
          },
          {
            value: '331123',
            label: '遂昌县',
          },
          {
            value: '331124',
            label: '松阳县',
          },
          {
            value: '331125',
            label: '云和县',
          },
          {
            value: '331126',
            label: '庆元县',
          },
          {
            value: '331127',
            label: '景宁畲族自治县',
          },
          {
            value: '331181',
            label: '龙泉市',
          },
        ],
      },
    ],
  },
  {
    value: '340000',
    label: '安徽省',
    children: [
      {
        value: '340100',
        label: '合肥市',
        children: [
          {
            value: '340102',
            label: '瑶海区',
          },
          {
            value: '340103',
            label: '庐阳区',
          },
          {
            value: '340104',
            label: '蜀山区',
          },
          {
            value: '340111',
            label: '包河区',
          },
          {
            value: '340121',
            label: '长丰县',
          },
          {
            value: '340122',
            label: '肥东县',
          },
          {
            value: '340123',
            label: '肥西县',
          },
          {
            value: '340124',
            label: '庐江县',
          },
          {
            value: '340181',
            label: '巢湖市',
          },
        ],
      },
      {
        value: '340200',
        label: '芜湖市',
        children: [
          {
            value: '340202',
            label: '镜湖区',
          },
          {
            value: '340203',
            label: '弋江区',
          },
          {
            value: '340207',
            label: '鸠江区',
          },
          {
            value: '340208',
            label: '三山区',
          },
          {
            value: '340221',
            label: '芜湖县',
          },
          {
            value: '340222',
            label: '繁昌县',
          },
          {
            value: '340223',
            label: '南陵县',
          },
          {
            value: '340225',
            label: '无为县',
          },
        ],
      },
      {
        value: '340300',
        label: '蚌埠市',
        children: [
          {
            value: '340302',
            label: '龙子湖区',
          },
          {
            value: '340303',
            label: '蚌山区',
          },
          {
            value: '340304',
            label: '禹会区',
          },
          {
            value: '340311',
            label: '淮上区',
          },
          {
            value: '340321',
            label: '怀远县',
          },
          {
            value: '340322',
            label: '五河县',
          },
          {
            value: '340323',
            label: '固镇县',
          },
        ],
      },
      {
        value: '340400',
        label: '淮南市',
        children: [
          {
            value: '340402',
            label: '大通区',
          },
          {
            value: '340403',
            label: '田家庵区',
          },
          {
            value: '340404',
            label: '谢家集区',
          },
          {
            value: '340405',
            label: '八公山区',
          },
          {
            value: '340406',
            label: '潘集区',
          },
          {
            value: '340421',
            label: '凤台县',
          },
          {
            value: '340422',
            label: '寿县',
          },
        ],
      },
      {
        value: '340500',
        label: '马鞍山市',
        children: [
          {
            value: '340503',
            label: '花山区',
          },
          {
            value: '340504',
            label: '雨山区',
          },
          {
            value: '340506',
            label: '博望区',
          },
          {
            value: '340521',
            label: '当涂县',
          },
          {
            value: '340522',
            label: '含山县',
          },
          {
            value: '340523',
            label: '和县',
          },
        ],
      },
      {
        value: '340600',
        label: '淮北市',
        children: [
          {
            value: '340602',
            label: '杜集区',
          },
          {
            value: '340603',
            label: '相山区',
          },
          {
            value: '340604',
            label: '烈山区',
          },
          {
            value: '340621',
            label: '濉溪县',
          },
        ],
      },
      {
        value: '340800',
        label: '安庆市',
        children: [
          {
            value: '340802',
            label: '迎江区',
          },
          {
            value: '340803',
            label: '大观区',
          },
          {
            value: '340811',
            label: '宜秀区',
          },
          {
            value: '340822',
            label: '怀宁县',
          },
          {
            value: '340824',
            label: '潜山县',
          },
          {
            value: '340825',
            label: '太湖县',
          },
          {
            value: '340826',
            label: '宿松县',
          },
          {
            value: '340827',
            label: '望江县',
          },
          {
            value: '340828',
            label: '岳西县',
          },
          {
            value: '340881',
            label: '桐城市',
          },
        ],
      },
      {
        value: '341000',
        label: '黄山市',
        children: [
          {
            value: '341002',
            label: '屯溪区',
          },
          {
            value: '341003',
            label: '黄山区',
          },
          {
            value: '341004',
            label: '徽州区',
          },
          {
            value: '341021',
            label: '歙县',
          },
          {
            value: '341022',
            label: '休宁县',
          },
          {
            value: '341023',
            label: '黟县',
          },
          {
            value: '341024',
            label: '祁门县',
          },
        ],
      },
      {
        value: '341100',
        label: '滁州市',
        children: [
          {
            value: '341102',
            label: '琅琊区',
          },
          {
            value: '341103',
            label: '南谯区',
          },
          {
            value: '341122',
            label: '来安县',
          },
          {
            value: '341124',
            label: '全椒县',
          },
          {
            value: '341125',
            label: '定远县',
          },
          {
            value: '341126',
            label: '凤阳县',
          },
          {
            value: '341181',
            label: '天长市',
          },
          {
            value: '341182',
            label: '明光市',
          },
        ],
      },
      {
        value: '341200',
        label: '阜阳市',
        children: [
          {
            value: '341202',
            label: '颍州区',
          },
          {
            value: '341203',
            label: '颍东区',
          },
          {
            value: '341204',
            label: '颍泉区',
          },
          {
            value: '341221',
            label: '临泉县',
          },
          {
            value: '341222',
            label: '太和县',
          },
          {
            value: '341225',
            label: '阜南县',
          },
          {
            value: '341226',
            label: '颍上县',
          },
          {
            value: '341282',
            label: '界首市',
          },
        ],
      },
      {
        value: '341300',
        label: '宿州市',
        children: [
          {
            value: '341302',
            label: '埇桥区',
          },
          {
            value: '341321',
            label: '砀山县',
          },
          {
            value: '341322',
            label: '萧县',
          },
          {
            value: '341323',
            label: '灵璧县',
          },
          {
            value: '341324',
            label: '泗县',
          },
        ],
      },
      {
        value: '341500',
        label: '六安市',
        children: [
          {
            value: '341502',
            label: '金安区',
          },
          {
            value: '341503',
            label: '裕安区',
          },
          {
            value: '341504',
            label: '叶集区',
          },
          {
            value: '341522',
            label: '霍邱县',
          },
          {
            value: '341523',
            label: '舒城县',
          },
          {
            value: '341524',
            label: '金寨县',
          },
          {
            value: '341525',
            label: '霍山县',
          },
        ],
      },
      {
        value: '341600',
        label: '亳州市',
        children: [
          {
            value: '341602',
            label: '谯城区',
          },
          {
            value: '341621',
            label: '涡阳县',
          },
          {
            value: '341622',
            label: '蒙城县',
          },
          {
            value: '341623',
            label: '利辛县',
          },
        ],
      },
      {
        value: '341700',
        label: '池州市',
        children: [
          {
            value: '341702',
            label: '贵池区',
          },
          {
            value: '341721',
            label: '东至县',
          },
          {
            value: '341722',
            label: '石台县',
          },
          {
            value: '341723',
            label: '青阳县',
          },
        ],
      },
      {
        value: '341800',
        label: '宣城市',
        children: [
          {
            value: '341802',
            label: '宣州区',
          },
          {
            value: '341821',
            label: '郎溪县',
          },
          {
            value: '341822',
            label: '广德县',
          },
          {
            value: '341823',
            label: '泾县',
          },
          {
            value: '341824',
            label: '绩溪县',
          },
          {
            value: '341825',
            label: '旌德县',
          },
          {
            value: '341881',
            label: '宁国市',
          },
        ],
      },
    ],
  },
  {
    value: '350000',
    label: '福建省',
    children: [
      {
        value: '350100',
        label: '福州市',
        children: [
          {
            value: '350102',
            label: '鼓楼区',
          },
          {
            value: '350103',
            label: '台江区',
          },
          {
            value: '350104',
            label: '仓山区',
          },
          {
            value: '350105',
            label: '马尾区',
          },
          {
            value: '350111',
            label: '晋安区',
          },
          {
            value: '350112',
            label: '长乐区',
          },
          {
            value: '350121',
            label: '闽侯县',
          },
          {
            value: '350122',
            label: '连江县',
          },
          {
            value: '350123',
            label: '罗源县',
          },
          {
            value: '350124',
            label: '闽清县',
          },
          {
            value: '350125',
            label: '永泰县',
          },
          {
            value: '350128',
            label: '平潭县',
          },
          {
            value: '350181',
            label: '福清市',
          },
        ],
      },
      {
        value: '350200',
        label: '厦门市',
        children: [
          {
            value: '350203',
            label: '思明区',
          },
          {
            value: '350205',
            label: '海沧区',
          },
          {
            value: '350206',
            label: '湖里区',
          },
          {
            value: '350211',
            label: '集美区',
          },
          {
            value: '350212',
            label: '同安区',
          },
          {
            value: '350213',
            label: '翔安区',
          },
        ],
      },
      {
        value: '350300',
        label: '莆田市',
        children: [
          {
            value: '350302',
            label: '城厢区',
          },
          {
            value: '350303',
            label: '涵江区',
          },
          {
            value: '350304',
            label: '荔城区',
          },
          {
            value: '350305',
            label: '秀屿区',
          },
          {
            value: '350322',
            label: '仙游县',
          },
        ],
      },
      {
        value: '350400',
        label: '三明市',
        children: [
          {
            value: '350402',
            label: '梅列区',
          },
          {
            value: '350403',
            label: '三元区',
          },
          {
            value: '350421',
            label: '明溪县',
          },
          {
            value: '350423',
            label: '清流县',
          },
          {
            value: '350424',
            label: '宁化县',
          },
          {
            value: '350425',
            label: '大田县',
          },
          {
            value: '350426',
            label: '尤溪县',
          },
          {
            value: '350427',
            label: '沙县',
          },
          {
            value: '350428',
            label: '将乐县',
          },
          {
            value: '350429',
            label: '泰宁县',
          },
          {
            value: '350430',
            label: '建宁县',
          },
          {
            value: '350481',
            label: '永安市',
          },
        ],
      },
      {
        value: '350500',
        label: '泉州市',
        children: [
          {
            value: '350502',
            label: '鲤城区',
          },
          {
            value: '350503',
            label: '丰泽区',
          },
          {
            value: '350504',
            label: '洛江区',
          },
          {
            value: '350505',
            label: '泉港区',
          },
          {
            value: '350521',
            label: '惠安县',
          },
          {
            value: '350524',
            label: '安溪县',
          },
          {
            value: '350525',
            label: '永春县',
          },
          {
            value: '350526',
            label: '德化县',
          },
          {
            value: '350527',
            label: '金门县',
          },
          {
            value: '350581',
            label: '石狮市',
          },
          {
            value: '350582',
            label: '晋江市',
          },
          {
            value: '350583',
            label: '南安市',
          },
        ],
      },
      {
        value: '350600',
        label: '漳州市',
        children: [
          {
            value: '350602',
            label: '芗城区',
          },
          {
            value: '350603',
            label: '龙文区',
          },
          {
            value: '350622',
            label: '云霄县',
          },
          {
            value: '350623',
            label: '漳浦县',
          },
          {
            value: '350624',
            label: '诏安县',
          },
          {
            value: '350625',
            label: '长泰县',
          },
          {
            value: '350626',
            label: '东山县',
          },
          {
            value: '350627',
            label: '南靖县',
          },
          {
            value: '350628',
            label: '平和县',
          },
          {
            value: '350629',
            label: '华安县',
          },
          {
            value: '350681',
            label: '龙海市',
          },
        ],
      },
      {
        value: '350700',
        label: '南平市',
        children: [
          {
            value: '350702',
            label: '延平区',
          },
          {
            value: '350703',
            label: '建阳区',
          },
          {
            value: '350721',
            label: '顺昌县',
          },
          {
            value: '350722',
            label: '浦城县',
          },
          {
            value: '350723',
            label: '光泽县',
          },
          {
            value: '350724',
            label: '松溪县',
          },
          {
            value: '350725',
            label: '政和县',
          },
          {
            value: '350781',
            label: '邵武市',
          },
          {
            value: '350782',
            label: '武夷山市',
          },
          {
            value: '350783',
            label: '建瓯市',
          },
        ],
      },
      {
        value: '350800',
        label: '龙岩市',
        children: [
          {
            value: '350802',
            label: '新罗区',
          },
          {
            value: '350803',
            label: '永定区',
          },
          {
            value: '350821',
            label: '长汀县',
          },
          {
            value: '350823',
            label: '上杭县',
          },
          {
            value: '350824',
            label: '武平县',
          },
          {
            value: '350825',
            label: '连城县',
          },
          {
            value: '350881',
            label: '漳平市',
          },
        ],
      },
      {
        value: '350900',
        label: '宁德市',
        children: [
          {
            value: '350902',
            label: '蕉城区',
          },
          {
            value: '350921',
            label: '霞浦县',
          },
          {
            value: '350922',
            label: '古田县',
          },
          {
            value: '350923',
            label: '屏南县',
          },
          {
            value: '350924',
            label: '寿宁县',
          },
          {
            value: '350925',
            label: '周宁县',
          },
          {
            value: '350926',
            label: '柘荣县',
          },
          {
            value: '350981',
            label: '福安市',
          },
          {
            value: '350982',
            label: '福鼎市',
          },
        ],
      },
    ],
  },
  {
    value: '360000',
    label: '江西省',
    children: [
      {
        value: '360100',
        label: '南昌市',
        children: [
          {
            value: '360102',
            label: '东湖区',
          },
          {
            value: '360103',
            label: '西湖区',
          },
          {
            value: '360104',
            label: '青云谱区',
          },
          {
            value: '360105',
            label: '湾里区',
          },
          {
            value: '360111',
            label: '青山湖区',
          },
          {
            value: '360112',
            label: '新建区',
          },
          {
            value: '360121',
            label: '南昌县',
          },
          {
            value: '360123',
            label: '安义县',
          },
          {
            value: '360124',
            label: '进贤县',
          },
        ],
      },
      {
        value: '360200',
        label: '景德镇市',
        children: [
          {
            value: '360202',
            label: '昌江区',
          },
          {
            value: '360203',
            label: '珠山区',
          },
          {
            value: '360222',
            label: '浮梁县',
          },
          {
            value: '360281',
            label: '乐平市',
          },
        ],
      },
      {
        value: '360300',
        label: '萍乡市',
        children: [
          {
            value: '360302',
            label: '安源区',
          },
          {
            value: '360313',
            label: '湘东区',
          },
          {
            value: '360321',
            label: '莲花县',
          },
          {
            value: '360322',
            label: '上栗县',
          },
          {
            value: '360323',
            label: '芦溪县',
          },
        ],
      },
      {
        value: '360400',
        label: '九江市',
        children: [
          {
            value: '360402',
            label: '濂溪区',
          },
          {
            value: '360403',
            label: '浔阳区',
          },
          {
            value: '360404',
            label: '柴桑区',
          },
          {
            value: '360423',
            label: '武宁县',
          },
          {
            value: '360424',
            label: '修水县',
          },
          {
            value: '360425',
            label: '永修县',
          },
          {
            value: '360426',
            label: '德安县',
          },
          {
            value: '360428',
            label: '都昌县',
          },
          {
            value: '360429',
            label: '湖口县',
          },
          {
            value: '360430',
            label: '彭泽县',
          },
          {
            value: '360481',
            label: '瑞昌市',
          },
          {
            value: '360482',
            label: '共青城市',
          },
          {
            value: '360483',
            label: '庐山市',
          },
        ],
      },
      {
        value: '360500',
        label: '新余市',
        children: [
          {
            value: '360502',
            label: '渝水区',
          },
          {
            value: '360521',
            label: '分宜县',
          },
        ],
      },
      {
        value: '360600',
        label: '鹰潭市',
        children: [
          {
            value: '360602',
            label: '月湖区',
          },
          {
            value: '360603',
            label: '余江区',
          },
          {
            value: '360681',
            label: '贵溪市',
          },
        ],
      },
      {
        value: '360700',
        label: '赣州市',
        children: [
          {
            value: '360702',
            label: '章贡区',
          },
          {
            value: '360703',
            label: '南康区',
          },
          {
            value: '360704',
            label: '赣县区',
          },
          {
            value: '360722',
            label: '信丰县',
          },
          {
            value: '360723',
            label: '大余县',
          },
          {
            value: '360724',
            label: '上犹县',
          },
          {
            value: '360725',
            label: '崇义县',
          },
          {
            value: '360726',
            label: '安远县',
          },
          {
            value: '360727',
            label: '龙南县',
          },
          {
            value: '360728',
            label: '定南县',
          },
          {
            value: '360729',
            label: '全南县',
          },
          {
            value: '360730',
            label: '宁都县',
          },
          {
            value: '360731',
            label: '于都县',
          },
          {
            value: '360732',
            label: '兴国县',
          },
          {
            value: '360733',
            label: '会昌县',
          },
          {
            value: '360734',
            label: '寻乌县',
          },
          {
            value: '360735',
            label: '石城县',
          },
          {
            value: '360781',
            label: '瑞金市',
          },
        ],
      },
      {
        value: '360800',
        label: '吉安市',
        children: [
          {
            value: '360802',
            label: '吉州区',
          },
          {
            value: '360803',
            label: '青原区',
          },
          {
            value: '360821',
            label: '吉安县',
          },
          {
            value: '360822',
            label: '吉水县',
          },
          {
            value: '360823',
            label: '峡江县',
          },
          {
            value: '360824',
            label: '新干县',
          },
          {
            value: '360825',
            label: '永丰县',
          },
          {
            value: '360826',
            label: '泰和县',
          },
          {
            value: '360827',
            label: '遂川县',
          },
          {
            value: '360828',
            label: '万安县',
          },
          {
            value: '360829',
            label: '安福县',
          },
          {
            value: '360830',
            label: '永新县',
          },
          {
            value: '360881',
            label: '井冈山市',
          },
        ],
      },
      {
        value: '360900',
        label: '宜春市',
        children: [
          {
            value: '360902',
            label: '袁州区',
          },
          {
            value: '360921',
            label: '奉新县',
          },
          {
            value: '360922',
            label: '万载县',
          },
          {
            value: '360923',
            label: '上高县',
          },
          {
            value: '360924',
            label: '宜丰县',
          },
          {
            value: '360925',
            label: '靖安县',
          },
          {
            value: '360926',
            label: '铜鼓县',
          },
          {
            value: '360981',
            label: '丰城市',
          },
          {
            value: '360982',
            label: '樟树市',
          },
          {
            value: '360983',
            label: '高安市',
          },
        ],
      },
      {
        value: '361000',
        label: '抚州市',
        children: [
          {
            value: '361002',
            label: '临川区',
          },
          {
            value: '361003',
            label: '东乡区',
          },
          {
            value: '361021',
            label: '南城县',
          },
          {
            value: '361022',
            label: '黎川县',
          },
          {
            value: '361023',
            label: '南丰县',
          },
          {
            value: '361024',
            label: '崇仁县',
          },
          {
            value: '361025',
            label: '乐安县',
          },
          {
            value: '361026',
            label: '宜黄县',
          },
          {
            value: '361027',
            label: '金溪县',
          },
          {
            value: '361028',
            label: '资溪县',
          },
          {
            value: '361030',
            label: '广昌县',
          },
        ],
      },
      {
        value: '361100',
        label: '上饶市',
        children: [
          {
            value: '361102',
            label: '信州区',
          },
          {
            value: '361103',
            label: '广丰区',
          },
          {
            value: '361121',
            label: '上饶县',
          },
          {
            value: '361123',
            label: '玉山县',
          },
          {
            value: '361124',
            label: '铅山县',
          },
          {
            value: '361125',
            label: '横峰县',
          },
          {
            value: '361126',
            label: '弋阳县',
          },
          {
            value: '361127',
            label: '余干县',
          },
          {
            value: '361128',
            label: '鄱阳县',
          },
          {
            value: '361129',
            label: '万年县',
          },
          {
            value: '361130',
            label: '婺源县',
          },
          {
            value: '361181',
            label: '德兴市',
          },
        ],
      },
    ],
  },
  {
    value: '370000',
    label: '山东省',
    children: [
      {
        value: '370100',
        label: '济南市',
        children: [
          {
            value: '370102',
            label: '历下区',
          },
          {
            value: '370103',
            label: '市中区',
          },
          {
            value: '370104',
            label: '槐荫区',
          },
          {
            value: '370105',
            label: '天桥区',
          },
          {
            value: '370112',
            label: '历城区',
          },
          {
            value: '370113',
            label: '长清区',
          },
          {
            value: '370114',
            label: '章丘区',
          },
          {
            value: '370124',
            label: '平阴县',
          },
          {
            value: '370125',
            label: '济阳县',
          },
          {
            value: '370126',
            label: '商河县',
          },
        ],
      },
      {
        value: '370200',
        label: '青岛市',
        children: [
          {
            value: '370202',
            label: '市南区',
          },
          {
            value: '370203',
            label: '市北区',
          },
          {
            value: '370211',
            label: '黄岛区',
          },
          {
            value: '370212',
            label: '崂山区',
          },
          {
            value: '370213',
            label: '李沧区',
          },
          {
            value: '370214',
            label: '城阳区',
          },
          {
            value: '370215',
            label: '即墨区',
          },
          {
            value: '370281',
            label: '胶州市',
          },
          {
            value: '370283',
            label: '平度市',
          },
          {
            value: '370285',
            label: '莱西市',
          },
        ],
      },
      {
        value: '370300',
        label: '淄博市',
        children: [
          {
            value: '370302',
            label: '淄川区',
          },
          {
            value: '370303',
            label: '张店区',
          },
          {
            value: '370304',
            label: '博山区',
          },
          {
            value: '370305',
            label: '临淄区',
          },
          {
            value: '370306',
            label: '周村区',
          },
          {
            value: '370321',
            label: '桓台县',
          },
          {
            value: '370322',
            label: '高青县',
          },
          {
            value: '370323',
            label: '沂源县',
          },
        ],
      },
      {
        value: '370400',
        label: '枣庄市',
        children: [
          {
            value: '370402',
            label: '市中区',
          },
          {
            value: '370403',
            label: '薛城区',
          },
          {
            value: '370404',
            label: '峄城区',
          },
          {
            value: '370405',
            label: '台儿庄区',
          },
          {
            value: '370406',
            label: '山亭区',
          },
          {
            value: '370481',
            label: '滕州市',
          },
        ],
      },
      {
        value: '370500',
        label: '东营市',
        children: [
          {
            value: '370502',
            label: '东营区',
          },
          {
            value: '370503',
            label: '河口区',
          },
          {
            value: '370505',
            label: '垦利区',
          },
          {
            value: '370522',
            label: '利津县',
          },
          {
            value: '370523',
            label: '广饶县',
          },
        ],
      },
      {
        value: '370600',
        label: '烟台市',
        children: [
          {
            value: '370602',
            label: '芝罘区',
          },
          {
            value: '370611',
            label: '福山区',
          },
          {
            value: '370612',
            label: '牟平区',
          },
          {
            value: '370613',
            label: '莱山区',
          },
          {
            value: '370634',
            label: '长岛县',
          },
          {
            value: '370681',
            label: '龙口市',
          },
          {
            value: '370682',
            label: '莱阳市',
          },
          {
            value: '370683',
            label: '莱州市',
          },
          {
            value: '370684',
            label: '蓬莱市',
          },
          {
            value: '370685',
            label: '招远市',
          },
          {
            value: '370686',
            label: '栖霞市',
          },
          {
            value: '370687',
            label: '海阳市',
          },
        ],
      },
      {
        value: '370700',
        label: '潍坊市',
        children: [
          {
            value: '370702',
            label: '潍城区',
          },
          {
            value: '370703',
            label: '寒亭区',
          },
          {
            value: '370704',
            label: '坊子区',
          },
          {
            value: '370705',
            label: '奎文区',
          },
          {
            value: '370724',
            label: '临朐县',
          },
          {
            value: '370725',
            label: '昌乐县',
          },
          {
            value: '370781',
            label: '青州市',
          },
          {
            value: '370782',
            label: '诸城市',
          },
          {
            value: '370783',
            label: '寿光市',
          },
          {
            value: '370784',
            label: '安丘市',
          },
          {
            value: '370785',
            label: '高密市',
          },
          {
            value: '370786',
            label: '昌邑市',
          },
        ],
      },
      {
        value: '370800',
        label: '济宁市',
        children: [
          {
            value: '370811',
            label: '任城区',
          },
          {
            value: '370812',
            label: '兖州区',
          },
          {
            value: '370826',
            label: '微山县',
          },
          {
            value: '370827',
            label: '鱼台县',
          },
          {
            value: '370828',
            label: '金乡县',
          },
          {
            value: '370829',
            label: '嘉祥县',
          },
          {
            value: '370830',
            label: '汶上县',
          },
          {
            value: '370831',
            label: '泗水县',
          },
          {
            value: '370832',
            label: '梁山县',
          },
          {
            value: '370881',
            label: '曲阜市',
          },
          {
            value: '370883',
            label: '邹城市',
          },
        ],
      },
      {
        value: '370900',
        label: '泰安市',
        children: [
          {
            value: '370902',
            label: '泰山区',
          },
          {
            value: '370911',
            label: '岱岳区',
          },
          {
            value: '370921',
            label: '宁阳县',
          },
          {
            value: '370923',
            label: '东平县',
          },
          {
            value: '370982',
            label: '新泰市',
          },
          {
            value: '370983',
            label: '肥城市',
          },
        ],
      },
      {
        value: '371000',
        label: '威海市',
        children: [
          {
            value: '371002',
            label: '环翠区',
          },
          {
            value: '371003',
            label: '文登区',
          },
          {
            value: '371082',
            label: '荣成市',
          },
          {
            value: '371083',
            label: '乳山市',
          },
        ],
      },
      {
        value: '371100',
        label: '日照市',
        children: [
          {
            value: '371102',
            label: '东港区',
          },
          {
            value: '371103',
            label: '岚山区',
          },
          {
            value: '371121',
            label: '五莲县',
          },
          {
            value: '371122',
            label: '莒县',
          },
        ],
      },
      {
        value: '371200',
        label: '莱芜市',
        children: [
          {
            value: '371202',
            label: '莱城区',
          },
          {
            value: '371203',
            label: '钢城区',
          },
        ],
      },
      {
        value: '371300',
        label: '临沂市',
        children: [
          {
            value: '371302',
            label: '兰山区',
          },
          {
            value: '371311',
            label: '罗庄区',
          },
          {
            value: '371312',
            label: '河东区',
          },
          {
            value: '371321',
            label: '沂南县',
          },
          {
            value: '371322',
            label: '郯城县',
          },
          {
            value: '371323',
            label: '沂水县',
          },
          {
            value: '371324',
            label: '兰陵县',
          },
          {
            value: '371325',
            label: '费县',
          },
          {
            value: '371326',
            label: '平邑县',
          },
          {
            value: '371327',
            label: '莒南县',
          },
          {
            value: '371328',
            label: '蒙阴县',
          },
          {
            value: '371329',
            label: '临沭县',
          },
        ],
      },
      {
        value: '371400',
        label: '德州市',
        children: [
          {
            value: '371402',
            label: '德城区',
          },
          {
            value: '371403',
            label: '陵城区',
          },
          {
            value: '371422',
            label: '宁津县',
          },
          {
            value: '371423',
            label: '庆云县',
          },
          {
            value: '371424',
            label: '临邑县',
          },
          {
            value: '371425',
            label: '齐河县',
          },
          {
            value: '371426',
            label: '平原县',
          },
          {
            value: '371427',
            label: '夏津县',
          },
          {
            value: '371428',
            label: '武城县',
          },
          {
            value: '371481',
            label: '乐陵市',
          },
          {
            value: '371482',
            label: '禹城市',
          },
        ],
      },
      {
        value: '371500',
        label: '聊城市',
        children: [
          {
            value: '371502',
            label: '东昌府区',
          },
          {
            value: '371521',
            label: '阳谷县',
          },
          {
            value: '371522',
            label: '莘县',
          },
          {
            value: '371523',
            label: '茌平县',
          },
          {
            value: '371524',
            label: '东阿县',
          },
          {
            value: '371525',
            label: '冠县',
          },
          {
            value: '371526',
            label: '高唐县',
          },
          {
            value: '371581',
            label: '临清市',
          },
        ],
      },
      {
        value: '371600',
        label: '滨州市',
        children: [
          {
            value: '371602',
            label: '滨城区',
          },
          {
            value: '371603',
            label: '沾化区',
          },
          {
            value: '371621',
            label: '惠民县',
          },
          {
            value: '371622',
            label: '阳信县',
          },
          {
            value: '371623',
            label: '无棣县',
          },
          {
            value: '371625',
            label: '博兴县',
          },
          {
            value: '371626',
            label: '邹平县',
          },
        ],
      },
      {
        value: '371700',
        label: '菏泽市',
        children: [
          {
            value: '371702',
            label: '牡丹区',
          },
          {
            value: '371703',
            label: '定陶区',
          },
          {
            value: '371721',
            label: '曹县',
          },
          {
            value: '371722',
            label: '单县',
          },
          {
            value: '371723',
            label: '成武县',
          },
          {
            value: '371724',
            label: '巨野县',
          },
          {
            value: '371725',
            label: '郓城县',
          },
          {
            value: '371726',
            label: '鄄城县',
          },
          {
            value: '371728',
            label: '东明县',
          },
        ],
      },
    ],
  },
  {
    value: '410000',
    label: '河南省',
    children: [
      {
        value: '410100',
        label: '郑州市',
        children: [
          {
            value: '410102',
            label: '中原区',
          },
          {
            value: '410103',
            label: '二七区',
          },
          {
            value: '410104',
            label: '管城回族区',
          },
          {
            value: '410105',
            label: '金水区',
          },
          {
            value: '410106',
            label: '上街区',
          },
          {
            value: '410108',
            label: '惠济区',
          },
          {
            value: '410122',
            label: '中牟县',
          },
          {
            value: '410181',
            label: '巩义市',
          },
          {
            value: '410182',
            label: '荥阳市',
          },
          {
            value: '410183',
            label: '新密市',
          },
          {
            value: '410184',
            label: '新郑市',
          },
          {
            value: '410185',
            label: '登封市',
          },
        ],
      },
      {
        value: '410200',
        label: '开封市',
        children: [
          {
            value: '410202',
            label: '龙亭区',
          },
          {
            value: '410203',
            label: '顺河回族区',
          },
          {
            value: '410204',
            label: '鼓楼区',
          },
          {
            value: '410205',
            label: '禹王台区',
          },
          {
            value: '410212',
            label: '祥符区',
          },
          {
            value: '410221',
            label: '杞县',
          },
          {
            value: '410222',
            label: '通许县',
          },
          {
            value: '410223',
            label: '尉氏县',
          },
          {
            value: '410225',
            label: '兰考县',
          },
        ],
      },
      {
        value: '410300',
        label: '洛阳市',
        children: [
          {
            value: '410302',
            label: '老城区',
          },
          {
            value: '410303',
            label: '西工区',
          },
          {
            value: '410304',
            label: '瀍河回族区',
          },
          {
            value: '410305',
            label: '涧西区',
          },
          {
            value: '410306',
            label: '吉利区',
          },
          {
            value: '410311',
            label: '洛龙区',
          },
          {
            value: '410322',
            label: '孟津县',
          },
          {
            value: '410323',
            label: '新安县',
          },
          {
            value: '410324',
            label: '栾川县',
          },
          {
            value: '410325',
            label: '嵩县',
          },
          {
            value: '410326',
            label: '汝阳县',
          },
          {
            value: '410327',
            label: '宜阳县',
          },
          {
            value: '410328',
            label: '洛宁县',
          },
          {
            value: '410329',
            label: '伊川县',
          },
          {
            value: '410381',
            label: '偃师市',
          },
        ],
      },
      {
        value: '410400',
        label: '平顶山市',
        children: [
          {
            value: '410402',
            label: '新华区',
          },
          {
            value: '410403',
            label: '卫东区',
          },
          {
            value: '410404',
            label: '石龙区',
          },
          {
            value: '410411',
            label: '湛河区',
          },
          {
            value: '410421',
            label: '宝丰县',
          },
          {
            value: '410422',
            label: '叶县',
          },
          {
            value: '410423',
            label: '鲁山县',
          },
          {
            value: '410425',
            label: '郏县',
          },
          {
            value: '410481',
            label: '舞钢市',
          },
          {
            value: '410482',
            label: '汝州市',
          },
        ],
      },
      {
        value: '410500',
        label: '安阳市',
        children: [
          {
            value: '410502',
            label: '文峰区',
          },
          {
            value: '410503',
            label: '北关区',
          },
          {
            value: '410505',
            label: '殷都区',
          },
          {
            value: '410506',
            label: '龙安区',
          },
          {
            value: '410522',
            label: '安阳县',
          },
          {
            value: '410523',
            label: '汤阴县',
          },
          {
            value: '410526',
            label: '滑县',
          },
          {
            value: '410527',
            label: '内黄县',
          },
          {
            value: '410581',
            label: '林州市',
          },
        ],
      },
      {
        value: '410600',
        label: '鹤壁市',
        children: [
          {
            value: '410602',
            label: '鹤山区',
          },
          {
            value: '410603',
            label: '山城区',
          },
          {
            value: '410611',
            label: '淇滨区',
          },
          {
            value: '410621',
            label: '浚县',
          },
          {
            value: '410622',
            label: '淇县',
          },
        ],
      },
      {
        value: '410700',
        label: '新乡市',
        children: [
          {
            value: '410702',
            label: '红旗区',
          },
          {
            value: '410703',
            label: '卫滨区',
          },
          {
            value: '410704',
            label: '凤泉区',
          },
          {
            value: '410711',
            label: '牧野区',
          },
          {
            value: '410721',
            label: '新乡县',
          },
          {
            value: '410724',
            label: '获嘉县',
          },
          {
            value: '410725',
            label: '原阳县',
          },
          {
            value: '410726',
            label: '延津县',
          },
          {
            value: '410727',
            label: '封丘县',
          },
          {
            value: '410728',
            label: '长垣县',
          },
          {
            value: '410781',
            label: '卫辉市',
          },
          {
            value: '410782',
            label: '辉县市',
          },
        ],
      },
      {
        value: '410800',
        label: '焦作市',
        children: [
          {
            value: '410802',
            label: '解放区',
          },
          {
            value: '410803',
            label: '中站区',
          },
          {
            value: '410804',
            label: '马村区',
          },
          {
            value: '410811',
            label: '山阳区',
          },
          {
            value: '410821',
            label: '修武县',
          },
          {
            value: '410822',
            label: '博爱县',
          },
          {
            value: '410823',
            label: '武陟县',
          },
          {
            value: '410825',
            label: '温县',
          },
          {
            value: '410882',
            label: '沁阳市',
          },
          {
            value: '410883',
            label: '孟州市',
          },
        ],
      },
      {
        value: '410900',
        label: '濮阳市',
        children: [
          {
            value: '410902',
            label: '华龙区',
          },
          {
            value: '410922',
            label: '清丰县',
          },
          {
            value: '410923',
            label: '南乐县',
          },
          {
            value: '410926',
            label: '范县',
          },
          {
            value: '410927',
            label: '台前县',
          },
          {
            value: '410928',
            label: '濮阳县',
          },
        ],
      },
      {
        value: '411000',
        label: '许昌市',
        children: [
          {
            value: '411002',
            label: '魏都区',
          },
          {
            value: '411003',
            label: '建安区',
          },
          {
            value: '411024',
            label: '鄢陵县',
          },
          {
            value: '411025',
            label: '襄城县',
          },
          {
            value: '411081',
            label: '禹州市',
          },
          {
            value: '411082',
            label: '长葛市',
          },
        ],
      },
      {
        value: '411100',
        label: '漯河市',
        children: [
          {
            value: '411102',
            label: '源汇区',
          },
          {
            value: '411103',
            label: '郾城区',
          },
          {
            value: '411104',
            label: '召陵区',
          },
          {
            value: '411121',
            label: '舞阳县',
          },
          {
            value: '411122',
            label: '临颍县',
          },
        ],
      },
      {
        value: '411200',
        label: '三门峡市',
        children: [
          {
            value: '411202',
            label: '湖滨区',
          },
          {
            value: '411203',
            label: '陕州区',
          },
          {
            value: '411221',
            label: '渑池县',
          },
          {
            value: '411224',
            label: '卢氏县',
          },
          {
            value: '411281',
            label: '义马市',
          },
          {
            value: '411282',
            label: '灵宝市',
          },
        ],
      },
      {
        value: '411300',
        label: '南阳市',
        children: [
          {
            value: '411302',
            label: '宛城区',
          },
          {
            value: '411303',
            label: '卧龙区',
          },
          {
            value: '411321',
            label: '南召县',
          },
          {
            value: '411322',
            label: '方城县',
          },
          {
            value: '411323',
            label: '西峡县',
          },
          {
            value: '411324',
            label: '镇平县',
          },
          {
            value: '411325',
            label: '内乡县',
          },
          {
            value: '411326',
            label: '淅川县',
          },
          {
            value: '411327',
            label: '社旗县',
          },
          {
            value: '411328',
            label: '唐河县',
          },
          {
            value: '411329',
            label: '新野县',
          },
          {
            value: '411330',
            label: '桐柏县',
          },
          {
            value: '411381',
            label: '邓州市',
          },
        ],
      },
      {
        value: '411400',
        label: '商丘市',
        children: [
          {
            value: '411402',
            label: '梁园区',
          },
          {
            value: '411403',
            label: '睢阳区',
          },
          {
            value: '411421',
            label: '民权县',
          },
          {
            value: '411422',
            label: '睢县',
          },
          {
            value: '411423',
            label: '宁陵县',
          },
          {
            value: '411424',
            label: '柘城县',
          },
          {
            value: '411425',
            label: '虞城县',
          },
          {
            value: '411426',
            label: '夏邑县',
          },
          {
            value: '411481',
            label: '永城市',
          },
        ],
      },
      {
        value: '411500',
        label: '信阳市',
        children: [
          {
            value: '411502',
            label: '浉河区',
          },
          {
            value: '411503',
            label: '平桥区',
          },
          {
            value: '411521',
            label: '罗山县',
          },
          {
            value: '411522',
            label: '光山县',
          },
          {
            value: '411523',
            label: '新县',
          },
          {
            value: '411524',
            label: '商城县',
          },
          {
            value: '411525',
            label: '固始县',
          },
          {
            value: '411526',
            label: '潢川县',
          },
          {
            value: '411527',
            label: '淮滨县',
          },
          {
            value: '411528',
            label: '息县',
          },
        ],
      },
      {
        value: '411600',
        label: '周口市',
        children: [
          {
            value: '411602',
            label: '川汇区',
          },
          {
            value: '411621',
            label: '扶沟县',
          },
          {
            value: '411622',
            label: '西华县',
          },
          {
            value: '411623',
            label: '商水县',
          },
          {
            value: '411624',
            label: '沈丘县',
          },
          {
            value: '411625',
            label: '郸城县',
          },
          {
            value: '411626',
            label: '淮阳县',
          },
          {
            value: '411627',
            label: '太康县',
          },
          {
            value: '411628',
            label: '鹿邑县',
          },
          {
            value: '411681',
            label: '项城市',
          },
        ],
      },
      {
        value: '411700',
        label: '驻马店市',
        children: [
          {
            value: '411702',
            label: '驿城区',
          },
          {
            value: '411721',
            label: '西平县',
          },
          {
            value: '411722',
            label: '上蔡县',
          },
          {
            value: '411723',
            label: '平舆县',
          },
          {
            value: '411724',
            label: '正阳县',
          },
          {
            value: '411725',
            label: '确山县',
          },
          {
            value: '411726',
            label: '泌阳县',
          },
          {
            value: '411727',
            label: '汝南县',
          },
          {
            value: '411728',
            label: '遂平县',
          },
          {
            value: '411729',
            label: '新蔡县',
          },
        ],
      },
      {
        value: '419001',
        label: '济源市',
        children: [
          {
            value: '419001',
            label: '济源市',
          },
        ],
      },
    ],
  },
  {
    value: '420000',
    label: '湖北省',
    children: [
      {
        value: '420100',
        label: '武汉市',
        children: [
          {
            value: '420102',
            label: '江岸区',
          },
          {
            value: '420103',
            label: '江汉区',
          },
          {
            value: '420104',
            label: '硚口区',
          },
          {
            value: '420105',
            label: '汉阳区',
          },
          {
            value: '420106',
            label: '武昌区',
          },
          {
            value: '420107',
            label: '青山区',
          },
          {
            value: '420111',
            label: '洪山区',
          },
          {
            value: '420112',
            label: '东西湖区',
          },
          {
            value: '420113',
            label: '汉南区',
          },
          {
            value: '420114',
            label: '蔡甸区',
          },
          {
            value: '420115',
            label: '江夏区',
          },
          {
            value: '420116',
            label: '黄陂区',
          },
          {
            value: '420117',
            label: '新洲区',
          },
        ],
      },
      {
        value: '420200',
        label: '黄石市',
        children: [
          {
            value: '420202',
            label: '黄石港区',
          },
          {
            value: '420203',
            label: '西塞山区',
          },
          {
            value: '420204',
            label: '下陆区',
          },
          {
            value: '420205',
            label: '铁山区',
          },
          {
            value: '420222',
            label: '阳新县',
          },
          {
            value: '420281',
            label: '大冶市',
          },
        ],
      },
      {
        value: '420300',
        label: '十堰市',
        children: [
          {
            value: '420302',
            label: '茅箭区',
          },
          {
            value: '420303',
            label: '张湾区',
          },
          {
            value: '420304',
            label: '郧阳区',
          },
          {
            value: '420322',
            label: '郧西县',
          },
          {
            value: '420323',
            label: '竹山县',
          },
          {
            value: '420324',
            label: '竹溪县',
          },
          {
            value: '420325',
            label: '房县',
          },
          {
            value: '420381',
            label: '丹江口市',
          },
        ],
      },
      {
        value: '420500',
        label: '宜昌市',
        children: [
          {
            value: '420502',
            label: '西陵区',
          },
          {
            value: '420503',
            label: '伍家岗区',
          },
          {
            value: '420504',
            label: '点军区',
          },
          {
            value: '420505',
            label: '猇亭区',
          },
          {
            value: '420506',
            label: '夷陵区',
          },
          {
            value: '420525',
            label: '远安县',
          },
          {
            value: '420526',
            label: '兴山县',
          },
          {
            value: '420527',
            label: '秭归县',
          },
          {
            value: '420528',
            label: '长阳土家族自治县',
          },
          {
            value: '420529',
            label: '五峰土家族自治县',
          },
          {
            value: '420581',
            label: '宜都市',
          },
          {
            value: '420582',
            label: '当阳市',
          },
          {
            value: '420583',
            label: '枝江市',
          },
        ],
      },
      {
        value: '420600',
        label: '襄阳市',
        children: [
          {
            value: '420602',
            label: '襄城区',
          },
          {
            value: '420606',
            label: '樊城区',
          },
          {
            value: '420607',
            label: '襄州区',
          },
          {
            value: '420624',
            label: '南漳县',
          },
          {
            value: '420625',
            label: '谷城县',
          },
          {
            value: '420626',
            label: '保康县',
          },
          {
            value: '420682',
            label: '老河口市',
          },
          {
            value: '420683',
            label: '枣阳市',
          },
          {
            value: '420684',
            label: '宜城市',
          },
        ],
      },
      {
        value: '420700',
        label: '鄂州市',
        children: [
          {
            value: '420702',
            label: '梁子湖区',
          },
          {
            value: '420703',
            label: '华容区',
          },
          {
            value: '420704',
            label: '鄂城区',
          },
        ],
      },
      {
        value: '420800',
        label: '荆门市',
        children: [
          {
            value: '420802',
            label: '东宝区',
          },
          {
            value: '420804',
            label: '掇刀区',
          },
          {
            value: '420822',
            label: '沙洋县',
          },
          {
            value: '420881',
            label: '钟祥市',
          },
          {
            value: '420882',
            label: '京山市',
          },
        ],
      },
      {
        value: '420900',
        label: '孝感市',
        children: [
          {
            value: '420902',
            label: '孝南区',
          },
          {
            value: '420921',
            label: '孝昌县',
          },
          {
            value: '420922',
            label: '大悟县',
          },
          {
            value: '420923',
            label: '云梦县',
          },
          {
            value: '420981',
            label: '应城市',
          },
          {
            value: '420982',
            label: '安陆市',
          },
          {
            value: '420984',
            label: '汉川市',
          },
        ],
      },
      {
        value: '421000',
        label: '荆州市',
        children: [
          {
            value: '421002',
            label: '沙市区',
          },
          {
            value: '421003',
            label: '荆州区',
          },
          {
            value: '421022',
            label: '公安县',
          },
          {
            value: '421023',
            label: '监利县',
          },
          {
            value: '421024',
            label: '江陵县',
          },
          {
            value: '421081',
            label: '石首市',
          },
          {
            value: '421083',
            label: '洪湖市',
          },
          {
            value: '421087',
            label: '松滋市',
          },
        ],
      },
      {
        value: '421100',
        label: '黄冈市',
        children: [
          {
            value: '421102',
            label: '黄州区',
          },
          {
            value: '421121',
            label: '团风县',
          },
          {
            value: '421122',
            label: '红安县',
          },
          {
            value: '421123',
            label: '罗田县',
          },
          {
            value: '421124',
            label: '英山县',
          },
          {
            value: '421125',
            label: '浠水县',
          },
          {
            value: '421126',
            label: '蕲春县',
          },
          {
            value: '421127',
            label: '黄梅县',
          },
          {
            value: '421181',
            label: '麻城市',
          },
          {
            value: '421182',
            label: '武穴市',
          },
        ],
      },
      {
        value: '421200',
        label: '咸宁市',
        children: [
          {
            value: '421202',
            label: '咸安区',
          },
          {
            value: '421221',
            label: '嘉鱼县',
          },
          {
            value: '421222',
            label: '通城县',
          },
          {
            value: '421223',
            label: '崇阳县',
          },
          {
            value: '421224',
            label: '通山县',
          },
          {
            value: '421281',
            label: '赤壁市',
          },
        ],
      },
      {
        value: '421300',
        label: '随州市',
        children: [
          {
            value: '421303',
            label: '曾都区',
          },
          {
            value: '421321',
            label: '随县',
          },
          {
            value: '421381',
            label: '广水市',
          },
        ],
      },
      {
        value: '422800',
        label: '恩施土家族苗族自治州',
        children: [
          {
            value: '422801',
            label: '恩施市',
          },
          {
            value: '422802',
            label: '利川市',
          },
          {
            value: '422822',
            label: '建始县',
          },
          {
            value: '422823',
            label: '巴东县',
          },
          {
            value: '422825',
            label: '宣恩县',
          },
          {
            value: '422826',
            label: '咸丰县',
          },
          {
            value: '422827',
            label: '来凤县',
          },
          {
            value: '422828',
            label: '鹤峰县',
          },
        ],
      },
      {
        value: '429004',
        label: '仙桃市',
        children: [
          {
            value: '429004',
            label: '仙桃市',
          },
        ],
      },
      {
        value: '429005',
        label: '潜江市',
        children: [
          {
            value: '429004',
            label: '仙桃市',
          },
        ],
      },
      {
        value: '429006',
        label: '天门市',
        children: [
          {
            value: '429004',
            label: '仙桃市',
          },
        ],
      },
      {
        value: '429021',
        label: '神农架林区',
        children: [
          {
            value: '429004',
            label: '仙桃市',
          },
        ],
      },
    ],
  },
  {
    value: '430000',
    label: '湖南省',
    children: [
      {
        value: '430100',
        label: '长沙市',
        children: [
          {
            value: '430102',
            label: '芙蓉区',
          },
          {
            value: '430103',
            label: '天心区',
          },
          {
            value: '430104',
            label: '岳麓区',
          },
          {
            value: '430105',
            label: '开福区',
          },
          {
            value: '430111',
            label: '雨花区',
          },
          {
            value: '430112',
            label: '望城区',
          },
          {
            value: '430121',
            label: '长沙县',
          },
          {
            value: '430181',
            label: '浏阳市',
          },
          {
            value: '430182',
            label: '宁乡市',
          },
        ],
      },
      {
        value: '430200',
        label: '株洲市',
        children: [
          {
            value: '430202',
            label: '荷塘区',
          },
          {
            value: '430203',
            label: '芦淞区',
          },
          {
            value: '430204',
            label: '石峰区',
          },
          {
            value: '430211',
            label: '天元区',
          },
          {
            value: '430221',
            label: '株洲县',
          },
          {
            value: '430223',
            label: '攸县',
          },
          {
            value: '430224',
            label: '茶陵县',
          },
          {
            value: '430225',
            label: '炎陵县',
          },
          {
            value: '430281',
            label: '醴陵市',
          },
        ],
      },
      {
        value: '430300',
        label: '湘潭市',
        children: [
          {
            value: '430302',
            label: '雨湖区',
          },
          {
            value: '430304',
            label: '岳塘区',
          },
          {
            value: '430321',
            label: '湘潭县',
          },
          {
            value: '430381',
            label: '湘乡市',
          },
          {
            value: '430382',
            label: '韶山市',
          },
        ],
      },
      {
        value: '430400',
        label: '衡阳市',
        children: [
          {
            value: '430405',
            label: '珠晖区',
          },
          {
            value: '430406',
            label: '雁峰区',
          },
          {
            value: '430407',
            label: '石鼓区',
          },
          {
            value: '430408',
            label: '蒸湘区',
          },
          {
            value: '430412',
            label: '南岳区',
          },
          {
            value: '430421',
            label: '衡阳县',
          },
          {
            value: '430422',
            label: '衡南县',
          },
          {
            value: '430423',
            label: '衡山县',
          },
          {
            value: '430424',
            label: '衡东县',
          },
          {
            value: '430426',
            label: '祁东县',
          },
          {
            value: '430481',
            label: '耒阳市',
          },
          {
            value: '430482',
            label: '常宁市',
          },
        ],
      },
      {
        value: '430500',
        label: '邵阳市',
        children: [
          {
            value: '430502',
            label: '双清区',
          },
          {
            value: '430503',
            label: '大祥区',
          },
          {
            value: '430511',
            label: '北塔区',
          },
          {
            value: '430521',
            label: '邵东县',
          },
          {
            value: '430522',
            label: '新邵县',
          },
          {
            value: '430523',
            label: '邵阳县',
          },
          {
            value: '430524',
            label: '隆回县',
          },
          {
            value: '430525',
            label: '洞口县',
          },
          {
            value: '430527',
            label: '绥宁县',
          },
          {
            value: '430528',
            label: '新宁县',
          },
          {
            value: '430529',
            label: '城步苗族自治县',
          },
          {
            value: '430581',
            label: '武冈市',
          },
        ],
      },
      {
        value: '430600',
        label: '岳阳市',
        children: [
          {
            value: '430602',
            label: '岳阳楼区',
          },
          {
            value: '430603',
            label: '云溪区',
          },
          {
            value: '430611',
            label: '君山区',
          },
          {
            value: '430621',
            label: '岳阳县',
          },
          {
            value: '430623',
            label: '华容县',
          },
          {
            value: '430624',
            label: '湘阴县',
          },
          {
            value: '430626',
            label: '平江县',
          },
          {
            value: '430681',
            label: '汨罗市',
          },
          {
            value: '430682',
            label: '临湘市',
          },
        ],
      },
      {
        value: '430700',
        label: '常德市',
        children: [
          {
            value: '430702',
            label: '武陵区',
          },
          {
            value: '430703',
            label: '鼎城区',
          },
          {
            value: '430721',
            label: '安乡县',
          },
          {
            value: '430722',
            label: '汉寿县',
          },
          {
            value: '430723',
            label: '澧县',
          },
          {
            value: '430724',
            label: '临澧县',
          },
          {
            value: '430725',
            label: '桃源县',
          },
          {
            value: '430726',
            label: '石门县',
          },
          {
            value: '430781',
            label: '津市市',
          },
        ],
      },
      {
        value: '430800',
        label: '张家界市',
        children: [
          {
            value: '430802',
            label: '永定区',
          },
          {
            value: '430811',
            label: '武陵源区',
          },
          {
            value: '430821',
            label: '慈利县',
          },
          {
            value: '430822',
            label: '桑植县',
          },
        ],
      },
      {
        value: '430900',
        label: '益阳市',
        children: [
          {
            value: '430902',
            label: '资阳区',
          },
          {
            value: '430903',
            label: '赫山区',
          },
          {
            value: '430921',
            label: '南县',
          },
          {
            value: '430922',
            label: '桃江县',
          },
          {
            value: '430923',
            label: '安化县',
          },
          {
            value: '430981',
            label: '沅江市',
          },
        ],
      },
      {
        value: '431000',
        label: '郴州市',
        children: [
          {
            value: '431002',
            label: '北湖区',
          },
          {
            value: '431003',
            label: '苏仙区',
          },
          {
            value: '431021',
            label: '桂阳县',
          },
          {
            value: '431022',
            label: '宜章县',
          },
          {
            value: '431023',
            label: '永兴县',
          },
          {
            value: '431024',
            label: '嘉禾县',
          },
          {
            value: '431025',
            label: '临武县',
          },
          {
            value: '431026',
            label: '汝城县',
          },
          {
            value: '431027',
            label: '桂东县',
          },
          {
            value: '431028',
            label: '安仁县',
          },
          {
            value: '431081',
            label: '资兴市',
          },
        ],
      },
      {
        value: '431100',
        label: '永州市',
        children: [
          {
            value: '431102',
            label: '零陵区',
          },
          {
            value: '431103',
            label: '冷水滩区',
          },
          {
            value: '431121',
            label: '祁阳县',
          },
          {
            value: '431122',
            label: '东安县',
          },
          {
            value: '431123',
            label: '双牌县',
          },
          {
            value: '431124',
            label: '道县',
          },
          {
            value: '431125',
            label: '江永县',
          },
          {
            value: '431126',
            label: '宁远县',
          },
          {
            value: '431127',
            label: '蓝山县',
          },
          {
            value: '431128',
            label: '新田县',
          },
          {
            value: '431129',
            label: '江华瑶族自治县',
          },
        ],
      },
      {
        value: '431200',
        label: '怀化市',
        children: [
          {
            value: '431202',
            label: '鹤城区',
          },
          {
            value: '431221',
            label: '中方县',
          },
          {
            value: '431222',
            label: '沅陵县',
          },
          {
            value: '431223',
            label: '辰溪县',
          },
          {
            value: '431224',
            label: '溆浦县',
          },
          {
            value: '431225',
            label: '会同县',
          },
          {
            value: '431226',
            label: '麻阳苗族自治县',
          },
          {
            value: '431227',
            label: '新晃侗族自治县',
          },
          {
            value: '431228',
            label: '芷江侗族自治县',
          },
          {
            value: '431229',
            label: '靖州苗族侗族自治县',
          },
          {
            value: '431230',
            label: '通道侗族自治县',
          },
          {
            value: '431281',
            label: '洪江市',
          },
        ],
      },
      {
        value: '431300',
        label: '娄底市',
        children: [
          {
            value: '431302',
            label: '娄星区',
          },
          {
            value: '431321',
            label: '双峰县',
          },
          {
            value: '431322',
            label: '新化县',
          },
          {
            value: '431381',
            label: '冷水江市',
          },
          {
            value: '431382',
            label: '涟源市',
          },
        ],
      },
      {
        value: '433100',
        label: '湘西土家族苗族自治州',
        children: [
          {
            value: '433101',
            label: '吉首市',
          },
          {
            value: '433122',
            label: '泸溪县',
          },
          {
            value: '433123',
            label: '凤凰县',
          },
          {
            value: '433124',
            label: '花垣县',
          },
          {
            value: '433125',
            label: '保靖县',
          },
          {
            value: '433126',
            label: '古丈县',
          },
          {
            value: '433127',
            label: '永顺县',
          },
          {
            value: '433130',
            label: '龙山县',
          },
        ],
      },
    ],
  },
  {
    value: '440000',
    label: '广东省',
    children: [
      {
        value: '440100',
        label: '广州市',
        children: [
          {
            value: '440103',
            label: '荔湾区',
          },
          {
            value: '440104',
            label: '越秀区',
          },
          {
            value: '440105',
            label: '海珠区',
          },
          {
            value: '440106',
            label: '天河区',
          },
          {
            value: '440111',
            label: '白云区',
          },
          {
            value: '440112',
            label: '黄埔区',
          },
          {
            value: '440113',
            label: '番禺区',
          },
          {
            value: '440114',
            label: '花都区',
          },
          {
            value: '440115',
            label: '南沙区',
          },
          {
            value: '440117',
            label: '从化区',
          },
          {
            value: '440118',
            label: '增城区',
          },
        ],
      },
      {
        value: '440200',
        label: '韶关市',
        children: [
          {
            value: '440203',
            label: '武江区',
          },
          {
            value: '440204',
            label: '浈江区',
          },
          {
            value: '440205',
            label: '曲江区',
          },
          {
            value: '440222',
            label: '始兴县',
          },
          {
            value: '440224',
            label: '仁化县',
          },
          {
            value: '440229',
            label: '翁源县',
          },
          {
            value: '440232',
            label: '乳源瑶族自治县',
          },
          {
            value: '440233',
            label: '新丰县',
          },
          {
            value: '440281',
            label: '乐昌市',
          },
          {
            value: '440282',
            label: '南雄市',
          },
        ],
      },
      {
        value: '440300',
        label: '深圳市',
        children: [
          {
            value: '440303',
            label: '罗湖区',
          },
          {
            value: '440304',
            label: '福田区',
          },
          {
            value: '440305',
            label: '南山区',
          },
          {
            value: '440306',
            label: '宝安区',
          },
          {
            value: '440307',
            label: '龙岗区',
          },
          {
            value: '440308',
            label: '盐田区',
          },
          {
            value: '440309',
            label: '龙华区',
          },
          {
            value: '440310',
            label: '坪山区',
          },
          {
            value: '440311',
            label: '光明区',
          },
        ],
      },
      {
        value: '440400',
        label: '珠海市',
        children: [
          {
            value: '440402',
            label: '香洲区',
          },
          {
            value: '440403',
            label: '斗门区',
          },
          {
            value: '440404',
            label: '金湾区',
          },
        ],
      },
      {
        value: '440500',
        label: '汕头市',
        children: [
          {
            value: '440507',
            label: '龙湖区',
          },
          {
            value: '440511',
            label: '金平区',
          },
          {
            value: '440512',
            label: '濠江区',
          },
          {
            value: '440513',
            label: '潮阳区',
          },
          {
            value: '440514',
            label: '潮南区',
          },
          {
            value: '440515',
            label: '澄海区',
          },
          {
            value: '440523',
            label: '南澳县',
          },
        ],
      },
      {
        value: '440600',
        label: '佛山市',
        children: [
          {
            value: '440604',
            label: '禅城区',
          },
          {
            value: '440605',
            label: '南海区',
          },
          {
            value: '440606',
            label: '顺德区',
          },
          {
            value: '440607',
            label: '三水区',
          },
          {
            value: '440608',
            label: '高明区',
          },
        ],
      },
      {
        value: '440700',
        label: '江门市',
        children: [
          {
            value: '440703',
            label: '蓬江区',
          },
          {
            value: '440704',
            label: '江海区',
          },
          {
            value: '440705',
            label: '新会区',
          },
          {
            value: '440781',
            label: '台山市',
          },
          {
            value: '440783',
            label: '开平市',
          },
          {
            value: '440784',
            label: '鹤山市',
          },
          {
            value: '440785',
            label: '恩平市',
          },
        ],
      },
      {
        value: '440800',
        label: '湛江市',
        children: [
          {
            value: '440802',
            label: '赤坎区',
          },
          {
            value: '440803',
            label: '霞山区',
          },
          {
            value: '440804',
            label: '坡头区',
          },
          {
            value: '440811',
            label: '麻章区',
          },
          {
            value: '440823',
            label: '遂溪县',
          },
          {
            value: '440825',
            label: '徐闻县',
          },
          {
            value: '440881',
            label: '廉江市',
          },
          {
            value: '440882',
            label: '雷州市',
          },
          {
            value: '440883',
            label: '吴川市',
          },
        ],
      },
      {
        value: '440900',
        label: '茂名市',
        children: [
          {
            value: '440902',
            label: '茂南区',
          },
          {
            value: '440904',
            label: '电白区',
          },
          {
            value: '440981',
            label: '高州市',
          },
          {
            value: '440982',
            label: '化州市',
          },
          {
            value: '440983',
            label: '信宜市',
          },
        ],
      },
      {
        value: '441200',
        label: '肇庆市',
        children: [
          {
            value: '441202',
            label: '端州区',
          },
          {
            value: '441203',
            label: '鼎湖区',
          },
          {
            value: '441204',
            label: '高要区',
          },
          {
            value: '441223',
            label: '广宁县',
          },
          {
            value: '441224',
            label: '怀集县',
          },
          {
            value: '441225',
            label: '封开县',
          },
          {
            value: '441226',
            label: '德庆县',
          },
          {
            value: '441284',
            label: '四会市',
          },
        ],
      },
      {
        value: '441300',
        label: '惠州市',
        children: [
          {
            value: '441302',
            label: '惠城区',
          },
          {
            value: '441303',
            label: '惠阳区',
          },
          {
            value: '441322',
            label: '博罗县',
          },
          {
            value: '441323',
            label: '惠东县',
          },
          {
            value: '441324',
            label: '龙门县',
          },
        ],
      },
      {
        value: '441400',
        label: '梅州市',
        children: [
          {
            value: '441402',
            label: '梅江区',
          },
          {
            value: '441403',
            label: '梅县区',
          },
          {
            value: '441422',
            label: '大埔县',
          },
          {
            value: '441423',
            label: '丰顺县',
          },
          {
            value: '441424',
            label: '五华县',
          },
          {
            value: '441426',
            label: '平远县',
          },
          {
            value: '441427',
            label: '蕉岭县',
          },
          {
            value: '441481',
            label: '兴宁市',
          },
        ],
      },
      {
        value: '441500',
        label: '汕尾市',
        children: [
          {
            value: '441502',
            label: '城区',
          },
          {
            value: '441521',
            label: '海丰县',
          },
          {
            value: '441523',
            label: '陆河县',
          },
          {
            value: '441581',
            label: '陆丰市',
          },
        ],
      },
      {
        value: '441600',
        label: '河源市',
        children: [
          {
            value: '441602',
            label: '源城区',
          },
          {
            value: '441621',
            label: '紫金县',
          },
          {
            value: '441622',
            label: '龙川县',
          },
          {
            value: '441623',
            label: '连平县',
          },
          {
            value: '441624',
            label: '和平县',
          },
          {
            value: '441625',
            label: '东源县',
          },
        ],
      },
      {
        value: '441700',
        label: '阳江市',
        children: [
          {
            value: '441702',
            label: '江城区',
          },
          {
            value: '441704',
            label: '阳东区',
          },
          {
            value: '441721',
            label: '阳西县',
          },
          {
            value: '441781',
            label: '阳春市',
          },
        ],
      },
      {
        value: '441800',
        label: '清远市',
        children: [
          {
            value: '441802',
            label: '清城区',
          },
          {
            value: '441803',
            label: '清新区',
          },
          {
            value: '441821',
            label: '佛冈县',
          },
          {
            value: '441823',
            label: '阳山县',
          },
          {
            value: '441825',
            label: '连山壮族瑶族自治县',
          },
          {
            value: '441826',
            label: '连南瑶族自治县',
          },
          {
            value: '441881',
            label: '英德市',
          },
          {
            value: '441882',
            label: '连州市',
          },
        ],
      },
      {
        value: '441900',
        label: '东莞市',
        children: [
          {
            value: '441900',
            label: '东莞市',
          },
        ],
      },
      {
        value: '442000',
        label: '中山市',
        children: [
          {
            value: '442000',
            label: '中山市',
          },
        ],
      },
      {
        value: '445100',
        label: '潮州市',
        children: [
          {
            value: '445102',
            label: '湘桥区',
          },
          {
            value: '445103',
            label: '潮安区',
          },
          {
            value: '445122',
            label: '饶平县',
          },
        ],
      },
      {
        value: '445200',
        label: '揭阳市',
        children: [
          {
            value: '445202',
            label: '榕城区',
          },
          {
            value: '445203',
            label: '揭东区',
          },
          {
            value: '445222',
            label: '揭西县',
          },
          {
            value: '445224',
            label: '惠来县',
          },
          {
            value: '445281',
            label: '普宁市',
          },
        ],
      },
      {
        value: '445300',
        label: '云浮市',
        children: [
          {
            value: '445302',
            label: '云城区',
          },
          {
            value: '445303',
            label: '云安区',
          },
          {
            value: '445321',
            label: '新兴县',
          },
          {
            value: '445322',
            label: '郁南县',
          },
          {
            value: '445381',
            label: '罗定市',
          },
        ],
      },
    ],
  },
  {
    value: '450000',
    label: '广西壮族自治区',
    children: [
      {
        value: '450100',
        label: '南宁市',
        children: [
          {
            value: '450102',
            label: '兴宁区',
          },
          {
            value: '450103',
            label: '青秀区',
          },
          {
            value: '450105',
            label: '江南区',
          },
          {
            value: '450107',
            label: '西乡塘区',
          },
          {
            value: '450108',
            label: '良庆区',
          },
          {
            value: '450109',
            label: '邕宁区',
          },
          {
            value: '450110',
            label: '武鸣区',
          },
          {
            value: '450123',
            label: '隆安县',
          },
          {
            value: '450124',
            label: '马山县',
          },
          {
            value: '450125',
            label: '上林县',
          },
          {
            value: '450126',
            label: '宾阳县',
          },
          {
            value: '450127',
            label: '横县',
          },
        ],
      },
      {
        value: '450200',
        label: '柳州市',
        children: [
          {
            value: '450202',
            label: '城中区',
          },
          {
            value: '450203',
            label: '鱼峰区',
          },
          {
            value: '450204',
            label: '柳南区',
          },
          {
            value: '450205',
            label: '柳北区',
          },
          {
            value: '450206',
            label: '柳江区',
          },
          {
            value: '450222',
            label: '柳城县',
          },
          {
            value: '450223',
            label: '鹿寨县',
          },
          {
            value: '450224',
            label: '融安县',
          },
          {
            value: '450225',
            label: '融水苗族自治县',
          },
          {
            value: '450226',
            label: '三江侗族自治县',
          },
        ],
      },
      {
        value: '450300',
        label: '桂林市',
        children: [
          {
            value: '450302',
            label: '秀峰区',
          },
          {
            value: '450303',
            label: '叠彩区',
          },
          {
            value: '450304',
            label: '象山区',
          },
          {
            value: '450305',
            label: '七星区',
          },
          {
            value: '450311',
            label: '雁山区',
          },
          {
            value: '450312',
            label: '临桂区',
          },
          {
            value: '450321',
            label: '阳朔县',
          },
          {
            value: '450323',
            label: '灵川县',
          },
          {
            value: '450324',
            label: '全州县',
          },
          {
            value: '450325',
            label: '兴安县',
          },
          {
            value: '450326',
            label: '永福县',
          },
          {
            value: '450327',
            label: '灌阳县',
          },
          {
            value: '450328',
            label: '龙胜各族自治县',
          },
          {
            value: '450329',
            label: '资源县',
          },
          {
            value: '450330',
            label: '平乐县',
          },
          {
            value: '450331',
            label: '荔浦县',
          },
          {
            value: '450332',
            label: '恭城瑶族自治县',
          },
        ],
      },
      {
        value: '450400',
        label: '梧州市',
        children: [
          {
            value: '450403',
            label: '万秀区',
          },
          {
            value: '450405',
            label: '长洲区',
          },
          {
            value: '450406',
            label: '龙圩区',
          },
          {
            value: '450421',
            label: '苍梧县',
          },
          {
            value: '450422',
            label: '藤县',
          },
          {
            value: '450423',
            label: '蒙山县',
          },
          {
            value: '450481',
            label: '岑溪市',
          },
        ],
      },
      {
        value: '450500',
        label: '北海市',
        children: [
          {
            value: '450502',
            label: '海城区',
          },
          {
            value: '450503',
            label: '银海区',
          },
          {
            value: '450512',
            label: '铁山港区',
          },
          {
            value: '450521',
            label: '合浦县',
          },
        ],
      },
      {
        value: '450600',
        label: '防城港市',
        children: [
          {
            value: '450602',
            label: '港口区',
          },
          {
            value: '450603',
            label: '防城区',
          },
          {
            value: '450621',
            label: '上思县',
          },
          {
            value: '450681',
            label: '东兴市',
          },
        ],
      },
      {
        value: '450700',
        label: '钦州市',
        children: [
          {
            value: '450702',
            label: '钦南区',
          },
          {
            value: '450703',
            label: '钦北区',
          },
          {
            value: '450721',
            label: '灵山县',
          },
          {
            value: '450722',
            label: '浦北县',
          },
        ],
      },
      {
        value: '450800',
        label: '贵港市',
        children: [
          {
            value: '450802',
            label: '港北区',
          },
          {
            value: '450803',
            label: '港南区',
          },
          {
            value: '450804',
            label: '覃塘区',
          },
          {
            value: '450821',
            label: '平南县',
          },
          {
            value: '450881',
            label: '桂平市',
          },
        ],
      },
      {
        value: '450900',
        label: '玉林市',
        children: [
          {
            value: '450902',
            label: '玉州区',
          },
          {
            value: '450903',
            label: '福绵区',
          },
          {
            value: '450921',
            label: '容县',
          },
          {
            value: '450922',
            label: '陆川县',
          },
          {
            value: '450923',
            label: '博白县',
          },
          {
            value: '450924',
            label: '兴业县',
          },
          {
            value: '450981',
            label: '北流市',
          },
        ],
      },
      {
        value: '451000',
        label: '百色市',
        children: [
          {
            value: '451002',
            label: '右江区',
          },
          {
            value: '451021',
            label: '田阳县',
          },
          {
            value: '451022',
            label: '田东县',
          },
          {
            value: '451023',
            label: '平果县',
          },
          {
            value: '451024',
            label: '德保县',
          },
          {
            value: '451026',
            label: '那坡县',
          },
          {
            value: '451027',
            label: '凌云县',
          },
          {
            value: '451028',
            label: '乐业县',
          },
          {
            value: '451029',
            label: '田林县',
          },
          {
            value: '451030',
            label: '西林县',
          },
          {
            value: '451031',
            label: '隆林各族自治县',
          },
          {
            value: '451081',
            label: '靖西市',
          },
        ],
      },
      {
        value: '451100',
        label: '贺州市',
        children: [
          {
            value: '451102',
            label: '八步区',
          },
          {
            value: '451103',
            label: '平桂区',
          },
          {
            value: '451121',
            label: '昭平县',
          },
          {
            value: '451122',
            label: '钟山县',
          },
          {
            value: '451123',
            label: '富川瑶族自治县',
          },
        ],
      },
      {
        value: '451200',
        label: '河池市',
        children: [
          {
            value: '451202',
            label: '金城江区',
          },
          {
            value: '451203',
            label: '宜州区',
          },
          {
            value: '451221',
            label: '南丹县',
          },
          {
            value: '451222',
            label: '天峨县',
          },
          {
            value: '451223',
            label: '凤山县',
          },
          {
            value: '451224',
            label: '东兰县',
          },
          {
            value: '451225',
            label: '罗城仫佬族自治县',
          },
          {
            value: '451226',
            label: '环江毛南族自治县',
          },
          {
            value: '451227',
            label: '巴马瑶族自治县',
          },
          {
            value: '451228',
            label: '都安瑶族自治县',
          },
          {
            value: '451229',
            label: '大化瑶族自治县',
          },
        ],
      },
      {
        value: '451300',
        label: '来宾市',
        children: [
          {
            value: '451302',
            label: '兴宾区',
          },
          {
            value: '451321',
            label: '忻城县',
          },
          {
            value: '451322',
            label: '象州县',
          },
          {
            value: '451323',
            label: '武宣县',
          },
          {
            value: '451324',
            label: '金秀瑶族自治县',
          },
          {
            value: '451381',
            label: '合山市',
          },
        ],
      },
      {
        value: '451400',
        label: '崇左市',
        children: [
          {
            value: '451402',
            label: '江州区',
          },
          {
            value: '451421',
            label: '扶绥县',
          },
          {
            value: '451422',
            label: '宁明县',
          },
          {
            value: '451423',
            label: '龙州县',
          },
          {
            value: '451424',
            label: '大新县',
          },
          {
            value: '451425',
            label: '天等县',
          },
          {
            value: '451481',
            label: '凭祥市',
          },
        ],
      },
    ],
  },
  {
    value: '460000',
    label: '海南省',
    children: [
      {
        value: '460100',
        label: '海口市',
        children: [
          {
            value: '460105',
            label: '秀英区',
          },
          {
            value: '460106',
            label: '龙华区',
          },
          {
            value: '460107',
            label: '琼山区',
          },
          {
            value: '460108',
            label: '美兰区',
          },
        ],
      },
      {
        value: '460200',
        label: '三亚市',
        children: [
          {
            value: '460202',
            label: '海棠区',
          },
          {
            value: '460203',
            label: '吉阳区',
          },
          {
            value: '460204',
            label: '天涯区',
          },
          {
            value: '460205',
            label: '崖州区',
          },
        ],
      },
      {
        value: '460300',
        label: '三沙市',
        children: [
          {
            value: '460300',
            label: '三沙市',
          },
        ],
      },
      {
        value: '460400',
        label: '儋州市',
        children: [
          {
            value: '460400',
            label: '儋州市',
          },
        ],
      },
      {
        value: '469001',
        label: '五指山市',
        children: [
          {
            value: '469002',
            label: '琼海市',
          },
          {
            value: '469005',
            label: '文昌市',
          },
          {
            value: '469006',
            label: '万宁市',
          },
          {
            value: '469007',
            label: '东方市',
          },
          {
            value: '469021',
            label: '定安县',
          },
          {
            value: '469022',
            label: '屯昌县',
          },
          {
            value: '469023',
            label: '澄迈县',
          },
          {
            value: '469024',
            label: '临高县',
          },
          {
            value: '469025',
            label: '白沙黎族自治县',
          },
          {
            value: '469026',
            label: '昌江黎族自治县',
          },
          {
            value: '469027',
            label: '乐东黎族自治县',
          },
          {
            value: '469028',
            label: '陵水黎族自治县',
          },
          {
            value: '469029',
            label: '保亭黎族苗族自治县',
          },
          {
            value: '469030',
            label: '琼中黎族苗族自治县',
          },
        ],
      },
    ],
  },
  {
    value: '500000',
    label: '重庆',
    children: [
      {
        value: '500000',
        label: '重庆市',
        children: [
          {
            value: '500101',
            label: '万州区',
          },
          {
            value: '500102',
            label: '涪陵区',
          },
          {
            value: '500103',
            label: '渝中区',
          },
          {
            value: '500104',
            label: '大渡口区',
          },
          {
            value: '500105',
            label: '江北区',
          },
          {
            value: '500106',
            label: '沙坪坝区',
          },
          {
            value: '500107',
            label: '九龙坡区',
          },
          {
            value: '500108',
            label: '南岸区',
          },
          {
            value: '500109',
            label: '北碚区',
          },
          {
            value: '500110',
            label: '綦江区',
          },
          {
            value: '500111',
            label: '大足区',
          },
          {
            value: '500112',
            label: '渝北区',
          },
          {
            value: '500113',
            label: '巴南区',
          },
          {
            value: '500114',
            label: '黔江区',
          },
          {
            value: '500115',
            label: '长寿区',
          },
          {
            value: '500116',
            label: '江津区',
          },
          {
            value: '500117',
            label: '合川区',
          },
          {
            value: '500118',
            label: '永川区',
          },
          {
            value: '500119',
            label: '南川区',
          },
          {
            value: '500120',
            label: '璧山区',
          },
          {
            value: '500151',
            label: '铜梁区',
          },
          {
            value: '500152',
            label: '潼南区',
          },
          {
            value: '500153',
            label: '荣昌区',
          },
          {
            value: '500154',
            label: '开州区',
          },
          {
            value: '500155',
            label: '梁平区',
          },
          {
            value: '500156',
            label: '武隆区',
          },
        ],
      },
    ],
  },
  {
    value: '510000',
    label: '四川省',
    children: [
      {
        value: '510100',
        label: '成都市',
        children: [
          {
            value: '510104',
            label: '锦江区',
          },
          {
            value: '510105',
            label: '青羊区',
          },
          {
            value: '510106',
            label: '金牛区',
          },
          {
            value: '510107',
            label: '武侯区',
          },
          {
            value: '510108',
            label: '成华区',
          },
          {
            value: '510112',
            label: '龙泉驿区',
          },
          {
            value: '510113',
            label: '青白江区',
          },
          {
            value: '510114',
            label: '新都区',
          },
          {
            value: '510115',
            label: '温江区',
          },
          {
            value: '510116',
            label: '双流区',
          },
          {
            value: '510117',
            label: '郫都区',
          },
          {
            value: '510121',
            label: '金堂县',
          },
          {
            value: '510129',
            label: '大邑县',
          },
          {
            value: '510131',
            label: '蒲江县',
          },
          {
            value: '510132',
            label: '新津县',
          },
          {
            value: '510181',
            label: '都江堰市',
          },
          {
            value: '510182',
            label: '彭州市',
          },
          {
            value: '510183',
            label: '邛崃市',
          },
          {
            value: '510184',
            label: '崇州市',
          },
          {
            value: '510185',
            label: '简阳市',
          },
        ],
      },
      {
        value: '510300',
        label: '自贡市',
        children: [
          {
            value: '510302',
            label: '自流井区',
          },
          {
            value: '510303',
            label: '贡井区',
          },
          {
            value: '510304',
            label: '大安区',
          },
          {
            value: '510311',
            label: '沿滩区',
          },
          {
            value: '510321',
            label: '荣县',
          },
          {
            value: '510322',
            label: '富顺县',
          },
        ],
      },
      {
        value: '510400',
        label: '攀枝花市',
        children: [
          {
            value: '510402',
            label: '东区',
          },
          {
            value: '510403',
            label: '西区',
          },
          {
            value: '510411',
            label: '仁和区',
          },
          {
            value: '510421',
            label: '米易县',
          },
          {
            value: '510422',
            label: '盐边县',
          },
        ],
      },
      {
        value: '510500',
        label: '泸州市',
        children: [
          {
            value: '510502',
            label: '江阳区',
          },
          {
            value: '510503',
            label: '纳溪区',
          },
          {
            value: '510504',
            label: '龙马潭区',
          },
          {
            value: '510521',
            label: '泸县',
          },
          {
            value: '510522',
            label: '合江县',
          },
          {
            value: '510524',
            label: '叙永县',
          },
          {
            value: '510525',
            label: '古蔺县',
          },
        ],
      },
      {
        value: '510600',
        label: '德阳市',
        children: [
          {
            value: '510603',
            label: '旌阳区',
          },
          {
            value: '510604',
            label: '罗江区',
          },
          {
            value: '510623',
            label: '中江县',
          },
          {
            value: '510681',
            label: '广汉市',
          },
          {
            value: '510682',
            label: '什邡市',
          },
          {
            value: '510683',
            label: '绵竹市',
          },
        ],
      },
      {
        value: '510700',
        label: '绵阳市',
        children: [
          {
            value: '510703',
            label: '涪城区',
          },
          {
            value: '510704',
            label: '游仙区',
          },
          {
            value: '510705',
            label: '安州区',
          },
          {
            value: '510722',
            label: '三台县',
          },
          {
            value: '510723',
            label: '盐亭县',
          },
          {
            value: '510725',
            label: '梓潼县',
          },
          {
            value: '510726',
            label: '北川羌族自治县',
          },
          {
            value: '510727',
            label: '平武县',
          },
          {
            value: '510781',
            label: '江油市',
          },
        ],
      },
      {
        value: '510800',
        label: '广元市',
        children: [
          {
            value: '510802',
            label: '利州区',
          },
          {
            value: '510811',
            label: '昭化区',
          },
          {
            value: '510812',
            label: '朝天区',
          },
          {
            value: '510821',
            label: '旺苍县',
          },
          {
            value: '510822',
            label: '青川县',
          },
          {
            value: '510823',
            label: '剑阁县',
          },
          {
            value: '510824',
            label: '苍溪县',
          },
        ],
      },
      {
        value: '510900',
        label: '遂宁市',
        children: [
          {
            value: '510903',
            label: '船山区',
          },
          {
            value: '510904',
            label: '安居区',
          },
          {
            value: '510921',
            label: '蓬溪县',
          },
          {
            value: '510922',
            label: '射洪县',
          },
          {
            value: '510923',
            label: '大英县',
          },
        ],
      },
      {
        value: '511000',
        label: '内江市',
        children: [
          {
            value: '511002',
            label: '市中区',
          },
          {
            value: '511011',
            label: '东兴区',
          },
          {
            value: '511024',
            label: '威远县',
          },
          {
            value: '511025',
            label: '资中县',
          },
          {
            value: '511083',
            label: '隆昌市',
          },
        ],
      },
      {
        value: '511100',
        label: '乐山市',
        children: [
          {
            value: '511102',
            label: '市中区',
          },
          {
            value: '511111',
            label: '沙湾区',
          },
          {
            value: '511112',
            label: '五通桥区',
          },
          {
            value: '511113',
            label: '金口河区',
          },
          {
            value: '511123',
            label: '犍为县',
          },
          {
            value: '511124',
            label: '井研县',
          },
          {
            value: '511126',
            label: '夹江县',
          },
          {
            value: '511129',
            label: '沐川县',
          },
          {
            value: '511132',
            label: '峨边彝族自治县',
          },
          {
            value: '511133',
            label: '马边彝族自治县',
          },
          {
            value: '511181',
            label: '峨眉山市',
          },
        ],
      },
      {
        value: '511300',
        label: '南充市',
        children: [
          {
            value: '511302',
            label: '顺庆区',
          },
          {
            value: '511303',
            label: '高坪区',
          },
          {
            value: '511304',
            label: '嘉陵区',
          },
          {
            value: '511321',
            label: '南部县',
          },
          {
            value: '511322',
            label: '营山县',
          },
          {
            value: '511323',
            label: '蓬安县',
          },
          {
            value: '511324',
            label: '仪陇县',
          },
          {
            value: '511325',
            label: '西充县',
          },
          {
            value: '511381',
            label: '阆中市',
          },
        ],
      },
      {
        value: '511400',
        label: '眉山市',
        children: [
          {
            value: '511402',
            label: '东坡区',
          },
          {
            value: '511403',
            label: '彭山区',
          },
          {
            value: '511421',
            label: '仁寿县',
          },
          {
            value: '511423',
            label: '洪雅县',
          },
          {
            value: '511424',
            label: '丹棱县',
          },
          {
            value: '511425',
            label: '青神县',
          },
        ],
      },
      {
        value: '511500',
        label: '宜宾市',
        children: [
          {
            value: '511502',
            label: '翠屏区',
          },
          {
            value: '511503',
            label: '南溪区',
          },
          {
            value: '511521',
            label: '宜宾县',
          },
          {
            value: '511523',
            label: '江安县',
          },
          {
            value: '511524',
            label: '长宁县',
          },
          {
            value: '511525',
            label: '高县',
          },
          {
            value: '511526',
            label: '珙县',
          },
          {
            value: '511527',
            label: '筠连县',
          },
          {
            value: '511528',
            label: '兴文县',
          },
          {
            value: '511529',
            label: '屏山县',
          },
        ],
      },
      {
        value: '511600',
        label: '广安市',
        children: [
          {
            value: '511602',
            label: '广安区',
          },
          {
            value: '511603',
            label: '前锋区',
          },
          {
            value: '511621',
            label: '岳池县',
          },
          {
            value: '511622',
            label: '武胜县',
          },
          {
            value: '511623',
            label: '邻水县',
          },
          {
            value: '511681',
            label: '华蓥市',
          },
        ],
      },
      {
        value: '511700',
        label: '达州市',
        children: [
          {
            value: '511702',
            label: '通川区',
          },
          {
            value: '511703',
            label: '达川区',
          },
          {
            value: '511722',
            label: '宣汉县',
          },
          {
            value: '511723',
            label: '开江县',
          },
          {
            value: '511724',
            label: '大竹县',
          },
          {
            value: '511725',
            label: '渠县',
          },
          {
            value: '511781',
            label: '万源市',
          },
        ],
      },
      {
        value: '511800',
        label: '雅安市',
        children: [
          {
            value: '511802',
            label: '雨城区',
          },
          {
            value: '511803',
            label: '名山区',
          },
          {
            value: '511822',
            label: '荥经县',
          },
          {
            value: '511823',
            label: '汉源县',
          },
          {
            value: '511824',
            label: '石棉县',
          },
          {
            value: '511825',
            label: '天全县',
          },
          {
            value: '511826',
            label: '芦山县',
          },
          {
            value: '511827',
            label: '宝兴县',
          },
        ],
      },
      {
        value: '511900',
        label: '巴中市',
        children: [
          {
            value: '511902',
            label: '巴州区',
          },
          {
            value: '511903',
            label: '恩阳区',
          },
          {
            value: '511921',
            label: '通江县',
          },
          {
            value: '511922',
            label: '南江县',
          },
          {
            value: '511923',
            label: '平昌县',
          },
        ],
      },
      {
        value: '512000',
        label: '资阳市',
        children: [
          {
            value: '512002',
            label: '雁江区',
          },
          {
            value: '512021',
            label: '安岳县',
          },
          {
            value: '512022',
            label: '乐至县',
          },
        ],
      },
      {
        value: '513200',
        label: '阿坝藏族羌族自治州',
        children: [
          {
            value: '513201',
            label: '马尔康市',
          },
          {
            value: '513221',
            label: '汶川县',
          },
          {
            value: '513222',
            label: '理县',
          },
          {
            value: '513223',
            label: '茂县',
          },
          {
            value: '513224',
            label: '松潘县',
          },
          {
            value: '513225',
            label: '九寨沟县',
          },
          {
            value: '513226',
            label: '金川县',
          },
          {
            value: '513227',
            label: '小金县',
          },
          {
            value: '513228',
            label: '黑水县',
          },
          {
            value: '513230',
            label: '壤塘县',
          },
          {
            value: '513231',
            label: '阿坝县',
          },
          {
            value: '513232',
            label: '若尔盖县',
          },
          {
            value: '513233',
            label: '红原县',
          },
        ],
      },
      {
        value: '513300',
        label: '甘孜藏族自治州',
        children: [
          {
            value: '513301',
            label: '康定市',
          },
          {
            value: '513322',
            label: '泸定县',
          },
          {
            value: '513323',
            label: '丹巴县',
          },
          {
            value: '513324',
            label: '九龙县',
          },
          {
            value: '513325',
            label: '雅江县',
          },
          {
            value: '513326',
            label: '道孚县',
          },
          {
            value: '513327',
            label: '炉霍县',
          },
          {
            value: '513328',
            label: '甘孜县',
          },
          {
            value: '513329',
            label: '新龙县',
          },
          {
            value: '513330',
            label: '德格县',
          },
          {
            value: '513331',
            label: '白玉县',
          },
          {
            value: '513332',
            label: '石渠县',
          },
          {
            value: '513333',
            label: '色达县',
          },
          {
            value: '513334',
            label: '理塘县',
          },
          {
            value: '513335',
            label: '巴塘县',
          },
          {
            value: '513336',
            label: '乡城县',
          },
          {
            value: '513337',
            label: '稻城县',
          },
          {
            value: '513338',
            label: '得荣县',
          },
        ],
      },
      {
        value: '513400',
        label: '凉山彝族自治州',
        children: [
          {
            value: '513401',
            label: '西昌市',
          },
          {
            value: '513422',
            label: '木里藏族自治县',
          },
          {
            value: '513423',
            label: '盐源县',
          },
          {
            value: '513424',
            label: '德昌县',
          },
          {
            value: '513425',
            label: '会理县',
          },
          {
            value: '513426',
            label: '会东县',
          },
          {
            value: '513427',
            label: '宁南县',
          },
          {
            value: '513428',
            label: '普格县',
          },
          {
            value: '513429',
            label: '布拖县',
          },
          {
            value: '513430',
            label: '金阳县',
          },
          {
            value: '513431',
            label: '昭觉县',
          },
          {
            value: '513432',
            label: '喜德县',
          },
          {
            value: '513433',
            label: '冕宁县',
          },
          {
            value: '513434',
            label: '越西县',
          },
          {
            value: '513435',
            label: '甘洛县',
          },
          {
            value: '513436',
            label: '美姑县',
          },
          {
            value: '513437',
            label: '雷波县',
          },
        ],
      },
    ],
  },
  {
    value: '520000',
    label: '贵州省',
    children: [
      {
        value: '520100',
        label: '贵阳市',
        children: [
          {
            value: '520102',
            label: '南明区',
          },
          {
            value: '520103',
            label: '云岩区',
          },
          {
            value: '520111',
            label: '花溪区',
          },
          {
            value: '520112',
            label: '乌当区',
          },
          {
            value: '520113',
            label: '白云区',
          },
          {
            value: '520115',
            label: '观山湖区',
          },
          {
            value: '520121',
            label: '开阳县',
          },
          {
            value: '520122',
            label: '息烽县',
          },
          {
            value: '520123',
            label: '修文县',
          },
          {
            value: '520181',
            label: '清镇市',
          },
        ],
      },
      {
        value: '520200',
        label: '六盘水市',
        children: [
          {
            value: '520201',
            label: '钟山区',
          },
          {
            value: '520203',
            label: '六枝特区',
          },
          {
            value: '520221',
            label: '水城县',
          },
          {
            value: '520281',
            label: '盘州市',
          },
        ],
      },
      {
        value: '520300',
        label: '遵义市',
        children: [
          {
            value: '520302',
            label: '红花岗区',
          },
          {
            value: '520303',
            label: '汇川区',
          },
          {
            value: '520304',
            label: '播州区',
          },
          {
            value: '520322',
            label: '桐梓县',
          },
          {
            value: '520323',
            label: '绥阳县',
          },
          {
            value: '520324',
            label: '正安县',
          },
          {
            value: '520325',
            label: '道真仡佬族苗族自治县',
          },
          {
            value: '520326',
            label: '务川仡佬族苗族自治县',
          },
          {
            value: '520327',
            label: '凤冈县',
          },
          {
            value: '520328',
            label: '湄潭县',
          },
          {
            value: '520329',
            label: '余庆县',
          },
          {
            value: '520330',
            label: '习水县',
          },
          {
            value: '520381',
            label: '赤水市',
          },
          {
            value: '520382',
            label: '仁怀市',
          },
        ],
      },
      {
        value: '520400',
        label: '安顺市',
        children: [
          {
            value: '520402',
            label: '西秀区',
          },
          {
            value: '520403',
            label: '平坝区',
          },
          {
            value: '520422',
            label: '普定县',
          },
          {
            value: '520423',
            label: '镇宁布依族苗族自治县',
          },
          {
            value: '520424',
            label: '关岭布依族苗族自治县',
          },
          {
            value: '520425',
            label: '紫云苗族布依族自治县',
          },
        ],
      },
      {
        value: '520500',
        label: '毕节市',
        children: [
          {
            value: '520502',
            label: '七星关区',
          },
          {
            value: '520521',
            label: '大方县',
          },
          {
            value: '520522',
            label: '黔西县',
          },
          {
            value: '520523',
            label: '金沙县',
          },
          {
            value: '520524',
            label: '织金县',
          },
          {
            value: '520525',
            label: '纳雍县',
          },
          {
            value: '520526',
            label: '威宁彝族回族苗族自治县',
          },
          {
            value: '520527',
            label: '赫章县',
          },
        ],
      },
      {
        value: '520600',
        label: '铜仁市',
        children: [
          {
            value: '520602',
            label: '碧江区',
          },
          {
            value: '520603',
            label: '万山区',
          },
          {
            value: '520621',
            label: '江口县',
          },
          {
            value: '520622',
            label: '玉屏侗族自治县',
          },
          {
            value: '520623',
            label: '石阡县',
          },
          {
            value: '520624',
            label: '思南县',
          },
          {
            value: '520625',
            label: '印江土家族苗族自治县',
          },
          {
            value: '520626',
            label: '德江县',
          },
          {
            value: '520627',
            label: '沿河土家族自治县',
          },
          {
            value: '520628',
            label: '松桃苗族自治县',
          },
        ],
      },
      {
        value: '522300',
        label: '黔西南布依族苗族自治州',
        children: [
          {
            value: '522301',
            label: '兴义市',
          },
          {
            value: '522322',
            label: '兴仁县',
          },
          {
            value: '522323',
            label: '普安县',
          },
          {
            value: '522324',
            label: '晴隆县',
          },
          {
            value: '522325',
            label: '贞丰县',
          },
          {
            value: '522326',
            label: '望谟县',
          },
          {
            value: '522327',
            label: '册亨县',
          },
          {
            value: '522328',
            label: '安龙县',
          },
        ],
      },
      {
        value: '522600',
        label: '黔东南苗族侗族自治州',
        children: [
          {
            value: '522601',
            label: '凯里市',
          },
          {
            value: '522622',
            label: '黄平县',
          },
          {
            value: '522623',
            label: '施秉县',
          },
          {
            value: '522624',
            label: '三穗县',
          },
          {
            value: '522625',
            label: '镇远县',
          },
          {
            value: '522626',
            label: '岑巩县',
          },
          {
            value: '522627',
            label: '天柱县',
          },
          {
            value: '522628',
            label: '锦屏县',
          },
          {
            value: '522629',
            label: '剑河县',
          },
          {
            value: '522630',
            label: '台江县',
          },
          {
            value: '522631',
            label: '黎平县',
          },
          {
            value: '522632',
            label: '榕江县',
          },
          {
            value: '522633',
            label: '从江县',
          },
          {
            value: '522634',
            label: '雷山县',
          },
          {
            value: '522635',
            label: '麻江县',
          },
          {
            value: '522636',
            label: '丹寨县',
          },
        ],
      },
      {
        value: '522700',
        label: '黔南布依族苗族自治州',
        children: [
          {
            value: '522701',
            label: '都匀市',
          },
          {
            value: '522702',
            label: '福泉市',
          },
          {
            value: '522722',
            label: '荔波县',
          },
          {
            value: '522723',
            label: '贵定县',
          },
          {
            value: '522725',
            label: '瓮安县',
          },
          {
            value: '522726',
            label: '独山县',
          },
          {
            value: '522727',
            label: '平塘县',
          },
          {
            value: '522728',
            label: '罗甸县',
          },
          {
            value: '522729',
            label: '长顺县',
          },
          {
            value: '522730',
            label: '龙里县',
          },
          {
            value: '522731',
            label: '惠水县',
          },
          {
            value: '522732',
            label: '三都水族自治县',
          },
        ],
      },
    ],
  },
  {
    value: '530000',
    label: '云南省',
    children: [
      {
        value: '530100',
        label: '昆明市',
        children: [
          {
            value: '530102',
            label: '五华区',
          },
          {
            value: '530103',
            label: '盘龙区',
          },
          {
            value: '530111',
            label: '官渡区',
          },
          {
            value: '530112',
            label: '西山区',
          },
          {
            value: '530113',
            label: '东川区',
          },
          {
            value: '530114',
            label: '呈贡区',
          },
          {
            value: '530115',
            label: '晋宁区',
          },
          {
            value: '530124',
            label: '富民县',
          },
          {
            value: '530125',
            label: '宜良县',
          },
          {
            value: '530126',
            label: '石林彝族自治县',
          },
          {
            value: '530127',
            label: '嵩明县',
          },
          {
            value: '530128',
            label: '禄劝彝族苗族自治县',
          },
          {
            value: '530129',
            label: '寻甸回族彝族自治县',
          },
          {
            value: '530181',
            label: '安宁市',
          },
        ],
      },
      {
        value: '530300',
        label: '曲靖市',
        children: [
          {
            value: '530302',
            label: '麒麟区',
          },
          {
            value: '530303',
            label: '沾益区',
          },
          {
            value: '530304',
            label: '马龙区',
          },
          {
            value: '530322',
            label: '陆良县',
          },
          {
            value: '530323',
            label: '师宗县',
          },
          {
            value: '530324',
            label: '罗平县',
          },
          {
            value: '530325',
            label: '富源县',
          },
          {
            value: '530326',
            label: '会泽县',
          },
          {
            value: '530381',
            label: '宣威市',
          },
        ],
      },
      {
        value: '530400',
        label: '玉溪市',
        children: [
          {
            value: '530402',
            label: '红塔区',
          },
          {
            value: '530403',
            label: '江川区',
          },
          {
            value: '530422',
            label: '澄江县',
          },
          {
            value: '530423',
            label: '通海县',
          },
          {
            value: '530424',
            label: '华宁县',
          },
          {
            value: '530425',
            label: '易门县',
          },
          {
            value: '530426',
            label: '峨山彝族自治县',
          },
          {
            value: '530427',
            label: '新平彝族傣族自治县',
          },
          {
            value: '530428',
            label: '元江哈尼族彝族傣族自治县',
          },
        ],
      },
      {
        value: '530500',
        label: '保山市',
        children: [
          {
            value: '530502',
            label: '隆阳区',
          },
          {
            value: '530521',
            label: '施甸县',
          },
          {
            value: '530523',
            label: '龙陵县',
          },
          {
            value: '530524',
            label: '昌宁县',
          },
          {
            value: '530581',
            label: '腾冲市',
          },
        ],
      },
      {
        value: '530600',
        label: '昭通市',
        children: [
          {
            value: '530602',
            label: '昭阳区',
          },
          {
            value: '530621',
            label: '鲁甸县',
          },
          {
            value: '530622',
            label: '巧家县',
          },
          {
            value: '530623',
            label: '盐津县',
          },
          {
            value: '530624',
            label: '大关县',
          },
          {
            value: '530625',
            label: '永善县',
          },
          {
            value: '530626',
            label: '绥江县',
          },
          {
            value: '530627',
            label: '镇雄县',
          },
          {
            value: '530628',
            label: '彝良县',
          },
          {
            value: '530629',
            label: '威信县',
          },
          {
            value: '530630',
            label: '水富县',
          },
        ],
      },
      {
        value: '530800',
        label: '普洱市',
        children: [
          {
            value: '530802',
            label: '思茅区',
          },
          {
            value: '530821',
            label: '宁洱哈尼族彝族自治县',
          },
          {
            value: '530822',
            label: '墨江哈尼族自治县',
          },
          {
            value: '530823',
            label: '景东彝族自治县',
          },
          {
            value: '530824',
            label: '景谷傣族彝族自治县',
          },
          {
            value: '530825',
            label: '镇沅彝族哈尼族拉祜族自治县',
          },
          {
            value: '530826',
            label: '江城哈尼族彝族自治县',
          },
          {
            value: '530827',
            label: '孟连傣族拉祜族佤族自治县',
          },
          {
            value: '530828',
            label: '澜沧拉祜族自治县',
          },
          {
            value: '530829',
            label: '西盟佤族自治县',
          },
        ],
      },
      {
        value: '530900',
        label: '临沧市',
        children: [
          {
            value: '530902',
            label: '临翔区',
          },
          {
            value: '530921',
            label: '凤庆县',
          },
          {
            value: '530922',
            label: '云县',
          },
          {
            value: '530923',
            label: '永德县',
          },
          {
            value: '530924',
            label: '镇康县',
          },
          {
            value: '530925',
            label: '双江拉祜族佤族布朗族傣族自治县',
          },
          {
            value: '530926',
            label: '耿马傣族佤族自治县',
          },
          {
            value: '530927',
            label: '沧源佤族自治县',
          },
        ],
      },
      {
        value: '532301',
        label: '楚雄市',
        children: [
          {
            value: '532300',
            label: '楚雄彝族自治州',
          },
          {
            value: '532322',
            label: '双柏县',
          },
          {
            value: '532323',
            label: '牟定县',
          },
          {
            value: '532324',
            label: '南华县',
          },
          {
            value: '532325',
            label: '姚安县',
          },
          {
            value: '532326',
            label: '大姚县',
          },
          {
            value: '532327',
            label: '永仁县',
          },
          {
            value: '532328',
            label: '元谋县',
          },
          {
            value: '532329',
            label: '武定县',
          },
          {
            value: '532331',
            label: '禄丰县',
          },
        ],
      },
      {
        value: '532500',
        label: '红河哈尼族彝族自治州',
        children: [
          {
            value: '532501',
            label: '个旧市',
          },
          {
            value: '532502',
            label: '开远市',
          },
          {
            value: '532503',
            label: '蒙自市',
          },
          {
            value: '532504',
            label: '弥勒市',
          },
          {
            value: '532523',
            label: '屏边苗族自治县',
          },
          {
            value: '532524',
            label: '建水县',
          },
          {
            value: '532525',
            label: '石屏县',
          },
          {
            value: '532527',
            label: '泸西县',
          },
          {
            value: '532528',
            label: '元阳县',
          },
          {
            value: '532529',
            label: '红河县',
          },
          {
            value: '532530',
            label: '金平苗族瑶族傣族自治县',
          },
          {
            value: '532531',
            label: '绿春县',
          },
          {
            value: '532532',
            label: '河口瑶族自治县',
          },
        ],
      },
      {
        value: '532600',
        label: '文山壮族苗族自治州',
        children: [
          {
            value: '532601',
            label: '文山市',
          },
          {
            value: '532622',
            label: '砚山县',
          },
          {
            value: '532623',
            label: '西畴县',
          },
          {
            value: '532624',
            label: '麻栗坡县',
          },
          {
            value: '532625',
            label: '马关县',
          },
          {
            value: '532626',
            label: '丘北县',
          },
          {
            value: '532627',
            label: '广南县',
          },
          {
            value: '532628',
            label: '富宁县',
          },
        ],
      },
      {
        value: '532800',
        label: '西双版纳傣族自治州',
        children: [
          {
            value: '532801',
            label: '景洪市',
          },
          {
            value: '532822',
            label: '勐海县',
          },
          {
            value: '532823',
            label: '勐腊县',
          },
        ],
      },
      {
        value: '532900',
        label: '大理白族自治州',
        children: [
          {
            value: '532901',
            label: '大理市',
          },
          {
            value: '532922',
            label: '漾濞彝族自治县',
          },
          {
            value: '532923',
            label: '祥云县',
          },
          {
            value: '532924',
            label: '宾川县',
          },
          {
            value: '532925',
            label: '弥渡县',
          },
          {
            value: '532926',
            label: '南涧彝族自治县',
          },
          {
            value: '532927',
            label: '巍山彝族回族自治县',
          },
          {
            value: '532928',
            label: '永平县',
          },
          {
            value: '532929',
            label: '云龙县',
          },
          {
            value: '532930',
            label: '洱源县',
          },
          {
            value: '532931',
            label: '剑川县',
          },
          {
            value: '532932',
            label: '鹤庆县',
          },
        ],
      },
      {
        value: '533100',
        label: '德宏傣族景颇族自治州',
        children: [
          {
            value: '533102',
            label: '瑞丽市',
          },
          {
            value: '533103',
            label: '芒市',
          },
          {
            value: '533122',
            label: '梁河县',
          },
          {
            value: '533123',
            label: '盈江县',
          },
          {
            value: '533124',
            label: '陇川县',
          },
        ],
      },
      {
        value: '533300',
        label: '怒江傈僳族自治州',
        children: [
          {
            value: '533301',
            label: '泸水市',
          },
          {
            value: '533323',
            label: '福贡县',
          },
          {
            value: '533324',
            label: '贡山独龙族怒族自治县',
          },
          {
            value: '533325',
            label: '兰坪白族普米族自治县',
          },
        ],
      },
      {
        value: '533400',
        label: '迪庆藏族自治州',
        children: [
          {
            value: '533401',
            label: '香格里拉市',
          },
          {
            value: '533422',
            label: '德钦县',
          },
          {
            value: '533423',
            label: '维西傈僳族自治县',
          },
        ],
      },
    ],
  },
  {
    value: '540000',
    label: '西藏自治区',
    children: [
      {
        value: '540100',
        label: '拉萨市',
        children: [
          {
            value: '540102',
            label: '城关区',
          },
          {
            value: '540103',
            label: '堆龙德庆区',
          },
          {
            value: '540104',
            label: '达孜区',
          },
          {
            value: '540121',
            label: '林周县',
          },
          {
            value: '540122',
            label: '当雄县',
          },
          {
            value: '540123',
            label: '尼木县',
          },
          {
            value: '540124',
            label: '曲水县',
          },
          {
            value: '540127',
            label: '墨竹工卡县',
          },
        ],
      },
      {
        value: '540200',
        label: '日喀则市',
        children: [
          {
            value: '540202',
            label: '桑珠孜区',
          },
          {
            value: '540221',
            label: '南木林县',
          },
          {
            value: '540222',
            label: '江孜县',
          },
          {
            value: '540223',
            label: '定日县',
          },
          {
            value: '540224',
            label: '萨迦县',
          },
          {
            value: '540225',
            label: '拉孜县',
          },
          {
            value: '540226',
            label: '昂仁县',
          },
          {
            value: '540227',
            label: '谢通门县',
          },
          {
            value: '540228',
            label: '白朗县',
          },
          {
            value: '540229',
            label: '仁布县',
          },
          {
            value: '540230',
            label: '康马县',
          },
          {
            value: '540231',
            label: '定结县',
          },
          {
            value: '540232',
            label: '仲巴县',
          },
          {
            value: '540233',
            label: '亚东县',
          },
          {
            value: '540234',
            label: '吉隆县',
          },
          {
            value: '540235',
            label: '聂拉木县',
          },
          {
            value: '540236',
            label: '萨嘎县',
          },
          {
            value: '540237',
            label: '岗巴县',
          },
        ],
      },
      {
        value: '540300',
        label: '昌都市',
        children: [
          {
            value: '540302',
            label: '卡若区',
          },
          {
            value: '540321',
            label: '江达县',
          },
          {
            value: '540322',
            label: '贡觉县',
          },
          {
            value: '540323',
            label: '类乌齐县',
          },
          {
            value: '540324',
            label: '丁青县',
          },
          {
            value: '540325',
            label: '察雅县',
          },
          {
            value: '540326',
            label: '八宿县',
          },
          {
            value: '540327',
            label: '左贡县',
          },
          {
            value: '540328',
            label: '芒康县',
          },
          {
            value: '540329',
            label: '洛隆县',
          },
          {
            value: '540330',
            label: '边坝县',
          },
        ],
      },
      {
        value: '540400',
        label: '林芝市',
        children: [
          {
            value: '540402',
            label: '巴宜区',
          },
          {
            value: '540421',
            label: '工布江达县',
          },
          {
            value: '540422',
            label: '米林县',
          },
          {
            value: '540423',
            label: '墨脱县',
          },
          {
            value: '540424',
            label: '波密县',
          },
          {
            value: '540425',
            label: '察隅县',
          },
          {
            value: '540426',
            label: '朗县',
          },
        ],
      },
      {
        value: '540500',
        label: '山南市',
        children: [
          {
            value: '540502',
            label: '乃东区',
          },
          {
            value: '540521',
            label: '扎囊县',
          },
          {
            value: '540522',
            label: '贡嘎县',
          },
          {
            value: '540523',
            label: '桑日县',
          },
          {
            value: '540524',
            label: '琼结县',
          },
          {
            value: '540525',
            label: '曲松县',
          },
          {
            value: '540526',
            label: '措美县',
          },
          {
            value: '540527',
            label: '洛扎县',
          },
          {
            value: '540528',
            label: '加查县',
          },
          {
            value: '540529',
            label: '隆子县',
          },
          {
            value: '540530',
            label: '错那县',
          },
          {
            value: '540531',
            label: '浪卡子县',
          },
        ],
      },
      {
        value: '540600',
        label: '那曲市',
        children: [
          {
            value: '540602',
            label: '色尼区',
          },
          {
            value: '540621',
            label: '嘉黎县',
          },
          {
            value: '540622',
            label: '比如县',
          },
          {
            value: '540623',
            label: '聂荣县',
          },
          {
            value: '540624',
            label: '安多县',
          },
          {
            value: '540625',
            label: '申扎县',
          },
          {
            value: '540626',
            label: '索县',
          },
          {
            value: '540627',
            label: '班戈县',
          },
          {
            value: '540628',
            label: '巴青县',
          },
          {
            value: '540629',
            label: '尼玛县',
          },
          {
            value: '540630',
            label: '双湖县',
          },
        ],
      },
      {
        value: '542500',
        label: '阿里地区',
        children: [
          {
            value: '542521',
            label: '普兰县',
          },
          {
            value: '542522',
            label: '札达县',
          },
          {
            value: '542523',
            label: '噶尔县',
          },
          {
            value: '542524',
            label: '日土县',
          },
          {
            value: '542525',
            label: '革吉县',
          },
          {
            value: '542526',
            label: '改则县',
          },
          {
            value: '542527',
            label: '措勤县',
          },
        ],
      },
    ],
  },
  {
    value: '610000',
    label: '陕西省',
    children: [
      {
        value: '610100',
        label: '西安市',
        children: [
          {
            value: '610102',
            label: '新城区',
          },
          {
            value: '610103',
            label: '碑林区',
          },
          {
            value: '610104',
            label: '莲湖区',
          },
          {
            value: '610111',
            label: '灞桥区',
          },
          {
            value: '610112',
            label: '未央区',
          },
          {
            value: '610113',
            label: '雁塔区',
          },
          {
            value: '610114',
            label: '阎良区',
          },
          {
            value: '610115',
            label: '临潼区',
          },
          {
            value: '610116',
            label: '长安区',
          },
          {
            value: '610117',
            label: '高陵区',
          },
          {
            value: '610118',
            label: '鄠邑区',
          },
          {
            value: '610122',
            label: '蓝田县',
          },
          {
            value: '610124',
            label: '周至县',
          },
        ],
      },
      {
        value: '610200',
        label: '铜川市',
        children: [
          {
            value: '610202',
            label: '王益区',
          },
          {
            value: '610203',
            label: '印台区',
          },
          {
            value: '610204',
            label: '耀州区',
          },
          {
            value: '610222',
            label: '宜君县',
          },
        ],
      },
      {
        value: '610300',
        label: '宝鸡市',
        children: [
          {
            value: '610302',
            label: '渭滨区',
          },
          {
            value: '610303',
            label: '金台区',
          },
          {
            value: '610304',
            label: '陈仓区',
          },
          {
            value: '610322',
            label: '凤翔县',
          },
          {
            value: '610323',
            label: '岐山县',
          },
          {
            value: '610324',
            label: '扶风县',
          },
          {
            value: '610326',
            label: '眉县',
          },
          {
            value: '610327',
            label: '陇县',
          },
          {
            value: '610328',
            label: '千阳县',
          },
          {
            value: '610329',
            label: '麟游县',
          },
          {
            value: '610330',
            label: '凤县',
          },
          {
            value: '610331',
            label: '太白县',
          },
        ],
      },
      {
        value: '610400',
        label: '咸阳市',
        children: [
          {
            value: '610402',
            label: '秦都区',
          },
          {
            value: '610403',
            label: '杨陵区',
          },
          {
            value: '610404',
            label: '渭城区',
          },
          {
            value: '610422',
            label: '三原县',
          },
          {
            value: '610423',
            label: '泾阳县',
          },
          {
            value: '610424',
            label: '乾县',
          },
          {
            value: '610425',
            label: '礼泉县',
          },
          {
            value: '610426',
            label: '永寿县',
          },
          {
            value: '610428',
            label: '长武县',
          },
          {
            value: '610429',
            label: '旬邑县',
          },
          {
            value: '610430',
            label: '淳化县',
          },
          {
            value: '610431',
            label: '武功县',
          },
          {
            value: '610481',
            label: '兴平市',
          },
          {
            value: '610482',
            label: '彬州市',
          },
        ],
      },
      {
        value: '610500',
        label: '渭南市',
        children: [
          {
            value: '610502',
            label: '临渭区',
          },
          {
            value: '610503',
            label: '华州区',
          },
          {
            value: '610522',
            label: '潼关县',
          },
          {
            value: '610523',
            label: '大荔县',
          },
          {
            value: '610524',
            label: '合阳县',
          },
          {
            value: '610525',
            label: '澄城县',
          },
          {
            value: '610526',
            label: '蒲城县',
          },
          {
            value: '610527',
            label: '白水县',
          },
          {
            value: '610528',
            label: '富平县',
          },
          {
            value: '610581',
            label: '韩城市',
          },
          {
            value: '610582',
            label: '华阴市',
          },
        ],
      },
      {
        value: '610600',
        label: '延安市',
        children: [
          {
            value: '610602',
            label: '宝塔区',
          },
          {
            value: '610603',
            label: '安塞区',
          },
          {
            value: '610621',
            label: '延长县',
          },
          {
            value: '610622',
            label: '延川县',
          },
          {
            value: '610623',
            label: '子长县',
          },
          {
            value: '610625',
            label: '志丹县',
          },
          {
            value: '610626',
            label: '吴起县',
          },
          {
            value: '610627',
            label: '甘泉县',
          },
          {
            value: '610628',
            label: '富县',
          },
          {
            value: '610629',
            label: '洛川县',
          },
          {
            value: '610630',
            label: '宜川县',
          },
          {
            value: '610631',
            label: '黄龙县',
          },
          {
            value: '610632',
            label: '黄陵县',
          },
        ],
      },
      {
        value: '610700',
        label: '汉中市',
        children: [
          {
            value: '610702',
            label: '汉台区',
          },
          {
            value: '610703',
            label: '南郑区',
          },
          {
            value: '610722',
            label: '城固县',
          },
          {
            value: '610723',
            label: '洋县',
          },
          {
            value: '610724',
            label: '西乡县',
          },
          {
            value: '610725',
            label: '勉县',
          },
          {
            value: '610726',
            label: '宁强县',
          },
          {
            value: '610727',
            label: '略阳县',
          },
          {
            value: '610728',
            label: '镇巴县',
          },
          {
            value: '610729',
            label: '留坝县',
          },
          {
            value: '610730',
            label: '佛坪县',
          },
        ],
      },
      {
        value: '610800',
        label: '榆林市',
        children: [
          {
            value: '610802',
            label: '榆阳区',
          },
          {
            value: '610803',
            label: '横山区',
          },
          {
            value: '610822',
            label: '府谷县',
          },
          {
            value: '610824',
            label: '靖边县',
          },
          {
            value: '610825',
            label: '定边县',
          },
          {
            value: '610826',
            label: '绥德县',
          },
          {
            value: '610827',
            label: '米脂县',
          },
          {
            value: '610828',
            label: '佳县',
          },
          {
            value: '610829',
            label: '吴堡县',
          },
          {
            value: '610830',
            label: '清涧县',
          },
          {
            value: '610831',
            label: '子洲县',
          },
          {
            value: '610881',
            label: '神木市',
          },
        ],
      },
      {
        value: '610900',
        label: '安康市',
        children: [
          {
            value: '610902',
            label: '汉滨区',
          },
          {
            value: '610921',
            label: '汉阴县',
          },
          {
            value: '610922',
            label: '石泉县',
          },
          {
            value: '610923',
            label: '宁陕县',
          },
          {
            value: '610924',
            label: '紫阳县',
          },
          {
            value: '610925',
            label: '岚皋县',
          },
          {
            value: '610926',
            label: '平利县',
          },
          {
            value: '610927',
            label: '镇坪县',
          },
          {
            value: '610928',
            label: '旬阳县',
          },
          {
            value: '610929',
            label: '白河县',
          },
        ],
      },
      {
        value: '611000',
        label: '商洛市',
        children: [
          {
            value: '611002',
            label: '商州区',
          },
          {
            value: '611021',
            label: '洛南县',
          },
          {
            value: '611022',
            label: '丹凤县',
          },
          {
            value: '611023',
            label: '商南县',
          },
          {
            value: '611024',
            label: '山阳县',
          },
          {
            value: '611025',
            label: '镇安县',
          },
          {
            value: '611026',
            label: '柞水县',
          },
        ],
      },
    ],
  },
  {
    value: '620000',
    label: '甘肃省',
    children: [
      {
        value: '620100',
        label: '兰州市',
        children: [
          {
            value: '620102',
            label: '城关区',
          },
          {
            value: '620103',
            label: '七里河区',
          },
          {
            value: '620104',
            label: '西固区',
          },
          {
            value: '620105',
            label: '安宁区',
          },
          {
            value: '620111',
            label: '红古区',
          },
          {
            value: '620121',
            label: '永登县',
          },
          {
            value: '620122',
            label: '皋兰县',
          },
          {
            value: '620123',
            label: '榆中县',
          },
        ],
      },
      {
        value: '620200',
        label: '嘉峪关市',
        children: [
          {
            value: '620200',
            label: '嘉峪关市',
          },
        ],
      },
      {
        value: '620300',
        label: '金昌市',
        children: [
          {
            value: '620302',
            label: '金川区',
          },
          {
            value: '620321',
            label: '永昌县',
          },
        ],
      },
      {
        value: '620400',
        label: '白银市',
        children: [
          {
            value: '620402',
            label: '白银区',
          },
          {
            value: '620403',
            label: '平川区',
          },
          {
            value: '620421',
            label: '靖远县',
          },
          {
            value: '620422',
            label: '会宁县',
          },
          {
            value: '620423',
            label: '景泰县',
          },
        ],
      },
      {
        value: '620500',
        label: '天水市',
        children: [
          {
            value: '620502',
            label: '秦州区',
          },
          {
            value: '620503',
            label: '麦积区',
          },
          {
            value: '620521',
            label: '清水县',
          },
          {
            value: '620522',
            label: '秦安县',
          },
          {
            value: '620523',
            label: '甘谷县',
          },
          {
            value: '620524',
            label: '武山县',
          },
          {
            value: '620525',
            label: '张家川回族自治县',
          },
        ],
      },
      {
        value: '620600',
        label: '武威市',
        children: [
          {
            value: '620602',
            label: '凉州区',
          },
          {
            value: '620621',
            label: '民勤县',
          },
          {
            value: '620622',
            label: '古浪县',
          },
          {
            value: '620623',
            label: '天祝藏族自治县',
          },
        ],
      },
      {
        value: '620700',
        label: '张掖市',
        children: [
          {
            value: '620702',
            label: '甘州区',
          },
          {
            value: '620721',
            label: '肃南裕固族自治县',
          },
          {
            value: '620722',
            label: '民乐县',
          },
          {
            value: '620723',
            label: '临泽县',
          },
          {
            value: '620724',
            label: '高台县',
          },
          {
            value: '620725',
            label: '山丹县',
          },
        ],
      },
      {
        value: '620800',
        label: '平凉市',
        children: [
          {
            value: '620802',
            label: '崆峒区',
          },
          {
            value: '620821',
            label: '泾川县',
          },
          {
            value: '620822',
            label: '灵台县',
          },
          {
            value: '620823',
            label: '崇信县',
          },
          {
            value: '620824',
            label: '华亭县',
          },
          {
            value: '620825',
            label: '庄浪县',
          },
          {
            value: '620826',
            label: '静宁县',
          },
        ],
      },
      {
        value: '620900',
        label: '酒泉市',
        children: [
          {
            value: '620902',
            label: '肃州区',
          },
          {
            value: '620921',
            label: '金塔县',
          },
          {
            value: '620922',
            label: '瓜州县',
          },
          {
            value: '620923',
            label: '肃北蒙古族自治县',
          },
          {
            value: '620924',
            label: '阿克塞哈萨克族自治县',
          },
          {
            value: '620981',
            label: '玉门市',
          },
          {
            value: '620982',
            label: '敦煌市',
          },
        ],
      },
      {
        value: '621000',
        label: '庆阳市',
        children: [
          {
            value: '621002',
            label: '西峰区',
          },
          {
            value: '621021',
            label: '庆城县',
          },
          {
            value: '621022',
            label: '环县',
          },
          {
            value: '621023',
            label: '华池县',
          },
          {
            value: '621024',
            label: '合水县',
          },
          {
            value: '621025',
            label: '正宁县',
          },
          {
            value: '621026',
            label: '宁县',
          },
          {
            value: '621027',
            label: '镇原县',
          },
        ],
      },
      {
        value: '621100',
        label: '定西市',
        children: [
          {
            value: '621102',
            label: '安定区',
          },
          {
            value: '621121',
            label: '通渭县',
          },
          {
            value: '621122',
            label: '陇西县',
          },
          {
            value: '621123',
            label: '渭源县',
          },
          {
            value: '621124',
            label: '临洮县',
          },
          {
            value: '621125',
            label: '漳县',
          },
          {
            value: '621126',
            label: '岷县',
          },
        ],
      },
      {
        value: '621200',
        label: '陇南市',
        children: [
          {
            value: '621202',
            label: '武都区',
          },
          {
            value: '621221',
            label: '成县',
          },
          {
            value: '621222',
            label: '文县',
          },
          {
            value: '621223',
            label: '宕昌县',
          },
          {
            value: '621224',
            label: '康县',
          },
          {
            value: '621225',
            label: '西和县',
          },
          {
            value: '621226',
            label: '礼县',
          },
          {
            value: '621227',
            label: '徽县',
          },
          {
            value: '621228',
            label: '两当县',
          },
        ],
      },
      {
        value: '622900',
        label: '临夏回族自治州',
        children: [
          {
            value: '622901',
            label: '临夏市',
          },
          {
            value: '622921',
            label: '临夏县',
          },
          {
            value: '622922',
            label: '康乐县',
          },
          {
            value: '622923',
            label: '永靖县',
          },
          {
            value: '622924',
            label: '广河县',
          },
          {
            value: '622925',
            label: '和政县',
          },
          {
            value: '622926',
            label: '东乡族自治县',
          },
          {
            value: '622927',
            label: '积石山保安族东乡族撒拉族自治县',
          },
        ],
      },
      {
        value: '623000',
        label: '甘南藏族自治州',
        children: [
          {
            value: '623001',
            label: '合作市',
          },
          {
            value: '623021',
            label: '临潭县',
          },
          {
            value: '623022',
            label: '卓尼县',
          },
          {
            value: '623023',
            label: '舟曲县',
          },
          {
            value: '623024',
            label: '迭部县',
          },
          {
            value: '623025',
            label: '玛曲县',
          },
          {
            value: '623026',
            label: '碌曲县',
          },
          {
            value: '623027',
            label: '夏河县',
          },
        ],
      },
    ],
  },
  {
    value: '630000',
    label: '青海省',
    children: [
      {
        value: '630100',
        label: '西宁市',
        children: [
          {
            value: '630102',
            label: '城东区',
          },
          {
            value: '630103',
            label: '城中区',
          },
          {
            value: '630104',
            label: '城西区',
          },
          {
            value: '630105',
            label: '城北区',
          },
          {
            value: '630121',
            label: '大通回族土族自治县',
          },
          {
            value: '630122',
            label: '湟中县',
          },
          {
            value: '630123',
            label: '湟源县',
          },
        ],
      },
      {
        value: '630200',
        label: '海东市',
        children: [
          {
            value: '630202',
            label: '乐都区',
          },
          {
            value: '630203',
            label: '平安区',
          },
          {
            value: '630222',
            label: '民和回族土族自治县',
          },
          {
            value: '630223',
            label: '互助土族自治县',
          },
          {
            value: '630224',
            label: '化隆回族自治县',
          },
          {
            value: '630225',
            label: '循化撒拉族自治县',
          },
        ],
      },
      {
        value: '632200',
        label: '海北藏族自治州',
        children: [
          {
            value: '632221',
            label: '门源回族自治县',
          },
          {
            value: '632222',
            label: '祁连县',
          },
          {
            value: '632223',
            label: '海晏县',
          },
          {
            value: '632224',
            label: '刚察县',
          },
        ],
      },
      {
        value: '632300',
        label: '黄南藏族自治州',
        children: [
          {
            value: '632321',
            label: '同仁县',
          },
          {
            value: '632322',
            label: '尖扎县',
          },
          {
            value: '632323',
            label: '泽库县',
          },
          {
            value: '632324',
            label: '河南蒙古族自治县',
          },
        ],
      },
      {
        value: '632500',
        label: '海南藏族自治州',
        children: [
          {
            value: '632521',
            label: '共和县',
          },
          {
            value: '632522',
            label: '同德县',
          },
          {
            value: '632523',
            label: '贵德县',
          },
          {
            value: '632524',
            label: '兴海县',
          },
          {
            value: '632525',
            label: '贵南县',
          },
        ],
      },
      {
        value: '632600',
        label: '果洛藏族自治州',
        children: [
          {
            value: '632621',
            label: '玛沁县',
          },
          {
            value: '632622',
            label: '班玛县',
          },
          {
            value: '632623',
            label: '甘德县',
          },
          {
            value: '632624',
            label: '达日县',
          },
          {
            value: '632625',
            label: '久治县',
          },
          {
            value: '632626',
            label: '玛多县',
          },
        ],
      },
      {
        value: '632700',
        label: '玉树藏族自治州',
        children: [
          {
            value: '632701',
            label: '玉树市',
          },
          {
            value: '632722',
            label: '杂多县',
          },
          {
            value: '632723',
            label: '称多县',
          },
          {
            value: '632724',
            label: '治多县',
          },
          {
            value: '632725',
            label: '囊谦县',
          },
          {
            value: '632726',
            label: '曲麻莱县',
          },
        ],
      },
      {
        value: '632800',
        label: '海西蒙古族藏族自治州',
        children: [
          {
            value: '632801',
            label: '格尔木市',
          },
          {
            value: '632802',
            label: '德令哈市',
          },
          {
            value: '632803',
            label: '茫崖市',
          },
          {
            value: '632821',
            label: '乌兰县',
          },
          {
            value: '632822',
            label: '都兰县',
          },
          {
            value: '632823',
            label: '天峻县',
          },
        ],
      },
    ],
  },
  {
    value: '640000',
    label: '宁夏回族自治区',
    children: [
      {
        value: '640100',
        label: '银川市',
        children: [
          {
            value: '640104',
            label: '兴庆区',
          },
          {
            value: '640105',
            label: '西夏区',
          },
          {
            value: '640106',
            label: '金凤区',
          },
          {
            value: '640121',
            label: '永宁县',
          },
          {
            value: '640122',
            label: '贺兰县',
          },
          {
            value: '640181',
            label: '灵武市',
          },
        ],
      },
      {
        value: '640200',
        label: '石嘴山市',
        children: [
          {
            value: '640202',
            label: '大武口区',
          },
          {
            value: '640205',
            label: '惠农区',
          },
          {
            value: '640221',
            label: '平罗县',
          },
        ],
      },
      {
        value: '640300',
        label: '吴忠市',
        children: [
          {
            value: '640302',
            label: '利通区',
          },
          {
            value: '640303',
            label: '红寺堡区',
          },
          {
            value: '640323',
            label: '盐池县',
          },
          {
            value: '640324',
            label: '同心县',
          },
          {
            value: '640381',
            label: '青铜峡市',
          },
        ],
      },
      {
        value: '640400',
        label: '固原市',
        children: [
          {
            value: '640402',
            label: '原州区',
          },
          {
            value: '640422',
            label: '西吉县',
          },
          {
            value: '640423',
            label: '隆德县',
          },
          {
            value: '640424',
            label: '泾源县',
          },
          {
            value: '640425',
            label: '彭阳县',
          },
        ],
      },
      {
        value: '640500',
        label: '中卫市',
        children: [
          {
            value: '640502',
            label: '沙坡头区',
          },
          {
            value: '640521',
            label: '中宁县',
          },
          {
            value: '640522',
            label: '海原县',
          },
        ],
      },
    ],
  },
  {
    value: '650000',
    label: '新疆维吾尔自治区',
    children: [
      {
        value: '650100',
        label: '乌鲁木齐市',
        children: [
          {
            value: '650102',
            label: '天山区',
          },
          {
            value: '650103',
            label: '沙依巴克区',
          },
          {
            value: '650104',
            label: '新市区',
          },
          {
            value: '650105',
            label: '水磨沟区',
          },
          {
            value: '650106',
            label: '头屯河区',
          },
          {
            value: '650107',
            label: '达坂城区',
          },
          {
            value: '650109',
            label: '米东区',
          },
          {
            value: '650121',
            label: '乌鲁木齐县',
          },
        ],
      },
      {
        value: '650200',
        label: '克拉玛依市',
        children: [
          {
            value: '650202',
            label: '独山子区',
          },
          {
            value: '650203',
            label: '克拉玛依区',
          },
          {
            value: '650204',
            label: '白碱滩区',
          },
          {
            value: '650205',
            label: '乌尔禾区',
          },
        ],
      },
      {
        value: '650400',
        label: '吐鲁番市',
        children: [
          {
            value: '650402',
            label: '高昌区',
          },
          {
            value: '650421',
            label: '鄯善县',
          },
          {
            value: '650422',
            label: '托克逊县',
          },
        ],
      },
      {
        value: '650500',
        label: '哈密市',
        children: [
          {
            value: '650502',
            label: '伊州区',
          },
          {
            value: '650521',
            label: '巴里坤哈萨克自治县',
          },
          {
            value: '650522',
            label: '伊吾县',
          },
        ],
      },
      {
        value: '652300',
        label: '昌吉回族自治州',
        children: [
          {
            value: '652301',
            label: '昌吉市',
          },
          {
            value: '652302',
            label: '阜康市',
          },
          {
            value: '652323',
            label: '呼图壁县',
          },
          {
            value: '652324',
            label: '玛纳斯县',
          },
          {
            value: '652325',
            label: '奇台县',
          },
          {
            value: '652327',
            label: '吉木萨尔县',
          },
          {
            value: '652328',
            label: '木垒哈萨克自治县',
          },
        ],
      },
      {
        value: '652700',
        label: '博尔塔拉蒙古自治州',
        children: [
          {
            value: '652701',
            label: '博乐市',
          },
          {
            value: '652702',
            label: '阿拉山口市',
          },
          {
            value: '652722',
            label: '精河县',
          },
          {
            value: '652723',
            label: '温泉县',
          },
        ],
      },
      {
        value: '652800',
        label: '巴音郭楞蒙古自治州',
        children: [
          {
            value: '652801',
            label: '库尔勒市',
          },
          {
            value: '652822',
            label: '轮台县',
          },
          {
            value: '652823',
            label: '尉犁县',
          },
          {
            value: '652824',
            label: '若羌县',
          },
          {
            value: '652825',
            label: '且末县',
          },
          {
            value: '652826',
            label: '焉耆回族自治县',
          },
          {
            value: '652827',
            label: '和静县',
          },
          {
            value: '652828',
            label: '和硕县',
          },
          {
            value: '652829',
            label: '博湖县',
          },
        ],
      },
      {
        value: '652900',
        label: '阿克苏地区',
        children: [
          {
            value: '652901',
            label: '阿克苏市',
          },
          {
            value: '652922',
            label: '温宿县',
          },
          {
            value: '652923',
            label: '库车县',
          },
          {
            value: '652924',
            label: '沙雅县',
          },
          {
            value: '652925',
            label: '新和县',
          },
          {
            value: '652926',
            label: '拜城县',
          },
          {
            value: '652927',
            label: '乌什县',
          },
          {
            value: '652928',
            label: '阿瓦提县',
          },
          {
            value: '652929',
            label: '柯坪县',
          },
        ],
      },
      {
        value: '653000',
        label: '克孜勒苏柯尔克孜自治州',
        children: [
          {
            value: '653001',
            label: '阿图什市',
          },
          {
            value: '653022',
            label: '阿克陶县',
          },
          {
            value: '653023',
            label: '阿合奇县',
          },
          {
            value: '653024',
            label: '乌恰县',
          },
        ],
      },
      {
        value: '653100',
        label: '喀什地区',
        children: [
          {
            value: '653101',
            label: '喀什市',
          },
          {
            value: '653121',
            label: '疏附县',
          },
          {
            value: '653122',
            label: '疏勒县',
          },
          {
            value: '653123',
            label: '英吉沙县',
          },
          {
            value: '653124',
            label: '泽普县',
          },
          {
            value: '653125',
            label: '莎车县',
          },
          {
            value: '653126',
            label: '叶城县',
          },
          {
            value: '653127',
            label: '麦盖提县',
          },
          {
            value: '653128',
            label: '岳普湖县',
          },
          {
            value: '653129',
            label: '伽师县',
          },
          {
            value: '653130',
            label: '巴楚县',
          },
          {
            value: '653131',
            label: '塔什库尔干塔吉克自治县',
          },
        ],
      },
      {
        value: '653200',
        label: '和田地区',
        children: [
          {
            value: '653201',
            label: '和田市',
          },
          {
            value: '653221',
            label: '和田县',
          },
          {
            value: '653222',
            label: '墨玉县',
          },
          {
            value: '653223',
            label: '皮山县',
          },
          {
            value: '653224',
            label: '洛浦县',
          },
          {
            value: '653225',
            label: '策勒县',
          },
          {
            value: '653226',
            label: '于田县',
          },
          {
            value: '653227',
            label: '民丰县',
          },
        ],
      },
      {
        value: '654000',
        label: '伊犁哈萨克自治州',
        children: [
          {
            value: '654002',
            label: '伊宁市',
          },
          {
            value: '654003',
            label: '奎屯市',
          },
          {
            value: '654004',
            label: '霍尔果斯市',
          },
          {
            value: '654021',
            label: '伊宁县',
          },
          {
            value: '654022',
            label: '察布查尔锡伯自治县',
          },
          {
            value: '654023',
            label: '霍城县',
          },
          {
            value: '654024',
            label: '巩留县',
          },
          {
            value: '654025',
            label: '新源县',
          },
          {
            value: '654026',
            label: '昭苏县',
          },
          {
            value: '654027',
            label: '特克斯县',
          },
          {
            value: '654028',
            label: '尼勒克县',
          },
        ],
      },
      {
        value: '654200',
        label: '塔城地区',
        children: [
          {
            value: '654201',
            label: '塔城市',
          },
          {
            value: '654202',
            label: '乌苏市',
          },
          {
            value: '654221',
            label: '额敏县',
          },
          {
            value: '654223',
            label: '沙湾县',
          },
          {
            value: '654224',
            label: '托里县',
          },
          {
            value: '654225',
            label: '裕民县',
          },
          {
            value: '654226',
            label: '和布克赛尔蒙古自治县',
          },
        ],
      },
      {
        value: '654300',
        label: '阿勒泰地区',
        children: [
          {
            value: '654301',
            label: '阿勒泰市',
          },
          {
            value: '654321',
            label: '布尔津县',
          },
          {
            value: '654322',
            label: '富蕴县',
          },
          {
            value: '654323',
            label: '福海县',
          },
          {
            value: '654324',
            label: '哈巴河县',
          },
          {
            value: '654325',
            label: '青河县',
          },
          {
            value: '654326',
            label: '吉木乃县',
          },
        ],
      },
      {
        value: '659001',
        label: '石河子市',
        children: [
          {
            value: '659002',
            label: '阿拉尔市',
          },
          {
            value: '659003',
            label: '图木舒克市',
          },
          {
            value: '659004',
            label: '五家渠市',
          },
          {
            value: '659005',
            label: '北屯市',
          },
          {
            value: '659006',
            label: '铁门关市',
          },
          {
            value: '659007',
            label: '双河市',
          },
          {
            value: '659008',
            label: '可克达拉市',
          },
          {
            value: '659009',
            label: '昆玉市',
          },
        ],
      },
    ],
  },
  {
    value: '710000',
    label: '台湾省',
    children: [
      {
        value: '710100',
        label: '台北市',
        children: [
          {
            value: '710101',
            label: '中正区',
          },
          {
            value: '710102',
            label: '大同区',
          },
          {
            value: '710103',
            label: '中山区',
          },
          {
            value: '710104',
            label: '松山区',
          },
          {
            value: '710105',
            label: '大安区',
          },
          {
            value: '710106',
            label: '万华区',
          },
          {
            value: '710107',
            label: '信义区',
          },
          {
            value: '710108',
            label: '士林区',
          },
          {
            value: '710109',
            label: '北投区',
          },
          {
            value: '710110',
            label: '内湖区',
          },
          {
            value: '710111',
            label: '南港区',
          },
          {
            value: '710112',
            label: '文山区',
          },
        ],
      },
      {
        value: '710200',
        label: '高雄市',
        children: [
          {
            value: '710201',
            label: '新兴区',
          },
          {
            value: '710202',
            label: '前金区',
          },
          {
            value: '710203',
            label: '苓雅区',
          },
          {
            value: '710204',
            label: '盐埕区',
          },
          {
            value: '710205',
            label: '鼓山区',
          },
          {
            value: '710206',
            label: '旗津区',
          },
          {
            value: '710207',
            label: '前镇区',
          },
          {
            value: '710208',
            label: '三民区',
          },
          {
            value: '710209',
            label: '左营区',
          },
          {
            value: '710210',
            label: '楠梓区',
          },
          {
            value: '710211',
            label: '小港区',
          },
          {
            value: '710212',
            label: '仁武区',
          },
          {
            value: '710213',
            label: '大社区',
          },
          {
            value: '710214',
            label: '冈山区',
          },
          {
            value: '710215',
            label: '路竹区',
          },
          {
            value: '710216',
            label: '阿莲区',
          },
          {
            value: '710217',
            label: '田寮区',
          },
          {
            value: '710218',
            label: '燕巢区',
          },
          {
            value: '710219',
            label: '桥头区',
          },
          {
            value: '710220',
            label: '梓官区',
          },
          {
            value: '710221',
            label: '弥陀区',
          },
          {
            value: '710222',
            label: '永安区',
          },
          {
            value: '710223',
            label: '湖内区',
          },
          {
            value: '710224',
            label: '凤山区',
          },
          {
            value: '710225',
            label: '大寮区',
          },
          {
            value: '710226',
            label: '林园区',
          },
          {
            value: '710227',
            label: '鸟松区',
          },
          {
            value: '710228',
            label: '大树区',
          },
          {
            value: '710229',
            label: '旗山区',
          },
          {
            value: '710230',
            label: '美浓区',
          },
          {
            value: '710231',
            label: '六龟区',
          },
          {
            value: '710232',
            label: '内门区',
          },
          {
            value: '710233',
            label: '杉林区',
          },
          {
            value: '710234',
            label: '甲仙区',
          },
          {
            value: '710235',
            label: '桃源区',
          },
          {
            value: '710236',
            label: '那玛夏区',
          },
          {
            value: '710237',
            label: '茂林区',
          },
          {
            value: '710238',
            label: '茄萣区',
          },
        ],
      },
      {
        value: '710300',
        label: '台南市',
        children: [
          {
            value: '710301',
            label: '中西区',
          },
          {
            value: '710302',
            label: '东区',
          },
          {
            value: '710303',
            label: '南区',
          },
          {
            value: '710304',
            label: '北区',
          },
          {
            value: '710305',
            label: '安平区',
          },
          {
            value: '710306',
            label: '安南区',
          },
          {
            value: '710307',
            label: '永康区',
          },
          {
            value: '710308',
            label: '归仁区',
          },
          {
            value: '710309',
            label: '新化区',
          },
          {
            value: '710310',
            label: '左镇区',
          },
          {
            value: '710311',
            label: '玉井区',
          },
          {
            value: '710312',
            label: '楠西区',
          },
          {
            value: '710313',
            label: '南化区',
          },
          {
            value: '710314',
            label: '仁德区',
          },
          {
            value: '710315',
            label: '关庙区',
          },
          {
            value: '710316',
            label: '龙崎区',
          },
          {
            value: '710317',
            label: '官田区',
          },
          {
            value: '710318',
            label: '麻豆区',
          },
          {
            value: '710319',
            label: '佳里区',
          },
          {
            value: '710320',
            label: '西港区',
          },
          {
            value: '710321',
            label: '七股区',
          },
          {
            value: '710322',
            label: '将军区',
          },
          {
            value: '710323',
            label: '学甲区',
          },
          {
            value: '710324',
            label: '北门区',
          },
          {
            value: '710325',
            label: '新营区',
          },
          {
            value: '710326',
            label: '后壁区',
          },
          {
            value: '710327',
            label: '白河区',
          },
          {
            value: '710328',
            label: '东山区',
          },
          {
            value: '710329',
            label: '六甲区',
          },
          {
            value: '710330',
            label: '下营区',
          },
          {
            value: '710331',
            label: '柳营区',
          },
          {
            value: '710332',
            label: '盐水区',
          },
          {
            value: '710333',
            label: '善化区',
          },
          {
            value: '710334',
            label: '大内区',
          },
          {
            value: '710335',
            label: '山上区',
          },
          {
            value: '710336',
            label: '新市区',
          },
          {
            value: '710337',
            label: '安定区',
          },
        ],
      },
      {
        value: '710400',
        label: '台中市',
        children: [
          {
            value: '710401',
            label: '中区',
          },
          {
            value: '710402',
            label: '东区',
          },
          {
            value: '710403',
            label: '南区',
          },
          {
            value: '710404',
            label: '西区',
          },
          {
            value: '710405',
            label: '北区',
          },
          {
            value: '710406',
            label: '北屯区',
          },
          {
            value: '710407',
            label: '西屯区',
          },
          {
            value: '710408',
            label: '南屯区',
          },
          {
            value: '710409',
            label: '太平区',
          },
          {
            value: '710410',
            label: '大里区',
          },
          {
            value: '710411',
            label: '雾峰区',
          },
          {
            value: '710412',
            label: '乌日区',
          },
          {
            value: '710413',
            label: '丰原区',
          },
          {
            value: '710414',
            label: '后里区',
          },
          {
            value: '710415',
            label: '石冈区',
          },
          {
            value: '710416',
            label: '东势区',
          },
          {
            value: '710417',
            label: '和平区',
          },
          {
            value: '710418',
            label: '新社区',
          },
          {
            value: '710419',
            label: '潭子区',
          },
          {
            value: '710420',
            label: '大雅区',
          },
          {
            value: '710421',
            label: '神冈区',
          },
          {
            value: '710422',
            label: '大肚区',
          },
          {
            value: '710423',
            label: '沙鹿区',
          },
          {
            value: '710424',
            label: '龙井区',
          },
          {
            value: '710425',
            label: '梧栖区',
          },
          {
            value: '710426',
            label: '清水区',
          },
          {
            value: '710427',
            label: '大甲区',
          },
          {
            value: '710428',
            label: '外埔区',
          },
          {
            value: '710429',
            label: '大安区',
          },
        ],
      },
      {
        value: '710500',
        label: '南投县',
        children: [
          {
            value: '710501',
            label: '南投市',
          },
          {
            value: '710502',
            label: '中寮乡',
          },
          {
            value: '710503',
            label: '草屯镇',
          },
          {
            value: '710504',
            label: '国姓乡',
          },
          {
            value: '710505',
            label: '埔里镇',
          },
          {
            value: '710506',
            label: '仁爱乡',
          },
          {
            value: '710507',
            label: '名间乡',
          },
          {
            value: '710508',
            label: '集集镇',
          },
          {
            value: '710509',
            label: '水里乡',
          },
          {
            value: '710510',
            label: '鱼池乡',
          },
          {
            value: '710511',
            label: '信义乡',
          },
          {
            value: '710512',
            label: '竹山镇',
          },
          {
            value: '710513',
            label: '鹿谷乡',
          },
        ],
      },
      {
        value: '710600',
        label: '基隆市',
        children: [
          {
            value: '710601',
            label: '仁爱区',
          },
          {
            value: '710602',
            label: '信义区',
          },
          {
            value: '710603',
            label: '中正区',
          },
          {
            value: '710604',
            label: '中山区',
          },
          {
            value: '710605',
            label: '安乐区',
          },
          {
            value: '710606',
            label: '暖暖区',
          },
          {
            value: '710607',
            label: '七堵区',
          },
        ],
      },
      {
        value: '710700',
        label: '新竹市',
        children: [
          {
            value: '710701',
            label: '东区',
          },
          {
            value: '710702',
            label: '北区',
          },
          {
            value: '710703',
            label: '香山区',
          },
        ],
      },
      {
        value: '710800',
        label: '嘉义市',
        children: [
          {
            value: '710801',
            label: '东区',
          },
          {
            value: '710802',
            label: '西区',
          },
        ],
      },
      {
        value: '710900',
        label: '新北市',
        children: [
          {
            value: '710901',
            label: '万里区',
          },
          {
            value: '710902',
            label: '金山区',
          },
          {
            value: '710903',
            label: '板桥区',
          },
          {
            value: '710904',
            label: '汐止区',
          },
          {
            value: '710905',
            label: '深坑区',
          },
          {
            value: '710906',
            label: '石碇区',
          },
          {
            value: '710907',
            label: '瑞芳区',
          },
          {
            value: '710908',
            label: '平溪区',
          },
          {
            value: '710909',
            label: '双溪区',
          },
          {
            value: '710910',
            label: '贡寮区',
          },
          {
            value: '710911',
            label: '新店区',
          },
          {
            value: '710912',
            label: '坪林区',
          },
          {
            value: '710913',
            label: '乌来区',
          },
          {
            value: '710914',
            label: '永和区',
          },
          {
            value: '710915',
            label: '中和区',
          },
          {
            value: '710916',
            label: '土城区',
          },
          {
            value: '710917',
            label: '三峡区',
          },
          {
            value: '710918',
            label: '树林区',
          },
          {
            value: '710919',
            label: '莺歌区',
          },
          {
            value: '710920',
            label: '三重区',
          },
          {
            value: '710921',
            label: '新庄区',
          },
          {
            value: '710922',
            label: '泰山区',
          },
          {
            value: '710923',
            label: '林口区',
          },
          {
            value: '710924',
            label: '芦洲区',
          },
          {
            value: '710925',
            label: '五股区',
          },
          {
            value: '710926',
            label: '八里区',
          },
          {
            value: '710927',
            label: '淡水区',
          },
          {
            value: '710928',
            label: '三芝区',
          },
          {
            value: '710929',
            label: '石门区',
          },
        ],
      },
      {
        value: '711000',
        label: '宜兰县',
        children: [
          {
            value: '711001',
            label: '宜兰市',
          },
          {
            value: '711002',
            label: '头城镇',
          },
          {
            value: '711003',
            label: '礁溪乡',
          },
          {
            value: '711004',
            label: '壮围乡',
          },
          {
            value: '711005',
            label: '员山乡',
          },
          {
            value: '711006',
            label: '罗东镇',
          },
          {
            value: '711007',
            label: '三星乡',
          },
          {
            value: '711008',
            label: '大同乡',
          },
          {
            value: '711009',
            label: '五结乡',
          },
          {
            value: '711010',
            label: '冬山乡',
          },
          {
            value: '711011',
            label: '苏澳乡',
          },
          {
            value: '711012',
            label: '苏澳镇',
          },
          {
            value: '711013',
            label: '南澳乡',
          },
        ],
      },
      {
        value: '711100',
        label: '新竹县',
        children: [
          {
            value: '711101',
            label: '竹北市',
          },
          {
            value: '711102',
            label: '湖口乡',
          },
          {
            value: '711103',
            label: '新丰乡',
          },
          {
            value: '711104',
            label: '新埔镇',
          },
          {
            value: '711105',
            label: '关西镇',
          },
          {
            value: '711106',
            label: '芎林乡',
          },
          {
            value: '711107',
            label: '宝山乡',
          },
          {
            value: '711108',
            label: '竹东镇',
          },
          {
            value: '711109',
            label: '五峰乡',
          },
          {
            value: '711110',
            label: '横山乡',
          },
          {
            value: '711111',
            label: '尖石乡',
          },
          {
            value: '711112',
            label: '北埔乡',
          },
          {
            value: '711113',
            label: '峨眉乡',
          },
        ],
      },
      {
        value: '711200',
        label: '桃园市',
        children: [
          {
            value: '711201',
            label: '中坜区',
          },
          {
            value: '711202',
            label: '平镇区',
          },
          {
            value: '711203',
            label: '龙潭区',
          },
          {
            value: '711204',
            label: '杨梅区',
          },
          {
            value: '711205',
            label: '新屋区',
          },
          {
            value: '711206',
            label: '观音区',
          },
          {
            value: '711207',
            label: '桃园区',
          },
          {
            value: '711208',
            label: '龟山区',
          },
          {
            value: '711209',
            label: '八德区',
          },
          {
            value: '711210',
            label: '大溪区',
          },
          {
            value: '711211',
            label: '复兴区',
          },
          {
            value: '711212',
            label: '大园区',
          },
          {
            value: '711213',
            label: '芦竹区',
          },
        ],
      },
      {
        value: '711300',
        label: '苗栗县',
        children: [
          {
            value: '711301',
            label: '竹南镇',
          },
          {
            value: '711302',
            label: '头份市',
          },
          {
            value: '711303',
            label: '三湾乡',
          },
          {
            value: '711304',
            label: '南庄乡',
          },
          {
            value: '711305',
            label: '狮潭乡',
          },
          {
            value: '711306',
            label: '后龙镇',
          },
          {
            value: '711307',
            label: '通宵镇',
          },
          {
            value: '711308',
            label: '苑里镇',
          },
          {
            value: '711309',
            label: '苗栗市',
          },
          {
            value: '711310',
            label: '造桥乡',
          },
          {
            value: '711311',
            label: '头屋乡',
          },
          {
            value: '711312',
            label: '公馆乡',
          },
          {
            value: '711313',
            label: '大湖乡',
          },
          {
            value: '711314',
            label: '泰安乡',
          },
          {
            value: '711315',
            label: '铜锣乡',
          },
          {
            value: '711316',
            label: '三义乡',
          },
          {
            value: '711317',
            label: '西湖乡',
          },
          {
            value: '711318',
            label: '卓兰镇',
          },
        ],
      },
      {
        value: '711400',
        label: '彰化县',
        children: [
          {
            value: '711401',
            label: '彰化市',
          },
          {
            value: '711402',
            label: '芬园乡',
          },
          {
            value: '711403',
            label: '花坛乡',
          },
          {
            value: '711404',
            label: '透水乡',
          },
          {
            value: '711405',
            label: '鹿港镇',
          },
          {
            value: '711406',
            label: '福兴乡',
          },
          {
            value: '711407',
            label: '线西乡',
          },
          {
            value: '711408',
            label: '和美镇',
          },
          {
            value: '711409',
            label: '伸港乡',
          },
          {
            value: '711410',
            label: '员林市',
          },
          {
            value: '711411',
            label: '社头乡',
          },
          {
            value: '711412',
            label: '永靖乡',
          },
          {
            value: '711413',
            label: '埔心乡',
          },
          {
            value: '711414',
            label: '溪湖镇',
          },
          {
            value: '711415',
            label: '大村乡',
          },
          {
            value: '711416',
            label: '埔盐乡',
          },
          {
            value: '711417',
            label: '田中镇',
          },
          {
            value: '711418',
            label: '北斗镇',
          },
          {
            value: '711419',
            label: '田尾乡',
          },
          {
            value: '711420',
            label: '埤头乡',
          },
          {
            value: '711421',
            label: '溪州乡',
          },
          {
            value: '711422',
            label: '竹塘乡',
          },
          {
            value: '711423',
            label: '二林镇',
          },
          {
            value: '711424',
            label: '大城乡',
          },
          {
            value: '711425',
            label: '芳苑乡',
          },
          {
            value: '711426',
            label: '二水乡',
          },
        ],
      },
      {
        value: '711500',
        label: '嘉义县',
        children: [
          {
            value: '711501',
            label: '番路乡',
          },
          {
            value: '711502',
            label: '梅山乡',
          },
          {
            value: '711503',
            label: '竹崎乡',
          },
          {
            value: '711504',
            label: '阿里山乡',
          },
          {
            value: '711505',
            label: '中埔乡',
          },
          {
            value: '711506',
            label: '大埔乡',
          },
          {
            value: '711507',
            label: '水上乡',
          },
          {
            value: '711508',
            label: '鹿草乡',
          },
          {
            value: '711509',
            label: '太保市',
          },
          {
            value: '711510',
            label: '朴子市',
          },
          {
            value: '711511',
            label: '东石乡',
          },
          {
            value: '711512',
            label: '六脚乡',
          },
          {
            value: '711513',
            label: '新港乡',
          },
          {
            value: '711514',
            label: '民雄乡',
          },
          {
            value: '711515',
            label: '大林镇',
          },
          {
            value: '711516',
            label: '溪口乡',
          },
          {
            value: '711517',
            label: '义竹乡',
          },
          {
            value: '711518',
            label: '布袋镇',
          },
        ],
      },
      {
        value: '711600',
        label: '云林县',
        children: [
          {
            value: '711601',
            label: '斗南镇',
          },
          {
            value: '711602',
            label: '大埤乡',
          },
          {
            value: '711603',
            label: '虎尾镇',
          },
          {
            value: '711604',
            label: '土库镇',
          },
          {
            value: '711605',
            label: '褒忠乡',
          },
          {
            value: '711606',
            label: '东势乡',
          },
          {
            value: '711607',
            label: '台西乡',
          },
          {
            value: '711608',
            label: '仑背乡',
          },
          {
            value: '711609',
            label: '麦寮乡',
          },
          {
            value: '711610',
            label: '斗六市',
          },
          {
            value: '711611',
            label: '林内乡',
          },
          {
            value: '711612',
            label: '古坑乡',
          },
          {
            value: '711613',
            label: '莿桐乡',
          },
          {
            value: '711614',
            label: '西螺镇',
          },
          {
            value: '711615',
            label: '二仑乡',
          },
          {
            value: '711616',
            label: '北港镇',
          },
          {
            value: '711617',
            label: '水林乡',
          },
          {
            value: '711618',
            label: '口湖乡',
          },
          {
            value: '711619',
            label: '四湖乡',
          },
          {
            value: '711620',
            label: '元长乡',
          },
        ],
      },
      {
        value: '711700',
        label: '屏东县',
        children: [
          {
            value: '711701',
            label: '屏东市',
          },
          {
            value: '711702',
            label: '三地门乡',
          },
          {
            value: '711703',
            label: '雾台乡',
          },
          {
            value: '711704',
            label: '玛家乡',
          },
          {
            value: '711705',
            label: '九如乡',
          },
          {
            value: '711706',
            label: '里港乡',
          },
          {
            value: '711707',
            label: '高树乡',
          },
          {
            value: '711708',
            label: '盐埔乡',
          },
          {
            value: '711709',
            label: '长治乡',
          },
          {
            value: '711710',
            label: '麟洛乡',
          },
          {
            value: '711711',
            label: '竹田乡',
          },
          {
            value: '711712',
            label: '内埔乡',
          },
          {
            value: '711713',
            label: '万丹乡',
          },
          {
            value: '711714',
            label: '潮州镇',
          },
          {
            value: '711715',
            label: '泰武乡',
          },
          {
            value: '711716',
            label: '来义乡',
          },
          {
            value: '711717',
            label: '万峦乡',
          },
          {
            value: '711718',
            label: '崁顶乡',
          },
          {
            value: '711719',
            label: '新埤乡',
          },
          {
            value: '711720',
            label: '南州乡',
          },
          {
            value: '711721',
            label: '林边乡',
          },
          {
            value: '711722',
            label: '东港镇',
          },
          {
            value: '711723',
            label: '琉球乡',
          },
          {
            value: '711724',
            label: '佳冬乡',
          },
          {
            value: '711725',
            label: '新园乡',
          },
          {
            value: '711726',
            label: '枋寮乡',
          },
          {
            value: '711727',
            label: '枋山乡',
          },
          {
            value: '711728',
            label: '春日乡',
          },
          {
            value: '711729',
            label: '狮子乡',
          },
          {
            value: '711730',
            label: '车城乡',
          },
          {
            value: '711731',
            label: '牡丹乡',
          },
          {
            value: '711732',
            label: '恒春镇',
          },
          {
            value: '711733',
            label: '满州乡',
          },
        ],
      },
      {
        value: '711800',
        label: '台东县',
        children: [
          {
            value: '711801',
            label: '台东市',
          },
          {
            value: '711802',
            label: '绿岛乡',
          },
          {
            value: '711803',
            label: '兰屿乡',
          },
          {
            value: '711804',
            label: '延平乡',
          },
          {
            value: '711805',
            label: '卑南乡',
          },
          {
            value: '711806',
            label: '鹿野乡',
          },
          {
            value: '711807',
            label: '关山镇',
          },
          {
            value: '711808',
            label: '海端乡',
          },
          {
            value: '711809',
            label: '池上乡',
          },
          {
            value: '711810',
            label: '东河乡',
          },
          {
            value: '711811',
            label: '成功镇',
          },
          {
            value: '711812',
            label: '长滨乡',
          },
          {
            value: '711813',
            label: '金峰乡',
          },
          {
            value: '711814',
            label: '大武乡',
          },
          {
            value: '711815',
            label: '达仁乡',
          },
          {
            value: '711816',
            label: '太麻里乡',
          },
        ],
      },
      {
        value: '711900',
        label: '花莲县',
        children: [
          {
            value: '711901',
            label: '花莲市',
          },
          {
            value: '711902',
            label: '新城乡',
          },
          {
            value: '711903',
            label: '秀林乡',
          },
          {
            value: '711904',
            label: '吉安乡',
          },
          {
            value: '711905',
            label: '寿丰乡',
          },
          {
            value: '711906',
            label: '凤林镇',
          },
          {
            value: '711907',
            label: '光复乡',
          },
          {
            value: '711908',
            label: '丰宾乡',
          },
          {
            value: '711909',
            label: '瑞穗乡',
          },
          {
            value: '711910',
            label: '万荣乡',
          },
          {
            value: '711911',
            label: '玉里镇',
          },
          {
            value: '711912',
            label: '卓溪乡',
          },
          {
            value: '711913',
            label: '富里乡',
          },
        ],
      },
      {
        value: '712000',
        label: '澎湖县',
        children: [
          {
            value: '712001',
            label: '马公市',
          },
          {
            value: '712002',
            label: '西屿乡',
          },
          {
            value: '712003',
            label: '望安乡',
          },
          {
            value: '712004',
            label: '七美乡',
          },
          {
            value: '712005',
            label: '白沙乡',
          },
          {
            value: '712006',
            label: '湖西乡',
          },
        ],
      },
    ],
  },
  {
    value: '810000',
    label: '香港',
    children: [
      {
        value: '810000',
        label: '香港特别行政区',
        children: [
          {
            value: '810101',
            label: '中西区',
          },
          {
            value: '810102',
            label: '东区',
          },
          {
            value: '810103',
            label: '九龙城区',
          },
          {
            value: '810104',
            label: '观塘区',
          },
          {
            value: '810105',
            label: '南区',
          },
          {
            value: '810106',
            label: '深水埗区',
          },
          {
            value: '810107',
            label: '湾仔区',
          },
          {
            value: '810108',
            label: '黄大仙区',
          },
          {
            value: '810109',
            label: '油尖旺区',
          },
          {
            value: '810110',
            label: '离岛区',
          },
          {
            value: '810111',
            label: '葵青区',
          },
          {
            value: '810112',
            label: '北区',
          },
          {
            value: '810113',
            label: '西贡区',
          },
          {
            value: '810114',
            label: '沙田区',
          },
          {
            value: '810115',
            label: '屯门区',
          },
          {
            value: '810116',
            label: '大埔区',
          },
          {
            value: '810117',
            label: '荃湾区',
          },
          {
            value: '810118',
            label: '元朗区',
          },
        ],
      },
    ],
  },
  {
    value: '820000',
    label: '澳门',
    children: [
      {
        value: '820000',
        label: '澳门特别行政区',
        children: [
          {
            value: '820101',
            label: '澳门半岛',
          },
          {
            value: '820102',
            label: '凼仔',
          },
          {
            value: '820103',
            label: '路凼城',
          },
          {
            value: '820104',
            label: '路环',
          },
        ],
      },
    ],
  },
]
// 国家/省/市
export const CountryProvinceCityOptions: AddressOption[] = [
  {
    label: '中国',
    value: '10009',
    children: ProvinceCityOptions,
  },
]

//地区编码转换地区文字  110000 =>北京市
export function getAddressByCodeList(_data) {
  let _address = ''
  let optionsList: any = CountryProvinceCityOptions.slice(0)
  _data.forEach((item, index) => {
    const sameOption = optionsList.filter((aitem) => aitem.value == item)[0]
    if (!sameOption) {
      return
    }
    const children = sameOption && sameOption.children
    optionsList = children
    if (!_address) {
      if (index != 0) {
        //暂时把国家屏蔽了
        _address = sameOption.label
      }
    } else {
      _address = `${_address}-${sameOption.label}`
    }
  })
  return _address
}

export const ProvinceCityRecord = {
  '110000': '北京市',
  '110101': '东城区',
  '110102': '西城区',
  '110105': '朝阳区',
  '110106': '丰台区',
  '110107': '石景山区',
  '110108': '海淀区',
  '110109': '门头沟区',
  '110111': '房山区',
  '110112': '通州区',
  '110113': '顺义区',
  '110114': '昌平区',
  '110115': '大兴区',
  '110116': '怀柔区',
  '110117': '平谷区',
  '110118': '密云区',
  '110119': '延庆区',
  '120000': '天津市',
  '120101': '和平区',
  '120102': '河东区',
  '120103': '河西区',
  '120104': '南开区',
  '120105': '河北区',
  '120106': '红桥区',
  '120110': '东丽区',
  '120111': '西青区',
  '120112': '津南区',
  '120113': '北辰区',
  '120114': '武清区',
  '120115': '宝坻区',
  '120116': '滨海新区',
  '120117': '宁河区',
  '120118': '静海区',
  '120119': '蓟州区',
  '130000': '河北省',
  '130100': '石家庄市',
  '130102': '长安区',
  '130104': '桥西区',
  '130105': '新华区',
  '130107': '井陉矿区',
  '130108': '裕华区',
  '130109': '藁城区',
  '130110': '鹿泉区',
  '130111': '栾城区',
  '130121': '井陉县',
  '130123': '正定县',
  '130125': '行唐县',
  '130126': '灵寿县',
  '130127': '高邑县',
  '130128': '深泽县',
  '130129': '赞皇县',
  '130130': '无极县',
  '130131': '平山县',
  '130132': '元氏县',
  '130133': '赵县',
  '130181': '辛集市',
  '130183': '晋州市',
  '130184': '新乐市',
  '130200': '唐山市',
  '130202': '路南区',
  '130203': '路北区',
  '130204': '古冶区',
  '130205': '开平区',
  '130207': '丰南区',
  '130208': '丰润区',
  '130209': '曹妃甸区',
  '130223': '滦县',
  '130224': '滦南县',
  '130225': '乐亭县',
  '130227': '迁西县',
  '130229': '玉田县',
  '130281': '遵化市',
  '130283': '迁安市',
  '130300': '秦皇岛市',
  '130302': '海港区',
  '130303': '山海关区',
  '130304': '北戴河区',
  '130306': '抚宁区',
  '130321': '青龙满族自治县',
  '130322': '昌黎县',
  '130324': '卢龙县',
  '130400': '邯郸市',
  '130402': '邯山区',
  '130403': '丛台区',
  '130404': '复兴区',
  '130406': '峰峰矿区',
  '130407': '肥乡区',
  '130408': '永年区',
  '130423': '临漳县',
  '130424': '成安县',
  '130425': '大名县',
  '130426': '涉县',
  '130427': '磁县',
  '130430': '邱县',
  '130431': '鸡泽县',
  '130432': '广平县',
  '130433': '馆陶县',
  '130434': '魏县',
  '130435': '曲周县',
  '130481': '武安市',
  '130500': '邢台市',
  '130502': '桥东区',
  '130503': '桥西区',
  '130521': '邢台县',
  '130522': '临城县',
  '130523': '内丘县',
  '130524': '柏乡县',
  '130525': '隆尧县',
  '130526': '任县',
  '130527': '南和县',
  '130528': '宁晋县',
  '130529': '巨鹿县',
  '130530': '新河县',
  '130531': '广宗县',
  '130532': '平乡县',
  '130533': '威县',
  '130534': '清河县',
  '130535': '临西县',
  '130581': '南宫市',
  '130582': '沙河市',
  '130600': '保定市',
  '130602': '竞秀区',
  '130606': '莲池区',
  '130607': '满城区',
  '130608': '清苑区',
  '130609': '徐水区',
  '130623': '涞水县',
  '130624': '阜平县',
  '130626': '定兴县',
  '130627': '唐县',
  '130628': '高阳县',
  '130629': '容城县',
  '130630': '涞源县',
  '130631': '望都县',
  '130632': '安新县',
  '130633': '易县',
  '130634': '曲阳县',
  '130635': '蠡县',
  '130636': '顺平县',
  '130637': '博野县',
  '130638': '雄县',
  '130681': '涿州市',
  '130682': '定州市',
  '130683': '安国市',
  '130684': '高碑店市',
  '130700': '张家口市',
  '130702': '桥东区',
  '130703': '桥西区',
  '130705': '宣化区',
  '130706': '下花园区',
  '130708': '万全区',
  '130709': '崇礼区',
  '130722': '张北县',
  '130723': '康保县',
  '130724': '沽源县',
  '130725': '尚义县',
  '130726': '蔚县',
  '130727': '阳原县',
  '130728': '怀安县',
  '130730': '怀来县',
  '130731': '涿鹿县',
  '130732': '赤城县',
  '130800': '承德市',
  '130802': '双桥区',
  '130803': '双滦区',
  '130804': '鹰手营子矿区',
  '130821': '承德县',
  '130822': '兴隆县',
  '130824': '滦平县',
  '130825': '隆化县',
  '130826': '丰宁满族自治县',
  '130827': '宽城满族自治县',
  '130828': '围场满族蒙古族自治县',
  '130881': '平泉市',
  '130900': '沧州市',
  '130902': '新华区',
  '130903': '运河区',
  '130921': '沧县',
  '130922': '青县',
  '130923': '东光县',
  '130924': '海兴县',
  '130925': '盐山县',
  '130926': '肃宁县',
  '130927': '南皮县',
  '130928': '吴桥县',
  '130929': '献县',
  '130930': '孟村回族自治县',
  '130981': '泊头市',
  '130982': '任丘市',
  '130983': '黄骅市',
  '130984': '河间市',
  '131000': '廊坊市',
  '131002': '安次区',
  '131003': '广阳区',
  '131022': '固安县',
  '131023': '永清县',
  '131024': '香河县',
  '131025': '大城县',
  '131026': '文安县',
  '131028': '大厂回族自治县',
  '131081': '霸州市',
  '131082': '三河市',
  '131100': '衡水市',
  '131102': '桃城区',
  '131103': '冀州区',
  '131121': '枣强县',
  '131122': '武邑县',
  '131123': '武强县',
  '131124': '饶阳县',
  '131125': '安平县',
  '131126': '故城县',
  '131127': '景县',
  '131128': '阜城县',
  '131182': '深州市',
  '140000': '山西省',
  '140100': '太原市',
  '140105': '小店区',
  '140106': '迎泽区',
  '140107': '杏花岭区',
  '140108': '尖草坪区',
  '140109': '万柏林区',
  '140110': '晋源区',
  '140121': '清徐县',
  '140122': '阳曲县',
  '140123': '娄烦县',
  '140181': '古交市',
  '140200': '大同市',
  '140212': '新荣区',
  '140213': '平城区',
  '140214': '云冈区',
  '140215': '云州区',
  '140221': '阳高县',
  '140222': '天镇县',
  '140223': '广灵县',
  '140224': '灵丘县',
  '140225': '浑源县',
  '140226': '左云县',
  '140300': '阳泉市',
  '140302': '城区',
  '140303': '矿区',
  '140311': '郊区',
  '140321': '平定县',
  '140322': '盂县',
  '140400': '长治市',
  '140402': '城区',
  '140411': '郊区',
  '140421': '长治县',
  '140423': '襄垣县',
  '140424': '屯留县',
  '140425': '平顺县',
  '140426': '黎城县',
  '140427': '壶关县',
  '140428': '长子县',
  '140429': '武乡县',
  '140430': '沁县',
  '140431': '沁源县',
  '140481': '潞城市',
  '140500': '晋城市',
  '140502': '城区',
  '140521': '沁水县',
  '140522': '阳城县',
  '140524': '陵川县',
  '140525': '泽州县',
  '140581': '高平市',
  '140600': '朔州市',
  '140602': '朔城区',
  '140603': '平鲁区',
  '140621': '山阴县',
  '140622': '应县',
  '140623': '右玉县',
  '140681': '怀仁市',
  '140700': '晋中市',
  '140702': '榆次区',
  '140721': '榆社县',
  '140722': '左权县',
  '140723': '和顺县',
  '140724': '昔阳县',
  '140725': '寿阳县',
  '140726': '太谷县',
  '140727': '祁县',
  '140728': '平遥县',
  '140729': '灵石县',
  '140781': '介休市',
  '140800': '运城市',
  '140802': '盐湖区',
  '140821': '临猗县',
  '140822': '万荣县',
  '140823': '闻喜县',
  '140824': '稷山县',
  '140825': '新绛县',
  '140826': '绛县',
  '140827': '垣曲县',
  '140828': '夏县',
  '140829': '平陆县',
  '140830': '芮城县',
  '140881': '永济市',
  '140882': '河津市',
  '140900': '忻州市',
  '140902': '忻府区',
  '140921': '定襄县',
  '140922': '五台县',
  '140923': '代县',
  '140924': '繁峙县',
  '140925': '宁武县',
  '140926': '静乐县',
  '140927': '神池县',
  '140928': '五寨县',
  '140929': '岢岚县',
  '140930': '河曲县',
  '140931': '保德县',
  '140932': '偏关县',
  '140981': '原平市',
  '141000': '临汾市',
  '141002': '尧都区',
  '141021': '曲沃县',
  '141022': '翼城县',
  '141023': '襄汾县',
  '141024': '洪洞县',
  '141025': '古县',
  '141026': '安泽县',
  '141027': '浮山县',
  '141028': '吉县',
  '141029': '乡宁县',
  '141030': '大宁县',
  '141031': '隰县',
  '141032': '永和县',
  '141033': '蒲县',
  '141034': '汾西县',
  '141081': '侯马市',
  '141082': '霍州市',
  '141100': '吕梁市',
  '141102': '离石区',
  '141121': '文水县',
  '141122': '交城县',
  '141123': '兴县',
  '141124': '临县',
  '141125': '柳林县',
  '141126': '石楼县',
  '141127': '岚县',
  '141128': '方山县',
  '141129': '中阳县',
  '141130': '交口县',
  '141181': '孝义市',
  '141182': '汾阳市',
  '150000': '内蒙古自治区',
  '150100': '呼和浩特市',
  '150102': '新城区',
  '150103': '回民区',
  '150104': '玉泉区',
  '150105': '赛罕区',
  '150121': '土默特左旗',
  '150122': '托克托县',
  '150123': '和林格尔县',
  '150124': '清水河县',
  '150125': '武川县',
  '150200': '包头市',
  '150202': '东河区',
  '150203': '昆都仑区',
  '150204': '青山区',
  '150205': '石拐区',
  '150206': '白云鄂博矿区',
  '150207': '九原区',
  '150221': '土默特右旗',
  '150222': '固阳县',
  '150223': '达尔罕茂明安联合旗',
  '150300': '乌海市',
  '150302': '海勃湾区',
  '150303': '海南区',
  '150304': '乌达区',
  '150400': '赤峰市',
  '150402': '红山区',
  '150403': '元宝山区',
  '150404': '松山区',
  '150421': '阿鲁科尔沁旗',
  '150422': '巴林左旗',
  '150423': '巴林右旗',
  '150424': '林西县',
  '150425': '克什克腾旗',
  '150426': '翁牛特旗',
  '150428': '喀喇沁旗',
  '150429': '宁城县',
  '150430': '敖汉旗',
  '150500': '通辽市',
  '150502': '科尔沁区',
  '150521': '科尔沁左翼中旗',
  '150522': '科尔沁左翼后旗',
  '150523': '开鲁县',
  '150524': '库伦旗',
  '150525': '奈曼旗',
  '150526': '扎鲁特旗',
  '150581': '霍林郭勒市',
  '150600': '鄂尔多斯市',
  '150602': '东胜区',
  '150603': '康巴什区',
  '150621': '达拉特旗',
  '150622': '准格尔旗',
  '150623': '鄂托克前旗',
  '150624': '鄂托克旗',
  '150625': '杭锦旗',
  '150626': '乌审旗',
  '150627': '伊金霍洛旗',
  '150700': '呼伦贝尔市',
  '150702': '海拉尔区',
  '150703': '扎赉诺尔区',
  '150721': '阿荣旗',
  '150722': '莫力达瓦达斡尔族自治旗',
  '150723': '鄂伦春自治旗',
  '150724': '鄂温克族自治旗',
  '150725': '陈巴尔虎旗',
  '150726': '新巴尔虎左旗',
  '150727': '新巴尔虎右旗',
  '150781': '满洲里市',
  '150782': '牙克石市',
  '150783': '扎兰屯市',
  '150784': '额尔古纳市',
  '150785': '根河市',
  '150800': '巴彦淖尔市',
  '150802': '临河区',
  '150821': '五原县',
  '150822': '磴口县',
  '150823': '乌拉特前旗',
  '150824': '乌拉特中旗',
  '150825': '乌拉特后旗',
  '150826': '杭锦后旗',
  '150900': '乌兰察布市',
  '150902': '集宁区',
  '150921': '卓资县',
  '150922': '化德县',
  '150923': '商都县',
  '150924': '兴和县',
  '150925': '凉城县',
  '150926': '察哈尔右翼前旗',
  '150927': '察哈尔右翼中旗',
  '150928': '察哈尔右翼后旗',
  '150929': '四子王旗',
  '150981': '丰镇市',
  '152200': '兴安盟',
  '152201': '乌兰浩特市',
  '152202': '阿尔山市',
  '152221': '科尔沁右翼前旗',
  '152222': '科尔沁右翼中旗',
  '152223': '扎赉特旗',
  '152224': '突泉县',
  '152500': '锡林郭勒盟',
  '152501': '二连浩特市',
  '152502': '锡林浩特市',
  '152522': '阿巴嘎旗',
  '152523': '苏尼特左旗',
  '152524': '苏尼特右旗',
  '152525': '东乌珠穆沁旗',
  '152526': '西乌珠穆沁旗',
  '152527': '太仆寺旗',
  '152528': '镶黄旗',
  '152529': '正镶白旗',
  '152530': '正蓝旗',
  '152531': '多伦县',
  '152900': '阿拉善盟',
  '152921': '阿拉善左旗',
  '152922': '阿拉善右旗',
  '152923': '额济纳旗',
  '210000': '辽宁省',
  '210100': '沈阳市',
  '210102': '和平区',
  '210103': '沈河区',
  '210104': '大东区',
  '210105': '皇姑区',
  '210106': '铁西区',
  '210111': '苏家屯区',
  '210112': '浑南区',
  '210113': '沈北新区',
  '210114': '于洪区',
  '210115': '辽中区',
  '210123': '康平县',
  '210124': '法库县',
  '210181': '新民市',
  '210200': '大连市',
  '210202': '中山区',
  '210203': '西岗区',
  '210204': '沙河口区',
  '210211': '甘井子区',
  '210212': '旅顺口区',
  '210213': '金州区',
  '210214': '普兰店区',
  '210224': '长海县',
  '210281': '瓦房店市',
  '210283': '庄河市',
  '210300': '鞍山市',
  '210302': '铁东区',
  '210303': '铁西区',
  '210304': '立山区',
  '210311': '千山区',
  '210321': '台安县',
  '210323': '岫岩满族自治县',
  '210381': '海城市',
  '210400': '抚顺市',
  '210402': '新抚区',
  '210403': '东洲区',
  '210404': '望花区',
  '210411': '顺城区',
  '210421': '抚顺县',
  '210422': '新宾满族自治县',
  '210423': '清原满族自治县',
  '210500': '本溪市',
  '210502': '平山区',
  '210503': '溪湖区',
  '210504': '明山区',
  '210505': '南芬区',
  '210521': '本溪满族自治县',
  '210522': '桓仁满族自治县',
  '210600': '丹东市',
  '210602': '元宝区',
  '210603': '振兴区',
  '210604': '振安区',
  '210624': '宽甸满族自治县',
  '210681': '东港市',
  '210682': '凤城市',
  '210700': '锦州市',
  '210702': '古塔区',
  '210703': '凌河区',
  '210711': '太和区',
  '210726': '黑山县',
  '210727': '义县',
  '210781': '凌海市',
  '210782': '北镇市',
  '210800': '营口市',
  '210802': '站前区',
  '210803': '西市区',
  '210804': '鲅鱼圈区',
  '210811': '老边区',
  '210881': '盖州市',
  '210882': '大石桥市',
  '210900': '阜新市',
  '210902': '海州区',
  '210903': '新邱区',
  '210904': '太平区',
  '210905': '清河门区',
  '210911': '细河区',
  '210921': '阜新蒙古族自治县',
  '210922': '彰武县',
  '211000': '辽阳市',
  '211002': '白塔区',
  '211003': '文圣区',
  '211004': '宏伟区',
  '211005': '弓长岭区',
  '211011': '太子河区',
  '211021': '辽阳县',
  '211081': '灯塔市',
  '211200': '铁岭市',
  '211202': '银州区',
  '211204': '清河区',
  '211221': '铁岭县',
  '211223': '西丰县',
  '211224': '昌图县',
  '211281': '调兵山市',
  '211282': '开原市',
  '211300': '朝阳市',
  '211302': '双塔区',
  '211303': '龙城区',
  '211321': '朝阳县',
  '211322': '建平县',
  '211324': '喀喇沁左翼蒙古族自治县',
  '211381': '北票市',
  '211382': '凌源市',
  '211400': '葫芦岛市',
  '211402': '连山区',
  '211403': '龙港区',
  '211404': '南票区',
  '211421': '绥中县',
  '211422': '建昌县',
  '211481': '兴城市',
  '220000': '吉林省',
  '220100': '长春市',
  '220102': '南关区',
  '220103': '宽城区',
  '220104': '朝阳区',
  '220105': '二道区',
  '220106': '绿园区',
  '220112': '双阳区',
  '220113': '九台区',
  '220122': '农安县',
  '220182': '榆树市',
  '220183': '德惠市',
  '220200': '吉林市',
  '220202': '昌邑区',
  '220203': '龙潭区',
  '220204': '船营区',
  '220211': '丰满区',
  '220221': '永吉县',
  '220281': '蛟河市',
  '220282': '桦甸市',
  '220283': '舒兰市',
  '220284': '磐石市',
  '220300': '四平市',
  '220302': '铁西区',
  '220303': '铁东区',
  '220322': '梨树县',
  '220323': '伊通满族自治县',
  '220381': '公主岭市',
  '220382': '双辽市',
  '220400': '辽源市',
  '220402': '龙山区',
  '220403': '西安区',
  '220421': '东丰县',
  '220422': '东辽县',
  '220500': '通化市',
  '220502': '东昌区',
  '220503': '二道江区',
  '220521': '通化县',
  '220523': '辉南县',
  '220524': '柳河县',
  '220581': '梅河口市',
  '220582': '集安市',
  '220600': '白山市',
  '220602': '浑江区',
  '220605': '江源区',
  '220621': '抚松县',
  '220622': '靖宇县',
  '220623': '长白朝鲜族自治县',
  '220681': '临江市',
  '220700': '松原市',
  '220702': '宁江区',
  '220721': '前郭尔罗斯蒙古族自治县',
  '220722': '长岭县',
  '220723': '乾安县',
  '220781': '扶余市',
  '220800': '白城市',
  '220802': '洮北区',
  '220821': '镇赉县',
  '220822': '通榆县',
  '220881': '洮南市',
  '220882': '大安市',
  '222400': '延边朝鲜族自治州',
  '222401': '延吉市',
  '222402': '图们市',
  '222403': '敦化市',
  '222404': '珲春市',
  '222405': '龙井市',
  '222406': '和龙市',
  '222424': '汪清县',
  '222426': '安图县',
  '230000': '黑龙江省',
  '230100': '哈尔滨市',
  '230102': '道里区',
  '230103': '南岗区',
  '230104': '道外区',
  '230108': '平房区',
  '230109': '松北区',
  '230110': '香坊区',
  '230111': '呼兰区',
  '230112': '阿城区',
  '230113': '双城区',
  '230123': '依兰县',
  '230124': '方正县',
  '230125': '宾县',
  '230126': '巴彦县',
  '230127': '木兰县',
  '230128': '通河县',
  '230129': '延寿县',
  '230183': '尚志市',
  '230184': '五常市',
  '230200': '齐齐哈尔市',
  '230202': '龙沙区',
  '230203': '建华区',
  '230204': '铁锋区',
  '230205': '昂昂溪区',
  '230206': '富拉尔基区',
  '230207': '碾子山区',
  '230208': '梅里斯达斡尔族区',
  '230221': '龙江县',
  '230223': '依安县',
  '230224': '泰来县',
  '230225': '甘南县',
  '230227': '富裕县',
  '230229': '克山县',
  '230230': '克东县',
  '230231': '拜泉县',
  '230281': '讷河市',
  '230300': '鸡西市',
  '230302': '鸡冠区',
  '230303': '恒山区',
  '230304': '滴道区',
  '230305': '梨树区',
  '230306': '城子河区',
  '230307': '麻山区',
  '230321': '鸡东县',
  '230381': '虎林市',
  '230382': '密山市',
  '230400': '鹤岗市',
  '230402': '向阳区',
  '230403': '工农区',
  '230404': '南山区',
  '230405': '兴安区',
  '230406': '东山区',
  '230407': '兴山区',
  '230421': '萝北县',
  '230422': '绥滨县',
  '230500': '双鸭山市',
  '230502': '尖山区',
  '230503': '岭东区',
  '230505': '四方台区',
  '230506': '宝山区',
  '230521': '集贤县',
  '230522': '友谊县',
  '230523': '宝清县',
  '230524': '饶河县',
  '230600': '大庆市',
  '230602': '萨尔图区',
  '230603': '龙凤区',
  '230604': '让胡路区',
  '230605': '红岗区',
  '230606': '大同区',
  '230621': '肇州县',
  '230622': '肇源县',
  '230623': '林甸县',
  '230624': '杜尔伯特蒙古族自治县',
  '230700': '伊春市',
  '230702': '伊春区',
  '230703': '南岔区',
  '230704': '友好区',
  '230705': '西林区',
  '230706': '翠峦区',
  '230707': '新青区',
  '230708': '美溪区',
  '230709': '金山屯区',
  '230710': '五营区',
  '230711': '乌马河区',
  '230712': '汤旺河区',
  '230713': '带岭区',
  '230714': '乌伊岭区',
  '230715': '红星区',
  '230716': '上甘岭区',
  '230722': '嘉荫县',
  '230781': '铁力市',
  '230800': '佳木斯市',
  '230803': '向阳区',
  '230804': '前进区',
  '230805': '东风区',
  '230811': '郊区',
  '230822': '桦南县',
  '230826': '桦川县',
  '230828': '汤原县',
  '230881': '同江市',
  '230882': '富锦市',
  '230883': '抚远市',
  '230900': '七台河市',
  '230902': '新兴区',
  '230903': '桃山区',
  '230904': '茄子河区',
  '230921': '勃利县',
  '231000': '牡丹江市',
  '231002': '东安区',
  '231003': '阳明区',
  '231004': '爱民区',
  '231005': '西安区',
  '231025': '林口县',
  '231081': '绥芬河市',
  '231083': '海林市',
  '231084': '宁安市',
  '231085': '穆棱市',
  '231086': '东宁市',
  '231100': '黑河市',
  '231102': '爱辉区',
  '231121': '嫩江县',
  '231123': '逊克县',
  '231124': '孙吴县',
  '231181': '北安市',
  '231182': '五大连池市',
  '231200': '绥化市',
  '231202': '北林区',
  '231221': '望奎县',
  '231222': '兰西县',
  '231223': '青冈县',
  '231224': '庆安县',
  '231225': '明水县',
  '231226': '绥棱县',
  '231281': '安达市',
  '231282': '肇东市',
  '231283': '海伦市',
  '232700': '大兴安岭地区',
  '232701': '漠河市',
  '232721': '呼玛县',
  '232722': '塔河县',
  '310000': '上海市',
  '310101': '黄浦区',
  '310104': '徐汇区',
  '310105': '长宁区',
  '310106': '静安区',
  '310107': '普陀区',
  '310109': '虹口区',
  '310110': '杨浦区',
  '310112': '闵行区',
  '310113': '宝山区',
  '310114': '嘉定区',
  '310115': '浦东新区',
  '310116': '金山区',
  '310117': '松江区',
  '310118': '青浦区',
  '310120': '奉贤区',
  '310151': '崇明区',
  '320000': '江苏省',
  '320100': '南京市',
  '320102': '玄武区',
  '320104': '秦淮区',
  '320105': '建邺区',
  '320106': '鼓楼区',
  '320111': '浦口区',
  '320113': '栖霞区',
  '320114': '雨花台区',
  '320115': '江宁区',
  '320116': '六合区',
  '320117': '溧水区',
  '320118': '高淳区',
  '320200': '无锡市',
  '320205': '锡山区',
  '320206': '惠山区',
  '320211': '滨湖区',
  '320213': '梁溪区',
  '320214': '新吴区',
  '320281': '江阴市',
  '320282': '宜兴市',
  '320300': '徐州市',
  '320302': '鼓楼区',
  '320303': '云龙区',
  '320305': '贾汪区',
  '320311': '泉山区',
  '320312': '铜山区',
  '320321': '丰县',
  '320322': '沛县',
  '320324': '睢宁县',
  '320381': '新沂市',
  '320382': '邳州市',
  '320400': '常州市',
  '320402': '天宁区',
  '320404': '钟楼区',
  '320411': '新北区',
  '320412': '武进区',
  '320413': '金坛区',
  '320481': '溧阳市',
  '320500': '苏州市',
  '320505': '虎丘区',
  '320506': '吴中区',
  '320507': '相城区',
  '320508': '姑苏区',
  '320509': '吴江区',
  '320581': '常熟市',
  '320582': '张家港市',
  '320583': '昆山市',
  '320585': '太仓市',
  '320600': '南通市',
  '320602': '崇川区',
  '320611': '港闸区',
  '320612': '通州区',
  '320623': '如东县',
  '320681': '启东市',
  '320682': '如皋市',
  '320684': '海门市',
  '320685': '海安市',
  '320700': '连云港市',
  '320703': '连云区',
  '320706': '海州区',
  '320707': '赣榆区',
  '320722': '东海县',
  '320723': '灌云县',
  '320724': '灌南县',
  '320800': '淮安市',
  '320803': '淮安区',
  '320804': '淮阴区',
  '320812': '清江浦区',
  '320813': '洪泽区',
  '320826': '涟水县',
  '320830': '盱眙县',
  '320831': '金湖县',
  '320900': '盐城市',
  '320902': '亭湖区',
  '320903': '盐都区',
  '320904': '大丰区',
  '320921': '响水县',
  '320922': '滨海县',
  '320923': '阜宁县',
  '320924': '射阳县',
  '320925': '建湖县',
  '320981': '东台市',
  '321000': '扬州市',
  '321002': '广陵区',
  '321003': '邗江区',
  '321012': '江都区',
  '321023': '宝应县',
  '321081': '仪征市',
  '321084': '高邮市',
  '321100': '镇江市',
  '321102': '京口区',
  '321111': '润州区',
  '321112': '丹徒区',
  '321181': '丹阳市',
  '321182': '扬中市',
  '321183': '句容市',
  '321200': '泰州市',
  '321202': '海陵区',
  '321203': '高港区',
  '321204': '姜堰区',
  '321281': '兴化市',
  '321282': '靖江市',
  '321283': '泰兴市',
  '321300': '宿迁市',
  '321302': '宿城区',
  '321311': '宿豫区',
  '321322': '沭阳县',
  '321323': '泗阳县',
  '321324': '泗洪县',
  '330000': '浙江省',
  '330100': '杭州市',
  '330102': '上城区',
  '330103': '下城区',
  '330104': '江干区',
  '330105': '拱墅区',
  '330106': '西湖区',
  '330108': '滨江区',
  '330109': '萧山区',
  '330110': '余杭区',
  '330111': '富阳区',
  '330112': '临安区',
  '330114': '钱塘区',
  '330122': '桐庐县',
  '330127': '淳安县',
  '330182': '建德市',
  '330200': '宁波市',
  '330203': '海曙区',
  '330205': '江北区',
  '330206': '北仑区',
  '330211': '镇海区',
  '330212': '鄞州区',
  '330213': '奉化区',
  '330225': '象山县',
  '330226': '宁海县',
  '330281': '余姚市',
  '330282': '慈溪市',
  '330300': '温州市',
  '330302': '鹿城区',
  '330303': '龙湾区',
  '330304': '瓯海区',
  '330305': '洞头区',
  '330324': '永嘉县',
  '330326': '平阳县',
  '330327': '苍南县',
  '330328': '文成县',
  '330329': '泰顺县',
  '330381': '瑞安市',
  '330382': '乐清市',
  '330400': '嘉兴市',
  '330402': '南湖区',
  '330411': '秀洲区',
  '330421': '嘉善县',
  '330424': '海盐县',
  '330481': '海宁市',
  '330482': '平湖市',
  '330483': '桐乡市',
  '330500': '湖州市',
  '330502': '吴兴区',
  '330503': '南浔区',
  '330521': '德清县',
  '330522': '长兴县',
  '330523': '安吉县',
  '330600': '绍兴市',
  '330602': '越城区',
  '330603': '柯桥区',
  '330604': '上虞区',
  '330624': '新昌县',
  '330681': '诸暨市',
  '330683': '嵊州市',
  '330700': '金华市',
  '330702': '婺城区',
  '330703': '金东区',
  '330723': '武义县',
  '330726': '浦江县',
  '330727': '磐安县',
  '330781': '兰溪市',
  '330782': '义乌市',
  '330783': '东阳市',
  '330784': '永康市',
  '330800': '衢州市',
  '330802': '柯城区',
  '330803': '衢江区',
  '330822': '常山县',
  '330824': '开化县',
  '330825': '龙游县',
  '330881': '江山市',
  '330900': '舟山市',
  '330902': '定海区',
  '330903': '普陀区',
  '330921': '岱山县',
  '330922': '嵊泗县',
  '331000': '台州市',
  '331002': '椒江区',
  '331003': '黄岩区',
  '331004': '路桥区',
  '331022': '三门县',
  '331023': '天台县',
  '331024': '仙居县',
  '331081': '温岭市',
  '331082': '临海市',
  '331083': '玉环市',
  '331100': '丽水市',
  '331102': '莲都区',
  '331121': '青田县',
  '331122': '缙云县',
  '331123': '遂昌县',
  '331124': '松阳县',
  '331125': '云和县',
  '331126': '庆元县',
  '331127': '景宁畲族自治县',
  '331181': '龙泉市',
  '340000': '安徽省',
  '340100': '合肥市',
  '340102': '瑶海区',
  '340103': '庐阳区',
  '340104': '蜀山区',
  '340111': '包河区',
  '340121': '长丰县',
  '340122': '肥东县',
  '340123': '肥西县',
  '340124': '庐江县',
  '340181': '巢湖市',
  '340200': '芜湖市',
  '340202': '镜湖区',
  '340203': '弋江区',
  '340207': '鸠江区',
  '340208': '三山区',
  '340221': '芜湖县',
  '340222': '繁昌县',
  '340223': '南陵县',
  '340225': '无为县',
  '340300': '蚌埠市',
  '340302': '龙子湖区',
  '340303': '蚌山区',
  '340304': '禹会区',
  '340311': '淮上区',
  '340321': '怀远县',
  '340322': '五河县',
  '340323': '固镇县',
  '340400': '淮南市',
  '340402': '大通区',
  '340403': '田家庵区',
  '340404': '谢家集区',
  '340405': '八公山区',
  '340406': '潘集区',
  '340421': '凤台县',
  '340422': '寿县',
  '340500': '马鞍山市',
  '340503': '花山区',
  '340504': '雨山区',
  '340506': '博望区',
  '340521': '当涂县',
  '340522': '含山县',
  '340523': '和县',
  '340600': '淮北市',
  '340602': '杜集区',
  '340603': '相山区',
  '340604': '烈山区',
  '340621': '濉溪县',
  '340800': '安庆市',
  '340802': '迎江区',
  '340803': '大观区',
  '340811': '宜秀区',
  '340822': '怀宁县',
  '340824': '潜山县',
  '340825': '太湖县',
  '340826': '宿松县',
  '340827': '望江县',
  '340828': '岳西县',
  '340881': '桐城市',
  '341000': '黄山市',
  '341002': '屯溪区',
  '341003': '黄山区',
  '341004': '徽州区',
  '341021': '歙县',
  '341022': '休宁县',
  '341023': '黟县',
  '341024': '祁门县',
  '341100': '滁州市',
  '341102': '琅琊区',
  '341103': '南谯区',
  '341122': '来安县',
  '341124': '全椒县',
  '341125': '定远县',
  '341126': '凤阳县',
  '341181': '天长市',
  '341182': '明光市',
  '341200': '阜阳市',
  '341202': '颍州区',
  '341203': '颍东区',
  '341204': '颍泉区',
  '341221': '临泉县',
  '341222': '太和县',
  '341225': '阜南县',
  '341226': '颍上县',
  '341282': '界首市',
  '341300': '宿州市',
  '341302': '埇桥区',
  '341321': '砀山县',
  '341322': '萧县',
  '341323': '灵璧县',
  '341324': '泗县',
  '341500': '六安市',
  '341502': '金安区',
  '341503': '裕安区',
  '341504': '叶集区',
  '341522': '霍邱县',
  '341523': '舒城县',
  '341524': '金寨县',
  '341525': '霍山县',
  '341600': '亳州市',
  '341602': '谯城区',
  '341621': '涡阳县',
  '341622': '蒙城县',
  '341623': '利辛县',
  '341700': '池州市',
  '341702': '贵池区',
  '341721': '东至县',
  '341722': '石台县',
  '341723': '青阳县',
  '341800': '宣城市',
  '341802': '宣州区',
  '341821': '郎溪县',
  '341822': '广德县',
  '341823': '泾县',
  '341824': '绩溪县',
  '341825': '旌德县',
  '341881': '宁国市',
  '350000': '福建省',
  '350100': '福州市',
  '350102': '鼓楼区',
  '350103': '台江区',
  '350104': '仓山区',
  '350105': '马尾区',
  '350111': '晋安区',
  '350112': '长乐区',
  '350121': '闽侯县',
  '350122': '连江县',
  '350123': '罗源县',
  '350124': '闽清县',
  '350125': '永泰县',
  '350128': '平潭县',
  '350181': '福清市',
  '350200': '厦门市',
  '350203': '思明区',
  '350205': '海沧区',
  '350206': '湖里区',
  '350211': '集美区',
  '350212': '同安区',
  '350213': '翔安区',
  '350300': '莆田市',
  '350302': '城厢区',
  '350303': '涵江区',
  '350304': '荔城区',
  '350305': '秀屿区',
  '350322': '仙游县',
  '350400': '三明市',
  '350402': '梅列区',
  '350403': '三元区',
  '350421': '明溪县',
  '350423': '清流县',
  '350424': '宁化县',
  '350425': '大田县',
  '350426': '尤溪县',
  '350427': '沙县',
  '350428': '将乐县',
  '350429': '泰宁县',
  '350430': '建宁县',
  '350481': '永安市',
  '350500': '泉州市',
  '350502': '鲤城区',
  '350503': '丰泽区',
  '350504': '洛江区',
  '350505': '泉港区',
  '350521': '惠安县',
  '350524': '安溪县',
  '350525': '永春县',
  '350526': '德化县',
  '350527': '金门县',
  '350581': '石狮市',
  '350582': '晋江市',
  '350583': '南安市',
  '350600': '漳州市',
  '350602': '芗城区',
  '350603': '龙文区',
  '350622': '云霄县',
  '350623': '漳浦县',
  '350624': '诏安县',
  '350625': '长泰县',
  '350626': '东山县',
  '350627': '南靖县',
  '350628': '平和县',
  '350629': '华安县',
  '350681': '龙海市',
  '350700': '南平市',
  '350702': '延平区',
  '350703': '建阳区',
  '350721': '顺昌县',
  '350722': '浦城县',
  '350723': '光泽县',
  '350724': '松溪县',
  '350725': '政和县',
  '350781': '邵武市',
  '350782': '武夷山市',
  '350783': '建瓯市',
  '350800': '龙岩市',
  '350802': '新罗区',
  '350803': '永定区',
  '350821': '长汀县',
  '350823': '上杭县',
  '350824': '武平县',
  '350825': '连城县',
  '350881': '漳平市',
  '350900': '宁德市',
  '350902': '蕉城区',
  '350921': '霞浦县',
  '350922': '古田县',
  '350923': '屏南县',
  '350924': '寿宁县',
  '350925': '周宁县',
  '350926': '柘荣县',
  '350981': '福安市',
  '350982': '福鼎市',
  '360000': '江西省',
  '360100': '南昌市',
  '360102': '东湖区',
  '360103': '西湖区',
  '360104': '青云谱区',
  '360105': '湾里区',
  '360111': '青山湖区',
  '360112': '新建区',
  '360121': '南昌县',
  '360123': '安义县',
  '360124': '进贤县',
  '360200': '景德镇市',
  '360202': '昌江区',
  '360203': '珠山区',
  '360222': '浮梁县',
  '360281': '乐平市',
  '360300': '萍乡市',
  '360302': '安源区',
  '360313': '湘东区',
  '360321': '莲花县',
  '360322': '上栗县',
  '360323': '芦溪县',
  '360400': '九江市',
  '360402': '濂溪区',
  '360403': '浔阳区',
  '360404': '柴桑区',
  '360423': '武宁县',
  '360424': '修水县',
  '360425': '永修县',
  '360426': '德安县',
  '360428': '都昌县',
  '360429': '湖口县',
  '360430': '彭泽县',
  '360481': '瑞昌市',
  '360482': '共青城市',
  '360483': '庐山市',
  '360500': '新余市',
  '360502': '渝水区',
  '360521': '分宜县',
  '360600': '鹰潭市',
  '360602': '月湖区',
  '360603': '余江区',
  '360681': '贵溪市',
  '360700': '赣州市',
  '360702': '章贡区',
  '360703': '南康区',
  '360704': '赣县区',
  '360722': '信丰县',
  '360723': '大余县',
  '360724': '上犹县',
  '360725': '崇义县',
  '360726': '安远县',
  '360727': '龙南县',
  '360728': '定南县',
  '360729': '全南县',
  '360730': '宁都县',
  '360731': '于都县',
  '360732': '兴国县',
  '360733': '会昌县',
  '360734': '寻乌县',
  '360735': '石城县',
  '360781': '瑞金市',
  '360800': '吉安市',
  '360802': '吉州区',
  '360803': '青原区',
  '360821': '吉安县',
  '360822': '吉水县',
  '360823': '峡江县',
  '360824': '新干县',
  '360825': '永丰县',
  '360826': '泰和县',
  '360827': '遂川县',
  '360828': '万安县',
  '360829': '安福县',
  '360830': '永新县',
  '360881': '井冈山市',
  '360900': '宜春市',
  '360902': '袁州区',
  '360921': '奉新县',
  '360922': '万载县',
  '360923': '上高县',
  '360924': '宜丰县',
  '360925': '靖安县',
  '360926': '铜鼓县',
  '360981': '丰城市',
  '360982': '樟树市',
  '360983': '高安市',
  '361000': '抚州市',
  '361002': '临川区',
  '361003': '东乡区',
  '361021': '南城县',
  '361022': '黎川县',
  '361023': '南丰县',
  '361024': '崇仁县',
  '361025': '乐安县',
  '361026': '宜黄县',
  '361027': '金溪县',
  '361028': '资溪县',
  '361030': '广昌县',
  '361100': '上饶市',
  '361102': '信州区',
  '361103': '广丰区',
  '361121': '上饶县',
  '361123': '玉山县',
  '361124': '铅山县',
  '361125': '横峰县',
  '361126': '弋阳县',
  '361127': '余干县',
  '361128': '鄱阳县',
  '361129': '万年县',
  '361130': '婺源县',
  '361181': '德兴市',
  '370000': '山东省',
  '370100': '济南市',
  '370102': '历下区',
  '370103': '市中区',
  '370104': '槐荫区',
  '370105': '天桥区',
  '370112': '历城区',
  '370113': '长清区',
  '370114': '章丘区',
  '370124': '平阴县',
  '370125': '济阳县',
  '370126': '商河县',
  '370200': '青岛市',
  '370202': '市南区',
  '370203': '市北区',
  '370211': '黄岛区',
  '370212': '崂山区',
  '370213': '李沧区',
  '370214': '城阳区',
  '370215': '即墨区',
  '370281': '胶州市',
  '370283': '平度市',
  '370285': '莱西市',
  '370300': '淄博市',
  '370302': '淄川区',
  '370303': '张店区',
  '370304': '博山区',
  '370305': '临淄区',
  '370306': '周村区',
  '370321': '桓台县',
  '370322': '高青县',
  '370323': '沂源县',
  '370400': '枣庄市',
  '370402': '市中区',
  '370403': '薛城区',
  '370404': '峄城区',
  '370405': '台儿庄区',
  '370406': '山亭区',
  '370481': '滕州市',
  '370500': '东营市',
  '370502': '东营区',
  '370503': '河口区',
  '370505': '垦利区',
  '370522': '利津县',
  '370523': '广饶县',
  '370600': '烟台市',
  '370602': '芝罘区',
  '370611': '福山区',
  '370612': '牟平区',
  '370613': '莱山区',
  '370634': '长岛县',
  '370681': '龙口市',
  '370682': '莱阳市',
  '370683': '莱州市',
  '370684': '蓬莱市',
  '370685': '招远市',
  '370686': '栖霞市',
  '370687': '海阳市',
  '370700': '潍坊市',
  '370702': '潍城区',
  '370703': '寒亭区',
  '370704': '坊子区',
  '370705': '奎文区',
  '370724': '临朐县',
  '370725': '昌乐县',
  '370781': '青州市',
  '370782': '诸城市',
  '370783': '寿光市',
  '370784': '安丘市',
  '370785': '高密市',
  '370786': '昌邑市',
  '370800': '济宁市',
  '370811': '任城区',
  '370812': '兖州区',
  '370826': '微山县',
  '370827': '鱼台县',
  '370828': '金乡县',
  '370829': '嘉祥县',
  '370830': '汶上县',
  '370831': '泗水县',
  '370832': '梁山县',
  '370881': '曲阜市',
  '370883': '邹城市',
  '370900': '泰安市',
  '370902': '泰山区',
  '370911': '岱岳区',
  '370921': '宁阳县',
  '370923': '东平县',
  '370982': '新泰市',
  '370983': '肥城市',
  '371000': '威海市',
  '371002': '环翠区',
  '371003': '文登区',
  '371082': '荣成市',
  '371083': '乳山市',
  '371100': '日照市',
  '371102': '东港区',
  '371103': '岚山区',
  '371121': '五莲县',
  '371122': '莒县',
  '371200': '莱芜市',
  '371202': '莱城区',
  '371203': '钢城区',
  '371300': '临沂市',
  '371302': '兰山区',
  '371311': '罗庄区',
  '371312': '河东区',
  '371321': '沂南县',
  '371322': '郯城县',
  '371323': '沂水县',
  '371324': '兰陵县',
  '371325': '费县',
  '371326': '平邑县',
  '371327': '莒南县',
  '371328': '蒙阴县',
  '371329': '临沭县',
  '371400': '德州市',
  '371402': '德城区',
  '371403': '陵城区',
  '371422': '宁津县',
  '371423': '庆云县',
  '371424': '临邑县',
  '371425': '齐河县',
  '371426': '平原县',
  '371427': '夏津县',
  '371428': '武城县',
  '371481': '乐陵市',
  '371482': '禹城市',
  '371500': '聊城市',
  '371502': '东昌府区',
  '371521': '阳谷县',
  '371522': '莘县',
  '371523': '茌平县',
  '371524': '东阿县',
  '371525': '冠县',
  '371526': '高唐县',
  '371581': '临清市',
  '371600': '滨州市',
  '371602': '滨城区',
  '371603': '沾化区',
  '371621': '惠民县',
  '371622': '阳信县',
  '371623': '无棣县',
  '371625': '博兴县',
  '371626': '邹平县',
  '371700': '菏泽市',
  '371702': '牡丹区',
  '371703': '定陶区',
  '371721': '曹县',
  '371722': '单县',
  '371723': '成武县',
  '371724': '巨野县',
  '371725': '郓城县',
  '371726': '鄄城县',
  '371728': '东明县',
  '410000': '河南省',
  '410100': '郑州市',
  '410102': '中原区',
  '410103': '二七区',
  '410104': '管城回族区',
  '410105': '金水区',
  '410106': '上街区',
  '410108': '惠济区',
  '410122': '中牟县',
  '410181': '巩义市',
  '410182': '荥阳市',
  '410183': '新密市',
  '410184': '新郑市',
  '410185': '登封市',
  '410200': '开封市',
  '410202': '龙亭区',
  '410203': '顺河回族区',
  '410204': '鼓楼区',
  '410205': '禹王台区',
  '410212': '祥符区',
  '410221': '杞县',
  '410222': '通许县',
  '410223': '尉氏县',
  '410225': '兰考县',
  '410300': '洛阳市',
  '410302': '老城区',
  '410303': '西工区',
  '410304': '瀍河回族区',
  '410305': '涧西区',
  '410306': '吉利区',
  '410311': '洛龙区',
  '410322': '孟津县',
  '410323': '新安县',
  '410324': '栾川县',
  '410325': '嵩县',
  '410326': '汝阳县',
  '410327': '宜阳县',
  '410328': '洛宁县',
  '410329': '伊川县',
  '410381': '偃师市',
  '410400': '平顶山市',
  '410402': '新华区',
  '410403': '卫东区',
  '410404': '石龙区',
  '410411': '湛河区',
  '410421': '宝丰县',
  '410422': '叶县',
  '410423': '鲁山县',
  '410425': '郏县',
  '410481': '舞钢市',
  '410482': '汝州市',
  '410500': '安阳市',
  '410502': '文峰区',
  '410503': '北关区',
  '410505': '殷都区',
  '410506': '龙安区',
  '410522': '安阳县',
  '410523': '汤阴县',
  '410526': '滑县',
  '410527': '内黄县',
  '410581': '林州市',
  '410600': '鹤壁市',
  '410602': '鹤山区',
  '410603': '山城区',
  '410611': '淇滨区',
  '410621': '浚县',
  '410622': '淇县',
  '410700': '新乡市',
  '410702': '红旗区',
  '410703': '卫滨区',
  '410704': '凤泉区',
  '410711': '牧野区',
  '410721': '新乡县',
  '410724': '获嘉县',
  '410725': '原阳县',
  '410726': '延津县',
  '410727': '封丘县',
  '410728': '长垣县',
  '410781': '卫辉市',
  '410782': '辉县市',
  '410800': '焦作市',
  '410802': '解放区',
  '410803': '中站区',
  '410804': '马村区',
  '410811': '山阳区',
  '410821': '修武县',
  '410822': '博爱县',
  '410823': '武陟县',
  '410825': '温县',
  '410882': '沁阳市',
  '410883': '孟州市',
  '410900': '濮阳市',
  '410902': '华龙区',
  '410922': '清丰县',
  '410923': '南乐县',
  '410926': '范县',
  '410927': '台前县',
  '410928': '濮阳县',
  '411000': '许昌市',
  '411002': '魏都区',
  '411003': '建安区',
  '411024': '鄢陵县',
  '411025': '襄城县',
  '411081': '禹州市',
  '411082': '长葛市',
  '411100': '漯河市',
  '411102': '源汇区',
  '411103': '郾城区',
  '411104': '召陵区',
  '411121': '舞阳县',
  '411122': '临颍县',
  '411200': '三门峡市',
  '411202': '湖滨区',
  '411203': '陕州区',
  '411221': '渑池县',
  '411224': '卢氏县',
  '411281': '义马市',
  '411282': '灵宝市',
  '411300': '南阳市',
  '411302': '宛城区',
  '411303': '卧龙区',
  '411321': '南召县',
  '411322': '方城县',
  '411323': '西峡县',
  '411324': '镇平县',
  '411325': '内乡县',
  '411326': '淅川县',
  '411327': '社旗县',
  '411328': '唐河县',
  '411329': '新野县',
  '411330': '桐柏县',
  '411381': '邓州市',
  '411400': '商丘市',
  '411402': '梁园区',
  '411403': '睢阳区',
  '411421': '民权县',
  '411422': '睢县',
  '411423': '宁陵县',
  '411424': '柘城县',
  '411425': '虞城县',
  '411426': '夏邑县',
  '411481': '永城市',
  '411500': '信阳市',
  '411502': '浉河区',
  '411503': '平桥区',
  '411521': '罗山县',
  '411522': '光山县',
  '411523': '新县',
  '411524': '商城县',
  '411525': '固始县',
  '411526': '潢川县',
  '411527': '淮滨县',
  '411528': '息县',
  '411600': '周口市',
  '411602': '川汇区',
  '411621': '扶沟县',
  '411622': '西华县',
  '411623': '商水县',
  '411624': '沈丘县',
  '411625': '郸城县',
  '411626': '淮阳县',
  '411627': '太康县',
  '411628': '鹿邑县',
  '411681': '项城市',
  '411700': '驻马店市',
  '411702': '驿城区',
  '411721': '西平县',
  '411722': '上蔡县',
  '411723': '平舆县',
  '411724': '正阳县',
  '411725': '确山县',
  '411726': '泌阳县',
  '411727': '汝南县',
  '411728': '遂平县',
  '411729': '新蔡县',
  '419001': '济源市',
  '420000': '湖北省',
  '420100': '武汉市',
  '420102': '江岸区',
  '420103': '江汉区',
  '420104': '硚口区',
  '420105': '汉阳区',
  '420106': '武昌区',
  '420107': '青山区',
  '420111': '洪山区',
  '420112': '东西湖区',
  '420113': '汉南区',
  '420114': '蔡甸区',
  '420115': '江夏区',
  '420116': '黄陂区',
  '420117': '新洲区',
  '420200': '黄石市',
  '420202': '黄石港区',
  '420203': '西塞山区',
  '420204': '下陆区',
  '420205': '铁山区',
  '420222': '阳新县',
  '420281': '大冶市',
  '420300': '十堰市',
  '420302': '茅箭区',
  '420303': '张湾区',
  '420304': '郧阳区',
  '420322': '郧西县',
  '420323': '竹山县',
  '420324': '竹溪县',
  '420325': '房县',
  '420381': '丹江口市',
  '420500': '宜昌市',
  '420502': '西陵区',
  '420503': '伍家岗区',
  '420504': '点军区',
  '420505': '猇亭区',
  '420506': '夷陵区',
  '420525': '远安县',
  '420526': '兴山县',
  '420527': '秭归县',
  '420528': '长阳土家族自治县',
  '420529': '五峰土家族自治县',
  '420581': '宜都市',
  '420582': '当阳市',
  '420583': '枝江市',
  '420600': '襄阳市',
  '420602': '襄城区',
  '420606': '樊城区',
  '420607': '襄州区',
  '420624': '南漳县',
  '420625': '谷城县',
  '420626': '保康县',
  '420682': '老河口市',
  '420683': '枣阳市',
  '420684': '宜城市',
  '420700': '鄂州市',
  '420702': '梁子湖区',
  '420703': '华容区',
  '420704': '鄂城区',
  '420800': '荆门市',
  '420802': '东宝区',
  '420804': '掇刀区',
  '420822': '沙洋县',
  '420881': '钟祥市',
  '420882': '京山市',
  '420900': '孝感市',
  '420902': '孝南区',
  '420921': '孝昌县',
  '420922': '大悟县',
  '420923': '云梦县',
  '420981': '应城市',
  '420982': '安陆市',
  '420984': '汉川市',
  '421000': '荆州市',
  '421002': '沙市区',
  '421003': '荆州区',
  '421022': '公安县',
  '421023': '监利县',
  '421024': '江陵县',
  '421081': '石首市',
  '421083': '洪湖市',
  '421087': '松滋市',
  '421100': '黄冈市',
  '421102': '黄州区',
  '421121': '团风县',
  '421122': '红安县',
  '421123': '罗田县',
  '421124': '英山县',
  '421125': '浠水县',
  '421126': '蕲春县',
  '421127': '黄梅县',
  '421181': '麻城市',
  '421182': '武穴市',
  '421200': '咸宁市',
  '421202': '咸安区',
  '421221': '嘉鱼县',
  '421222': '通城县',
  '421223': '崇阳县',
  '421224': '通山县',
  '421281': '赤壁市',
  '421300': '随州市',
  '421303': '曾都区',
  '421321': '随县',
  '421381': '广水市',
  '422800': '恩施土家族苗族自治州',
  '422801': '恩施市',
  '422802': '利川市',
  '422822': '建始县',
  '422823': '巴东县',
  '422825': '宣恩县',
  '422826': '咸丰县',
  '422827': '来凤县',
  '422828': '鹤峰县',
  '429004': '仙桃市',
  '429005': '潜江市',
  '429006': '天门市',
  '429021': '神农架林区',
  '430000': '湖南省',
  '430100': '长沙市',
  '430102': '芙蓉区',
  '430103': '天心区',
  '430104': '岳麓区',
  '430105': '开福区',
  '430111': '雨花区',
  '430112': '望城区',
  '430121': '长沙县',
  '430181': '浏阳市',
  '430182': '宁乡市',
  '430200': '株洲市',
  '430202': '荷塘区',
  '430203': '芦淞区',
  '430204': '石峰区',
  '430211': '天元区',
  '430221': '株洲县',
  '430223': '攸县',
  '430224': '茶陵县',
  '430225': '炎陵县',
  '430281': '醴陵市',
  '430300': '湘潭市',
  '430302': '雨湖区',
  '430304': '岳塘区',
  '430321': '湘潭县',
  '430381': '湘乡市',
  '430382': '韶山市',
  '430400': '衡阳市',
  '430405': '珠晖区',
  '430406': '雁峰区',
  '430407': '石鼓区',
  '430408': '蒸湘区',
  '430412': '南岳区',
  '430421': '衡阳县',
  '430422': '衡南县',
  '430423': '衡山县',
  '430424': '衡东县',
  '430426': '祁东县',
  '430481': '耒阳市',
  '430482': '常宁市',
  '430500': '邵阳市',
  '430502': '双清区',
  '430503': '大祥区',
  '430511': '北塔区',
  '430521': '邵东县',
  '430522': '新邵县',
  '430523': '邵阳县',
  '430524': '隆回县',
  '430525': '洞口县',
  '430527': '绥宁县',
  '430528': '新宁县',
  '430529': '城步苗族自治县',
  '430581': '武冈市',
  '430600': '岳阳市',
  '430602': '岳阳楼区',
  '430603': '云溪区',
  '430611': '君山区',
  '430621': '岳阳县',
  '430623': '华容县',
  '430624': '湘阴县',
  '430626': '平江县',
  '430681': '汨罗市',
  '430682': '临湘市',
  '430700': '常德市',
  '430702': '武陵区',
  '430703': '鼎城区',
  '430721': '安乡县',
  '430722': '汉寿县',
  '430723': '澧县',
  '430724': '临澧县',
  '430725': '桃源县',
  '430726': '石门县',
  '430781': '津市市',
  '430800': '张家界市',
  '430802': '永定区',
  '430811': '武陵源区',
  '430821': '慈利县',
  '430822': '桑植县',
  '430900': '益阳市',
  '430902': '资阳区',
  '430903': '赫山区',
  '430921': '南县',
  '430922': '桃江县',
  '430923': '安化县',
  '430981': '沅江市',
  '431000': '郴州市',
  '431002': '北湖区',
  '431003': '苏仙区',
  '431021': '桂阳县',
  '431022': '宜章县',
  '431023': '永兴县',
  '431024': '嘉禾县',
  '431025': '临武县',
  '431026': '汝城县',
  '431027': '桂东县',
  '431028': '安仁县',
  '431081': '资兴市',
  '431100': '永州市',
  '431102': '零陵区',
  '431103': '冷水滩区',
  '431121': '祁阳县',
  '431122': '东安县',
  '431123': '双牌县',
  '431124': '道县',
  '431125': '江永县',
  '431126': '宁远县',
  '431127': '蓝山县',
  '431128': '新田县',
  '431129': '江华瑶族自治县',
  '431200': '怀化市',
  '431202': '鹤城区',
  '431221': '中方县',
  '431222': '沅陵县',
  '431223': '辰溪县',
  '431224': '溆浦县',
  '431225': '会同县',
  '431226': '麻阳苗族自治县',
  '431227': '新晃侗族自治县',
  '431228': '芷江侗族自治县',
  '431229': '靖州苗族侗族自治县',
  '431230': '通道侗族自治县',
  '431281': '洪江市',
  '431300': '娄底市',
  '431302': '娄星区',
  '431321': '双峰县',
  '431322': '新化县',
  '431381': '冷水江市',
  '431382': '涟源市',
  '433100': '湘西土家族苗族自治州',
  '433101': '吉首市',
  '433122': '泸溪县',
  '433123': '凤凰县',
  '433124': '花垣县',
  '433125': '保靖县',
  '433126': '古丈县',
  '433127': '永顺县',
  '433130': '龙山县',
  '440000': '广东省',
  '440100': '广州市',
  '440103': '荔湾区',
  '440104': '越秀区',
  '440105': '海珠区',
  '440106': '天河区',
  '440111': '白云区',
  '440112': '黄埔区',
  '440113': '番禺区',
  '440114': '花都区',
  '440115': '南沙区',
  '440117': '从化区',
  '440118': '增城区',
  '440200': '韶关市',
  '440203': '武江区',
  '440204': '浈江区',
  '440205': '曲江区',
  '440222': '始兴县',
  '440224': '仁化县',
  '440229': '翁源县',
  '440232': '乳源瑶族自治县',
  '440233': '新丰县',
  '440281': '乐昌市',
  '440282': '南雄市',
  '440300': '深圳市',
  '440303': '罗湖区',
  '440304': '福田区',
  '440305': '南山区',
  '440306': '宝安区',
  '440307': '龙岗区',
  '440308': '盐田区',
  '440309': '龙华区',
  '440310': '坪山区',
  '440311': '光明区',
  '440400': '珠海市',
  '440402': '香洲区',
  '440403': '斗门区',
  '440404': '金湾区',
  '440500': '汕头市',
  '440507': '龙湖区',
  '440511': '金平区',
  '440512': '濠江区',
  '440513': '潮阳区',
  '440514': '潮南区',
  '440515': '澄海区',
  '440523': '南澳县',
  '440600': '佛山市',
  '440604': '禅城区',
  '440605': '南海区',
  '440606': '顺德区',
  '440607': '三水区',
  '440608': '高明区',
  '440700': '江门市',
  '440703': '蓬江区',
  '440704': '江海区',
  '440705': '新会区',
  '440781': '台山市',
  '440783': '开平市',
  '440784': '鹤山市',
  '440785': '恩平市',
  '440800': '湛江市',
  '440802': '赤坎区',
  '440803': '霞山区',
  '440804': '坡头区',
  '440811': '麻章区',
  '440823': '遂溪县',
  '440825': '徐闻县',
  '440881': '廉江市',
  '440882': '雷州市',
  '440883': '吴川市',
  '440900': '茂名市',
  '440902': '茂南区',
  '440904': '电白区',
  '440981': '高州市',
  '440982': '化州市',
  '440983': '信宜市',
  '441200': '肇庆市',
  '441202': '端州区',
  '441203': '鼎湖区',
  '441204': '高要区',
  '441223': '广宁县',
  '441224': '怀集县',
  '441225': '封开县',
  '441226': '德庆县',
  '441284': '四会市',
  '441300': '惠州市',
  '441302': '惠城区',
  '441303': '惠阳区',
  '441322': '博罗县',
  '441323': '惠东县',
  '441324': '龙门县',
  '441400': '梅州市',
  '441402': '梅江区',
  '441403': '梅县区',
  '441422': '大埔县',
  '441423': '丰顺县',
  '441424': '五华县',
  '441426': '平远县',
  '441427': '蕉岭县',
  '441481': '兴宁市',
  '441500': '汕尾市',
  '441502': '城区',
  '441521': '海丰县',
  '441523': '陆河县',
  '441581': '陆丰市',
  '441600': '河源市',
  '441602': '源城区',
  '441621': '紫金县',
  '441622': '龙川县',
  '441623': '连平县',
  '441624': '和平县',
  '441625': '东源县',
  '441700': '阳江市',
  '441702': '江城区',
  '441704': '阳东区',
  '441721': '阳西县',
  '441781': '阳春市',
  '441800': '清远市',
  '441802': '清城区',
  '441803': '清新区',
  '441821': '佛冈县',
  '441823': '阳山县',
  '441825': '连山壮族瑶族自治县',
  '441826': '连南瑶族自治县',
  '441881': '英德市',
  '441882': '连州市',
  '441900': '东莞市',
  '442000': '中山市',
  '445100': '潮州市',
  '445102': '湘桥区',
  '445103': '潮安区',
  '445122': '饶平县',
  '445200': '揭阳市',
  '445202': '榕城区',
  '445203': '揭东区',
  '445222': '揭西县',
  '445224': '惠来县',
  '445281': '普宁市',
  '445300': '云浮市',
  '445302': '云城区',
  '445303': '云安区',
  '445321': '新兴县',
  '445322': '郁南县',
  '445381': '罗定市',
  '450000': '广西壮族自治区',
  '450100': '南宁市',
  '450102': '兴宁区',
  '450103': '青秀区',
  '450105': '江南区',
  '450107': '西乡塘区',
  '450108': '良庆区',
  '450109': '邕宁区',
  '450110': '武鸣区',
  '450123': '隆安县',
  '450124': '马山县',
  '450125': '上林县',
  '450126': '宾阳县',
  '450127': '横县',
  '450200': '柳州市',
  '450202': '城中区',
  '450203': '鱼峰区',
  '450204': '柳南区',
  '450205': '柳北区',
  '450206': '柳江区',
  '450222': '柳城县',
  '450223': '鹿寨县',
  '450224': '融安县',
  '450225': '融水苗族自治县',
  '450226': '三江侗族自治县',
  '450300': '桂林市',
  '450302': '秀峰区',
  '450303': '叠彩区',
  '450304': '象山区',
  '450305': '七星区',
  '450311': '雁山区',
  '450312': '临桂区',
  '450321': '阳朔县',
  '450323': '灵川县',
  '450324': '全州县',
  '450325': '兴安县',
  '450326': '永福县',
  '450327': '灌阳县',
  '450328': '龙胜各族自治县',
  '450329': '资源县',
  '450330': '平乐县',
  '450331': '荔浦县',
  '450332': '恭城瑶族自治县',
  '450400': '梧州市',
  '450403': '万秀区',
  '450405': '长洲区',
  '450406': '龙圩区',
  '450421': '苍梧县',
  '450422': '藤县',
  '450423': '蒙山县',
  '450481': '岑溪市',
  '450500': '北海市',
  '450502': '海城区',
  '450503': '银海区',
  '450512': '铁山港区',
  '450521': '合浦县',
  '450600': '防城港市',
  '450602': '港口区',
  '450603': '防城区',
  '450621': '上思县',
  '450681': '东兴市',
  '450700': '钦州市',
  '450702': '钦南区',
  '450703': '钦北区',
  '450721': '灵山县',
  '450722': '浦北县',
  '450800': '贵港市',
  '450802': '港北区',
  '450803': '港南区',
  '450804': '覃塘区',
  '450821': '平南县',
  '450881': '桂平市',
  '450900': '玉林市',
  '450902': '玉州区',
  '450903': '福绵区',
  '450921': '容县',
  '450922': '陆川县',
  '450923': '博白县',
  '450924': '兴业县',
  '450981': '北流市',
  '451000': '百色市',
  '451002': '右江区',
  '451021': '田阳县',
  '451022': '田东县',
  '451023': '平果县',
  '451024': '德保县',
  '451026': '那坡县',
  '451027': '凌云县',
  '451028': '乐业县',
  '451029': '田林县',
  '451030': '西林县',
  '451031': '隆林各族自治县',
  '451081': '靖西市',
  '451100': '贺州市',
  '451102': '八步区',
  '451103': '平桂区',
  '451121': '昭平县',
  '451122': '钟山县',
  '451123': '富川瑶族自治县',
  '451200': '河池市',
  '451202': '金城江区',
  '451203': '宜州区',
  '451221': '南丹县',
  '451222': '天峨县',
  '451223': '凤山县',
  '451224': '东兰县',
  '451225': '罗城仫佬族自治县',
  '451226': '环江毛南族自治县',
  '451227': '巴马瑶族自治县',
  '451228': '都安瑶族自治县',
  '451229': '大化瑶族自治县',
  '451300': '来宾市',
  '451302': '兴宾区',
  '451321': '忻城县',
  '451322': '象州县',
  '451323': '武宣县',
  '451324': '金秀瑶族自治县',
  '451381': '合山市',
  '451400': '崇左市',
  '451402': '江州区',
  '451421': '扶绥县',
  '451422': '宁明县',
  '451423': '龙州县',
  '451424': '大新县',
  '451425': '天等县',
  '451481': '凭祥市',
  '460000': '海南省',
  '460100': '海口市',
  '460105': '秀英区',
  '460106': '龙华区',
  '460107': '琼山区',
  '460108': '美兰区',
  '460200': '三亚市',
  '460202': '海棠区',
  '460203': '吉阳区',
  '460204': '天涯区',
  '460205': '崖州区',
  '460300': '三沙市',
  '460400': '儋州市',
  '469001': '五指山市',
  '469002': '琼海市',
  '469005': '文昌市',
  '469006': '万宁市',
  '469007': '东方市',
  '469021': '定安县',
  '469022': '屯昌县',
  '469023': '澄迈县',
  '469024': '临高县',
  '469025': '白沙黎族自治县',
  '469026': '昌江黎族自治县',
  '469027': '乐东黎族自治县',
  '469028': '陵水黎族自治县',
  '469029': '保亭黎族苗族自治县',
  '469030': '琼中黎族苗族自治县',
  '500000': '重庆市',
  '500101': '万州区',
  '500102': '涪陵区',
  '500103': '渝中区',
  '500104': '大渡口区',
  '500105': '江北区',
  '500106': '沙坪坝区',
  '500107': '九龙坡区',
  '500108': '南岸区',
  '500109': '北碚区',
  '500110': '綦江区',
  '500111': '大足区',
  '500112': '渝北区',
  '500113': '巴南区',
  '500114': '黔江区',
  '500115': '长寿区',
  '500116': '江津区',
  '500117': '合川区',
  '500118': '永川区',
  '500119': '南川区',
  '500120': '璧山区',
  '500151': '铜梁区',
  '500152': '潼南区',
  '500153': '荣昌区',
  '500154': '开州区',
  '500155': '梁平区',
  '500156': '武隆区',
  '510000': '四川省',
  '510100': '成都市',
  '510104': '锦江区',
  '510105': '青羊区',
  '510106': '金牛区',
  '510107': '武侯区',
  '510108': '成华区',
  '510112': '龙泉驿区',
  '510113': '青白江区',
  '510114': '新都区',
  '510115': '温江区',
  '510116': '双流区',
  '510117': '郫都区',
  '510121': '金堂县',
  '510129': '大邑县',
  '510131': '蒲江县',
  '510132': '新津县',
  '510181': '都江堰市',
  '510182': '彭州市',
  '510183': '邛崃市',
  '510184': '崇州市',
  '510185': '简阳市',
  '510300': '自贡市',
  '510302': '自流井区',
  '510303': '贡井区',
  '510304': '大安区',
  '510311': '沿滩区',
  '510321': '荣县',
  '510322': '富顺县',
  '510400': '攀枝花市',
  '510402': '东区',
  '510403': '西区',
  '510411': '仁和区',
  '510421': '米易县',
  '510422': '盐边县',
  '510500': '泸州市',
  '510502': '江阳区',
  '510503': '纳溪区',
  '510504': '龙马潭区',
  '510521': '泸县',
  '510522': '合江县',
  '510524': '叙永县',
  '510525': '古蔺县',
  '510600': '德阳市',
  '510603': '旌阳区',
  '510604': '罗江区',
  '510623': '中江县',
  '510681': '广汉市',
  '510682': '什邡市',
  '510683': '绵竹市',
  '510700': '绵阳市',
  '510703': '涪城区',
  '510704': '游仙区',
  '510705': '安州区',
  '510722': '三台县',
  '510723': '盐亭县',
  '510725': '梓潼县',
  '510726': '北川羌族自治县',
  '510727': '平武县',
  '510781': '江油市',
  '510800': '广元市',
  '510802': '利州区',
  '510811': '昭化区',
  '510812': '朝天区',
  '510821': '旺苍县',
  '510822': '青川县',
  '510823': '剑阁县',
  '510824': '苍溪县',
  '510900': '遂宁市',
  '510903': '船山区',
  '510904': '安居区',
  '510921': '蓬溪县',
  '510922': '射洪县',
  '510923': '大英县',
  '511000': '内江市',
  '511002': '市中区',
  '511011': '东兴区',
  '511024': '威远县',
  '511025': '资中县',
  '511083': '隆昌市',
  '511100': '乐山市',
  '511102': '市中区',
  '511111': '沙湾区',
  '511112': '五通桥区',
  '511113': '金口河区',
  '511123': '犍为县',
  '511124': '井研县',
  '511126': '夹江县',
  '511129': '沐川县',
  '511132': '峨边彝族自治县',
  '511133': '马边彝族自治县',
  '511181': '峨眉山市',
  '511300': '南充市',
  '511302': '顺庆区',
  '511303': '高坪区',
  '511304': '嘉陵区',
  '511321': '南部县',
  '511322': '营山县',
  '511323': '蓬安县',
  '511324': '仪陇县',
  '511325': '西充县',
  '511381': '阆中市',
  '511400': '眉山市',
  '511402': '东坡区',
  '511403': '彭山区',
  '511421': '仁寿县',
  '511423': '洪雅县',
  '511424': '丹棱县',
  '511425': '青神县',
  '511500': '宜宾市',
  '511502': '翠屏区',
  '511503': '南溪区',
  '511521': '宜宾县',
  '511523': '江安县',
  '511524': '长宁县',
  '511525': '高县',
  '511526': '珙县',
  '511527': '筠连县',
  '511528': '兴文县',
  '511529': '屏山县',
  '511600': '广安市',
  '511602': '广安区',
  '511603': '前锋区',
  '511621': '岳池县',
  '511622': '武胜县',
  '511623': '邻水县',
  '511681': '华蓥市',
  '511700': '达州市',
  '511702': '通川区',
  '511703': '达川区',
  '511722': '宣汉县',
  '511723': '开江县',
  '511724': '大竹县',
  '511725': '渠县',
  '511781': '万源市',
  '511800': '雅安市',
  '511802': '雨城区',
  '511803': '名山区',
  '511822': '荥经县',
  '511823': '汉源县',
  '511824': '石棉县',
  '511825': '天全县',
  '511826': '芦山县',
  '511827': '宝兴县',
  '511900': '巴中市',
  '511902': '巴州区',
  '511903': '恩阳区',
  '511921': '通江县',
  '511922': '南江县',
  '511923': '平昌县',
  '512000': '资阳市',
  '512002': '雁江区',
  '512021': '安岳县',
  '512022': '乐至县',
  '513200': '阿坝藏族羌族自治州',
  '513201': '马尔康市',
  '513221': '汶川县',
  '513222': '理县',
  '513223': '茂县',
  '513224': '松潘县',
  '513225': '九寨沟县',
  '513226': '金川县',
  '513227': '小金县',
  '513228': '黑水县',
  '513230': '壤塘县',
  '513231': '阿坝县',
  '513232': '若尔盖县',
  '513233': '红原县',
  '513300': '甘孜藏族自治州',
  '513301': '康定市',
  '513322': '泸定县',
  '513323': '丹巴县',
  '513324': '九龙县',
  '513325': '雅江县',
  '513326': '道孚县',
  '513327': '炉霍县',
  '513328': '甘孜县',
  '513329': '新龙县',
  '513330': '德格县',
  '513331': '白玉县',
  '513332': '石渠县',
  '513333': '色达县',
  '513334': '理塘县',
  '513335': '巴塘县',
  '513336': '乡城县',
  '513337': '稻城县',
  '513338': '得荣县',
  '513400': '凉山彝族自治州',
  '513401': '西昌市',
  '513422': '木里藏族自治县',
  '513423': '盐源县',
  '513424': '德昌县',
  '513425': '会理县',
  '513426': '会东县',
  '513427': '宁南县',
  '513428': '普格县',
  '513429': '布拖县',
  '513430': '金阳县',
  '513431': '昭觉县',
  '513432': '喜德县',
  '513433': '冕宁县',
  '513434': '越西县',
  '513435': '甘洛县',
  '513436': '美姑县',
  '513437': '雷波县',
  '520000': '贵州省',
  '520100': '贵阳市',
  '520102': '南明区',
  '520103': '云岩区',
  '520111': '花溪区',
  '520112': '乌当区',
  '520113': '白云区',
  '520115': '观山湖区',
  '520121': '开阳县',
  '520122': '息烽县',
  '520123': '修文县',
  '520181': '清镇市',
  '520200': '六盘水市',
  '520201': '钟山区',
  '520203': '六枝特区',
  '520221': '水城县',
  '520281': '盘州市',
  '520300': '遵义市',
  '520302': '红花岗区',
  '520303': '汇川区',
  '520304': '播州区',
  '520322': '桐梓县',
  '520323': '绥阳县',
  '520324': '正安县',
  '520325': '道真仡佬族苗族自治县',
  '520326': '务川仡佬族苗族自治县',
  '520327': '凤冈县',
  '520328': '湄潭县',
  '520329': '余庆县',
  '520330': '习水县',
  '520381': '赤水市',
  '520382': '仁怀市',
  '520400': '安顺市',
  '520402': '西秀区',
  '520403': '平坝区',
  '520422': '普定县',
  '520423': '镇宁布依族苗族自治县',
  '520424': '关岭布依族苗族自治县',
  '520425': '紫云苗族布依族自治县',
  '520500': '毕节市',
  '520502': '七星关区',
  '520521': '大方县',
  '520522': '黔西县',
  '520523': '金沙县',
  '520524': '织金县',
  '520525': '纳雍县',
  '520526': '威宁彝族回族苗族自治县',
  '520527': '赫章县',
  '520600': '铜仁市',
  '520602': '碧江区',
  '520603': '万山区',
  '520621': '江口县',
  '520622': '玉屏侗族自治县',
  '520623': '石阡县',
  '520624': '思南县',
  '520625': '印江土家族苗族自治县',
  '520626': '德江县',
  '520627': '沿河土家族自治县',
  '520628': '松桃苗族自治县',
  '522300': '黔西南布依族苗族自治州',
  '522301': '兴义市',
  '522322': '兴仁县',
  '522323': '普安县',
  '522324': '晴隆县',
  '522325': '贞丰县',
  '522326': '望谟县',
  '522327': '册亨县',
  '522328': '安龙县',
  '522600': '黔东南苗族侗族自治州',
  '522601': '凯里市',
  '522622': '黄平县',
  '522623': '施秉县',
  '522624': '三穗县',
  '522625': '镇远县',
  '522626': '岑巩县',
  '522627': '天柱县',
  '522628': '锦屏县',
  '522629': '剑河县',
  '522630': '台江县',
  '522631': '黎平县',
  '522632': '榕江县',
  '522633': '从江县',
  '522634': '雷山县',
  '522635': '麻江县',
  '522636': '丹寨县',
  '522700': '黔南布依族苗族自治州',
  '522701': '都匀市',
  '522702': '福泉市',
  '522722': '荔波县',
  '522723': '贵定县',
  '522725': '瓮安县',
  '522726': '独山县',
  '522727': '平塘县',
  '522728': '罗甸县',
  '522729': '长顺县',
  '522730': '龙里县',
  '522731': '惠水县',
  '522732': '三都水族自治县',
  '530000': '云南省',
  '530100': '昆明市',
  '530102': '五华区',
  '530103': '盘龙区',
  '530111': '官渡区',
  '530112': '西山区',
  '530113': '东川区',
  '530114': '呈贡区',
  '530115': '晋宁区',
  '530124': '富民县',
  '530125': '宜良县',
  '530126': '石林彝族自治县',
  '530127': '嵩明县',
  '530128': '禄劝彝族苗族自治县',
  '530129': '寻甸回族彝族自治县',
  '530181': '安宁市',
  '530300': '曲靖市',
  '530302': '麒麟区',
  '530303': '沾益区',
  '530304': '马龙区',
  '530322': '陆良县',
  '530323': '师宗县',
  '530324': '罗平县',
  '530325': '富源县',
  '530326': '会泽县',
  '530381': '宣威市',
  '530400': '玉溪市',
  '530402': '红塔区',
  '530403': '江川区',
  '530422': '澄江县',
  '530423': '通海县',
  '530424': '华宁县',
  '530425': '易门县',
  '530426': '峨山彝族自治县',
  '530427': '新平彝族傣族自治县',
  '530428': '元江哈尼族彝族傣族自治县',
  '530500': '保山市',
  '530502': '隆阳区',
  '530521': '施甸县',
  '530523': '龙陵县',
  '530524': '昌宁县',
  '530581': '腾冲市',
  '530600': '昭通市',
  '530602': '昭阳区',
  '530621': '鲁甸县',
  '530622': '巧家县',
  '530623': '盐津县',
  '530624': '大关县',
  '530625': '永善县',
  '530626': '绥江县',
  '530627': '镇雄县',
  '530628': '彝良县',
  '530629': '威信县',
  '530630': '水富县',
  '530800': '普洱市',
  '530802': '思茅区',
  '530821': '宁洱哈尼族彝族自治县',
  '530822': '墨江哈尼族自治县',
  '530823': '景东彝族自治县',
  '530824': '景谷傣族彝族自治县',
  '530825': '镇沅彝族哈尼族拉祜族自治县',
  '530826': '江城哈尼族彝族自治县',
  '530827': '孟连傣族拉祜族佤族自治县',
  '530828': '澜沧拉祜族自治县',
  '530829': '西盟佤族自治县',
  '530900': '临沧市',
  '530902': '临翔区',
  '530921': '凤庆县',
  '530922': '云县',
  '530923': '永德县',
  '530924': '镇康县',
  '530925': '双江拉祜族佤族布朗族傣族自治县',
  '530926': '耿马傣族佤族自治县',
  '530927': '沧源佤族自治县',
  '532300': '楚雄彝族自治州',
  '532301': '楚雄市',
  '532322': '双柏县',
  '532323': '牟定县',
  '532324': '南华县',
  '532325': '姚安县',
  '532326': '大姚县',
  '532327': '永仁县',
  '532328': '元谋县',
  '532329': '武定县',
  '532331': '禄丰县',
  '532500': '红河哈尼族彝族自治州',
  '532501': '个旧市',
  '532502': '开远市',
  '532503': '蒙自市',
  '532504': '弥勒市',
  '532523': '屏边苗族自治县',
  '532524': '建水县',
  '532525': '石屏县',
  '532527': '泸西县',
  '532528': '元阳县',
  '532529': '红河县',
  '532530': '金平苗族瑶族傣族自治县',
  '532531': '绿春县',
  '532532': '河口瑶族自治县',
  '532600': '文山壮族苗族自治州',
  '532601': '文山市',
  '532622': '砚山县',
  '532623': '西畴县',
  '532624': '麻栗坡县',
  '532625': '马关县',
  '532626': '丘北县',
  '532627': '广南县',
  '532628': '富宁县',
  '532800': '西双版纳傣族自治州',
  '532801': '景洪市',
  '532822': '勐海县',
  '532823': '勐腊县',
  '532900': '大理白族自治州',
  '532901': '大理市',
  '532922': '漾濞彝族自治县',
  '532923': '祥云县',
  '532924': '宾川县',
  '532925': '弥渡县',
  '532926': '南涧彝族自治县',
  '532927': '巍山彝族回族自治县',
  '532928': '永平县',
  '532929': '云龙县',
  '532930': '洱源县',
  '532931': '剑川县',
  '532932': '鹤庆县',
  '533100': '德宏傣族景颇族自治州',
  '533102': '瑞丽市',
  '533103': '芒市',
  '533122': '梁河县',
  '533123': '盈江县',
  '533124': '陇川县',
  '533300': '怒江傈僳族自治州',
  '533301': '泸水市',
  '533323': '福贡县',
  '533324': '贡山独龙族怒族自治县',
  '533325': '兰坪白族普米族自治县',
  '533400': '迪庆藏族自治州',
  '533401': '香格里拉市',
  '533422': '德钦县',
  '533423': '维西傈僳族自治县',
  '540000': '西藏自治区',
  '540100': '拉萨市',
  '540102': '城关区',
  '540103': '堆龙德庆区',
  '540104': '达孜区',
  '540121': '林周县',
  '540122': '当雄县',
  '540123': '尼木县',
  '540124': '曲水县',
  '540127': '墨竹工卡县',
  '540200': '日喀则市',
  '540202': '桑珠孜区',
  '540221': '南木林县',
  '540222': '江孜县',
  '540223': '定日县',
  '540224': '萨迦县',
  '540225': '拉孜县',
  '540226': '昂仁县',
  '540227': '谢通门县',
  '540228': '白朗县',
  '540229': '仁布县',
  '540230': '康马县',
  '540231': '定结县',
  '540232': '仲巴县',
  '540233': '亚东县',
  '540234': '吉隆县',
  '540235': '聂拉木县',
  '540236': '萨嘎县',
  '540237': '岗巴县',
  '540300': '昌都市',
  '540302': '卡若区',
  '540321': '江达县',
  '540322': '贡觉县',
  '540323': '类乌齐县',
  '540324': '丁青县',
  '540325': '察雅县',
  '540326': '八宿县',
  '540327': '左贡县',
  '540328': '芒康县',
  '540329': '洛隆县',
  '540330': '边坝县',
  '540400': '林芝市',
  '540402': '巴宜区',
  '540421': '工布江达县',
  '540422': '米林县',
  '540423': '墨脱县',
  '540424': '波密县',
  '540425': '察隅县',
  '540426': '朗县',
  '540500': '山南市',
  '540502': '乃东区',
  '540521': '扎囊县',
  '540522': '贡嘎县',
  '540523': '桑日县',
  '540524': '琼结县',
  '540525': '曲松县',
  '540526': '措美县',
  '540527': '洛扎县',
  '540528': '加查县',
  '540529': '隆子县',
  '540530': '错那县',
  '540531': '浪卡子县',
  '540600': '那曲市',
  '540602': '色尼区',
  '540621': '嘉黎县',
  '540622': '比如县',
  '540623': '聂荣县',
  '540624': '安多县',
  '540625': '申扎县',
  '540626': '索县',
  '540627': '班戈县',
  '540628': '巴青县',
  '540629': '尼玛县',
  '540630': '双湖县',
  '542500': '阿里地区',
  '542521': '普兰县',
  '542522': '札达县',
  '542523': '噶尔县',
  '542524': '日土县',
  '542525': '革吉县',
  '542526': '改则县',
  '542527': '措勤县',
  '610000': '陕西省',
  '610100': '西安市',
  '610102': '新城区',
  '610103': '碑林区',
  '610104': '莲湖区',
  '610111': '灞桥区',
  '610112': '未央区',
  '610113': '雁塔区',
  '610114': '阎良区',
  '610115': '临潼区',
  '610116': '长安区',
  '610117': '高陵区',
  '610118': '鄠邑区',
  '610122': '蓝田县',
  '610124': '周至县',
  '610200': '铜川市',
  '610202': '王益区',
  '610203': '印台区',
  '610204': '耀州区',
  '610222': '宜君县',
  '610300': '宝鸡市',
  '610302': '渭滨区',
  '610303': '金台区',
  '610304': '陈仓区',
  '610322': '凤翔县',
  '610323': '岐山县',
  '610324': '扶风县',
  '610326': '眉县',
  '610327': '陇县',
  '610328': '千阳县',
  '610329': '麟游县',
  '610330': '凤县',
  '610331': '太白县',
  '610400': '咸阳市',
  '610402': '秦都区',
  '610403': '杨陵区',
  '610404': '渭城区',
  '610422': '三原县',
  '610423': '泾阳县',
  '610424': '乾县',
  '610425': '礼泉县',
  '610426': '永寿县',
  '610428': '长武县',
  '610429': '旬邑县',
  '610430': '淳化县',
  '610431': '武功县',
  '610481': '兴平市',
  '610482': '彬州市',
  '610500': '渭南市',
  '610502': '临渭区',
  '610503': '华州区',
  '610522': '潼关县',
  '610523': '大荔县',
  '610524': '合阳县',
  '610525': '澄城县',
  '610526': '蒲城县',
  '610527': '白水县',
  '610528': '富平县',
  '610581': '韩城市',
  '610582': '华阴市',
  '610600': '延安市',
  '610602': '宝塔区',
  '610603': '安塞区',
  '610621': '延长县',
  '610622': '延川县',
  '610623': '子长县',
  '610625': '志丹县',
  '610626': '吴起县',
  '610627': '甘泉县',
  '610628': '富县',
  '610629': '洛川县',
  '610630': '宜川县',
  '610631': '黄龙县',
  '610632': '黄陵县',
  '610700': '汉中市',
  '610702': '汉台区',
  '610703': '南郑区',
  '610722': '城固县',
  '610723': '洋县',
  '610724': '西乡县',
  '610725': '勉县',
  '610726': '宁强县',
  '610727': '略阳县',
  '610728': '镇巴县',
  '610729': '留坝县',
  '610730': '佛坪县',
  '610800': '榆林市',
  '610802': '榆阳区',
  '610803': '横山区',
  '610822': '府谷县',
  '610824': '靖边县',
  '610825': '定边县',
  '610826': '绥德县',
  '610827': '米脂县',
  '610828': '佳县',
  '610829': '吴堡县',
  '610830': '清涧县',
  '610831': '子洲县',
  '610881': '神木市',
  '610900': '安康市',
  '610902': '汉滨区',
  '610921': '汉阴县',
  '610922': '石泉县',
  '610923': '宁陕县',
  '610924': '紫阳县',
  '610925': '岚皋县',
  '610926': '平利县',
  '610927': '镇坪县',
  '610928': '旬阳县',
  '610929': '白河县',
  '611000': '商洛市',
  '611002': '商州区',
  '611021': '洛南县',
  '611022': '丹凤县',
  '611023': '商南县',
  '611024': '山阳县',
  '611025': '镇安县',
  '611026': '柞水县',
  '620000': '甘肃省',
  '620100': '兰州市',
  '620102': '城关区',
  '620103': '七里河区',
  '620104': '西固区',
  '620105': '安宁区',
  '620111': '红古区',
  '620121': '永登县',
  '620122': '皋兰县',
  '620123': '榆中县',
  '620200': '嘉峪关市',
  '620300': '金昌市',
  '620302': '金川区',
  '620321': '永昌县',
  '620400': '白银市',
  '620402': '白银区',
  '620403': '平川区',
  '620421': '靖远县',
  '620422': '会宁县',
  '620423': '景泰县',
  '620500': '天水市',
  '620502': '秦州区',
  '620503': '麦积区',
  '620521': '清水县',
  '620522': '秦安县',
  '620523': '甘谷县',
  '620524': '武山县',
  '620525': '张家川回族自治县',
  '620600': '武威市',
  '620602': '凉州区',
  '620621': '民勤县',
  '620622': '古浪县',
  '620623': '天祝藏族自治县',
  '620700': '张掖市',
  '620702': '甘州区',
  '620721': '肃南裕固族自治县',
  '620722': '民乐县',
  '620723': '临泽县',
  '620724': '高台县',
  '620725': '山丹县',
  '620800': '平凉市',
  '620802': '崆峒区',
  '620821': '泾川县',
  '620822': '灵台县',
  '620823': '崇信县',
  '620824': '华亭县',
  '620825': '庄浪县',
  '620826': '静宁县',
  '620900': '酒泉市',
  '620902': '肃州区',
  '620921': '金塔县',
  '620922': '瓜州县',
  '620923': '肃北蒙古族自治县',
  '620924': '阿克塞哈萨克族自治县',
  '620981': '玉门市',
  '620982': '敦煌市',
  '621000': '庆阳市',
  '621002': '西峰区',
  '621021': '庆城县',
  '621022': '环县',
  '621023': '华池县',
  '621024': '合水县',
  '621025': '正宁县',
  '621026': '宁县',
  '621027': '镇原县',
  '621100': '定西市',
  '621102': '安定区',
  '621121': '通渭县',
  '621122': '陇西县',
  '621123': '渭源县',
  '621124': '临洮县',
  '621125': '漳县',
  '621126': '岷县',
  '621200': '陇南市',
  '621202': '武都区',
  '621221': '成县',
  '621222': '文县',
  '621223': '宕昌县',
  '621224': '康县',
  '621225': '西和县',
  '621226': '礼县',
  '621227': '徽县',
  '621228': '两当县',
  '622900': '临夏回族自治州',
  '622901': '临夏市',
  '622921': '临夏县',
  '622922': '康乐县',
  '622923': '永靖县',
  '622924': '广河县',
  '622925': '和政县',
  '622926': '东乡族自治县',
  '622927': '积石山保安族东乡族撒拉族自治县',
  '623000': '甘南藏族自治州',
  '623001': '合作市',
  '623021': '临潭县',
  '623022': '卓尼县',
  '623023': '舟曲县',
  '623024': '迭部县',
  '623025': '玛曲县',
  '623026': '碌曲县',
  '623027': '夏河县',
  '630000': '青海省',
  '630100': '西宁市',
  '630102': '城东区',
  '630103': '城中区',
  '630104': '城西区',
  '630105': '城北区',
  '630121': '大通回族土族自治县',
  '630122': '湟中县',
  '630123': '湟源县',
  '630200': '海东市',
  '630202': '乐都区',
  '630203': '平安区',
  '630222': '民和回族土族自治县',
  '630223': '互助土族自治县',
  '630224': '化隆回族自治县',
  '630225': '循化撒拉族自治县',
  '632200': '海北藏族自治州',
  '632221': '门源回族自治县',
  '632222': '祁连县',
  '632223': '海晏县',
  '632224': '刚察县',
  '632300': '黄南藏族自治州',
  '632321': '同仁县',
  '632322': '尖扎县',
  '632323': '泽库县',
  '632324': '河南蒙古族自治县',
  '632500': '海南藏族自治州',
  '632521': '共和县',
  '632522': '同德县',
  '632523': '贵德县',
  '632524': '兴海县',
  '632525': '贵南县',
  '632600': '果洛藏族自治州',
  '632621': '玛沁县',
  '632622': '班玛县',
  '632623': '甘德县',
  '632624': '达日县',
  '632625': '久治县',
  '632626': '玛多县',
  '632700': '玉树藏族自治州',
  '632701': '玉树市',
  '632722': '杂多县',
  '632723': '称多县',
  '632724': '治多县',
  '632725': '囊谦县',
  '632726': '曲麻莱县',
  '632800': '海西蒙古族藏族自治州',
  '632801': '格尔木市',
  '632802': '德令哈市',
  '632803': '茫崖市',
  '632821': '乌兰县',
  '632822': '都兰县',
  '632823': '天峻县',
  '640000': '宁夏回族自治区',
  '640100': '银川市',
  '640104': '兴庆区',
  '640105': '西夏区',
  '640106': '金凤区',
  '640121': '永宁县',
  '640122': '贺兰县',
  '640181': '灵武市',
  '640200': '石嘴山市',
  '640202': '大武口区',
  '640205': '惠农区',
  '640221': '平罗县',
  '640300': '吴忠市',
  '640302': '利通区',
  '640303': '红寺堡区',
  '640323': '盐池县',
  '640324': '同心县',
  '640381': '青铜峡市',
  '640400': '固原市',
  '640402': '原州区',
  '640422': '西吉县',
  '640423': '隆德县',
  '640424': '泾源县',
  '640425': '彭阳县',
  '640500': '中卫市',
  '640502': '沙坡头区',
  '640521': '中宁县',
  '640522': '海原县',
  '650000': '新疆维吾尔自治区',
  '650100': '乌鲁木齐市',
  '650102': '天山区',
  '650103': '沙依巴克区',
  '650104': '新市区',
  '650105': '水磨沟区',
  '650106': '头屯河区',
  '650107': '达坂城区',
  '650109': '米东区',
  '650121': '乌鲁木齐县',
  '650200': '克拉玛依市',
  '650202': '独山子区',
  '650203': '克拉玛依区',
  '650204': '白碱滩区',
  '650205': '乌尔禾区',
  '650400': '吐鲁番市',
  '650402': '高昌区',
  '650421': '鄯善县',
  '650422': '托克逊县',
  '650500': '哈密市',
  '650502': '伊州区',
  '650521': '巴里坤哈萨克自治县',
  '650522': '伊吾县',
  '652300': '昌吉回族自治州',
  '652301': '昌吉市',
  '652302': '阜康市',
  '652323': '呼图壁县',
  '652324': '玛纳斯县',
  '652325': '奇台县',
  '652327': '吉木萨尔县',
  '652328': '木垒哈萨克自治县',
  '652700': '博尔塔拉蒙古自治州',
  '652701': '博乐市',
  '652702': '阿拉山口市',
  '652722': '精河县',
  '652723': '温泉县',
  '652800': '巴音郭楞蒙古自治州',
  '652801': '库尔勒市',
  '652822': '轮台县',
  '652823': '尉犁县',
  '652824': '若羌县',
  '652825': '且末县',
  '652826': '焉耆回族自治县',
  '652827': '和静县',
  '652828': '和硕县',
  '652829': '博湖县',
  '652900': '阿克苏地区',
  '652901': '阿克苏市',
  '652922': '温宿县',
  '652923': '库车县',
  '652924': '沙雅县',
  '652925': '新和县',
  '652926': '拜城县',
  '652927': '乌什县',
  '652928': '阿瓦提县',
  '652929': '柯坪县',
  '653000': '克孜勒苏柯尔克孜自治州',
  '653001': '阿图什市',
  '653022': '阿克陶县',
  '653023': '阿合奇县',
  '653024': '乌恰县',
  '653100': '喀什地区',
  '653101': '喀什市',
  '653121': '疏附县',
  '653122': '疏勒县',
  '653123': '英吉沙县',
  '653124': '泽普县',
  '653125': '莎车县',
  '653126': '叶城县',
  '653127': '麦盖提县',
  '653128': '岳普湖县',
  '653129': '伽师县',
  '653130': '巴楚县',
  '653131': '塔什库尔干塔吉克自治县',
  '653200': '和田地区',
  '653201': '和田市',
  '653221': '和田县',
  '653222': '墨玉县',
  '653223': '皮山县',
  '653224': '洛浦县',
  '653225': '策勒县',
  '653226': '于田县',
  '653227': '民丰县',
  '654000': '伊犁哈萨克自治州',
  '654002': '伊宁市',
  '654003': '奎屯市',
  '654004': '霍尔果斯市',
  '654021': '伊宁县',
  '654022': '察布查尔锡伯自治县',
  '654023': '霍城县',
  '654024': '巩留县',
  '654025': '新源县',
  '654026': '昭苏县',
  '654027': '特克斯县',
  '654028': '尼勒克县',
  '654200': '塔城地区',
  '654201': '塔城市',
  '654202': '乌苏市',
  '654221': '额敏县',
  '654223': '沙湾县',
  '654224': '托里县',
  '654225': '裕民县',
  '654226': '和布克赛尔蒙古自治县',
  '654300': '阿勒泰地区',
  '654301': '阿勒泰市',
  '654321': '布尔津县',
  '654322': '富蕴县',
  '654323': '福海县',
  '654324': '哈巴河县',
  '654325': '青河县',
  '654326': '吉木乃县',
  '659001': '石河子市',
  '659002': '阿拉尔市',
  '659003': '图木舒克市',
  '659004': '五家渠市',
  '659005': '北屯市',
  '659006': '铁门关市',
  '659007': '双河市',
  '659008': '可克达拉市',
  '659009': '昆玉市',
  '710000': '台湾省',
  '710100': '台北市',
  '710101': '中正区',
  '710102': '大同区',
  '710103': '中山区',
  '710104': '松山区',
  '710105': '大安区',
  '710106': '万华区',
  '710107': '信义区',
  '710108': '士林区',
  '710109': '北投区',
  '710110': '内湖区',
  '710111': '南港区',
  '710112': '文山区',
  '710200': '高雄市',
  '710201': '新兴区',
  '710202': '前金区',
  '710203': '苓雅区',
  '710204': '盐埕区',
  '710205': '鼓山区',
  '710206': '旗津区',
  '710207': '前镇区',
  '710208': '三民区',
  '710209': '左营区',
  '710210': '楠梓区',
  '710211': '小港区',
  '710212': '仁武区',
  '710213': '大社区',
  '710214': '冈山区',
  '710215': '路竹区',
  '710216': '阿莲区',
  '710217': '田寮区',
  '710218': '燕巢区',
  '710219': '桥头区',
  '710220': '梓官区',
  '710221': '弥陀区',
  '710222': '永安区',
  '710223': '湖内区',
  '710224': '凤山区',
  '710225': '大寮区',
  '710226': '林园区',
  '710227': '鸟松区',
  '710228': '大树区',
  '710229': '旗山区',
  '710230': '美浓区',
  '710231': '六龟区',
  '710232': '内门区',
  '710233': '杉林区',
  '710234': '甲仙区',
  '710235': '桃源区',
  '710236': '那玛夏区',
  '710237': '茂林区',
  '710238': '茄萣区',
  '710300': '台南市',
  '710301': '中西区',
  '710302': '东区',
  '710303': '南区',
  '710304': '北区',
  '710305': '安平区',
  '710306': '安南区',
  '710307': '永康区',
  '710308': '归仁区',
  '710309': '新化区',
  '710310': '左镇区',
  '710311': '玉井区',
  '710312': '楠西区',
  '710313': '南化区',
  '710314': '仁德区',
  '710315': '关庙区',
  '710316': '龙崎区',
  '710317': '官田区',
  '710318': '麻豆区',
  '710319': '佳里区',
  '710320': '西港区',
  '710321': '七股区',
  '710322': '将军区',
  '710323': '学甲区',
  '710324': '北门区',
  '710325': '新营区',
  '710326': '后壁区',
  '710327': '白河区',
  '710328': '东山区',
  '710329': '六甲区',
  '710330': '下营区',
  '710331': '柳营区',
  '710332': '盐水区',
  '710333': '善化区',
  '710334': '大内区',
  '710335': '山上区',
  '710336': '新市区',
  '710337': '安定区',
  '710400': '台中市',
  '710401': '中区',
  '710402': '东区',
  '710403': '南区',
  '710404': '西区',
  '710405': '北区',
  '710406': '北屯区',
  '710407': '西屯区',
  '710408': '南屯区',
  '710409': '太平区',
  '710410': '大里区',
  '710411': '雾峰区',
  '710412': '乌日区',
  '710413': '丰原区',
  '710414': '后里区',
  '710415': '石冈区',
  '710416': '东势区',
  '710417': '和平区',
  '710418': '新社区',
  '710419': '潭子区',
  '710420': '大雅区',
  '710421': '神冈区',
  '710422': '大肚区',
  '710423': '沙鹿区',
  '710424': '龙井区',
  '710425': '梧栖区',
  '710426': '清水区',
  '710427': '大甲区',
  '710428': '外埔区',
  '710429': '大安区',
  '710500': '南投县',
  '710501': '南投市',
  '710502': '中寮乡',
  '710503': '草屯镇',
  '710504': '国姓乡',
  '710505': '埔里镇',
  '710506': '仁爱乡',
  '710507': '名间乡',
  '710508': '集集镇',
  '710509': '水里乡',
  '710510': '鱼池乡',
  '710511': '信义乡',
  '710512': '竹山镇',
  '710513': '鹿谷乡',
  '710600': '基隆市',
  '710601': '仁爱区',
  '710602': '信义区',
  '710603': '中正区',
  '710604': '中山区',
  '710605': '安乐区',
  '710606': '暖暖区',
  '710607': '七堵区',
  '710700': '新竹市',
  '710701': '东区',
  '710702': '北区',
  '710703': '香山区',
  '710800': '嘉义市',
  '710801': '东区',
  '710802': '西区',
  '710900': '新北市',
  '710901': '万里区',
  '710902': '金山区',
  '710903': '板桥区',
  '710904': '汐止区',
  '710905': '深坑区',
  '710906': '石碇区',
  '710907': '瑞芳区',
  '710908': '平溪区',
  '710909': '双溪区',
  '710910': '贡寮区',
  '710911': '新店区',
  '710912': '坪林区',
  '710913': '乌来区',
  '710914': '永和区',
  '710915': '中和区',
  '710916': '土城区',
  '710917': '三峡区',
  '710918': '树林区',
  '710919': '莺歌区',
  '710920': '三重区',
  '710921': '新庄区',
  '710922': '泰山区',
  '710923': '林口区',
  '710924': '芦洲区',
  '710925': '五股区',
  '710926': '八里区',
  '710927': '淡水区',
  '710928': '三芝区',
  '710929': '石门区',
  '711000': '宜兰县',
  '711001': '宜兰市',
  '711002': '头城镇',
  '711003': '礁溪乡',
  '711004': '壮围乡',
  '711005': '员山乡',
  '711006': '罗东镇',
  '711007': '三星乡',
  '711008': '大同乡',
  '711009': '五结乡',
  '711010': '冬山乡',
  '711011': '苏澳乡',
  '711012': '苏澳镇',
  '711013': '南澳乡',
  '711100': '新竹县',
  '711101': '竹北市',
  '711102': '湖口乡',
  '711103': '新丰乡',
  '711104': '新埔镇',
  '711105': '关西镇',
  '711106': '芎林乡',
  '711107': '宝山乡',
  '711108': '竹东镇',
  '711109': '五峰乡',
  '711110': '横山乡',
  '711111': '尖石乡',
  '711112': '北埔乡',
  '711113': '峨眉乡',
  '711200': '桃园市',
  '711201': '中坜区',
  '711202': '平镇区',
  '711203': '龙潭区',
  '711204': '杨梅区',
  '711205': '新屋区',
  '711206': '观音区',
  '711207': '桃园区',
  '711208': '龟山区',
  '711209': '八德区',
  '711210': '大溪区',
  '711211': '复兴区',
  '711212': '大园区',
  '711213': '芦竹区',
  '711300': '苗栗县',
  '711301': '竹南镇',
  '711302': '头份市',
  '711303': '三湾乡',
  '711304': '南庄乡',
  '711305': '狮潭乡',
  '711306': '后龙镇',
  '711307': '通宵镇',
  '711308': '苑里镇',
  '711309': '苗栗市',
  '711310': '造桥乡',
  '711311': '头屋乡',
  '711312': '公馆乡',
  '711313': '大湖乡',
  '711314': '泰安乡',
  '711315': '铜锣乡',
  '711316': '三义乡',
  '711317': '西湖乡',
  '711318': '卓兰镇',
  '711400': '彰化县',
  '711401': '彰化市',
  '711402': '芬园乡',
  '711403': '花坛乡',
  '711404': '透水乡',
  '711405': '鹿港镇',
  '711406': '福兴乡',
  '711407': '线西乡',
  '711408': '和美镇',
  '711409': '伸港乡',
  '711410': '员林市',
  '711411': '社头乡',
  '711412': '永靖乡',
  '711413': '埔心乡',
  '711414': '溪湖镇',
  '711415': '大村乡',
  '711416': '埔盐乡',
  '711417': '田中镇',
  '711418': '北斗镇',
  '711419': '田尾乡',
  '711420': '埤头乡',
  '711421': '溪州乡',
  '711422': '竹塘乡',
  '711423': '二林镇',
  '711424': '大城乡',
  '711425': '芳苑乡',
  '711426': '二水乡',
  '711500': '嘉义县',
  '711501': '番路乡',
  '711502': '梅山乡',
  '711503': '竹崎乡',
  '711504': '阿里山乡',
  '711505': '中埔乡',
  '711506': '大埔乡',
  '711507': '水上乡',
  '711508': '鹿草乡',
  '711509': '太保市',
  '711510': '朴子市',
  '711511': '东石乡',
  '711512': '六脚乡',
  '711513': '新港乡',
  '711514': '民雄乡',
  '711515': '大林镇',
  '711516': '溪口乡',
  '711517': '义竹乡',
  '711518': '布袋镇',
  '711600': '云林县',
  '711601': '斗南镇',
  '711602': '大埤乡',
  '711603': '虎尾镇',
  '711604': '土库镇',
  '711605': '褒忠乡',
  '711606': '东势乡',
  '711607': '台西乡',
  '711608': '仑背乡',
  '711609': '麦寮乡',
  '711610': '斗六市',
  '711611': '林内乡',
  '711612': '古坑乡',
  '711613': '莿桐乡',
  '711614': '西螺镇',
  '711615': '二仑乡',
  '711616': '北港镇',
  '711617': '水林乡',
  '711618': '口湖乡',
  '711619': '四湖乡',
  '711620': '元长乡',
  '711700': '屏东县',
  '711701': '屏东市',
  '711702': '三地门乡',
  '711703': '雾台乡',
  '711704': '玛家乡',
  '711705': '九如乡',
  '711706': '里港乡',
  '711707': '高树乡',
  '711708': '盐埔乡',
  '711709': '长治乡',
  '711710': '麟洛乡',
  '711711': '竹田乡',
  '711712': '内埔乡',
  '711713': '万丹乡',
  '711714': '潮州镇',
  '711715': '泰武乡',
  '711716': '来义乡',
  '711717': '万峦乡',
  '711718': '崁顶乡',
  '711719': '新埤乡',
  '711720': '南州乡',
  '711721': '林边乡',
  '711722': '东港镇',
  '711723': '琉球乡',
  '711724': '佳冬乡',
  '711725': '新园乡',
  '711726': '枋寮乡',
  '711727': '枋山乡',
  '711728': '春日乡',
  '711729': '狮子乡',
  '711730': '车城乡',
  '711731': '牡丹乡',
  '711732': '恒春镇',
  '711733': '满州乡',
  '711800': '台东县',
  '711801': '台东市',
  '711802': '绿岛乡',
  '711803': '兰屿乡',
  '711804': '延平乡',
  '711805': '卑南乡',
  '711806': '鹿野乡',
  '711807': '关山镇',
  '711808': '海端乡',
  '711809': '池上乡',
  '711810': '东河乡',
  '711811': '成功镇',
  '711812': '长滨乡',
  '711813': '金峰乡',
  '711814': '大武乡',
  '711815': '达仁乡',
  '711816': '太麻里乡',
  '711900': '花莲县',
  '711901': '花莲市',
  '711902': '新城乡',
  '711903': '秀林乡',
  '711904': '吉安乡',
  '711905': '寿丰乡',
  '711906': '凤林镇',
  '711907': '光复乡',
  '711908': '丰宾乡',
  '711909': '瑞穗乡',
  '711910': '万荣乡',
  '711911': '玉里镇',
  '711912': '卓溪乡',
  '711913': '富里乡',
  '712000': '澎湖县',
  '712001': '马公市',
  '712002': '西屿乡',
  '712003': '望安乡',
  '712004': '七美乡',
  '712005': '白沙乡',
  '712006': '湖西乡',
  '810000': '香港特别行政区',
  '810101': '中西区',
  '810102': '东区',
  '810103': '九龙城区',
  '810104': '观塘区',
  '810105': '南区',
  '810106': '深水埗区',
  '810107': '湾仔区',
  '810108': '黄大仙区',
  '810109': '油尖旺区',
  '810110': '离岛区',
  '810111': '葵青区',
  '810112': '北区',
  '810113': '西贡区',
  '810114': '沙田区',
  '810115': '屯门区',
  '810116': '大埔区',
  '810117': '荃湾区',
  '810118': '元朗区',
  '820000': '澳门特别行政区',
  '820101': '澳门半岛',
  '820102': '凼仔',
  '820103': '路凼城',
  '820104': '路环',
}
