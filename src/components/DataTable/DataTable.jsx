import { useState, useMemo, useCallback } from 'react';
import {
  Container,
  Toolbar,
  SearchInput,
  TableWrapper,
  StyledTable,
  Th,
  CheckboxTh,
  HeaderContent,
  SortIconSpan,
  FilterTh,
  FilterInput,
  Td,
  CheckboxTd,
  TableRow,
  EmptyTd,
  TooltipWrapper,
  TooltipBox,
  PaginationWrapper,
  PageInfo,
  PageControls,
  PageBtn,
  PageNumber,
  PageSizeLabel,
  PageSizeSelect,
} from './DataTable.styles';

// ─── Sub-components ───────────────────────────────────────────────────────────

function SearchBar({ value, onChange, placeholder }) {
  return (
    <SearchInput
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder ?? 'Search…'}
    />
  );
}

function ColumnFilter({ column, value, onChange }) {
  return (
    <FilterInput
      type="text"
      value={value ?? ''}
      onChange={(e) => onChange(column.key, e.target.value)}
      placeholder="Filter…"
      onClick={(e) => e.stopPropagation()}
    />
  );
}

function SortIcon({ direction }) {
  if (!direction) return <SortIconSpan>⇅</SortIconSpan>;
  return <SortIconSpan $active>{direction === 'asc' ? '↑' : '↓'}</SortIconSpan>;
}

function Pagination({ page, totalPages, pageSize, pageSizeOptions, onPageChange, onPageSizeChange, totalRows }) {
  const start = totalRows === 0 ? 0 : (page - 1) * pageSize + 1;
  const end   = Math.min(page * pageSize, totalRows);

  return (
    <PaginationWrapper>
      <PageInfo>
        {totalRows === 0 ? '0 rows' : `${start}–${end} of ${totalRows}`}
      </PageInfo>

      <PageControls>
        <PageBtn onClick={() => onPageChange(1)} disabled={page === 1} title="First page">
          {'«'}
        </PageBtn>
        <PageBtn onClick={() => onPageChange(page - 1)} disabled={page === 1} title="Previous page">
          {'‹'}
        </PageBtn>

        <PageNumber>Page {page} of {totalPages || 1}</PageNumber>

        <PageBtn onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} title="Next page">
          {'›'}
        </PageBtn>
        <PageBtn onClick={() => onPageChange(totalPages)} disabled={page >= totalPages} title="Last page">
          {'»'}
        </PageBtn>
      </PageControls>

      {pageSizeOptions && (
        <PageSizeLabel>
          Rows per page:
          <PageSizeSelect
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {pageSizeOptions.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </PageSizeSelect>
        </PageSizeLabel>
      )}
    </PaginationWrapper>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

/**
 * DataTable — a reusable, configurable table component.
 *
 * Props:
 *   columns          {Array<{key, label, sortable?, filterable?, render?}>}  required
 *   data             {Array<object>}                                         required
 *   rowKey           {string|function}   field name or (row, i) => key       default: 'id' or index
 *
 *   // Optional features (omit the prop to disable the feature)
 *   searchable       {boolean}           global search bar
 *   searchPlaceholder {string}
 *   sortable         {boolean}           default sort behaviour for columns that don't set col.sortable
 *                                        Column-level col.sortable always takes precedence:
 *                                          col.sortable = true  → always sortable (even if table sortable is false)
 *                                          col.sortable = false → never sortable  (even if table sortable is true)
 *                                          col.sortable omitted → inherits the table-level sortable flag
 *
 *                                        Usage patterns:
 *                                          • All sortable:       <DataTable sortable … />
 *                                          • None sortable:      omit sortable, set col.sortable=true on chosen columns
 *                                          • Mix:                <DataTable sortable … /> + col.sortable=false on exceptions
 *
 *   filterable       {boolean}           per-column filter row
 *   selectable       {boolean}           checkbox column for row selection
 *   onSelectionChange {function}         (selectedRows) => void
 *   pagination       {boolean}           enable pagination
 *   pageSize         {number}            initial rows per page (default 10)
 *   pageSizeOptions  {number[]}          show page-size selector (e.g. [10, 25, 50])
 *
 *   // Appearance
 *   className        {string}            extra class on the outer container
 *   emptyMessage     {string}            shown when no rows match
 */
export default function DataTable({
  columns,
  data = [],
  rowKey,

  // features
  searchable,
  searchPlaceholder,
  sortable: globalSortable,
  filterable,
  selectable,
  onSelectionChange,
  pagination,
  pageSize: initialPageSize = 10,
  pageSizeOptions,

  // appearance
  className,
  emptyMessage = 'No records found.',
}) {
  // ── State ──────────────────────────────────────────────────────────────────
  const [searchTerm,    setSearchTerm]    = useState('');
  const [columnFilters, setColumnFilters] = useState({});   // { [key]: string }
  const [sortConfig,    setSortConfig]    = useState(null); // { key, direction }
  const [selectedKeys,  setSelectedKeys]  = useState(new Set());
  const [currentPage,   setCurrentPage]   = useState(1);
  const [pageSize,      setPageSize]      = useState(initialPageSize);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const getRowKey = useCallback(
    (row, index) => {
      if (typeof rowKey === 'function') return rowKey(row, index);
      if (typeof rowKey === 'string')   return row[rowKey] ?? index;
      return row.id ?? index;
    },
    [rowKey],
  );

  // Column-level sortable takes full precedence over the global flag.
  // true/false → use column value; undefined → fall back to globalSortable.
  const colIsSortable = (col) => {
    if (col.sortable === true)  return true;
    if (col.sortable === false) return false;
    return !!globalSortable;
  };

  // ── Derived data pipeline ──────────────────────────────────────────────────
  const processed = useMemo(() => {
    let rows = [...data];

    // 1. Global search
    if (searchable && searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      rows = rows.filter((row) =>
        columns.some((col) => String(row[col.key] ?? '').toLowerCase().includes(term)),
      );
    }

    // 2. Per-column filters
    if (filterable) {
      Object.entries(columnFilters).forEach(([key, val]) => {
        if (val && val.trim()) {
          const lower = val.toLowerCase();
          rows = rows.filter((row) =>
            String(row[key] ?? '').toLowerCase().includes(lower),
          );
        }
      });
    }

    // 3. Sort
    if (sortConfig) {
      const { key, direction } = sortConfig;
      rows.sort((a, b) => {
        const av = a[key] ?? '';
        const bv = b[key] ?? '';
        const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
        return direction === 'asc' ? cmp : -cmp;
      });
    }

    return rows;
  }, [data, columns, searchable, searchTerm, filterable, columnFilters, sortConfig]);

  // 4. Pagination
  const totalRows  = processed.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const paged      = pagination
    ? processed.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : processed;

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleSort = (col) => {
    if (!colIsSortable(col)) return;
    setSortConfig((prev) => {
      if (prev?.key !== col.key) return { key: col.key, direction: 'asc' };
      if (prev.direction === 'asc')  return { key: col.key, direction: 'desc' };
      return null; // third click clears sort
    });
    setCurrentPage(1);
  };

  const handleSearch = (val) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleColumnFilter = (key, val) => {
    setColumnFilters((prev) => ({ ...prev, [key]: val }));
    setCurrentPage(1);
  };

  const handlePageChange = (p) => {
    setCurrentPage(Math.max(1, Math.min(p, totalPages)));
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // Selection
  const allPageKeys      = paged.map((row, i) => String(getRowKey(row, i)));
  const allPageSelected  = allPageKeys.length > 0 && allPageKeys.every((k) => selectedKeys.has(k));
  const somePageSelected = allPageKeys.some((k) => selectedKeys.has(k));

  const toggleRow = (key, row) => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      onSelectionChange?.(data.filter((r, i) => next.has(String(getRowKey(r, i)))));
      return next;
    });
  };

  const toggleAllPage = () => {
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (allPageSelected) {
        allPageKeys.forEach((k) => next.delete(k));
      } else {
        allPageKeys.forEach((k) => next.add(k));
      }
      onSelectionChange?.(data.filter((r, i) => next.has(String(getRowKey(r, i)))));
      return next;
    });
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Container className={className}>

      {/* Toolbar */}
      {searchable && (
        <Toolbar>
          <SearchBar
            value={searchTerm}
            onChange={handleSearch}
            placeholder={searchPlaceholder}
          />
        </Toolbar>
      )}

      {/* Table */}
      <TableWrapper>
        <StyledTable>
          <thead>
            {/* Header row */}
            <tr>
              {selectable && (
                <CheckboxTh>
                  <input
                    type="checkbox"
                    checked={allPageSelected}
                    ref={(el) => { if (el) el.indeterminate = !allPageSelected && somePageSelected; }}
                    onChange={toggleAllPage}
                    title="Select / deselect page"
                  />
                </CheckboxTh>
              )}
              {columns.map((col) => (
                <Th
                  key={col.key}
                  $sortable={colIsSortable(col)}
                  onClick={() => handleSort(col)}
                  title={colIsSortable(col) ? `Sort by ${col.label}` : undefined}
                >
                  <HeaderContent>
                    {col.label}
                    {colIsSortable(col) && (
                      <SortIcon
                        direction={sortConfig?.key === col.key ? sortConfig.direction : null}
                      />
                    )}
                  </HeaderContent>
                </Th>
              ))}
            </tr>

            {/* Filter row */}
            {filterable && (
              <tr>
                {selectable && <FilterTh />}
                {columns.map((col) => (
                  <FilterTh key={col.key}>
                    {col.filterable !== false && (
                      <ColumnFilter
                        column={col}
                        value={columnFilters[col.key]}
                        onChange={handleColumnFilter}
                      />
                    )}
                  </FilterTh>
                ))}
              </tr>
            )}
          </thead>

          <tbody>
            {paged.length === 0 ? (
              <tr>
                <EmptyTd colSpan={columns.length + (selectable ? 1 : 0)}>
                  {emptyMessage}
                </EmptyTd>
              </tr>
            ) : (
              paged.map((row, index) => {
                const key        = String(getRowKey(row, index));
                const isSelected = selectedKeys.has(key);
                return (
                  <TableRow
                    key={key}
                    $even={index % 2 === 0}
                    $selected={isSelected}
                  >
                    {selectable && (
                      <CheckboxTd>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRow(key, row)}
                        />
                      </CheckboxTd>
                    )}
                    {columns.map((col) => {
                      const value     = row[col.key] ?? '-';
                      const displayed = col.render ? col.render(value, row, index) : value;
                      return (
                        <Td key={col.key}>
                          {col.render ? (
                            displayed
                          ) : (
                            <TooltipWrapper>
                              {displayed}
                              <TooltipBox>{displayed}</TooltipBox>
                            </TooltipWrapper>
                          )}
                        </Td>
                      );
                    })}
                  </TableRow>
                );
              })
            )}
          </tbody>
        </StyledTable>
      </TableWrapper>

      {/* Pagination */}
      {pagination && (
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          pageSizeOptions={pageSizeOptions}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          totalRows={totalRows}
        />
      )}
    </Container>
  );
}
