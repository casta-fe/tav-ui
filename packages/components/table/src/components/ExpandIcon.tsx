import BasicArrow from '../../../basic-arrow';

export default () => {
  return (props: Record<string, any>) => {
    if (!props.expandable) {
      if (props.needIndentSpaced) {
        return <span class="ant-table-row-expand-icon ant-table-row-spaced" />;
      } else {
        return <span />;
      }
    }
    return (
      <div
        onClick={(e: Event) => {
          props.onExpand(props.record, e);
        }}
      >
        <BasicArrow
          style="margin-right: 8px"
          iconStyle="margin-top: -2px;"
          expand={props.expanded}
        />
      </div>
    );
  };
};
