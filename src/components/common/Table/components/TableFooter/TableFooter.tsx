import { Select, SelectOption } from "../../../Select";
import { Pagination, PaginationProps } from "../Pagination";
import "./TableFooter.css";

interface TableFooterProps {
  pagination?: PaginationProps;
  showInfo?: boolean;
  totalItems?: number;
  pageSize?: number;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  startItem?: number;
  endItem?: number;
}

export const TableFooter = ({
  pagination,
  showInfo = true,
  totalItems = 0,
  pageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  onPageSizeChange,
  startItem = 0,
  endItem = 0,
}: TableFooterProps) => {
  const pageSizeSelectOptions: SelectOption[] = pageSizeOptions.map((size) => ({
    value: size.toString(),
    label: `${size} per page`,
  }));

  return (
    <div className="table-footer">
      <div className="table-footer-left">
        {showInfo && totalItems > 0 && (
          <span className="table-info">
            Showing {startItem} to {endItem} of {totalItems} entries
          </span>
        )}
      </div>

      <div className="table-footer-center">
        {pagination && <Pagination {...pagination} />}
      </div>

      <div className="table-footer-right">
        {onPageSizeChange && pageSizeOptions.length > 0 && (
          <div className="table-page-size">
            <Select
              options={pageSizeSelectOptions}
              value={pageSize.toString()}
              onChange={(value) => onPageSizeChange(parseInt(value))}
            />
          </div>
        )}
      </div>
    </div>
  );
};
