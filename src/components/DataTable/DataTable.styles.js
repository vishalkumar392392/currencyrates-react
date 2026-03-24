import styled from "styled-components";

// ── Layout ────────────────────────────────────────────────────────────────────

export const Container = styled.div`
  padding: 16px;
  font-family: Arial, sans-serif;
  font-size: 13px;
`;

// ── Toolbar ───────────────────────────────────────────────────────────────────

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
`;

export const SearchInput = styled.input`
  padding: 6px 10px;
  border: 1px solid #d0d0d0;
  border-radius: 4px;
  font-size: 13px;
  width: 260px;
  outline: none;
  transition: border-color 0.15s;

  &:focus {
    border-color: #4a90d9;
  }
`;

// ── Table wrapper ─────────────────────────────────────────────────────────────

export const TableWrapper = styled.div`
  overflow-x: auto;
  overflow-y: auto;
  max-height: 600px;
  border: 1px solid #d0d0d0;
  border-radius: 4px;

  @media print {
    max-height: none;
    overflow: visible;
    border: none;
  }
`;

// ── Table base ────────────────────────────────────────────────────────────────

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;

  thead {
    position: sticky;
    top: 0;
    z-index: 2;
  }
`;

// ── Header cells ──────────────────────────────────────────────────────────────

export const Th = styled.th`
  background-color: #f5f5f5;
  border: 1px solid #d0d0d0;
  padding: 8px 10px;
  text-align: center;
  font-weight: 600;
  color: #333;
  white-space: normal;
  word-break: normal;
  overflow-wrap: break-word;
  line-height: 1.3;
  user-select: none;
  min-width: 80px;
  cursor: ${({ $sortable }) => ($sortable ? "pointer" : "default")};

  &:hover {
    background-color: ${({ $sortable }) => ($sortable ? "#e8e8e8" : "#f5f5f5")};
  }
`;

export const HeaderContent = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  justify-content: center;
`;

export const SortIconSpan = styled.span`
  font-size: 11px;
  color: ${({ $active }) => ($active ? "#4a90d9" : "#aaa")};
  flex-shrink: 0;
`;

// ── Checkbox column header ────────────────────────────────────────────────────

export const CheckboxTh = styled.th`
  width: 36px;
  text-align: center;
  padding: 6px;
  background-color: #f5f5f5;
  border: 1px solid #d0d0d0;
  user-select: none;
`;

// ── Filter row ────────────────────────────────────────────────────────────────

export const FilterTh = styled.th`
  background-color: #fafafa;
  border: 1px solid #d0d0d0;
  padding: 4px 6px;
`;

export const FilterInput = styled.input`
  width: 100%;
  padding: 4px 6px;
  border: 1px solid #d0d0d0;
  border-radius: 3px;
  font-size: 12px;
  box-sizing: border-box;
  outline: none;

  &:focus {
    border-color: #4a90d9;
  }
`;

// ── Body cells ────────────────────────────────────────────────────────────────

export const Td = styled.td`
  border: 1px solid #e0e0e0;
  padding: 6px 10px;
  text-align: center;
  color: #444;
  max-width: 140px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  position: relative;
  cursor: default;

  &:first-child {
    text-align: left;
  }
`;

export const CheckboxTd = styled.td`
  width: 36px;
  text-align: center;
  padding: 6px;
  border: 1px solid #e0e0e0;
  position: relative;
  cursor: default;
`;

// ── Row colours ───────────────────────────────────────────────────────────────

export const TableRow = styled.tr`
  background-color: ${({ $selected, $even }) =>
    $selected ? "#ddeeff" : $even ? "#ffffff" : "#f9f9f9"};

  &:hover {
    background-color: ${({ $selected }) => ($selected ? "#ddeeff" : "#eef4fb")};
  }
`;

// ── Empty state ───────────────────────────────────────────────────────────────

export const EmptyTd = styled.td`
  text-align: center;
  padding: 32px;
  color: #888;
  font-style: italic;
  border: 1px solid #e0e0e0;
`;

// ── Tooltip ───────────────────────────────────────────────────────────────────

export const TooltipBox = styled.span`
  display: none;
  position: absolute;
  top: calc(100% + 4px);
  left: 50%;
  transform: translateX(-50%);
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 4px 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  font-size: 12px;
  color: #333;
  z-index: 10;
  pointer-events: none;
  white-space: nowrap;
`;

export const TooltipWrapper = styled.span`
  position: relative;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &:hover ${TooltipBox} {
    display: block;
  }
`;

// ── Pagination ────────────────────────────────────────────────────────────────

export const PaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
  flex-wrap: wrap;
`;

export const PageInfo = styled.span`
  color: #666;
  font-size: 12px;
  min-width: 90px;
`;

export const PageControls = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const PageBtn = styled.button`
  padding: 4px 8px;
  border: 1px solid #d0d0d0;
  border-radius: 3px;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
  line-height: 1;
  transition:
    background 0.15s,
    border-color 0.15s;

  &:hover:not(:disabled) {
    background: #eef4fb;
    border-color: #4a90d9;
  }

  &:disabled {
    opacity: 0.4;
    cursor: default;
  }
`;

export const PageNumber = styled.span`
  padding: 0 8px;
  font-size: 12px;
  color: #555;
  white-space: nowrap;
`;

export const PageSizeLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #555;
  margin-left: auto;
`;

export const PageSizeSelect = styled.select`
  padding: 3px 6px;
  border: 1px solid #d0d0d0;
  border-radius: 3px;
  font-size: 12px;
  cursor: pointer;
`;

// ── Status messages ───────────────────────────────────────────────────────────

export const StatusMessage = styled.div`
  padding: 32px;
  text-align: center;
  font-size: 14px;
  color: ${({ $error }) => ($error ? "#c0392b" : "#666")};
`;

// ── Action buttons bar ────────────────────────────────────────────────────────

export const ActionBar = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
`;

export const PrintBtn = styled.button`
  padding: 6px 18px;
  border: 1px solid #b0b0b0;
  border-radius: 3px;
  background: #f5f5f5;
  color: #333;
  font-size: 13px;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s;

  &:hover {
    background: #e8e8e8;
    border-color: #888;
  }
`;

export const OkBtn = styled.button`
  padding: 6px 18px;
  border: 1px solid #c0392b;
  border-radius: 3px;
  background: #c0392b;
  color: #fff;
  font-size: 13px;
  cursor: pointer;
  transition:
    background 0.15s,
    border-color 0.15s;

  &:hover {
    background: #a93226;
    border-color: #a93226;
  }
`;

// ── Success notification banner ───────────────────────────────────────────────

export const SuccessBanner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #dff0d8;
  border: 1px solid #b2d8a4;
  border-radius: 4px;
  padding: 10px 16px;
  margin-bottom: 12px;
  font-size: 13px;
  color: #3c763d;
`;

export const BannerText = styled.span`
  display: flex;
  flex-direction: column;
  gap: 2px;

  strong {
    font-weight: 600;
  }
`;

export const BannerClose = styled.button`
  background: none;
  border: none;
  color: #3c763d;
  font-size: 16px;
  cursor: pointer;
  padding: 0 4px;
  line-height: 1;
  flex-shrink: 0;

  &:hover {
    opacity: 0.7;
  }
`;

// ── Print helpers ──────────────────────────────────────────────────────────────

export const ScreenOnly = styled.div`
  @media print {
    display: none;
  }
`;

export const PrintOnly = styled.div`
  display: none;

  @media print {
    display: block;
  }
`;

export const PrintTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 11px;
  font-family: Arial, sans-serif;

  th,
  td {
    border: 1px solid #ccc;
    padding: 4px 8px;
    text-align: center;
  }

  th {
    background-color: #f5f5f5;
    font-weight: 600;
    white-space: normal;
    word-break: normal;
  }

  td:first-child {
    text-align: left;
  }

  tr:nth-child(even) td {
    background-color: #f9f9f9;
  }
`;
